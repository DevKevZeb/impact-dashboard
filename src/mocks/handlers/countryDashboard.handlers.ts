/**
 * Mocks for the country-KPA dashboard: the country_kpas tree (KPA -> strategic
 * output -> measure -> indicator), its fully-nested "/implementation" endpoint
 * (also used by the Excel export), and country activation.
 */
import type MockAdapter from "axios-mock-adapter";
import type { AxiosRequestConfig } from "axios";
import {
  makeApiResponse,
  makeErrorResponse,
  makeListPayload,
  makeNestedListPayload,
  parseQuery,
  parseBody,
  fakeId,
  matchesSearch,
  paginateArray,
} from "../fixtures/factories";
import {
  countries,
  countryKpas,
  strategicOutputs,
  measures,
  indicators,
  indicatorTypes,
  kpas,
  findCountry,
  countryKpaImplementation,
  type SeedStrategicOutput,
  type SeedMeasure,
  type SeedIndicator,
} from "../fixtures/seed";
import { buildCountryImplementationTree } from "../fixtures/dashboards";

function indicatorWire(indicator: SeedIndicator) {
  const type = indicatorTypes.find((t) => t.id === indicator.type_id);
  return {
    id: indicator.id,
    name: indicator.name,
    target: indicator.target,
    actual_value: indicator.actual_value,
    measure_id: indicator.measure_id,
    type: type ? { id: type.id, name: type.name, is_bottom_up: type.is_bottom_up } : undefined,
  };
}

function recomputeMeasureCount(strategicOutputId: number) {
  const so = strategicOutputs.find((s) => s.id === strategicOutputId);
  if (!so) return;
  so.measures_count = measures.filter((m) => m.strategic_output_id === strategicOutputId).length;
}

function recomputeSoCount(idCk: number) {
  const ck = countryKpas.find((c) => c.id_ck === idCk);
  if (!ck) return;
  const ownSos = strategicOutputs.filter((so) => so.id_ck === idCk);
  ck.strategic_outputs_count = ownSos.length;
  ck.measures_count = ownSos.reduce((sum, so) => sum + measures.filter((m) => m.strategic_output_id === so.id).length, 0);
  ck.indicators_count = ownSos.reduce(
    (sum, so) =>
      sum +
      measures
        .filter((m) => m.strategic_output_id === so.id)
        .reduce((mSum, m) => mSum + indicators.filter((i) => i.measure_id === m.id).length, 0),
    0
  );
}

function idCkForStrategicOutput(soId: number): number | undefined {
  return strategicOutputs.find((s) => s.id === soId)?.id_ck;
}

function soIdForMeasure(measureId: number): number | undefined {
  return measures.find((m) => m.id === measureId)?.strategic_output_id;
}

export function registerCountryDashboardHandlers(mock: MockAdapter): void {
  // Flat KPA list for one country (root nodes of the KPA tree).
  mock.onGet(/^\/country_kpas\/country\/\d+(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const countryId = Number(config.url!.match(/\/country_kpas\/country\/(\d+)/)![1]);
    const query = parseQuery(config.url, config.params);
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 10);

    const country = findCountry(countryId);
    const ownedCks = countryKpas.filter((ck) => ck.country_id === countryId);
    const { pageItems, pagination } = paginateArray(ownedCks, page, perPage < 0 ? ownedCks.length || 1 : perPage);

    return [
      200,
      makeApiResponse({
        country: country ? { id: country.id, name: country.name, active: country.active } : undefined,
        kpas: pageItems.map((ck) => ({
          id_kpa: ck.id_kpa,
          id_ck: ck.id_ck,
          name: ck.name,
          implementation: countryKpaImplementation(ck.id_ck),
          strategic_outputs_count: ck.strategic_outputs_count,
          measures_count: ck.measures_count,
          indicators_count: ck.indicators_count,
        })),
        pagination,
      }),
    ];
  });

  // Fully-nested KPA -> SO -> measure -> indicator tree (table view + Excel export).
  mock.onGet(/^\/country_kpas\/country\/\d+\/implementation(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const countryId = Number(config.url!.match(/\/country_kpas\/country\/(\d+)\/implementation/)![1]);
    const query = parseQuery(config.url, config.params);
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 10);
    return [200, makeApiResponse(buildCountryImplementationTree(countryId, page, perPage))];
  });

  mock.onPost("/country_kpas").reply((config: AxiosRequestConfig) => {
    const body = parseBody<{ id_country?: number; id_kpa?: number }>(config.data);
    const country = findCountry(Number(body.id_country));
    const kpa = kpas.find((k) => k.id === Number(body.id_kpa));

    if (!country || !kpa) {
      return [422, makeErrorResponse("The given data was invalid.", { id_kpa: ["This KPA/country combination is invalid."] })];
    }

    if (countryKpas.some((ck) => ck.country_id === country.id && ck.id_kpa === kpa.id)) {
      return [422, makeErrorResponse("The given data was invalid.", { id_kpa: ["This KPA is already assigned to this country."] })];
    }

    const idCk = fakeId();
    countryKpas.push({
      id_ck: idCk,
      country_id: country.id,
      id_kpa: kpa.id,
      name: kpa.name,
      strategic_outputs_count: 0,
      measures_count: 0,
      indicators_count: 0,
    });

    return [201, makeApiResponse({ id_ck: idCk, id_country: country.id, id_kpa: kpa.id }, "KPA assigned to country successfully")];
  });

  mock.onPut(/^\/country_kpas\/\d+$/).reply((config: AxiosRequestConfig) => {
    const idCk = Number(config.url!.match(/\/country_kpas\/(\d+)/)![1]);
    const body = parseBody<{ country_id?: number }>(config.data);
    const ck = countryKpas.find((c) => c.id_ck === idCk);
    if (!ck) return [404, makeErrorResponse("Country KPA relation not found.")];
    if (body.country_id) ck.country_id = Number(body.country_id);
    return [200, makeApiResponse(ck, "Country KPA relation updated successfully")];
  });

  // Countries eligible to be assigned a new KPA (used by the "Assign KPA" modal).
  mock.onGet(/^\/countries\/available-for-kpa(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const query = parseQuery(config.url, config.params);
    const search = query.search ?? "";
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 10);
    const filtered = countries.filter((c) => matchesSearch(c.name, search));
    return [200, makeApiResponse(makeListPayload("countries", filtered, page, perPage))];
  });

  mock.onPatch(/^\/countries\/\d+\/activate$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/countries\/(\d+)\/activate/)![1]);
    const country = findCountry(id);
    if (!country) return [404, makeErrorResponse("Country not found.")];
    country.active = true;
    return [200, makeApiResponse(country, "Country activated successfully")];
  });

  // --- Strategic outputs -----------------------------------------------
  mock.onGet(/^\/strategic-outputs\/country-kpa\/\d+(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const idCk = Number(config.url!.match(/\/strategic-outputs\/country-kpa\/(\d+)/)![1]);
    const query = parseQuery(config.url, config.params);
    const items = strategicOutputs.filter((so) => so.id_ck === idCk);
    return [200, makeApiResponse(makeListPayload("strategic_outputs", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  mock.onGet(/^\/strategic-outputs\/kpa\/\d+(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const kpaId = Number(config.url!.match(/\/strategic-outputs\/kpa\/(\d+)/)![1]);
    const query = parseQuery(config.url, config.params);
    const ownedCkIds = new Set(countryKpas.filter((ck) => ck.id_kpa === kpaId).map((ck) => ck.id_ck));
    const items = strategicOutputs
      .filter((so) => ownedCkIds.has(so.id_ck))
      .filter((so) => matchesSearch(so.name, query.search ?? ""))
      .map((so) => {
        const ck = countryKpas.find((c) => c.id_ck === so.id_ck);
        const country = ck ? findCountry(ck.country_id) : undefined;
        return { ...so, country_kpa: { country: { id: country?.id ?? 0, name: country?.name ?? "" } } };
      });
    return [200, makeApiResponse(makeListPayload("strategic_outputs", items, Number(query.page ?? 1), Number(query.per_page ?? 5)))];
  });

  mock.onPost("/strategic-outputs").reply((config: AxiosRequestConfig) => {
    const body = parseBody<{ name?: string; id_ck?: number }>(config.data);
    const idCk = Number(body.id_ck);
    if (!body.name || !countryKpas.some((ck) => ck.id_ck === idCk)) {
      return [422, makeErrorResponse("The given data was invalid.", { name: ["Name is required."] })];
    }
    const created: SeedStrategicOutput = { id: fakeId(), name: body.name, id_ck: idCk, measures_count: 0 };
    strategicOutputs.push(created);
    recomputeSoCount(idCk);
    return [201, makeApiResponse(created, "Strategic output created successfully")];
  });

  mock.onPut(/^\/strategic-outputs\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/strategic-outputs\/(\d+)/)![1]);
    const body = parseBody<{ name?: string; id_ck?: number }>(config.data);
    const so = strategicOutputs.find((s) => s.id === id);
    if (!so) return [404, makeErrorResponse("Strategic output not found.")];
    const previousCk = so.id_ck;
    if (body.name) so.name = body.name;
    if (body.id_ck) so.id_ck = Number(body.id_ck);
    recomputeSoCount(previousCk);
    recomputeSoCount(so.id_ck);
    return [200, makeApiResponse(so, "Strategic output updated successfully")];
  });

  mock.onDelete(/^\/strategic-outputs\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/strategic-outputs\/(\d+)/)![1]);
    const index = strategicOutputs.findIndex((s) => s.id === id);
    if (index === -1) return [404, makeErrorResponse("Strategic output not found.")];
    const [removed] = strategicOutputs.splice(index, 1);
    const measureIdsToRemove = measures.filter((m) => m.strategic_output_id === id).map((m) => m.id);
    for (let i = measures.length - 1; i >= 0; i--) {
      if (measures[i].strategic_output_id === id) measures.splice(i, 1);
    }
    for (let i = indicators.length - 1; i >= 0; i--) {
      if (measureIdsToRemove.includes(indicators[i].measure_id)) indicators.splice(i, 1);
    }
    recomputeSoCount(removed.id_ck);
    return [200, makeApiResponse([], "Strategic output deleted successfully")];
  });

  // --- Measures -----------------------------------------------------------
  mock.onGet(/^\/measures\/strategic-output\/\d+(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const soId = Number(config.url!.match(/\/measures\/strategic-output\/(\d+)/)![1]);
    const query = parseQuery(config.url, config.params);
    const items = measures.filter((m) => m.strategic_output_id === soId);
    return [200, makeApiResponse(makeListPayload("measures", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  mock.onGet(/^\/measures\/get\/strategic-output\/\d+(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const soId = Number(config.url!.match(/\/measures\/get\/strategic-output\/(\d+)/)![1]);
    const query = parseQuery(config.url, config.params);
    const items = measures.filter((m) => m.strategic_output_id === soId).filter((m) => matchesSearch(m.name, query.search ?? ""));
    return [200, makeApiResponse(makeListPayload("measures", items, Number(query.page ?? 1), Number(query.per_page ?? 5)))];
  });

  mock.onPost("/measures").reply((config: AxiosRequestConfig) => {
    const body = parseBody<{ name?: string; strategic_output_id?: number }>(config.data);
    const soId = Number(body.strategic_output_id);
    if (!body.name || !strategicOutputs.some((s) => s.id === soId)) {
      return [422, makeErrorResponse("The given data was invalid.", { name: ["Name is required."] })];
    }
    const created: SeedMeasure = { id: fakeId(), name: body.name, strategic_output_id: soId, indicators_count: 0 };
    measures.push(created);
    recomputeMeasureCount(soId);
    const idCk = idCkForStrategicOutput(soId);
    if (idCk) recomputeSoCount(idCk);
    return [201, makeApiResponse(created, "Measure created successfully")];
  });

  mock.onPut(/^\/measures\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/measures\/(\d+)/)![1]);
    const body = parseBody<{ name?: string; strategic_output_id?: number }>(config.data);
    const measure = measures.find((m) => m.id === id);
    if (!measure) return [404, makeErrorResponse("Measure not found.")];
    const previousSoId = measure.strategic_output_id;
    if (body.name) measure.name = body.name;
    if (body.strategic_output_id) measure.strategic_output_id = Number(body.strategic_output_id);
    recomputeMeasureCount(previousSoId);
    recomputeMeasureCount(measure.strategic_output_id);
    return [200, makeApiResponse(measure, "Measure updated successfully")];
  });

  mock.onDelete(/^\/measures\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/measures\/(\d+)/)![1]);
    const index = measures.findIndex((m) => m.id === id);
    if (index === -1) return [404, makeErrorResponse("Measure not found.")];
    const [removed] = measures.splice(index, 1);
    for (let i = indicators.length - 1; i >= 0; i--) {
      if (indicators[i].measure_id === id) indicators.splice(i, 1);
    }
    recomputeMeasureCount(removed.strategic_output_id);
    const idCk = idCkForStrategicOutput(removed.strategic_output_id);
    if (idCk) recomputeSoCount(idCk);
    return [200, makeApiResponse([], "Measure deleted successfully")];
  });

  // --- Indicators -----------------------------------------------------------
  mock.onGet(/^\/measures-indicators\/\d+(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const measureId = Number(config.url!.match(/\/measures-indicators\/(\d+)/)![1]);
    const query = parseQuery(config.url, config.params);
    const items = indicators.filter((i) => i.measure_id === measureId).map(indicatorWire);
    return [200, makeApiResponse(makeNestedListPayload("indicators", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  mock.onGet(/^\/indicators\/measure\/\d+(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const measureId = Number(config.url!.match(/\/indicators\/measure\/(\d+)/)![1]);
    const query = parseQuery(config.url, config.params);
    const excluded = (query.exclude ?? "").split(",").filter(Boolean).map(Number);
    const items = indicators
      .filter((i) => i.measure_id === measureId)
      .filter((i) => !excluded.includes(i.id))
      .filter((i) => matchesSearch(i.name, query.search ?? ""))
      .map(indicatorWire);
    return [200, makeApiResponse(makeListPayload("indicators", items, Number(query.page ?? 1), Number(query.per_page ?? 20)))];
  });

  mock.onPost("/indicators").reply((config: AxiosRequestConfig) => {
    const body = parseBody<{ name?: string; target?: number; type_id?: number; measure_id?: number; actual_value?: number }>(config.data);
    const measureId = Number(body.measure_id);
    if (!body.name || !measures.some((m) => m.id === measureId)) {
      return [422, makeErrorResponse("The given data was invalid.", { name: ["Name is required."] })];
    }
    const created: SeedIndicator = {
      id: fakeId(),
      name: body.name,
      target: Number(body.target ?? 0),
      actual_value: Number(body.actual_value ?? 0),
      type_id: Number(body.type_id ?? indicatorTypes[0].id),
      measure_id: measureId,
    };
    indicators.push(created);
    const measure = measures.find((m) => m.id === measureId);
    if (measure) {
      measure.indicators_count = indicators.filter((i) => i.measure_id === measureId).length;
      const idCk = idCkForStrategicOutput(measure.strategic_output_id);
      if (idCk) recomputeSoCount(idCk);
    }
    return [201, makeApiResponse(indicatorWire(created), "Indicator created successfully")];
  });

  mock.onPut(/^\/indicators\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/indicators\/(\d+)/)![1]);
    const body = parseBody<{ name?: string; target?: number; type_id?: number; measure_id?: number; actual_value?: number }>(config.data);
    const indicator = indicators.find((i) => i.id === id);
    if (!indicator) return [404, makeErrorResponse("Indicator not found.")];
    const previousMeasureId = indicator.measure_id;
    if (body.name) indicator.name = body.name;
    if (body.target !== undefined) indicator.target = Number(body.target);
    if (body.actual_value !== undefined) indicator.actual_value = Number(body.actual_value);
    if (body.type_id !== undefined) indicator.type_id = Number(body.type_id);
    if (body.measure_id !== undefined) indicator.measure_id = Number(body.measure_id);

    [previousMeasureId, indicator.measure_id].forEach((measureId) => {
      const measure = measures.find((m) => m.id === measureId);
      if (measure) {
        measure.indicators_count = indicators.filter((i) => i.measure_id === measureId).length;
        const idCk = idCkForStrategicOutput(measure.strategic_output_id);
        if (idCk) recomputeSoCount(idCk);
      }
    });

    return [200, makeApiResponse(indicatorWire(indicator), "Indicator updated successfully")];
  });

  mock.onDelete(/^\/indicators\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/indicators\/(\d+)/)![1]);
    const index = indicators.findIndex((i) => i.id === id);
    if (index === -1) return [404, makeErrorResponse("Indicator not found.")];
    const [removed] = indicators.splice(index, 1);
    const measure = measures.find((m) => m.id === removed.measure_id);
    if (measure) {
      measure.indicators_count = indicators.filter((i) => i.measure_id === removed.measure_id).length;
      const idCk = soIdForMeasure(measure.id) ? idCkForStrategicOutput(measure.strategic_output_id) : undefined;
      if (idCk) recomputeSoCount(idCk);
    }
    return [200, makeApiResponse([], "Indicator deleted successfully")];
  });
}
