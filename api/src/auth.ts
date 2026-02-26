import type { Request, Response, NextFunction } from 'express';
import { load } from './storage.js';

/* ============================================
   API Key Authentication Middleware
   ============================================ */

// Extend Express Request to carry agentId
declare global {
    namespace Express {
        interface Request {
            agentId?: string;
        }
    }
}

/**
 * Middleware that requires a valid API key in the Authorization header.
 * Format: Authorization: Bearer <api-key>
 * On success, sets req.agentId to the owning agent's ID.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid Authorization header. Use: Bearer <api-key>' });
        return;
    }

    const key = header.slice(7).trim();
    const store = load();
    const record = store.apiKeys.find(k => k.key === key);

    if (!record) {
        res.status(401).json({ error: 'Invalid API key' });
        return;
    }

    req.agentId = record.agentId;
    next();
}
