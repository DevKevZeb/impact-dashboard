// projects/components/AgencySection.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { UseProjectFormReturn } from "../hooks/useProjectForm";
import { AgencyRow } from "./AgencyRow";

interface Props {
  form: UseProjectFormReturn;
  totalAgencies: number | null;
  fetchAgencies: (params: any) => Promise<any>;
}

export function AgencySection({ form, totalAgencies, fetchAgencies }: Props) {
  const { form: rhf, agenciesFA, agencies, getMaxForAgency, } = form;
  const hasUnselected = agencies?.some((a: any) => !a?.id);
  const reachedLimit = totalAgencies !== null && agenciesFA.fields.length >= totalAgencies;

  return (
    <div className="flex flex-col space-y-4">
      <Label className="text-gray-700">SELECT AGENCY / AGENCIES</Label>

      {agenciesFA.fields.map((field, index) => (
        <div key={field.id}>
          <AgencyRow
            index={index}
            agency={agencies?.[index]}  
            getMaxForContributor={getMaxForAgency}
            setValue={rhf.setValue}
            removeAgency={agenciesFA.remove}
            fetchAgencies={fetchAgencies}
          />

          {Array.isArray(rhf.formState.errors.agencies) &&
            rhf.formState.errors.agencies[index]?.id && (
              <p className="text-sm text-red-600 mt-1">
                {rhf.formState.errors.agencies[index]?.id?.message as string}
              </p>
            )}
        </div>
      ))}

      {rhf.formState.errors.agencies && (
        <p className="text-sm text-red-600">
          {rhf.formState.errors.agencies.message as string}
        </p>
      )}

      {reachedLimit && (
        <p className="text-sm text-gray-500">
          All agencies have been selected.
        </p>
      )}

      <Button type="button" className="btn-tertiary w-fit" disabled={hasUnselected || reachedLimit} onClick={() => agenciesFA.append({ id: 0, name: "", url: "", contribution: 0 })} >
        + Add agency
      </Button>
    </div>
  );
}
