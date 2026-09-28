import { prisma } from '../config/prisma';
import { cache } from '../config/redis';
import { env } from '../config/env';
import { logger } from './logger';

export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  normalizedUrl?: string;
  hostname?: string;
}

const BLOCKED_DOMAINS_CACHE_KEY = 'blocked_domains:set';

/**
 * Validates whether a target URL is safe, reachable, and not in the blocked domains list
 */
export async function validateDestinationUrl(rawUrl: string): Promise<UrlValidationResult> {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: 'URL is required and must be a string' };
  }

  const trimmed = rawUrl.trim();

  // Reject malicious schemes immediately
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('vbscript:')
  ) {
    return { isValid: false, error: 'Unsafe URL protocol. Only http:// and https:// are permitted.' };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch (err) {
    return { isValid: false, error: 'Invalid URL format. Please provide a valid http:// or https:// URL.' };
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return { isValid: false, error: 'Only http and https protocols are supported.' };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Prevent self-referencing recursion loops
  try {
    const appHost = new URL(env.APP_URL).hostname.toLowerCase();
    if (hostname === appHost || hostname === '127.0.0.1' || hostname === 'localhost') {
      // If it's attempting to shorten its own domain / short-code route
      if (parsedUrl.port === String(env.PORT) || parsedUrl.origin === env.APP_URL) {
        return { isValid: false, error: 'Cannot shorten links pointing directly to this shortener application.' };
      }
    }
  } catch {
    // ignore
  }

  // Check if domain is blocked in DB
  const isBlocked = await isDomainBlocked(hostname);
  if (isBlocked) {
    return { isValid: false, error: `The domain "${hostname}" is blocked for security and abuse prevention.` };
  }

  return {
    isValid: true,
    normalizedUrl: parsedUrl.toString(),
    hostname,
  };
}

/**
 * Checks if a hostname or its parent domain is in the blocked domains database
 */
export async function isDomainBlocked(hostname: string): Promise<boolean> {
  try {
    // Check cache first
    const cached = await cache.get(`${BLOCKED_DOMAINS_CACHE_KEY}:${hostname}`);
    if (cached !== null) {
      return cached === '1';
    }

    // Query database
    const domainRecord = await prisma.blockedDomain.findFirst({
      where: {
        domain: {
          equals: hostname,
        },
      },
    });

    const blocked = !!domainRecord;
    await cache.set(`${BLOCKED_DOMAINS_CACHE_KEY}:${hostname}`, blocked ? '1' : '0', 300); // 5 min TTL
    return blocked;
  } catch (err: any) {
    logger.error('Error checking blocked domain:', err);
    return false; // Fail open if DB check errors during startup
  }
}

/**
 * Invalidate blocked domain cache when admin adds/removes domains
 */
export async function invalidateBlockedDomainCache(domain: string): Promise<void> {
  await cache.del(`${BLOCKED_DOMAINS_CACHE_KEY}:${domain}`);
}
