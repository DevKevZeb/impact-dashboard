import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

// Contact inline schema
export const contactSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .trim(),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .trim(),
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Must be a valid email")
    .max(254, "Email must not exceed 254 characters")
    .trim(),
  phone: z
    .string()
    .min(7, "Phone must be at least 7 digits")
    .max(15, "Phone must not exceed 15 digits")
    .optional()
    .or(z.literal("")),
});

export const programCreateSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must not exceed 255 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .trim(),
  banner_img: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Image must not exceed 2MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPG, PNG, GIF or WEBP images are allowed"
    )
    .optional(),
  program_url: z
    .string()
    .url("Must be a valid URL")
    .regex(/^https?:\/\//, "URL must use HTTP or HTTPS protocol")
    .optional()
    .or(z.literal("")),
  country_id: z.number().int().min(1).optional(),
  contact: contactSchema, // Nested contact object
  sdg_ids: z.array(z.number().int().min(1)).optional(),
});

export const programUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must not exceed 255 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .trim(),
  banner_img: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Image must not exceed 2MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPG, PNG, GIF or WEBP images are allowed"
    )
    .optional(),
  program_url: z
    .string()
    .url("Must be a valid URL")
    .regex(/^https?:\/\//, "URL must use HTTP or HTTPS protocol")
    .optional()
    .or(z.literal("")),
  contact: contactSchema.extend({
    id: z.number().int().min(1).optional(),
  }),
  program_state_id: z.number().int().min(1, "Must select a state"),
  sdg_ids: z.array(z.number().int().min(1)).optional(),
});

export type ProgramCreateFormData = z.infer<typeof programCreateSchema>;
export type ProgramUpdateFormData = z.infer<typeof programUpdateSchema>;
