// Centralized reference data for Amigos SACCO's multi-branch, multi-department
// exam deployment. Used by models (for enum validation) and controllers/routes
// (for filtering, analytics, and scheduling).

export const BRANCHES = [
  "Head Office",
  "Addisu Gebeya",
  "Megenagna",
  "Jemo",
  "Dembel",
  "Merkato",
  "Lideta",
  "Arat Kilo",
  "Summit",
];

export const DEPARTMENTS = [
  "Loans",
  "Customer Service",
  "IT",
  "Finance",
  "PMERLF",
  "Human Resources",
  "Risk & Compliance",
  "Marketing",
];

export const EXAM_TYPES = ["multiple-choice", "essay", "case-study", "practical"];

export const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

// Roles across the department/branch hierarchy described in the feature spec:
// - student / employee: takes exams
// - teacher: legacy alias, treated the same as department_head for exam authoring
// - department_head: creates/owns exams for a department
// - supervisor: monitors live sessions and reviews incident logs across branches
// - admin: full cross-department, cross-branch access
export const ROLES = [
  "student",
  "teacher",
  "department_head",
  "supervisor",
  "admin",
];

// Roles permitted to create exams / manage the question bank
export const EXAM_MANAGER_ROLES = ["teacher", "department_head", "admin"];

// Roles permitted to view cross-branch / cross-department analytics
export const ANALYTICS_ROLES = ["teacher", "department_head", "supervisor", "admin"];
