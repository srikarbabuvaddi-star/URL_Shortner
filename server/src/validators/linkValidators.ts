import { z } from 'zod';
import { isReservedSlug } from '../utils/codeGenerator';

export const createLinkSchema = z.object({
  originalUrl: z.string().min(1, 'Original destination URL is required'),
  customAlias: z
    .string()
    .min(3, 'Custom alias must be at least 3 characters')
    .max(50, 'Custom alias cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Custom alias can only contain letters, numbers, hyphens, and underscores')
    .refine((alias) => !isReservedSlug(alias), {
      message: 'This alias is reserved for system routes and cannot be used',
    })
    .optional()
    .or(z.literal('')),
  title: z.string().max(150, 'Title cannot exceed 150 characters').optional().or(z.literal('')),
  campaignId: z.string().uuid('Invalid campaign identifier').optional().or(z.literal('')),
  channel: z.string().max(50).optional().or(z.literal('')),
  source: z.string().max(50).optional().or(z.literal('')),
  medium: z.string().max(50).optional().or(z.literal('')),
  expiresAt: z.string().datetime().optional().nullable().or(z.literal('')),
  generateQr: z.boolean().optional().default(true),
});

export const updateLinkSchema = z.object({
  originalUrl: z.string().min(1).optional(),
  title: z.string().max(150).optional().nullable(),
  status: z.enum(['ACTIVE', 'DISABLED']).optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  campaignId: z.string().uuid().optional().nullable(),
});

export const linkQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'DISABLED', 'EXPIRED', 'BLOCKED', 'ALL']).optional(),
  campaignId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
