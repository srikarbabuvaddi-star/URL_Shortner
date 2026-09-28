"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = void 0;
const redis_1 = require("../config/redis");
const prisma_1 = require("../config/prisma");
const logger_1 = require("../utils/logger");
const LINK_CACHE_PREFIX = 'link:code:';
const LINK_ID_LOOKUP_PREFIX = 'link:id_to_code:';
const DEFAULT_TTL_SECONDS = 3600; // 1 hour
exports.cacheService = {
    /**
     * Retrieves cached link metadata by short code or custom alias
     */
    async getLink(shortCode) {
        try {
            const raw = await redis_1.cache.get(`${LINK_CACHE_PREFIX}${shortCode}`);
            if (!raw)
                return null;
            return JSON.parse(raw);
        }
        catch (err) {
            logger_1.logger.warn(`[CacheService] Failed to read cached link "${shortCode}":`, err.message);
            return null;
        }
    },
    /**
     * Caches link metadata for fast redirects
     */
    async setLink(shortCode, link) {
        try {
            const key = `${LINK_CACHE_PREFIX}${shortCode}`;
            await redis_1.cache.set(key, JSON.stringify(link), DEFAULT_TTL_SECONDS);
            await redis_1.cache.set(`${LINK_ID_LOOKUP_PREFIX}${link.id}`, shortCode, DEFAULT_TTL_SECONDS);
        }
        catch (err) {
            logger_1.logger.warn(`[CacheService] Failed to set cached link "${shortCode}":`, err.message);
        }
    },
    /**
     * Invalidates cached link by shortCode
     */
    async invalidateLink(shortCode) {
        try {
            await redis_1.cache.del(`${LINK_CACHE_PREFIX}${shortCode}`);
            logger_1.logger.debug(`[CacheService] Cache invalidated for code: ${shortCode}`);
        }
        catch (err) {
            logger_1.logger.warn(`[CacheService] Invalidation error for "${shortCode}":`, err.message);
        }
    },
    /**
     * Invalidates cached link by Link ID
     */
    async invalidateLinkById(linkId) {
        try {
            const shortCode = await redis_1.cache.get(`${LINK_ID_LOOKUP_PREFIX}${linkId}`);
            if (shortCode) {
                await redis_1.cache.del(`${LINK_CACHE_PREFIX}${shortCode}`);
                await redis_1.cache.del(`${LINK_ID_LOOKUP_PREFIX}${linkId}`);
            }
            else {
                // Fallback: look up in DB to get short code and custom alias
                const link = await prisma_1.prisma.link.findUnique({
                    where: { id: linkId },
                    select: { shortCode: true, customAlias: true },
                });
                if (link) {
                    await redis_1.cache.del(`${LINK_CACHE_PREFIX}${link.shortCode}`);
                    if (link.customAlias) {
                        await redis_1.cache.del(`${LINK_CACHE_PREFIX}${link.customAlias}`);
                    }
                }
            }
        }
        catch (err) {
            logger_1.logger.warn(`[CacheService] Invalidation error for link id "${linkId}":`, err.message);
        }
    },
};
