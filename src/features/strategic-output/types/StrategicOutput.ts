export interface StrategicOutput {
    id: number,
    name: string,
    country_kpa_id: number
    measures_count: number
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
        nane: string,
    },
}
    measures_count: number
}

export interface  CreateStrategicOutputDTO {
    name: string,
    country_kpa_id: number
}


export interface  UpdateStrategicOutputDTO {
    id: number,
    name: string,
    country_kpa_id: number
}