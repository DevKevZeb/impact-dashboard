/**
 * Dashboard rollup builders. Every number here is DERIVED from `seed.ts` at
 * call time (never hand-typed) so every dashboard screen agrees with the
 * projects/programs/country-KPA data shown elsewhere in the demo.
 */
import type { ProjectDashboardRow } from "@/features/dashboard/project-dashboard/types/projectDashboard.types";
import type { CountryDashboardImplementationResponse, CountryKpaImplementation, StrategicOutputImplementation, MeasureImplementation, IndicatorImplementation } from "@/features/dashboard/country-dashboard/country-kpa-info/types/kpas.type";
import {
  projects,
  programs,
  findCountry,
  findProgram,
  countryKpas,
  strategicOutputs,
  measures,
  indicators,
  indicatorTypes,
  indicatorImplementation,
  measureImplementation,
  strategicOutputImplementation,
  countryKpaImplementation,
} from "./seed";
import { paginateArray } from "./factories";

/** One row per project, matching `ProjectDashboardRow` exactly, for `/projects/dashboard`. */
export function buildProjectDashboardRows(): ProjectDashboardRow[] {
  return projects.map((project) => {
    const program = findProgram(project.program_id);
    const country = program ? findCountry(program.country_id) : undefined;
    const hasBottomUp = project.indicators.some((i) => i.type?.is_bottom_up);
    const leadAgency = project.agencies[0]?.name ?? null;

    return {
      id: project.id,
      country: country?.name ?? null,
      currency_code: country?.currency.code ?? "USD",
      measure: project.measure?.name ?? null,
      program_title: program?.name ?? null,
      project_title: project.name,
      lead_project_manager: project.contact ? `${project.contact.first_name} ${project.contact.last_name}` : null,
      lead_implementing_agency: leadAgency,
      budget: project.budget,
      start_date: new Date(project.start_date).toISOString().slice(0, 10),
      end_date: new Date(project.end_date).toISOString().slice(0, 10),
      progress: project.progress,
      weight: project.weight,
      has_bottom_up_indicator: hasBottomUp,
      comment: project.id % 3 === 0 ? "On track; next milestone review scheduled with country focal point." : null,
      can_edit: true,
      can_edit_weight: true,
    };
  });
}

function buildIndicatorNode(indicatorId: number): IndicatorImplementation {
  const indicator = indicators.find((i) => i.id === indicatorId)!;
  const type = indicatorTypes.find((t) => t.id === indicator.type_id);
  return {
    id: indicator.id,
    name: indicator.name,
    target: indicator.target,
    actual_value: indicator.actual_value,
    implementation: indicatorImplementation(indicator),
    type: type ? { id: type.id, name: type.name, is_bottom_up: type.is_bottom_up } : undefined,
  };
}

function buildMeasureNode(measureId: number): MeasureImplementation {
  const measure = measures.find((m) => m.id === measureId)!;
  const measureIndicators = indicators.filter((i) => i.measure_id === measureId);
  return {
    id: measure.id,
    name: measure.name,
    implementation: measureImplementation(measure.id),
    indicators_count: measureIndicators.length,
    indicators: measureIndicators.map((i) => buildIndicatorNode(i.id)),
  };
}

function buildStrategicOutputNode(soId: number): StrategicOutputImplementation {
  const so = strategicOutputs.find((s) => s.id === soId)!;
  const soMeasures = measures.filter((m) => m.strategic_output_id === soId);
  const indicatorsCount = soMeasures.reduce((sum, m) => sum + indicators.filter((i) => i.measure_id === m.id).length, 0);
  return {
    id: so.id,
    name: so.name,
    implementation: strategicOutputImplementation(soId),
    measures_count: soMeasures.length,
    indicators_count: indicatorsCount,
    measures: soMeasures.map((m) => buildMeasureNode(m.id)),
  };
}

function buildCountryKpaNode(idCk: number): CountryKpaImplementation {
  const ck = countryKpas.find((c) => c.id_ck === idCk)!;
  const sos = strategicOutputs.filter((so) => so.id_ck === idCk);
  return {
    id: ck.id_ck,
    id_kpa: ck.id_kpa,
    name: ck.name,
    implementation: countryKpaImplementation(idCk),
    strategic_outputs_count: ck.strategic_outputs_count,
    measures_count: ck.measures_count,
    indicators_count: ck.indicators_count,
    strategic_outputs: sos.map((so) => buildStrategicOutputNode(so.id)),
  };
}

/** Full nested KPA -> strategic output -> measure -> indicator tree for one country, used by the country-KPA-info page and its Excel export. */
export function buildCountryImplementationTree(countryId: number, page: number, perPage: number): CountryDashboardImplementationResponse {
  const country = findCountry(countryId);
  const ownedCks = countryKpas.filter((ck) => ck.country_id === countryId);
  const { pageItems, pagination } = paginateArray(ownedCks, page, perPage < 0 ? ownedCks.length || 1 : perPage);

  return {
    country: {
      id: country?.id ?? countryId,
      name: country?.name ?? `Country #${countryId}`,
      currency_id: country?.currency.id ?? null,
      active: country?.active ?? false,
    },
    kpas: pageItems.map((ck) => buildCountryKpaNode(ck.id_ck)),
    pagination,
  };
}

/** Programs + projects grouped for the admin dashboard's "shared country" sections; mirrors `useProgramsByCountry` + `useProjectDashboardByCountry`. */
export function programsForCountry(countryId: number) {
  return programs.filter((p) => p.country_id === countryId);
}
