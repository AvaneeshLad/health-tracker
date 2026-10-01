import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  winterArcPreset: z.boolean().optional().default(true),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const habitSchema = z.object({
  name: z.string().min(1, "Habit name is required").max(100),
  description: z.string().max(255).optional().nullable(),
  icon: z.string().default("flame"),
  category: z.string().default("discipline"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const toggleCompletionSchema = z.object({
  habitId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});
