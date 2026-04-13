import type { Indicator } from "@/features/indicator/types/indicatorTypes";
import type {  KpaProject } from "@/features/kpa/types/KpaType";
import type { Measure } from "@/features/measures/types/measureTypes";
import type { Contact } from "@/features/programs/types/program.types";
import type { ProjectState } from "@/features/project-states/types/projectstate.types";
import type { StrategicOutputCountry } from "@/features/strategic-output/types/StrategicOutput";
export interface Beneficiary {
    id: number;
    name: string;
}

export interface ProjectDonor{
    id?: number;
    name: string;
    contribution: number;
}

export interface ProjectAgency{
    id?: number;
    name: string;
    url?: string;
    contribution: number;
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
    budget: number;
    weight: number;
    contact: Contact;
    beneficiary: Beneficiary;
    project_state: ProjectState;
    kpa: KpaProject;
    measure: Measure;
    strategic_output: StrategicOutputCountry;
    donors: ProjectDonor[];
    agencies: ProjectAgency[];  
    program_id: number;
    indicators: Indicator[];
}

export interface ProjectDTO {
    name: string;
    description: string;
    project_url: string;
    start_date: Date;
    end_date: Date;
    progress: number;
    comments: string;
    budget: number;
    weight: number;
    contact: Contact;
    beneficiary: Beneficiary;
    project_state: ProjectState;
    kpa: KpaProject;
    measure: Measure;
    strategic_output: StrategicOutputCountry;
    donors: ProjectDonor[];
    agencies: ProjectAgency[];  
    program_id: number;
    indicators: Indicator[];
}

export interface ProjectTable {
    id: number;
    name: string;
    description: string;
    project_url: string;
    start_date: Date;
    end_date: Date;
    progress: number;
    comments: string;
    budget: number;
    weight?: number;
    state: ProjectState;
    program_id: number;
}