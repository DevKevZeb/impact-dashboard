export interface Agency {
  id: number;
  name: string;
  url?: string;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAgencyDto {
  name: string;
  url?: string;
  isApproved: boolean;
}

export interface UpdateAgencyDto {
  name?: string;
  url?: string;
  isApproved?: boolean;
}
