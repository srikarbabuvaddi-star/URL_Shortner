"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDestinationUrl = validateDestinationUrl;
exports.isDomainBlocked = isDomainBlocked;
exports.invalidateBlockedDomainCache = invalidateBlockedDomainCache;
const prisma_1 = require("../config/prisma");
const redis_1 = require("../config/redis");
const env_1 = require("../config/env");
const logger_1 = require("./logger");
const BLOCKED_DOMAINS_CACHE_KEY = 'blocked_domains:set';
/**
 * Validates whether a target URL is safe, reachable, and not in the blocked domains list
 */
async function validateDestinationUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') {
        return { isValid: false, error: 'URL is required and must be a string' };
    }
    const trimmed = rawUrl.trim();
    // Reject malicious schemes immediately
    const lower = trimmed.toLowerCase();
    if (lower.startsWith('javascript:') ||
        lower.startsWith('data:') ||
        lower.startsWith('file:') ||
        lower.startsWith('vbscript:')) {
        return { isValid: false, error: 'Unsafe URL protocol. Only http:// and https:// are permitted.' };
    }
    let parsedUrl;
    try {
        parsedUrl = new URL(trimmed);
    }
    catch (err) {
        return { isValid: false, error: 'Invalid URL format. Please provide a valid http:// or https:// URL.' };
    }
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return { isValid: false, error: 'Only http and https protocols are supported.' };
    }
    const hostname = parsedUrl.hostname.toLowerCase();
    // Prevent self-referencing recursion loops
    try {
        const appHost = new URL(env_1.env.APP_URL).hostname.toLowerCase();
        if (hostname === appHost || hostname === '127.0.0.1' || hostname === 'localhost') {
            // If it's attempting to shorten its own domain / short-code route
            if (parsedUrl.port === String(env_1.env.PORT) || parsedUrl.origin === env_1.env.APP_URL) {
                return { isValid: false, error: 'Cannot shorten links pointing directly to this shortener application.' };
            }
        }
    }
    catch {
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
async function isDomainBlocked(hostname) {
    try {
        // Check cache first
        const cached = await redis_1.cache.get(`${BLOCKED_DOMAINS_CACHE_KEY}:${hostname}`);
        if (cached !== null) {
            return cached === '1';
        }
        // Query database
        const domainRecord = await prisma_1.prisma.blockedDomain.findFirst({
            where: {
                domain: {
                    equals: hostname,
                },
            },
        });
        const blocked = !!domainRecord;
        await redis_1.cache.set(`${BLOCKED_DOMAINS_CACHE_KEY}:${hostname}`, blocked ? '1' : '0', 300); // 5 min TTL
        return blocked;
    }
    catch (err) {
        logger_1.logger.error('Error checking blocked domain:', err);
        return false; // Fail open if DB check errors during startup
    }
}
/**
 * Invalidate blocked domain cache when admin adds/removes domains
 */
async function invalidateBlockedDomainCache(domain) {
    await redis_1.cache.del(`${BLOCKED_DOMAINS_CACHE_KEY}:${domain}`);
}
