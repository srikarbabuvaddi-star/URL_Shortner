"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignQuerySchema = exports.updateCampaignSchema = exports.createCampaignSchema = void 0;
const zod_1 = require("zod");
exports.createCampaignSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Campaign name must be at least 2 characters').max(100, 'Campaign name cannot exceed 100 characters'),
    description: zod_1.z.string().max(500, 'Description cannot exceed 500 characters').optional().or(zod_1.z.literal('')),
    status: zod_1.z.enum(['ACTIVE', 'ARCHIVED']).default('ACTIVE'),
});
exports.updateCampaignSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    description: zod_1.z.string().max(500).optional().nullable(),
    status: zod_1.z.enum(['ACTIVE', 'ARCHIVED']).optional(),
});
exports.campaignQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ACTIVE', 'ARCHIVED', 'ALL']).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
