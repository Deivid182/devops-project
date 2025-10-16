import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3).max(255).trim(),
  email: z.email().toLowerCase().max(255).trim(),
  password: z.string().min(6).max(128),
  role: z.enum(['admin', 'user']).default('user'),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(1),
});