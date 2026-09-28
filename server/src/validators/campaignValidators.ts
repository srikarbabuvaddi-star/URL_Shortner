import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(2, 'Campaign name must be at least 2 characters').max(100, 'Campaign name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'ARCHIVED']).default('ACTIVE'),
});

export const updateCampaignSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
});

export const campaignQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'ALL']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
