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
  withCredentials: true, // penting utk cookie HttpOnly (refresh_token, XSRF-TOKEN)
  timeout: 60_000,
});

const apiNoAuth = axiosLib.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 60_000,
});

/* ==========================================
   🧰 UTIL
========================================== */
function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}
const isFormData = (d: any) =>
  typeof FormData !== "undefined" && d instanceof FormData;

/* ==========================================
   🔐 ACCESS TOKEN — IN MEMORY ONLY
========================================== */
let accessToken: string | null = null;

export function setTokens(access: string) {
  accessToken = access;
  (api.defaults.headers.common as any).Authorization = `Bearer ${access}`;
  // Beri tahu app kalau sudah authorized (dipakai useCurrentUser invalidate)
  window.dispatchEvent(new CustomEvent("auth:authorized"));
}
export function getAccessToken() {
  return accessToken;
}
export function clearTokens() {
  accessToken = null;
  delete (api.defaults.headers.common as any).Authorization;
}

/* ==========================================
   🔄 REFRESH (cookie HttpOnly + XSRF)
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

  const xsrf = getCookie("XSRF-TOKEN") || "";
  refreshPromise = apiNoAuth
    .post(
      "/auth/refresh-token",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": xsrf,
        },
      }
    )
    .then((res) => {
      const newAT = res.data?.data?.access_token ?? null;
      if (newAT) setTokens(newAT);
      return newAT;
    })
    .catch((err) => {
      console.warn("[axios] refresh failed:", err?.response || err);
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
  const url = config.url || "";
  const isLogin = url.endsWith("/auth/login");
  const isRefresh = url.endsWith("/auth/refresh-token");

  // ------ Authorization: jangan kirim untuk login/refresh ------
  if (!isLogin && !isRefresh) {
    const at = getAccessToken();
    if (at) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${at}`;
    }
  }

  // ------ X-CSRF-Token: perlu untuk endpoint cookie-based (refresh/logout) ------
  // aman juga dikirim global, tapi kita explicit saja saat bukan login
  if (!isLogin) {
    const xsrf = getCookie("XSRF-TOKEN");
    if (xsrf) {
      config.headers = config.headers ?? {};
      (config.headers as any)["X-CSRF-Token"] = xsrf;
    }
  }

  // ------ Content-Type: set JSON hanya jika tidak FormData & belum diset ------
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

    // 401 → coba refresh sekali (kecuali request refresh itu sendiri)
    if (status === 401 && !original._retry && !isRefreshCall) {
      original._retry = true;

      if (isRefreshing && refreshPromise) {
        return new Promise((resolve, reject) => {
          waiters.push((t) => {
            if (!t) return reject(error);
            original.headers = original.headers ?? {};
            (original.headers as any).Authorization = `Bearer ${t}`;
            resolve(api(original));
          });
        });
      }

      const newToken = await doRefresh();
      notifyWaiters(newToken);

      if (newToken) {
        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }

    // Refresh gagal dengan 4xx/403 → anggap sesi habis
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
    const xsrf = getCookie("XSRF-TOKEN") || "";
    await api.post(
      "/auth/logout",
      {},
      { headers: { "Content-Type": "application/json", "X-CSRF-Token": xsrf } }
    );
  } catch {
    // ignore
  } finally {
    clearTokens();
    window.dispatchEvent(
      new CustomEvent("auth:logout", { detail: { source: "axios" } })
    );
    console.log("✅ Logout: access token dibersihkan");
  }
}

export default api;
