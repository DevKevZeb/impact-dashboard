/**
 * Mocks for /country-dashboard-shares/* (feeds the Admin Dashboard's list of
 * countries a country-manager has shared with the logged-in admin).
 */
import type MockAdapter from "axios-mock-adapter";
import type { AxiosRequestConfig } from "axios";
import { makeApiResponse, makeErrorResponse, makeListPayload, parseBody, fakeId } from "../fixtures/factories";
import { countryDashboardShares, demoUsers } from "../fixtures/seed";

export function registerCountryDashboardShareHandlers(mock: MockAdapter): void {
  mock.onGet(/^\/country-dashboard-shares\/admin-candidates(\?.*)?$/).reply(() => {
    const admins = demoUsers.filter((u) => (u.roles ?? []).some((r) => r.name === "admin"));
    return [
      200,
      makeApiResponse({
        users: admins,
        total: admins.length,
        per_page: 50,
        current_page: 1,
        last_page: 1,
      }),
    ];
  });

  mock.onGet(/^\/country-dashboard-shares\/my-shares(\?.*)?$/).reply(() => {
    return [200, makeApiResponse(makeListPayload("shares", countryDashboardShares, 1, 50))];
  });

  mock.onGet(/^\/country-dashboard-shares\/visible-for-admin(\?.*)?$/).reply(() => {
    return [200, makeApiResponse(makeListPayload("shares", countryDashboardShares, 1, 50))];
  });

  mock.onPost("/country-dashboard-shares").reply((config: AxiosRequestConfig) => {
    const body = parseBody<{ country_id?: number; shared_user_role_id?: number }>(config.data);
    if (!body.country_id || !body.shared_user_role_id) {
      return [422, makeErrorResponse("The given data was invalid.", { country_id: ["Country is required."] })];
    }
    const created = {
      id: fakeId(),
      country_id: body.country_id,
      owner_country_user_role_id: 1,
      shared_user_role_id: body.shared_user_role_id,
    };
    countryDashboardShares.push(created as (typeof countryDashboardShares)[number]);
    return [201, makeApiResponse(created, "Dashboard shared successfully")];
  });

  mock.onDelete(/^\/country-dashboard-shares\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url!.match(/\/country-dashboard-shares\/(\d+)/)![1]);
    const index = countryDashboardShares.findIndex((s) => s.id === id);
    if (index === -1) return [404, makeErrorResponse("Share not found.")];
    countryDashboardShares.splice(index, 1);
    return [200, makeApiResponse(null, "Dashboard share removed successfully")];
  });
}
