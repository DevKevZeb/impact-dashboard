import axios from "axios";
import { mapCountries } from "../mappers/countries.mapper";
import type { Country } from "../types/CountryType";

/**
 * Public Countries API Service
 * 
 * Uses a separate axios instance WITHOUT authentication headers.
 * This allows unauthenticated users (registration page) to fetch countries.
 */

const publicApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

interface PublicCountriesResponse {
  success: boolean;
  message: string;
  data: {
    countries: Country[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

/**
 * Fetch countries list for registration form (no auth required)
 * @param perPage - Number of countries per page (default: 100 to get all)
 * @returns Array of countries with pagination info
 */
export async function getPublicCountries(
  perPage: number = 100
): Promise<{ countries: Country[]; total: number }> {
  const { data } = await publicApiClient.get<PublicCountriesResponse>(
    `/public/countries?per_page=${perPage}`
  );

  return {
    countries: mapCountries(data.data.countries),
    total: data.data.total,
  };
}
