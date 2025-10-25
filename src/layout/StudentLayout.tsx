import { useState } from "react";
import { Outlet } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import type { Palette } from "@/pages/pendidikanku-dashboard/components/ui/Primitives";
import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/ParentTopBar";
import ParentSidebar from "@/pages/pendidikanku-dashboard/components/home/ParentSideBar";

export default function StudentLayout() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const [mobileOpen, setMobileOpen] = useState(false);

  const nowIso = new Date().toISOString();
  const hijri = new Date(nowIso).toLocaleDateString(
    "id-ID-u-ca-islamic-umalqura",
    { weekday: "long", day: "2-digit", month: "long", year: "numeric" }
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <ParentTopBar
        palette={palette}
        title="Sekolah Al Hijrah Bandung 3"
        gregorianDate={nowIso}
        hijriDate={hijri}
        onMenuClick={() => setMobileOpen(true)} // ⬅️ buka drawer
      />

      <div className="mx-auto max-w-screen-2xl px-4 md:px-6 py-4 md:py-8 lg:flex lg:items-start lg:gap-6">
        {/* Sidebar desktop (tetap) */}
        <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
          <ParentSidebar desktopOnly mode="desktop" open />
        </aside>

        {/* Sidebar mobile (drawer) */}
        <ParentSidebar
          desktopOnly={false}
          mode="mobile"
          open={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Konten */}
        <section className="flex-1 min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
