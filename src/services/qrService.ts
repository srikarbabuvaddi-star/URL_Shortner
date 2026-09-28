import { api } from './api';

export interface QrItem {
  id: string;
  linkId: string;
  shortCode: string;
  title: string;
  originalUrl: string;
  shortUrl: string;
  downloadCount: number;
  totalClicks: number;
  createdAt: string;
  previewUrl: string;
}

export const qrService = {
  async getQrList() {
    return api.get<{ success: boolean; qrs: QrItem[] }>('/qr');
  },

  async getQrForLink(linkId: string) {
    return api.get<{
      success: boolean;
      qr: {
        id: string;
        linkId: string;
        shortCode: string;
        shortUrl: string;
        downloadCount: number;
        pngDataUrl: string;
        svgString: string;
      };
    }>(`/links/${linkId}/qr`);
  },

  async downloadQr(linkId: string, format: 'png' | 'svg' = 'png', filename = 'qr-code') {
    const token = localStorage.getItem('lp_token');
    const response = await fetch(`/api/links/${linkId}/qr/download?format=${format}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};
