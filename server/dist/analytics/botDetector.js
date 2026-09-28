"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBotTraffic = isBotTraffic;
const isbot_1 = require("isbot");
const BOT_PATTERNS = [
    /bot/i,
    /spider/i,
    /crawl/i,
    /slurp/i,
    /mediapartners/i,
    /curl/i,
    /wget/i,
    /python-requests/i,
    /node-fetch/i,
    /postman/i,
    /headlesschrome/i,
    /lighthouse/i,
    /ptst/i,
    /ahrefs/i,
    /semrush/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /whatsapp/i, // NOTE: WhatsApp link preview fetcher is bot; user clicking inside WhatsApp is normal client
    /telegrambot/i,
    /discordbot/i,
    /slackbot/i,
    /google-read-aloud/i,
];
/**
 * Determines if a given User-Agent string corresponds to an automated crawler or bot.
 * Note: Bot detection is heuristic and documented as best-effort.
 */
function isBotTraffic(userAgent) {
    if (!userAgent || userAgent.trim() === '') {
        return false;
    }
    // Check using the robust isbot library
    if ((0, isbot_1.isbot)(userAgent)) {
        return true;
    }
    // Secondary check with custom known crawler/bot patterns
    return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}
