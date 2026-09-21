/**
 * Mocks for /auth/*. Login validates the demo credential pairs for real (a
 * wrong password gets a genuine 401 so the login form's error UI still
 * demos correctly); every other auth endpoint always succeeds.
 */
import type MockAdapter from "axios-mock-adapter";
import type { AxiosRequestConfig } from "axios";
import { makeApiResponse, makeErrorResponse, parseBody } from "../fixtures/factories";
import { findDemoPersona, findDemoPersonaByEmail, buildAuthResponse } from "../fixtures/demoAuth";
import type { LoginInput, ChangePasswordInput, UpdateProfileInput } from "@/features/auth/types/auth.types";

/**
 * Decodes the email out of the request's bearer token instead of relying on
 * in-memory "current user" state - the token in localStorage is the source
 * of truth, so this stays correct across full page reloads (which reinstall
 * the mocks and would otherwise reset any module-level "current user").
 */
function getEmailFromAuthHeader(config: AxiosRequestConfig): string | undefined {
  const header = (config.headers as Record<string, string> | undefined)?.Authorization;
  const token = header?.replace(/^Bearer\s+/i, "");
  const payloadSegment = token?.split(".")[1];
  if (!payloadSegment) return undefined;
  try {
    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(decodeURIComponent(escape(atob(normalized)))) as { email?: string };
    return payload.email;
  } catch {
    return undefined;
  }
}

export function registerAuthHandlers(mock: MockAdapter): void {
  mock.onPost("/auth/login").reply((config: AxiosRequestConfig) => {
    const body = parseBody<LoginInput>(config.data);
    const persona = findDemoPersona(body.email ?? "", body.password ?? "");

    if (!persona) {
      return [401, makeErrorResponse("Invalid email or password. If you just changed your password, use the new one.")];
    }

    return [200, makeApiResponse(buildAuthResponse(persona.user, persona.roleId), "Login successful")];
  });

  mock.onGet("/auth/me").reply((config: AxiosRequestConfig) => {
    // Derived from the bearer token every call (not module state) so this
    // stays stable both across the 15s poll AND across full page reloads.
    const { user } = findDemoPersonaByEmail(getEmailFromAuthHeader(config));
    return [200, makeApiResponse(user, "OK")];
  });

  mock.onPost("/auth/refresh").reply((config: AxiosRequestConfig) => {
    const { user, roleId } = findDemoPersonaByEmail(getEmailFromAuthHeader(config));
    const response = buildAuthResponse(user, roleId);
    return [200, makeApiResponse({ access_token: response.access_token, token_type: response.token_type, expires_in: response.expires_in }, "Token refreshed")];
  });

  mock.onPut("/auth/profile").reply((config: AxiosRequestConfig) => {
    const { user } = findDemoPersonaByEmail(getEmailFromAuthHeader(config));
    const body = parseBody<UpdateProfileInput>(config.data);
    const updated = { ...user, name: body.name ?? user.name };
    return [200, makeApiResponse(updated, "Profile updated successfully")];
  });

  mock.onPost("/auth/change-password").reply((config: AxiosRequestConfig) => {
    const body = parseBody<ChangePasswordInput>(config.data);
    if (body.password && body.password !== body.password_confirmation) {
      return [422, makeErrorResponse("The given data was invalid.", { password: ["Passwords do not match."] })];
    }
    return [200, makeApiResponse(null, "Password changed successfully")];
  });
}
