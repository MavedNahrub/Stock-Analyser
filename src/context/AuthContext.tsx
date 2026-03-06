import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User } from '../services/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('stockpulse_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const userData = await authApi.getMe();
                setUser(userData);
            } catch (error) {
                console.error('Failed to restore session:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

        // Listen for token expiration from api.ts
        const handleAuthExpired = () => logout();
        window.addEventListener('auth:expired', handleAuthExpired);

        return () => window.removeEventListener('auth:expired', handleAuthExpired);
    }, [token]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('stockpulse_token', newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('stockpulse_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
