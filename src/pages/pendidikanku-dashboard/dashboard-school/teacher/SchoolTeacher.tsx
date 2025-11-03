// src/pages/sekolahislamku/dashboard-school/SchoolTeacher.tsx

import { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import type { AxiosError } from "axios";

import { pickTheme, type ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  Badge,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import {
  UserPlus,
  ChevronRight,
  Upload,
  AlertTriangle,
  Mail,
  Phone,
  ArrowLeft,
} from "lucide-react";

/* DataViewKit */
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

import TambahGuru from "./components/CSchoolAddTeacher";
import UploadFileGuru from "./components/CSchoolUploadFileTeacher";
import { useTopBar } from "../../components/home/CUseTopBar";

/* ================= Types (API) ================= */
export interface TeacherApiRow {
  school_teacher_id: string;
  school_teacher_school_id: string;
  school_teacher_user_teacher_id: string;

  school_teacher_code: string | null;
  school_teacher_slug: string | null;

  school_teacher_employment: "tetap" | "honor" | string;
  school_teacher_is_active: boolean;
  school_teacher_joined_at: string | null;
  school_teacher_left_at: string | null;
  school_teacher_is_verified: boolean;
  school_teacher_verified_at: string | null;
  school_teacher_is_public: boolean;
  school_teacher_notes: string | null;

  school_teacher_user_teacher_name_snapshot: string | null;
  school_teacher_user_teacher_avatar_url_snapshot: string | null;
  school_teacher_user_teacher_whatsapp_url_snapshot: string | null;
  school_teacher_user_teacher_title_prefix_snapshot: string | null;
  school_teacher_user_teacher_title_suffix_snapshot: string | null;

  school_teacher_school_name_snapshot: string | null;
  school_teacher_school_slug_snapshot: string | null;

  school_teacher_sections: any[] | string;
  school_teacher_csst: any[] | string;

  school_teacher_created_at: string;
  school_teacher_updated_at: string;
  school_teacher_deleted_at: string | null;
}

type PublicTeachersResponse = {
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  data: TeacherApiRow[];
};

/* ================= Types (UI) ================= */
export interface TeacherItem {
  id: string;
  code?: string | null;
  slug?: string | null;

  name: string;
  avatarUrl?: string | null;
  phone?: string;
  subject?: string;

  employment?: string;
  isActive: boolean;
  isPublic: boolean;
  isVerified: boolean;

  joinedAt?: string | null;
  leftAt?: string | null;

  nip?: string;
  gender?: "L" | "P";
  email?: string;
}

type SchoolTeacherProps = {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
};

/* ================= Helpers ================= */
const genderLabel = (gender?: "L" | "P"): string =>
  gender === "L" ? "Laki-laki" : gender === "P" ? "Perempuan" : "-";

const buildTeacherName = (
  prefix?: string | null,
  name?: string | null,
  suffix?: string | null
) => {
  const parts = [prefix, name, suffix].filter(Boolean) as string[];
  const s = parts.join(" ").trim();
  return s.length ? s : "Tanpa Nama";
};

function safeParseArray(v: unknown): any[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
function parsePhoneFromWa(wa?: string | null) {
  if (!wa) return undefined;
  try {
    const u = new URL(wa);
    const raw = u.pathname.replace("/", "");
    return raw.startsWith("62") ? `0${raw.slice(2)}` : raw;
  } catch {
    return undefined;
  }
}

/* ================= Slug/school Hook ================= */
// ✅ :schoolId konsisten dengan IndexRoute & SchoolRoutes
function useSchoolPath() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const base = schoolId ?? "";
  const makePath = (path: string) => `/${base}/sekolah/${path}`;
  return { base, makePath, schoolId: base };
}

/* ================= UI Bits ================= */
const PageHeader = ({
  palette,
  onImportClick,
  onAddClick,
  onBackClick,
  rightExtras,
}: {
  palette: Palette;
  onImportClick: () => void;
  onAddClick: () => void;
  onBackClick?: () => void;
  rightExtras?: React.ReactNode;
}) => (
  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
    <div className="hidden md:flex items-center gap-2 flex-1">
      {onBackClick && (
        <Btn
          palette={palette}
          variant="ghost"
          onClick={onBackClick}
          className="items-center gap-1.5"
        >
          <ArrowLeft size={20} />
        </Btn>
      )}
      <h1 className="text-lg font-semibold">Guru</h1>
    </div>

    <div className="flex items-center gap-2 flex-wrap">
      {rightExtras}
      <Btn
        onClick={onImportClick}
        className="flex items-center gap-1.5 text-xs sm:text-sm"
        size="sm"
        palette={palette}
        variant="outline"
      >
        <Upload size={14} />
        <span className="hidden sm:inline">Import CSV</span>
        <span className="sm:hidden">Import</span>
      </Btn>

      <Btn
        variant="default"
        className="flex items-center gap-1.5 text-xs sm:text-sm"
        size="sm"
        palette={palette}
        onClick={onAddClick}
      >
        <UserPlus size={14} />
        <span className="hidden sm:inline">Tambah Guru</span>
        <span className="sm:hidden">Tambah</span>
      </Btn>
    </div>
  </div>
);

/* ==== Kartu (mobile) ==== */
function TeacherCardMobile({
  teacher,
  palette,
}: {
  teacher: TeacherItem;
  palette: Palette;
}) {
  const { makePath } = useSchoolPath();
  return (
    <div
      className="rounded-2xl border p-4 space-y-3"
      style={{ borderColor: palette.silver1, background: palette.white1 }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium min-w-0 truncate">{teacher.name}</div>
        <Badge
          palette={palette}
          variant={teacher.isActive ? "success" : "outline"}
        >
          {teacher.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      </div>

      <div className="text-xs opacity-70">{teacher.subject ?? "-"}</div>

      <div className="text-sm space-y-1">
        <div>
          <span className="opacity-70">NIP: </span>
          {teacher.nip ?? "-"}
        </div>
        <div>
          <span className="opacity-70">Gender: </span>
          {genderLabel(teacher.gender)}
        </div>
        <div className="flex gap-3 mt-1">
          {teacher.phone && (
            <a
              href={`tel:${teacher.phone}`}
              className="flex items-center gap-1 text-sm hover:underline"
              style={{ color: palette.primary }}
            >
              <Phone size={14} /> {teacher.phone}
            </a>
          )}
          {teacher.email && (
            <a
              href={`mailto:${teacher.email}`}
              className="flex items-center gap-1 text-sm hover:underline"
              style={{ color: palette.primary }}
            >
              <Mail size={14} /> Email
            </a>
          )}
        </div>
      </div>

      <div className="pt-1 flex justify-end">
        <NavLink to={makePath(`guru/${teacher.id}`)}>
          <Btn size="sm" palette={palette} className="gap-1">
            Detail <ChevronRight size={14} />
          </Btn>
        </NavLink>
      </div>
    </div>
  );
}

/* ================= Main Component ================= */
const SchoolTeacher: React.FC<SchoolTeacherProps> = ({ showBack = false }) => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

    const { setTopBar, resetTopBar } = useTopBar();
    useEffect(() => {
      setTopBar({ mode: "back", title: "Guru" });
      return resetTopBar;
    }, [setTopBar, resetTopBar]);

  // ✅ Ambil :schoolId dari PATH: /:schoolId/sekolah/...
  const { schoolId } = useParams<{ schoolId: string }>();

  const [openAdd, setOpenAdd] = useState(false);
  const [openImport, setOpenImport] = useState(false);

  // 🔎 Search sinkron ke ?q=
  const { q, setQ } = useSearchQuery("q");

  if (!schoolId) {
    return (
      <div className="p-4">
        <p className="text-sm">
          <b>schoolId</b> tidak ditemukan di path. Pastikan URL seperti:
          <code className="ml-1">/SCHOOL_ID/sekolah/menu-utama/guru</code>
        </p>
      </div>
    );
  }

  /* ================= React Query: PUBLIC list ================= */
  const {
    data: resp,
    isLoading,
    isError,
    refetch,
    isFetching,
    error,
  } = useQuery<PublicTeachersResponse, AxiosError>({
    queryKey: ["public-school-teachers", schoolId],
    enabled: Boolean(schoolId),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    queryFn: async () => {
      // Server belum support search/pagination? — ambil bulk lalu paginate di client
      const res = await axios.get<PublicTeachersResponse>(
        `/public/${schoolId}/school-teachers/list`,
        { params: { page: 1, per_page: 999 } }
      );
      return res.data;
    },
  });

  const errorMessage =
    (error?.response?.data as any)?.message ||
    (typeof error?.response?.data === "string"
      ? (error?.response?.data as string)
      : error?.message);

  /* ================= Mapping API -> UI ================= */
  const allTeachers: TeacherItem[] = useMemo(() => {
    const rows = resp?.data ?? [];
    return rows.map((t) => {
      const csstArr = safeParseArray(t.school_teacher_csst);
      const subject =
        csstArr?.[0]?.class_subject_name_snapshot ??
        csstArr?.[0]?.subject_name_snapshot ??
        "Umum";

      return {
        id: t.school_teacher_id,
        code: t.school_teacher_code,
        slug: t.school_teacher_slug,
        name: buildTeacherName(
          t.school_teacher_user_teacher_title_prefix_snapshot,
          t.school_teacher_user_teacher_name_snapshot,
          t.school_teacher_user_teacher_title_suffix_snapshot
        ),
        avatarUrl: t.school_teacher_user_teacher_avatar_url_snapshot,
        phone: parsePhoneFromWa(
          t.school_teacher_user_teacher_whatsapp_url_snapshot
        ),
        subject,
        employment: t.school_teacher_employment,
        isActive: t.school_teacher_is_active,
        isPublic: t.school_teacher_is_public,
        isVerified: t.school_teacher_is_verified,
        joinedAt: t.school_teacher_joined_at,
        leftAt: t.school_teacher_left_at,
      } as TeacherItem;
    });
  }, [resp]);

  /* ==== Filter by q (client) ==== */
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return allTeachers;
    return allTeachers.filter(
      (t) =>
        t.name.toLowerCase().includes(needle) ||
        (t.nip ?? "").toLowerCase().includes(needle) ||
        (t.email ?? "").toLowerCase().includes(needle)
    );
  }, [allTeachers, q]);

  /* ==== Pagination (client) ==== */
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

  /* ==== Kolom: DataTable (desktop) ==== */
  const columns: Column<TeacherItem>[] = useMemo(
    () => [
      { key: "nip", header: "NIP", cell: (t) => t.nip ?? "-" },
      {
        key: "name",
        header: "Nama",
        cell: (t) => (
          <div className="min-w-0">
            <div className="font-medium">{t.name}</div>
            <div className="text-xs opacity-70">
              {t.employment ?? "-"} • {t.isActive ? "Aktif" : "Nonaktif"}
              {t.isVerified ? " • Terverifikasi" : ""}
            </div>
          </div>
        ),
      },
      { key: "subject", header: "Mapel", cell: (t) => t.subject ?? "-" },
      { key: "gender", header: "Gender", cell: (t) => genderLabel(t.gender) },
      {
        key: "contact",
        header: "Kontak",
        cell: (t) => (
          <div className="flex items-center gap-3 text-sm">
            {t.phone && (
              <a
                href={`tel:${t.phone}`}
                className="flex items-center gap-1 hover:underline"
                style={{ color: palette.primary }}
              >
                <Phone size={14} /> {t.phone}
              </a>
            )}
            {t.email && (
              <a
                href={`mailto:${t.email}`}
                className="flex items-center gap-1 hover:underline"
                style={{ color: palette.primary }}
              >
                <Mail size={14} /> Email
              </a>
            )}
          </div>
        ),
      },
      {
        key: "aksi",
        header: "Aksi",
        cell: (t) => {
          const { makePath } = useSchoolPath();
          return (
            <div className="flex items-center justify-end">
              <NavLink to={makePath(`guru/${t.id}`)}>
                <Btn
                  size="sm"
                  palette={palette}
                  variant="quaternary"
                  className="flex items-center gap-1"
                >
                  Detail <ChevronRight size={14} />
                </Btn>
              </NavLink>
            </div>
          );
        },
        className: "text-right",
      },
    ],
    [palette]
  );

  const handleOpenAdd = useCallback(() => setOpenAdd(true), []);
  const handleOpenImport = useCallback(() => setOpenImport(true), []);

  return (
    <div
      className="w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* Modals */}
      <TambahGuru
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        palette={palette}
        subjects={[
          "Matematika",
          "Bahasa Indonesia",
          "Bahasa Inggris",
          "IPA",
          "IPS",
          "Agama",
        ]}
        schoolId={schoolId}
        onCreated={() => refetch()}
      />
      <UploadFileGuru
        open={openImport}
        onClose={() => setOpenImport(false)}
        palette={palette}
      />

      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
          <section className="flex-1 flex flex-col space-y-6 min-w-0">
            {/* ===== Header + Search ===== */}
            <PageHeader
              palette={palette}
              onImportClick={handleOpenImport}
              onAddClick={handleOpenAdd}
              onBackClick={showBack ? () => navigate(-1) : undefined}
              rightExtras={
                <div className="w-full md:w-80">
                  <SearchBar
                    palette={palette}
                    value={q}
                    onChange={setQ}
                    placeholder="Cari nama, NIP, email…"
                    debounceMs={500}
                    rightExtra={
                      <PerPageSelect
                        palette={palette}
                        value={limit}
                        onChange={setLimit}
                      />
                    }
                  />
                </div>
              }
            />

            {/* ===== Body ===== */}
            <SectionCard palette={palette}>
              <div className="p-4 md:p-5 pb-2 flex items-center justify-between">
                <div className="font-medium">Daftar Guru</div>
                <div className="text-sm" style={{ color: palette.black2 }}>
                  {isFetching ? "memuat…" : `${total} total`}
                </div>
              </div>

              <div className="p-4 md:p-5">
                {isLoading ? (
                  <div className="text-sm opacity-70">Memuat data…</div>
                ) : isError ? (
                  <div
                    className="rounded-xl border p-4 text-sm"
                    style={{ borderColor: palette.silver1 }}
                  >
                    <div style={{ color: palette.warning1 }}>
                      <AlertTriangle size={16} className="inline mr-1" />
                      Terjadi kesalahan.
                    </div>
                    {errorMessage && (
                      <pre className="text-xs opacity-70 mt-2 overflow-auto">
                        {errorMessage}
                      </pre>
                    )}
                    <Btn
                      palette={palette}
                      size="sm"
                      className="mt-3"
                      onClick={() => refetch()}
                    >
                      Coba lagi
                    </Btn>
                  </div>
                ) : total === 0 ? (
                  <div className="py-6 text-sm opacity-70">
                    Belum ada data guru.
                  </div>
                ) : (
                  <>
                    {/* Mobile: Cards */}
                    <div className="md:hidden">
                      <CardGrid<TeacherItem>
                        items={pageItems}
                        renderItem={(t) => (
                          <TeacherCardMobile
                            key={t.id}
                            teacher={t}
                            palette={palette}
                          />
                        )}
                      />
                    </div>

                    {/* Desktop: Table */}
                    <div className="hidden md:block">
                      <DataTable<TeacherItem>
                        palette={palette}
                        columns={columns}
                        rows={pageItems}
                        minWidth={980}
                      />
                    </div>

                    {/* Footer Pagination */}
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
                          {isFetching ? "memuat…" : `${total} total`}
                        </span>
                      }
                    />
                  </>
                )}
              </div>
            </SectionCard>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SchoolTeacher;