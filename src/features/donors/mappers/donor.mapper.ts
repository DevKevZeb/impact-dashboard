import type { Donor } from "../types/donor.types";

export function mapDonor(raw: any):Donor {
    return {
        id: raw.id,
        name: raw.name
    }
}

export function mapDonors(rawList: any[]): Donor[] {
    return rawList.map(mapDonor)
}