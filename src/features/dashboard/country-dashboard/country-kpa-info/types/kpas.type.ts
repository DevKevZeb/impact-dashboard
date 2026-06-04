export interface IndicatorImplementation {
    id: number;
    name: string;
    target?: number | string;
    actual_value?: number | null;
    implementation: number;
    type?: {
        id?: number;
        name?: string;
        is_bottom_up?: boolean;
    };
}

export interface MeasureImplementation {
    id: number;
    name: string;
    implementation: number;
    indicators_count: number;
    indicators: IndicatorImplementation[];
}

export interface StrategicOutputImplementation {
    id: number;
    name: string;
    implementation: number;
    measures_count: number;
    indicators_count: number;
    measures: MeasureImplementation[];
}

export interface CountryKpaImplementation {
    id: number;
    id_kpa: number;
    name: string;
    implementation: number;
    strategic_outputs_count: number;
    measures_count: number;
    indicators_count: number;
    strategic_outputs: StrategicOutputImplementation[];
}

export interface CountryDashboardImplementationResponse {
    country: {
        id: number;
        name: string;
        currency_id?: number | null;
        active?: boolean;
    };
    kpas: CountryKpaImplementation[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}