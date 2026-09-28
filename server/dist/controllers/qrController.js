"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrController = void 0;
const prisma_1 = require("../config/prisma");
const qrService_1 = require("../services/qrService");
exports.qrController = {
    /**
     * Generates or ensures QR code metadata exists for a link
     */
    async generateQr(req, res) {
        try {
            const link = await prisma_1.prisma.link.findUnique({
                where: { id: req.params.id },
            });
            if (!link) {
                res.status(404).json({ success: false, error: 'Link not found' });
                return;
            }
            if (link.userId !== req.user.id && req.user.role !== 'ADMIN') {
                res.status(403).json({ success: false, error: 'Forbidden' });
                return;
            }
            const qr = await qrService_1.qrService.getOrCreateQrCode(link.id, req.body.format || 'PNG');
            const pngDataUrl = await qrService_1.qrService.generatePngDataUrl(link.shortCode);
            res.status(200).json({
                success: true,
                qr: {
                    ...qr,
                    shortUrl: qrService_1.qrService.getShortUrl(link.shortCode),
                    previewUrl: pngDataUrl,
                },
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    /**
     * Retrieves preview of QR code for a link
     */
    async getQrPreview(req, res) {
        try {
            const link = await prisma_1.prisma.link.findUnique({
                where: { id: req.params.id },
                include: { qrCodes: true },
            });
            if (!link) {
                res.status(404).json({ success: false, error: 'Link not found' });
                return;
            }
            if (link.userId !== req.user.id && req.user.role !== 'ADMIN') {
                res.status(403).json({ success: false, error: 'Forbidden' });
                return;
            }
            const qr = await qrService_1.qrService.getOrCreateQrCode(link.id);
            const pngDataUrl = await qrService_1.qrService.generatePngDataUrl(link.shortCode);
            const svgString = await qrService_1.qrService.generateSvgString(link.shortCode);
            res.status(200).json({
                success: true,
                qr: {
                    id: qr.id,
                    linkId: link.id,
                    shortCode: link.shortCode,
                    shortUrl: qrService_1.qrService.getShortUrl(link.shortCode),
                    downloadCount: qr.downloadCount,
                    pngDataUrl,
                    svgString,
                },
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    /**
     * Downloads QR code in PNG or SVG and tracks download count
     */
    async downloadQr(req, res) {
        try {
            const link = await prisma_1.prisma.link.findUnique({
                where: { id: req.params.id },
            });
            if (!link) {
                res.status(404).json({ success: false, error: 'Link not found' });
                return;
            }
            if (link.userId !== req.user.id && req.user.role !== 'ADMIN') {
                res.status(403).json({ success: false, error: 'Forbidden' });
                return;
            }
            const format = req.query.format?.toUpperCase() === 'SVG' ? 'SVG' : 'PNG';
            // Increment download counter
            await qrService_1.qrService.incrementDownloadCount(link.id);
            if (format === 'SVG') {
                const svg = await qrService_1.qrService.generateSvgString(link.shortCode);
                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Content-Disposition', `attachment; filename="linkpulse-qr-${link.shortCode}.svg"`);
                res.send(svg);
            }
            else {
                const buffer = await qrService_1.qrService.generatePngBuffer(link.shortCode);
                res.setHeader('Content-Type', 'image/png');
                res.setHeader('Content-Disposition', `attachment; filename="linkpulse-qr-${link.shortCode}.png"`);
                res.send(buffer);
            }
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    /**
     * Lists all QR codes for current user
     */
    async getUserQrCodes(req, res) {
        try {
            const qrs = await prisma_1.prisma.qrCode.findMany({
                where: {
                    link: { userId: req.user.id },
                },
                include: {
                    link: {
                        select: {
                            id: true,
                            shortCode: true,
                            title: true,
                            originalUrl: true,
                            status: true,
                            _count: { select: { events: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            const formatted = await Promise.all(qrs.map(async (qr) => ({
                id: qr.id,
                linkId: qr.link.id,
                shortCode: qr.link.shortCode,
                title: qr.link.title || qr.link.shortCode,
                originalUrl: qr.link.originalUrl,
                shortUrl: qrService_1.qrService.getShortUrl(qr.link.shortCode),
                downloadCount: qr.downloadCount,
                totalClicks: qr.link._count.events,
                createdAt: qr.createdAt,
                previewUrl: await qrService_1.qrService.generatePngDataUrl(qr.link.shortCode, { width: 180 }),
            })));
            res.status(200).json({ success: true, qrs: formatted });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
};
