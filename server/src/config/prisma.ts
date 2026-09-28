import './env';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import path from 'path';

import fs from 'fs';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

function resolveDbUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  if (url.startsWith('file:')) {
    const rawPath = url.slice(5);
    if (path.isAbsolute(rawPath)) {
      return `file:${rawPath.replace(/\\/g, '/')}`;
    }
    const prismaDirDb = path.resolve(__dirname, '../../../prisma/dev.db');
    if (fs.existsSync(prismaDirDb)) {
      return `file:${prismaDirDb.replace(/\\/g, '/')}`;
    }
    const cwdDb = path.resolve(process.cwd(), rawPath);
    return `file:${cwdDb.replace(/\\/g, '/')}`;
  }
  return url;
}

const dbUrl = resolveDbUrl();

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
