"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkQuerySchema = exports.updateLinkSchema = exports.createLinkSchema = void 0;
const zod_1 = require("zod");
const codeGenerator_1 = require("../utils/codeGenerator");
exports.createLinkSchema = zod_1.z.object({
    originalUrl: zod_1.z.string().min(1, 'Original destination URL is required'),
    customAlias: zod_1.z
        .string()
        .min(3, 'Custom alias must be at least 3 characters')
        .max(50, 'Custom alias cannot exceed 50 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Custom alias can only contain letters, numbers, hyphens, and underscores')
        .refine((alias) => !(0, codeGenerator_1.isReservedSlug)(alias), {
        message: 'This alias is reserved for system routes and cannot be used',
    })
        .optional()
        .or(zod_1.z.literal('')),
    title: zod_1.z.string().max(150, 'Title cannot exceed 150 characters').optional().or(zod_1.z.literal('')),
    campaignId: zod_1.z.string().uuid('Invalid campaign identifier').optional().or(zod_1.z.literal('')),
    channel: zod_1.z.string().max(50).optional().or(zod_1.z.literal('')),
    source: zod_1.z.string().max(50).optional().or(zod_1.z.literal('')),
    medium: zod_1.z.string().max(50).optional().or(zod_1.z.literal('')),
    expiresAt: zod_1.z.string().datetime().optional().nullable().or(zod_1.z.literal('')),
    generateQr: zod_1.z.boolean().optional().default(true),
});
exports.updateLinkSchema = zod_1.z.object({
    originalUrl: zod_1.z.string().min(1).optional(),
    title: zod_1.z.string().max(150).optional().nullable(),
    status: zod_1.z.enum(['ACTIVE', 'DISABLED']).optional(),
    expiresAt: zod_1.z.string().datetime().optional().nullable(),
    campaignId: zod_1.z.string().uuid().optional().nullable(),
});
exports.linkQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ACTIVE', 'DISABLED', 'EXPIRED', 'BLOCKED', 'ALL']).optional(),
    campaignId: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
