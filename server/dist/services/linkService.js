"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkService = void 0;
const prisma_1 = require("../config/prisma");
const codeGenerator_1 = require("../utils/codeGenerator");
const urlValidator_1 = require("../utils/urlValidator");
const cacheService_1 = require("./cacheService");
const qrService_1 = require("./qrService");
const env_1 = require("../config/env");
exports.linkService = {
    /**
     * Creates a new short link with optional custom alias, campaign attribution, and QR code
     */
    async createLink(userId, data) {
        // 1. Validate destination URL
        const urlValidation = await (0, urlValidator_1.validateDestinationUrl)(data.originalUrl);
        if (!urlValidation.isValid) {
            throw new Error(urlValidation.error || 'Invalid destination URL.');
        }
        const cleanUrl = urlValidation.normalizedUrl || data.originalUrl.trim();
        // 2. Resolve short code or custom alias
        let shortCode = '';
        let customAlias = null;
        if (data.customAlias && data.customAlias.trim() !== '') {
            const alias = data.customAlias.trim();
            // Check collision in DB
            const existing = await prisma_1.prisma.link.findFirst({
                where: {
                    OR: [{ shortCode: alias }, { customAlias: alias }],
                },
            });
            if (existing) {
                throw new Error(`The custom alias "${alias}" is already taken. Please choose another.`);
            }
            shortCode = alias;
            customAlias = alias;
        }
        else {
            // Generate a collision-free short code
            let isUnique = false;
            let attempts = 0;
            while (!isUnique && attempts < 10) {
                attempts++;
                const candidate = (0, codeGenerator_1.generateShortCode)(6);
                const existing = await prisma_1.prisma.link.findFirst({
                    where: {
                        OR: [{ shortCode: candidate }, { customAlias: candidate }],
                    },
                });
                if (!existing) {
                    shortCode = candidate;
                    isUnique = true;
                }
            }
            if (!isUnique) {
                throw new Error('Unable to generate unique short code. Please try again.');
            }
        }
        // 3. Verify campaign ownership if campaignId provided
        if (data.campaignId) {
            const campaign = await prisma_1.prisma.campaign.findFirst({
                where: { id: data.campaignId, userId },
            });
            if (!campaign) {
                throw new Error('Specified campaign not found or does not belong to you.');
            }
        }
        // 4. Parse expiration date if provided
        let expiresAtDate = null;
        if (data.expiresAt) {
            expiresAtDate = new Date(data.expiresAt);
            if (isNaN(expiresAtDate.getTime()) || expiresAtDate <= new Date()) {
                throw new Error('Expiration date must be a valid future date.');
            }
        }
        // 5. Create Link record
        const link = await prisma_1.prisma.link.create({
            data: {
                userId,
                campaignId: data.campaignId || null,
                shortCode,
                customAlias,
                originalUrl: cleanUrl,
                title: data.title?.trim() || null,
                status: 'ACTIVE',
                expiresAt: expiresAtDate,
            },
            include: {
                campaign: { select: { id: true, name: true } },
            },
        });
        // 6. If campaign link metadata provided, create campaign_links record
        if (data.campaignId) {
            await prisma_1.prisma.campaignLink.create({
                data: {
                    campaignId: data.campaignId,
                    linkId: link.id,
                    channel: data.channel?.trim() || 'Direct Link',
                    source: data.source?.trim() || 'web',
                    medium: data.medium?.trim() || 'referral',
                },
            });
        }
        // 7. Generate QR code record if requested
        if (data.generateQr !== false) {
            await qrService_1.qrService.getOrCreateQrCode(link.id, 'PNG');
        }
        return this.formatLinkResponse(link);
    },
    /**
     * Retrieves links for a user with pagination, search, and status filtering
     */
    async getUserLinks(userId, query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (query.campaignId) {
            where.campaignId = query.campaignId;
        }
        if (query.search) {
            const s = query.search.trim();
            where.OR = [
                { title: { contains: s } },
                { shortCode: { contains: s } },
                { customAlias: { contains: s } },
                { originalUrl: { contains: s } },
            ];
        }
        if (query.status && query.status !== 'ALL') {
            if (query.status === 'EXPIRED') {
                where.OR = [
                    { status: 'EXPIRED' },
                    { expiresAt: { lte: new Date() } },
                ];
            }
            else {
                where.status = query.status;
            }
        }
        const [total, links] = await Promise.all([
            prisma_1.prisma.link.count({ where }),
            prisma_1.prisma.link.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    campaign: { select: { id: true, name: true } },
                    campaignLinks: true,
                    qrCodes: { select: { id: true, format: true, downloadCount: true } },
                    _count: {
                        select: {
                            events: true,
                        },
                    },
                },
            }),
        ]);
        // Format links and calculate live lifecycle status
        const formattedLinks = links.map((link) => {
            return this.formatLinkResponse(link);
        });
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            links: formattedLinks,
        };
    },
    /**
     * Retrieves a single link by ID with authorization verification
     */
    async getLinkById(linkId, userId, userRole = 'USER') {
        const link = await prisma_1.prisma.link.findUnique({
            where: { id: linkId },
            include: {
                campaign: { select: { id: true, name: true } },
                campaignLinks: true,
                qrCodes: true,
                _count: {
                    select: {
                        events: true,
                    },
                },
            },
        });
        if (!link) {
            throw new Error('Link not found.');
        }
        // Verify ownership or ADMIN role
        if (link.userId !== userId && userRole !== 'ADMIN') {
            const err = new Error('Forbidden: You do not have permission to access this link.');
            err.statusCode = 403;
            throw err;
        }
        return this.formatLinkResponse(link);
    },
    /**
     * Updates an existing link's destination, title, status, or expiration
     */
    async updateLink(linkId, userId, userRole, data) {
        const existing = await prisma_1.prisma.link.findUnique({ where: { id: linkId } });
        if (!existing) {
            throw new Error('Link not found.');
        }
        if (existing.userId !== userId && userRole !== 'ADMIN') {
            const err = new Error('Forbidden: You do not have permission to modify this link.');
            err.statusCode = 403;
            throw err;
        }
        const updateData = {};
        if (data.originalUrl && data.originalUrl !== existing.originalUrl) {
            const validation = await (0, urlValidator_1.validateDestinationUrl)(data.originalUrl);
            if (!validation.isValid) {
                throw new Error(validation.error || 'Invalid destination URL.');
            }
            updateData.originalUrl = validation.normalizedUrl || data.originalUrl.trim();
        }
        if (data.title !== undefined) {
            updateData.title = data.title ? data.title.trim() : null;
        }
        if (data.status) {
            updateData.status = data.status;
        }
        if (data.expiresAt !== undefined) {
            if (data.expiresAt === null || data.expiresAt === '') {
                updateData.expiresAt = null;
            }
            else {
                const expDate = new Date(data.expiresAt);
                if (isNaN(expDate.getTime())) {
                    throw new Error('Invalid expiration date format.');
                }
                updateData.expiresAt = expDate;
            }
        }
        if (data.campaignId !== undefined) {
            updateData.campaignId = data.campaignId;
        }
        const updated = await prisma_1.prisma.link.update({
            where: { id: linkId },
            data: updateData,
            include: {
                campaign: { select: { id: true, name: true } },
                campaignLinks: true,
                qrCodes: true,
            },
        });
        // Invalidate Redis cache
        await cacheService_1.cacheService.invalidateLink(existing.shortCode);
        if (existing.customAlias) {
            await cacheService_1.cacheService.invalidateLink(existing.customAlias);
        }
        return this.formatLinkResponse(updated);
    },
    /**
     * Deletes a link and invalidates cache
     */
    async deleteLink(linkId, userId, userRole) {
        const existing = await prisma_1.prisma.link.findUnique({ where: { id: linkId } });
        if (!existing) {
            throw new Error('Link not found.');
        }
        if (existing.userId !== userId && userRole !== 'ADMIN') {
            const err = new Error('Forbidden: You do not have permission to delete this link.');
            err.statusCode = 403;
            throw err;
        }
        // Invalidate Redis cache
        await cacheService_1.cacheService.invalidateLink(existing.shortCode);
        if (existing.customAlias) {
            await cacheService_1.cacheService.invalidateLink(existing.customAlias);
        }
        await prisma_1.prisma.link.delete({ where: { id: linkId } });
        return { success: true, message: 'Link successfully deleted.' };
    },
    /**
     * Sets link status to DISABLED
     */
    async disableLink(linkId, userId, userRole) {
        return this.updateLink(linkId, userId, userRole, { status: 'DISABLED' });
    },
    /**
     * Sets link status to ACTIVE
     */
    async enableLink(linkId, userId, userRole) {
        return this.updateLink(linkId, userId, userRole, { status: 'ACTIVE' });
    },
    /**
     * Helper to format link response with computed lifecycle status and canonical URLs
     */
    formatLinkResponse(link) {
        const now = new Date();
        let effectiveStatus = link.status;
        // Check expiration dynamically
        if (link.status === 'ACTIVE' && link.expiresAt && new Date(link.expiresAt) <= now) {
            effectiveStatus = 'EXPIRED';
        }
        const baseUrl = env_1.env.APP_URL.replace(/\/$/, '');
        const shortUrl = `${baseUrl}/${link.shortCode}`;
        return {
            id: link.id,
            userId: link.userId,
            campaignId: link.campaignId,
            campaignName: link.campaign?.name || null,
            shortCode: link.shortCode,
            customAlias: link.customAlias,
            originalUrl: link.originalUrl,
            title: link.title,
            status: effectiveStatus,
            rawStatus: link.status,
            expiresAt: link.expiresAt,
            lastClickedAt: link.lastClickedAt,
            createdAt: link.createdAt,
            updatedAt: link.updatedAt,
            shortUrl,
            totalClicks: link._count?.events || 0,
            hasQr: (link.qrCodes && link.qrCodes.length > 0) || false,
            campaignLinks: link.campaignLinks || [],
        };
    },
};
