export interface ContributionData {
  id: number;
  name: string;
  contribution: number;
}

export interface BeneficiariesData {
  name: string;
  beneficiaries: any[];
}

export interface ProgressSelectedData {
  name: string;
  implementation: number;
  resource: number;
  beneficiaries?: BeneficiariesData[] | any[];
  agencies?: ContributionData[];
  donors?: ContributionData[];
}
