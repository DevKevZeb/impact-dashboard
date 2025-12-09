import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

// Contact inline schema
export const contactSchema = z.object({
  first_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no debe exceder 50 caracteres")
    .trim(),
  last_name: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no debe exceder 50 caracteres")
    .trim(),
  title: z
    .string()
    .min(2, "El título debe tener al menos 2 caracteres")
    .max(100, "El título no debe exceder 100 caracteres")
    .trim(),
  email: z
    .string()
    .email("Debe ser un email válido")
    .max(254, "El email no debe exceder 254 caracteres")
    .trim(),
  phone: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(15, "El teléfono no debe exceder 15 dígitos")
    .optional()
    .or(z.literal("")),
});

export const programCreateSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre no debe exceder 255 caracteres")
    .trim(),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(2000, "La descripción no debe exceder 2000 caracteres")
    .trim(),
  banner_img: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "La imagen no debe exceder 2MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Solo se permiten imágenes JPG, PNG, GIF o WEBP"
    )
    .optional(),
  program_url: z
    .string()
    .url("Debe ser una URL válida")
    .regex(/^https?:\/\//, "La URL debe usar protocolo HTTP o HTTPS")
    .optional()
    .or(z.literal("")),
  contact: contactSchema, // Nested contact object
  sdg_ids: z.array(z.number().int().min(1)).optional(),
});

export const programUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre no debe exceder 255 caracteres")
    .trim(),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(2000, "La descripción no debe exceder 2000 caracteres")
    .trim(),
  banner_img: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "La imagen no debe exceder 2MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Solo se permiten imágenes JPG, PNG, GIF o WEBP"
    )
    .optional(),
  program_url: z
    .string()
    .url("Debe ser una URL válida")
    .regex(/^https?:\/\//, "La URL debe usar protocolo HTTP o HTTPS")
    .optional()
    .or(z.literal("")),
  contact: contactSchema.extend({
    id: z.number().int().min(1, "ID del contacto requerido"), // ID del contacto existente
  }),
  program_state_id: z.number().int().min(1, "Debe seleccionar un estado"),
  sdg_ids: z.array(z.number().int().min(1)).optional(),
});

export type ProgramCreateFormData = z.infer<typeof programCreateSchema>;
export type ProgramUpdateFormData = z.infer<typeof programUpdateSchema>;
