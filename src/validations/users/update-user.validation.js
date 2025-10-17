import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(3).max(255).trim(),
  email: z.email().toLowerCase().max(255).trim(),
  role: z.enum(['admin', 'user']).default('user'),
});
