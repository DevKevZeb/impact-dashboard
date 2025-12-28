import type { Beneficiary } from "../types/beneficiaries.types";

export function mapBeneficiary(raw: any): Beneficiary{
    return{
        id: raw.id,
        name: raw.name
    }
}

export function mapBeneficiaries(rawList: any[]): Beneficiary[]{
    return rawList.map(mapBeneficiary)
}