import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as Auth from '../modules/auth/controller';

const router = Router();

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.header('Authorization');
  if (!hdr) return res.status(401).json({ error: 'Missing Authorization header' });
  try {
    const token = hdr.replace(/^Bearer\s+/i, '');
    (req as any).user = jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/health', (_req, res) => res.json({ ok: true, service: 'auth' }));
router.post('/auth/register', Auth.register);
router.post('/auth/login', Auth.login);
router.get('/auth/me', requireAuth, Auth.me);

export default router;
