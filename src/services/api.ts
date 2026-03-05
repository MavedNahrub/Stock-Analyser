const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || `Request failed: ${res.status}`);
    }

    return res.json();
}

// Stock API
export const stocksApi = {
    getStock: (symbol: string) =>
        request<{ source: string; data: any }>(`/stocks/${symbol.toUpperCase()}`),
};

// Portfolio API
export interface PortfolioEntry {
    id: number;
    symbol: string;
    company_name: string;
    quantity: number;
    purchase_price: number;
    added_at: string;
}

export const portfolioApi = {
    getAll: () => request<PortfolioEntry[]>('/portfolio'),
    add: (entry: { symbol: string; company_name: string; quantity: number; purchase_price: number }) =>
        request<PortfolioEntry>('/portfolio', { method: 'POST', body: JSON.stringify(entry) }),
    remove: (id: number) =>
        request<{ deleted: PortfolioEntry }>(`/portfolio/${id}`, { method: 'DELETE' }),
};

// Alerts API
export interface AlertEntry {
    id: number;
    symbol: string;
    target_price: number;
    direction: 'above' | 'below';
    is_triggered: boolean;
    created_at: string;
}

export const alertsApi = {
    getAll: () => request<AlertEntry[]>('/alerts'),
    create: (alert: { symbol: string; target_price: number; direction: string }) =>
        request<AlertEntry>('/alerts', { method: 'POST', body: JSON.stringify(alert) }),
    remove: (id: number) =>
        request<{ deleted: AlertEntry }>(`/alerts/${id}`, { method: 'DELETE' }),
};
