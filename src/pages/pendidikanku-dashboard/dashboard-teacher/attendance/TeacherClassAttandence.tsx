// src/pages/sekolahislamku/teacher/ClassAttandence.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Badge,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

import {
  CheckSquare,
  Users,
  ArrowLeft,
  Save,
  Search,
  CalendarDays,
} from "lucide-react";

/* =========================================================================
   (Gabungan) Types + Dummy API untuk siswa per kelas
   ------------------------------------------------------------------------- */
type StudentSummary = { id: string; name: string; nis?: string };
type ClassStudentsMap = Record<string, StudentSummary[]>;

/* Dummy dataset */
const cls10A: StudentSummary[] = [
  { id: "stu-10a-001", name: "Ahmad Fajar Ramadhan", nis: "10A001" },
  { id: "stu-10a-002", name: "Siti Zahra Putri", nis: "10A002" },
  { id: "stu-10a-003", name: "Muhammad Rizky Hidayat", nis: "10A003" },
  { id: "stu-10a-004", name: "Aisyah Nurul Karimah", nis: "10A004" },
  { id: "stu-10a-005", name: "Fadhil Pratama", nis: "10A005" },
  { id: "stu-10a-006", name: "Nadia Aulia Rahma", nis: "10A006" },
  { id: "stu-10a-007", name: "Ali Akbar", nis: "10A007" },
  { id: "stu-10a-008", name: "Farhan Al Ghifari", nis: "10A008" },
  { id: "stu-10a-009", name: "Dewi Puspita", nis: "10A009" },
  { id: "stu-10a-010", name: "Hafidz Al Aziz", nis: "10A010" },
  { id: "stu-10a-011", name: "Rina Kartika Sari", nis: "10A011" },
  { id: "stu-10a-012", name: "Zidan Ramli", nis: "10A012" },
  { id: "stu-10a-013", name: "Intan Maharani", nis: "10A013" },
  { id: "stu-10a-014", name: "Arya Saputra", nis: "10A014" },
  { id: "stu-10a-015", name: "Putri Amelia", nis: "10A015" },
  { id: "stu-10a-016", name: "Reyhan Fadhila", nis: "10A016" },
  { id: "stu-10a-017", name: "Nabila Shafira", nis: "10A017" },
  { id: "stu-10a-018", name: "Rafi Pramudya", nis: "10A018" },
  { id: "stu-10a-019", name: "Syifa Maulidya", nis: "10A019" },
  { id: "stu-10a-020", name: "Dani Ramadhan", nis: "10A020" },
  { id: "stu-10a-021", name: "Citra Ayu Lestari", nis: "10A021" },
  { id: "stu-10a-022", name: "Bagas Yudhistira", nis: "10A022" },
  { id: "stu-10a-023", name: "Keisha Azzahra", nis: "10A023" },
  { id: "stu-10a-024", name: "Faiz Naufal", nis: "10A024" },
  { id: "stu-10a-025", name: "Rahmawati Nur", nis: "10A025" },
];

const cls7B: StudentSummary[] = [
  { id: "stu-7b-001", name: "Aldi Prakoso", nis: "7B001" },
  { id: "stu-7b-002", name: "Bunga Salsabila", nis: "7B002" },
  { id: "stu-7b-003", name: "Cahya Rizkiana", nis: "7B003" },
  { id: "stu-7b-004", name: "Dimas Bayu", nis: "7B004" },
  { id: "stu-7b-005", name: "Eka Nurfadila", nis: "7B005" },
  { id: "stu-7b-006", name: "Fikri Haidar", nis: "7B006" },
  { id: "stu-7b-007", name: "Gita Permata", nis: "7B007" },
  { id: "stu-7b-008", name: "Hana Azkia", nis: "7B008" },
  { id: "stu-7b-009", name: "Irfan Maulana", nis: "7B009" },
  { id: "stu-7b-010", name: "Jihan Nabila", nis: "7B010" },
  { id: "stu-7b-011", name: "Khalid Ibrahim", nis: "7B011" },
  { id: "stu-7b-012", name: "Laila Rahmania", nis: "7B012" },
  { id: "stu-7b-013", name: "Maulana Yusuf", nis: "7B013" },
  { id: "stu-7b-014", name: "Nadim Fauzan", nis: "7B014" },
  { id: "stu-7b-015", name: "Oryza Putra", nis: "7B015" },
  { id: "stu-7b-016", name: "Putra Dwiki", nis: "7B016" },
  { id: "stu-7b-017", name: "Qonita Alifa", nis: "7B017" },
  { id: "stu-7b-018", name: "Rafiq Husein", nis: "7B018" },
  { id: "stu-7b-019", name: "Salsa Nuraini", nis: "7B019" },
  { id: "stu-7b-020", name: "Taufik Ghani", nis: "7B020" },
  { id: "stu-7b-021", name: "Ulfa Zahidah", nis: "7B021" },
  { id: "stu-7b-022", name: "Vina Pertiwi", nis: "7B022" },
  { id: "stu-7b-023", name: "Wildan Akmal", nis: "7B023" },
  { id: "stu-7b-024", name: "Yasmin Farah", nis: "7B024" },
  { id: "stu-7b-025", name: "Zaky Nurjaman", nis: "7B025" },
];

const clsIpa1: StudentSummary[] = [
  { id: "stu-ipa1-001", name: "Abdul Karim", nis: "IPA1001" },
  { id: "stu-ipa1-002", name: "Berliana Putri", nis: "IPA1002" },
  { id: "stu-ipa1-003", name: "Chandra Wijaya", nis: "IPA1003" },
  { id: "stu-ipa1-004", name: "Dara Anjani", nis: "IPA1004" },
  { id: "stu-ipa1-005", name: "Erlangga Tama", nis: "IPA1005" },
  { id: "stu-ipa1-006", name: "Fauzia Mardiah", nis: "IPA1006" },
  { id: "stu-ipa1-007", name: "Gilang Saputra", nis: "IPA1007" },
  { id: "stu-ipa1-008", name: "Hafizah Nur", nis: "IPA1008" },
  { id: "stu-ipa1-009", name: "Ilham Prakoso", nis: "IPA1009" },
  { id: "stu-ipa1-010", name: "Jasmine Amelia", nis: "IPA1010" },
  { id: "stu-ipa1-011", name: "Kayla Azzahra", nis: "IPA1011" },
  { id: "stu-ipa1-012", name: "Lutfi Fajar", nis: "IPA1012" },
  { id: "stu-ipa1-013", name: "Mikail Umar", nis: "IPA1013" },
  { id: "stu-ipa1-014", name: "Nadia Syahira", nis: "IPA1014" },
  { id: "stu-ipa1-015", name: "Omar Syarif", nis: "IPA1015" },
  { id: "stu-ipa1-016", name: "Putri Dzakiyah", nis: "IPA1016" },
  { id: "stu-ipa1-017", name: "Qaisya Naurah", nis: "IPA1017" },
  { id: "stu-ipa1-018", name: "Rifqi Ramadhan", nis: "IPA1018" },
  { id: "stu-ipa1-019", name: "Syahrul Anwar", nis: "IPA1019" },
  { id: "stu-ipa1-020", name: "Tasya Rahmi", nis: "IPA1020" },
  { id: "stu-ipa1-021", name: "Umar Al Faruq", nis: "IPA1021" },
  { id: "stu-ipa1-022", name: "Vira Anandita", nis: "IPA1022" },
  { id: "stu-ipa1-023", name: "Wulan Pertiwi", nis: "IPA1023" },
  { id: "stu-ipa1-024", name: "Yusuf Ramzi", nis: "IPA1024" },
  { id: "stu-ipa1-025", name: "Zahwa Kamilah", nis: "IPA1025" },
];

const MOCK: ClassStudentsMap = {
  "cls-10a-2025": cls10A,
  "cls-7b-2025": cls7B,
  "cls-ipa1-2025": clsIpa1,
};

/** API mock: fetch students by class IDs */
async function fetchStudentsByClasses(
  classIds: string[]
): Promise<ClassStudentsMap> {
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
  await delay(400 + Math.floor(Math.random() * 400));
  if (!classIds || classIds.length === 0) return {};
  const out: ClassStudentsMap = {};
  for (const cid of classIds) out[cid] = MOCK[cid] ? [...MOCK[cid]] : [];
  return out;
}

export function getDemoClassIds(): string[] {
  return Object.keys(MOCK);
}

/* =========================================================================
   Absensi Kelas
   ------------------------------------------------------------------------- */

/* ========== Types & helpers ========== */
type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpa" | "online";

const atLocalNoon = (d: Date) => {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x;
};
const toLocalNoonISO = (d: Date) => atLocalNoon(d).toISOString();
const toYmd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const dateLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

const hijriLong = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

/* ========== Local storage for attendance ========== */
const LS_KEY = "teacher_attendance_v1";
type Stored = Record<
  string, // key: `${classId}_${yyyy-mm-dd}`
  Record<string, AttendanceStatus> // studentId -> status
>;

const readStore = (): Stored => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
};
const writeStore = (v: Stored) =>
  localStorage.setItem(LS_KEY, JSON.stringify(v));

/* ========== Row component ========== */
function StatusPill({
  value,
  onChange,
  palette,
}: {
  value: AttendanceStatus;
  onChange: (v: AttendanceStatus) => void;
  palette: Palette;
}) {
  const opts: AttendanceStatus[] = ["hadir", "online", "sakit", "izin", "alpa"];
  return (
    <div className="flex flex-wrap gap-1">
      {opts.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className="h-7 px-2 rounded-lg text-sm font-medium"
          style={{
            background: value === o ? palette.primary2 : palette.white2,
            color: value === o ? palette.primary : palette.black1,
            border: `1px solid ${palette.silver1}`,
          }}
          title={o}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function StudentRow({
  s,
  status,
  onChange,
  palette,
}: {
  s: StudentSummary;
  status: AttendanceStatus;
  onChange: (v: AttendanceStatus) => void;
  palette: Palette;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-xl border px-3 py-2"
      style={{ borderColor: palette.silver1, background: palette.white1 }}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{s.name}</div>
        {s.nis && (
          <div className="text-sm" style={{ color: palette.black2 }}>
            NIS: {s.nis}
          </div>
        )}
      </div>
      <StatusPill value={status} onChange={onChange} palette={palette} />
    </div>
  );
}

/* ========== Page ========== */
export default function CTeacherClassAttandence() {
  const { id: classId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  const todayISO = toLocalNoonISO(new Date());
  const todayYMD = toYmd(new Date());
  const storageKey = `${classId ?? "unknown"}_${todayYMD}`;

  // fetch siswa per kelas
  const { data: map = {}, isFetching } = useQuery({
    queryKey: ["teacher-class-students", classId],
    queryFn: () => fetchStudentsByClasses(classId ? [classId] : []),
    enabled: !!classId,
    staleTime: 5 * 60_000,
  });

  const students: StudentSummary[] = useMemo(
    () => (map as ClassStudentsMap)[classId ?? ""] ?? [],
    [map, classId]
  );

  // state absensi (muat dari localStorage bila ada)
  const initialStatuses: Record<string, AttendanceStatus> = useMemo(() => {
    const store = readStore();
    return store[storageKey] ?? {};
  }, [storageKey]);

  const [statuses, setStatuses] =
    useState<Record<string, AttendanceStatus>>(initialStatuses);
  const [q, setQ] = useState("");

  useEffect(() => {
    // jika data di storage berubah (tanggal/ganti kelas), sinkron
    setStatuses(initialStatuses);
  }, [initialStatuses]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return qq
      ? students.filter((s) => s.name.toLowerCase().includes(qq))
      : students;
  }, [students, q]);

  const counts = useMemo(() => {
    const c = { hadir: 0, online: 0, sakit: 0, izin: 0, alpa: 0 } as Record<
      AttendanceStatus,
      number
    >;
    for (const s of students) {
      const v: AttendanceStatus = statuses[s.id] ?? "hadir";
      c[v] = (c[v] ?? 0) + 1;
    }
    return c;
  }, [statuses, students]);

  const handleChange = (sid: string, st: AttendanceStatus) =>
    setStatuses((prev) => ({ ...prev, [sid]: st }));

  const handleSave = () => {
    const store = readStore();
    const payload: Record<string, AttendanceStatus> = {};
    for (const s of students) {
      payload[s.id] = statuses[s.id] ?? "hadir";
    }
    store[storageKey] = payload;
    writeStore(store);

    // Buat CSV sederhana
    let csv = "Nama,Status\n";
    for (const s of students) {
      const st = payload[s.id];
      csv += `${s.name},${st}\n`;
    }
    downloadFile(`absensi_${classId ?? "unknown"}.csv`, csv);

    alert("Absensi disimpan & diunduh ✅");
  };

  // setelah states: const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(initialStatuses);

  useEffect(() => {
    if (!students?.length) return;

    // Jika belum ada di storage, set default semua "hadir"
    const hasStored = Object.keys(initialStatuses).length > 0;
    if (!hasStored) {
      const next: Record<string, AttendanceStatus> = {};
      for (const s of students) next[s.id] = "hadir";
      setStatuses(next);
    } else {
      // Pastikan siswa baru juga default "hadir"
      setStatuses((prev) => {
        const next = { ...prev };
        for (const s of students) {
          if (!next[s.id]) next[s.id] = "hadir";
        }
        return next;
      });
    }
  }, [students, initialStatuses]);

  function downloadFile(
    filename: string,
    content: string,
    mime = "text/plain"
  ) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="w-full px-4 md:px-6  md:py-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="flex-1 flex flex-col space-y-6 min-w-0">
            {/* Back */}
            <div className="md:flex hidden gap-3 items-center">
              <Btn
                palette={palette}
                variant="ghost"
                onClick={() => navigate(-1)}
                className="gap-1"
              >
                <ArrowLeft size={20} />
              </Btn>
              <h1 className="textlg font-semibold">Absensi Kelas</h1>
            </div>

            {/* Header & Ringkasan */}
            <SectionCard palette={palette}>
              <div className="p-4 md:p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare size={18} color={palette.quaternary} />
                  <div>
                    <div className="font-semibold">Absensi Hari Ini</div>
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      <CalendarDays size={12} className="inline mr-1" />
                      {dateLong(todayISO)} — {hijriLong(todayISO)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Btn
                    palette={palette}
                    variant="secondary"
                    onClick={handleSave}
                  >
                    <Save size={16} className="mr-1" />
                    Simpan
                  </Btn>
                </div>
              </div>

              {/* Summary */}
              <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Badge
                  palette={palette}
                  variant="success"
                  className="justify-center"
                >
                  Hadir: {counts.hadir}
                </Badge>
                <Badge
                  palette={palette}
                  variant="info"
                  className="justify-center"
                >
                  Online: {counts.online}
                </Badge>
                <Badge
                  palette={palette}
                  variant="warning"
                  className="justify-center"
                >
                  Sakit: {counts.sakit}
                </Badge>
                <Badge
                  palette={palette}
                  variant="secondary"
                  className="justify-center"
                >
                  Izin: {counts.izin}
                </Badge>
                <Badge
                  palette={palette}
                  variant="destructive"
                  className="justify-center"
                >
                  Alpa: {counts.alpa}
                </Badge>
              </div>
            </SectionCard>

            {/* Pencarian */}
            <SectionCard palette={palette} className="p-3">
              <div
                className="flex items-center gap-2 rounded-xl border px-3 h-10 w-full md:w-1/2"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white2,
                }}
              >
                <Search size={16} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari nama siswa…"
                  className="bg-transparent outline-none text-sm w-full"
                  style={{ color: palette.black1 }}
                />
              </div>
            </SectionCard>

            {/* List siswa */}
            <SectionCard palette={palette}>
              <div className="p-4 md:p-5 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm" style={{ color: palette.black2 }}>
                    <Users size={14} className="inline mr-1" />
                    {filtered.length} siswa
                    {isFetching ? " • memuat…" : ""}
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    {/* cepat set semua hadir */}
                    <Btn
                      size="sm"
                      variant="outline"
                      palette={palette}
                      onClick={() => {
                        const next: Record<string, AttendanceStatus> = {};
                        for (const s of filtered) next[s.id] = "hadir";
                        setStatuses((prev) => ({ ...prev, ...next }));
                      }}
                    >
                      Tandai Hadir Semua
                    </Btn>
                  </div>
                </div>

                {filtered.length === 0 && (
                  <div
                    className="rounded-xl border p-4 text-sm"
                    style={{
                      borderColor: palette.silver1,
                      background: palette.white2,
                      color: palette.black2,
                    }}
                  >
                    Tidak ada siswa yang cocok.
                  </div>
                )}

                {filtered.map((s) => (
                  <StudentRow
                    key={s.id}
                    s={s}
                    status={statuses[s.id] ?? "hadir"}
                    onChange={(v) => handleChange(s.id, v)}
                    palette={palette}
                  />
                ))}
              </div>
            </SectionCard>

            {/* Footer tindakan */}
            <div className="flex items-center justify-end gap-2">
              <Btn palette={palette} variant="secondary" onClick={handleSave}>
                <Save size={16} className="mr-1" />
                Simpan Absensi
              </Btn>
              <Link to=".." relative="path">
                <Btn palette={palette} variant="outline">
                  Selesai
                </Btn>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
