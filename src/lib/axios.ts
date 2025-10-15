/* src/lib/axios.ts — minimal CSRF-less client + logout/helper */

import axiosLib, { AxiosError, type AxiosRequestConfig } from "axios";

/* ============ ENV ============ */
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  "https://masjidkubackend4-production.up.railway.app/api"; // ✅ pastikan /api

// Default: FALSE (tidak kirim cookies/credentials lintas domain)
const WITH_CREDENTIALS =
  (import.meta.env.VITE_WITH_CREDENTIALS ?? "false") === "true";

const DEBUG_API = (import.meta.env.VITE_DEBUG_API ?? "true") !== "false";

/** (default OFF) Hindari kirim X-Requested-With agar preflight CORS tidak ditolak */
const SEND_X_REQUESTED_WITH =
  (import.meta.env.VITE_SEND_X_REQUESTED_WITH ?? "false") === "true";

/** Logout endpoint & method (opsional) */
export const LOGOUT_PATH = import.meta.env.VITE_LOGOUT_PATH ?? "/api/logout";
export const LOGOUT_METHOD = (
  import.meta.env.VITE_LOGOUT_METHOD ?? "GET"
).toUpperCase(); // "GET" | "POST"

export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY ?? "access_token";

/* ============ Token helpers ============ */
export function getAuthToken(): string | null {
  try {
    return typeof window !== "undefined"
      ? localStorage.getItem(TOKEN_KEY)
      : null;
  } catch {
    return null;
  }
}
export function setAuthToken(token: string | null) {
  try {
    if (typeof window === "undefined") return;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}
export function clearAuthToken() {
  setAuthToken(null);
}

/* ============ Axios instance ============ */
const axios = axiosLib.create({
  baseURL: API_BASE,
  withCredentials: WITH_CREDENTIALS, // ✅ default false; bisa override via env
  timeout: 60_000,
});

// Jaga-jaga kalau ada lib lain memaksa global
axiosLib.defaults.withCredentials = WITH_CREDENTIALS;

declare module "axios" {
  interface AxiosRequestConfig {
    metadata?: { id?: string; start?: number };
  }
}

/* ============ Utils ============ */
const now = () =>
  typeof performance !== "undefined" && performance.now
    ? performance.now()
    : Date.now();

const uuid = () => {
  const g = globalThis as any;
  if (g?.crypto?.randomUUID) return g.crypto.randomUUID();
  return String(Date.now() + Math.random());
};

/* ============ Interceptors ============ */
axios.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};

  // Optional — default OFF untuk hindari preflight yang tidak perlu
  if (SEND_X_REQUESTED_WITH) {
    (config.headers as any)["X-Requested-With"] = "XMLHttpRequest";
  }

  // Attach bearer token jika ada
  const token = getAuthToken();
  if (token) (config.headers as any).Authorization = `Bearer ${token}`;

  // Debug metadata
  if (DEBUG_API) {
    config.metadata ??= {};
    config.metadata.start = now();
    config.metadata.id = uuid();
    const { method, url, params, data } = config;
    console.groupCollapsed(
      `%cAPI ⇢ ${String(method).toUpperCase()} ${url}`,
      "color:#0ea5e9;font-weight:600"
    );
    console.log("reqId:", config.metadata.id);
    if (params) console.log("params:", params);
    if (data) console.log("data:", data);
    console.groupEnd();
  }
  return config;
});

axios.interceptors.response.use(
  (res) => {
    if (DEBUG_API) {
      const dur = now() - (res.config.metadata?.start ?? now());
      const ct = String(res.headers?.["content-type"] || "");
      if (typeof res.data === "string" && ct.includes("text/html")) {
        console.warn("[API] got HTML from", res.config.url);
      }
      console.groupCollapsed(
        `%cAPI ⇠ ${res.status} ${res.config.method?.toUpperCase()} ${res.config.url} (${dur.toFixed(0)}ms)`,
        "color:#22c55e;font-weight:600"
      );
      console.log("reqId:", res.config.metadata?.id);
      console.log("response:", res.data);
      console.groupEnd();
    }
    return res;
  },
  (error: AxiosError) => {
    const cfg = error.config as AxiosRequestConfig | undefined;
    if (DEBUG_API) {
      const dur = now() - (cfg?.metadata?.start ?? now());
      const status = (error.response?.status as number | undefined) ?? "ERR";
      console.groupCollapsed(
        `%cAPI ✖ ${status} ${cfg?.method?.toUpperCase?.() ?? ""} ${cfg?.url ?? ""} (${dur.toFixed(0)}ms)`,
        "color:#ef4444;font-weight:700"
      );
      if (error.response) {
        console.log("response.data:", error.response.data);
        console.log("response.headers:", error.response.headers);
      } else {
        console.log("message:", error.message);
      }
      console.groupEnd();
    }

    // 401 → bersihkan token & broadcast event
    if (error.response?.status === 401) {
      clearAuthToken();
      try {
        const ev = new CustomEvent("auth:unauthorized", {
          detail: { source: "axios" },
        });
        window.dispatchEvent(ev);
      } catch {}
    }

    return Promise.reject(error);
  }
);

/* ============ Helpers tambahan ============ */
/** Panggil sekali saat app start agar header Authorization terpasang dari storage */
export function bootstrapAuthFromStorage() {
  const t = getAuthToken();
  if (t)
    (axios.defaults.headers.common as any)["Authorization"] = `Bearer ${t}`;
}

/**
 * Best-effort logout:
 * - Coba request ke server (GET/POST sesuai ENV).
 * - Apapun hasilnya (termasuk 403), FE selalu clear token.
 */
export async function apiLogout() {
  try {
    if (LOGOUT_METHOD === "POST") {
      await axios.post(LOGOUT_PATH);
    } else {
      await axios.get(LOGOUT_PATH);
    }
  } catch {
    // abaikan error logout server
  } finally {
    clearAuthToken();
    try {
      const ev = new CustomEvent("auth:logout", {
        detail: { source: "axios" },
      });
      window.dispatchEvent(ev);
    } catch {}
  }
}

export default axios;
