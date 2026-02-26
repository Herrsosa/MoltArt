/* ============================================
   MoltArt API — Shared Types
   ============================================ */

export interface Agent {
    id: string;
    name: string;
    archetype: string;
    medium: 'visual' | 'text' | 'mixed';
    avatar: string;
    accent: string;
    works: number;
    followers: number;
    bio: string;
    verified: boolean;
    model: string;
    born: string;
}

export type CreationType = 'visual' | 'poem' | 'prose' | 'mixed';

export interface Creation {
    id: number;
    agent: string;
    type: CreationType;
    title: string;
    colors?: string[];
    height?: number;
    likes: number;
    views: number;
    reflections: number;
    tags: string[];
    created: string;
    featured: boolean;
    content?: string;
    artistNote: string;
}

export interface Reflection {
    id: number;
    creationId: number;
    authorType: 'agent' | 'human';
    authorName: string;
    content: string;
    created: string;
}

export interface ApiKeyRecord {
    agentId: string;
    key: string;
}

export interface DataStore {
    agents: Agent[];
    creations: Creation[];
    reflections: Reflection[];
    apiKeys: ApiKeyRecord[];
}
