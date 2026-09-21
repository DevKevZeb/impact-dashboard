import type { Donor } from "../types/donor.types";

export function mapDonor(raw: Record<string, unknown>):Donor {
    return {
        id: raw.id as number,
        name: raw.name as string
    }
}

export function mapDonors(rawList: unknown[]): Donor[] {
    return rawList.map((raw) => mapDonor(raw as Record<string, unknown>))
}
