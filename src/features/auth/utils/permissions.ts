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
  PROGRAM_STATES_READ: "program_states:read",
  PROGRAM_STATES_WRITE: "program_states:write",
  PROGRAM_STATES_ALL: "program_states:*",
  
  // ===== Users =====
  USERS_READ: "users:read",
  USERS_WRITE: "users:write",
  USERS_ALL: "users:*",

  // ===== Roles & Permissions =====
  ROLES_READ: "roles",
  ROLES_WRITE: "roles:write",
  ROLES_ALL: "roles:*",
  
  // ===== Agencies =====
  AGENCIES_READ: "agencies:read",
  AGENCIES_WRITE: "agencies:write",
  AGENCIES_ALL: "agencies:*",
  
  // ===== Indicators =====
  INDICATORS_READ: "indicators:read",
  INDICATORS_WRITE: "indicators:write",
  INDICATORS_ALL: "indicators:*",
  
  // ===== Indicator Types =====
  INDICATOR_TYPES_READ: "indicator_types:read",
  INDICATOR_TYPES_WRITE: "indicator_types:write",
  INDICATOR_TYPES_ALL: "indicator_types:*",
  
  // ===== Countries =====
  COUNTRIES_READ: "countries:read",
  COUNTRIES_WRITE: "countries:write",
  COUNTRIES_ALL: "countries:*",
  
  // ===== KPAs =====
  KPAS_READ: "kpas:read",
  KPAS_WRITE: "kpas:write",
  KPAS_ALL: "kpas:*",
  
  // ===== Country-KPA =====
  COUNTRY_KPA_READ: "country_kpa:read",
  COUNTRY_KPA_WRITE: "country_kpa:write",
  COUNTRY_KPA_ALL: "country_kpa:*",
  
  // ===== SDGs =====
  SDGS_READ: "sdgs:read",
  SDGS_WRITE: "sdgs:write",
  SDGS_ALL: "sdgs:*",
  
  // ===== Strategic Outputs =====
  STRATEGIC_OUTPUTS_READ: "strategic_outputs:read",
  STRATEGIC_OUTPUTS_WRITE: "strategic_outputs:write",
  STRATEGIC_OUTPUTS_ALL: "strategic_outputs:*",
  
  // ===== Measures =====
  MEASURES_READ: "measures:read",
  MEASURES_WRITE: "measures:write",
  MEASURES_ALL: "measures:*",
  
  // ===== Project States =====
  PROJECT_STATES_READ: "project_states:read",
  PROJECT_STATES_WRITE: "project_states:write",
  PROJECT_STATES_ALL: "project_states:*",
} as const;

export type Scope = typeof SCOPES[keyof typeof SCOPES];
