import { ROLE_KEYS, ROLE_NAMES, PERMISSION_KEYS, ROLE_PERMISSIONS } from "../../src/lib/rbac-constants";

export const documentTypesSeed = [
  { key: "passport", requiresExpiration: true, sortOrder: 1 },
  { key: "personal_photo", requiresExpiration: false, sortOrder: 2 },
  { key: "high_school_certificate", requiresExpiration: false, sortOrder: 3 },
  { key: "high_school_transcript", requiresExpiration: false, sortOrder: 4 },
  { key: "bachelors_diploma", requiresExpiration: false, sortOrder: 5 },
  { key: "bachelors_transcript", requiresExpiration: false, sortOrder: 6 },
  { key: "masters_diploma", requiresExpiration: false, sortOrder: 7 },
  { key: "language_certificate", requiresExpiration: true, sortOrder: 8 },
  { key: "cv", requiresExpiration: false, sortOrder: 9 },
  { key: "recommendation_letter", requiresExpiration: false, sortOrder: 10 },
  { key: "motivation_letter", requiresExpiration: false, sortOrder: 11 },
  { key: "statement_of_purpose", requiresExpiration: false, sortOrder: 12 },
  { key: "work_experience", requiresExpiration: false, sortOrder: 13 },
  { key: "financial_documents", requiresExpiration: true, sortOrder: 14 },
  { key: "visa_documents", requiresExpiration: true, sortOrder: 15 },
  { key: "other", requiresExpiration: false, sortOrder: 16 },
] as const;

export const leadSourcesSeed = [
  { key: "website", name: "Website" },
  { key: "whatsapp", name: "WhatsApp" },
  { key: "instagram", name: "Instagram" },
  { key: "facebook", name: "Facebook" },
  { key: "tiktok", name: "TikTok" },
  { key: "google_ads", name: "Google Ads" },
  { key: "referral", name: "Referral" },
  { key: "educational_agent", name: "Educational Agent" },
  { key: "event", name: "Event" },
  { key: "organic_search", name: "Organic Search" },
  { key: "university_partner", name: "University Partner" },
  { key: "manual_entry", name: "Manual Entry" },
] as const;

// Roles, permissions, and the role -> permission bootstrap all come from
// src/lib/rbac-constants.ts so the seeded DB state and the runtime RBAC
// checks in src/server/auth/rbac.ts can never drift apart.
export const rolesSeed = ROLE_KEYS.map((key) => ({ key, name: ROLE_NAMES[key] }));
export const permissionsSeed = PERMISSION_KEYS;
export const rolePermissionMap: Record<string, readonly string[]> = ROLE_PERMISSIONS;
