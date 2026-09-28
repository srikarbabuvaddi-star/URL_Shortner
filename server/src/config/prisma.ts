import './env';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const dbUrl = process.env.DATABASE_URL?.startsWith('file:')
  ? `file:${path.resolve(__dirname, '../../../prisma/dev.db').replace(/\\/g, '/')}`
  : process.env.DATABASE_URL;

export const prisma: PrismaClient =
  global.prismaGlobal ||
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}

logger.info('Prisma client initialized');
