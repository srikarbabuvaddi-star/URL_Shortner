import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { qrService } from '../services/qrService';

export const qrController = {
  /**
   * Generates or ensures QR code metadata exists for a link
   */
  async generateQr(req: Request, res: Response) {
    try {
      const link = await prisma.link.findUnique({
        where: { id: req.params.id as string },
      });

      if (!link) {
        res.status(404).json({ success: false, error: 'Link not found' });
        return;
      }

      if (link.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
        res.status(403).json({ success: false, error: 'Forbidden' });
        return;
      }

      const qr = await qrService.getOrCreateQrCode(link.id, req.body.format || 'PNG');
      const pngDataUrl = await qrService.generatePngDataUrl(link.shortCode);

      res.status(200).json({
        success: true,
        qr: {
          ...qr,
          shortUrl: qrService.getShortUrl(link.shortCode),
          previewUrl: pngDataUrl,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Retrieves preview of QR code for a link
   */
  async getQrPreview(req: Request, res: Response) {
    try {
      const link = await prisma.link.findUnique({
        where: { id: req.params.id as string },
        include: { qrCodes: true },
      });

      if (!link) {
        res.status(404).json({ success: false, error: 'Link not found' });
        return;
      }

      if (link.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
        res.status(403).json({ success: false, error: 'Forbidden' });
        return;
      }

      const qr = await qrService.getOrCreateQrCode(link.id);
      const pngDataUrl = await qrService.generatePngDataUrl(link.shortCode);
      const svgString = await qrService.generateSvgString(link.shortCode);

      res.status(200).json({
        success: true,
        qr: {
          id: qr.id,
          linkId: link.id,
          shortCode: link.shortCode,
          shortUrl: qrService.getShortUrl(link.shortCode),
          downloadCount: qr.downloadCount,
          pngDataUrl,
          svgString,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Downloads QR code in PNG or SVG and tracks download count
   */
  async downloadQr(req: Request, res: Response) {
    try {
      const link = await prisma.link.findUnique({
        where: { id: req.params.id as string },
      });

      if (!link) {
        res.status(404).json({ success: false, error: 'Link not found' });
        return;
      }

      if (link.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
        res.status(403).json({ success: false, error: 'Forbidden' });
        return;
      }

      const format = (req.query.format as string)?.toUpperCase() === 'SVG' ? 'SVG' : 'PNG';

      // Increment download counter
      await qrService.incrementDownloadCount(link.id);

      if (format === 'SVG') {
        const svg = await qrService.generateSvgString(link.shortCode);
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', `attachment; filename="linkpulse-qr-${link.shortCode}.svg"`);
        res.send(svg);
      } else {
        const buffer = await qrService.generatePngBuffer(link.shortCode);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="linkpulse-qr-${link.shortCode}.png"`);
        res.send(buffer);
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Lists all QR codes for current user
   */
  async getUserQrCodes(req: Request, res: Response) {
    try {
      const qrs = await prisma.qrCode.findMany({
        where: {
          link: { userId: req.user!.id },
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

      const formatted = await Promise.all(
        qrs.map(async (qr: any) => ({
          id: qr.id,
          linkId: qr.link.id,
          shortCode: qr.link.shortCode,
          title: qr.link.title || qr.link.shortCode,
          originalUrl: qr.link.originalUrl,
          shortUrl: qrService.getShortUrl(qr.link.shortCode),
          downloadCount: qr.downloadCount,
          totalClicks: qr.link._count.events,
          createdAt: qr.createdAt,
          previewUrl: await qrService.generatePngDataUrl(qr.link.shortCode, { width: 180 }),
        }))
      );

      res.status(200).json({ success: true, qrs: formatted });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
