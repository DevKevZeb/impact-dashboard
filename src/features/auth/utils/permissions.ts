export const SCOPES = {
  // ===== Admin =====
  ADMIN_ALL: "*:*",
  ADMIN_DASHBOARD: "admin_dashboard:read",
  
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
  PROJECTS_CREATE: "projects:create",
  PROJECTS_DELETE: "projects:delete",
  PROJECTS_WEIGHT: "projects:weight",
  PROJECTS_PROGRESS: "projects:progress",
  PROJECTS_VIEW_BY_COUNTRY: "projects:view_by_country",
  PROJECTS_ALL: "projects:*",
  
  // ===== Programs =====
  PROGRAMS_READ: "programs:read",
  PROGRAMS_WRITE: "programs:write",
  PROGRAMS_VIEW_BY_COUNTRY: "programs:view_by_country",
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
  COUNTRY_KPAS_READ: "country_kpas:read",
  COUNTRY_KPAS_WRITE: "country_kpas:write",
  COUNTRY_KPAS_ALL: "country_kpas:*",
  
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

  // ===== Country Join Requests =====
  COUNTRY_JOIN_REQUESTS_READ: "country_join_requests:read",
  COUNTRY_JOIN_REQUESTS_WRITE: "country_join_requests:write",
  COUNTRY_JOIN_REQUESTS_APPROVE: "country_join_requests:approve",
  COUNTRY_JOIN_REQUESTS_ALL: "country_join_requests:*",
} as const;

export type Scope = typeof SCOPES[keyof typeof SCOPES];
