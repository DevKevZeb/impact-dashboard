import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Banner from "../../components/Banner"
import { Button } from "@/components/ui/button"
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect"
import type { Country } from "../../projects/types/country.type"
import type { StrategicOutput } from "../../projects/types/strategic.output.type";
import type { Measure } from "../../projects/types/measure.type";
import { useEffect, useState } from "react"
import { filterSchema } from "../types/chart.filter.schema";
import { fetchMeasuresForSelect } from "../../projects/services/projects.filters.api";
import {
    fetchCountriesForPublicProgress,
    fetchAllStrategicOutputsForSelect,
} from "../services/progress.public.filters.api";
import OverallSection from "../components/sections/OverallSection";
import KpaSection from "../components/sections/KpaSection";
import StrategicOutputSelectedSection from "../components/sections/StrategicOutputSelectedSection";
import MeasureSelectedSection from "../components/sections/MeasureSelectedSection";
import SortSelect from "../../components/SortSelect";

type ProgressFilters = z.infer<typeof filterSchema>;

const OPTIONS = [
    { value: "overall", label: "Overall Strategy" },
    { value: "kpa", label: "Key Priority Areas" },
    { value: "strategic_output", label: "Strategic Outputs" },
    { value: "measure", label: "Measures" },
];

export default function ProgressPublicPage(){
    const [category, setCategory] = useState<"overall" | "kpa" | "strategic_output" | "measure">("overall");
    const [submittedFilters, setSubmittedFilters] = useState<ProgressFilters>({
        country: null,
        category: "overall",
        strategic_output: null,
        measure: null,
    });

    const form = useForm<ProgressFilters>({
        resolver: zodResolver(filterSchema),
        defaultValues: { country: null, category: "overall", strategic_output: null, measure: null }
    });

    const country = useWatch({ control: form.control, name: "country" }) as Country | null;
    const strategicOutput = useWatch({ control: form.control, name: "strategic_output" }) as StrategicOutput | null;

    useEffect(() => {
        form.setValue("strategic_output", null);
        form.setValue("measure", null);
    }, [country?.id, form]);

    useEffect(() => {
        form.setValue("strategic_output", null);
        form.setValue("measure", null);
    }, [category, form]);

    useEffect(() => {
        form.setValue("measure", null);
    }, [strategicOutput?.id, form]);

    const { control, handleSubmit } = form;

    const onSubmit = (data: ProgressFilters) => {
        setSubmittedFilters({
            country: data.country ?? null,
            category,
            strategic_output: data.strategic_output ?? null,
            measure: data.measure ?? null,
        });
    };

    const renderResult = () => {
        const { country, category, strategic_output, measure } = submittedFilters;
        if (!country) return null;

        if (category === "overall") {
            return <OverallSection countryId={country.id} countryName={country.name} />;
        }

        if (category === "kpa") {
            return <KpaSection countryId={country.id} />;
        }

        if (category === "strategic_output") {
            if (!strategic_output) {
                return (
                    <div className="w-full flex justify-center py-20">
                        <p className="text-slate-500">Select a Strategic Output to view its progress.</p>
                    </div>
                );
            }
            return (
                <StrategicOutputSelectedSection
                    strategicOutputId={strategic_output.id}
                    strategicOutputName={strategic_output.name}
                />
            );
        }

        if (category === "measure") {
            if (!measure) {
                return (
                    <div className="w-full flex justify-center py-20">
                        <p className="text-slate-500">Select a Strategic Output and a Measure to view its progress.</p>
                    </div>
                );
            }
            return <MeasureSelectedSection measureId={measure.id} measureName={measure.name} />;
        }

        return null;
    };

    return(
        <div className="mb-20">
            <Banner title="Progress" description="Find out where we are with our Pacific National E-commerce Strategy" image="https://pacificecommerce.org/wp-content/uploads/2022/04/banner-450.png"/>
            <div className="flex flex-col items-center justify-center pb-20">
                <form className="w-5/7 flex flex-col py-14" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <p className="font-semibold text-slate-700 sm:w-28 shrink-0">Country</p>
                            <div className="w-full sm:flex-1 sm:max-w-md">
                                <Controller control={control} name="country"
                                    render={({ field }) => (
                                        <AsyncSearchSelect<Country>
                                            value={field.value}
                                            onChange={(value) => {
                                                field.onChange(value);
                                                if (value?.id !== country?.id) {
                                                    setCategory("overall");
                                                }
                                            }}
                                            placeholder={"Search by Country"}
                                            fetchOptions={fetchCountriesForPublicProgress}
                                            getOptionLabel={(c) => c.name}
                                            getOptionKey={(c) => c.id}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <p className="font-semibold text-slate-700 sm:w-28 shrink-0">Category</p>
                            <div className="w-full sm:flex-1 sm:max-w-md">
                                <SortSelect
                                    options={OPTIONS}
                                    value={category}
                                    onChange={(opt) => setCategory(opt.value as typeof category)}
                                    disabled={!country}
                                />
                            </div>
                        </div>

                        {country && (category === "strategic_output" || category === "measure") && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <p className="font-semibold text-slate-700 sm:w-28 shrink-0">Strategic Output</p>
                                <div className="w-full sm:flex-1 sm:max-w-md">
                                    <Controller control={control} name="strategic_output"
                                        render={({ field }) => (
                                            <AsyncSearchSelect<StrategicOutput>
                                                key={`so-${country.id}`}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={"Select a Strategic Output"}
                                                fetchOptions={fetchAllStrategicOutputsForSelect(country.id)}
                                                getOptionLabel={(s) => s.name}
                                                getOptionKey={(s) => s.id}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {country && category === "measure" && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <p className="font-semibold text-slate-700 sm:w-28 shrink-0">Measure</p>
                                <div className="w-full sm:flex-1 sm:max-w-md">
                                    <Controller control={control} name="measure"
                                        render={({ field }) => (
                                            <AsyncSearchSelect<Measure>
                                                key={`measure-${strategicOutput?.id ?? "none"}`}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={"Select a Measure"}
                                                fetchOptions={fetchMeasuresForSelect(strategicOutput ? strategicOutput.id : 0)}
                                                getOptionLabel={(m) => m.name}
                                                getOptionKey={(m) => m.id}
                                                disabled={!strategicOutput}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {country && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <p className="font-semibold text-slate-700 sm:w-28 shrink-0 invisible">Search</p>
                                <div className="w-full sm:flex-1 sm:max-w-md">
                                    <Button type="submit" className="btn-secondary text-base">Search</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <span className="block w-full h-px mt-20 bg-slate-300"></span>
                </form>
            </div>
            {renderResult()}
        </div>
    )
}
