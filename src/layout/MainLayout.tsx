// src/layout/MainLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import type { Palette } from "@/pages/pendidikanku-dashboard/components/ui/Primitives";
import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/ParentTopBar";
import ParentSidebar from "@/pages/pendidikanku-dashboard/components/home/ParentSideBar";
import { useActiveMasjidInfo } from "@/hooks/useActiveMasjidInfo"; // 👈 tambah

export default function MainLayout() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const nowIso = new Date().toISOString();
  const hijri = new Date(nowIso).toLocaleDateString(
    "id-ID-u-ca-islamic-umalqura",
    { weekday: "long", day: "2-digit", month: "long", year: "numeric" }
  );

  const { name: activeMasjidName } = useActiveMasjidInfo(); // 👈 ambil nama

  return (
    <div
      className="flex min-h-screen w-full transition-colors"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* Sidebar desktop: full ↔ rail */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 h-screen flex-shrink-0 z-30 transition-all duration-300 ${
          sidebarVisible ? "w-64 xl:w-72" : "w-14"
        } overflow-hidden border-r`}
        style={{ background: palette.white1, borderColor: palette.silver1 }}
      >
        <ParentSidebar desktopOnly mode="desktop" open={sidebarVisible} />
      </aside>

      {/* Konten utama: margin ikut lebar sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarVisible ? "lg:ml-64 xl:ml-72" : "lg:ml-14"
        }`}
      >
        <div className="sticky top-0 z-50">
          <ParentTopBar
            palette={palette}
            title={activeMasjidName || "Memuat…"} // 👈 pakai nama sekolah/masjid
            gregorianDate={nowIso}
            hijriDate={hijri}
            onMenuClick={() => setMobileOpen(true)}
            sidebarOpen={sidebarVisible}
            onToggleSidebar={() => setSidebarVisible((v) => !v)}
          />
        </div>

        <main
          className="flex-1 overflow-y-auto overflow-x-visible px-4 md:px-6 py-4 md:py-8"
          style={{ background: palette.white2, color: palette.black1 }}>
          <Outlet />
        </main>


      </div>

      {/* Sidebar mobile */}
      <ParentSidebar
        desktopOnly={false}
        mode="mobile"
        open={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
    </div>
  );
}