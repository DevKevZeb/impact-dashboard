import React, { useEffect, useState } from "react";
import { AsyncSearchSelect } from "./AsyncSearchSelect/AsyncSearchSelect";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


type AgencyFormValue = { id: number; name: string; url: string, contribution: number };
type AgencyRowProps =  { index: number; agency: AgencyFormValue; getMaxForContributor: (index: number) => number; setValue: any; removeAgency: (index: number) => void; fetchAgencies: any; };


export const AgencyRow = React.memo(({index, agency, getMaxForContributor, setValue, removeAgency, fetchAgencies} : AgencyRowProps) => {
    const [sliderValue, setSliderValue] = useState<number>(agency.contribution ?? 0);

    useEffect(() => {
          setSliderValue(agency.contribution ?? 0);
    }, [agency.contribution]);

    return(
        <div className="grid grid-cols-2 gap-3">
        <AsyncSearchSelect value={agency.id ? agency : null} onChange={(v) => { if (!v) return; setValue(`agencies.${index}`, { ...v, contribution: 0 }, { shouldValidate: true, shouldDirty: true, shouldTouch:true }); }} fetchOptions={fetchAgencies} getOptionLabel={(i) => i.name} getOptionKey={(i) => i.id}/>
        <div className="flex space-x-4">
          <Label className="whitespace-nowrap">CONTRIBUTION</Label>
          <Slider min={0} max={100} step={1} value={[sliderValue]} onValueChange={([val]) => { const clamped = Math.min(val, getMaxForContributor(index)); setSliderValue(clamped); setValue(`agencies.${index}.contribution`, clamped, { shouldDirty: true, shouldValidate: true, }); }} className="flex-1 "/>
          <Input type="number" min={0} max={100} value={sliderValue} onChange={(e) => { const val = Number(e.target.value); const clamped = Math.min( Math.max(val, 0), getMaxForContributor(index) ); setSliderValue(clamped); setValue(`agencies.${index}.contribution`, clamped, { shouldDirty: true, shouldValidate: true, }); }} className="w-20 text-right"/>
          <Button type="button" variant="ghost" onClick={() => removeAgency(index)}>
            Remove
          </Button>
        </div>
      </div>

    )
})