import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAgency } from "../services/agency.api";
import type { UpdateAgencyDto } from "../types/agency.types";

export function useUpdateAgency() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateAgencyDto }) =>
      updateAgency(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agencies"] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const message = err?.response?.data?.message ?? err?.message ?? "Error updating";
      toast.error(message);
    },
  });
}
