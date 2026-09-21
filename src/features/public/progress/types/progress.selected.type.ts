export interface ContributionData {
  id: number;
  name: string;
  contribution: number;
}

export interface BeneficiariesData {
  name: string;
  beneficiaries: { id: number; name: string }[];
}

export interface ProgressSelectedData {
  name: string;
  implementation: number;
  resource: number;
  beneficiaries?: BeneficiariesData[];
  agencies?: ContributionData[];
  donors?: ContributionData[];
}
