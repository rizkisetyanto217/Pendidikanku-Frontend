import { useState, useMemo, useDeferredValue } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  Clock,
  Users,
  GraduationCap,
  MapPin,
  Search,
  ChevronRight,
  LayoutGrid,
  LayoutList,
  Filter,
} from "lucide-react";
import {
  SectionCard,
  Badge,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";

/* =====================
   Types & Dummy Data
===================== */
type TeacherSubject = {
  id: string;
  name: string;
  room: string;
  day: string;
  time: string;
  level: string;
  studentsCount: number;
  academicTerm: string;
  nextTopic: string;
};

const TEACHER_SUBJECTS_FIXED: TeacherSubject[] = [
  {
    id: "fiqih-1",
    name: "Fiqih Dasar",
    room: "Aula 1",
    day: "Senin",
    time: "08:00",
    level: "Pemula",
    studentsCount: 24,
    academicTerm: "2025/2026 — Ganjil",
    nextTopic: "Bab Thaharah (Bersuci)",
  },
  {
    id: "arab-1",
    name: "Bahasa Arab",
    room: "Lab Bahasa",
    day: "Selasa",
    time: "09:30",
    level: "Menengah",
    studentsCount: 20,
    academicTerm: "2025/2026 — Ganjil",
    nextTopic: "Isim, Fi'il, dan Huruf",
  },
  {
    id: "tahfiz-1",
    name: "Tahfiz Juz 29",
    room: "R. Tahfiz",
    day: "Rabu",
    time: "15:30",
    level: "Lanjutan",
    studentsCount: 19,
    academicTerm: "2025/2026 — Ganjil",
    nextTopic: "Setoran An-Naba 1–10",
  },
  {
    id: "akidah-1",
    name: "Aqidah Akhlak",
    room: "R. 101",
    day: "Kamis",
    time: "10:00",
    level: "Pemula",
    studentsCount: 22,
    academicTerm: "2024/2025 — Genap",
    nextTopic: "Sifat Wajib bagi Allah",
  },
  {
    id: "sirah-1",
    name: "Sirah Nabawiyah",
    room: "Aula 2",
    day: "Jumat",
    time: "13:00",
    level: "Menengah",
    studentsCount: 18,
    academicTerm: "2025/2026 — Ganjil",
    nextTopic: "Perjalanan Nabi ke Thaif",
  },
];

/* =====================
   Fake Fetch
===================== */
async function fetchTeacherSubjects(): Promise<TeacherSubject[]> {
  return Promise.resolve(TEACHER_SUBJECTS_FIXED.map((x) => ({ ...x })));
}

function useTeacherSubjects() {
  return useQuery({
    queryKey: ["teacher-subjects"],
    queryFn: fetchTeacherSubjects,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

/* =====================
   Main Component
===================== */
export default function TeacherSubjects() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  const { data: subjects = [] } = useTeacherSubjects();

  const [viewMode, setViewMode] = useState<"detailed" | "simple">("detailed");
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("all");
  const [level, setLevel] = useState("all");
  const [term, setTerm] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "students">("name");

  const deferredSearch = useDeferredValue(search);

  const days = ["all", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const levels = ["all", "Pemula", "Menengah", "Lanjutan"];
  const terms = ["all", ...new Set(subjects.map((s) => s.academicTerm))];

  const filtered = useMemo(() => {
    let list = subjects;

    if (day !== "all") list = list.filter((s) => s.day === day);
    if (level !== "all") list = list.filter((s) => s.level === level);
    if (term !== "all") list = list.filter((s) => s.academicTerm === term);

    const q = deferredSearch.toLowerCase();
    if (q) list = list.filter((s) => s.name.toLowerCase().includes(q));

    if (sortBy === "name")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "students")
      list = [...list].sort((a, b) => b.studentsCount - a.studentsCount);

    return list;
  }, [subjects, deferredSearch, day, level, term, sortBy]);

  return (
    <div className="min-h-screen">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: palette.primary }}
          >
            Mata Pelajaran Saya
          </h1>

          <div
            className="flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm w-full sm:w-auto"
            style={{
              background: palette.white1,
              border: `1px solid ${palette.silver1}`,
            }}
          >
            <Search size={18} style={{ color: palette.primary }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama mapel..."
              className="bg-transparent outline-none w-full text-sm"
              style={{ color: palette.black1 }}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Hari", value: day, set: setDay, options: days },
            { label: "Level", value: level, set: setLevel, options: levels },
            {
              label: "Tahun Ajaran",
              value: term,
              set: setTerm,
              options: terms,
            },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-sm font-medium block mb-1">
                {f.label}
              </label>
              <div
                className="flex items-center gap-2 rounded-xl border px-3 py-2"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                }}
              >
                <Filter size={14} style={{ color: palette.primary }} />
                <select
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full"
                >
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "all" ? "Semua" : opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <div>
            <label className="text-sm font-medium block mb-1">Urutkan</label>
            <div
              className="flex items-center gap-2 rounded-xl border px-3 py-2"
              style={{
                borderColor: palette.silver1,
                background: palette.white1,
              }}
            >
              <Filter size={14} style={{ color: palette.primary }} />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "name" | "students")
                }
                className="bg-transparent outline-none text-sm w-full"
              >
                <option value="name">Nama Mapel</option>
                <option value="students">Jumlah Siswa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Toggle View Mode */}
        <div className="flex justify-end mt-4">
          <div
            className="flex items-center gap-2 rounded-xl border p-1"
            style={{
              borderColor: palette.silver1,
              background: palette.white1,
            }}
          >
            <button
              onClick={() => setViewMode("detailed")}
              className={`px-3 py-1 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                viewMode === "detailed"
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              style={{
                background:
                  viewMode === "detailed" ? palette.primary : "transparent",
                color:
                  viewMode === "detailed" ? palette.white1 : palette.black1,
              }}
            >
              <LayoutGrid size={16} /> Detail
            </button>
            <button
              onClick={() => setViewMode("simple")}
              className={`px-3 py-1 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                viewMode === "simple"
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              style={{
                background:
                  viewMode === "simple" ? palette.primary : "transparent",
                color: viewMode === "simple" ? palette.white1 : palette.black1,
              }}
            >
              <LayoutList size={16} /> Simple
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          className={`grid gap-6 ${
            viewMode === "simple"
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {filtered.map((s) => (
            <SectionCard
              key={s.id}
              palette={palette}
              className="group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden relative"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                }}
              />
              <div className="p-5 md:p-6 relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2
                      className="font-bold text-lg"
                      style={{ color: palette.black1 }}
                    >
                      {s.name}
                    </h2>
                    <p className="text-sm text-gray-500">{s.level}</p>
                  </div>
                  <Badge variant="outline" palette={palette}>
                    <MapPin size={12} />
                    {s.room}
                  </Badge>
                </div>

                {viewMode === "detailed" && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={14}
                        style={{ color: palette.primary }}
                      />
                      {s.day} • {s.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap
                        size={14}
                        style={{ color: palette.primary }}
                      />
                      {s.academicTerm}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} style={{ color: palette.primary }} />
                      {s.studentsCount} siswa
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} style={{ color: palette.primary }} />
                      Materi berikutnya:{" "}
                      <span className="font-medium">{s.nextTopic}</span>
                    </div>
                  </div>
                )}

                <div className="pt-3 flex justify-end">
                  <Link to={`${s.id}`}>
                    <Btn
                      palette={palette}
                      size="sm"
                      className="flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      Buka Mapel
                      <ChevronRight size={16} />
                    </Btn>
                  </Link>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            className="p-10 text-center rounded-2xl shadow-md"
            style={{
              background: palette.white1,
              border: `1px solid ${palette.silver1}`,
            }}
          >
            <div className="flex justify-center mb-4">
              <Search size={32} style={{ color: palette.primary }} />
            </div>
            <p className="font-semibold text-gray-700 mb-2">
              Tidak ada mata pelajaran ditemukan
            </p>
            <p className="text-sm text-gray-500">
              Coba ubah kata kunci atau filter untuk melihat hasil lainnya.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
