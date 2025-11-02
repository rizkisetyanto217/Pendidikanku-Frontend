// src/hooks/useHtmlThema.ts
import { useSyncExternalStore } from "react";
import type { ThemeName } from "@/constants/thema";

export type ThemeMode = "light" | "dark" | "system";

// kunci penyimpanan
const MODE_KEY = "theme"; // light/dark/system
const THEME_KEY = "theme-name"; // nama tema tambahan

// daftar tema valid (sinkron dengan constants/colorsThema.ts)
const THEME_NAMES: ThemeName[] = [
  "default",
  "sunrise",
  "midnight",
  "emerald",
  "ocean",
  "forest",
  "rose",
  "sand",
];

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

const safeGet = (k: string) => {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};

function normalizeThemeName(raw: string | null): ThemeName {
  const v = (raw || "").trim() as ThemeName;
  return (THEME_NAMES as readonly string[]).includes(v) ? v : "default";
}

function normalizeMode(raw: string | null): ThemeMode {
  const v = (raw || "").trim();
  return v === "light" || v === "dark" || v === "system" ? v : "system";
}

function computeIsDark(mode: ThemeMode): boolean {
  if (!isBrowser) return false;
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// ---------- GLOBAL STORE (singleton) ----------
type State = {
  mode: ThemeMode;
  themeName: ThemeName;
  isDark: boolean;
};

type Listener = () => void;

const store = (() => {
  // state global (init dari localStorage)
  const initMode = normalizeMode(safeGet(MODE_KEY));
  const initTheme = normalizeThemeName(safeGet(THEME_KEY));

  let state: State = {
    mode: initMode,
    themeName: initTheme,
    isDark: computeIsDark(initMode),
  };

  const listeners = new Set<Listener>();

  function applySideEffects(s: State) {
    if (!isBrowser) return;
    const html = document.documentElement;
    html.classList.toggle("dark", s.isDark);
    html.setAttribute("data-theme", s.themeName);
    try {
      localStorage.setItem(MODE_KEY, s.mode);
      localStorage.setItem(THEME_KEY, s.themeName);
    } catch {}
  }

  // panggil sekali saat init
  applySideEffects(state);

  // listener untuk mode=system
  let mq: MediaQueryList | null = null;
  function ensureSystemListener(active: boolean) {
    if (!isBrowser) return;
    if (active) {
      if (!mq) {
        mq = window.matchMedia("(prefers-color-scheme: dark)");
        mq.addEventListener("change", handleMQChange);
      }
    } else if (mq) {
      mq.removeEventListener("change", handleMQChange);
      mq = null;
    }
  }
  function handleMQChange() {
    // hanya relevan kalau mode=system
    if (state.mode !== "system") return;
    state = { ...state, isDark: computeIsDark(state.mode) };
    applySideEffects(state);
    emit();
  }
  ensureSystemListener(state.mode === "system");

  function setMode(mode: ThemeMode) {
    const nextMode = normalizeMode(mode);
    const next: State = {
      ...state,
      mode: nextMode,
      isDark: computeIsDark(nextMode),
    };
    state = next;
    ensureSystemListener(nextMode === "system");
    applySideEffects(state);
    emit();
  }
  function setThemeName(themeName: ThemeName) {
    const nextTheme = normalizeThemeName(themeName);
    state = { ...state, themeName: nextTheme };
    applySideEffects(state);
    emit();
  }

  function subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  }
  function emit() {
    for (const l of listeners) l();
  }

  return {
    getSnapshot: () => state,
    subscribe,
    setMode,
    setThemeName,
    toggleDark: () => setMode(state.mode === "dark" ? "light" : "dark"),
    setDarkMode: (v: boolean) => setMode(v ? "dark" : "light"),
  };
})();

// ---------- HOOK (API kompatibel) ----------
export default function useHtmlThema() {
  const snap = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );

  return {
    isDark: snap.isDark,
    toggleDark: store.toggleDark,
    setDarkMode: store.setDarkMode,
    themeName: snap.themeName,
    setThemeName: store.setThemeName,
    mode: snap.mode,
    setMode: store.setMode,
    // bonus: expose daftar tema kalau mau render dropdown
    themeNames: THEME_NAMES as readonly ThemeName[],
  };
}
