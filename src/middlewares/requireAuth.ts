import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.header('Authorization');
  if (!hdr) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = hdr.replace(/^Bearer\s+/i, '');
  try {
    (req as any).user = jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
