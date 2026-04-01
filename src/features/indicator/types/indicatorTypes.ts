export interface Indicator {
    id: number, 
    name: string,
    target?: number,
    actual_value?: number,
    type?: {
        id: number,
        name: string,
        is_bottom_up: boolean,
    },
    type_id?: number;
    measure_id: number
}

export interface CreateIndicatorDTO {
  name: string;
  target: number;
  actual_value: number;
  measure_id: number;
  type_id?: number;
}

export interface UpdateIndicatorDTO {
  name: string;
  target: number;
  actual_value: number;
  measure_id: number;
  type_id?: number;
}