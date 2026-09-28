import { api } from './api';

export interface Link {
  id: string;
  userId: string;
  campaignId?: string | null;
  campaignName?: string | null;
  shortCode: string;
  customAlias?: string | null;
  originalUrl: string;
  title?: string | null;
  status: 'ACTIVE' | 'DISABLED' | 'EXPIRED' | 'BLOCKED';
  rawStatus: string;
  expiresAt?: string | null;
  lastClickedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  shortUrl: string;
  totalClicks: number;
  hasQr: boolean;
  campaignLinks?: Array<{
    id: string;
    channel: string;
    source: string;
    medium: string;
  }>;
}

export interface CreateLinkParams {
  originalUrl: string;
  customAlias?: string;
  title?: string;
  campaignId?: string;
  channel?: string;
  source?: string;
  medium?: string;
  expiresAt?: string | null;
  generateQr?: boolean;
}

export const linkService = {
  async getLinks(params?: { page?: number; limit?: number; search?: string; status?: string; campaignId?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.campaignId) searchParams.set('campaignId', params.campaignId);

    const queryStr = searchParams.toString();
    return api.get<{
      success: boolean;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      links: Link[];
    }>(`/links${queryStr ? `?${queryStr}` : ''}`);
  },

  async getLinkById(id: string) {
    return api.get<{ success: boolean; link: Link }>(`/links/${id}`);
  },

  async createLink(data: CreateLinkParams) {
    return api.post<{ success: boolean; link: Link; message: string }>('/links', data);
  },

  async updateLink(id: string, data: { originalUrl?: string; title?: string; status?: string; expiresAt?: string | null; campaignId?: string | null }) {
    return api.patch<{ success: boolean; link: Link; message: string }>(`/links/${id}`, data);
  },

  async deleteLink(id: string) {
    return api.delete<{ success: boolean; message: string }>(`/links/${id}`);
  },

  async disableLink(id: string) {
    return api.post<{ success: boolean; link: Link; message: string }>(`/links/${id}/disable`);
  },

  async enableLink(id: string) {
    return api.post<{ success: boolean; link: Link; message: string }>(`/links/${id}/enable`);
  },
};
