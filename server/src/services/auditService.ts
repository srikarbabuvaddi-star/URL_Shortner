import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

export interface CreateAuditLogParams {
  adminUserId: string;
  action: string;
  targetType: 'USER' | 'LINK' | 'DOMAIN' | 'CAMPAIGN' | 'SYSTEM';
  targetId: string;
  metadata?: any;
}

export const auditService = {
  /**
   * Records an administrative action in the audit log
   */
  async logAction(params: CreateAuditLogParams): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          adminUserId: params.adminUserId,
          action: params.action,
          targetType: params.targetType,
          targetId: params.targetId,
          metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        },
      });
      logger.info(`[Audit] Action "${params.action}" recorded by admin ${params.adminUserId} on ${params.targetType}:${params.targetId}`);
    } catch (err: any) {
      logger.error('[Audit] Failed to record audit log:', err.message);
    }
  },

  /**
   * Retrieves audit logs with pagination and optional filters
   */
  async getAuditLogs(page = 1, limit = 20, action?: string, targetType?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (action) where.action = action;
    if (targetType) where.targetType = targetType;

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          adminUser: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      logs,
    };
  },
};
