// src/pages/StudentReport.tsx
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  LineChart,
  Percent,
  User2,
} from "lucide-react";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Badge,
  Btn,
  ProgressBar,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/Primitives";
import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/ParentTopBar";
import ParentSidebar from "@/pages/pendidikanku-dashboard/components/home/ParentSideBar";

/* ================= Types ================ */
type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpa" | "online";

interface ReportFetch {
  student: { id: string; name: string; className: string };
  period: { label: string; start: string; end: string };
  attendance: {
    totalSessions: number;
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
    online: number;
  };
  scores: {
    tajwid: number;
    tilawah: number;
    hafalan: number;
    fikih: number;
    akhlak: number;
    average: number;
    min: number;
    max: number;
  };
  memorization: {
    juzProgress: number;
    iqraLevel?: string;
    latest: Array<{
      date: string;
      item: string;
      type: "setoran" | "murajaah";
      score?: number;
      note?: string;
    }>;
  };
  remarks: { homeroom: string; recommendations?: string[] };
}

/* ============== Fake API (dummy rapor) ============= */
async function fetchReport(): Promise<ReportFetch> {
  const today = new Date();
  const iso = (d: Date) => d.toISOString();
  const start = new Date(today.getFullYear(), 6, 15);
  const end = new Date(today.getFullYear(), 11, 15);

  const scores = {
    tajwid: 88,
    tilawah: 91,
    hafalan: 86,
    fikih: 84,
    akhlak: 92,
  };
  const vals = Object.values(scores);
  const average =
    Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;

  return {
    student: { id: "c1", name: "Ahmad", className: "TPA A" },
    period: {
      label: "Semester Ganjil 2025/2026",
      start: iso(start),
      end: iso(end),
    },
    attendance: {
      totalSessions: 20,
      hadir: 18,
      sakit: 1,
      izin: 1,
      alpa: 0,
      online: 2,
    },
    scores: {
      ...scores,
      average,
      min: Math.min(...vals),
      max: Math.max(...vals),
    },
    memorization: {
      juzProgress: 0.6,
      iqraLevel: "Iqra 2",
      latest: [
        {
          date: new Date().toISOString(),
          item: "An-Naba 1–10",
          type: "setoran",
          score: 90,
          note: "Makhraj bagus, perhatikan mad thabi'i.",
        },
        {
          date: new Date(Date.now() - 864e5 * 2).toISOString(),
          item: "Al-Baqarah 255–257",
          type: "murajaah",
          score: 88,
        },
      ],
    },
    remarks: {
      homeroom:
        "Alhamdulillah, progress sangat baik. Fokus meningkat, bacaan lebih tartil. Pertahankan adab ketika teman mendapat giliran.",
      recommendations: [
        "Latihan mad thabi'i 5 menit/hari.",
        "PR: An-Naba 11–15 (lanjutan).",
      ],
    },
  };
}

/* ============== Helpers ============= */
const toID = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const topbarDateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// --- timezone-safe helpers (pakai “siang lokal”)
const atLocalNoon = (d: Date) => {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x;
};
const toLocalNoonISO = (d: Date) => atLocalNoon(d).toISOString();
const hijriWithWeekday = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";
function grade(num: number) {
  if (num >= 90) return { label: "A", variant: "success" as const };
  if (num >= 80) return { label: "B", variant: "info" as const };
  if (num >= 70) return { label: "C", variant: "secondary" as const };
  if (num >= 60) return { label: "D", variant: "warning" as const };
  return { label: "E", variant: "destructive" as const };
}

/* ============== Page ============= */
export default function StudentRaport() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const { data: s } = useQuery({
    queryKey: ["student-report"],
    queryFn: fetchReport,
    staleTime: 60_000,
  });

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
    
      

      {/* Content + Sidebar */}
      <main className="w-full px-4 md:px-6 py-4   md:py-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
          
          {/* Konten utama */}
          <div className="flex-1 flex flex-col space-y-6 min-w-0">
            <div className="md:flex hidden items-center gap-3">
              <Btn
                palette={palette}
                onClick={() => navigate(-1)}
                variant="ghost"
                className="cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft size={20} />
              </Btn>

              <h1 className="text-lg font-semibold">Raport Siswa</h1>
            </div>
            {/* Ringkasan Siswa & Periode */}
            <SectionCard palette={palette} className="p-4 md:p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SectionCard
                  palette={palette}
                  className="p-3"
                  style={{ background: palette.white2 }}
                >
                  <div className="text-sm" style={{ color: palette.black2 }}>
                    Siswa
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <User2 size={16} />
                    <div className="font-medium">{s?.student.name}</div>
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: palette.black2 }}
                  >
                    Kelas: {s?.student.className}
                  </div>
                </SectionCard>

                <SectionCard
                  palette={palette}
                  className="p-3"
                  style={{ background: palette.white2 }}
                >
                  <div className="text-sm" style={{ color: palette.black2 }}>
                    Periode
                  </div>
                  <div className="mt-1 font-medium">{s?.period.label}</div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: palette.black2 }}
                  >
                    {s ? `${toID(s.period.start)} — ${toID(s.period.end)}` : ""}
                  </div>
                </SectionCard>

                <SectionCard
                  palette={palette}
                  className="p-3"
                  style={{ background: palette.white2 }}
                >
                  <div className="text-sm" style={{ color: palette.black2 }}>
                    Rata-rata Nilai
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-2xl font-semibold">
                      {s?.scores.average ?? "-"}
                    </span>
                    {s && (
                      <Badge
                        variant={grade(s.scores.average).variant}
                        palette={palette}
                      >
                        <Award size={14} className="mr-1" />
                        {grade(s.scores.average).label}
                      </Badge>
                    )}
                  </div>
                  {s && (
                    <div
                      className="text-sm mt-1"
                      style={{ color: palette.black2 }}
                    >
                      Min {s.scores.min} • Max {s.scores.max}
                    </div>
                  )}
                </SectionCard>
              </div>
            </SectionCard>

            {/* Rekap Absensi */}
            <SectionCard palette={palette} className="p-4 md:p-5">
              <div className="font-medium mb-3 flex items-center gap-2">
                <CalendarDays size={18} /> Rekap Absensi
              </div>
              {s && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {[
                    {
                      label: "Hadir",
                      value: s.attendance.hadir,
                      variant: "success" as const,
                    },
                    {
                      label: "Online",
                      value: s.attendance.online,
                      variant: "info" as const,
                    },
                    {
                      label: "Izin",
                      value: s.attendance.izin,
                      variant: "secondary" as const,
                    },
                    {
                      label: "Sakit",
                      value: s.attendance.sakit,
                      variant: "warning" as const,
                    },
                    {
                      label: "Alpa",
                      value: s.attendance.alpa,
                      variant: "destructive" as const,
                    },
                  ].map((it) => {
                    const pct =
                      s.attendance.totalSessions > 0
                        ? Math.round(
                            (it.value / s.attendance.totalSessions) * 100
                          )
                        : 0;
                    return (
                      <SectionCard
                        key={it.label}
                        palette={palette}
                        className="p-3"
                        style={{ background: palette.white2 }}
                      >
                        <div
                          className="text-sm"
                          style={{ color: palette.black2 }}
                        >
                          {it.label}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant={it.variant} palette={palette}>
                            {it.value}
                          </Badge>
                          <span
                            className="text-sm"
                            style={{ color: palette.black2 }}
                          >
                            / {s.attendance.totalSessions} sesi
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <Percent size={12} /> {pct}%
                        </div>
                        <div className="mt-2">
                          <ProgressBar value={pct} palette={palette} />
                        </div>
                      </SectionCard>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            {/* Nilai per Aspek */}
            <SectionCard palette={palette} className="p-4 md:p-5">
              <div className="font-medium mb-3 flex items-center gap-2">
                <GraduationCap size={18} /> Nilai Per Aspek
              </div>
              {s && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {[
                    { k: "tajwid", label: "Tajwid", val: s.scores.tajwid },
                    { k: "tilawah", label: "Tilawah", val: s.scores.tilawah },
                    { k: "hafalan", label: "Hafalan", val: s.scores.hafalan },
                    { k: "fikih", label: "Fikih/Praktik", val: s.scores.fikih },
                    { k: "akhlak", label: "Akhlak/Adab", val: s.scores.akhlak },
                  ].map((a) => {
                    const g = grade(a.val);
                    return (
                      <SectionCard
                        key={a.k}
                        palette={palette}
                        className="p-3"
                        style={{ background: palette.white2 }}
                      >
                        <div
                          className="text-sm"
                          style={{ color: palette.black2 }}
                        >
                          {a.label}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xl font-semibold">{a.val}</span>
                          <Badge variant={g.variant} palette={palette}>
                            {g.label}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <ProgressBar value={a.val} palette={palette} />
                        </div>
                      </SectionCard>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            {/* Progres Hafalan & Iqra */}
            <SectionCard palette={palette} className="p-4 md:p-5">
              <div className="font-medium mb-3 flex items-center gap-2">
                <LineChart size={18} /> Progres Hafalan & Iqra
              </div>
              {s && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <SectionCard
                    palette={palette}
                    className="p-3"
                    style={{ background: palette.white2 }}
                  >
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      Progres Juz (≈)
                    </div>
                    <div className="mt-2">
                      <ProgressBar
                        value={
                          (Math.min(2, s.memorization.juzProgress) / 2) * 100
                        }
                        palette={palette}
                      />
                      <div
                        className="mt-1 text-sm"
                        style={{ color: palette.black2 }}
                      >
                        ~ {s.memorization.juzProgress} Juz
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard
                    palette={palette}
                    className="p-3"
                    style={{ background: palette.white2 }}
                  >
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      Level Iqra
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <ClipboardList size={16} />
                      <span className="font-medium">
                        {s.memorization.iqraLevel ?? "-"}
                      </span>
                    </div>
                  </SectionCard>

                  <SectionCard
                    palette={palette}
                    className="p-3"
                    style={{ background: palette.white2 }}
                  >
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      Setoran Terakhir
                    </div>
                    <div className="mt-1 text-sm space-y-1">
                      {s.memorization.latest.map((m, i) => (
                        <div
                          key={i}
                          className="rounded-lg border p-2"
                          style={{
                            borderColor: palette.silver1,
                            background: palette.white1,
                          }}
                        >
                          <div
                            className="text-sm"
                            style={{ color: palette.black2 }}
                          >
                            {toID(m.date)}
                          </div>
                          <div
                            className="flex items-center gap-2"
                            style={{ color: palette.black2 }}
                          >
                            <Badge variant="outline" palette={palette}>
                              <p style={{ color: palette.black2 }}>{m.type}</p>
                            </Badge>
                            <span className="font-medium">{m.item}</span>
                            {typeof m.score === "number" && (
                              <Badge variant="secondary" palette={palette}>
                                {m.score}
                              </Badge>
                            )}
                          </div>
                          {m.note && (
                            <div
                              className="text-sm mt-1"
                              style={{ color: palette.black2 }}
                            >
                              <p style={{ color: palette.black2 }}>{m.note}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              )}
            </SectionCard>

            {/* Catatan Wali Kelas & Rekomendasi */}
            <SectionCard palette={palette} className="p-4 md:p-5">
              <div className="font-medium mb-3 flex items-center gap-2">
                <FileText size={18} /> Catatan Wali Kelas
              </div>
              {s && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <SectionCard
                    palette={palette}
                    className="p-3"
                    style={{ background: palette.white2 }}
                  >
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      Catatan
                    </div>
                    <p className="mt-1 text-sm">{s.remarks.homeroom}</p>
                  </SectionCard>

                  <SectionCard
                    palette={palette}
                    className="p-3"
                    style={{ background: palette.white2 }}
                  >
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      Rekomendasi / PR
                    </div>
                    <ul className="mt-1 list-disc pl-5 text-sm">
                      {(s.remarks.recommendations ?? []).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </SectionCard>
                </div>
              )}
            </SectionCard>

            {/* Footer Aksi */}
            <div className="flex items-center justify-end">
              <Btn variant="secondary" palette={palette}>
                <FileText size={16} className="mr-1" /> Cetak / Unduh
              </Btn>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
