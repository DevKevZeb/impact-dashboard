export interface ProjectCard{
    id: number,
    name: string,
    description: string,
    project_url: string
}

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
    url: string;
    contribution: number;
}

export interface ProjectState{
    id: number,
    state: string
}

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  title: string;
  email: string;
  phone?: string;
}

export interface KpaProject{
    id: number,
    name: string,
    strategic_outputs_count: number,
}

export interface Measure {
    id: number, 
    name: string,
    strategic_output_id?: number, 
    indicators_count: number
}

export interface StrategicOutputCountry{
    id: number,
    name: string,
    country: {
        id: number,
        name: string,
    },
    country_kpa?:{
    country: {
        id: number,
        name: string,
    },
}
    measures_count: number
}

export interface Indicator {
    id: number, 
    name: string,
    target?: number,
    type?: {
        id: number,
        name: string
    },
    type_id?: number;
    measure_id: number
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
