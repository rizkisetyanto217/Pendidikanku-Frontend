// src/pages/sekolahislamku/dashboard-school/TeachersPage.tsx

/* ================= Imports ================= */
import { useMemo, useState, useCallback } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import type { AxiosError } from "axios";

import { pickTheme, type ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
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

import TambahGuru from "./components/CSchoolAddTeacher";
import UploadFileGuru from "./components/CSchoolUploadFileTeacher";

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

  // bisa array asli atau string "[]"
  school_teacher_sections: any[] | string;
  school_teacher_csst: any[] | string;

  school_teacher_created_at: string;
  school_teacher_updated_at: string;
  school_teacher_deleted_at: string | null;
}

type PublicTeachersResponse = {
  pagination: {
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

  name: string; // prefix + name + suffix
  avatarUrl?: string | null;
  phone?: string;
  subject?: string;

  employment?: string;
  isActive: boolean;
  isPublic: boolean;
  isVerified: boolean;

  joinedAt?: string | null;
  leftAt?: string | null;

  // opsional untuk filter tampilan
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
function useSchoolPath() {
  const { school_id } = useParams<{ school_id?: string }>();
  const base = school_id ?? "";
  const makePath = (path: string) => `/${base}/sekolah/${path}`;
  return { base, makePath, school_id: base };
}

/* ================= UI Bits ================= */
const PageHeader = ({
  palette,
  onImportClick,
  onAddClick,
  onBackClick,
}: {
  palette: Palette;
  onImportClick: () => void;
  onAddClick: () => void;
  onBackClick?: () => void;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
    <div className="flex items-center gap-3 md:mt-0">
      {onBackClick && (
        <Btn
          palette={palette}
          variant="ghost"
          onClick={onBackClick}
          className="items-center gap-1.5 md:mt-0 hidden md:block"
        >
          <ArrowLeft size={20} />
        </Btn>
      )}
      <h1 className="text-lg font-semibold hidden md:block">Guru</h1>
    </div>

    <div className="flex items-center gap-2 flex-wrap -mt-3 md:-mt-0">
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
      className="border rounded-lg p-4 space-y-3"
      style={{ borderColor: palette.silver1 }}
    >
      <div className="font-medium">{teacher.name}</div>
      <div className="text-xs opacity-70">{teacher.subject ?? "-"}</div>

      <div className="text-sm space-y-1">
        <div>
          <span className="text-gray-600">NIP: </span>
          {teacher.nip ?? "-"}
        </div>
        <div>
          <span className="text-gray-600">Gender: </span>
          {genderLabel(teacher.gender)}
        </div>
        <div>
          <span className="text-gray-600">Kontak: </span>
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
      </div>

      <div
        className="flex gap-2 pt-2 border-t"
        style={{ borderColor: palette.silver1 }}
      >
        <NavLink
          to={makePath(`guru/${teacher.id}`)}
          className="underline text-sm"
          style={{ color: palette.primary }}
        >
          Detail
        </NavLink>
      </div>
    </div>
  );
}

const TeacherTableRow = ({
  teacher,
  palette,
}: {
  teacher: TeacherItem;
  palette: Palette;
}) => {
  const { makePath } = useSchoolPath();
  return (
    <tr
      className="border-t hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      style={{ borderColor: palette.silver1 }}
    >
      <td className="py-3 px-5">{teacher.nip ?? "-"}</td>
      <td className="py-3">
        <div className="font-medium">{teacher.name}</div>
        <div className="text-xs opacity-70">
          {teacher.employment ?? "-"} •{" "}
          {teacher.isActive ? "Aktif" : "Nonaktif"}
          {teacher.isVerified ? " • Terverifikasi" : ""}
        </div>
      </td>
      <td className="py-3">{teacher.subject ?? "-"}</td>
      <td className="py-3">{genderLabel(teacher.gender)}</td>
      <td className="py-3">
        <div className="flex items-center gap-3 text-sm">
          {teacher.phone && (
            <a
              href={`tel:${teacher.phone}`}
              className="flex items-center gap-1 hover:underline"
              style={{ color: palette.primary }}
            >
              <Phone size={14} /> {teacher.phone}
            </a>
          )}
          {teacher.email && (
            <a
              href={`mailto:${teacher.email}`}
              className="flex items-center gap-1 hover:underline"
              style={{ color: palette.primary }}
            >
              <Mail size={14} /> Email
            </a>
          )}
        </div>
      </td>
      <td className="py-3 text-right">
        <div className="flex items-center gap-2 justify-end mr-3">
          <NavLink to={makePath(`guru/${teacher.id}`)}>
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
      </td>
    </tr>
  );
};

const TeachersTable = ({
  palette,
  teachers,
  isLoading,
  isError,
  isFetching,
  onRefetch,
  errorMessage,
}: {
  palette: Palette;
  teachers: TeacherItem[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRefetch: () => void;
  errorMessage?: string;
}) => (
  <SectionCard palette={palette} className="p-0">
    {/* Mobile */}
    <div className="block md:hidden p-4 space-y-3">
      {isLoading && <div className="text-center text-sm">Memuat data…</div>}
      {isError && (
        <div
          className="text-center text-sm"
          style={{ color: palette.warning1 }}
        >
          <AlertTriangle size={16} className="inline mr-1" /> Terjadi kesalahan.
          {errorMessage ? (
            <span className="ml-1">({errorMessage})</span>
          ) : null}{" "}
          <button className="underline ml-1" onClick={onRefetch}>
            Coba lagi
          </button>
        </div>
      )}
      {!isLoading && !isError && teachers.length === 0 && (
        <div className="text-center text-sm opacity-70">
          Belum ada data guru.
        </div>
      )}
      {!isLoading &&
        !isError &&
        teachers.map((t) => (
          <TeacherCardMobile key={t.id} teacher={t} palette={palette} />
        ))}
    </div>

    {/* Desktop */}
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr
            className="text-left border-b"
            style={{ color: palette.black2, borderColor: palette.silver1 }}
          >
            <th className="py-3 px-5">NIP</th>
            <th>Nama</th>
            <th>Mapel</th>
            <th>Gender</th>
            <th>Kontak</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={6} className="py-8 text-center opacity-70">
                Memuat data…
              </td>
            </tr>
          )}
          {isError && (
            <tr>
              <td
                colSpan={6}
                className="py-8 text-center"
                style={{ color: palette.warning1 }}
              >
                <AlertTriangle size={16} className="inline mr-1" /> Terjadi
                kesalahan.
                {errorMessage ? (
                  <span className="ml-1">({errorMessage})</span>
                ) : null}
              </td>
            </tr>
          )}
          {!isLoading && !isError && teachers.length === 0 && (
            <tr>
              <td colSpan={6} className="py-10 text-center opacity-70">
                Belum ada data guru.
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            teachers.map((t) => (
              <TeacherTableRow key={t.id} teacher={t} palette={palette} />
            ))}
        </tbody>
      </table>
    </div>

    <div
      className="p-3 text-sm flex items-center justify-between border-t"
      style={{ color: palette.black2, borderColor: palette.silver1 }}
    >
      <div>
        {isFetching ? "Memuat ulang…" : `Menampilkan ${teachers.length} data`}
      </div>
      <button className="underline" onClick={onRefetch}>
        Refresh
      </button>
    </div>
  </SectionCard>
);

/* ================= Main Component ================= */
const SchoolTeacher: React.FC<SchoolTeacherProps> = ({ showBack = false }) => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  // Ambil school_id dari PATH: /:school_id/sekolah/menu-utama/guru
  const { school_id: schoolIdParam } = useParams<{ school_id?: string }>();
  const schoolId = schoolIdParam ?? "";

  const [openAdd, setOpenAdd] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [q, setQ] = useState("");

  // Early return: path belum benar
  if (!schoolId) {
    return (
      <div className="p-4">
        <p className="text-sm">
          <b>school_id</b> tidak ditemukan di path. Pastikan URL seperti:
          <code className="ml-1">/school_ID/sekolah/menu-utama/guru</code>
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
    enabled: true,
    staleTime: 2 * 60 * 1000,
    retry: 1,
    queryFn: async () => {
      const res = await axios.get<PublicTeachersResponse>(
        `/public/${schoolId}/school-teachers/list`,
        { params: { page: 1, per_page: 50 } }
      );
      return res.data;
    },
  });

  const errorMessage =
    (error?.response?.data as any)?.message ||
    (typeof error?.response?.data === "string"
      ? (error?.response?.data as string)
      : error?.message);

  /* ================= Mapping: API -> UI ================= */
  const teachersFromApi: TeacherItem[] = useMemo(() => {
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

  const teachers = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return teachersFromApi;
    return teachersFromApi.filter(
      (t) =>
        t.name.toLowerCase().includes(needle) ||
        (t.nip ?? "").toLowerCase().includes(needle) ||
        (t.email ?? "").toLowerCase().includes(needle)
    );
  }, [teachersFromApi, q]);

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
            <PageHeader
              palette={palette}
              onImportClick={handleOpenImport}
              onAddClick={handleOpenAdd}
              onBackClick={showBack ? () => navigate(-1) : undefined}
            />

            {/* (Opsional) Input cari cepat */}
            <div className="flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari guru (nama, NIP, email)"
                className="w-full rounded-md border px-3 py-2 text-sm"
                style={{
                  borderColor: palette.silver1,
                  background: "transparent",
                  color: "inherit",
                }}
              />
            </div>

            <TeachersTable
              palette={palette}
              teachers={teachers}
              isLoading={isLoading}
              isError={!!isError}
              isFetching={isFetching}
              onRefetch={refetch}
              errorMessage={errorMessage}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default SchoolTeacher;
