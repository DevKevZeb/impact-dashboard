import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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

export default function ProgramsPublicPage() {
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [sort, setSort] = useState("date_newest");
    const [filters, setFilters] = useState<ProgramFindDTO | null>(null);
    const [programs, setPrograms] = useState<PublicProgramCard[]>([]);

    const form = useForm<ProgramFindDTO>({
        resolver: zodResolver(publicProgramFilterSchema),
        defaultValues: {
            country: null,
            kpa: null,
            strategic_output: null,
            measure: null,
            program_state: null,
            search: "",
            sort: "date_newest",
        },
    });

    const country = useWatch({ control: form.control, name: "country" });
    const kpa = useWatch({ control: form.control, name: "kpa" });
    const strategicOutput = useWatch({ control: form.control, name: "strategic_output" });

    useEffect(() => {
        form.setValue("kpa", null);
        form.setValue("strategic_output", null);
        form.setValue("measure", null);
    }, [country?.id, form]);

    useEffect(() => {
        form.setValue("strategic_output", null);
        form.setValue("measure", null);
    }, [kpa?.id, form]);

    useEffect(() => {
        form.setValue("measure", null);
    }, [strategicOutput?.id, form]);

    const { control, handleSubmit } = form;
    const { data, isLoading, isFetching, error } = usePublicPrograms(page, perPage, filters);
    const hasMore = data?.pagination
        ? data.pagination.current_page < data.pagination.last_page
        : false;

    useEffect(() => {
        if (!data?.programs || !data.pagination) return;

        if (data.pagination.current_page === 1) {
            setPrograms(data.programs);
            return;
        }

        setPrograms((previous) => {
            const existingIds = new Set(previous.map((program) => program.id));
            const newPrograms = data.programs.filter((program) => !existingIds.has(program.id));
            return [...previous, ...newPrograms];
        });
    }, [data]);

    const onSubmit = (submittedFilters: ProgramFindDTO) => {
        setPage(1);
        setFilters({
            country: submittedFilters.country ?? null,
            kpa: submittedFilters.kpa ?? null,
            strategic_output: submittedFilters.strategic_output ?? null,
            measure: submittedFilters.measure ?? null,
            program_state: submittedFilters.program_state ?? null,
            search: submittedFilters.search?.trim() || null,
            sort,
        });
    };

    const onSort = () => {
        const currentValues = form.getValues();
        setPage(1);
        setFilters({
            country: currentValues.country ?? null,
            kpa: currentValues.kpa ?? null,
            strategic_output: currentValues.strategic_output ?? null,
            measure: currentValues.measure ?? null,
            program_state: currentValues.program_state ?? null,
            search: currentValues.search?.trim() || null,
            sort,
        });
    };

    return (
        <div>
            <Banner
                title="E-commerce Programs"
                description="Search and find information on development partner programs and projects which support e-commerce in the Pacific"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <Controller
                            control={control}
                            name="country"
                            render={({ field }) => (
                                <AsyncSearchSelect<Country>
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Search by Country"
                                    fetchOptions={fetchCountriesForSelect}
                                    getOptionLabel={(option) => option.name}
                                    getOptionKey={(option) => option.id}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="kpa"
                            render={({ field }) => (
                                <div>
                                    <AsyncSearchSelect<KPA>
                                        key={country?.id ?? "no-country"}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Search by KPA"
                                        fetchOptions={fetchKPAsForSelect(country ? country.id : 0)}
                                        getOptionLabel={(option) => option.name}
                                        getOptionKey={(option) => option.id}
                                        disabled={!country}
                                    />
                                    {!country && <p className="previous-message">Select a Country first</p>}
                                </div>
                            )}
                        />

                        <Controller
                            control={control}
                            name="strategic_output"
                            render={({ field }) => (
                                <div>
                                    <AsyncSearchSelect<StrategicOutput>
                                        key={kpa?.id ?? "no-kpa"}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Search by Strategic Output"
                                        fetchOptions={fetchStrategicOutputsForSelect(kpa ? kpa.id : 0)}
                                        getOptionLabel={(option) => option.name}
                                        getOptionKey={(option) => option.id}
                                        disabled={!kpa}
                                    />
                                    {!kpa && <p className="previous-message">Select a KPA first</p>}
                                </div>
                            )}
                        />

                        <Controller
                            control={control}
                            name="measure"
                            render={({ field }) => (
                                <div>
                                    <AsyncSearchSelect<Measure>
                                        key={strategicOutput?.id ?? "no-strategic-output"}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Search by Measure"
                                        fetchOptions={fetchMeasuresForSelect(strategicOutput ? strategicOutput.id : 0)}
                                        getOptionLabel={(option) => option.name}
                                        getOptionKey={(option) => option.id}
                                        disabled={!strategicOutput}
                                    />
                                    {!strategicOutput && (
                                        <p className="previous-message">Select a Strategic Output first</p>
                                    )}
                                </div>
                            )}
                        />

                        <Controller
                            control={control}
                            name="program_state"
                            render={({ field }) => (
                                <AsyncSearchSelect<ProgramState>
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Search by Program State"
                                    fetchOptions={fetchProgramStatesForSelect}
                                    getOptionLabel={(option) => option.name}
                                    getOptionKey={(option) => option.id}
                                />
                            )}
                        />
                    </div>
                    <div className="w-full flex justify-start items-center gap-3 mt-6">
                        <p>Sort by</p>
                        <SortSelect options={SORT_OPTIONS} value={sort} onChange={(option) => setSort(option.value)} />
                        <Button type="button" className="btn-secondary text-base" onClick={onSort}>
                            Sort
                        </Button>
                    </div>
                    <span className="block w-full h-px bg-slate-300 my-14"></span>
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
                                />
                            ))}
                        </div>
                    )}

                    {!isLoading && !isFetching && !error && programs.length === 0 && (
                        <EmptyState
                            icon={FolderX}
                            title={filters ? "No programs match your filters" : "No programs available"}
                            description={
                                filters
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
