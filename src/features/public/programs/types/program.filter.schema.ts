import z from "zod";

export const publicProgramFilterSchema = z.object({
  country: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  kpa: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  strategic_output: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  measure: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  program_state: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  search: z.string().nullable(),
  sort: z.string().nullable(),
});
