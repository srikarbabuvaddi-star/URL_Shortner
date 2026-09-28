"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const prisma_1 = require("../config/prisma");
const cacheService_1 = require("./cacheService");
const redis_1 = require("../config/redis");
const queueService_1 = require("./queueService");
const auditService_1 = require("./auditService");
const urlValidator_1 = require("../utils/urlValidator");
exports.adminService = {
    /**
     * Platform-level overview statistics
     */
    async getOverviewStats() {
        const now = new Date();
        const [totalUsers, activeUsers, suspendedUsers, totalLinks, blockedLinks, disabledLinks, totalCampaigns, totalEvents, botEvents, qrVisits,] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.user.count({ where: { status: 'ACTIVE' } }),
            prisma_1.prisma.user.count({ where: { status: 'SUSPENDED' } }),
            prisma_1.prisma.link.count(),
            prisma_1.prisma.link.count({ where: { status: 'BLOCKED' } }),
            prisma_1.prisma.link.count({ where: { status: 'DISABLED' } }),
            prisma_1.prisma.campaign.count(),
            prisma_1.prisma.analyticsEvent.count(),
            prisma_1.prisma.analyticsEvent.count({ where: { isBot: true } }),
            prisma_1.prisma.analyticsEvent.count({
                where: {
                    link: {
                        OR: [
                            { qrCodes: { some: {} } },
                            { campaignLinks: { some: { channel: { contains: 'QR' } } } },
                        ],
                    },
                },
            }),
        ]);
        const expiredLinks = await prisma_1.prisma.link.count({
            where: {
                OR: [
                    { status: 'EXPIRED' },
                    { expiresAt: { lte: now } },
                ],
            },
        });
        const activeLinks = Math.max(0, totalLinks - blockedLinks - disabledLinks - expiredLinks);
        return {
            users: {
                total: totalUsers,
                active: activeUsers,
                suspended: suspendedUsers,
            },
            links: {
                total: totalLinks,
                active: activeLinks,
                disabled: disabledLinks,
                expired: expiredLinks,
                blocked: blockedLinks,
            },
            traffic: {
                totalEvents,
                humanEvents: totalEvents - botEvents,
                botEvents,
                qrAttributedVisits: qrVisits,
            },
            campaigns: {
                total: totalCampaigns,
            },
        };
    },
    /**
     * Admin user listing with search and pagination
     */
    async getUsers(page = 1, limit = 10, search, status) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { name: { contains: search.trim() } },
                { email: { contains: search.trim() } },
            ];
        }
        const [total, users] = await Promise.all([
            prisma_1.prisma.user.count({ where }),
            prisma_1.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    _count: {
                        select: {
                            links: true,
                            campaigns: true,
                        },
                    },
                },
            }),
        ]);
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            users,
        };
    },
    /**
     * Suspend a user account
     */
    async suspendUser(adminId, targetUserId, reason) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: targetUserId } });
        if (!user) {
            throw new Error('User not found.');
        }
        if (user.role === 'ADMIN') {
            throw new Error('Cannot suspend another administrator account.');
        }
        const updated = await prisma_1.prisma.user.update({
            where: { id: targetUserId },
            data: { status: 'SUSPENDED' },
        });
        await auditService_1.auditService.logAction({
            adminUserId: adminId,
            action: 'USER_SUSPEND',
            targetType: 'USER',
            targetId: targetUserId,
            metadata: { reason: reason || 'Suspended by admin' },
        });
        return updated;
    },
    /**
     * Reactivate a suspended user
     */
    async reactivateUser(adminId, targetUserId) {
        const updated = await prisma_1.prisma.user.update({
            where: { id: targetUserId },
            data: { status: 'ACTIVE' },
        });
        await auditService_1.auditService.logAction({
            adminUserId: adminId,
            action: 'USER_REACTIVATE',
            targetType: 'USER',
            targetId: targetUserId,
            metadata: { reason: 'Reactivated by admin' },
        });
        return updated;
    },
    /**
     * Admin links listing platform-wide
     */
    async getLinks(page = 1, limit = 10, search, status) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { shortCode: { contains: search.trim() } },
                { customAlias: { contains: search.trim() } },
                { originalUrl: { contains: search.trim() } },
                { title: { contains: search.trim() } },
            ];
        }
        const [total, links] = await Promise.all([
            prisma_1.prisma.link.count({ where }),
            prisma_1.prisma.link.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    campaign: { select: { id: true, name: true } },
                    _count: { select: { events: true } },
                },
            }),
        ]);
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            links: links.map((l) => ({
                ...l,
                totalClicks: l._count.events,
            })),
        };
    },
    /**
     * Blocks a link due to abuse or phishing
     */
    async blockLink(adminId, linkId, reason) {
        const link = await prisma_1.prisma.link.findUnique({ where: { id: linkId } });
        if (!link) {
            throw new Error('Link not found.');
        }
        const updated = await prisma_1.prisma.link.update({
            where: { id: linkId },
            data: { status: 'BLOCKED' },
        });
        // Invalidate cache immediately
        await cacheService_1.cacheService.invalidateLink(link.shortCode);
        if (link.customAlias) {
            await cacheService_1.cacheService.invalidateLink(link.customAlias);
        }
        await auditService_1.auditService.logAction({
            adminUserId: adminId,
            action: 'LINK_BLOCK',
            targetType: 'LINK',
            targetId: linkId,
            metadata: { reason: reason || 'Violation of terms of service', shortCode: link.shortCode },
        });
        return updated;
    },
    /**
     * Unblocks a link
     */
    async unblockLink(adminId, linkId) {
        const link = await prisma_1.prisma.link.findUnique({ where: { id: linkId } });
        if (!link) {
            throw new Error('Link not found.');
        }
        const updated = await prisma_1.prisma.link.update({
            where: { id: linkId },
            data: { status: 'ACTIVE' },
        });
        await cacheService_1.cacheService.invalidateLink(link.shortCode);
        if (link.customAlias) {
            await cacheService_1.cacheService.invalidateLink(link.customAlias);
        }
        await auditService_1.auditService.logAction({
            adminUserId: adminId,
            action: 'LINK_UNBLOCK',
            targetType: 'LINK',
            targetId: linkId,
            metadata: { shortCode: link.shortCode },
        });
        return updated;
    },
    /**
     * Blocked domains management
     */
    async getBlockedDomains() {
        return prisma_1.prisma.blockedDomain.findMany({
            orderBy: { createdAt: 'desc' },
        });
    },
    async addBlockedDomain(adminId, domain, reason) {
        const cleanDomain = domain.toLowerCase().trim();
        const existing = await prisma_1.prisma.blockedDomain.findUnique({
            where: { domain: cleanDomain },
        });
        if (existing) {
            throw new Error(`Domain "${cleanDomain}" is already blocked.`);
        }
        const created = await prisma_1.prisma.blockedDomain.create({
            data: {
                domain: cleanDomain,
                reason: reason || 'Admin blocked domain',
            },
        });
        await (0, urlValidator_1.invalidateBlockedDomainCache)(cleanDomain);
        await auditService_1.auditService.logAction({
            adminUserId: adminId,
            action: 'DOMAIN_BLOCK',
            targetType: 'DOMAIN',
            targetId: created.id,
            metadata: { domain: cleanDomain, reason },
        });
        return created;
    },
    async removeBlockedDomain(adminId, domainId) {
        const record = await prisma_1.prisma.blockedDomain.findUnique({ where: { id: domainId } });
        if (!record) {
            throw new Error('Blocked domain record not found.');
        }
        await prisma_1.prisma.blockedDomain.delete({ where: { id: domainId } });
        await (0, urlValidator_1.invalidateBlockedDomainCache)(record.domain);
        await auditService_1.auditService.logAction({
            adminUserId: adminId,
            action: 'DOMAIN_UNBLOCK',
            targetType: 'DOMAIN',
            targetId: domainId,
            metadata: { domain: record.domain },
        });
        return { success: true, message: `Domain "${record.domain}" unblocked.` };
    },
    /**
     * System health status check
     */
    async getSystemHealth() {
        const startTime = Date.now();
        let dbStatus = 'healthy';
        let dbLatencyMs = 0;
        try {
            await prisma_1.prisma.$queryRaw `SELECT 1`;
            dbLatencyMs = Date.now() - startTime;
        }
        catch {
            dbStatus = 'degraded';
        }
        const cacheStats = await redis_1.cache.getStats();
        return {
            status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            uptimeSeconds: Math.floor(process.uptime()),
            database: {
                status: dbStatus,
                latencyMs: dbLatencyMs,
                provider: 'SQLite (local) / PostgreSQL (production)',
            },
            redis: {
                connected: cacheStats.redisConnected,
                mode: cacheStats.redisConnected ? 'Redis Distributed' : 'In-Memory Fallback',
                inMemoryKeys: cacheStats.inMemoryKeys,
            },
            queue: {
                status: 'active',
                pendingJobs: queueService_1.queueService.getQueueLength(),
            },
            memory: {
                rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
                heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            },
        };
    },
};
