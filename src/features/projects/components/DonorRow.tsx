import React, { useEffect, useState } from "react";
import { AsyncSearchSelect } from "./AsyncSearchSelect/AsyncSearchSelect";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";

type DonorFormValue = { id: number; name: string; contribution: number };
type DonorRowProps = { index: number; donor: DonorFormValue; getMaxForDonor: (index: number) => number; setValue: any; removeDonor: (index: number) => void; fetchDonors: any; };


export const DonorRow = React.memo(({ index, donor, getMaxForDonor, setValue, removeDonor, fetchDonors}: DonorRowProps) => {
    const [sliderValue, setSliderValue] = useState<number>(donor.contribution ?? 0);

    useEffect(() => {
      setSliderValue(donor.contribution ?? 0);
    }, [donor.contribution]);

    return (
      <div className="grid lg:grid-cols-2 gap-3">
        <AsyncSearchSelect value={donor.id ? donor : null} onChange={(v) => { setValue(`donors.${index}`, { ...v, contribution: 0 }, { shouldValidate: true, shouldDirty: true, shouldTouch:true }); }} fetchOptions={fetchDonors} getOptionLabel={(i) => i.name} getOptionKey={(i) => i.id}/>
        <div className="flex flex-col space-y-3 md:flex-row space-x-4 items-center">
          <Label className="whitespace-nowrap">CONTRIBUTION</Label>
          <Slider min={0} max={100} step={1} value={[sliderValue]} onValueChange={([val]) => { const clamped = Math.min(val, getMaxForDonor(index)); setSliderValue(clamped); setValue(`donors.${index}.contribution`, clamped, { shouldDirty: true, shouldValidate: true, }); }} className="flex-1 "/>
          <div className="relative w-[90px] flex items-center">
            <Input type="number" min={0} max={100} value={sliderValue} onChange={(e) => { const val = Number(e.target.value); const clamped = Math.min( Math.max(val, 0), getMaxForDonor(index) ); setSliderValue(clamped); setValue(`donors.${index}.contribution`, clamped, { shouldDirty: true, shouldValidate: true, }); }} className="w-20 text-center input-default no-spinner"/>
            <Percent className="absolute  right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
          <Button className="text-red-600 cursor-pointer" type="button" variant="ghost" onClick={() => removeDonor(index)}>
            Remove
          </Button>
        </div>
      </div>
    );
  }
);
