import { jsx as _jsx } from "react/jsx-runtime";
// src/hooks/ThemeContext.tsx
import { createContext, useContext, useEffect, useMemo, useState, } from "react";
const MODE_KEY = "theme";
const THEME_KEY = "theme-name";
const ThemeContext = createContext(null);
export const ThemeProvider = ({ children, }) => {
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
    const [mode, setMode] = useState(() => safeGet(MODE_KEY) || "system");
    const [themeName, setThemeName] = useState(() => safeGet(THEME_KEY) || "default");
    const computeIsDark = () => {
        if (!isBrowser)
            return false;
        if (mode === "dark")
            return true;
        if (mode === "light")
            return false;
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };
    const [isDark, setIsDark] = useState(() => isBrowser ? computeIsDark() : false);
    useEffect(() => {
        if (!isBrowser)
            return;
        const html = document.documentElement;
        const darkNow = computeIsDark();
        html.classList.toggle("dark", darkNow);
        html.setAttribute("data-theme", themeName);
        setIsDark(darkNow);
        try {
            localStorage.setItem(MODE_KEY, mode);
            localStorage.setItem(THEME_KEY, themeName);
        }
        catch { }
        if (mode === "system" && window.matchMedia) {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            const handler = () => setIsDark(mq.matches);
            mq.addEventListener("change", handler);
            return () => mq.removeEventListener("change", handler);
        }
    }, [mode, themeName]);
    const toggleDark = () => setMode((prev) => (prev === "dark" ? "light" : "dark"));
    const setDarkMode = (v) => setMode(v ? "dark" : "light");
    const value = useMemo(() => ({
        isDark,
        mode,
        setMode,
        toggleDark,
        setDarkMode,
        themeName,
        setThemeName,
    }), [isDark, mode, themeName]);
    return (_jsx(ThemeContext.Provider, { value: value, children: children }));
};
export function useThemeContext() {
    const ctx = useContext(ThemeContext);
    if (!ctx)
        throw new Error("useThemeContext must be used inside <ThemeProvider>");
    return ctx;
}
