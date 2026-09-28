import { api } from './api';

export const adminService = {
  async getOverview() {
    return api.get<{
      success: boolean;
      stats: {
        users: { total: number; active: number; suspended: number };
        links: { total: number; active: number; disabled: number; expired: number; blocked: number };
        traffic: { totalEvents: number; humanEvents: number; botEvents: number; qrAttributedVisits: number };
        campaigns: { total: number };
      };
    }>('/admin/overview');
  },

  async getUsers(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);

    return api.get<{
      success: boolean;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      users: any[];
    }>(`/admin/users?${searchParams.toString()}`);
  },

  async suspendUser(id: string, reason?: string) {
    return api.post<{ success: boolean; message: string }>(`/admin/users/${id}/suspend`, { reason });
  },

  async reactivateUser(id: string) {
    return api.post<{ success: boolean; message: string }>(`/admin/users/${id}/reactivate`);
  },

  async getLinks(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);

    return api.get<{
      success: boolean;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      links: any[];
    }>(`/admin/links?${searchParams.toString()}`);
  },

  async blockLink(id: string, reason?: string) {
    return api.post<{ success: boolean; message: string }>(`/admin/links/${id}/block`, { reason });
  },

  async unblockLink(id: string) {
    return api.post<{ success: boolean; message: string }>(`/admin/links/${id}/unblock`);
  },

  async getBlockedDomains() {
    return api.get<{ success: boolean; domains: any[] }>('/admin/blocked-domains');
  },

  async addBlockedDomain(domain: string, reason?: string) {
    return api.post<{ success: boolean; domain: any; message: string }>('/admin/blocked-domains', { domain, reason });
  },

  async removeBlockedDomain(id: string) {
    return api.delete<{ success: boolean; message: string }>(`/admin/blocked-domains/${id}`);
  },

  async getAuditLogs(params?: { page?: number; limit?: number; action?: string; targetType?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.action) searchParams.set('action', params.action);
    if (params?.targetType) searchParams.set('targetType', params.targetType);

    return api.get<{
      success: boolean;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      logs: any[];
    }>(`/admin/audit-logs?${searchParams.toString()}`);
  },

  async getSystemHealth() {
    return api.get<{
      success: boolean;
      health: {
        status: string;
        timestamp: string;
        uptimeSeconds: number;
        database: { status: string; latencyMs: number; provider: string };
        redis: { connected: boolean; mode: string; inMemoryKeys: number };
        queue: { status: string; pendingJobs: number };
        memory: { rssMb: number; heapUsedMb: number };
      };
    }>('/admin/system');
  },
};
