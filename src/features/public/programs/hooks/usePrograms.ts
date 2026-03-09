import { useQuery } from "@tanstack/react-query";
import { getPaginatedPrograms, getProgramById } from "../services/programs.api";
import type { ProgramFindDTO } from "../types/findDTO";

export function usePublicPrograms(page: number, perPage: number, filters: ProgramFindDTO | null) {
  return useQuery({
    queryKey: ["public-programs", "list", page, perPage, filters],
    queryFn: () => getPaginatedPrograms(page, perPage, filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 10,
  });
}

export function usePublicProgram(id?: number) {
  return useQuery({
    queryKey: ["public-program", id],
    queryFn: () => getProgramById(id!),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: "always",
  });
}
