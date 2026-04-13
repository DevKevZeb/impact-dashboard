import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(3, "The project name must have at least 3 characters").max(255, "The project name must not exceed 255 characters"),
    description: z.string().min(10, "Description must have at least 10 characters").max(2000, "Description must not exceed 2000 characters"),
    kpa: z.object({
        id: z.number(),
        name: z.string(),
        strategic_outputs_count: z.number(),
    }).nullable().refine(Boolean, { message: "KPA is required" }),

    strategicOutput: z.object({
        id: z.number(),
        name: z.string().min(1, "The strategic Output is required"),
        country: z.object({ id: z.number(), name: z.string() }),
        measures_count: z.number()
    }).nullable().refine(Boolean, { message: "Strategic Output is required" }),

    measure: z.object({
        id: z.number(),
        name: z.string().min(1, "The measure is required"),
        indicators_count: z.number()
    }).nullable().refine(Boolean, { message: "Measure is required" }),

    indicators: z.array(
        z.object({
        id: z.number().min(1, "You must select an indicator"),
        name: z.string().min(1),
        })
    ).min(1, "At least one indicator is required"),


    start_date: z.date().nullable().refine(Boolean, {message: "Start date is required",}),
    end_date: z.date().nullable().refine(Boolean, {message: "End date is required",}),


    donors: z.array(
        z.object({
            id: z.number( "A donor is required").min(1, "You must select a donor"),
            name: z.string( "A donor is required").min(1),
            contribution: z.number().min(0, "Contribution must be ≥ 0").max(100, "Contribution must be ≤ 100"),
        }, "A donor is required")
    ).min(1, "At least one donor is required"),

    agencies: z.array(
        z.object({
            id: z.number( "A donor is required").min(1, "You must select an agency"),
            name: z.string( "A donor is required").min(1,  "A donor is required"),
            url: z.string().optional().refine(
                (value) => !value || /^(https?:\/\/).+/i.test(value),
                { message: "The agency URL must start with http:// or https://." }
            ),
            contribution: z.number().min(0, "Contribution must be ≥ 0").max(100, "Contribution must be ≤ 100"),
        }, "An agency is required")
    ).min(1, "At least one agency is required"),

    project_url: z.preprocess(v => v === undefined ? "" : v, z.string()),
    budget: z.preprocess((v) => {   if (v === undefined || v === "" || Number.isNaN(Number(v)))return 0; return Number(v);}, z.number().min(0, "Contribution must be ≥ 0")),
        weight: z.preprocess(
            (v) => {
                if (v === undefined || v === "" || Number.isNaN(Number(v))) return 0;
                return Number(v);
            },
            z.number().min(0, "Weight must be ≥ 0").max(1, "Weight must be ≤ 1")
        ),


    beneficiary: z.object({
        id: z.number("A beneficiary is required").min(1, "A beneficiary is required"),
        name: z.string("A beneficiary is required").min(1, "A beneficiary is required"),
    }).nullable().refine(Boolean, { message: "A beneficiary is required" }),

    contact: z.object({
        id: z.number().optional(),
        first_name: z.string().min(1, "The contact first name must not be empty").min(2, "The contact first name must have at least 2 characters").max(50, "The contact first name must not exceed 50 characters"),
        last_name: z.string().min(1, "The contact last name must not be empty").min(2, "The contact last name must have at least 2 characters").max(50, "The contact last name must not exceed 50 characters"),
        title: z.string().min(1, "The contact title must not be empty").min(2, "The contact title must have at least 2 characters").max(100, "The contact title must not exceed 100 characters"),
        email: z.string().min(1, "The contact email must not be empty").email("The contact email must have a valid format").max(254, "The contact email exceeds the maximum allowed length (254 characters)"),
        phone: z.string().optional().refine(
            (value) => value === undefined || value === "" || /^\+?[0-9]{7,15}$/.test(value),
            { message: "The phone number format is not valid – use international format" }
        ),
    }),

    progress: z.number().min(0).max(100),
    comments: z.string().max(1000, "Comments must not exceed 1000 characters").optional(),
    program_id: z.number().min(1),

    project_state: z.object({
      id: z.number("Project state is required").min(1, "Project state is required"),
      state: z.string("Project state is required").min(1, "Project state is required")
    }).nullable().refine(Boolean, { message: "Project state is required" }),
    
})
.refine((data) => !!data.start_date, {
  message: "Start date is required",
  path: ["start_date"],
})
.refine((data) => !!data.end_date, {
  message: "End date is required",
  path: ["end_date"],
})
.refine((data) => data.end_date !== null && data.start_date !== null && data.end_date >= data.start_date,
  {
    message: "End date must be after start date",
    path: ["end_date"],
  }
);

export type ProjectFormValues = z.infer<typeof projectSchema>;