"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESERVED_WORDS = void 0;
exports.isReservedSlug = isReservedSlug;
exports.generateShortCode = generateShortCode;
const crypto_1 = __importDefault(require("crypto"));
const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
exports.RESERVED_WORDS = new Set([
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
function isReservedSlug(slug) {
    if (!slug)
        return false;
    return exports.RESERVED_WORDS.has(slug.toLowerCase().trim());
}
/**
 * Generates a random Base62 short code of specified length (default 6 characters)
 */
function generateShortCode(length = 6) {
    let result = '';
    const randomBytes = crypto_1.default.randomBytes(length);
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
