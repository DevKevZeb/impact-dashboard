/**
 * Mocks for the public-facing (iframe-embeddable) site: registered on the
 * `publicApiClient` instance from `src/shared/lib/axios.public.ts` (baseURL
 * already ends in `/public`, so handlers below match bare paths like
 * `/countries`, `/programs`, etc.).
 */
import type MockAdapter from "axios-mock-adapter";
import type { AxiosRequestConfig } from "axios";
import { makeApiResponse, makeListPayload, parseQuery, matchesSearch } from "../fixtures/factories";
import {
  countries,
  kpas,
  strategicOutputs,
  measures,
  projectStates,
  programStates,
  programs,
  projects,
  countryKpas,
  findCountry,
  countryKpaImplementation,
  strategicOutputImplementation,
  measureImplementation,
} from "../fixtures/seed";

function projectsFor(predicate: (p: (typeof projects)[number]) => boolean) {
  return projects.filter(predicate);
}

/**
 * Matches the real `ProgressSelectedData` shape consumed by OverallSection /
 * KpaSection / etc: `resource` (total budget), `donors`/`agencies`
 * (aggregated `{id, name, contribution}` breakdowns), and `name` - which
 * `OverallSection` parses with `/^(\d+)/` to show "N measures", so it must
 * start with the measure count, not a label.
 */
function contributionSummary(relatedProjects: typeof projects) {
  const donorTotals = new Map<number, { id: number; name: string; contribution: number }>();
  const agencyTotals = new Map<number, { id: number; name: string; contribution: number }>();
  let resource = 0;

  relatedProjects.forEach((p) => {
    resource += p.budget ?? 0;
    p.donors.forEach((d) => {
      if (!d.id) return;
      const entry = donorTotals.get(d.id) ?? { id: d.id, name: d.name, contribution: 0 };
      entry.contribution += d.contribution;
      donorTotals.set(d.id, entry);
    });
    p.agencies.forEach((a) => {
      if (!a.id) return;
      const entry = agencyTotals.get(a.id) ?? { id: a.id, name: a.name, contribution: 0 };
      entry.contribution += a.contribution;
      agencyTotals.set(a.id, entry);
    });
  });

  return {
    resource,
    donors: Array.from(donorTotals.values()),
    agencies: Array.from(agencyTotals.values()),
    beneficiaries: Array.from(new Set(relatedProjects.map((p) => p.beneficiary?.name).filter(Boolean))).map((name) => ({
      name,
      beneficiaries: [],
    })),
  };
}

/** Total measure count across a set of country-KPA ids (or all measures when omitted). */
function measureCountForCks(ckIds?: number[]): number {
  if (!ckIds) return measures.length;
  const ckIdSet = new Set(ckIds);
  const soIds = new Set(strategicOutputs.filter((so) => ckIdSet.has(so.id_ck)).map((so) => so.id));
  return measures.filter((m) => soIds.has(m.strategic_output_id)).length;
}

export function registerPublicHandlers(mock: MockAdapter): void {
  // --- Filter catalogs (countries/kpas/strategic-outputs/measures/states) ---
  mock.onGet(/^\/countries(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 20);
    const activeOnly = query.active === "true";
    const filtered = countries.filter((c) => (activeOnly ? c.active : true)).filter((c) => matchesSearch(c.name, query.search ?? ""));
    return [200, makeApiResponse(makeListPayload("countries", filtered, page, perPage))];
  });

  mock.onGet(/^\/kpas\/\d+(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const countryId = Number(cfg.url!.match(/\/kpas\/(\d+)/)![1]);
    const query = parseQuery(cfg.url, cfg.params);
    const ownedKpaIds = new Set(countryKpas.filter((ck) => ck.country_id === countryId).map((ck) => ck.id_kpa));
    const items = kpas.filter((k) => ownedKpaIds.has(k.id)).filter((k) => matchesSearch(k.name, query.search ?? ""));
    return [200, makeApiResponse(makeListPayload("kpas", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  mock.onGet(/^\/strategic-outputs\/\d+(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const kpaId = Number(cfg.url!.match(/\/strategic-outputs\/(\d+)/)![1]);
    const query = parseQuery(cfg.url, cfg.params);
    const ckIds = new Set(countryKpas.filter((ck) => ck.id_kpa === kpaId).map((ck) => ck.id_ck));
    const items = strategicOutputs.filter((so) => ckIds.has(so.id_ck)).filter((so) => matchesSearch(so.name, query.search ?? ""));
    return [200, makeApiResponse(makeListPayload("strategic_outputs", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  mock.onGet(/^\/measures\/\d+(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const soId = Number(cfg.url!.match(/\/measures\/(\d+)/)![1]);
    const query = parseQuery(cfg.url, cfg.params);
    const items = measures.filter((m) => m.strategic_output_id === soId).filter((m) => matchesSearch(m.name, query.search ?? ""));
    return [200, makeApiResponse(makeListPayload("measures", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  mock.onGet(/^\/project-states(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const items = projectStates.filter((s) => matchesSearch(s.state, query.search ?? ""));
    return [200, makeApiResponse(makeListPayload("project_states", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  mock.onGet(/^\/program-states(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const items = programStates.filter((s) => matchesSearch(s.name, query.search ?? ""));
    return [200, makeApiResponse(makeListPayload("program_states", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  // --- Public programs --------------------------------------------------
  mock.onPost(/^\/programs(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 9);
    const search = query.search ?? "";
    const filtered = programs.filter((p) => matchesSearch(p.name, search) || matchesSearch(p.description, search));
    return [200, makeApiResponse(makeListPayload("programs", filtered, page, perPage))];
  });

  mock.onGet(/^\/programs\/\d+$/).reply((cfg: AxiosRequestConfig) => {
    const id = Number(cfg.url!.match(/\/programs\/(\d+)/)![1]);
    const program = programs.find((p) => p.id === id);
    return [200, makeApiResponse(program ?? null)];
  });

  // --- Public projects ----------------------------------------------------
  mock.onPost(/^\/projects(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 9);
    const search = query.search ?? "";
    const programId = query.program_id ? Number(query.program_id) : undefined;
    let filtered = projects.filter((p) => matchesSearch(p.name, search) || matchesSearch(p.description, search));
    if (programId) filtered = filtered.filter((p) => p.program_id === programId);
    return [200, makeApiResponse(makeListPayload("projects", filtered, page, perPage))];
  });

  mock.onGet(/^\/projects\/\d+$/).reply((cfg: AxiosRequestConfig) => {
    const id = Number(cfg.url!.match(/\/projects\/(\d+)/)![1]);
    const project = projects.find((p) => p.id === id);
    return [200, makeApiResponse(project ?? null)];
  });

  // --- Progress / implementation rollups -----------------------------------
  mock.onGet(/^\/overall-implementation(\?.*)?$/).reply(() => {
    const values = countryKpas.map((ck) => countryKpaImplementation(ck.id_ck));
    const implementation = values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100 : 0;
    return [200, makeApiResponse({ name: `${measureCountForCks()} measures`, implementation, ...contributionSummary(projects) })];
  });

  mock.onGet(/^\/country-overall-implementation\/\d+$/).reply((cfg: AxiosRequestConfig) => {
    const countryId = Number(cfg.url!.match(/\/country-overall-implementation\/(\d+)/)![1]);
    const ownedCks = countryKpas.filter((ck) => ck.country_id === countryId);
    const values = ownedCks.map((ck) => countryKpaImplementation(ck.id_ck));
    const implementation = values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100 : 0;
    const related = projectsFor((p) => findCountry(programs.find((prog) => prog.id === p.program_id)?.country_id ?? -1)?.id === countryId);
    const measureCount = measureCountForCks(ownedCks.map((ck) => ck.id_ck));
    return [200, makeApiResponse({ name: `${measureCount} measures`, implementation, ...contributionSummary(related) })];
  });

  // `KpaSection` expects `{ kpas: [...], resource }`, each kpa carrying its
  // own `resource`/`agencies`/`donors` breakdown (used by
  // mapKpasResourcePercent / aggregateContributorsByKpa) - NOT a bare array.
  mock.onGet(/^\/allkpas-implementation(\?.*)?$/).reply(() => {
    const kpaItems = kpas.map((k) => {
      const cks = countryKpas.filter((ck) => ck.id_kpa === k.id);
      const values = cks.map((ck) => countryKpaImplementation(ck.id_ck));
      const implementation = values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100 : 0;
      const related = projectsFor((p) => p.kpa?.id === k.id);
      return { id: k.id, name: k.name, implementation, ...contributionSummary(related) };
    });
    const totalResource = kpaItems.reduce((sum, k) => sum + k.resource, 0);
    return [200, makeApiResponse({ kpas: kpaItems, resource: totalResource })];
  });

  mock.onGet(/^\/country-allkpas-implementation\/\d+$/).reply((cfg: AxiosRequestConfig) => {
    const countryId = Number(cfg.url!.match(/\/country-allkpas-implementation\/(\d+)/)![1]);
    const ownedCks = countryKpas.filter((ck) => ck.country_id === countryId);
    const kpaItems = ownedCks.map((ck) => {
      const related = projectsFor((p) => p.kpa?.id === ck.id_kpa && findCountry(programs.find((prog) => prog.id === p.program_id)?.country_id ?? -1)?.id === countryId);
      return { id: ck.id_kpa, name: ck.name, implementation: countryKpaImplementation(ck.id_ck), ...contributionSummary(related) };
    });
    const totalResource = kpaItems.reduce((sum, k) => sum + k.resource, 0);
    return [200, makeApiResponse({ kpas: kpaItems, resource: totalResource })];
  });

  mock.onGet(/^\/kpa-implementation\/\d+$/).reply((cfg: AxiosRequestConfig) => {
    const kpaId = Number(cfg.url!.match(/\/kpa-implementation\/(\d+)/)![1]);
    const kpa = kpas.find((k) => k.id === kpaId);
    const cks = countryKpas.filter((ck) => ck.id_kpa === kpaId);
    const values = cks.map((ck) => countryKpaImplementation(ck.id_ck));
    const implementation = values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100 : 0;
    const related = projectsFor((p) => p.kpa?.id === kpaId);
    return [200, makeApiResponse({ name: kpa?.name ?? "KPA", implementation, ...contributionSummary(related) })];
  });

  mock.onGet(/^\/strategic-output-implementation\/\d+$/).reply((cfg: AxiosRequestConfig) => {
    const soId = Number(cfg.url!.match(/\/strategic-output-implementation\/(\d+)/)![1]);
    const so = strategicOutputs.find((s) => s.id === soId);
    const related = projectsFor((p) => p.strategic_output?.id === soId);
    return [200, makeApiResponse({ name: so?.name ?? "Strategic Output", implementation: strategicOutputImplementation(soId), ...contributionSummary(related) })];
  });

  mock.onGet(/^\/measure-implementation\/\d+$/).reply((cfg: AxiosRequestConfig) => {
    const measureId = Number(cfg.url!.match(/\/measure-implementation\/(\d+)/)![1]);
    const measure = measures.find((m) => m.id === measureId);
    const related = projectsFor((p) => p.measure?.id === measureId);
    return [200, makeApiResponse({ name: measure?.name ?? "Measure", implementation: measureImplementation(measureId), ...contributionSummary(related) })];
  });

  // --- Regional statistics overview (Statistics page) -----------------------
  mock.onGet(/^\/statistics-overview(\?.*)?$/).reply(() => {
    const countryStats = countries.map((c) => {
      const ownedCks = countryKpas.filter((ck) => ck.country_id === c.id);
      const values = ownedCks.map((ck) => countryKpaImplementation(ck.id_ck));
      const implementation = values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100 : 0;
      return { id: c.id, name: c.name, implementation };
    });
    const kpaStats = kpas.map((k) => {
      const cks = countryKpas.filter((ck) => ck.id_kpa === k.id);
      const values = cks.map((ck) => countryKpaImplementation(ck.id_ck));
      const implementation = values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100 : 0;
      return { id: k.id, name: k.name, implementation };
    });
    const avgImplementation = countryStats.length
      ? Math.round((countryStats.reduce((s, c) => s + c.implementation, 0) / countryStats.length) * 100) / 100
      : 0;

    return [
      200,
      makeApiResponse({
        countries_active: countries.filter((c) => c.active).length,
        countries_total: countries.length,
        programs_total: programs.length,
        projects_total: projects.length,
        avg_implementation: avgImplementation,
        countries: countryStats,
        kpas: kpaStats,
      }),
    ];
  });
}

/** Registered separately on the ad-hoc `publicCountry.api.ts` axios instance, whose baseURL does NOT include `/public` (the path is passed explicitly). */
export function registerPublicCountryHandlers(mock: MockAdapter): void {
  mock.onGet(/^\/public\/countries(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const perPage = Number(query.per_page ?? 100);
    return [200, makeApiResponse(makeListPayload("countries", countries, 1, perPage))];
  });
}
