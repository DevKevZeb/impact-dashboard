/**
 * Mocks for /projects/dashboard (the flat, cross-country project dashboard
 * table) and its two inline-edit endpoints (progress, weight).
 */
import type MockAdapter from "axios-mock-adapter";
import type { AxiosRequestConfig } from "axios";
import { makeApiResponse, makeErrorResponse, parseQuery, parseBody, matchesSearch, paginateArray } from "../fixtures/factories";
import { buildProjectDashboardRows } from "../fixtures/dashboards";
import { projects, findProgram } from "../fixtures/seed";

/** Rows in the same order as `projects`, each tagged with its owning country id for filtering. */
function rowsWithCountryId() {
  const rows = buildProjectDashboardRows();
  return rows.map((row, index) => {
    const project = projects[index];
    const program = project ? findProgram(project.program_id) : undefined;
    return { row, countryId: program?.country_id };
  });
}

export function registerProjectDashboardHandlers(mock: MockAdapter): void {
  mock.onGet(/^\/projects\/dashboard(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const query = parseQuery(config.url, config.params);
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 10);
    const search = query.search ?? "";
    const countryId = query.country_id ? Number(query.country_id) : undefined;

    let rows = rowsWithCountryId();

    if (countryId) {
      rows = rows.filter((entry) => entry.countryId === countryId);
    }

    if (search) {
      rows = rows.filter(
        (entry) =>
          matchesSearch(entry.row.project_title, search) ||
          matchesSearch(entry.row.program_title, search) ||
          matchesSearch(entry.row.country, search) ||
          matchesSearch(entry.row.measure, search)
      );
    }

    const { pageItems, pagination } = paginateArray(rows, page, perPage);
    return [
      200,
      makeApiResponse({
        projects: pageItems.map((entry) => entry.row),
        ...pagination,
      }),
    ];
  });

  mock.onPatch(/^\/projects\/\d+\/dashboard-progress$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/projects\/(\d+)\/dashboard-progress/)![1]);
    const body = parseBody<{ progress?: number }>(config.data);
    const project = projects.find((p) => p.id === id);
    if (!project) return [404, makeErrorResponse("Project not found.")];
    project.progress = Number(body.progress ?? project.progress);
    return [200, makeApiResponse({ id: project.id, progress: project.progress }, "Project progress updated successfully")];
  });

  mock.onPatch(/^\/projects\/\d+\/dashboard-weight$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/projects\/(\d+)\/dashboard-weight/)![1]);
    const body = parseBody<{ weight?: number }>(config.data);
    const project = projects.find((p) => p.id === id);
    if (!project) return [404, makeErrorResponse("Project not found.")];
    project.weight = Number(body.weight ?? project.weight);
    return [200, makeApiResponse({ id: project.id, weight: project.weight }, "Project weight updated successfully")];
  });
}
