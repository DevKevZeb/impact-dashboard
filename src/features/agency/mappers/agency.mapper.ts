import type { Agency } from "../types/agency.types";

export function mapAgency(raw: Record<string, unknown>): Agency {
  return {
    id: raw.id as number,
    name: raw.name as string,
    url: raw.url as string | undefined,
    isApproved: raw.is_approved as boolean,
    createdAt: raw.created_at as string | undefined,
    updatedAt: raw.updated_at as string | undefined,
  };
}

export function mapAgencies(rawList: unknown[]): Agency[] {
  return rawList.map((raw) => mapAgency(raw as Record<string, unknown>));
}
