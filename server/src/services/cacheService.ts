import { cache } from '../config/redis';
import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

export interface CachedLinkData {
  id: string;
  originalUrl: string;
  status: string;
  expiresAt: string | null;
  campaignId: string | null;
  shortCode: string;
}

const LINK_CACHE_PREFIX = 'link:code:';
const LINK_ID_LOOKUP_PREFIX = 'link:id_to_code:';
const DEFAULT_TTL_SECONDS = 3600; // 1 hour

export const cacheService = {
  /**
   * Retrieves cached link metadata by short code or custom alias
   */
  async getLink(shortCode: string): Promise<CachedLinkData | null> {
    try {
      const raw = await cache.get(`${LINK_CACHE_PREFIX}${shortCode}`);
      if (!raw) return null;
      return JSON.parse(raw) as CachedLinkData;
    } catch (err: any) {
      logger.warn(`[CacheService] Failed to read cached link "${shortCode}":`, err.message);
      return null;
    }
  },

  /**
   * Caches link metadata for fast redirects
   */
  async setLink(shortCode: string, link: CachedLinkData): Promise<void> {
    try {
      const key = `${LINK_CACHE_PREFIX}${shortCode}`;
      await cache.set(key, JSON.stringify(link), DEFAULT_TTL_SECONDS);
      await cache.set(`${LINK_ID_LOOKUP_PREFIX}${link.id}`, shortCode, DEFAULT_TTL_SECONDS);
    } catch (err: any) {
      logger.warn(`[CacheService] Failed to set cached link "${shortCode}":`, err.message);
    }
  },

  /**
   * Invalidates cached link by shortCode
   */
  async invalidateLink(shortCode: string): Promise<void> {
    try {
      await cache.del(`${LINK_CACHE_PREFIX}${shortCode}`);
      logger.debug(`[CacheService] Cache invalidated for code: ${shortCode}`);
    } catch (err: any) {
      logger.warn(`[CacheService] Invalidation error for "${shortCode}":`, err.message);
    }
  },

  /**
   * Invalidates cached link by Link ID
   */
  async invalidateLinkById(linkId: string): Promise<void> {
    try {
      const shortCode = await cache.get(`${LINK_ID_LOOKUP_PREFIX}${linkId}`);
      if (shortCode) {
        await cache.del(`${LINK_CACHE_PREFIX}${shortCode}`);
        await cache.del(`${LINK_ID_LOOKUP_PREFIX}${linkId}`);
      } else {
        // Fallback: look up in DB to get short code and custom alias
        const link = await prisma.link.findUnique({
          where: { id: linkId },
          select: { shortCode: true, customAlias: true },
        });
        if (link) {
          await cache.del(`${LINK_CACHE_PREFIX}${link.shortCode}`);
          if (link.customAlias) {
            await cache.del(`${LINK_CACHE_PREFIX}${link.customAlias}`);
          }
        }
      }
    } catch (err: any) {
      logger.warn(`[CacheService] Invalidation error for link id "${linkId}":`, err.message);
    }
  },
};
