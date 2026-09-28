"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashIpAddress = hashIpAddress;
exports.identifyVisitor = identifyVisitor;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const COOKIE_NAME = 'lp_vid';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
/**
 * Creates a privacy-preserving hash of an IP address using HMAC-SHA256 with the secret salt
 */
function hashIpAddress(ip) {
    return crypto_1.default
        .createHmac('sha256', env_1.env.ANALYTICS_HASH_SECRET)
        .update(ip)
        .digest('hex')
        .slice(0, 32); // 32 chars truncated hash
}
/**
 * Resolves visitor ID from cookie or generates a new privacy-conscious visitor identifier
 */
function identifyVisitor(req, res, ip = '127.0.0.1') {
    const ipHash = hashIpAddress(ip);
    // Check if visitor ID cookie exists
    let visitorId = req.cookies?.[COOKIE_NAME];
    let isNewVisitor = false;
    if (!visitorId || typeof visitorId !== 'string' || visitorId.length < 8) {
        // Generate new unique visitor ID
        visitorId = crypto_1.default.randomUUID();
        isNewVisitor = true;
        // Attach cookie if response object is available
        if (res && typeof res.cookie === 'function') {
            res.cookie(COOKIE_NAME, visitorId, {
                maxAge: ONE_YEAR_MS,
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });
        }
    }
    return {
        visitorId,
        ipHash,
        isNewVisitor,
    };
}
