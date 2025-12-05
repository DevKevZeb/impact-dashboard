import { z } from "zod";

export const programStateSchema = z.object({
  name: z
    .string()
    .min(2, "The name must have at least 2 characters")
    .max(255, "The name must not exceed 255 characters")
    .trim(),
});

export type ProgramStateFormData = z.infer<typeof programStateSchema>;
