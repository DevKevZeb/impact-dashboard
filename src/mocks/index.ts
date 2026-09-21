/**
 * Entry point for demo mode. `installDemoMocks()` is dynamically imported
 * from `src/main.tsx` only when `VITE_DEMO_MODE === "true"`, so this whole
 * tree (and the `axios-mock-adapter` dependency) is tree-shaken out of a
 * normal production build.
 */
import MockAdapter from "axios-mock-adapter";
import { apiClient } from "@/shared/lib/axios";
import { publicApiClient } from "@/shared/lib/axios.public";
import { publicApiClient as publicCountryApiClient } from "@/features/country/services/publicCountry.api";

import { makeApiResponse } from "./fixtures/factories";
import { registerAuthHandlers } from "./handlers/auth.handlers";
import { registerCountryDashboardHandlers } from "./handlers/countryDashboard.handlers";
import { registerProjectDashboardHandlers } from "./handlers/projectDashboard.handlers";
import { registerProjectsHandlers } from "./handlers/projects.handlers";
import { registerRolesPermissionsHandlers } from "./handlers/rolesPermissions.handlers";
import { registerCountryDashboardShareHandlers } from "./handlers/countryDashboardShare.handlers";
import { registerProgramsHandlers } from "./handlers/programs.handlers";
import { registerGenericCrudHandlers } from "./handlers/genericCrud.handlers";
import { registerPublicHandlers, registerPublicCountryHandlers } from "./handlers/public.handlers";

/** Never lets an unmocked route 404/500 - returns an envelope with every common list key pre-populated as `[]` so a stray `.map()` on an uncovered endpoint renders an empty state instead of crashing. */
function installCatchAll(mock: MockAdapter): void {
  const emptyEnvelope = {
    items: [],
    data: [],
    donors: [],
    agencies: [],
    beneficiaries: [],
    countries: [],
    kpas: [],
    programs: [],
    projects: [],
    users: [],
    sdgs: [],
    indicator_types: [],
    project_states: [],
    program_states: [],
    roles: [],
    permissions: [],
    strategic_outputs: [],
    measures: [],
    indicators: [],
    shares: [],
    invites: [],
    candidates: [],
    assignments: [],
    requests: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };
  mock.onAny().reply(() => [200, makeApiResponse(emptyEnvelope)]);
}

export function installDemoMocks(): void {
  const privateMock = new MockAdapter(apiClient, { delayResponse: 300 });
  registerAuthHandlers(privateMock);
  registerCountryDashboardHandlers(privateMock);
  registerProjectDashboardHandlers(privateMock);
  registerProjectsHandlers(privateMock);
  registerRolesPermissionsHandlers(privateMock);
  registerCountryDashboardShareHandlers(privateMock);
  registerProgramsHandlers(privateMock);
  registerGenericCrudHandlers(privateMock);
  installCatchAll(privateMock);

  const publicMock = new MockAdapter(publicApiClient, { delayResponse: 300 });
  registerPublicHandlers(publicMock);
  installCatchAll(publicMock);

  const publicCountryMock = new MockAdapter(publicCountryApiClient, { delayResponse: 300 });
  registerPublicCountryHandlers(publicCountryMock);
  installCatchAll(publicCountryMock);
}
