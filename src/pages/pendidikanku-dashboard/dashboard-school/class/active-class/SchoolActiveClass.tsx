// src/pages/sekolahislamku/pages/academic/SchoolActiveClass.tsx
import React, {useEffect, useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

// Theme & utils
import {pickTheme, ThemeName} from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";

// UI primitives
import {
  SectionCard,
  Btn,
  Badge,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

// Common DataViewKit utilities
import {
  useSearchQuery,
  SearchBar,
  useOffsetLimit,
  PaginationBar,
  DataTable,
  type Column,
  CardGrid,
  PerPageSelect,
} from "@/pages/pendidikanku-dashboard/components/common/CDataViewKit";

// Icons
import {
  Users,
  GraduationCap,
  Layers,
  Filter as FilterIcon,
  ArrowLeft,
  Info,
} from "lucide-react";
import {useTopBar} from "@/pages/pendidikanku-dashboard/components/home/CUseTopBar";

/* ===================== Types & Dummy ===================== */
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

/* ===================== Card UI (Mobile) ===================== */
function ActiveClassCard({r, palette}: {r: ClassRow; palette: Palette}) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-3"
      style={{borderColor: palette.silver1, background: palette.white1}}
    >
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <div className="font-semibold text-base truncate">{r.name}</div>
          <div className="text-sm opacity-70">{r.academic_year}</div>
        </div>
        <Badge
          palette={palette}
          variant={r.status === "active" ? "success" : "outline"}
        >
          {r.status === "active" ? "Aktif" : "Nonaktif"}
        </Badge>
      </div>

      <div
        className="text-sm flex flex-col gap-1"
        style={{color: palette.black2}}
      >
        <span className="flex items-center gap-1">
          <GraduationCap size={14} /> Wali Kelas: {r.homeroom_teacher}
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} /> {r.student_count} siswa
        </span>
      </div>
    </div>
  );
}

/* ===================== Page ===================== */
const SchoolActiveClass: React.FC = () => {
  const {isDark, themeName} = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  const {setTopBar, resetTopBar} = useTopBar();
    useEffect(() => {
    setTopBar({mode: "back", title: "Daftar Kelas Aktif"});
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  // === Dummy Query ===
  const classesQ = useQuery({
    queryKey: ["active-classes"],
    queryFn: async (): Promise<ApiActiveClassResp> => {
      const dummy: ApiActiveClassResp = {
        list: Array.from({length: 18}).map((_, i) => ({
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

  /* ==== 🔎 Search ==== */
  const {q, setQ} = useSearchQuery("q");
  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.homeroom_teacher.toLowerCase().includes(s) ||
        r.academic_year.includes(s)
    );
  }, [q, rows]);

  /* ==== ⏭ Pagination ==== */
  const total = filtered.length;
  const {
    offset,
    limit,
    setLimit,
    pageStart,
    pageEnd,
    canPrev,
    canNext,
    handlePrev,
    handleNext,
  } = useOffsetLimit(total, 8, 100);

  const pageRows = filtered.slice(offset, offset + limit);

  /* ==== Columns for Desktop Table ==== */
  const columns: Column<ClassRow>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Nama Kelas",
        cell: (r) => <span className="font-medium">{r.name}</span>,
      },
      {
        key: "academic_year",
        header: "Tahun Ajaran",
        cell: (r) => r.academic_year,
      },
      {key: "teacher", header: "Wali Kelas", cell: (r) => r.homeroom_teacher},
      {
        key: "students",
        header: "Jumlah Siswa",
        cell: (r) => `${r.student_count}`,
      },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <Badge
            palette={palette}
            variant={r.status === "active" ? "success" : "outline"}
          >
            {r.status === "active" ? "Aktif" : "Nonaktif"}
          </Badge>
        ),
      },
    ],
    [palette]
  );

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{background: palette.white2, color: palette.black1}}
    >
      
      <div
        className="p-4 md:p-5 pb-3 border-b flex flex-wrap items-center gap-2"
        style={{borderColor: palette.silver1}}
      >
        <div className="md:flex hidden items-center gap-2 font-semibold order-1">
          <Btn
            palette={palette}
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          >
            <ArrowLeft size={18} />
          </Btn>
          <h1>Daftar Kelas Aktif</h1>
        </div>

        <div className="order-3 sm:order-2 w-full sm:w-auto flex-1 min-w-0">
          <SearchBar
            palette={palette}
            value={q}
            onChange={setQ}
            placeholder="Cari kelas, wali, atau tahun ajaran…"
            debounceMs={400}
            className="w-full"
            rightExtra={
              <PerPageSelect
                palette={palette}
                value={limit}
                onChange={setLimit}
              />
            }
          />
        </div>
      </div>

      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6 p-4 md:p-5">
          {/* ===== Section: Daftar Kelas ===== */}
          <SectionCard palette={palette}>
            <div
              className="p-4 md:p-5 pb-3 border-b flex items-center justify-between gap-2"
              style={{borderColor: palette.silver1}}
            >
              <div className="flex items-center gap-2 font-semibold">
                <GraduationCap size={18} color={palette.quaternary} /> Daftar
                Kelas
              </div>
              <div className="text-sm" style={{color: palette.black2}}>
                {total} total
              </div>
            </div>

            <div className="p-4 md:p-5">
              {classesQ.isLoading ? (
                <div
                  className="py-8 text-center text-sm flex items-center justify-center gap-2"
                  style={{color: palette.black2}}
                >
                  <Info size={16} /> Memuat data kelas…
                </div>
              ) : total === 0 ? (
                <div
                  className="py-8 text-center text-sm flex items-center justify-center gap-2"
                  style={{color: palette.black2}}
                >
                  <Info size={16} /> Tidak ada data kelas.
                </div>
              ) : (
                <>
                  {/* Mobile: Cards */}
                  <div className="md:hidden">
                    <CardGrid<ClassRow>
                      items={pageRows}
                      renderItem={(r) => (
                        <ActiveClassCard key={r.id} r={r} palette={palette} />
                      )}
                    />
                  </div>

                  {/* Desktop: Table */}
                  <div className="hidden md:block">
                    <DataTable<ClassRow>
                      palette={palette}
                      columns={columns}
                      rows={pageRows}
                      minWidth={840}
                    />
                  </div>

                  {/* Pagination Footer */}
                  <PaginationBar
                    palette={palette}
                    pageStart={pageStart}
                    pageEnd={pageEnd}
                    total={total}
                    canPrev={canPrev}
                    canNext={canNext}
                    onPrev={handlePrev}
                    onNext={handleNext}
                  />
                </>
              )}
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
};

export default SchoolActiveClass;
