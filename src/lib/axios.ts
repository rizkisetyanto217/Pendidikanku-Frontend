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

export async function ensureCsrf() {
  if (csrfTokenMem) return csrfTokenMem;
  try {
    const t0 = performance.now();
    const res = await apiNoAuth.get("/auth/csrf", { withCredentials: true });
    csrfTokenMem = res.data?.data?.csrf_token ?? null;
    console.debug(
      "[csrf] fetched in",
      Math.round(performance.now() - t0),
      "ms"
    );
  } catch (e) {
    console.warn("[csrf] fetch failed", e);
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
    const xsrf = (await ensureCsrf()) || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (xsrf) headers["X-CSRF-Token"] = xsrf;

    const res = await apiNoAuth.post(
      "/auth/refresh-token",
      {},
      {
        headers,
        withCredentials: true, // pastikan cookie terkirim
      }
    );
    const newAT = res.data?.data?.access_token ?? null;
    if (newAT) setTokens(newAT);
    return newAT;
  })()
    .catch((err) => {
      console.warn("[refresh] failed:", (err as any)?.response || err);
      clearTokens();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      return null;
    })
    .finally(() => {
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
api.interceptors.request.use((config) => {
  const url = (config.url || "") + "";
  const isAuthArea = url.startsWith("/auth/");

  const isLogin = url.endsWith("/auth/login");
  const isRefresh = url.endsWith("/auth/refresh-token");
  const isCsrf = url.endsWith("/auth/csrf");

  // Authorization: kirim normal kecuali login/refresh
  if (!isLogin && !isRefresh) {
    const at = getAccessToken();
    if (at) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${at}`;
    }
  }

  // X-CSRF-Token: jangan kirim utk login/refresh/csrf
  if (!isLogin && !isRefresh && !isCsrf && csrfTokenMem) {
    config.headers = config.headers ?? {};
    (config.headers as any)["X-CSRF-Token"] = csrfTokenMem;
  }

  // JANGAN kirim X-Masjid-ID di /auth/*
  if (!isAuthArea) {
    const mid = getActiveMasjidId();
    if (mid) {
      config.headers = config.headers ?? {};
      (config.headers as any)["X-Masjid-ID"] = mid;
    }
  }

  // Content-Type default
  if (
    !isFormData((config as any).data) &&
    !(config.headers && "Content-Type" in (config.headers as any))
  ) {
    config.headers = config.headers ?? {};
    (config.headers as any)["Content-Type"] = "application/json";
  }

  return config;
});

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = (error?.config || {}) as RetriableConfig;
    const status = error?.response?.status;
    const url = (original.url || "") + "";
    const isRefreshCall = url.includes("/auth/refresh-token");

    if (status === 401 && !original._retry && !isRefreshCall) {
      original._retry = true;

      // tunggu refresh yg sedang berjalan
      if (isRefreshing && refreshPromise) {
        return new Promise((resolve, reject) => {
          waiters.push((t) => {
            if (!t) return reject(error);
            original.headers = original.headers ?? {};
            (original.headers as any).Authorization = `Bearer ${t}`;
            const mid = getActiveMasjidId();
            if (mid) (original.headers as any)["X-Masjid-ID"] = mid;
            resolve(api(original));
          });
        });
      }

      const newToken = await doRefresh();
      notifyWaiters(newToken);

      if (newToken) {
        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        const mid = getActiveMasjidId();
        if (mid) (original.headers as any)["X-Masjid-ID"] = mid;
        return api(original);
      }
    }

    if (isRefreshCall && (status === 400 || status === 401 || status === 403)) {
      clearTokens();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    return Promise.reject(error);
  }
);

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
  await ensureCsrf();
  const t = await doRefresh();
  console.debug(
    "[restoreSession] done in",
    Math.round(performance.now() - t0),
    "ms",
    "success:",
    !!t
  );
  return Boolean(t);
}