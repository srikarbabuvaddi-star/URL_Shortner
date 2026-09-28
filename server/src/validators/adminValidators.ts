import { z } from 'zod';

export const blockLinkSchema = z.object({
  reason: z.string().max(200).optional(),
});

export const suspendUserSchema = z.object({
  reason: z.string().max(200).optional(),
});

export const addBlockedDomainSchema = z.object({
  domain: z
    .string()
    .min(3, 'Domain must be at least 3 characters')
    .max(150)
    .toLowerCase()
    .transform((val) => val.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]),
  reason: z.string().max(200).optional(),
});

export const adminUserQuerySchema = z.object({
  search: z.string().optional(),
  role: z.enum(['USER', 'ADMIN', 'ALL']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'ALL']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const adminLinkQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'DISABLED', 'EXPIRED', 'BLOCKED', 'ALL']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
