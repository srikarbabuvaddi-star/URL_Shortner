import QRCode from 'qrcode';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export interface QrOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export const qrService = {
  /**
   * Builds the canonical dynamic short link URL to be embedded into the QR code
   */
  getShortUrl(shortCode: string): string {
    const base = env.APP_URL.replace(/\/$/, '');
    return `${base}/${shortCode}`;
  },

  /**
   * Generates a PNG data URL for the dynamic short link
   */
  async generatePngDataUrl(shortCode: string, options?: QrOptions): Promise<string> {
    const url = this.getShortUrl(shortCode);
    return QRCode.toDataURL(url, {
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
  async generatePngBuffer(shortCode: string, options?: QrOptions): Promise<Buffer> {
    const url = this.getShortUrl(shortCode);
    return QRCode.toBuffer(url, {
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
  async generateSvgString(shortCode: string, options?: QrOptions): Promise<string> {
    const url = this.getShortUrl(shortCode);
    return QRCode.toString(url, {
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
  async getOrCreateQrCode(linkId: string, format = 'PNG') {
    let qr = await prisma.qrCode.findFirst({
      where: { linkId },
    });

    if (!qr) {
      qr = await prisma.qrCode.create({
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
  async incrementDownloadCount(linkId: string): Promise<void> {
    try {
      const qr = await this.getOrCreateQrCode(linkId);
      await prisma.qrCode.update({
        where: { id: qr.id },
        data: { downloadCount: { increment: 1 } },
      });
    } catch (err: any) {
      logger.warn(`[QrService] Failed to increment download count for link "${linkId}":`, err.message);
    }
  },
};
