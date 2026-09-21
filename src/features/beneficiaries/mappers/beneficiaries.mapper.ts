import type { Beneficiary } from "../types/beneficiaries.types";

export function mapBeneficiary(raw: Record<string, unknown>): Beneficiary{
    return{
        id: raw.id as number,
        name: raw.name as string
    }
}

export function mapBeneficiaries(rawList: unknown[]): Beneficiary[]{
    return rawList.map((raw) => mapBeneficiary(raw as Record<string, unknown>))
}
