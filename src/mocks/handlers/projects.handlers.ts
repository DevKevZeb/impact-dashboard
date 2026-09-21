/**
 * Mocks for /projects — the Tier-1 golden-path CRUD flow — plus the
 * program-scoped cascading KPA -> strategic output -> measure -> indicator
 * selects used by the project create/edit form (project.catalog.api.ts).
 */
import type MockAdapter from "axios-mock-adapter";
import type { AxiosRequestConfig } from "axios";
import { makeApiResponse, makeErrorResponse, makeListPayload, parseQuery, parseBody, matchesSearch, fakeId } from "../fixtures/factories";
import { projects, findProgram, countryKpas, strategicOutputs, measures, indicators, indicatorTypes, kpas } from "../fixtures/seed";
import type { Project } from "@/features/projects/types/project.types";

export function registerProjectsHandlers(mock: MockAdapter): void {
  mock.onGet(/^\/projects\/program\/\d+(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const programId = Number(config.url!.match(/\/projects\/program\/(\d+)/)![1]);
    const query = parseQuery(config.url, config.params);
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 10);
    const search = query.search ?? "";

    const filtered = projects.filter((p) => p.program_id === programId && matchesSearch(p.name, search));
    return [200, makeApiResponse(makeListPayload("projects", filtered, page, perPage))];
  });

  mock.onGet(/^\/projects\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/projects\/(\d+)/)![1]);
    const project = projects.find((p) => p.id === id);
    if (!project) return [404, makeErrorResponse("Project not found.")];
    return [200, makeApiResponse(project)];
  });

  mock.onPost("/projects").reply((config: AxiosRequestConfig) => {
    const body = parseBody<Partial<Project>>(config.data);
    if (!body.name || !body.program_id) {
      return [422, makeErrorResponse("The given data was invalid.", { name: ["Name is required."] })];
    }
    const program = findProgram(Number(body.program_id));
    if (!program) {
      return [422, makeErrorResponse("The given data was invalid.", { program_id: ["Program not found."] })];
    }

    const created: Project = {
      id: fakeId(),
      name: body.name,
      description: body.description ?? "",
      project_url: body.project_url ?? "",
      start_date: body.start_date ?? new Date(),
      end_date: body.end_date ?? new Date(),
      progress: Number(body.progress ?? 0),
      comments: body.comments ?? "",
      budget: Number(body.budget ?? 0),
      weight: Number(body.weight ?? 0),
      contact: body.contact!,
      beneficiary: body.beneficiary!,
      project_state: body.project_state!,
      kpa: body.kpa!,
      measure: body.measure!,
      strategic_output: body.strategic_output!,
      donors: body.donors ?? [],
      agencies: body.agencies ?? [],
      program_id: program.id,
      indicators: body.indicators ?? [],
    };
    projects.push(created);
    program.projects_count = (program.projects_count ?? 0) + 1;
    return [201, makeApiResponse(created, "Project created successfully")];
  });

  mock.onPut(/^\/projects\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/projects\/(\d+)/)![1]);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return [404, makeErrorResponse("Project not found.")];
    const body = parseBody<Partial<Project>>(config.data);
    const updated: Project = { ...projects[index], ...body, id };
    projects[index] = updated;
    return [200, makeApiResponse(updated, "Project updated successfully")];
  });

  mock.onDelete(/^\/projects\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/projects\/(\d+)/)![1]);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return [404, makeErrorResponse("Project not found.")];
    const [removed] = projects.splice(index, 1);
    const program = findProgram(removed.program_id);
    if (program) program.projects_count = Math.max(0, (program.projects_count ?? 1) - 1);
    return [200, makeApiResponse(null, "Project deleted successfully")];
  });

  // --- Program-scoped cascading selects for the project form ----------------
  mock.onGet(/^\/projects\/program\/\d+\/kpas(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const programId = Number(config.url!.match(/\/projects\/program\/(\d+)\/kpas/)![1]);
    const query = parseQuery(config.url, config.params);
    const program = findProgram(programId);
    const ownedCks = program ? countryKpas.filter((ck) => ck.country_id === program.country_id) : [];
    const items = ownedCks
      .map((ck) => kpas.find((k) => k.id === ck.id_kpa))
      .filter((k): k is NonNullable<typeof k> => !!k)
      .filter((k) => matchesSearch(k.name, query.search ?? ""));
    return [200, makeApiResponse(makeListPayload("kpas", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  mock.onGet(/^\/projects\/program\/\d+\/kpas\/\d+\/strategic-outputs(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const match = config.url!.match(/\/projects\/program\/(\d+)\/kpas\/(\d+)\/strategic-outputs/)!;
    const programId = Number(match[1]);
    const kpaId = Number(match[2]);
    const query = parseQuery(config.url, config.params);
    const program = findProgram(programId);
    const ck = program ? countryKpas.find((c) => c.country_id === program.country_id && c.id_kpa === kpaId) : undefined;
    const items = ck ? strategicOutputs.filter((so) => so.id_ck === ck.id_ck).filter((so) => matchesSearch(so.name, query.search ?? "")) : [];
    return [200, makeApiResponse(makeListPayload("strategic_outputs", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  mock.onGet(/^\/projects\/program\/\d+\/strategic-outputs\/\d+\/measures(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const match = config.url!.match(/\/strategic-outputs\/(\d+)\/measures/)!;
    const soId = Number(match[1]);
    const query = parseQuery(config.url, config.params);
    const items = measures.filter((m) => m.strategic_output_id === soId).filter((m) => matchesSearch(m.name, query.search ?? ""));
    return [200, makeApiResponse(makeListPayload("measures", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  mock.onGet(/^\/projects\/program\/\d+\/measures\/\d+\/indicators(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const match = config.url!.match(/\/measures\/(\d+)\/indicators/)!;
    const measureId = Number(match[1]);
    const query = parseQuery(config.url, config.params);
    const excluded = (query.exclude ?? "").split(",").filter(Boolean).map(Number);
    const items = indicators
      .filter((i) => i.measure_id === measureId)
      .filter((i) => !excluded.includes(i.id))
      .filter((i) => matchesSearch(i.name, query.search ?? ""))
      .map((i) => ({
        id: i.id,
        name: i.name,
        target: i.target,
        actual_value: i.actual_value,
        measure_id: i.measure_id,
        type: indicatorTypes.find((t) => t.id === i.type_id),
      }));
    return [200, makeApiResponse(makeListPayload("indicators", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });
}
