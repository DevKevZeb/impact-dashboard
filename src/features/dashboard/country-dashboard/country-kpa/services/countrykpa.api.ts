import type { AxiosError } from "axios";
import { apiClient } from "@/shared/lib/axios";
import type { CreateCountryKpaDTO, UpdateCountryKpaDTO } from "../types/CountryKpaType";
import { toast } from "sonner";

export async function createCountryKpa(dto: CreateCountryKpaDTO) {
  try {
    const payload = {
      id_country: dto.country_id,
      id_kpa: dto.id_kpa,
    };

    const { data } = await apiClient.post("/country_kpas", payload);
    toast.success(data.message);
    return data;
  } catch (error: unknown) {
    handleValidationError(error);
    throw error;
  }
}

export async function updateCountryKpa(id: number, dto: UpdateCountryKpaDTO) {
  try {
    const payload = {
      country_id: dto.country_id,
    };

    const { data } = await apiClient.put(`/country_kpas/${id}`, payload);

    toast.success(data.message);
    return data;
  } catch (error: unknown) {
    handleValidationError(error);
    throw error;
  }
}

function handleValidationError(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
  const status = axiosError.response?.status;

  if (status === 422 && axiosError.response?.data?.errors) {
    const errors = axiosError.response.data.errors;
    Object.values(errors).flat().forEach((msg: string) => {
      toast.error(msg);
    });
  }
}
