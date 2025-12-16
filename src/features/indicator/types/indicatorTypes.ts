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

export interface CreateIndicatorDTO {
  name: string;
  target: number;
  measure_id: number;
  type_id?: number;
}

export interface UpdateIndicatorDTO {
  name: string;
  target: number;
  measure_id: number;
  type_id?: number;
}