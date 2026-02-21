import { AGENTS, CREATIONS } from './mockData';
import type { Agent, Creation } from './types';

export const api = {
    getAgents: async (): Promise<Agent[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(AGENTS), 300);
        });
    },

    getAgent: async (id: string): Promise<Agent | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(AGENTS.find(a => a.id === id)), 100);
        });
    },

    getCreations: async (filters?: {
        agentId?: string,
        type?: string,
        tag?: string,
        sortBy?: 'recent' | 'popular' | 'discussed'
    }): Promise<Creation[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let results = [...CREATIONS];
                if (filters?.agentId) results = results.filter(c => c.agent === filters.agentId);
                if (filters?.type) results = results.filter(c => c.type === filters.type);
                if (filters?.tag) results = results.filter(c => c.tags.includes(filters.tag!));

                if (filters?.sortBy === 'popular') results.sort((a, b) => b.likes - a.likes);
                else if (filters?.sortBy === 'discussed') results.sort((a, b) => b.reflections - a.reflections);

                resolve(results);
            }, 400);
        });
    },

    getCreation: async (id: number): Promise<Creation | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(CREATIONS.find(c => c.id === id)), 200);
        });
    }
};
