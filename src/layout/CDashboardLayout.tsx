import { useMemo, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import type { Palette } from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/CParentTopBar";
import ParentSidebar from "@/pages/pendidikanku-dashboard/components/home/CParentSideBar";
import { useActiveMasjidInfo } from "@/hooks/useActiveMasjidInfo";
import {
  TopBarContext,
  type TopBarConfig,
  type TopBarAPI,
} from "@/pages/pendidikanku-dashboard/components/home/CUseTopBar";

export default function DashboardLayout() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const nowIso = new Date().toISOString();
  const hijri = new Date(nowIso).toLocaleDateString(
    "id-ID-u-ca-islamic-umalqura",
    { weekday: "long", day: "2-digit", month: "long", year: "numeric" }
  );

  const { name: activeMasjidName } = useActiveMasjidInfo();

  const [topBar, setTopBarState] = useState<Required<TopBarConfig>>({
    mode: "menu",
    title: null,
    backTo: -1,
  });

  const setTopBar = useCallback((cfg: TopBarConfig) => {
    setTopBarState((prev) => ({
      ...prev,
      ...cfg,
      mode: cfg.mode ?? prev.mode,
    }));
  }, []);
  const resetTopBar = useCallback(
    () => setTopBarState({ mode: "menu", title: null, backTo: -1 }),
    []
  );

  const api: TopBarAPI = useMemo(
    () => ({ topBar, setTopBar, resetTopBar }),
    [topBar, setTopBar, resetTopBar]
  );

  const handleBack = () => {
    const target = topBar.backTo ?? -1;
    if (typeof target === "number") navigate(target);
    else if (typeof target === "string") navigate(target);
    else navigate(-1);
  };

  return (
    <TopBarContext.Provider value={api}>
      <div
        className="flex w-full min-h-[100svh] transition-colors"
        style={{ background: palette.white2, color: palette.black1 }}
      >
        {/* Sidebar desktop */}
        <aside
          className={`hidden lg:flex fixed top-0 left-0 h-screen flex-shrink-0 z-30 transition-all duration-300 ${
            sidebarVisible ? "w-64" : "w-14"
          } overflow-hidden border-r`}
          style={{ background: palette.white1, borderColor: palette.silver1 }}
        >
          <ParentSidebar desktopOnly mode="desktop" open={sidebarVisible} />
        </aside>

        {/* Konten utama */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarVisible ? "lg:ml-64" : "lg:ml-14"
          }`}
        >
          <div className="sticky top-0 z-50">
            <ParentTopBar
              palette={palette}
              title={topBar.title ?? activeMasjidName ?? "Memuat…"}
              gregorianDate={nowIso}
              hijriDate={hijri}
              showBack={topBar.mode === "back"}
              onBackClick={handleBack}
              onMenuClick={() => setMobileOpen(true)}
              sidebarOpen={sidebarVisible}
              onToggleSidebar={() => setSidebarVisible((v) => !v)}
            />
          </div>

          <main
            className="flex-1 min-h-0 overflow-x-visible px-4 md:px-6 py-4 md:py-8"
            style={{ background: palette.white2, color: palette.black1 }}
          >
            <Outlet context={api} />
          </main>
        </div>

        {/* Sidebar mobile */}
        {/* Sidebar mobile */}
        <div className="lg:hidden">
          <ParentSidebar
            desktopOnly={false}
            mode="mobile"
            open={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
          />
        </div>
      </div>
    </TopBarContext.Provider>
  );
}
