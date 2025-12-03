import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

/**
 * Validation schema for SDG image upload
 */
export const sdgSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "La imagen no debe superar 2MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Solo se permiten archivos JPG, PNG, GIF, WEBP o SVG",
    }),
});

export type SdgFormData = z.infer<typeof sdgSchema>;
