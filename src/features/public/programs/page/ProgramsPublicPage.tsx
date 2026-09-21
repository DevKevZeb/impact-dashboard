import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useSyncOnChange } from "@/shared/hooks/useDidChange";
import { z } from "zod";
import { FolderX, Loader, Search } from "lucide-react";
import Banner from "../../components/Banner";
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect";
import {
    fetchCountriesForSelect,
    fetchKPAsForSelect,
    fetchMeasuresForSelect,
    fetchStrategicOutputsForSelect,
} from "../../projects/services/projects.filters.api";
import type { Country } from "../../projects/types/country.type";
import type { KPA } from "../../projects/types/kpa.type";
import type { Measure } from "../../projects/types/measure.type";
import type { StrategicOutput } from "../../projects/types/strategic.output.type";
import type { ProgramState } from "../types/program.state.type";
import { publicProgramFilterSchema } from "../types/program.filter.schema";
import type { ProgramFindDTO, PublicProgramCard } from "../types/findDTO";
import { DEFAULT_PROGRAM_FILTERS, DEFAULT_PROGRAM_SORT, DEFAULT_SELECT_OPTION } from "../types/findDTO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { usePublicPrograms } from "../hooks/usePrograms";
import ProgramCard from "../components/ProgramCard";
import SortSelect from "../../components/SortSelect";
import { fetchProgramStatesForSelect } from "../services/programs.filters.api";

const SORT_OPTIONS = [
    { value: "date_newest", label: "Date Newest" },
    { value: "date_oldest", label: "Date Oldest" },
    { value: "name_za", label: "Name Z-A" },
    { value: "name_az", label: "Name A-Z" },
];

type ProgramFiltersForm = z.input<typeof publicProgramFilterSchema>;

export default function ProgramsPublicPage() {
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [sort, setSort] = useState(DEFAULT_PROGRAM_SORT);
    const [filters, setFilters] = useState<ProgramFindDTO>(DEFAULT_PROGRAM_FILTERS);
    const [programs, setPrograms] = useState<PublicProgramCard[]>([]);

    const form = useForm<ProgramFiltersForm>({
        resolver: zodResolver(publicProgramFilterSchema),
        defaultValues: {
            country: DEFAULT_SELECT_OPTION,
            kpa: DEFAULT_SELECT_OPTION,
            strategic_output: DEFAULT_SELECT_OPTION,
            measure: DEFAULT_SELECT_OPTION,
            program_state: DEFAULT_SELECT_OPTION,
            search: "",
            sort: DEFAULT_PROGRAM_SORT,
        },
    });

    const country = useWatch({ control: form.control, name: "country" }) ?? DEFAULT_SELECT_OPTION;
    const kpa = useWatch({ control: form.control, name: "kpa" }) ?? DEFAULT_SELECT_OPTION;
    const strategicOutput = useWatch({ control: form.control, name: "strategic_output" }) ?? DEFAULT_SELECT_OPTION;

    const hasCountry = country.id > 0;
    const hasKpa = kpa.id > 0;
    const hasStrategicOutput = strategicOutput.id > 0;

    useEffect(() => {
        form.setValue("kpa", DEFAULT_SELECT_OPTION);
        form.setValue("strategic_output", DEFAULT_SELECT_OPTION);
        form.setValue("measure", DEFAULT_SELECT_OPTION);
    }, [country.id, form]);

    useEffect(() => {
        form.setValue("strategic_output", DEFAULT_SELECT_OPTION);
        form.setValue("measure", DEFAULT_SELECT_OPTION);
    }, [kpa.id, form]);

    useEffect(() => {
        form.setValue("measure", DEFAULT_SELECT_OPTION);
    }, [strategicOutput.id, form]);

    const { control, handleSubmit } = form;
    const { data, isLoading, isFetching, error } = usePublicPrograms(page, perPage, filters);
    const hasMore = data?.pagination
        ? data.pagination.current_page < data.pagination.last_page
        : false;

    useSyncOnChange(data, (d) => {
        if (!d?.programs || !d.pagination) return;

        if (d.pagination.current_page === 1) {
            setPrograms(d.programs);
            return;
        }

        setPrograms((previous) => {
            const existingIds = new Set(previous.map((program) => program.id));
            const newPrograms = d.programs.filter((program) => !existingIds.has(program.id));
            return [...previous, ...newPrograms];
        });
    });

    const onSubmit = (submittedFilters: ProgramFiltersForm) => {
        setPage(1);
        const nextFilters: ProgramFindDTO = {
            ...DEFAULT_PROGRAM_FILTERS,
            search: (submittedFilters.search ?? "").trim(),
            sort,
        };

        nextFilters.country = submittedFilters.country ?? DEFAULT_SELECT_OPTION;
        nextFilters.kpa = submittedFilters.kpa ?? DEFAULT_SELECT_OPTION;
        nextFilters.strategic_output = submittedFilters.strategic_output ?? DEFAULT_SELECT_OPTION;
        nextFilters.measure = submittedFilters.measure ?? DEFAULT_SELECT_OPTION;
        nextFilters.program_state = submittedFilters.program_state ?? DEFAULT_SELECT_OPTION;

        setFilters({
            ...DEFAULT_PROGRAM_FILTERS,
            ...nextFilters,
        });
    };

    const onSort = () => {
        const currentValues = form.getValues();
        setPage(1);
        const nextFilters: ProgramFindDTO = {
            ...DEFAULT_PROGRAM_FILTERS,
            search: (currentValues.search ?? "").trim(),
            sort,
        };

        nextFilters.country = currentValues.country ?? DEFAULT_SELECT_OPTION;
        nextFilters.kpa = currentValues.kpa ?? DEFAULT_SELECT_OPTION;
        nextFilters.strategic_output = currentValues.strategic_output ?? DEFAULT_SELECT_OPTION;
        nextFilters.measure = currentValues.measure ?? DEFAULT_SELECT_OPTION;
        nextFilters.program_state = currentValues.program_state ?? DEFAULT_SELECT_OPTION;

        setFilters({
            ...DEFAULT_PROGRAM_FILTERS,
            ...nextFilters,
        });
    };

    const hasActiveFilters =
        filters.country.id > 0 ||
        filters.kpa.id > 0 ||
        filters.strategic_output.id > 0 ||
        filters.measure.id > 0 ||
        filters.program_state.id > 0 ||
        filters.search.length > 0;

    return (
        <div>
            <Banner
                title="E-commerce Programs"
                description="Search and find national programs supporting e-commerce development in Pacific Island countries."
                image="https://pacificecommerce.org/wp-content/uploads/2022/04/banner-450.png"
            />
            <div className="flex flex-col items-center justify-center pb-20">
                <form className="w-5/7 flex flex-col py-14" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex h-auto mb-6 w-full gap-4">
                        <div className="relative w-full">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search by program name..."
                                className="pl-2 input-default"
                                {...form.register("search")}
                            />
                        </div>
                        <Button type="submit" className="btn-secondary text-base">
                            Search
                        </Button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Stepper encadenado */}
                        <div className="flex flex-col lg:max-w-md w-full">

                            {/* Step 1 — Country */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-[#1E3291] text-[#1E3291] bg-blue-50 shrink-0">1</div>
                                    <div className="w-px flex-1 bg-slate-200 mt-1 min-h-6" />
                                </div>
                                <div className="flex-1 pb-6">
                                    <p className="text-sm font-semibold text-slate-700 mb-1.5">Country</p>
                                    <Controller control={control} name="country"
                                        render={({ field }) => (
                                            <AsyncSearchSelect<Country>
                                                value={field.value ?? DEFAULT_SELECT_OPTION}
                                                onChange={(value) => field.onChange(value ?? DEFAULT_SELECT_OPTION)}
                                                placeholder="Search by Country"
                                                fetchOptions={fetchCountriesForSelect}
                                                getOptionLabel={(option) => option.name}
                                                getOptionKey={(option) => option.id}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Step 2 — KPA */}
                            <div className={`flex gap-4 transition-opacity duration-300 ${!hasCountry ? "opacity-40 pointer-events-none" : ""}`}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0 transition-colors duration-300 ${hasCountry ? "border-[#1E3291] text-[#1E3291] bg-blue-50" : "border-slate-300 text-slate-400 bg-slate-50"}`}>2</div>
                                    <div className="w-px flex-1 bg-slate-200 mt-1 min-h-6" />
                                </div>
                                <div className="flex-1 pb-6">
                                    <p className={`text-sm font-semibold mb-1.5 transition-colors duration-300 ${hasCountry ? "text-slate-700" : "text-slate-400"}`}>KPA</p>
                                    <Controller control={control} name="kpa"
                                        render={({ field }) => (
                                            <AsyncSearchSelect<KPA>
                                                key={hasCountry ? country.id : "no-country"}
                                                value={field.value ?? DEFAULT_SELECT_OPTION}
                                                onChange={(value) => field.onChange(value ?? DEFAULT_SELECT_OPTION)}
                                                placeholder="Search by KPA"
                                                fetchOptions={fetchKPAsForSelect(country.id)}
                                                getOptionLabel={(option) => option.name}
                                                getOptionKey={(option) => option.id}
                                                disabled={!hasCountry}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Step 3 — Strategic Output */}
                            <div className={`flex gap-4 transition-opacity duration-300 ${!hasKpa ? "opacity-40 pointer-events-none" : ""}`}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0 transition-colors duration-300 ${hasKpa ? "border-[#1E3291] text-[#1E3291] bg-blue-50" : "border-slate-300 text-slate-400 bg-slate-50"}`}>3</div>
                                    <div className="w-px flex-1 bg-slate-200 mt-1 min-h-6" />
                                </div>
                                <div className="flex-1 pb-6">
                                    <p className={`text-sm font-semibold mb-1.5 transition-colors duration-300 ${hasKpa ? "text-slate-700" : "text-slate-400"}`}>Strategic Output</p>
                                    <Controller control={control} name="strategic_output"
                                        render={({ field }) => (
                                            <AsyncSearchSelect<StrategicOutput>
                                                key={hasKpa ? kpa.id : "no-kpa"}
                                                value={field.value ?? DEFAULT_SELECT_OPTION}
                                                onChange={(value) => field.onChange(value ?? DEFAULT_SELECT_OPTION)}
                                                placeholder="Search by Strategic Output"
                                                fetchOptions={fetchStrategicOutputsForSelect(kpa.id)}
                                                getOptionLabel={(option) => option.name}
                                                getOptionKey={(option) => option.id}
                                                disabled={!hasKpa}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Step 4 — Measure */}
                            <div className={`flex gap-4 transition-opacity duration-300 ${!hasStrategicOutput ? "opacity-40 pointer-events-none" : ""}`}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0 transition-colors duration-300 ${hasStrategicOutput ? "border-[#1E3291] text-[#1E3291] bg-blue-50" : "border-slate-300 text-slate-400 bg-slate-50"}`}>4</div>
                                </div>
                                <div className="flex-1 pb-2">
                                    <p className={`text-sm font-semibold mb-1.5 transition-colors duration-300 ${hasStrategicOutput ? "text-slate-700" : "text-slate-400"}`}>Measure</p>
                                    <Controller control={control} name="measure"
                                        render={({ field }) => (
                                            <AsyncSearchSelect<Measure>
                                                key={hasStrategicOutput ? strategicOutput.id : "no-strategic-output"}
                                                value={field.value ?? DEFAULT_SELECT_OPTION}
                                                onChange={(value) => field.onChange(value ?? DEFAULT_SELECT_OPTION)}
                                                placeholder="Search by Measure"
                                                fetchOptions={fetchMeasuresForSelect(strategicOutput.id)}
                                                getOptionLabel={(option) => option.name}
                                                getOptionKey={(option) => option.id}
                                                disabled={!hasStrategicOutput}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Selector independiente */}
                        <div className="flex flex-col gap-2 lg:max-w-xs w-full">
                            <p className="text-sm font-semibold text-slate-700 mb-1.5">Program Status</p>
                            <Controller control={control} name="program_state"
                                render={({ field }) => (
                                    <AsyncSearchSelect<ProgramState>
                                        value={field.value ?? DEFAULT_SELECT_OPTION}
                                        onChange={(value) => field.onChange(value ?? DEFAULT_SELECT_OPTION)}
                                        placeholder="Search by Program Status"
                                        fetchOptions={fetchProgramStatesForSelect}
                                        getOptionLabel={(option) => option.name}
                                        getOptionKey={(option) => option.id}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <span className="block w-full h-px bg-slate-300 my-14"></span>
                    <div className="w-full flex justify-start items-center gap-3">
                        <p>Sort by</p>
                        <SortSelect options={SORT_OPTIONS} value={sort} onChange={(option) => setSort(option.value)} />
                        <Button type="button" className="btn-secondary text-base" onClick={onSort}>
                            Sort
                        </Button>
                    </div>
                </form>

                <div className="w-5/7 my-4">
                    {(isLoading || isFetching) && (
                        <div className="flex justify-center py-8">
                            <Loader className="animate-spin loader-default" />
                        </div>
                    )}

                    {error && <p className="text-center text-red-500">Error loading programs</p>}

                    {!isLoading && !isFetching && !error && programs.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-3">
                            {programs.map((program) => (
                                <ProgramCard
                                    key={program.id}
                                    id={program.id}
                                    name={program.name}
                                    description={program.description}
                                    bannerImg={program.banner_img}
                                />
                            ))}
                        </div>
                    )}

                    {!isLoading && !isFetching && !error && programs.length === 0 && (
                        <EmptyState
                            icon={FolderX}
                            title={hasActiveFilters ? "No programs match your filters" : "No programs available"}
                            description={
                                hasActiveFilters
                                    ? "Try adjusting your filters or search terms."
                                    : "There are no programs to display at the moment."
                            }
                        />
                    )}
                </div>

                {hasMore && (
                    <div className="flex justify-center mt-8">
                        <Button
                            onClick={() => setPage((previous) => previous + 1)}
                            disabled={isFetching}
                            className="btn-secondary text-base flex items-center gap-2"
                        >
                            {isFetching && page > 1 ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin loader-default" />
                                    Loading more...
                                </>
                            ) : (
                                "Load more programs"
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
