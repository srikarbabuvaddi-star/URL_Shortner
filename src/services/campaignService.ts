import { api } from './api';

export interface Campaign {
  id: string;
  name: string;
  description?: string | null;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  totalLinks: number;
  totalClicks: number;
  recentLinks?: any[];
  links?: any[];
}

export const campaignService = {
  async getCampaigns(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);

    const queryStr = searchParams.toString();
    return api.get<{
      success: boolean;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      campaigns: Campaign[];
    }>(`/campaigns${queryStr ? `?${queryStr}` : ''}`);
  },

  async getCampaignById(id: string) {
    return api.get<{ success: boolean; campaign: Campaign }>(`/campaigns/${id}`);
  },

  async createCampaign(data: { name: string; description?: string; status?: 'ACTIVE' | 'ARCHIVED' }) {
    return api.post<{ success: boolean; campaign: Campaign; message: string }>('/campaigns', data);
  },

  async updateCampaign(id: string, data: { name?: string; description?: string | null; status?: 'ACTIVE' | 'ARCHIVED' }) {
    return api.patch<{ success: boolean; campaign: Campaign; message: string }>(`/campaigns/${id}`, data);
  },

  async deleteCampaign(id: string) {
    return api.delete<{ success: boolean; message: string }>(`/campaigns/${id}`);
  },
};
