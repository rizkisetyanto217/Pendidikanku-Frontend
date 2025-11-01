// src/lib/axios.ts
import axiosLib, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

/* ==========================================
   🔧 BASE
========================================== */
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  "https://masjidkubackend4-production.up.railway.app/api";

const api: AxiosInstance = axiosLib.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 60_000,
});

const apiNoAuth = axiosLib.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 60_000,
});

/* ==========================================
   🧰 COOKIE UTILS (non-HttpOnly, utk context)
========================================== */
function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}
function setCookie(
  name: string,
  value: string,
  {
    days = 30,
    path = "/",
    secure = true,
    sameSite = "Lax" as "Lax" | "Strict" | "None",
  } = {}
) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie =
    `${name}=${encodeURIComponent(value)}; Path=${path}; Max-Age=${maxAge}; SameSite=${sameSite};` +
    (secure ? " Secure;" : "");
}
function delCookie(name: string, path = "/") {
  document.cookie = `${name}=; Path=${path}; Max-Age=0; SameSite=Lax;`;
}
const isFormData = (d: any) =>
  typeof FormData !== "undefined" && d instanceof FormData;

/* ==========================================
   🏷️ MASJID CONTEXT (cookie + display)
========================================== */
const ACTIVE_MASJID_COOKIE = "active_masjid_id";
const ACTIVE_ROLE_COOKIE = "active_role";

// simpan nama & icon masjid aktif untuk render cepat di UI (per-tab)
const ACTIVE_MASJID_NAME_SS = "active_masjid_name";
const ACTIVE_MASJID_ICON_SS = "active_masjid_icon";

export function setActiveMasjidDisplay(name?: string, icon?: string) {
  if (typeof sessionStorage === "undefined") return;
  if (typeof name === "string")
    sessionStorage.setItem(ACTIVE_MASJID_NAME_SS, name);
  if (typeof icon === "string")
    sessionStorage.setItem(ACTIVE_MASJID_ICON_SS, icon);
}
export function getActiveMasjidDisplay() {
  if (typeof sessionStorage === "undefined")
    return { name: null as string | null, icon: null as string | null };
  return {
    name: sessionStorage.getItem(ACTIVE_MASJID_NAME_SS),
    icon: sessionStorage.getItem(ACTIVE_MASJID_ICON_SS),
  };
}
export function clearActiveMasjidDisplay() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(ACTIVE_MASJID_NAME_SS);
  sessionStorage.removeItem(ACTIVE_MASJID_ICON_SS);
}

/* ==========================================
   🔐 ACCESS TOKEN — IN MEMORY ONLY
========================================== */
let accessToken: string | null = null;

export function setTokens(access: string) {
  accessToken = access;
  (api.defaults.headers.common as any).Authorization = `Bearer ${access}`;
  console.debug("[auth] set access token");
  window.dispatchEvent(new CustomEvent("auth:authorized"));
}
export function getAccessToken() {
  return accessToken;
}
export function clearTokens() {
  accessToken = null;
  delete (api.defaults.headers.common as any).Authorization;
  console.debug("[auth] cleared access token");
}

/* ==========================================
   🔄 CSRF in-memory
========================================== */
let csrfTokenMem: string | null = null;

// ⬇️ ganti fungsi ini
export async function ensureCsrf(): Promise<string | null> {
  if (csrfTokenMem) return csrfTokenMem;

  // 1) Coba baca dari cookie dulu (paling cepat, no network)
  const fromCookie = getCookie("XSRF-TOKEN");
  if (fromCookie) {
    csrfTokenMem = fromCookie;
    return csrfTokenMem;
  }

  // 2) Kalau belum ada, baru hit /auth/csrf
  try {
    const res = await apiNoAuth.get("/auth/csrf", { withCredentials: true });
    csrfTokenMem =
      res.data?.data?.csrf_token ?? getCookie("XSRF-TOKEN") ?? null;
  } catch {
    csrfTokenMem = null;
  }
  return csrfTokenMem;
}

/* ==========================================
   👤 Simple Context (me/simple-context) + cache
========================================== */
export type Membership = {
  masjid_id: string;
  masjid_name: string;
  masjid_icon_url?: string;
  roles?: string[];
};

let _ctxCache: { at: number; data: { memberships: Membership[] } } | null =
  null;
const CTX_TTL_MS = 5 * 60 * 1000; // 5 menit

export function clearSimpleContextCache() {
  _ctxCache = null;
}

export async function fetchSimpleContext(force = false) {
  const now = Date.now();
  if (!force && _ctxCache && now - _ctxCache.at < CTX_TTL_MS) {
    return _ctxCache.data;
  }
  const res = await api.get("/auth/me/simple-context");
  const data = {
    memberships: (res.data?.data?.memberships ?? []) as Membership[],
  };
  _ctxCache = { at: now, data };
  return data;
}

/* ==========================================
   🏷️ Set/Clear Active Context + broadcast
========================================== */
export function setActiveMasjidContext(
  masjidId: string,
  role?: string,
  opts?: { name?: string; icon?: string } // opsional ikut set display
) {
  if (masjidId) setCookie(ACTIVE_MASJID_COOKIE, masjidId);
  if (role) setCookie(ACTIVE_ROLE_COOKIE, role);
  if (opts?.name || opts?.icon) setActiveMasjidDisplay(opts.name, opts.icon);

  clearSimpleContextCache(); // invalidasi cache agar hook refetch
  window.dispatchEvent(
    new CustomEvent("masjid:changed", {
      detail: { masjidId, role, meta: opts },
    })
  );
}

export function clearActiveMasjidContext() {
  delCookie(ACTIVE_MASJID_COOKIE);
  delCookie(ACTIVE_ROLE_COOKIE);
  clearActiveMasjidDisplay();

  clearSimpleContextCache();
  window.dispatchEvent(new CustomEvent("masjid:changed", { detail: null }));
}

export function getActiveMasjidId(): string | null {
  return getCookie(ACTIVE_MASJID_COOKIE);
}
export function getActiveRole(): string | null {
  return getCookie(ACTIVE_ROLE_COOKIE);
}

/* ==========================================
   🔄 REFRESH via Cookie HttpOnly + XSRF
========================================== */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
const waiters: Array<(t: string | null) => void> = [];
const notifyWaiters = (t: string | null) => {
  while (waiters.length) waiters.shift()!(t);
};

async function doRefresh(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;

  refreshPromise = (async () => {
    // Pastikan kita punya XSRF, idealnya dari cookie (instant)
    const xsrf = (await ensureCsrf()) || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (xsrf) headers["X-CSRF-Token"] = xsrf;

    try {
      const res = await apiNoAuth.post(
        "/auth/refresh-token",
        {},
        { headers, withCredentials: true }
      );
      const newAT = res.data?.data?.access_token ?? null;
      if (newAT) setTokens(newAT);

      // 🔄 server set cookie XSRF baru → sync ke mem
      const fromCookie = getCookie("XSRF-TOKEN");
      if (fromCookie) csrfTokenMem = fromCookie;

      return newAT;
    } catch (err: any) {
      // ✅ fallback: kalau 403 CSRF, re-seed lalu retry sekali
      if (err?.response?.status === 403) {
        await apiNoAuth.get("/auth/csrf", { withCredentials: true });
        const token = getCookie("XSRF-TOKEN");
        if (token) csrfTokenMem = token;

        const res2 = await apiNoAuth
          .post(
            "/auth/refresh-token",
            {},
            {
              headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfTokenMem || "",
              },
              withCredentials: true,
            }
          )
          .catch(() => null);

        const newAT2 = res2?.data?.data?.access_token ?? null;
        if (newAT2) {
          setTokens(newAT2);
          const fromCookie2 = getCookie("XSRF-TOKEN");
          if (fromCookie2) csrfTokenMem = fromCookie2;
          return newAT2;
        }
      }

      // gagal total
      clearTokens();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      return null;
    }
  })().finally(() => {
    isRefreshing = false;
    const p = refreshPromise;
    refreshPromise = null;
    return p;
  });

  return refreshPromise;
}

/* ==========================================
   🧩 INTERCEPTORS
========================================== */
/* ==========================================
   🔁 RESPONSE INTERCEPTOR: auto refresh + retry
========================================== */

/* ==========================================
   🧩 REQUEST INTERCEPTOR
========================================== */
api.interceptors.request.use(async (config) => {
  const url = String(config.url || "");
  const method = (config.method || "get").toUpperCase();
  const isAuthArea = url.startsWith("/auth/");
  const isLogin = url.endsWith("/auth/login");
  const isRefresh = url.endsWith("/auth/refresh-token");

  // 1) Authorization
  if (!isLogin && !isRefresh) {
    const at = getAccessToken();
    if (at) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${at}`;
    }
  }

  // 2) CSRF untuk non-auth & method mutating
  const needsCsrf = !isAuthArea && !["GET", "HEAD", "OPTIONS"].includes(method);
  if (needsCsrf && !csrfTokenMem) {
    await ensureCsrf();
  }
  if (!isAuthArea && csrfTokenMem) {
    config.headers = config.headers ?? {};
    (config.headers as any)["X-CSRF-Token"] = csrfTokenMem;
  }

  // 3) Scope tenant (opsional, kalau backend baca header ini)
  if (!isAuthArea) {
    const mid = getActiveMasjidId();
    if (mid) {
      config.headers = config.headers ?? {};
      (config.headers as any)["X-Masjid-ID"] = mid;
    }
  }

  // 4) Content-Type default (kecuali FormData)
  if (
    !isFormData((config as any).data) &&
    !(config.headers && "Content-Type" in (config.headers as any))
  ) {
    config.headers = config.headers ?? {};
    (config.headers as any)["Content-Type"] = "application/json";
  }

  return config;
});

/* ==========================================
   🚪 LOGOUT
========================================== */
export async function apiLogout() {
  try {
    const xsrf = csrfTokenMem || (await ensureCsrf()) || "";
    await api.post(
      "/auth/logout",
      {},
      { headers: { "Content-Type": "application/json", "X-CSRF-Token": xsrf } }
    );
  } catch (e) {
    console.warn("[logout] failed:", e);
  } finally {
    clearTokens();
    clearActiveMasjidContext();
    clearSimpleContextCache(); // pastikan cache bersih
    window.dispatchEvent(
      new CustomEvent("auth:logout", { detail: { source: "axios" } })
    );
    console.log("✅ Logout: access token dibersihkan");
  }
}

export default api;

/* ==========================================
   Utils
========================================== */
export async function restoreSession(): Promise<boolean> {
  if (getAccessToken()) return true;
  const t0 = performance.now();
  const t = await doRefresh(); // ensureCsrf() tak perlu lagi di sini
  console.debug(
    "[restoreSession] done in",
    Math.round(performance.now() - t0),
    "ms",
    "success:",
    !!t
  );
  return Boolean(t);
}
