"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignService = void 0;
const prisma_1 = require("../config/prisma");
exports.campaignService = {
    /**
     * Creates a new campaign
     */
    async createCampaign(userId, data) {
        const campaign = await prisma_1.prisma.campaign.create({
            data: {
                userId,
                name: data.name.trim(),
                description: data.description?.trim() || null,
                status: data.status || 'ACTIVE',
            },
            include: {
                _count: { select: { links: true } },
            },
        });
        return campaign;
    },
    /**
     * Lists campaigns for a user with link counts and total clicks
     */
    async getUserCampaigns(userId, query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (query.status && query.status !== 'ALL') {
            where.status = query.status;
        }
        if (query.search) {
            where.name = { contains: query.search.trim() };
        }
        const [total, campaigns] = await Promise.all([
            prisma_1.prisma.campaign.count({ where }),
            prisma_1.prisma.campaign.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: {
                            links: true,
                            events: true,
                        },
                    },
                    links: {
                        select: {
                            id: true,
                            shortCode: true,
                            title: true,
                            status: true,
                            lastClickedAt: true,
                            _count: { select: { events: true } },
                        },
                        take: 5,
                    },
                },
            }),
        ]);
        const formatted = campaigns.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            status: c.status,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            totalLinks: c._count.links,
            totalClicks: c._count.events,
            recentLinks: c.links,
        }));
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            campaigns: formatted,
        };
    },
    /**
     * Retrieves single campaign by ID with channels, links, and click attribution
     */
    async getCampaignById(campaignId, userId, userRole = 'USER') {
        const campaign = await prisma_1.prisma.campaign.findUnique({
            where: { id: campaignId },
            include: {
                links: {
                    include: {
                        campaignLinks: true,
                        qrCodes: true,
                        _count: { select: { events: true } },
                    },
                },
                _count: { select: { links: true, events: true } },
            },
        });
        if (!campaign) {
            throw new Error('Campaign not found.');
        }
        if (campaign.userId !== userId && userRole !== 'ADMIN') {
            const err = new Error('Forbidden: You do not have access to this campaign.');
            err.statusCode = 403;
            throw err;
        }
        return campaign;
    },
    /**
     * Updates campaign metadata
     */
    async updateCampaign(campaignId, userId, userRole, data) {
        const existing = await prisma_1.prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!existing) {
            throw new Error('Campaign not found.');
        }
        if (existing.userId !== userId && userRole !== 'ADMIN') {
            const err = new Error('Forbidden: You do not have permission to modify this campaign.');
            err.statusCode = 403;
            throw err;
        }
        const updateData = {};
        if (data.name)
            updateData.name = data.name.trim();
        if (data.description !== undefined)
            updateData.description = data.description ? data.description.trim() : null;
        if (data.status)
            updateData.status = data.status;
        return prisma_1.prisma.campaign.update({
            where: { id: campaignId },
            data: updateData,
        });
    },
    /**
     * Deletes campaign
     */
    async deleteCampaign(campaignId, userId, userRole) {
        const existing = await prisma_1.prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!existing) {
            throw new Error('Campaign not found.');
        }
        if (existing.userId !== userId && userRole !== 'ADMIN') {
            const err = new Error('Forbidden: You do not have permission to delete this campaign.');
            err.statusCode = 403;
            throw err;
        }
        // Set campaignId to null on associated links first
        await prisma_1.prisma.link.updateMany({
            where: { campaignId },
            data: { campaignId: null },
        });
        await prisma_1.prisma.campaign.delete({ where: { id: campaignId } });
        return { success: true, message: 'Campaign deleted successfully.' };
    },
};
