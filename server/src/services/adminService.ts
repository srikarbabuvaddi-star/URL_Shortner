import { prisma } from '../config/prisma';
import { cacheService } from './cacheService';
import { cache } from '../config/redis';
import { queueService } from './queueService';
import { auditService } from './auditService';
import { invalidateBlockedDomainCache } from '../utils/urlValidator';

export const adminService = {
  /**
   * Platform-level overview statistics
   */
  async getOverviewStats() {
    const now = new Date();

    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalLinks,
      blockedLinks,
      disabledLinks,
      totalCampaigns,
      totalEvents,
      botEvents,
      qrVisits,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
      prisma.link.count(),
      prisma.link.count({ where: { status: 'BLOCKED' } }),
      prisma.link.count({ where: { status: 'DISABLED' } }),
      prisma.campaign.count(),
      prisma.analyticsEvent.count(),
      prisma.analyticsEvent.count({ where: { isBot: true } }),
      prisma.analyticsEvent.count({
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

    const expiredLinks = await prisma.link.count({
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
  async getUsers(page = 1, limit = 10, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

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
      prisma.user.count({ where }),
      prisma.user.findMany({
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
  async suspendUser(adminId: string, targetUserId: string, reason?: string) {
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.role === 'ADMIN') {
      throw new Error('Cannot suspend another administrator account.');
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { status: 'SUSPENDED' },
    });

    await auditService.logAction({
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
  async reactivateUser(adminId: string, targetUserId: string) {
    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { status: 'ACTIVE' },
    });

    await auditService.logAction({
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
  async getLinks(page = 1, limit = 10, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

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
      prisma.link.count({ where }),
      prisma.link.findMany({
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
  async blockLink(adminId: string, linkId: string, reason?: string) {
    const link = await prisma.link.findUnique({ where: { id: linkId } });
    if (!link) {
      throw new Error('Link not found.');
    }

    const updated = await prisma.link.update({
      where: { id: linkId },
      data: { status: 'BLOCKED' },
    });

    // Invalidate cache immediately
    await cacheService.invalidateLink(link.shortCode);
    if (link.customAlias) {
      await cacheService.invalidateLink(link.customAlias);
    }

    await auditService.logAction({
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
  async unblockLink(adminId: string, linkId: string) {
    const link = await prisma.link.findUnique({ where: { id: linkId } });
    if (!link) {
      throw new Error('Link not found.');
    }

    const updated = await prisma.link.update({
      where: { id: linkId },
      data: { status: 'ACTIVE' },
    });

    await cacheService.invalidateLink(link.shortCode);
    if (link.customAlias) {
      await cacheService.invalidateLink(link.customAlias);
    }

    await auditService.logAction({
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
    return prisma.blockedDomain.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async addBlockedDomain(adminId: string, domain: string, reason?: string) {
    const cleanDomain = domain.toLowerCase().trim();

    const existing = await prisma.blockedDomain.findUnique({
      where: { domain: cleanDomain },
    });

    if (existing) {
      throw new Error(`Domain "${cleanDomain}" is already blocked.`);
    }

    const created = await prisma.blockedDomain.create({
      data: {
        domain: cleanDomain,
        reason: reason || 'Admin blocked domain',
      },
    });

    await invalidateBlockedDomainCache(cleanDomain);

    await auditService.logAction({
      adminUserId: adminId,
      action: 'DOMAIN_BLOCK',
      targetType: 'DOMAIN',
      targetId: created.id,
      metadata: { domain: cleanDomain, reason },
    });

    return created;
  },

  async removeBlockedDomain(adminId: string, domainId: string) {
    const record = await prisma.blockedDomain.findUnique({ where: { id: domainId } });
    if (!record) {
      throw new Error('Blocked domain record not found.');
    }

    await prisma.blockedDomain.delete({ where: { id: domainId } });
    await invalidateBlockedDomainCache(record.domain);

    await auditService.logAction({
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
      await prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - startTime;
    } catch {
      dbStatus = 'degraded';
    }

    const cacheStats = await cache.getStats();

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
        pendingJobs: queueService.getQueueLength(),
      },
      memory: {
        rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      },
    };
  },
};
