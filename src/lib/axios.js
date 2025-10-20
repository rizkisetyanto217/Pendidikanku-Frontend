import axiosLib from "axios";
import Cookies from "js-cookie";
/* ==========================================
   🔧 KONFIGURASI DASAR
========================================== */
export const API_BASE = import.meta.env.VITE_API_BASE_URL ??
    "https://masjidkubackend4-production.up.railway.app/api";
const axios = axiosLib.create({
    baseURL: API_BASE,
    withCredentials: true,
    timeout: 60_000,
});
/* ==========================================
   🔐 TOKEN UTIL (COOKIE BASED)
========================================== */
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const COOKIE_OPTS = { expires: 7, sameSite: "Lax" };
export function getAccessToken() {
    return Cookies.get(ACCESS_KEY) || null;
}
export function getRefreshToken() {
    return Cookies.get(REFRESH_KEY) || null;
}
export function setTokens(access, refresh) {
    if (access) {
        Cookies.set(ACCESS_KEY, access, COOKIE_OPTS);
        axios.defaults.headers.common.Authorization = `Bearer ${access}`;
    }
    if (refresh)
        Cookies.set(REFRESH_KEY, refresh, COOKIE_OPTS);
}
export function clearTokens() {
    Cookies.remove(ACCESS_KEY);
    Cookies.remove(REFRESH_KEY);
    delete axios.defaults.headers.common.Authorization;
}
/* ==========================================
   🔄 REFRESH TOKEN MEKANISME
========================================== */
let isRefreshing = false;
let subscribers = [];
function subscribeTokenRefresh(cb) {
    subscribers.push(cb);
}
function onRefreshed(token) {
    subscribers.forEach((cb) => cb(token));
    subscribers = [];
}
async function refreshToken() {
    const refresh = getRefreshToken();
    if (!refresh)
        throw new Error("Refresh token tidak ditemukan");
    try {
        const res = await axiosLib.post(`${API_BASE}/auth/refresh-token`, {
            refresh_token: refresh,
        });
        const newAccess = res.data?.data?.access_token;
        const newRefresh = res.data?.data?.refresh_token || refresh;
        if (!newAccess)
            throw new Error("Response refresh token tidak valid");
        setTokens(newAccess, newRefresh);
        console.info("🔁 Token berhasil diperbarui");
        return newAccess;
    }
    catch (err) {
        console.error("❌ Gagal refresh token:", err);
        clearTokens();
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        throw err;
    }
}
/* ==========================================
   🧩 INTERCEPTOR REQUEST & RESPONSE
========================================== */
axios.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});
axios.interceptors.response.use((res) => res, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
        // Jika sudah ada refresh in progress → tunggu
        if (isRefreshing) {
            return new Promise((resolve) => {
                subscribeTokenRefresh((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(axios(originalRequest));
                });
            });
        }
        // Mulai proses refresh
        originalRequest._retry = true;
        isRefreshing = true;
        try {
            const newToken = await refreshToken();
            onRefreshed(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
        }
        catch (err) {
            clearTokens();
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
            throw err;
        }
        finally {
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
});
/* ==========================================
   🚪 LOGOUT HELPER
========================================== */
export async function apiLogout() {
    try {
        // Coba hit endpoint logout jika tersedia (abaikan error)
        await axiosLib.post(`${API_BASE}/auth/logout`).catch(() => { });
        clearTokens();
        window.dispatchEvent(new CustomEvent("auth:logout", { detail: { source: "axios" } }));
        console.log("✅ Logout berhasil, token dibersihkan");
    }
    catch (err) {
        console.warn("⚠️ Logout gagal tapi token sudah dihapus:", err);
    }
}
/* ==========================================
   🧠 BOOTSTRAP DI AWAL APP
========================================== */
export function bootstrapAuth() {
    const token = getAccessToken();
    if (token)
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}
/* ==========================================
   🔚 EXPORT DEFAULT
========================================== */
export default axios;
