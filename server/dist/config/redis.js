"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
class CacheManager {
    redisClient = null;
    memoryCache = new Map();
    isConnected = false;
    constructor() {
        if (env_1.env.REDIS_URL && env_1.env.REDIS_URL.trim() !== '') {
            try {
                this.redisClient = new ioredis_1.default(env_1.env.REDIS_URL, {
                    lazyConnect: true,
                    retryStrategy: (times) => {
                        if (times > 3) {
                            logger_1.logger.warn('[Cache] Redis retry limit reached, relying on in-memory fallback.');
                            return null; // stop retrying
                        }
                        return Math.min(times * 100, 1000);
                    },
                });
                this.redisClient.on('connect', () => {
                    this.isConnected = true;
                    logger_1.logger.info('[Cache] Connected to Redis instance successfully.');
                });
                this.redisClient.on('error', (err) => {
                    this.isConnected = false;
                    logger_1.logger.warn(`[Cache] Redis error: ${err.message}. Using in-memory fallback.`);
                });
                this.redisClient.connect().catch((err) => {
                    this.isConnected = false;
                    logger_1.logger.info(`[Cache] Redis not available: ${err.message}. Using in-memory cache.`);
                });
            }
            catch (err) {
                this.redisClient = null;
                this.isConnected = false;
                logger_1.logger.info(`[Cache] Redis init error: ${err?.message}. Using in-memory cache.`);
            }
        }
        else {
            logger_1.logger.info('[Cache] REDIS_URL not set. Running with built-in in-memory cache.');
        }
        // Cleanup expired keys periodically in in-memory map
        setInterval(() => {
            const now = Date.now();
            for (const [key, item] of this.memoryCache.entries()) {
                if (item.expiresAt > 0 && item.expiresAt <= now) {
                    this.memoryCache.delete(key);
                }
            }
        }, 60000);
    }
    isRedisActive() {
        return this.isConnected && this.redisClient !== null;
    }
    async get(key) {
        if (this.isRedisActive() && this.redisClient) {
            try {
                return await this.redisClient.get(key);
            }
            catch (err) {
                logger_1.logger.warn(`[Cache] Redis GET failed for key "${key}": ${err.message}`);
            }
        }
        const item = this.memoryCache.get(key);
        if (!item)
            return null;
        if (item.expiresAt > 0 && item.expiresAt <= Date.now()) {
            this.memoryCache.delete(key);
            return null;
        }
        return item.value;
    }
    async set(key, value, ttlSeconds) {
        if (this.isRedisActive() && this.redisClient) {
            try {
                if (ttlSeconds && ttlSeconds > 0) {
                    await this.redisClient.set(key, value, 'EX', ttlSeconds);
                }
                else {
                    await this.redisClient.set(key, value);
                }
                return;
            }
            catch (err) {
                logger_1.logger.warn(`[Cache] Redis SET failed for key "${key}": ${err.message}`);
            }
        }
        const expiresAt = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : 0;
        this.memoryCache.set(key, { value, expiresAt });
    }
    async del(key) {
        if (this.isRedisActive() && this.redisClient) {
            try {
                await this.redisClient.del(key);
            }
            catch (err) {
                logger_1.logger.warn(`[Cache] Redis DEL failed for key "${key}": ${err.message}`);
            }
        }
        this.memoryCache.delete(key);
    }
    async delPattern(pattern) {
        if (this.isRedisActive() && this.redisClient) {
            try {
                const keys = await this.redisClient.keys(pattern);
                if (keys.length > 0) {
                    await this.redisClient.del(...keys);
                }
            }
            catch (err) {
                logger_1.logger.warn(`[Cache] Redis delPattern failed for pattern "${pattern}": ${err.message}`);
            }
        }
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        for (const key of this.memoryCache.keys()) {
            if (regex.test(key)) {
                this.memoryCache.delete(key);
            }
        }
    }
    async getStats() {
        return {
            redisConnected: this.isRedisActive(),
            inMemoryKeys: this.memoryCache.size,
        };
    }
}
exports.cache = new CacheManager();
