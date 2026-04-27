export interface CountryDashboardShareCountry {
  id: number;
  name: string;
}

export interface CountryDashboardShareUser {
  id: number;
  name: string;
  email: string;
}

export interface CountryDashboardShareRole {
  id: number;
  name: string;
}

export interface CountryDashboardShare {
  id: number;
  country_id: number;
  owner_country_user_role_id: number;
  shared_user_role_id: number;
  country?: CountryDashboardShareCountry;
  owner_country_user_role?: {
    id: number;
    user?: CountryDashboardShareUser;
    country?: CountryDashboardShareCountry;
  };
  shared_user_role?: {
    id: number;
    user?: CountryDashboardShareUser;
    role?: CountryDashboardShareRole;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CountryDashboardShareListResponse {
  shares: CountryDashboardShare[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface CreateCountryDashboardShareInput {
  country_id: number;
  shared_user_role_id: number;
}
