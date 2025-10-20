// src/hooks/useHtmlThema.ts
import { useSyncExternalStore } from "react";
const MODE_KEY = "theme"; // light/dark/system
const THEME_KEY = "theme-name"; // nama tema tambahan
const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
const safeGet = (k) => {
    if (!isBrowser)
        return null;
    try {
        return localStorage.getItem(k);
    }
    catch {
        return null;
    }
};
function computeIsDark(mode) {
    if (!isBrowser)
        return false;
    if (mode === "dark")
        return true;
    if (mode === "light")
        return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
const store = (() => {
    // state global
    let state = {
        mode: safeGet(MODE_KEY) || "system",
        themeName: safeGet(THEME_KEY) || "default",
        isDark: computeIsDark(safeGet(MODE_KEY) || "system"),
    };
    const listeners = new Set();
    function applySideEffects(s) {
        if (!isBrowser)
            return;
        const html = document.documentElement;
        html.classList.toggle("dark", s.isDark);
        html.setAttribute("data-theme", s.themeName);
        try {
            localStorage.setItem(MODE_KEY, s.mode);
            localStorage.setItem(THEME_KEY, s.themeName);
        }
        catch { }
    }
    // panggil sekali saat init
    applySideEffects(state);
    // kalau mode system, dengarkan perubahan OS
    let mq = null;
    function ensureSystemListener(active) {
        if (!isBrowser)
            return;
        if (active) {
            if (!mq) {
                mq = window.matchMedia("(prefers-color-scheme: dark)");
                mq.addEventListener("change", handleMQChange);
            }
        }
        else if (mq) {
            mq.removeEventListener("change", handleMQChange);
            mq = null;
        }
    }
    function handleMQChange() {
        // hanya relevan kalau mode=system
        if (state.mode !== "system")
            return;
        state = { ...state, isDark: computeIsDark(state.mode) };
        applySideEffects(state);
        emit();
    }
    ensureSystemListener(state.mode === "system");
    function setMode(mode) {
        const next = { ...state, mode, isDark: computeIsDark(mode) };
        state = next;
        ensureSystemListener(mode === "system");
        applySideEffects(state);
        emit();
    }
    function setThemeName(themeName) {
        state = { ...state, themeName };
        applySideEffects(state);
        emit();
    }
    function subscribe(l) {
        listeners.add(l);
        return () => listeners.delete(l);
    }
    function emit() {
        for (const l of listeners)
            l();
    }
    return {
        getSnapshot: () => state,
        subscribe,
        setMode,
        setThemeName,
        toggleDark: () => setMode(state.mode === "dark" ? "light" : "dark"),
        setDarkMode: (v) => setMode(v ? "dark" : "light"),
    };
})();
// ---------- HOOK (API kompatibel) ----------
export default function useHtmlThema() {
    const snap = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
    return {
        isDark: snap.isDark,
        toggleDark: store.toggleDark,
        setDarkMode: store.setDarkMode,
        themeName: snap.themeName,
        setThemeName: store.setThemeName,
        mode: snap.mode,
        setMode: store.setMode,
    };
}
