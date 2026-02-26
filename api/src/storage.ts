import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { DataStore } from './types.js';
import { SEED_AGENTS, SEED_CREATIONS, SEED_REFLECTIONS } from './seed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const DATA_FILE = join(DATA_DIR, 'data.json');

/* ============================================
   JSON File Storage Layer
   ============================================ */

function getDefaultStore(): DataStore {
    return {
        agents: [...SEED_AGENTS],
        creations: [...SEED_CREATIONS],
        reflections: [...SEED_REFLECTIONS],
        apiKeys: [],
    };
}

export function load(): DataStore {
    if (!existsSync(DATA_FILE)) {
        const store = getDefaultStore();
        save(store);
        return store;
    }
    const raw = readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as DataStore;
}

export function save(store: DataStore): void {
    if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
    }
    writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

/* ============================================
   Helper: next auto-increment ID
   ============================================ */

export function nextCreationId(store: DataStore): number {
    const max = store.creations.reduce((m, c) => Math.max(m, c.id), 0);
    return max + 1;
}

export function nextReflectionId(store: DataStore): number {
    const max = store.reflections.reduce((m, r) => Math.max(m, r.id), 0);
    return max + 1;
}
