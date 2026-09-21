// projects/components/DonorSection.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { UseProjectFormReturn } from "../hooks/useProjectForm";
import { DonorRow } from "./DonorRow";
import type { SetFieldValue } from "./AgencyRow";
import type { FetchOptions } from "@/shared/components/AsyncSearchSelect/asyncSearch.type";
import type { Donor } from "@/features/donors/types/donor.types";

interface Props {
  form: UseProjectFormReturn;
  totalDonors: number | null;
  fetchDonors: FetchOptions<Donor>;
}

export function DonorSection({ form, totalDonors, fetchDonors }: Props) {
  const { form: rhf, donorsFA, donors, getMaxForDonor } = form;

  const hasUnselected = donors?.some((d) => !d?.id);
  const reachedLimit = typeof totalDonors === "number" && donorsFA.fields.length >= totalDonors;


  return (
    <div className="flex flex-col space-y-4">
      <Label className="text-gray-700">SELECT DONOR(S)</Label>

      {donorsFA.fields.map((field, index) => (
        <div key={field.id}>
          <DonorRow index={index} donor={donors?.[index]} getMaxForDonor={getMaxForDonor} setValue={rhf.setValue as SetFieldValue} removeDonor={donorsFA.remove} fetchDonors={fetchDonors} />

          {Array.isArray(rhf.formState.errors.donors) &&
            rhf.formState.errors.donors[index]?.id && (
              <p className="text-sm text-red-600 mt-1">
                {rhf.formState.errors.donors[index]?.id?.message as string}
              </p>
            )}
        </div>
      ))}

      {rhf.formState.errors.donors && (
        <p className="text-sm text-red-600">
          {rhf.formState.errors.donors.message as string}
        </p>
      )}

      {reachedLimit ? (
        <p className="text-sm py-2 text-gray-500">
          All donors have been selected.
        </p>
      ) : totalDonors === null ? (
        <p className="text-sm text-gray-400">Loading donors info…</p>
      ) : 
        <Button type="button" className="btn-tertiary w-fit" disabled={hasUnselected || reachedLimit} onClick={() =>donorsFA.append({ id: 0, name: "", contribution: 0 })}>
          + Add donor
        </Button>
      }

      
    </div>
  );
}
