// src/pages/sekolahislamku/pages/academic/SchoolActiveClass.tsx
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// Theme & utils
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";

// UI primitives & layout
import {
  SectionCard,
  Btn,
  Badge,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/Primitives";
import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/ParentTopBar";
import ParentSidebar from "@/pages/pendidikanku-dashboard/components/home/ParentSideBar";

// Icons
import {
  Users,
  GraduationCap,
  Filter as FilterIcon,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";

/* ============== Helpers ============== */
const dateLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";
const hijriLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";
const toLocalNoonISO = (d: Date) => {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x.toISOString();
};

/* ============== Types ============== */
type ClassRow = {
  id: string;
  name: string;
  academic_year: string;
  homeroom_teacher: string;
  student_count: number;
  status: "active" | "inactive";
};

type ApiActiveClassResp = {
  list: ClassRow[];
};

function ActiveClassCard({ r, palette }: { r: ClassRow; palette: Palette }) {
  return (
    <div
      className="rounded-xl border p-3 space-y-2"
      style={{ borderColor: palette.silver1, background: palette.white1 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs opacity-70">Nama Kelas</div>
          <div className="font-semibold truncate">{r.name}</div>
        </div>
        <Badge
          palette={palette}
          variant={r.status === "active" ? "success" : "outline"}
        >
          {r.status === "active" ? "Aktif" : "Nonaktif"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <div className="text-xs opacity-70">Wali Kelas</div>
          <div className="text-sm truncate">{r.homeroom_teacher}</div>
        </div>
        <div>
          <div className="text-xs opacity-70">Tahun Ajaran</div>
          <div className="text-sm">{r.academic_year}</div>
        </div>
      </div>

      <div>
        <div className="text-xs opacity-70">Jumlah Siswa</div>
        <div className="text-sm">{r.student_count}</div>
      </div>
    </div>
  );
}

/* ============== Page ============== */
const SchoolActiveClass: React.FC = () => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  const gregorianISO = toLocalNoonISO(new Date());

  // Query data (dummy)
  const classesQ = useQuery({
    queryKey: ["active-classes"],
    queryFn: async (): Promise<ApiActiveClassResp> => {
      // Ganti ke axios.get("/api/a/classes/active") nanti
      const dummy: ApiActiveClassResp = {
        list: Array.from({ length: 8 }).map((_, i) => ({
          id: `cls-${i + 1}`,
          name: `Kelas ${i + 1}${["A", "B"][i % 2]}`,
          academic_year: "2025/2026",
          homeroom_teacher: `Ustadz/Ustadzah ${i + 1}`,
          student_count: 25 + (i % 6),
          status: i % 5 === 0 ? "inactive" : "active",
        })),
      };
      return dummy;
    },
    staleTime: 60_000,
  });

  const rows = useMemo(() => classesQ.data?.list ?? [], [classesQ.data]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main */}

          <section className="flex-1 flex flex-col space-y-6 min-w-0">
    
            {/* Header */}
            <section className="flex items-center justify-between">
              <div className="flex items-center font-semibold text-lg">
                <Btn
                  onClick={() => navigate(-1)}
                  palette={palette}
                  variant="ghost"
                  className="cursor-pointer mr-3"
                >
                  <ArrowLeft size={20} />
                </Btn>
                <h1>Daftar Kelas Aktif</h1>
              </div>
            </section>

            {/* Table */}
            {/* Cards (all devices) */}
            <SectionCard palette={palette}>
              <div className="p-4 md:p-5 pb-2 font-medium flex items-center gap-2">
                <FilterIcon size={18} /> Daftar Kelas
              </div>

              <div className="px-4 md:px-5 pb-4">
                {rows.length === 0 ? (
                  <div
                    className="py-8 text-center"
                    style={{ color: palette.black2 }}
                  >
                    Tidak ada data kelas.
                  </div>
                ) : (
                  // responsive: 1 / 2 kolom
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {rows.map((r) => (
                      <ActiveClassCard key={r.id} r={r} palette={palette} />
                    ))}
                  </div>
                )}

                <div className="pt-3 text-sm" style={{ color: palette.black2 }}>
                  Menampilkan {rows.length} kelas
                </div>
              </div>
            </SectionCard>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SchoolActiveClass;