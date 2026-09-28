"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrService = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const prisma_1 = require("../config/prisma");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
exports.qrService = {
    /**
     * Builds the canonical dynamic short link URL to be embedded into the QR code
     */
    getShortUrl(shortCode) {
        const base = env_1.env.APP_URL.replace(/\/$/, '');
        return `${base}/${shortCode}`;
    },
    /**
     * Generates a PNG data URL for the dynamic short link
     */
    async generatePngDataUrl(shortCode, options) {
        const url = this.getShortUrl(shortCode);
        return qrcode_1.default.toDataURL(url, {
            width: options?.width || 360,
            margin: options?.margin || 2,
            color: {
                dark: options?.color?.dark || '#0f172a',
                light: options?.color?.light || '#ffffff',
            },
            errorCorrectionLevel: 'M',
        });
    },
    /**
     * Generates a PNG binary Buffer for file downloads
     */
    async generatePngBuffer(shortCode, options) {
        const url = this.getShortUrl(shortCode);
        return qrcode_1.default.toBuffer(url, {
            width: options?.width || 600,
            margin: options?.margin || 2,
            color: {
                dark: options?.color?.dark || '#0f172a',
                light: options?.color?.light || '#ffffff',
            },
            errorCorrectionLevel: 'M',
        });
    },
    /**
     * Generates an SVG string for vector downloads
     */
    async generateSvgString(shortCode, options) {
        const url = this.getShortUrl(shortCode);
        return qrcode_1.default.toString(url, {
            type: 'svg',
            margin: options?.margin || 2,
            color: {
                dark: options?.color?.dark || '#0f172a',
                light: options?.color?.light || '#ffffff',
            },
            errorCorrectionLevel: 'M',
        });
    },
    /**
     * Finds or creates a QrCode record in the database for the given link
     */
    async getOrCreateQrCode(linkId, format = 'PNG') {
        let qr = await prisma_1.prisma.qrCode.findFirst({
            where: { linkId },
        });
        if (!qr) {
            qr = await prisma_1.prisma.qrCode.create({
                data: {
                    linkId,
                    format: format.toUpperCase(),
                    downloadCount: 0,
                },
            });
        }
        return qr;
    },
    /**
     * Increments the download count for a link's QR code
     */
    async incrementDownloadCount(linkId) {
        try {
            const qr = await this.getOrCreateQrCode(linkId);
            await prisma_1.prisma.qrCode.update({
                where: { id: qr.id },
                data: { downloadCount: { increment: 1 } },
            });
        }
        catch (err) {
            logger_1.logger.warn(`[QrService] Failed to increment download count for link "${linkId}":`, err.message);
        }
    },
};
