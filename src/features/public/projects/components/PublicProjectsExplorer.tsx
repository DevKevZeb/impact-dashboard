import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderX, Loader, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect";
import { EmptyState } from "@/shared/components/EmptyState";
import SortSelect from "../../components/SortSelect";
import { useProjects } from "../hooks/useProjects";
import { projectSchema } from "../types/project.filter.schema";
import type { findDTO } from "../types/findDTO";
import type { Country } from "../types/country.type";
import type { KPA } from "../types/kpa.type";
import type { StrategicOutput } from "../types/strategic.output.type";
import type { Measure } from "../types/measure.type";
import type { ProjectState } from "../types/project.state.type";
import {
  fetchCountriesForSelect,
  fetchKPAsForSelect,
  fetchMeasuresForSelect,
  fetchProjectStatesForSelect,
  fetchStrategicOutputsForSelect,
} from "../services/projects.filters.api";
import ProjectCard from "./ProjectCard";

const OPTIONS = [
  { value: "date_newest", label: "Date Newest" },
  { value: "date_oldest", label: "Date Oldest" },
  { value: "name_za", label: "Name Z-A" },
  { value: "name_az", label: "Name A-Z" },
];

interface PublicProjectsExplorerProps {
  programId?: number;
  wrapperClassName?: string;
  /** When true, the Country step is hidden. The first country in programCountries (if any) is pre-set. */
  hideCountry?: boolean;
  /** Used together with hideCountry to pre-set country automatically. */
  programCountries?: { id: number; name: string }[];
}

export default function PublicProjectsExplorer({
  programId,
  wrapperClassName = "w-5/7",
  hideCountry = false,
  programCountries,
}: PublicProjectsExplorerProps) {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [filters, setFilters] = useState<findDTO | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [sort, setSort] = useState("date_newest");

  // Pre-set the first country when country step is hidden.
  const defaultCountry = hideCountry && programCountries && programCountries.length > 0
    ? { id: programCountries[0].id, name: programCountries[0].name }
    : null;

  const form = useForm<any>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      country: defaultCountry,
      kpa: null,
      strategic_output: null,
      measure: null,
      project_state: null,
      search: "",
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
  const { data, isLoading, isFetching, error } = useProjects(page, perPage, filters, programId);
  const hasMore = data?.pagination ? data.pagination.current_page < data.pagination.last_page : false;

  useEffect(() => {
    if (!data?.projects || !data.pagination) return;

    if (data.pagination.current_page === 1) {
      setProjects(data.projects);
      return;
    }

    setProjects((previous) => {
      const existingIds = new Set(previous.map((project) => project.id));
      const newProjects = data.projects.filter((project) => !existingIds.has(project.id));
      return [...previous, ...newProjects];
    });
  }, [data]);

  const onSubmit = (submitted: any) => {
    setPage(1);
    setFilters({
      search: submitted.search || null,
      country: submitted.country ?? null,
      kpa: submitted.kpa ?? null,
      strategic_output: submitted.strategic_output ?? null,
      measure: submitted.measure ?? null,
      project_state: submitted.project_state ?? null,
      sort,
    });
  };

  const onSort = () => {
    const currentValues = form.getValues();
    setPage(1);
    setFilters({
      search: currentValues.search || null,
      country: currentValues.country ?? null,
      kpa: currentValues.kpa ?? null,
      strategic_output: currentValues.strategic_output ?? null,
      measure: currentValues.measure ?? null,
      project_state: currentValues.project_state ?? null,
      sort,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center pb-20">
      <form className={`${wrapperClassName} flex flex-col py-14`} onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 flex h-auto w-full gap-4">
          <div className="relative w-full">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name..." className="input-default pl-2" {...form.register("search")} />
          </div>
          <Button type="submit" className="btn-secondary text-base">
            Search
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Stepper encadenado */}
          <div className="flex flex-col lg:max-w-md w-full">

            {/* Step Country — hidden when hideCountry=true */}
            {!hideCountry && (
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
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search by Country"
                        fetchOptions={fetchCountriesForSelect}
                        getOptionLabel={(option) => option.name}
                        getOptionKey={(option) => option.id}
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step KPA — step 1 when country is hidden, step 2 otherwise */}
            <div className={`flex gap-4 transition-opacity duration-300 ${!country ? "opacity-40 pointer-events-none" : ""}`}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0 transition-colors duration-300 ${country ? "border-[#1E3291] text-[#1E3291] bg-blue-50" : "border-slate-300 text-slate-400 bg-slate-50"}`}>
                  {hideCountry ? 1 : 2}
                </div>
                <div className="w-px flex-1 bg-slate-200 mt-1 min-h-6" />
              </div>
              <div className="flex-1 pb-6">
                <p className={`text-sm font-semibold mb-1.5 transition-colors duration-300 ${country ? "text-slate-700" : "text-slate-400"}`}>KPA</p>
                <Controller control={control} name="kpa"
                  render={({ field }) => (
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
                  )}
                />
              </div>
            </div>

            {/* Step Strategic Output */}
            <div className={`flex gap-4 transition-opacity duration-300 ${!kpa ? "opacity-40 pointer-events-none" : ""}`}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0 transition-colors duration-300 ${kpa ? "border-[#1E3291] text-[#1E3291] bg-blue-50" : "border-slate-300 text-slate-400 bg-slate-50"}`}>
                  {hideCountry ? 2 : 3}
                </div>
                <div className="w-px flex-1 bg-slate-200 mt-1 min-h-6" />
              </div>
              <div className="flex-1 pb-6">
                <p className={`text-sm font-semibold mb-1.5 transition-colors duration-300 ${kpa ? "text-slate-700" : "text-slate-400"}`}>Strategic Output</p>
                <Controller control={control} name="strategic_output"
                  render={({ field }) => (
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
                  )}
                />
              </div>
            </div>

            {/* Step Measure */}
            <div className={`flex gap-4 transition-opacity duration-300 ${!strategicOutput ? "opacity-40 pointer-events-none" : ""}`}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0 transition-colors duration-300 ${strategicOutput ? "border-[#1E3291] text-[#1E3291] bg-blue-50" : "border-slate-300 text-slate-400 bg-slate-50"}`}>
                  {hideCountry ? 3 : 4}
                </div>
              </div>
              <div className="flex-1 pb-2">
                <p className={`text-sm font-semibold mb-1.5 transition-colors duration-300 ${strategicOutput ? "text-slate-700" : "text-slate-400"}`}>Measure</p>
                <Controller control={control} name="measure"
                  render={({ field }) => (
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
                  )}
                />
              </div>
            </div>
          </div>

          {/* Selector independiente */}
          <div className="flex flex-col gap-2 lg:max-w-xs w-full">
            <p className="text-sm font-semibold text-slate-700 mb-1.5">Project State</p>
            <Controller control={control} name="project_state"
              render={({ field }) => (
                <AsyncSearchSelect<ProjectState>
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Search by Project State"
                  fetchOptions={fetchProjectStatesForSelect}
                  getOptionLabel={(option) => option.state}
                  getOptionKey={(option) => option.id}
                />
              )}
            />
          </div>
        </div>

        <span className="my-14 block h-px w-full bg-slate-300"></span>

        <div className="w-full">
          <div className="flex items-center space-x-3">
            <p>Sort by</p>
            <SortSelect options={OPTIONS} value={sort} onChange={(option) => setSort(option.value)} />
            <Button type="button" className="btn-secondary text-base" onClick={onSort}>
              Sort
            </Button>
          </div>
        </div>
      </form>

      <div className={`${wrapperClassName} my-4`}>
        {(isLoading || isFetching) && (
          <div className="flex justify-center py-8">
            <Loader className="loader-default animate-spin" />
          </div>
        )}

        {error && <p className="text-center text-red-500">Error loading projects</p>}

        {!isLoading && !isFetching && !error && projects.length > 0 && (
          <div className="mt-3 grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} id={project.id} name={project.name} description={project.description} />
            ))}
          </div>
        )}

        {!isLoading && !isFetching && !error && projects.length === 0 && (
          <EmptyState
            icon={FolderX}
            title={filters ? "No projects match your filters" : "No projects available"}
            description={filters ? "Try adjusting your filters or search terms." : "There are no projects to display at the moment."}
          />
        )}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setPage((previous) => previous + 1)}
            disabled={isFetching}
            className="btn-secondary flex items-center gap-2 text-base"
          >
            {isFetching && page > 1 ? (
              <>
                <Loader className="loader-default h-4 w-4 animate-spin" />
                Loading more...
              </>
            ) : (
              "Load more projects"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
