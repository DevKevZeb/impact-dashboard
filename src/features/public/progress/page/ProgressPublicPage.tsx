import { Controller, useForm, useWatch  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Banner from "../../components/Banner"
import { Button } from "@/components/ui/button"
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect"
import type { KPA } from "../../projects/types/kpa.type"
import { useEffect, useState } from "react"
import { filterSchema } from "../types/chart.filter.schema";
import type { StrategicOutput } from "../../projects/types/strategic.output.type";
import { fetchMeasuresForSelect, fetchStrategicOutputsForSelect } from "../../projects/services/projects.filters.api";
import { fetchKPAsForSelect } from "../services/progress.filters.api";
import type { Measure } from "../../projects/types/measure.type";
import OverallSection from "../components/sections/OverallSection";
import SortSelect from "../../components/SortSelect";
import KpaSection from "../components/sections/KpaSection";

const OPTIONS = [
  { value: "overall", label: "Overall Strategy" },
  { value: "kpas_information", label: "KPAs Information" },
];

export default function ProgressPublicPage(){
    const [sort, setSort] = useState("overall");
    const form = useForm<any>({
        resolver: zodResolver(filterSchema),
        defaultValues: {kpa: null, strategic_output: null, measure: null}
    });

    const kpa = useWatch({ control: form.control, name: "kpa" });
    const strategicOutput = useWatch({ control: form.control, name: "strategic_output" });
    
    
    useEffect(() => {
        form.setValue("strategic_output", null);
        form.setValue("measure", null);
    }, [kpa?.id]);

    useEffect(() => {
        form.setValue("measure", null);
    }, [strategicOutput?.id]);
    
    const { control, handleSubmit } = form;

    const onsubmit = (data: any) => {
        console.log(data)
        kpa: data.kpa ?? null;
        //strategic_output: data.strategic_output ?? null,
        //measure: data.measure ?? null,
    };

    return(
        <div>
            <Banner title="Progress" description="Find out where we are with our Pacific Regional E-commerce Strategy" image="https://pacificecommerce.org/wp-content/uploads/2022/04/banner-450.png"/>
            <div className="flex flex-col items-center justify-center pb-20">
                <form className="w-5/7 flex flex-col py-14" onSubmit={handleSubmit(onsubmit)}>
                    <div className="w-1/3">
                        <div className="flex justify-baseline space-x-3 mb-5 items-center">
                            <p>Category</p> 
                            <SortSelect options={OPTIONS} value={sort} onChange={(opt) => setSort(opt.value)}/>
                        </div>
                    </div>
                    {sort === "kpas_information" && (
                        <div className="w-full flex flex-col lg:flex-row gap-4">
                        <div className="w-11/12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            <Controller control={control} name="kpa"
                                render={({field})=>(
                                    <div>
                                        <AsyncSearchSelect<KPA> value={field.value} onChange={field.onChange} placeholder={"Search by KPA"} fetchOptions={fetchKPAsForSelect()} getOptionLabel={(k) => k.name} getOptionKey={(k)=> k.id}/>
                                        <p className="previous-message">Leave empty for all information</p>
                                    </div>
                                )}
                            />
                            <Controller control={control} name="strategic_output"
                                render={({field}) => (
                                    <div>
                                        <AsyncSearchSelect<StrategicOutput> key={kpa?.id ?? "no-kpa"} value={field.value} onChange={field.onChange} placeholder={"Search by Strategic Output"} fetchOptions={fetchStrategicOutputsForSelect(kpa ? kpa.id : 0)} getOptionLabel={(k) => k.name} getOptionKey={(k)=> k.id} disabled={!kpa}/>
                                        {!kpa && <p className="previous-message">Select a KPA first</p>}
                                    </div>
                                )}
                            />

                            <Controller control={control} name="measure"
                                render={({field}) => (
                                    <div>
                                        <AsyncSearchSelect<Measure> key={strategicOutput?.id ?? "no-strategic-output"} value={field.value} onChange={field.onChange} placeholder={"Search by Measure"} fetchOptions={fetchMeasuresForSelect(strategicOutput ? strategicOutput.id : 0)} getOptionLabel={(k) => k.name} getOptionKey={(k)=> k.id} disabled={!strategicOutput}/>
                                        {!strategicOutput && <p className="previous-message">Select a Strategic Output first</p>}
                                    </div>
                                )}
                            />
                        </div>
                        <div className="flex h-auto mb-6 mt-4 lg:mt-0 w-1/12 gap-4">
                            <Button type="submit" className="btn-secondary text-base">Search</Button>
                        </div> 
                        </div> 
                    )}
                    <span className="block w-full h-px mt-20 bg-slate-300"></span>
                </form>
            </div>
            {sort === "overall" && <OverallSection/>}
            {sort === "kpas_information" && <KpaSection/>}
        </div>
    )
}