/**
 * Demo-mode auth personas + a fake (unsigned) JWT builder.
 *
 * `authStore.setAuth()` decodes the token's payload client-side via
 * `JSON.parse(atob(token.split(".")[1]))` and reads `payload.scopes` - it
 * never verifies a signature - so a 3-segment base64url string with a junk
 * "signature" segment is all that's required for the real app code to work
 * unmodified in demo mode.
 */
import type { User } from "@/features/auth/types/auth.types";
import type { AuthResponse } from "@/features/auth/types/auth.types";
import { rolePermissionIds, permissions } from "./seed";

function base64UrlEncode(input: string): string {
  const base64 = btoa(unescape(encodeURIComponent(input)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function makeFakeJwt(payload: Record<string, unknown>): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  return `${header}.${body}.demo-signature`;
}

/**
 * Scopes come straight from `rolePermissionIds` for every role, including
 * admin - there is no "*:*" wildcard shortcut here, because the real
 * product's admin role is a system-administration role, not a superuser
 * (it can't create programs/projects; see the comment on `rolePermissionIds`
 * in seed.ts).
 */
function scopesForRoleId(roleId: number): string[] {
  const ids = rolePermissionIds[roleId] ?? [];
  return permissions.filter((p) => ids.includes(p.id)).map((p) => p.scope);
}

export const DEMO_ADMIN_CREDENTIALS = { email: "demo@admin.com", password: "demo1234" };
export const DEMO_COUNTRY_MANAGER_CREDENTIALS = { email: "demo@country.com", password: "demo1234" };
export const DEMO_PROJECT_MANAGER_CREDENTIALS = { email: "demo@projects.com", password: "demo1234" };

export const DEMO_ADMIN_USER: User = {
  id: 1,
  name: "Demo Admin",
  email: DEMO_ADMIN_CREDENTIALS.email,
  user_state_id: 1,
  roles: [{ id: 1, name: "admin" }],
  country_user_role: null,
};

export const DEMO_COUNTRY_MANAGER_USER: User = {
  id: 2,
  name: "Litia Ravouvou",
  email: DEMO_COUNTRY_MANAGER_CREDENTIALS.email,
  user_state_id: 1,
  roles: [{ id: 2, name: "country-manager" }],
  country_user_role: {
    id: 1,
    country: { id: 1, name: "Fiji", active: true },
    role: { id: 2, name: "country-manager" },
  },
  country_user_roles: [
    {
      id: 1,
      country: { id: 1, name: "Fiji", active: true },
      role: { id: 2, name: "country-manager" },
    },
  ],
};

// Matches the "Viliami Fifita" entry in seed.ts's `demoUsers` (id 4,
// project-manager, Tonga) so the Users admin page and this login persona
// refer to the same person.
export const DEMO_PROJECT_MANAGER_USER: User = {
  id: 4,
  name: "Viliami Fifita",
  email: DEMO_PROJECT_MANAGER_CREDENTIALS.email,
  user_state_id: 1,
  roles: [{ id: 3, name: "project-manager" }],
  country_user_role: {
    id: 3,
    country: { id: 3, name: "Tonga", active: true },
    role: { id: 3, name: "project-manager" },
  },
  country_user_roles: [
    {
      id: 3,
      country: { id: 3, name: "Tonga", active: true },
      role: { id: 3, name: "project-manager" },
    },
  ],
};

const DEMO_USERS_BY_EMAIL: Record<string, { user: User; password: string; roleId: number }> = {
  [DEMO_ADMIN_CREDENTIALS.email]: { user: DEMO_ADMIN_USER, password: DEMO_ADMIN_CREDENTIALS.password, roleId: 1 },
  [DEMO_COUNTRY_MANAGER_CREDENTIALS.email]: { user: DEMO_COUNTRY_MANAGER_USER, password: DEMO_COUNTRY_MANAGER_CREDENTIALS.password, roleId: 2 },
  [DEMO_PROJECT_MANAGER_CREDENTIALS.email]: { user: DEMO_PROJECT_MANAGER_USER, password: DEMO_PROJECT_MANAGER_CREDENTIALS.password, roleId: 3 },
};

/** Looks up a demo persona by email+password. Returns `null` for unknown credentials so the login handler can 401. */
export function findDemoPersona(email: string, password: string): { user: User; roleId: number } | null {
  const match = DEMO_USERS_BY_EMAIL[email.trim().toLowerCase()];
  if (!match || match.password !== password) return null;
  return { user: match.user, roleId: match.roleId };
}

/**
 * Looks up a demo persona by email only, decoded from the request's bearer
 * token (see `getEmailFromAuthHeader` in auth.handlers.ts). Used instead of
 * in-memory "current user" state so the logged-in persona survives a full
 * page reload - the token in localStorage is the source of truth, not
 * mutable module state that resets when demo mocks reinstall.
 */
export function findDemoPersonaByEmail(email: string | undefined): { user: User; roleId: number } {
  const match = email ? DEMO_USERS_BY_EMAIL[email.trim().toLowerCase()] : undefined;
  return match ? { user: match.user, roleId: match.roleId } : { user: DEMO_ADMIN_USER, roleId: 1 };
}

export function buildAuthResponse(user: User, roleId: number): AuthResponse {
  const token = makeFakeJwt({
    sub: user.id,
    email: user.email,
    scopes: scopesForRoleId(roleId),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  });

  return {
    access_token: token,
    token_type: "Bearer",
    expires_in: 60 * 60 * 8,
    user,
  };
}
