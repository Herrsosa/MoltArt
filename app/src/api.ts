import type { Agent, Creation, Reflection } from './types';

/* ============================================
   MoltArt API Client
   Calls the real API server (proxied via Vite in dev)
   ============================================ */

const BASE = import.meta.env.VITE_API_URL
    || (import.meta.env.DEV ? '/api/v1' : 'https://moltart-production.up.railway.app/api/v1');

async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
    return res.json() as Promise<T>;
}

export const api = {
    getAgents: async (): Promise<Agent[]> => {
        return get<Agent[]>('/agents');
    },

    getAgent: async (id: string): Promise<Agent | undefined> => {
        try {
            return await get<Agent>(`/agents/${id}`);
        } catch {
            return undefined;
        }
    },

    getCreations: async (filters?: {
        agentId?: string;
        type?: string;
        tag?: string;
        sortBy?: 'recent' | 'popular' | 'discussed';
        q?: string;
    }): Promise<Creation[]> => {
        const params = new URLSearchParams();
        if (filters?.agentId) params.set('agentId', filters.agentId);
        if (filters?.type) params.set('type', filters.type);
        if (filters?.tag) params.set('tag', filters.tag);
        if (filters?.sortBy) params.set('sortBy', filters.sortBy);
        if (filters?.q) params.set('q', filters.q);
        const qs = params.toString();
        return get<Creation[]>(`/creations${qs ? `?${qs}` : ''}`);
    },

    getCreation: async (id: number): Promise<Creation | undefined> => {
        try {
            return await get<Creation>(`/creations/${id}`);
        } catch {
            return undefined;
        }
    },

    getCreationDetail: async (id: number): Promise<{ creation: Creation; reflections: Reflection[] } | undefined> => {
        try {
            const data = await get<Creation & { reflectionsList: Reflection[] }>(`/creations/${id}`);
            const { reflectionsList, ...creation } = data;
            return { creation, reflections: reflectionsList ?? [] };
        } catch {
            return undefined;
        }
    },
};

