// src/pages/pendidikanku-dashboard/dashboard-school/class/detail/SchoolManageClass.tsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName } from "@/constants/thema";
import {
  SectionCard,
  Btn,
  Badge,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MapPin,
  Layers,
  Users,
  Clock4,
  Hash,
  Link as LinkIcon,
} from "lucide-react";

/* =========================================================
   Tipe API ringkas (disamakan dengan halaman detail)
========================================================= */
type DeliveryMode = "offline" | "online" | "hybrid";
type EnrollmentMode = "self_select" | "assigned" | "invitation" | "mixed";

type ApiSchedule = {
  start?: string;
  end?: string;
  days?: string[];
  location?: string;
};

type ApiRoomSnapshot = {
  code?: string | null;
  name?: string | null;
  slug?: string | null;
  capacity?: number | null;
  location?: string | null;
  is_virtual?: boolean | null;
};

type ApiTeacherSnapshot = {
  id?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  title_prefix?: string | null;
  title_suffix?: string | null;
  whatsapp_url?: string | null;
};

type ApiBookSnapshot = {
  id?: string | null;
  slug?: string | null;
  title?: string | null;
  author?: string | null;
  image_url?: string | null;
};

type ApiSubjectSnapshot = {
  id?: string | null;
  url?: string | null;
  code?: string | null;
  name?: string | null;
  slug?: string | null;
};

type ApiCSSTItem = {
  class_section_subject_teacher_id: string;
  class_section_subject_teacher_school_id: string;
  class_section_subject_teacher_section_id: string;
  class_section_subject_teacher_class_subject_book_id: string | null;

  class_section_subject_teacher_teacher_id?: string | null;
  class_section_subject_teacher_name?: string | null;
  class_section_subject_teacher_slug?: string | null;
  class_section_subject_teacher_room_id?: string | null;

  class_section_subject_teacher_total_attendance?: number;
  class_section_subject_teacher_enrolled_count?: number;
  class_section_subject_teacher_delivery_mode?: DeliveryMode;

  class_section_subject_teacher_room_snapshot?: ApiRoomSnapshot | null;
  class_section_subject_teacher_room_name_snap?: string | null;
  class_section_subject_teacher_room_slug_snap?: string | null;
  class_section_subject_teacher_room_location_snap?: string | null;

  class_section_subject_teacher_teacher_snapshot?: ApiTeacherSnapshot | null;
  class_section_subject_teacher_teacher_name_snap?: string | null;

  class_section_subject_teacher_class_subject_book_snapshot?: {
    book?: ApiBookSnapshot | null;
    subject?: ApiSubjectSnapshot | null;
  } | null;

  class_section_subject_teacher_book_title_snap?: string | null;
  class_section_subject_teacher_book_author_snap?: string | null;
  class_section_subject_teacher_book_slug_snap?: string | null;
  class_section_subject_teacher_book_image_url_snap?: string | null;

  class_section_subject_teacher_subject_name_snap?: string | null;
  class_section_subject_teacher_subject_code_snap?: string | null;
  class_section_subject_teacher_subject_slug_snap?: string | null;

  class_section_subject_teacher_is_active?: boolean;
  class_section_subject_teacher_created_at?: string;
  class_section_subject_teacher_updated_at?: string;
  class_section_subject_teacher_deleted_at?: string | null;
};

type ApiClassSection = {
  class_section_id: string;
  class_section_school_id: string;
  class_section_class_id: string;

  class_section_teacher_id?: string | null;
  class_section_class_room_id?: string | null;

  class_section_slug: string;
  class_section_name: string;
  class_section_code?: string | null;

  class_section_schedule?: ApiSchedule | null;

  class_section_capacity?: number | null;
  class_section_total_students?: number | null;

  class_section_group_url?: string | null;

  class_section_is_active: boolean;
  class_section_created_at: string;
  class_section_updated_at: string;

  class_section_class_slug_snap?: string | null;

  class_section_parent_name_snap?: string | null;
  class_section_parent_code_snap?: string | null;
  class_section_parent_slug_snap?: string | null;
  class_section_parent_level_snap?: string | null;

  class_section_room_name_snap?: string | null;
  class_section_room_slug_snap?: string | null;
  class_section_room_location_snap?: string | null;

  class_section_term_name_snap?: string | null;
  class_section_term_slug_snap?: string | null;
  class_section_term_year_label_snap?: string | null;

  class_section_snapshot_updated_at?: string | null;

  class_section_room_snapshot?: ApiRoomSnapshot | null;

  class_sections_csst?: ApiCSSTItem[] | [];
  class_sections_csst_count?: number;
  class_sections_csst_active_count?: number;

  class_section_csst_enrollment_mode?: EnrollmentMode;
  class_section_csst_self_select_requires_approval?: boolean;
};

type ApiIncludes = {
  csst_by_section?: Record<string, ApiCSSTItem[]>;
};

type ApiSectionListWithIncludes = {
  data: ApiClassSection[];
  includes?: ApiIncludes;
};

/* =========================================================
   Helpers
========================================================= */
const scheduleToText = (sch?: ApiSchedule | null): string => {
  if (!sch) return "-";
  const days = (sch.days ?? []).join(", ");
  const time =
    sch.start && sch.end
      ? `${sch.start}–${sch.end}`
      : sch.start || sch.end || "";
  const loc = sch.location ? ` @${sch.location}` : "";
  const left = [days, time].filter(Boolean).join(" ");
  return left ? `${left}${loc}` : "-";
};

const useSectionWithCSST = (schoolId: string, id: string) =>
  useQuery({
    queryKey: ["section-manage", schoolId, id],
    enabled: !!schoolId && !!id,
    queryFn: async () => {
      const res = await axios.get<ApiSectionListWithIncludes>(
        `/public/${schoolId}/class-sections/list`,
        { params: { id, with_csst: true } }
      );
      const section = res.data?.data?.[0];
      const csst =
        res.data?.includes?.csst_by_section?.[id] ??
        section?.class_sections_csst ??
        [];
      return { section, csst } as {
        section?: ApiClassSection;
        csst: ApiCSSTItem[];
      };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

/* =========================================================
   PAGE: Manage (ringkas Section + semua CSST)
========================================================= */
export default function SchoolSection() {
  const { schoolId = "", id = "" } = useParams<{
    schoolId: string;
    id: string;
  }>();
  const navigate = useNavigate();

  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  const { data, isLoading, isFetching } = useSectionWithCSST(schoolId, id);
  const section = data?.section;
  const csst = data?.csst ?? [];

  if (isLoading) {
    return (
      <div className="p-6 text-center" style={{ color: palette.black2 }}>
        Memuat data...
      </div>
    );
  }

  if (!section) {
    return (
      <div className="p-6 text-center" style={{ color: palette.black2 }}>
        Data section tidak ditemukan.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="max-w-screen-2xl mx-auto py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Btn
              palette={palette}
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} className="mr-1" /> Kembali
            </Btn>
            <h1 className="text-lg font-semibold">Kelola Kelas</h1>
          </div>
          <Badge
            palette={palette}
            variant={section.class_section_is_active ? "success" : "outline"}
          >
            {section.class_section_is_active ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        {/* Ringkasan Section singkat + tombol ke halaman detail penuh */}
        <SectionCard palette={palette}>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium flex items-center gap-2">
                <Layers size={18} /> Ringkasan Section
              </div>
              {/* Gunakan relative path dari /sekolah/kelas/kelola/:id -> ../section/:id */}
              <Link to={`../section/${section.class_section_id}`}>
                <Btn palette={palette} size="sm" variant="outline">
                  Lihat Detail Lengkap <ArrowRight className="ml-2" size={16} />
                </Btn>
              </Link>
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-3">
              <div
                className="rounded-xl border p-3"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                }}
              >
                <div className="text-xs opacity-70">Nama Kelas</div>
                <div className="font-semibold truncate">
                  {section.class_section_name}
                </div>
                <div className="text-xs opacity-70 truncate">
                  Kode: {section.class_section_code ?? "-"}
                </div>
              </div>

              <div
                className="rounded-xl border p-3"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                }}
              >
                <div className="text-xs opacity-70">Parent / Tingkat</div>
                <div className="font-semibold truncate">
                  {section.class_section_parent_name_snap ?? "-"}
                </div>
                <div className="text-xs opacity-70 truncate">
                  {section.class_section_parent_slug_snap ?? "-"}
                </div>
              </div>

              <div
                className="rounded-xl border p-3"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                }}
              >
                <div className="text-xs opacity-70">Ruang</div>
                <div className="font-semibold truncate">
                  {section.class_section_room_name_snap ??
                    section.class_section_room_snapshot?.name ??
                    "-"}
                </div>
                <div className="text-xs opacity-70 flex items-center gap-1 truncate">
                  <MapPin size={14} />
                  {section.class_section_room_location_snap ??
                    section.class_section_room_snapshot?.location ??
                    "-"}
                </div>
              </div>
            </div>

            <div
              className="mt-3 rounded-xl border p-3 text-sm"
              style={{
                borderColor: palette.silver1,
                background: palette.white1,
              }}
            >
              <span className="opacity-70 mr-2">Jadwal:</span>
              <span className="font-medium">
                {scheduleToText(section.class_section_schedule)}
              </span>
              {!!section.class_section_group_url && (
                <a
                  href={section.class_section_group_url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-3 underline inline-flex items-center gap-1 text-xs"
                  style={{ color: palette.primary }}
                >
                  <LinkIcon size={12} />
                  Link Grup
                </a>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Daftar CSST (mapel & pengajar) */}
        <SectionCard palette={palette}>
          <div className="p-5">
            <div className="flex items-center justify-between pb-3">
              <div className="font-medium flex items-center gap-2">
                <BookOpen size={18} /> Mata Pelajaran & Pengajar
              </div>
              <div className="text-sm" style={{ color: palette.black2 }}>
                {isFetching ? "Menyegarkan…" : ""}
              </div>
            </div>

            {csst.length === 0 ? (
              <div className="text-sm opacity-70 text-center py-4">
                Belum ada data mata pelajaran untuk kelas ini.
              </div>
            ) : (
              <div className="space-y-4">
                {csst.map((row) => {
                  const teacher =
                    row.class_section_subject_teacher_teacher_snapshot;
                  const subj =
                    row
                      .class_section_subject_teacher_class_subject_book_snapshot
                      ?.subject;
                  const book =
                    row
                      .class_section_subject_teacher_class_subject_book_snapshot
                      ?.book;
                  const room = row.class_section_subject_teacher_room_snapshot;

                  return (
                    <div
                      key={row.class_section_subject_teacher_id}
                      className="rounded-xl border p-4 space-y-3"
                      style={{
                        borderColor: palette.silver1,
                        background: palette.white1,
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="font-semibold flex items-center gap-2">
                          <Hash size={16} />
                          {subj?.name ??
                            row.class_section_subject_teacher_name ??
                            "-"}
                        </div>
                        <Badge
                          palette={palette}
                          variant={
                            row.class_section_subject_teacher_is_active
                              ? "success"
                              : "outline"
                          }
                        >
                          {row.class_section_subject_teacher_is_active
                            ? "Aktif"
                            : "Nonaktif"}
                        </Badge>
                      </div>

                      {/* Meta */}
                      <div className="grid md:grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>
                            Pengajar:{" "}
                            {teacher
                              ? `${teacher.title_prefix ?? ""} ${teacher.name ?? ""} ${teacher.title_suffix ?? ""}`.trim()
                              : (row.class_section_subject_teacher_teacher_name_snap ??
                                "-")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>
                            Ruang:{" "}
                            {room?.name ??
                              row.class_section_subject_teacher_room_name_snap ??
                              "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock4 size={14} />
                          <span>
                            Mode:{" "}
                            {row.class_section_subject_teacher_delivery_mode ??
                              "-"}
                          </span>
                        </div>
                      </div>

                      {/* Buku (jika ada) */}
                      {book && (
                        <div
                          className="flex items-center gap-3 text-sm"
                          style={{ color: palette.black2 }}
                        >
                          {book.image_url ? (
                            <img
                              src={book.image_url}
                              alt={book.title ?? "Book cover"}
                              className="w-12 h-16 object-cover rounded-md border"
                              style={{ borderColor: palette.silver1 }}
                            />
                          ) : null}
                          <div>
                            <div className="font-medium">
                              {book.title ?? "-"}
                            </div>
                            <div className="text-xs">
                              Penulis: {book.author ?? "-"}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Counts & timestamps */}
                      <div
                        className="grid sm:grid-cols-3 gap-2 text-xs opacity-70"
                        style={{ color: palette.black2 }}
                      >
                        <div>
                          Enrolled:{" "}
                          {row.class_section_subject_teacher_enrolled_count ??
                            0}
                        </div>
                        <div>
                          Total Attendance:{" "}
                          {row.class_section_subject_teacher_total_attendance ??
                            0}
                        </div>
                        <div>
                          Dibuat:{" "}
                          {row.class_section_subject_teacher_created_at
                            ? new Date(
                                row.class_section_subject_teacher_created_at
                              ).toLocaleString()
                            : "-"}
                        </div>
                        <div>
                          Diperbarui:{" "}
                          {row.class_section_subject_teacher_updated_at
                            ? new Date(
                                row.class_section_subject_teacher_updated_at
                              ).toLocaleString()
                            : "-"}
                        </div>
                        <div>
                          Dihapus:{" "}
                          {row.class_section_subject_teacher_deleted_at
                            ? new Date(
                                row.class_section_subject_teacher_deleted_at
                              ).toLocaleString()
                            : "-"}
                        </div>
                      </div>

                      {/* Kontak guru */}
                      {teacher?.whatsapp_url && (
                        <a
                          href={teacher.whatsapp_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs underline"
                          style={{ color: palette.primary }}
                        >
                          <LinkIcon size={12} />
                          Hubungi Pengajar via WhatsApp
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </SectionCard>
      </main>
    </div>
  );
}
