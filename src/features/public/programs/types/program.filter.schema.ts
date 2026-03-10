import z from "zod";

const defaultOption = {
  id: 0,
  name: "",
};

const optionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const publicProgramFilterSchema = z.object({
  country: optionSchema.default(defaultOption),
  kpa: optionSchema.default(defaultOption),
  strategic_output: optionSchema.default(defaultOption),
  measure: optionSchema.default(defaultOption),
  program_state: optionSchema.default(defaultOption),
  search: z.string().default(""),
  sort: z.string().default("date_newest"),
});
