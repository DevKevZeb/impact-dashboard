/**
 * Reusable list/create/update/delete mocks for the Tier-2 "reference data"
 * modules (donors, agencies, beneficiaries, indicator types, KPAs, project
 * states, countries) - all share the same `{ page, per_page, search }` list
 * shape and simple `{ id, name, ... }` records, so one factory covers them.
 * SDGs and Users are handled separately below (file upload / sub-resources).
 */
import type MockAdapter from "axios-mock-adapter";
import type { AxiosRequestConfig } from "axios";
import {
  makeApiResponse,
  makeErrorResponse,
  makeListPayload,
  parseQuery,
  parseBody,
  matchesSearch,
  paginateArray,
  fakeId,
} from "../fixtures/factories";
import { donors, agencies, beneficiaries, kpas, indicatorTypes, projectStates, countries, currencies, sdgs, demoUsers } from "../fixtures/seed";
import type { SeedIndicator } from "../fixtures/seed";

interface SimpleResourceConfig<T extends { id: number }> {
  basePath: string;
  listKey: string;
  items: T[];
  searchField: (item: T) => string | undefined;
  buildCreated: (body: Record<string, unknown>) => T;
  applyUpdate: (item: T, body: Record<string, unknown>) => void;
  toWire?: (item: T) => unknown;
}

function registerSimpleResource<T extends { id: number }>(mock: MockAdapter, config: SimpleResourceConfig<T>): void {
  const { basePath, listKey, items, searchField, buildCreated, applyUpdate, toWire } = config;
  const wire = (item: T) => (toWire ? toWire(item) : item);
  const pathRegex = new RegExp(`^${basePath}(\\?.*)?$`);
  const itemRegex = new RegExp(`^${basePath}/\\d+$`);

  mock.onGet(pathRegex).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? (query.page ? 10 : items.length || 10));
    const search = query.search ?? "";
    const filtered = search ? items.filter((i) => matchesSearch(searchField(i), search)) : items;
    return [200, makeApiResponse(makeListPayload(listKey, filtered.map(wire), page, perPage))];
  });

  mock.onPost(basePath).reply((cfg: AxiosRequestConfig) => {
    const body = parseBody<Record<string, unknown>>(cfg.data);
    if (!body.name && !body.state) {
      return [422, makeErrorResponse("The given data was invalid.", { name: ["Name is required."] })];
    }
    const created = buildCreated(body);
    items.push(created);
    return [201, makeApiResponse(wire(created), "Created successfully")];
  });

  mock.onPut(itemRegex).reply((cfg: AxiosRequestConfig) => {
    const id = Number(cfg.url!.match(/\/(\d+)$/)![1]);
    const item = items.find((i) => i.id === id);
    if (!item) return [404, makeErrorResponse("Not found.")];
    const body = parseBody<Record<string, unknown>>(cfg.data);
    applyUpdate(item, body);
    return [200, makeApiResponse(wire(item), "Updated successfully")];
  });

  mock.onDelete(itemRegex).reply((cfg: AxiosRequestConfig) => {
    const id = Number(cfg.url!.match(/\/(\d+)$/)![1]);
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return [404, makeErrorResponse("Not found.")];
    items.splice(index, 1);
    return [200, makeApiResponse([], "Deleted successfully")];
  });
}

export function registerGenericCrudHandlers(mock: MockAdapter): void {
  registerSimpleResource(mock, {
    basePath: "/donors",
    listKey: "donors",
    items: donors,
    searchField: (d) => d.name,
    buildCreated: (b) => ({ id: fakeId(), name: String(b.name) }),
    applyUpdate: (d, b) => { if (b.name) d.name = String(b.name); },
  });

  mock.onGet(/^\/donors\/get\/project(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const excluded = (query.exclude ?? "").split(",").filter(Boolean).map(Number);
    const search = query.search ?? "";
    const filtered = donors.filter((d) => !excluded.includes(d.id) && matchesSearch(d.name, search));
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 10);
    const { pageItems, pagination } = paginateArray(filtered, page, perPage);
    return [200, makeApiResponse({ donors: pageItems, current_page: pagination.current_page, last_page: pagination.last_page, all: filtered.length })];
  });

  registerSimpleResource(mock, {
    basePath: "/beneficiaries",
    listKey: "beneficiaries",
    items: beneficiaries,
    searchField: (b) => b.name,
    buildCreated: (b) => ({ id: fakeId(), name: String(b.name) }),
    applyUpdate: (b, body) => { if (body.name) b.name = String(body.name); },
  });

  registerSimpleResource(mock, {
    basePath: "/agencies",
    listKey: "agencies",
    items: agencies,
    searchField: (a) => a.name,
    buildCreated: (b) => ({ id: fakeId(), name: String(b.name), url: b.url as string | undefined, isApproved: Boolean(b.is_approved) }),
    applyUpdate: (a, b) => {
      if (b.name) a.name = String(b.name);
      if (b.url !== undefined) a.url = b.url as string;
      if (b.is_approved !== undefined) a.isApproved = Boolean(b.is_approved);
    },
    toWire: (a) => ({ id: a.id, name: a.name, url: a.url, is_approved: a.isApproved }),
  });

  mock.onGet(/^\/agencies\/get\/project(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const excluded = (query.exclude ?? "").split(",").filter(Boolean).map(Number);
    const search = query.search ?? "";
    const filtered = agencies.filter((a) => !excluded.includes(a.id) && matchesSearch(a.name, search));
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 10);
    const { pageItems, pagination } = paginateArray(filtered, page, perPage);
    return [
      200,
      makeApiResponse({
        agencies: pageItems.map((a) => ({ id: a.id, name: a.name, url: a.url, is_approved: a.isApproved })),
        current_page: pagination.current_page,
        last_page: pagination.last_page,
        all: filtered.length,
      }),
    ];
  });

  registerSimpleResource(mock, {
    basePath: "/indicator-types",
    listKey: "indicator_types",
    items: indicatorTypes,
    searchField: (t) => t.name,
    buildCreated: (b) => ({ id: fakeId(), name: String(b.name), is_bottom_up: Boolean(b.is_bottom_up) }),
    applyUpdate: (t, b) => {
      if (b.name) t.name = String(b.name);
      if (b.is_bottom_up !== undefined) t.is_bottom_up = Boolean(b.is_bottom_up);
    },
  });

  registerSimpleResource(mock, {
    basePath: "/kpas",
    listKey: "kpas",
    items: kpas,
    searchField: (k) => k.name,
    buildCreated: (b) => ({ id: fakeId(), name: String(b.name), implementation: 0 }),
    applyUpdate: (k, b) => { if (b.name) k.name = String(b.name); },
  });

  registerSimpleResource(mock, {
    basePath: "/project-states",
    listKey: "project_states",
    items: projectStates,
    searchField: (s) => s.state,
    buildCreated: (b) => ({ id: fakeId(), state: String(b.state) }),
    applyUpdate: (s, b) => { if (b.state) s.state = String(b.state); },
  });

  registerSimpleResource(mock, {
    basePath: "/countries",
    listKey: "countries",
    items: countries,
    searchField: (c) => c.name,
    buildCreated: (b) => {
      const currency = (b.currency as { id?: number; code?: string }) ?? {};
      return { id: fakeId(), name: String(b.name), active: false, currency: { id: Number(currency.id ?? 1), code: String(currency.code ?? "USD") } };
    },
    applyUpdate: (c, b) => {
      if (b.name) c.name = String(b.name);
      if (b.currency) c.currency = b.currency as typeof c.currency;
    },
  });

  mock.onGet("/currencies").reply(() => [200, makeApiResponse({ currencies })]);

  // --- SDGs (image upload via FormData) --------------------------------
  mock.onGet(/^\/sdgs(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 100);
    return [200, makeApiResponse(makeListPayload("sdgs", sdgs, page, perPage))];
  });

  mock.onGet(/^\/sdgs\/search(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const found = sdgs.find((s) => s.filename === query.filename);
    if (!found) return [404, makeErrorResponse("SDG not found.")];
    return [200, makeApiResponse(found)];
  });

  mock.onGet(/^\/sdgs\/\d+$/).reply((cfg: AxiosRequestConfig) => {
    const id = Number(cfg.url!.match(/\/sdgs\/(\d+)/)![1]);
    const found = sdgs.find((s) => s.id === id);
    if (!found) return [404, makeErrorResponse("SDG not found.")];
    return [200, makeApiResponse(found)];
  });

  mock.onPost("/sdgs").reply((cfg: AxiosRequestConfig) => {
    const data = cfg.data as FormData;
    const file = typeof FormData !== "undefined" && data instanceof FormData ? (data.get("image") as File | null) : null;
    const created = {
      id: fakeId(),
      image: file ? URL.createObjectURL(file) : "",
      filename: file?.name ?? "sdg.png",
      image_url: file ? URL.createObjectURL(file) : "",
    };
    sdgs.push(created);
    return [201, makeApiResponse(created, "SDG created successfully")];
  });

  mock.onPost(/^\/sdgs\/\d+$/).reply((cfg: AxiosRequestConfig) => {
    // update uses POST + `_method=PUT` (Laravel method spoofing) because it's FormData
    const id = Number(cfg.url!.match(/\/sdgs\/(\d+)/)![1]);
    const sdg = sdgs.find((s) => s.id === id);
    if (!sdg) return [404, makeErrorResponse("SDG not found.")];
    const data = cfg.data as FormData;
    const file = typeof FormData !== "undefined" && data instanceof FormData ? (data.get("image") as File | null) : null;
    if (file) {
      const url = URL.createObjectURL(file);
      sdg.image = url;
      sdg.image_url = url;
      sdg.filename = file.name;
    }
    return [200, makeApiResponse(sdg, "SDG updated successfully")];
  });

  // --- Users ---------------------------------------------------------------
  mock.onGet(/^\/users\/pending(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const pending = demoUsers.filter((u) => u.user_state?.name === "pending");
    return [200, makeApiResponse(makeListPayload("users", pending, Number(query.page ?? 1), Number(query.per_page ?? 10)))];
  });

  mock.onGet(/^\/users\/unverified(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const unverified = demoUsers.filter((u) => u.user_state?.name === "unverified");
    return [200, makeApiResponse(makeListPayload("users", unverified, Number(query.page ?? 1), Number(query.per_page ?? 10)))];
  });

  mock.onGet(/^\/users\/admins(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    const admins = demoUsers.filter((u) => (u.roles ?? []).some((r) => r.name === "admin"));
    return [200, makeApiResponse(makeListPayload("users", admins, Number(query.page ?? 1), Number(query.per_page ?? 10)))];
  });

  mock.onPost("/users/admins").reply((cfg: AxiosRequestConfig) => {
    const body = parseBody<{ name?: string; email?: string }>(cfg.data);
    if (!body.name || !body.email) return [422, makeErrorResponse("The given data was invalid.", { email: ["Email is required."] })];
    const created = {
      id: fakeId(),
      name: body.name,
      email: body.email,
      roles: [{ id: 1, name: "admin" }],
      user_state: { id: 1, name: "active" },
      country_user_role: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    demoUsers.push(created);
    return [201, makeApiResponse(created, "Admin created successfully")];
  });

  mock.onDelete(/^\/users\/admins\/\d+$/).reply((cfg: AxiosRequestConfig) => {
    const id = Number(cfg.url!.match(/\/users\/admins\/(\d+)/)![1]);
    const index = demoUsers.findIndex((u) => u.id === id);
    if (index === -1) return [404, makeErrorResponse("User not found.")];
    demoUsers.splice(index, 1);
    return [200, makeApiResponse(null, "Admin removed successfully")];
  });

  mock.onGet(/^\/users(\?.*)?$/).reply((cfg: AxiosRequestConfig) => {
    const query = parseQuery(cfg.url, cfg.params);
    return [200, makeApiResponse(makeListPayload("users", demoUsers, Number(query.page ?? 1), Number(query.per_page ?? 10)))];
  });

  mock.onPost(/^\/users\/\d+\/approve$/).reply((cfg: AxiosRequestConfig) => {
    const id = Number(cfg.url!.match(/\/users\/(\d+)\/approve/)![1]);
    const user = demoUsers.find((u) => u.id === id);
    if (!user) return [404, makeErrorResponse("User not found.")];
    user.user_state = { id: 1, name: "active" };
    return [200, makeApiResponse(user, "User approved successfully")];
  });

  mock.onDelete(/^\/users\/\d+\/reject$/).reply((cfg: AxiosRequestConfig) => {
    const id = Number(cfg.url!.match(/\/users\/(\d+)\/reject/)![1]);
    const index = demoUsers.findIndex((u) => u.id === id);
    if (index === -1) return [404, makeErrorResponse("User not found.")];
    demoUsers.splice(index, 1);
    return [200, makeApiResponse(null, "User rejected successfully")];
  });

  mock.onPut(/^\/users\/\d+\/state$/).reply((cfg: AxiosRequestConfig) => {
    const id = Number(cfg.url!.match(/\/users\/(\d+)\/state/)![1]);
    const user = demoUsers.find((u) => u.id === id);
    if (!user) return [404, makeErrorResponse("User not found.")];
    const body = parseBody<{ state?: string }>(cfg.data);
    user.user_state = { id: body.state === "active" ? 1 : 4, name: body.state ?? "active" };
    return [200, makeApiResponse(user, "User state updated successfully")];
  });
}

// Re-exported so other handler files can build indicator wire objects consistently if needed.
export type { SeedIndicator };
