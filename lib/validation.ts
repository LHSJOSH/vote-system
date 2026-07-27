import { z } from "zod";

export const voteSchema = z.object({
  submissionId: z.uuid(),
  nickname: z.string().trim().min(2).max(20),
  optionId: z.string().trim().min(1).max(100),
  reason: z.string().trim().min(5).max(500),
});

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "색상은 #RRGGBB 형식이어야 합니다.");

export const optionCreateSchema = z.object({
  name: z.string().trim().min(1).max(40),
  description: z.string().trim().max(120).default(""),
  imageUrl: z.string().trim().url().or(z.literal("")).default(""),
  color: hexColor,
  enabled: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(999),
});

export const optionUpdateSchema = optionCreateSchema.partial().extend({
  id: z.string().trim().min(1),
});

export const optionDeleteSchema = z.object({
  id: z.string().trim().min(1),
});

export const loginSchema = z.object({
  pin: z.string().trim().min(4).max(32),
});
