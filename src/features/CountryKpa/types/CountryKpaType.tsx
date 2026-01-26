export interface CreateCountryKpaDTO {
  country_id: number;
  id_kpa: number;
}

export interface UpdateCountryKpaDTO {
  country_id: number;
  id_kpa: number;
}

export interface CountryOption {
  id: number;
  name: string;
}

export interface KpaOption {
  id: number;
  name: string;
}
