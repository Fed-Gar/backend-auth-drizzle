import { db } from '../../db';
import { usuarios } from '../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from './types';
import { Request, Response } from 'express';

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password, nombre, rol } = parsed.data;
  const hash = await bcrypt.hash(password, 10);

  const existing = (await db.select().from(usuarios).where(eq(usuarios.email, email)))[0];
  if (existing) return res.status(409).json({ error: 'Email ya registrado' });

  const inserted = await db.insert(usuarios).values({ email, password: hash, nombre, rol }).returning();
  const user = inserted[0];
  return res.status(201).json({ id: user.id, email: user.email, nombre, rol });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const user = (await db.select().from(usuarios).where(eq(usuarios.email, email)))[0];
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, process.env.JWT_SECRET!, { expiresIn: '8h' });
  return res.json({ token });
}

export async function me(req: Request, res: Response) {
  return res.json({ user: (req as any).user });
}
