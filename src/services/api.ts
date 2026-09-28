export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any;
}

const API_BASE = (import.meta as any).env?.VITE_API_BASE || '/api';

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('lp_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle file downloads
  const contentType = response.headers.get('content-type');
  if (contentType && (contentType.includes('text/csv') || contentType.includes('image/'))) {
    return (await response.blob()) as unknown as T;
  }

  const data = await response.json();

  if (!response.ok || data.success === false) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const err: any = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  get: <T = any>(url: string, headers?: Record<string, string>) =>
    request<T>(url, { method: 'GET', headers }),
  post: <T = any>(url: string, body?: any, headers?: Record<string, string>) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body), headers }),
  patch: <T = any>(url: string, body?: any, headers?: Record<string, string>) =>
    request<T>(url, { method: 'PATCH', body: JSON.stringify(body), headers }),
  delete: <T = any>(url: string, headers?: Record<string, string>) =>
    request<T>(url, { method: 'DELETE', headers }),
};
