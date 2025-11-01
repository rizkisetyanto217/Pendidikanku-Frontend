// src/pages/sekolahislamku/student/StudentMenuGrids.tsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";

// UI
import {
  SectionCard,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/CParentTopBar";
import ParentSidebar from "@/pages/pendidikanku-dashboard/components/home/CParentSideBar";

// Icons
import {
  BookOpen,
  Megaphone,
  Wallet,
  CalendarDays,
  Award,
  IdCard,
} from "lucide-react";

/* ============== Helpers ============== */
const toLocalNoonISO = (d: Date) => {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x.toISOString();
};

type MenuItem = {
  key: string;
  label: string;
  to?: string;
  icon: React.ReactNode;
};

/* ============== Page ============== */
export default function StudentMenuGrids() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const topbarISO = toLocalNoonISO(new Date());

  const items: MenuItem[] = useMemo(
    () => [
      {
        key: "kelas-saya",
        label: "Kelas Saya",
        to: "kelas-saya",
        icon: <BookOpen />,
      },
      // {
      //   key: "pengumuman",
      //   label: "Pengumuman",
      //   to: "announcements",
      //   icon: <Megaphone />,
      // },
      {
        key: "keuangan",
        label: "Pembayaran",
        to: "keuangan",
        icon: <Wallet />,
      },
      {
        key: "jadwal",
        label: "Jadwal",
        to: "jadwal",
        icon: <CalendarDays />,
      },
      // {
      //   key: "sertifikat",
      //   label: "Sertifikat",
      //   to: "sertifikat-murid",
      //   icon: <Award />,
      // },
      {
        key: "profil",
        label: "Profil Murid",
        to: "profil-murid",
        icon: <IdCard />,
      },
    ],
    []
  );

  return (
    <div
      className="w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main */}
          <section className="flex-1 flex flex-col space-y-8 min-w-0 ">
            <SectionCard palette={palette} className="p-4 md:p-5">
              <div className="mb-4 font-semibold text-lg">
                Akses Cepat Murid
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {items.map((it) => (
                  <MenuTile key={it.key} item={it} palette={palette} />
                ))}
              </div>
            </SectionCard>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ============== Tile ============== */
function MenuTile({ item, palette }: { item: MenuItem; palette: Palette }) {
  return (
    <Link
      to={item.to || "#"}
      className="block hover:scale-[1.02] active:scale-[0.99] focus:outline-none"
      style={{ transition: "transform 160ms ease" }}
    >
      <div
        className="h-full w-full rounded-2xl border p-3 md:p-4 flex flex-col items-center justify-center text-center gap-2"
        style={{ borderColor: palette.silver1, background: palette.white1 }}
      >
        <span
          className="h-12 w-12 md:h-14 md:w-14 grid place-items-center rounded-xl"
          style={{ background: palette.primary2, color: palette.primary }}
        >
          {item.icon}
        </span>
        <div className="text-xs md:text-sm font-medium leading-tight line-clamp-2">
          {item.label}
        </div>
      </div>
    </Link>
  );
}
