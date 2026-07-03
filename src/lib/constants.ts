export const APP_NAME = "PAAN";
export const APP_FULL_NAME =
  "The Private Aboriginal American National PMA Church Ministry";
export const APP_DESCRIPTION =
  "Private Membership Association and Free Church organization under 26 U.S.C. § 508(c)(1)(A)";

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  apply: "/apply",
  about: "/about",
  statementOfFaith: "/statement-of-faith",
  research: "/research",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  dashboard: "/dashboard",
  documents: "/documents",
  events: "/events",
  university: "/university",
  profile: "/profile",
  finances: "/finances",
  announcements: "/announcements",
  messages: "/messages",
  governance: "/governance",
  admin: {
    root: "/admin",
    members: "/admin/members",
    applications: "/admin/applications",
    inviteCodes: "/admin/invite-codes",
    documents: "/admin/documents",
    events: "/admin/events",
    courses: "/admin/courses",
    finances: "/admin/finances",
    cbis: "/admin/cbis",
  },
} as const;

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/documents",
  "/events",
  "/university",
  "/profile",
  "/finances",
  "/announcements",
  "/messages",
  "/governance",
  "/admin",
];

export const ADMIN_ROUTES = ["/admin"];

export const AUTH_ROUTES = ["/login", "/register"];

export const ADMIN_ROLES = ["ADMIN", "GRANTOR", "BOARD_MEMBER"] as const;

export function isAdminRole(role: string | undefined | null): boolean {
  return !!role && (ADMIN_ROLES as readonly string[]).includes(role);
}

export const PUBLIC_ROUTES = [
  "/",
  "/apply",
  "/about",
  "/statement-of-faith",
  "/research",
  "/contact",
  "/privacy",
  "/terms",
];
