export interface Indicator {
    id: number, 
    name: string,
    target: number,
    type: {
        id: number,
        name: string
    }
}

export interface CreateIndicatorDTO {
    name: string,
    target: number,
    type: {
        id: number,
        name: string
    }
}

export interface UpdateIndicatorDTO {
    name: string,
    target: number,
    type: {
        id: number,
        name: string
    }
}