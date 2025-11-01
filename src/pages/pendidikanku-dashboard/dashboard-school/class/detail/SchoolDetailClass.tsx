// src/pages/sekolahislamku/pages/classes/SchoolDetailClass.tsx
import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Badge,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/CParentTopBar";
import {
  ArrowLeft,
  BookOpen,
  Users,
  User,
  CalendarDays,
  Clock4,
} from "lucide-react";
import ParentSidebar from "@/pages/pendidikanku-dashboard/components/home/CParentSideBar";

/* =========================================
   DUMMY SWITCH
========================================= */
const USE_DUMMY = true;

/* ========= Types ========= */
type ApiSchedule = {
  start?: string;
  end?: string;
  days?: string[];
  location?: string;
};
type ApiTeacherLite = {
  id: string;
  user_name: string;
  email?: string;
  is_active?: boolean;
};
type ApiSection = {
  class_sections_id: string;
  class_sections_class_id: string;
  class_sections_slug: string;
  class_sections_name: string;
  class_sections_code?: string | null;
  class_sections_schedule?: ApiSchedule | null;
  class_sections_is_active: boolean;
  teacher?: ApiTeacherLite | null;
};
type ApiOneSection = { data: ApiSection; message: string };

type ApiParticipant = {
  class_student_id?: string;
  student_id?: string;
  id?: string;
  student_name?: string;
  name?: string;
  nis?: string;
  gender?: "L" | "P";
  phone?: string;
  email?: string;
  status?: string;
};
type ApiParticipantsResp =
  | { data: ApiParticipant[] }
  | { data: { items: ApiParticipant[] } };

type ApiLesson = {
  id?: string;
  class_lesson_id?: string;
  title?: string;
  topic?: string;
  subject_name?: string;
  date?: string;
  start?: string;
  end?: string;
  teacher_name?: string;
  note?: string;
};
type ApiLessonsResp = { data: ApiLesson[] } | { data: { items: ApiLesson[] } };

/* ========= Helpers ========= */
const dateLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

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

/* ========= Dummy Data ========= */
const DUMMY_SECTION = (id: string): ApiSection => ({
  class_sections_id: id,
  class_sections_class_id: "1",
  class_sections_slug: "kelas-a",
  class_sections_name: "Kelas A",
  class_sections_code: "A1",
  class_sections_schedule: {
    start: "07:30",
    end: "09:00",
    days: ["Senin", "Rabu"],
    location: "Ruang A",
  },
  class_sections_is_active: true,
  teacher: {
    id: "t1",
    user_name: "Ridla Agustiawan",
    email: "ridla@example.com",
    is_active: true,
  },
});

const DUMMY_PARTICIPANTS: ApiParticipant[] = [
  {
    id: "s1",
    student_name: "Ahmad Fikri",
    nis: "2025-001",
    gender: "L",
    phone: "0812-1111-2222",
    email: "ahmad@example.com",
    status: "aktif",
  },
  {
    id: "s2",
    student_name: "Siti Maryam",
    nis: "2025-002",
    gender: "P",
    phone: "0812-3333-4444",
    email: "siti@example.com",
    status: "aktif",
  },
];

const DUMMY_LESSONS: ApiLesson[] = [
  {
    id: "l1",
    title: "Tahsin",
    date: new Date().toISOString().slice(0, 10),
    start: "07:30",
    end: "09:00",
    teacher_name: "Ridla",
    note: "Makharijul huruf",
  },
];

/* ========= Dummy Mapel & Tugas ========= */
interface Subject {
  id: string;
  name: string;
  teacher: string;
}
interface Task {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
}

/* ========= Dummy Mapel & Tugas & Quiz ========= */
interface Quiz {
  id: string;
  subjectId: string;
  title: string;
  status: "open" | "closed" | "graded";
}

const DUMMY_QUIZZES: Quiz[] = [
  {
    id: "qz-1",
    subjectId: "sbj-1", // Matematika
    title: "Quiz Aljabar Dasar",
    status: "open",
  },
  {
    id: "qz-2",
    subjectId: "sbj-1",
    title: "Quiz Geometri",
    status: "closed",
  },
];

const DUMMY_SUBJECTS: Subject[] = [
  { id: "sbj-1", name: "Matematika", teacher: "Budi Santoso" },
  { id: "sbj-2", name: "Bahasa Indonesia", teacher: "Siti Nurhaliza" },
];
const DUMMY_TASKS: Task[] = [
  {
    id: "tsk-1",
    subjectId: "sbj-1",
    title: "PR Aljabar",
    dueDate: "2025-09-30",
    status: "pending",
  },
  {
    id: "tsk-2",
    subjectId: "sbj-2",
    title: "Ringkasan Cerpen",
    dueDate: "2025-09-25",
    status: "submitted",
  },
];

/* ========= Fetchers ========= */
async function fetchSection(id: string): Promise<ApiSection | null> {
  if (USE_DUMMY) return DUMMY_SECTION(id);
  try {
    const r = await axios.get<ApiOneSection>(`/api/a/class-sections/${id}`);
    return r.data.data;
  } catch {
    return null;
  }
}
async function fetchParticipants(id: string): Promise<ApiParticipant[]> {
  if (USE_DUMMY) return DUMMY_PARTICIPANTS;
  return [];
}
async function fetchLessons(id: string): Promise<ApiLesson[]> {
  if (USE_DUMMY) return DUMMY_LESSONS;
  return [];
}

/* ========= UI mappers ========= */
function mapParticipant(x: ApiParticipant) {
  return {
    id: x.class_student_id || x.student_id || x.id || crypto.randomUUID(),
    name: x.student_name || x.name || "-",
    nis: x.nis,
    gender: x.gender,
    phone: x.phone,
    email: x.email,
    status: x.status,
  };
}
function mapLesson(x: ApiLesson) {
  return {
    id: x.class_lesson_id || x.id || crypto.randomUUID(),
    title: x.title || x.topic || x.subject_name || "Materi",
    date: x.date,
    time: x.start && x.end ? `${x.start}–${x.end}` : x.start || x.end,
    teacher: x.teacher_name,
    note: x.note,
  };
}

/* ========= Semester helpers ========= */
type SemesterKey = "2025-Ganjil" | "2025-Genap";
const SEMESTER_RANGES: Record<SemesterKey, { start: string; end: string }> = {
  "2025-Ganjil": { start: "2025-07-01", end: "2025-12-31" },
  "2025-Genap": { start: "2026-01-01", end: "2026-06-30" },
};
const inRange = (iso: string, s: string, e: string) => iso >= s && iso <= e;

/* ========= Page ========= */
export default function SchoolDetailClass() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  const [semester, setSemester] = useState<SemesterKey>("2025-Ganjil");

  const sectionQ = useQuery({
    queryKey: ["section", id],
    enabled: !!id,
    queryFn: () => fetchSection(id),
  });
  const participantsQ = useQuery({
    queryKey: ["participants", id],
    enabled: !!id,
    queryFn: () => fetchParticipants(id),
  });
  const lessonsQ = useQuery({
    queryKey: ["lessons", id],
    enabled: !!id,
    queryFn: () => fetchLessons(id),
  });

  const section = sectionQ.data ?? undefined;
  const participants = useMemo(
    () => (participantsQ.data ?? []).map(mapParticipant),
    [participantsQ.data]
  );
  const lessons = useMemo(
    () => (lessonsQ.data ?? []).map(mapLesson),
    [lessonsQ.data]
  );

  const semesterRange = SEMESTER_RANGES[semester];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="h-full w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* Content */}
          <div className="flex-1 min-w-0 space-y-6">
            <section className="flex items-center justify-between">
              <div className="font-semibold text-lg flex items-center">
                <div className="items-center md:flex">
                  <Btn
                    palette={palette}
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="cursor-pointer mr-3"
                  >
                    <ArrowLeft aria-label="Kembali" size={20} />
                  </Btn>
                </div>
                <h1 className="items-center md:flex">Kelola Kelas</h1>
              </div>

              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as SemesterKey)}
                className="border rounded px-2 py-1 text-sm"
                style={{
                  borderColor: palette.black2,
                  background: palette.white2,
                  color: palette.black1,
                }}
              >
                <option value="2025-Ganjil">2025 Ganjil</option>
                <option value="2025-Genap">2025 Genap</option>
              </select>
            </section>

            {/* Ringkasan */}
            <SectionCard palette={palette}>
              <div className="p-4 grid gap-4 md:grid-cols-3">
                {/* Wali Kelas */}
                <div className="flex items-start gap-3">
                  <span
                    className="h-10 w-10 grid place-items-center rounded-xl"
                    style={{
                      background: palette.primary2,
                      color: palette.primary,
                    }}
                  >
                    <User size={18} />
                  </span>
                  <div>
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      Wali Kelas
                    </div>
                    <div className="font-medium">
                      {section?.teacher?.user_name ?? "-"}
                    </div>
                    {section?.teacher?.email && (
                      <div
                        className="text-sm"
                        style={{ color: palette.black2 }}
                      >
                        <h1 className="text-sm"> {section.teacher.email}</h1>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hari & Lokasi */}
                <div className="flex items-start gap-3">
                  <span
                    className="h-10 w-10 grid place-items-center rounded-xl"
                    style={{
                      background: palette.primary2,
                      color: palette.primary,
                    }}
                  >
                    <CalendarDays size={18} />
                  </span>
                  <div>
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      Hari & Lokasi
                    </div>
                    <div className="font-medium">
                      {(section?.class_sections_schedule?.days ?? []).join(
                        ", "
                      ) || "-"}
                    </div>
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      {section?.class_sections_schedule?.location ?? "-"}
                    </div>
                  </div>
                </div>

                {/* Waktu */}
                <div className="flex items-start gap-3">
                  <span
                    className="h-10 w-10 grid place-items-center rounded-xl"
                    style={{
                      background: palette.primary2,
                      color: palette.primary,
                    }}
                  >
                    <Clock4 size={18} />
                  </span>
                  <div>
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      Waktu
                    </div>
                    <div className="font-medium">
                      {scheduleToText(section?.class_sections_schedule)}
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Peserta */}
            {/* <SectionCard palette={palette}>
              <div className="p-4 font-medium flex items-center gap-2">
                <Users size={18} /> Peserta
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="min-w-full table-auto text-sm border-collapse">
                  <thead
                    className="border-b"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.black2,
                    }}
                  >
                    <tr>
                      <th className="px-4 py-2 text-left">NIS</th>
                      <th className="px-4 py-2 text-left">Nama</th>
                      <th className="px-4 py-2 text-center">JK</th>
                      <th className="px-4 py-2 text-left">Kontak</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b"
                        style={{ borderColor: palette.silver1 }}
                      >
                        <td className="px-4 py-2">{p.nis ?? "-"}</td>
                        <td className="px-4 py-2 font-medium">{p.name}</td>
                        <td className="px-4 py-2 text-center">
                          {p.gender ?? "-"}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col">
                            {p.phone && <span>{p.phone}</span>}
                            {p.email && (
                              <a
                                href={`mailto:${p.email}`}
                                className="text-sm underline"
                                style={{ color: palette.primary }}
                              >
                                {p.email}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <Badge
                            palette={palette}
                            variant={
                              p.status === "aktif" ? "success" : "outline"
                            }
                          >
                            {p.status ?? "Aktif"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard> */}

            {/* Mata Pelajaran & Tugas */}
            <SectionCard palette={palette}>
              <div className="p-4 md:p-5 pb-2 flex items-center justify-between">
                <div className="font-medium flex items-center gap-2">
                  <BookOpen size={18} /> Mata Pelajaran
                </div>
                <Btn palette={palette} variant="ghost">
                  + Tambah Mapel
                </Btn>
              </div>

              <div className="px-4 md:px-5 pb-4 space-y-4">
                {DUMMY_SUBJECTS.map((subj) => (
                  <div
                    key={subj.id}
                    className="border rounded-lg p-4"
                    style={{ borderColor: palette.silver1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{subj.name}</div>
                        <div
                          className="text-sm"
                          style={{ color: palette.black2 }}
                        >
                          Guru: {subj.teacher}
                        </div>
                      </div>
                      {/* <Btn palette={palette} size="sm" variant="ghost">
                        Tambah Tugas
                      </Btn> */}
                    </div>

                    {/* Tabel tugas */}
                    {/* Daftar tugas per mapel */}
                    <div className="mt-4 space-y-3">
                      {DUMMY_TASKS.filter((t) => t.subjectId === subj.id).map(
                        (t) => (
                          <div
                            key={t.id}
                            className="border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                            style={{
                              borderColor: palette.silver1,
                              background: palette.white1,
                            }}
                          >
                            <div className="flex-1 space-y-1">
                              <div className="font-medium">{t.title}</div>
                              <div
                                className="text-sm flex items-center gap-1"
                                style={{ color: palette.black2 }}
                              >
                                <CalendarDays size={14} /> {dateLong(t.dueDate)}
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0">
                              <Badge
                                palette={palette}
                                variant={
                                  t.status === "graded"
                                    ? "success"
                                    : t.status === "submitted"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {t.status}
                              </Badge>
                            </div>
                          </div>
                        )
                      )}

                      {/* Bagian Quiz */}
                      <div className="mt-5">
                        <div className="font-medium mb-2 flex items-center gap-2">
                          <BookOpen size={16} /> Quiz
                        </div>
                        <div className="space-y-3">
                          {DUMMY_QUIZZES.filter(
                            (q) => q.subjectId === subj.id
                          ).map((q) => (
                            <div
                              key={q.id}
                              className="border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                              style={{
                                borderColor: palette.silver1,
                                background: palette.white1,
                              }}
                            >
                              <div className="flex-1 space-y-1">
                                <div className="font-medium">{q.title}</div>
                                <div
                                  className="text-sm"
                                  style={{ color: palette.black2 }}
                                >
                                  Status: {q.status}
                                </div>
                              </div>
                              <div className="mt-2 sm:mt-0 flex items-center gap-2">
                                <Badge
                                  palette={palette}
                                  variant={
                                    q.status === "graded"
                                      ? "success"
                                      : q.status === "open"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {q.status}
                                </Badge>
                                <Btn
                                  palette={palette}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`../quiz/${q.id}`)}
                                >
                                  Detail
                                </Btn>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}
