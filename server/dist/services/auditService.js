"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = require("../utils/logger");
exports.auditService = {
    /**
     * Records an administrative action in the audit log
     */
    async logAction(params) {
        try {
            await prisma_1.prisma.auditLog.create({
                data: {
                    adminUserId: params.adminUserId,
                    action: params.action,
                    targetType: params.targetType,
                    targetId: params.targetId,
                    metadata: params.metadata ? JSON.stringify(params.metadata) : null,
                },
            });
            logger_1.logger.info(`[Audit] Action "${params.action}" recorded by admin ${params.adminUserId} on ${params.targetType}:${params.targetId}`);
        }
        catch (err) {
            logger_1.logger.error('[Audit] Failed to record audit log:', err.message);
        }
    },
    /**
     * Retrieves audit logs with pagination and optional filters
     */
    async getAuditLogs(page = 1, limit = 20, action, targetType) {
        const skip = (page - 1) * limit;
        const where = {};
        if (action)
            where.action = action;
        if (targetType)
            where.targetType = targetType;
        const [total, logs] = await Promise.all([
            prisma_1.prisma.auditLog.count({ where }),
            prisma_1.prisma.auditLog.findMany({
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
