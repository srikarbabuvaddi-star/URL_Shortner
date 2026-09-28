"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLinkQuerySchema = exports.adminUserQuerySchema = exports.addBlockedDomainSchema = exports.suspendUserSchema = exports.blockLinkSchema = void 0;
const zod_1 = require("zod");
exports.blockLinkSchema = zod_1.z.object({
    reason: zod_1.z.string().max(200).optional(),
});
exports.suspendUserSchema = zod_1.z.object({
    reason: zod_1.z.string().max(200).optional(),
});
exports.addBlockedDomainSchema = zod_1.z.object({
    domain: zod_1.z
        .string()
        .min(3, 'Domain must be at least 3 characters')
        .max(150)
        .toLowerCase()
        .transform((val) => val.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]),
    reason: zod_1.z.string().max(200).optional(),
});
exports.adminUserQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    role: zod_1.z.enum(['USER', 'ADMIN', 'ALL']).optional(),
    status: zod_1.z.enum(['ACTIVE', 'SUSPENDED', 'ALL']).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
exports.adminLinkQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ACTIVE', 'DISABLED', 'EXPIRED', 'BLOCKED', 'ALL']).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
