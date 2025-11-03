// src/pages/sekolahislamku/students/StudentsPage.tsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  Badge,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import {
  SearchBar,
  PerPageSelect,
  PaginationBar,
  DataTable,
  type Column,
  CardGrid,
  useSearchQuery,
  useOffsetLimit,
} from "@/pages/pendidikanku-dashboard/components/common/CDataViewKit";
import {
  UserPlus,
  Upload,
  Eye,
  Edit3,
  Trash2,
  ArrowLeft,
  Users,
  Link as LinkIcon,
  Info,
  Loader2,
} from "lucide-react";
import TambahSiswa from "./modal/SchoolAddStudent";
import UploadFileSiswa from "./modal/SchoolUploadFileStudent";
import { useTopBar } from "@/pages/pendidikanku-dashboard/components/home/CUseTopBar";

export interface StudentItem {
  id: string;
  nis?: string;
  name: string;
  class_name?: string;
  gender?: "L" | "P";
  parent_name?: string;
  phone?: string;
  email?: string;
  status: "aktif" | "nonaktif" | "alumni";
}

const DUMMY_STUDENTS: StudentItem[] = [
  {
    id: "s1",
    nis: "202301",
    name: "Ahmad Fauzi",
    class_name: "1A",
    gender: "L",
    parent_name: "Bapak Fauzan",
    phone: "081234567890",
    email: "ahmad.fauzi@example.com",
    status: "aktif",
  },
  {
    id: "s2",
    nis: "202302",
    name: "Siti Nurhaliza",
    class_name: "1B",
    gender: "P",
    parent_name: "Ibu Rahma",
    phone: "081298765432",
    email: "siti.nurhaliza@example.com",
    status: "aktif",
  },
];

const StudentsPage: React.FC = () => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  const { setTopBar, resetTopBar } = useTopBar();
    useEffect(() => {
      setTopBar({ mode: "back", title: "Data Siswa" });
      return resetTopBar;
    }, [setTopBar, resetTopBar]);

  const [students, setStudents] = useState<StudentItem[]>(DUMMY_STUDENTS);
  const [openAdd, setOpenAdd] = useState(false);
  const [openImport, setOpenImport] = useState(false);

  /* 🔎 Search bar integration (sinkron dengan ?q=) */
  const { q, setQ } = useSearchQuery("q");

  /* Filtered result */
  const filtered = useMemo(() => {
    const s = (q || "").toLowerCase().trim();
    if (!s) return students;
    return students.filter(
      (x) =>
        x.name.toLowerCase().includes(s) ||
        (x.class_name ?? "").toLowerCase().includes(s) ||
        (x.nis ?? "").toLowerCase().includes(s)
    );
  }, [students, q]);

  /* Pagination (20 per halaman default) */
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
  } = useOffsetLimit(total, 20, 200);
  const pageItems = useMemo(
    () => filtered.slice(offset, Math.min(offset + limit, total)),
    [filtered, offset, limit, total]
  );

  /* Table Columns */
  const columns: Column<StudentItem>[] = useMemo(
    () => [
      { key: "nis", header: "NIS", cell: (r) => r.nis ?? "-" },
      { key: "name", header: "Nama", cell: (r) => r.name },
      { key: "class_name", header: "Kelas", cell: (r) => r.class_name ?? "-" },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <Badge
            palette={palette}
            variant={
              r.status === "aktif"
                ? "success"
                : r.status === "nonaktif"
                ? "warning"
                : "info"
            }
          >
            {r.status}
          </Badge>
        ),
      },
      {
        key: "aksi",
        header: "Aksi",
        cell: (r) => (
          <div className="flex items-center gap-2 justify-end">
            <Btn
              size="sm"
              variant="ghost"
              palette={palette}
              onClick={() => alert(`Detail siswa: ${r.name}`)}
            >
              <Eye size={16} />
            </Btn>
            <Btn
              size="sm"
              variant="ghost"
              palette={palette}
              onClick={() => alert(`Edit siswa: ${r.name}`)}
            >
              <Edit3 size={16} />
            </Btn>
            <Btn
              size="sm"
              variant="ghost"
              palette={palette}
              onClick={() => {
                if (confirm(`Hapus siswa ${r.name}?`))
                  setStudents((prev) => prev.filter((x) => x.id !== r.id));
              }}
            >
              <Trash2 size={16} />
            </Btn>
          </div>
        ),
      },
    ],
    [palette]
  );

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* ===== Header ===== */}
      <div
        className="p-4 md:p-5 pb-3  flex flex-wrap items-center gap-3"
       
      >
        <div className="hidden md:flex items-center gap-2 font-semibold order-1">
          <Btn
            palette={palette}
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
          </Btn>
          <h1>Data Siswa</h1>
        </div>

        {/* SearchBar + PerPageSelect */}
        <div className="order-3 sm:order-2 w-full sm:w-auto flex-1 min-w-0">
          <SearchBar
            palette={palette}
            value={q}
            onChange={setQ}
            placeholder="Cari siswa, kelas, atau NIS…"
            debounceMs={400}
            rightExtra={
              <PerPageSelect
                palette={palette}
                value={limit}
                onChange={(n) => setLimit(n)}
              />
            }
          />
        </div>

      </div>
      {/* Tombol Tambah & Import */}
        <div className="order-2 sm:order-3 ml-auto flex items-center gap-2">
          <Btn
            palette={palette}
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() => setOpenImport(true)}
          >
            <Upload size={14} /> Import
          </Btn>
          <Btn
            palette={palette}
            size="sm"
            className="gap-1"
            onClick={() => setOpenAdd(true)}
          >
            <UserPlus size={14} /> Tambah
          </Btn>
        </div>

      {/* ===== Body ===== */}
      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6 mt-2 md:p-2">
          <SectionCard palette={palette}>
            <div
              className="p-4 md:p-5 pb-3 border-b flex items-center justify-between gap-2"
              style={{ borderColor: palette.silver1 }}
            >
              <div className="flex items-center gap-2 font-semibold">
                <Users size={18} color={palette.quaternary} /> Daftar Siswa
              </div>
              <div className="text-sm" style={{ color: palette.black2 }}>
                {total} total
              </div>
            </div>

            <div className="p-4 md:p-5">
              {students.length === 0 ? (
                <div
                  className="rounded-xl border p-4 text-sm flex items-center gap-2"
                  style={{
                    borderColor: palette.silver1,
                    color: palette.silver2,
                  }}
                >
                  <Info size={16} /> Belum ada data siswa.
                </div>
              ) : (
                <>
                  {/* Mobile Cards */}
                  <div className="md:hidden">
                    <CardGrid<StudentItem>
                      items={pageItems}
                      renderItem={(s) => (
                        <div
                          key={s.id}
                          className="rounded-2xl border p-4 space-y-2"
                          style={{
                            borderColor: palette.silver1,
                            background: palette.white1,
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold">{s.name}</div>
                              <div
                                className="text-sm opacity-80"
                                style={{ color: palette.black2 }}
                              >
                                NIS {s.nis ?? "-"} • Kelas {s.class_name ?? "-"}
                              </div>
                            </div>
                            <Badge
                              palette={palette}
                              variant={
                                s.status === "aktif"
                                  ? "success"
                                  : s.status === "nonaktif"
                                  ? "warning"
                                  : "info"
                              }
                            >
                              {s.status}
                            </Badge>
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <Btn
                              size="sm"
                              variant="ghost"
                              palette={palette}
                              onClick={() => alert(`Detail: ${s.name}`)}
                            >
                              <Eye size={16} />
                            </Btn>
                            <Btn
                              size="sm"
                              variant="ghost"
                              palette={palette}
                              onClick={() => alert(`Edit: ${s.name}`)}
                            >
                              <Edit3 size={16} />
                            </Btn>
                            <Btn
                              size="sm"
                              variant="ghost"
                              palette={palette}
                              onClick={() => {
                                if (confirm(`Hapus ${s.name}?`))
                                  setStudents((prev) =>
                                    prev.filter((x) => x.id !== s.id)
                                  );
                              }}
                            >
                              <Trash2 size={16} />
                            </Btn>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <DataTable<StudentItem>
                      palette={palette}
                      columns={columns}
                      rows={pageItems}
                      minWidth={840}
                    />
                  </div>

                  <PaginationBar
                    palette={palette}
                    pageStart={pageStart}
                    pageEnd={pageEnd}
                    total={total}
                    canPrev={canPrev}
                    canNext={canNext}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    rightExtra={
                      <span
                        className="text-sm"
                        style={{ color: palette.black2 }}
                      >
                        {total} total
                      </span>
                    }
                  />
                </>
              )}
            </div>
          </SectionCard>
        </div>
      </main>

      {/* Modals */}
      <TambahSiswa
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        palette={palette}
        classes={["1A", "1B", "2A"]}
      />
      <UploadFileSiswa
        open={openImport}
        onClose={() => setOpenImport(false)}
        palette={palette}
      />
    </div>
  );
};

export default StudentsPage;
