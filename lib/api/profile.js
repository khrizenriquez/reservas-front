const profile = process.env.NEXT_PUBLIC_API_PROFILE ?? "legacy";

if (!Object.hasOwn({ legacy: true, v2: true }, profile)) {
  throw new Error(`NEXT_PUBLIC_API_PROFILE must be legacy or v2, received: ${profile}`);
}

export const API_PROFILE = profile;
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? (
  profile === "v2" ? "http://localhost:8100" : "http://localhost:8000"
)).replace(/\/$/, "");
export const IS_LEGACY = profile === "legacy";
export const SESSION_NAMESPACE = `reservas.web.session:${profile}:${API_BASE_URL}`;

export const CAPABILITIES = Object.freeze({
  notifications: false,
  reports: false,
  roles: false,
  sessions: false,
  push: false,
  authenticatedApi: profile === "v2",
});
