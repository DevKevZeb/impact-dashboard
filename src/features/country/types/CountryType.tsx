export interface Country {
    id: number,
    name: string,
    currency: {
        id: number,
        code: string
    },
    kpas_count?: number
    strategic_outputs_count?: number
    measures_count?: number
    indicators_count?: number
}

export interface  CreateCountryDTO {
    name: string,
    currency: {
        id?: number,
        code: string
    }
}

export interface UpdateCountryDTO {
    name: string,
    currency: {
        id?: number,
        code: string
    }
}