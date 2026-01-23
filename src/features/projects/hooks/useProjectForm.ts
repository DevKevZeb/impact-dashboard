// projects/hooks/useProjectForm.ts

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { projectSchema } from "../types/project.schema";
import type { Project } from "../types/project.types";
import { mapProjectToForm } from "../mappers/project.mapper";

type Mode = "create" | "edit";

export function getDefaultProjectValues(programId: number) {
  return {
    name: "",
    description: "",
    kpa: null,
    strategicOutput: null,
    measure: null,
    indicators: [],
    start_date: null,
    end_date: null,
    donors: [],
    agencies: [],
    project_url: undefined,
    budget: 0,
    contact: {
      first_name: "",
      last_name: "",
      title: "",
      email: "",
      phone: "",
    },
    comments: "",
    program_id: programId,
    beneficiary: null,
    progress: 0,
    project_state: null,
  };
}

export function useProjectForm( mode: Mode, programId: number, project?: Project ) {
    const form = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: getDefaultProjectValues(programId),
    });

    const { control, reset } = form;

    const indicatorsFA = useFieldArray({ control, name: "indicators", });

    const donorsFA = useFieldArray({ control, name: "donors", });

    const agenciesFA = useFieldArray({ control, name: "agencies", });

    useEffect(() => {
        if (mode === "edit" && project) {
        reset(mapProjectToForm(project));
        }
    }, [mode, project, reset]);

    const donors = useWatch({ control, name: "donors" });
    const agencies = useWatch({ control, name: "agencies" });
    const indicators = useWatch({ control, name: "indicators" });

    const getTotalContributionUsed = () => {
        const donorsTotal = donors?.reduce((s, d) => s + (d?.contribution ?? 0), 0) ?? 0;
        const agenciesTotal = agencies?.reduce((s, a) => s + (a?.contribution ?? 0), 0) ?? 0;
        return donorsTotal + agenciesTotal;
    };

    const getMaxForDonor = (index: number) => {
        const current = donors?.[index]?.contribution ?? 0;
        return Math.max(0, 100 - (getTotalContributionUsed() - current));
    };

    const getMaxForAgency = (index: number) => {
        const current = agencies?.[index]?.contribution ?? 0;
        return Math.max(0, 100 - (getTotalContributionUsed() - current));
    };
    const excludedDonorIds = (donors ?? [])
    .map((d) => d?.id)
    .filter((id): id is number => typeof id === "number" && id > 0);

    const excludedAgencyIds = (agencies ?? [])
    .map((a) => a?.id)
    .filter((id): id is number => typeof id === "number" && id > 0);

    const excludedIndicatorIds = (indicators ?? [])
    .map((i) => i?.id)
    .filter((id): id is number => typeof id === "number" && id > 0);

    return {
        form,
        indicatorsFA,
        donorsFA,
        agenciesFA,
        donors,
        agencies,
        indicators,
        excludedDonorIds,
        excludedAgencyIds,
        excludedIndicatorIds,
        getMaxForDonor,
        getMaxForAgency,
    };
}

export type UseProjectFormReturn = ReturnType<typeof useProjectForm>;
