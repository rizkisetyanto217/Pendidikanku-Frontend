// src/layout/useTopBar.tsx
import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export type TopBarMode = "menu" | "back";

export type TopBarConfig = {
  mode?: TopBarMode; // "menu" | "back"
  title?: ReactNode; // judul halaman
  backTo?: number | string; // -1 (history), atau path "/:id/..."
};

export type TopBarAPI = {
  topBar: Required<Pick<TopBarConfig, "mode">> & TopBarConfig;
  setTopBar: (cfg: TopBarConfig) => void;
  resetTopBar: () => void;
};

export const TopBarContext = createContext<TopBarAPI | null>(null);

export function useTopBar() {
  const ctx = useContext(TopBarContext);
  if (!ctx) {
    throw new Error(
      "useTopBar must be used within a TopBarContext provider (MainLayout)."
    );
  }
  return ctx;
}
