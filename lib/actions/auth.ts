"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { registerSchema, resetPasswordSchema } from "@/lib/validations";
import { WINTER_ARC_PRESET } from "@/lib/habits/winterArcPreset";

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
  winterArcPreset?: boolean;
}) {
  const validated = registerSchema.safeParse(formData);
  if (!validated.success) {
    throw new Error(validated.error.errors[0]?.message || "Invalid registration data");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: validated.data.email.toLowerCase().trim() },
  });

  if (existingUser) {
    throw new Error("An account already exists with this email address");
  }

  const passwordHash = await bcrypt.hash(validated.data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: validated.data.name.trim(),
      email: validated.data.email.toLowerCase().trim(),
      passwordHash,
    },
  });

  // If user selected Winter Arc preset (default true), populate standard habits
  if (validated.data.winterArcPreset !== false) {
    let order = 1;
    for (const preset of WINTER_ARC_PRESET) {
      await prisma.habit.create({
        data: {
          userId: user.id,
          name: preset.name,
          description: preset.description,
          icon: preset.icon,
          category: preset.category,
          sortOrder: order++,
          isActive: true,
        },
      });
    }
  }

  return { success: true, userId: user.id };
}

export async function resetPassword(formData: {
  email: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const validated = resetPasswordSchema.safeParse(formData);
  if (!validated.success) {
    throw new Error(validated.error.errors[0]?.message || "Invalid password reset data");
  }

  const normalizedEmail = validated.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("No account found with this email address");
  }

  const passwordHash = await bcrypt.hash(validated.data.newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { success: true };
}

