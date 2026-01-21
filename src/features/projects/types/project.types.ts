import type { Contact } from "@/features/programs/types/program.types";
import type { ProjectState } from "@/features/project-states/types/projectstate.types";

export interface Beneficiary {
    id?: number;
    name: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    project_url: string;
    start_date: Date;
    end_date: Date;
    progress: number;
    comments: string;
    project_budget: number;
    contact: Contact;
    beneficiary: Beneficiary;
    projectState: ProjectState;
}

