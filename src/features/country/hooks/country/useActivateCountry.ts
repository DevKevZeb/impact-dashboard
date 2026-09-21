import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateCountry } from "../../services/country.api";
import { toast } from "sonner";

export function useActivateCountry() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => activateCountry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["country_kpas"] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const message = err?.response?.data?.message ?? err?.message ?? "Error activating country";
      toast.error(message);
    },
  });
}
