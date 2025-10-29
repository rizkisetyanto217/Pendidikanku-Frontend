import { useState } from "react";
import { Outlet } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import type { Palette } from "@/pages/pendidikanku-dashboard/components/ui/Primitives";
import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/ParentTopBar";
import ParentSidebar from "@/pages/pendidikanku-dashboard/components/home/ParentSideBar";
import { Menu } from "lucide-react";

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

  return (
    <div
      className="flex min-h-screen w-full transition-colors"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* Sidebar desktop */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 h-screen flex-shrink-0 border-r border-gray-200 bg-white z-30 transition-all duration-300 ${
          sidebarVisible ? "w-64 xl:w-72" : "w-0"
        } overflow-hidden`}
      >
        <ParentSidebar desktopOnly mode="desktop" open={sidebarVisible} />
      </aside>

      {/* Tombol toggle yang menempel di tepi sidebar */}
      <button
        onClick={() => setSidebarVisible(!sidebarVisible)}
        className={`hidden lg:flex fixed top-4 z-40 items-center justify-center w-9 h-9 rounded-xl border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition-all duration-300 ${
          sidebarVisible ? "left-[260px] xl:left-[290px]" : "left-4"
        }`}
        title={sidebarVisible ? "Sembunyikan sidebar" : "Tampilkan sidebar"}
      >
        <Menu
          size={18}
          className={`transition-transform duration-300 ${
            sidebarVisible ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Konten utama */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarVisible ? "lg:ml-64 xl:ml-72" : "lg:ml-0"
        }`}
      >
        {/* TopBar */}
        <div className="sticky top-0 z-30">
          <ParentTopBar
            palette={palette}
            title="Sekolah Al Hijrah Bandung 3"
            gregorianDate={nowIso}
            hijriDate={hijri}
            onMenuClick={() => setMobileOpen(true)}
          />
        </div>

        {/* Konten scrollable */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-8">
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
