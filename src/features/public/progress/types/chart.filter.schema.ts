import z from "zod";

export const filterSchema = z.object({
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
});