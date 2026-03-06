const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('stockpulse_token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        headers,
        ...options,
    });

    if (!res.ok) {
        let err;
        try {
            err = await res.json();
        } catch (_) {
            err = { error: res.statusText };
        }

        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('stockpulse_token');
            window.dispatchEvent(new CustomEvent('auth:expired'));
        }

        throw new Error(err.error || `Request failed: ${res.status}`);
    }

    return res.json();
}

// Auth API
export interface User {
    id: number;
    email: string;
    created_at?: string;
}

export const authApi = {
    register: (email: string, password: string) =>
        request<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
    login: (email: string, password: string) =>
        request<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    getMe: () =>
        request<User>('/auth/me'),
};

// Stock API
export const stocksApi = {
    getStock: (symbol: string) =>
        request<{ source: string; data: any }>(`/stocks/${symbol.toUpperCase()}`),
};

// Search API (autocomplete)
export interface SearchSuggestion {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
}

export const searchApi = {
    suggestions: (query: string) =>
        request<SearchSuggestion[]>(`/search?q=${encodeURIComponent(query)}`),
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
