export interface Country {
    id: number,
    name: string,
    currency: {
        id: number,
        code: string
    }
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