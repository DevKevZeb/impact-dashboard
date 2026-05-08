import React, { useEffect, useState } from "react";
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Percent } from "lucide-react";

type AgencyFormValue = {
  id: number;
  name: string;
  url?: string;
  contribution: number;
};

type AgencyRowProps = {
  index: number;
  agency?: AgencyFormValue;
  getMaxForContributor: (index: number) => number;
  setValue: any;
  removeAgency: (index: number) => void;
  fetchAgencies: any;
};

export const AgencyRow = React.memo(
  ({
    index,
    agency,
    getMaxForContributor,
    setValue,
    removeAgency,
    fetchAgencies,
  }: AgencyRowProps) => {
    if (!agency) return null; 

    const contribution = agency.contribution ?? 0;
    const max = getMaxForContributor(index);
    const [contributionInput, setContributionInput] = useState(
      contribution === 0 ? "0" : String(contribution)
    );

    useEffect(() => {
      setContributionInput(contribution === 0 ? "0" : String(contribution));
    }, [contribution]);

    const commitContribution = (rawValue: string) => {
      const normalizedValue = rawValue.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

      if (normalizedValue === "") {
        setContributionInput("0");
        setValue(`agencies.${index}.contribution`, 0, {
          shouldDirty: true,
          shouldValidate: true,
        });
        return;
      }

      const clamped = Math.min(Number(normalizedValue), max);
      setContributionInput(String(clamped));
      setValue(`agencies.${index}.contribution`, clamped, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };

    return (
      <div className="grid lg:grid-cols-2 gap-3">
        <div>
          <AsyncSearchSelect
            enab={false} 
            value={agency.id ? agency : null}
            onChange={(v) => {
              setValue(
                `agencies.${index}`,
                { ...v, contribution: 0 },
                { shouldDirty: true, shouldValidate: true }
              );
            }}
            fetchOptions={fetchAgencies}
            getOptionLabel={(i) => i.name}
            getOptionKey={(i) => i.id}
          />

          <div className="p-2 bg-blue-100 mt-2 rounded-sm border border-gray-300">
            <Label className="flex items-center gap-2 text-gray-700">
              URL:
              {agency.id && agency.url ? (
                <a
                  href={agency.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 underline underline-offset-2"
                >
                  {agency.url}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-sm font-medium text-gray-400">
                  N/A
                </span>
              )}
            </Label>
          </div>
        </div>

        <div className="flex flex-col space-y-3 md:flex-row space-x-4 items-center">
          <Label className="whitespace-nowrap text-gray-700">
            CONTRIBUTION
          </Label>

          <Slider
            min={0}
            max={100}
            step={1}
            value={[contribution]}
            onValueChange={([val]) => {
              const clamped = Math.min(val, max);
              setValue(`agencies.${index}.contribution`, clamped, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            className="flex-1"
          />

          <div className="relative w-[90px] flex items-center">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              max={max}
              value={contributionInput}
              onFocus={(e) => {
                if (e.currentTarget.value === "0") {
                  e.currentTarget.select();
                  setContributionInput("");
                }
              }}
              onChange={(e) => {
                const nextValue = e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
                setContributionInput(nextValue);

                const numericValue = nextValue === "" ? 0 : Math.min(Number(nextValue), max);
                setValue(`agencies.${index}.contribution`, numericValue, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              onBlur={() => commitContribution(contributionInput)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitContribution(contributionInput);
                }
              }}
              placeholder="0"
              className="text-center input-default no-spinner"
            />
            <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          <Button
            className="text-red-600 cursor-pointer"
            type="button"
            variant="ghost"
            onClick={() => removeAgency(index)}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }
);
