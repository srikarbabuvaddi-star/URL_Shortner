import crypto from 'crypto';

const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const RESERVED_WORDS = new Set([
  'admin',
  'api',
  'app',
  'dashboard',
  'login',
  'register',
  'logout',
  'auth',
  'links',
  'campaigns',
  'qr',
  'profile',
  'settings',
  'about',
  'pricing',
  'docs',
  'privacy',
  'terms',
  'errors',
  'error',
  'health',
  'metrics',
  'assets',
  'static',
  'public',
  'favicon',
  'robots',
  'sitemap',
  'index',
  'home',
  'explore',
]);

/**
 * Checks if a given alias/slug is a reserved keyword that cannot be used as a short code
 */
export function isReservedSlug(slug: string): boolean {
  if (!slug) return false;
  return RESERVED_WORDS.has(slug.toLowerCase().trim());
}

/**
 * Generates a random Base62 short code of specified length (default 6 characters)
 */
export function generateShortCode(length = 6): string {
  let result = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % BASE62_CHARS.length;
    result += BASE62_CHARS[randomIndex];
  }

  // In the astronomically unlikely chance it matches a reserved word, re-generate
  if (isReservedSlug(result)) {
    return generateShortCode(length);
  }

  return result;
}
