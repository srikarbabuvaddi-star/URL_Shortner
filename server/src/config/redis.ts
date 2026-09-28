import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

class CacheManager {
  private redisClient: Redis | null = null;
  private memoryCache: Map<string, { value: string; expiresAt: number }> = new Map();
  private isConnected = false;

  constructor() {
    if (env.REDIS_URL && env.REDIS_URL.trim() !== '') {
      try {
        this.redisClient = new Redis(env.REDIS_URL, {
          lazyConnect: true,
          retryStrategy: (times) => {
            if (times > 3) {
              logger.warn('[Cache] Redis retry limit reached, relying on in-memory fallback.');
              return null; // stop retrying
            }
            return Math.min(times * 100, 1000);
          },
        });

        this.redisClient.on('connect', () => {
          this.isConnected = true;
          logger.info('[Cache] Connected to Redis instance successfully.');
        });

        this.redisClient.on('error', (err) => {
          this.isConnected = false;
          logger.warn(`[Cache] Redis error: ${err.message}. Using in-memory fallback.`);
        });

        this.redisClient.connect().catch((err) => {
          this.isConnected = false;
          logger.info(`[Cache] Redis not available: ${err.message}. Using in-memory cache.`);
        });
      } catch (err: any) {
        this.redisClient = null;
        this.isConnected = false;
        logger.info(`[Cache] Redis init error: ${err?.message}. Using in-memory cache.`);
      }
    } else {
      logger.info('[Cache] REDIS_URL not set. Running with built-in in-memory cache.');
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

  public isRedisActive(): boolean {
    return this.isConnected && this.redisClient !== null;
  }

  public async get(key: string): Promise<string | null> {
    if (this.isRedisActive() && this.redisClient) {
      try {
        return await this.redisClient.get(key);
      } catch (err: any) {
        logger.warn(`[Cache] Redis GET failed for key "${key}": ${err.message}`);
      }
    }

    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (item.expiresAt > 0 && item.expiresAt <= Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    return item.value;
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.isRedisActive() && this.redisClient) {
      try {
        if (ttlSeconds && ttlSeconds > 0) {
          await this.redisClient.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.redisClient.set(key, value);
        }
        return;
      } catch (err: any) {
        logger.warn(`[Cache] Redis SET failed for key "${key}": ${err.message}`);
      }
    }

    const expiresAt = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : 0;
    this.memoryCache.set(key, { value, expiresAt });
  }

  public async del(key: string): Promise<void> {
    if (this.isRedisActive() && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (err: any) {
        logger.warn(`[Cache] Redis DEL failed for key "${key}": ${err.message}`);
      }
    }
    this.memoryCache.delete(key);
  }

  public async delPattern(pattern: string): Promise<void> {
    if (this.isRedisActive() && this.redisClient) {
      try {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } catch (err: any) {
        logger.warn(`[Cache] Redis delPattern failed for pattern "${pattern}": ${err.message}`);
      }
    }

    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        this.memoryCache.delete(key);
      }
    }
  }

  public async getStats(): Promise<{ redisConnected: boolean; inMemoryKeys: number }> {
    return {
      redisConnected: this.isRedisActive(),
      inMemoryKeys: this.memoryCache.size,
    };
  }
}

export const cache = new CacheManager();
