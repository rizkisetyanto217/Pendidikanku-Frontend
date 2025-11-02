// ==============================================
// File: src/pages/sekolahislamku/dashboard-student/schedule/StudentSchedule.tsx
// Layout mengikuti TeacherSchedule, tapi versi readonly (tanpa CRUD)
// Menggunakan in-memory data dummy untuk jadwal murid
// ==============================================

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  ArrowLeft,
} from "lucide-react";

/* ================= Helpers ================= */
type ScheduleRow = {
  id: string;
  title: string;
  date: string;
  time: string;
  teacher: string;
  room?: string;
  type?: "class" | "exam" | "event";
  description?: string;
};

const dateLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

const toMonthStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const monthLabel = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, (m || 1) - 1, 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
};

/* ================= Dummy API ================= */
const studentScheduleApi = {
  async list(month: string): Promise<ScheduleRow[]> {
    await new Promise((r) => setTimeout(r, 250));
    const [y, m] = month.split("-").map(Number);
    return [
      {
        id: "1",
        title: "Tahsin Al-Quran",
        date: new Date(y, m - 1, 5, 7, 30).toISOString(),
        time: "07:30",
        teacher: "Ust. Ahmad",
        room: "Aula 1",
        type: "class",
        description: "Makhraj huruf dan tajwid dasar",
      },
      {
        id: "2",
        title: "Matematika",
        date: new Date(y, m - 1, 7, 9, 0).toISOString(),
        time: "09:00",
        teacher: "Bu Sari",
        room: "Ruang 5A",
        type: "class",
        description: "Pecahan campuran dan desimal",
      },
      {
        id: "3",
        title: "Ujian Tengah Semester",
        date: new Date(y, m - 1, 20, 8, 0).toISOString(),
        time: "08:00",
        teacher: "Panitia Ujian",
        room: "Aula Utama",
        type: "exam",
        description: "Ujian semua mata pelajaran",
      },
      {
        id: "4",
        title: "Kajian Akhlak",
        date: new Date(y, m - 1, 26, 10, 0).toISOString(),
        time: "10:00",
        teacher: "Ust. Husein",
        room: "school Utama",
        type: "event",
        description: "Kajian akhlakul karimah bersama ustadz tamu",
      },
    ];
  },
};

/* ================= Komponen ================= */
export default function StudentSchedule() {
  const navigate = useNavigate();
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  const [month, setMonth] = useState<string>(toMonthStr());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const schedulesQ = useQuery({
    queryKey: ["student-schedules", month],
    queryFn: () => studentScheduleApi.list(month),
    staleTime: 30_000,
  });

  const byDate = useMemo(() => {
    const map = new Map<string, ScheduleRow[]>();
    (schedulesQ.data ?? []).forEach((s) => {
      const d = new Date(s.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
      const existing = map.get(key) || [];
      existing.push(s);
      existing.sort((a, b) => a.time.localeCompare(b.time));
      map.set(key, existing);
    });
    return map;
  }, [schedulesQ.data]);

  // Kalender
  const days = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    const first = new Date(y, (m || 1) - 1, 1);
    const firstWeekday = (first.getDay() + 6) % 7;
    const total = new Date(y, m, 0).getDate();
    const cells: { label: number | null; dateKey: string | null }[] = [];

    for (let i = 0; i < firstWeekday; i++)
      cells.push({ label: null, dateKey: null });

    for (let d = 1; d <= total; d++) {
      const key = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(
        2,
        "0"
      )}`;
      cells.push({ label: d, dateKey: key });
    }

    while (cells.length % 7 !== 0) cells.push({ label: null, dateKey: null });

    return cells;
  }, [month]);

  const gotoPrev = () => {
    const [y, m] = month.split("-").map(Number);
    setMonth(toMonthStr(new Date(y, m - 2, 1)));
  };
  const gotoNext = () => {
    const [y, m] = month.split("-").map(Number);
    setMonth(toMonthStr(new Date(y, m, 1)));
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "class":
        return palette.primary;
      case "exam":
        return palette.error1;
      case "event":
        return palette.success1;
      default:
        return palette.primary;
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case "class":
        return "Kelas";
      case "exam":
        return "Ujian";
      case "event":
        return "Acara";
      default:
        return "Kelas";
    }
  };

  return (
    <div
      className="w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6">
          {/* Header */}
          <section className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Tombol back icon */}
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg border transition hover:bg-opacity-70"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                  color: palette.black1,
                }}
                title="Kembali"
              >
                <ArrowLeft size={18} />
              </button>

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
                <div className="text-base font-semibold">Jadwal Kelas Saya</div>
                <div className="text-sm" style={{ color: palette.black2 }}>
                  Klik tanggal untuk melihat jadwal belajar Anda.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Btn palette={palette} variant="outline" onClick={gotoPrev}>
                <ChevronLeft size={16} />
              </Btn>
              <div className="px-2 text-sm font-medium">
                {monthLabel(month)}
              </div>
              <Btn palette={palette} variant="outline" onClick={gotoNext}>
                <ChevronRight size={16} />
              </Btn>
            </div>
          </section>

          {/* Kalender */}
          <SectionCard palette={palette}>
            <div className="p-4 md:p-5">
              <div
                className="grid grid-cols-7 gap-2 text-xs mb-2"
                style={{ color: palette.black2 }}
              >
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                  <div key={d} className="text-center">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((c, i) => {
                  const schedules = c.dateKey
                    ? byDate.get(c.dateKey)
                    : undefined;
                  const selected = selectedDay === c.dateKey;
                  return (
                    <button
                      key={i}
                      disabled={!c.dateKey}
                      onClick={() => setSelectedDay(c.dateKey!)}
                      className="aspect-square rounded-lg border p-1 sm:p-2 text-left relative transition disabled:opacity-40"
                      style={{
                        borderColor: palette.silver1,
                        background: selected
                          ? palette.primary2
                          : palette.white1,
                      }}
                    >
                      <div className="text-[11px] sm:text-xs font-medium">
                        {c.label ?? ""}
                      </div>

                      {!!schedules && schedules.length > 0 && (
                        <div className="absolute right-1 top-1 flex gap-0.5">
                          {schedules.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: getTypeColor(s.type) }}
                            />
                          ))}
                        </div>
                      )}

                      {schedules && schedules[0] && (
                        <div
                          className="mt-1 text-[10px] sm:text-xs line-clamp-2 leading-snug"
                          style={{ color: palette.black2 }}
                        >
                          {schedules[0].time} {schedules[0].title}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          {/* Panel hari terpilih */}
          {selectedDay && (
            <SectionCard palette={palette}>
              <div className="p-4 md:p-5">
                <div className="font-medium mb-2">
                  Jadwal {dateLong(selectedDay)}
                </div>
                <div className="space-y-2">
                  {(byDate.get(selectedDay) ?? []).map((s) => (
                    <div
                      key={s.id}
                      className="flex items-start justify-between rounded-lg border px-3 py-3"
                      style={{ borderColor: palette.silver1 }}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className="h-2 w-2 rounded-full mt-1.5"
                          style={{ background: getTypeColor(s.type) }}
                        />
                        <div>
                          <div className="text-sm font-medium">{s.title}</div>
                          <div
                            className="text-xs flex items-center gap-3 mt-1"
                            style={{ color: palette.black2 }}
                          >
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {s.time}
                            </span>
                            {s.room && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} /> {s.room}
                              </span>
                            )}
                            {s.teacher && (
                              <span className="flex items-center gap-1">
                                <User size={12} /> {s.teacher}
                              </span>
                            )}
                          </div>
                          <div
                            className="text-xs mt-1"
                            style={{ color: palette.black2 }}
                          >
                            {getTypeLabel(s.type)}
                          </div>
                          {s.description && (
                            <div
                              className="text-xs mt-2 opacity-80"
                              style={{ color: palette.black2 }}
                            >
                              {s.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(byDate.get(selectedDay) ?? []).length === 0 && (
                    <div className="text-sm" style={{ color: palette.silver2 }}>
                      Tidak ada jadwal pada tanggal ini.
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </main>
    </div>
  );
}
