export const SCOPES = {
  // ===== Admin =====
  ADMIN_ALL: "*:*",
  
  // ===== Donors =====
  DONORS_READ: "donors:read",
  DONORS_WRITE: "donors:write",
  DONORS_ALL: "donors:*",
  
  // ===== Beneficiaries =====
  BENEFICIARIES_READ: "beneficiaries:read",
  BENEFICIARIES_WRITE: "beneficiaries:write",
  BENEFICIARIES_ALL: "beneficiaries:*",
  
  // ===== Projects =====
  PROJECTS_READ: "projects:read",
  PROJECTS_WRITE: "projects:write",
  PROJECTS_ALL: "projects:*",
  
  // ===== Programs =====
  PROGRAMS_READ: "programs:read",
  PROGRAMS_WRITE: "programs:write",
  PROGRAMS_ALL: "programs:*",
  
  // ===== Program States =====
  PROGRAM_STATES_READ: "program-states:read",
  PROGRAM_STATES_WRITE: "program-states:write",
  PROGRAM_STATES_ALL: "program-states:*",
  
  // ===== Users =====
  USERS_READ: "users:read",
  USERS_WRITE: "users:write",
  USERS_ALL: "users:*",
  
  // ===== Agencies =====
  AGENCIES_READ: "agencies:read",
  AGENCIES_WRITE: "agencies:write",
  AGENCIES_ALL: "agencies:*",
  
  // ===== Indicators =====
  INDICATORS_READ: "indicators:read",
  INDICATORS_WRITE: "indicators:write",
  INDICATORS_ALL: "indicators:*",
  
  // ===== Indicator Types =====
  INDICATOR_TYPES_READ: "indicator-types:read",
  INDICATOR_TYPES_WRITE: "indicator-types:write",
  INDICATOR_TYPES_ALL: "indicator-types:*",
  
  // ===== Countries =====
  COUNTRIES_READ: "countries:read",
  COUNTRIES_WRITE: "countries:write",
  COUNTRIES_ALL: "countries:*",
  
  // ===== KPAs =====
  KPAS_READ: "kpas:read",
  KPAS_WRITE: "kpas:write",
  KPAS_ALL: "kpas:*",
  
  // ===== Country-KPA =====
  COUNTRY_KPA_READ: "country-kpa:read",
  COUNTRY_KPA_WRITE: "country-kpa:write",
  COUNTRY_KPA_ALL: "country-kpa:*",
  
  // ===== SDGs =====
  SDGS_READ: "sdgs:read",
  SDGS_WRITE: "sdgs:write",
  SDGS_ALL: "sdgs:*",
  
  // ===== Strategic Outputs =====
  STRATEGIC_OUTPUTS_READ: "strategic-outputs:read",
  STRATEGIC_OUTPUTS_WRITE: "strategic-outputs:write",
  STRATEGIC_OUTPUTS_ALL: "strategic-outputs:*",
  
  // ===== Measures =====
  MEASURES_READ: "measures:read",
  MEASURES_WRITE: "measures:write",
  MEASURES_ALL: "measures:*",
  
  // ===== Project States =====
  PROJECT_STATES_READ: "project-states:read",
  PROJECT_STATES_WRITE: "project-states:write",
  PROJECT_STATES_ALL: "project-states:*",
} as const;

export type Scope = typeof SCOPES[keyof typeof SCOPES];
