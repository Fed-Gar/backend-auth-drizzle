import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nombre: z.string().min(1),
  rol: z.string().min(1)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
