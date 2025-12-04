import type { Agency } from "../types/agency.types";

export function mapAgency(raw: any): Agency {
  return {
    id: raw.id,
    name: raw.name,
    url: raw.url,
    isApproved: raw.is_approved,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapAgencies(rawList: any[]): Agency[] {
  return rawList.map(mapAgency);
}
