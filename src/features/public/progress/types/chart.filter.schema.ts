import z from "zod";

export const filterSchema = z.object({
  country: z.object({
    id: z.number(),
    name: z.string()
  }).nullable(),

  category: z.enum(["overall", "kpa", "strategic_output", "measure"]),

  strategic_output: z.object({
    id: z.number(),
    name: z.string()
  }).nullable(),

  measure: z.object({
    id: z.number(),
    name: z.string()
  }).nullable(),
});
