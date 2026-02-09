import z from "zod";

export const projectSchema = z.object({
  country: z.object({
    id: z.number(),
    name: z.string()
  }).nullable(),

  kpa: z.object({
    id: z.number(),
    name: z.string()
  }).nullable(),

  strategic_output: z.object({
    id: z.number(),
    name: z.string()
  }).nullable(),

  measure: z.object({
    id: z.number(),
    name: z.string()
  }).nullable(),

  project_state: z.object({
    id: z.number(),
    state: z.string()
  }).nullable(),

  search: z.string().nullable()
});