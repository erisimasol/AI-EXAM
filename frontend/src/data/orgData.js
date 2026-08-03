// Shared reference data for Amigos SACCO's branch/department structure.
// Mirrors backend/config/constants.js — keep both in sync.

export const BRANCHES = [
  'Head Office',
  'Addisu Gebeya',
  'Megenagna',
  'Jemo',
  'Dembel',
  'Merkato',
  'Lideta',
  'Arat Kilo',
  'Summit',
];

export const DEPARTMENTS = [
  'Loans',
  'Customer Service',
  'IT',
  'Finance',
  'PMERLF',
  'Human Resources',
  'Risk & Compliance',
  'Marketing',
];

export const EXAM_TYPES = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'essay', label: 'Essay' },
  { value: 'case-study', label: 'Case Study' },
  { value: 'practical', label: 'Practical Simulation' },
];

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

export const ROLES = [
  { value: 'student', label: 'Employee / Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'department_head', label: 'Department Head' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'admin', label: 'Administrator' },
];

export const EXAM_MANAGER_ROLES = ['teacher', 'department_head', 'admin'];
export const ANALYTICS_ROLES = ['teacher', 'department_head', 'supervisor', 'admin'];
