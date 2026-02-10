import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect"
import Banner from "../../components/Banner"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "../types/project.filter.schema";
import type { Country } from "../types/country.type";
import { fetchCountriesForSelect, fetchKPAsForSelect, fetchMeasuresForSelect, fetchProjectStatesForSelect, fetchStrategicOutputsForSelect } from "../services/projects.filters.api";
import type { KPA } from "../types/kpa.type";
import { useEffect, useState } from "react";
import type { StrategicOutput } from "../types/strategic.output.type";
import type { Measure } from "../types/measure.type";
import type { ProjectState } from "../types/project.state.type";
import { Input } from "@/components/ui/input";
import { FolderX, Loader, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "../hooks/useProjects";
import { EmptyState } from "@/shared/components/EmptyState";
import ProjectCard from "../components/ProjectCard";

export default function ProjectsPublicPage(){
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [filters, setFilters] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);

    const form = useForm<any>({
        resolver: zodResolver(projectSchema),
        defaultValues: {country: null, kpa: null, strategic_output: null, measure: null, project_state: null, search: ''}
    });

    const country = useWatch({ control: form.control, name: "country" });
    const kpa = useWatch({ control: form.control, name: "kpa" });
    const strategicOutput = useWatch({ control: form.control, name: "strategic_output" });

    useEffect(() => {
        form.setValue("kpa", null);
        form.setValue("strategic_output", null);
        form.setValue("measure", null);
    }, [country?.id]);

    useEffect(() => {
        form.setValue("strategic_output", null);
        form.setValue("measure", null);
    }, [kpa?.id]);

    useEffect(() => {
        form.setValue("measure", null);
    }, [strategicOutput?.id]);

    const { control, handleSubmit } = form;

    const {data, isLoading, isFetching, error } = useProjects(page, perPage, filters);
    const hasMore = data?.pagination && data.pagination.current_page < data.pagination.last_page;

    useEffect(() => {
        if (!data?.projects || !data.pagination) return;
        if (data.pagination.current_page === 1) setProjects(data.projects);
         else {
            setProjects((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const newProjects = data.projects.filter((p) => !existingIds.has(p.id));
                return [...prev, ...newProjects];
            });
        }
    }, [data]);

    const onsubmit = (data: any) => {
        setPage(1); 
        setFilters({
            search: data.search || null,
            country: data.country ?? null,
            kpa: data.kpa ?? null,
            strategic_output: data.strategic_output ?? null,
            measure: data.measure ?? null,
            project_state: data.project_state ?? null,
        });
    };

    return(
        <div>
            <Banner title="E-commerce Projects" description="Search and find information on development partner projects which support e-commerce in the Pacific" image="https://pacificecommerce.org/wp-content/uploads/2022/04/banner-450.png"/>
            <div className="flex flex-col items-center justify-center py-8">
                <form className="w-5/7 flex flex-col" onSubmit={handleSubmit(onsubmit)}>
                    <div className="flex h-auto w-full mb-4 gap-4">
                        <div className="relative w-full">
                            <Search className="absolute right-4  top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input placeholder="Search projects by name..." className="pl-2 input-default" {...form.register("search")}/>
                        </div>
                        <Button type="submit" className="btn-secondary">Search</Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <Controller control={control} name="country"
                            render={({field}) => (
                                <AsyncSearchSelect<Country> value={field.value} onChange={field.onChange} placeholder="Search by Country" fetchOptions={fetchCountriesForSelect} getOptionLabel={(k) => k.name} getOptionKey={(k)=> k.id}/>
                            )}
                        />

                        <Controller control={control} name="kpa"
                            render={({field})=>(
                                <AsyncSearchSelect<KPA> key={country?.id ?? "no-country"} value={field.value} onChange={field.onChange} placeholder={`Search by KPA ${ !country ? " (Country first)" : ""}`} fetchOptions={fetchKPAsForSelect(country ? country.id : 0)} getOptionLabel={(k) => k.name} getOptionKey={(k)=> k.id} disabled={!country}/>
                            )}
                        />

                        <Controller control={control} name="strategic_output"
                            render={({field}) => (
                                <AsyncSearchSelect<StrategicOutput> key={kpa?.id ?? "no-kpa"} value={field.value} onChange={field.onChange} placeholder={`Search by Strategic Output ${ !kpa ? " (KPA first)" : ""}`} fetchOptions={fetchStrategicOutputsForSelect(kpa ? kpa.id : 0)} getOptionLabel={(k) => k.name} getOptionKey={(k)=> k.id} disabled={!kpa}/>
                            )}
                        />

                        <Controller control={control} name="measure"
                            render={({field}) => (
                                <AsyncSearchSelect<Measure> key={strategicOutput?.id ?? "no-strategic-output"} value={field.value} onChange={field.onChange} placeholder={`Search by Measure ${ !strategicOutput ? " (Strategic Output first)" : ""}`} fetchOptions={fetchMeasuresForSelect(strategicOutput ? strategicOutput.id : 0)} getOptionLabel={(k) => k.name} getOptionKey={(k)=> k.id} disabled={!strategicOutput}/>
                            )}
                        />

                        <Controller control={control} name="project_state"
                            render={({field})=>(
                                <AsyncSearchSelect<ProjectState> value={field.value} onChange={field.onChange} placeholder="Search by Project State" fetchOptions={fetchProjectStatesForSelect} getOptionLabel={(k) => k.state} getOptionKey={(k)=> k.id}/>
                            )}
                        />
                    </div>
                </form>
                <div className="w-5/7 my-6">
                    {isLoading && page === 1 && (
                        <div className="flex justify-center py-8">
                            <Loader className="animate-spin loader-default" />
                        </div>
                    )}

                    {error && (<p className="text-center text-red-500">Error loading projects</p>)}

                    {!isLoading && !error && projects.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-3">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} id={project.id} name={project.name} description={project.description} />
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && projects.length === 0 && (
                        <EmptyState icon={FolderX} title={ filters ? "No projects match your filters" : "No projects available" } description={ filters ? "Try adjusting your filters or search terms." : "There are no projects to display at the moment." } />
                    )}
                    </div>

                    {hasMore && (
                    <div className="flex justify-center mt-8">
                        <Button onClick={() => setPage((prev) => prev + 1)} disabled={isFetching} className="btn-secondary flex items-center gap-2" >
                            {isFetching && page > 1 ? (<><Loader className="h-4 w-4 animate-spin loader-default"/>Loading more...</>) : ("Load more projects")}
                        </Button>
                    </div>
                    )}
            </div>
        </div>
    )
}
