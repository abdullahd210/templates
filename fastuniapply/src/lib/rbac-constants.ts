/**
 * Canonical role/permission catalog — the single source of truth consumed by
 * both `prisma/seed/reference-data.ts` (to seed the Role/Permission tables)
 * and `src/server/auth/rbac.ts` (runtime authorization checks). Keeping one
 * definition means the seed data and the code that enforces it can never
 * drift apart. See docs/02-roles-and-permissions.md for the full narrative
 * matrix this encodes.
 */

export const ROLE_KEYS = [
  "super_admin",
  "general_manager",
  "operations_manager",
  "consultant",
  "admissions_officer",
  "sales_representative",
  "marketing_manager",
  "content_editor",
  "finance_officer",
  "student_support_officer",
  "quality_analytics_officer",
  "student",
  "partner_rep",
  "agent",
] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const ROLE_NAMES: Record<RoleKey, string> = {
  super_admin: "Super Administrator",
  general_manager: "General Manager",
  operations_manager: "Operations Manager",
  consultant: "Educational Consultant",
  admissions_officer: "Admissions Officer",
  sales_representative: "Sales Representative",
  marketing_manager: "Marketing Manager",
  content_editor: "Content Editor",
  finance_officer: "Finance Officer",
  student_support_officer: "Student Support Officer",
  quality_analytics_officer: "Quality and Analytics Officer",
  student: "Student",
  partner_rep: "University Partner Representative",
  agent: "Educational Agent",
};

export const PERMISSION_KEYS = [
  "leads.manage",
  "leads.view_own",
  "students.manage",
  "students.view_own",
  "applications.manage",
  "applications.view_own",
  "applications.update_status",
  "documents.verify",
  "documents.upload_own",
  "universities.manage",
  "programs.manage",
  "scholarships.manage",
  "content.manage",
  "staff.manage",
  "roles.manage",
  "finance.manage",
  "finance.view_own",
  "reports.view",
  "reports.view_own",
  "activity_logs.view",
  "messaging.manage",
  "appointments.manage",
] as const;
export type PermissionKey = (typeof PERMISSION_KEYS)[number];

// Coarse role -> permission bootstrap. Fine-tunable later via the
// Admin > Roles module (docs/02-roles-and-permissions.md §3) — this is the
// default assigned at seed time and used as the fallback source of truth
// when the DB-backed RolePermission table hasn't been customized.
export const ROLE_PERMISSIONS: Record<RoleKey, PermissionKey[]> = {
  super_admin: [...PERMISSION_KEYS],
  general_manager: ["reports.view", "activity_logs.view"],
  operations_manager: ["leads.manage", "students.manage", "applications.manage", "reports.view"],
  consultant: [
    "leads.view_own",
    "students.view_own",
    "applications.view_own",
    "messaging.manage",
    "appointments.manage",
  ],
  admissions_officer: ["applications.view_own", "applications.update_status", "documents.verify"],
  sales_representative: ["leads.view_own"],
  marketing_manager: ["content.manage", "reports.view_own"],
  content_editor: ["content.manage"],
  finance_officer: ["finance.manage"],
  student_support_officer: ["messaging.manage", "appointments.manage"],
  quality_analytics_officer: ["reports.view"],
  student: ["applications.view_own", "documents.upload_own", "finance.view_own"],
  partner_rep: ["applications.view_own"],
  agent: ["leads.view_own", "applications.view_own", "finance.view_own"],
};
