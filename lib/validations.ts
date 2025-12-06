import { z } from 'zod';

// Validación para registro de usuario
export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Validación para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Validación para crear producto
export const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo'),
  stock: z.number().int().nonnegative('El stock no puede ser negativo').default(0),
});

// Validación para actualizar producto
export const updateProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo').optional(),
  stock: z.number().int().nonnegative('El stock no puede ser negativo').optional(),
});

// Validación para crear log
export const createLogSchema = z.object({
  action: z.string().min(1, 'La acción es requerida'),
  metadata: z.record(z.any()).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateLogInput = z.infer<typeof createLogSchema>;
