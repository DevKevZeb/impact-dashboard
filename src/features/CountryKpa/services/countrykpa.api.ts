import { apiClient } from "@/shared/lib/axios";
import type { CreateCountryKpaDTO, UpdateCountryKpaDTO } from "../types/CountryKpaType";
import { toast } from "sonner";

export async function createCountryKpa(dto: CreateCountryKpaDTO) {
  try {
    const payload = {
      id_country: dto.country_id,
      id_kpa: dto.id_kpa,
    };

    const { data } = await apiClient.post("/country-kpas", payload);

    console.log(data)

    toast.success(data.message);
    return data;
  } catch (error: any) {
    handleValidationError(error);
    throw error;
  }
}

export async function updateCountryKpa(id: number, dto: UpdateCountryKpaDTO) {
  try {
    const payload = {
      country_id: dto.country_id,
    };

    const { data } = await apiClient.put(`/country-kpas/${id}`, payload);

    toast.success(data.message);
    return data;
  } catch (error: any) {
    handleValidationError(error);
    throw error;
  }
}

function handleValidationError(error: any) {
  const status = error.response?.status;

  if (status === 422 && error.response?.data?.errors) {
    const errors = error.response.data.errors as Record<string, string[]>;
    Object.values(errors).flat().forEach((msg: string) => {
      toast.error(msg);
    });
  }
}
