/**
 * Mocks for /programs, its FormData create/update (banner image + nested
 * contact[...] fields), /program_country_user_roles (assignments),
 * /invite_programs, /contacts (search-select), and /program_states.
 */
import type MockAdapter from "axios-mock-adapter";
import type { AxiosRequestConfig } from "axios";
import {
  makeApiResponse,
  makeErrorResponse,
  makeListPayload,
  parseQuery,
  matchesSearch,
  paginateArray,
  fakeId,
} from "../fixtures/factories";
import {
  programs,
  contacts,
  sdgs,
  programStates,
  programAssignments,
  countryJoinRequests,
  findCountry,
  demoUsers,
} from "../fixtures/seed";
import type { SeedProgramAssignment } from "../fixtures/seed";

/** Parses a bracket-notation FormData body (e.g. "contact[first_name]") into a nested object, extracting any File fields separately. */
type NestedFormFields = Record<string, string | Record<string, string>>;

function parseNestedFormData(data: unknown): { fields: NestedFormFields; files: Record<string, File> } {
  const fields: Record<string, unknown> = {};
  const files: Record<string, File> = {};
  if (typeof FormData === "undefined" || !(data instanceof FormData)) {
    return { fields: fields as NestedFormFields, files };
  }

  data.forEach((value, rawKey) => {
    if (value instanceof File) {
      files[rawKey] = value;
      return;
    }
    const path = rawKey.replace(/\]/g, "").split("[");
    let cursor = fields;
    path.forEach((segment, index) => {
      if (index === path.length - 1) {
        cursor[segment] = value;
      } else {
        cursor[segment] = cursor[segment] ?? {};
        cursor = cursor[segment] as Record<string, unknown>;
      }
    });
  });

  return { fields: fields as NestedFormFields, files };
}

export function registerProgramsHandlers(mock: MockAdapter): void {
  mock.onGet(/^\/programs(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const query = parseQuery(config.url, config.params);
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 10);
    const countryId = query.country_id ? Number(query.country_id) : undefined;
    const search = query.search ?? "";

    let filtered = programs as typeof programs;
    if (countryId) filtered = filtered.filter((p) => p.country_id === countryId);
    if (search) filtered = filtered.filter((p) => matchesSearch(p.name, search));

    return [200, makeApiResponse(makeListPayload("programs", filtered, page, perPage))];
  });

  mock.onGet(/^\/programs\/search(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const query = parseQuery(config.url, config.params);
    const name = query.name ?? "";
    const filtered = programs.filter((p) => matchesSearch(p.name, name));
    return [200, makeApiResponse({ programs: filtered })];
  });

  mock.onGet(/^\/programs\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/programs\/(\d+)/)![1]);
    const program = programs.find((p) => p.id === id);
    if (!program) return [404, makeErrorResponse("Program not found.")];
    return [200, makeApiResponse(program)];
  });

  mock.onPost("/programs").reply((config: AxiosRequestConfig) => {
    const { fields, files } = parseNestedFormData(config.data);
    if (!fields.name) {
      return [422, makeErrorResponse("The given data was invalid.", { name: ["Name is required."] })];
    }
    const countryId = Number(fields.country_id ?? 0) || undefined;
    const sdgIds: number[] = Object.keys(fields)
      .filter((k) => k.startsWith("sdg_ids"))
      .map((k) => Number(fields[k]))
      .filter((n) => !Number.isNaN(n));

    const contactFields = fields.contact as Record<string, string> | undefined;
    const created = {
      id: fakeId(),
      name: String(fields.name),
      description: String(fields.description ?? ""),
      banner_img: files.banner_img ? URL.createObjectURL(files.banner_img) : null,
      program_url: (fields.program_url as string | undefined) ?? null,
      contact: {
        id: fakeId(),
        first_name: contactFields?.first_name ?? "",
        last_name: contactFields?.last_name ?? "",
        title: contactFields?.title ?? "",
        email: contactFields?.email ?? "",
        phone: contactFields?.phone,
      },
      program_state: programStates[0],
      sdgs: sdgs.filter((s) => sdgIds.includes(s.id)),
      program_summary: { start_date: null, end_date: null, donors: [], implementing_agencies: [], budget: 0 },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      projects_count: 0,
      can_edit: true,
      country_id: countryId ?? findCountry(1)!.id,
      country_user_roles: [],
    };
    programs.push(created);
    return [201, makeApiResponse(created, "Program created successfully")];
  });

  mock.onPut(/^\/programs\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/programs\/(\d+)/)![1]);
    const program = programs.find((p) => p.id === id);
    if (!program) return [404, makeErrorResponse("Program not found.")];

    const { fields, files } = parseNestedFormData(config.data);
    if (fields.name) program.name = String(fields.name);
    if (fields.description) program.description = String(fields.description);
    if (fields.program_url !== undefined) program.program_url = fields.program_url as string;
    if (files.banner_img) program.banner_img = URL.createObjectURL(files.banner_img);
    if (fields.program_state_id) {
      program.program_state = programStates.find((s) => s.id === Number(fields.program_state_id)) ?? program.program_state;
    }
    if (fields.contact) {
      const contactFields = fields.contact as Record<string, string>;
      program.contact = {
        id: program.contact.id,
        first_name: contactFields.first_name ?? program.contact.first_name,
        last_name: contactFields.last_name ?? program.contact.last_name,
        title: contactFields.title ?? program.contact.title,
        email: contactFields.email ?? program.contact.email,
        phone: contactFields.phone ?? program.contact.phone,
      };
    }
    const sdgIds = Object.keys(fields)
      .filter((k) => k.startsWith("sdg_ids"))
      .map((k) => Number(fields[k]))
      .filter((n) => !Number.isNaN(n));
    if (sdgIds.length > 0) program.sdgs = sdgs.filter((s) => sdgIds.includes(s.id));

    program.updated_at = new Date().toISOString();
    return [200, makeApiResponse(program, "Program updated successfully")];
  });

  mock.onDelete(/^\/programs\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/programs\/(\d+)/)![1]);
    const index = programs.findIndex((p) => p.id === id);
    if (index === -1) return [404, makeErrorResponse("Program not found.")];
    programs.splice(index, 1);
    return [200, makeApiResponse(null, "Program deleted successfully")];
  });

  // --- Program assignments (program_country_user_roles) ---------------------
  mock.onGet(/^\/program_country_user_roles(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const query = parseQuery(config.url, config.params);
    const countryUserRoleId = query.country_user_role_id ? Number(query.country_user_role_id) : undefined;
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 10);
    let filtered = programAssignments;
    if (countryUserRoleId) filtered = filtered.filter((a) => a.country_user_role_id === countryUserRoleId);
    const { pageItems, pagination } = paginateArray(filtered, page, perPage);
    return [
      200,
      makeApiResponse({
        assignments: pageItems.map((a) => ({
          ...a,
          program: programs.find((p) => p.id === a.program_id),
        })),
        ...pagination,
      }),
    ];
  });

  mock.onPost("/program_country_user_roles").reply((config: AxiosRequestConfig) => {
    const body = JSON.parse(typeof config.data === "string" ? config.data : "{}") as { program_id?: number; country_user_role_id?: number };
    const program = programs.find((p) => p.id === Number(body.program_id));
    if (!program) return [422, makeErrorResponse("The given data was invalid.", { program_id: ["Program not found."] })];
    const created: SeedProgramAssignment = {
      id: fakeId(),
      program_id: program.id,
      country_user_role_id: Number(body.country_user_role_id ?? 1),
      country_user_role: { id: Number(body.country_user_role_id ?? 1), country: { id: program.country_id, name: findCountry(program.country_id)!.name } },
    };
    programAssignments.push(created);
    return [201, makeApiResponse({ ...created, program }, "Program assigned successfully")];
  });

  mock.onDelete(/^\/program_country_user_roles\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/program_country_user_roles\/(\d+)/)![1]);
    const index = programAssignments.findIndex((a) => a.id === id);
    if (index === -1) return [404, makeErrorResponse("Assignment not found.")];
    programAssignments.splice(index, 1);
    return [200, makeApiResponse(null, "Assignment removed successfully")];
  });

  // --- Contacts search-select --------------------------------------------
  mock.onGet(/^\/contacts(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const query = parseQuery(config.url, config.params);
    const search = query.search ?? "";
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 10);
    const filtered = contacts.filter((c) => matchesSearch(`${c.first_name} ${c.last_name}`, search));
    const { pageItems, pagination } = paginateArray(filtered, page, perPage);
    return [200, makeApiResponse({ contacts: pageItems, current_page: pagination.current_page, last_page: pagination.last_page })];
  });

  // --- Invites --------------------------------------------------------------
  mock.onGet(/^\/invite_programs\/candidates(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const query = parseQuery(config.url, config.params);
    const search = query.search ?? "";
    const page = Number(query.page ?? 1);
    const perPage = Number(query.per_page ?? 10);
    const candidates = demoUsers
      .filter((u) => matchesSearch(u.name, search))
      .map((u) => ({ id: u.id, name: u.name, email: u.email, agency: null }));
    const { pageItems, pagination } = paginateArray(candidates, page, perPage);
    return [200, makeApiResponse(makeListPayload("candidates", pageItems, pagination.current_page, pagination.per_page))];
  });

  mock.onGet(/^\/invite_programs(\?.*)?$/).reply(() => {
    return [200, makeApiResponse({ invites: [], total: 0, per_page: 100, current_page: 1, last_page: 1 })];
  });

  mock.onPost("/invite_programs").reply((config: AxiosRequestConfig) => {
    const body = JSON.parse(typeof config.data === "string" ? config.data : "{}") as {
      program_country_user_role_id?: number;
      invited_user_role_id?: number;
    };
    const created = {
      id: fakeId(),
      program_country_user_role_id: Number(body.program_country_user_role_id ?? 0),
      invited_user_role_id: Number(body.invited_user_role_id ?? 0),
    };
    return [201, makeApiResponse(created, "Invitation sent successfully")];
  });

  mock.onDelete(/^\/invite_programs\/\d+$/).reply(() => {
    return [200, makeApiResponse(null, "Invitation revoked successfully")];
  });

  // --- Program states ---------------------------------------------------
  mock.onGet(/^\/program_states(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const query = parseQuery(config.url, config.params);
    if (query.page || query.per_page) {
      const page = Number(query.page ?? 1);
      const perPage = Number(query.per_page ?? 10);
      return [200, makeApiResponse(makeListPayload("program_states", programStates, page, perPage))];
    }
    return [200, makeApiResponse({ program_states: programStates })];
  });

  mock.onGet(/^\/program_states\/search(\?.*)?$/).reply((config: AxiosRequestConfig) => {
    const query = parseQuery(config.url, config.params);
    const found = programStates.find((s) => matchesSearch(s.name, query.name ?? ""));
    if (!found) return [404, makeErrorResponse("Program state not found.")];
    return [200, makeApiResponse(found)];
  });

  mock.onGet(/^\/program_states\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/program_states\/(\d+)/)![1]);
    const found = programStates.find((s) => s.id === id);
    if (!found) return [404, makeErrorResponse("Program state not found.")];
    return [200, makeApiResponse(found)];
  });

  mock.onPost("/program_states").reply((config: AxiosRequestConfig) => {
    const body = JSON.parse(typeof config.data === "string" ? config.data : "{}") as { name?: string };
    if (!body.name) return [422, makeErrorResponse("The given data was invalid.", { name: ["Name is required."] })];
    const created = { id: fakeId(), name: body.name };
    programStates.push(created);
    return [201, makeApiResponse(created, "Program state created successfully")];
  });

  mock.onPut(/^\/program_states\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/program_states\/(\d+)/)![1]);
    const found = programStates.find((s) => s.id === id);
    if (!found) return [404, makeErrorResponse("Program state not found.")];
    const body = JSON.parse(typeof config.data === "string" ? config.data : "{}") as { name?: string };
    if (body.name) found.name = body.name;
    return [200, makeApiResponse(found, "Program state updated successfully")];
  });

  mock.onDelete(/^\/program_states\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/program_states\/(\d+)/)![1]);
    const index = programStates.findIndex((s) => s.id === id);
    if (index === -1) return [404, makeErrorResponse("Program state not found.")];
    programStates.splice(index, 1);
    return [200, makeApiResponse([], "Program state deleted successfully")];
  });

  // --- Country join requests (Tier 3: list only, no state-machine) ----------
  mock.onGet(/^\/country-join-requests(\?.*)?$/).reply(() => {
    return [200, makeApiResponse(makeListPayload("requests", countryJoinRequests, 1, 50))];
  });
}
