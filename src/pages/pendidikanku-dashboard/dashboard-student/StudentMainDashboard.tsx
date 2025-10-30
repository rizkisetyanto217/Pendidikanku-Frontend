// src/pages/sekolahislamku/dashboard-school/StudentDashboard.tsx
import { useQuery } from "@tanstack/react-query";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";

import ParentTopBar from "../components/home/ParentTopBar";
import ParentSidebar from "../components/home/ParentSideBar";
import ChildSummaryCard from "@/pages/pendidikanku-dashboard/components/card/ChildSummaryCard";
import BillsSectionCard from "@/pages/pendidikanku-dashboard/components/card/BillsSectionCard";
import TodayScheduleCard from "@/pages/pendidikanku-dashboard/components/card/TodayScheduleCard";
// import AnnouncementsList from "@/pages/pendidikanku-dashboard/components/card/AnnouncementsListCard";

import {
  TodayScheduleItem,
  mapSessionsToTodaySchedule,
  mockTodaySchedule,
} from "@/pages/pendidikanku-dashboard/dashboard-school/calender/TodaySchedule";
import { useState } from "react";

/* ---------- Types ---------- */
interface ChildDetail {
  id: string;
  name: string;
  className: string;
  avatarUrl?: string;
  attendanceToday?: "present" | "online" | "absent" | null;
  memorizationJuz?: number;
  iqraLevel?: string;
  lastScore?: number;
}
interface Announcement {
  id: string;
  title: string;
  date: string;
  body: string;
  type?: "info" | "warning" | "success";
}
interface BillItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "unpaid" | "paid" | "overdue";
}
type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpa" | "online";
type AttendanceMode = "onsite" | "online";
interface TodaySummary {
  attendance: {
    status: AttendanceStatus;
    mode?: AttendanceMode;
    time?: string;
  };
  informasiUmum: string;
  nilai?: number;
  materiPersonal?: string;
  penilaianPersonal?: string;
  hafalan?: string;
  pr?: string;
}

/* ---------- Date helpers (timezone-safe) ---------- */
const atLocalNoon = (d: Date) => {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x;
};
const toLocalNoonISO = (d: Date) => atLocalNoon(d).toISOString();
const normalizeISOToLocalNoon = (iso?: string) =>
  iso ? toLocalNoonISO(new Date(iso)) : undefined;

const dateFmt = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";
const hijriLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

/* ---------- Fake API ---------- */
async function fetchParentHome() {
  const now = new Date();
  const todayISO = toLocalNoonISO(now);
  const inDays = (n: number) =>
    toLocalNoonISO(new Date(now.getTime() + n * 864e5));

  return Promise.resolve({
    parentName: "Bapak/Ibu",
    hijriDate: hijriLong(todayISO),
    gregorianDate: todayISO,
    child: {
      id: "c1",
      name: "Ahmad",
      className: "TPA A",
      attendanceToday: "present",
      memorizationJuz: 0.6,
      iqraLevel: "Iqra 2",
      lastScore: 88,
    } as ChildDetail,
    today: {
      attendance: { status: "hadir", mode: "onsite", time: "07:28" },
      informasiUmum:
        "Hari ini belajar ngaji & praktik sholat. Evaluasi wudhu dilakukan bergiliran.",
      nilai: 89,
      materiPersonal: "Membaca Al-Baqarah 255–257",
      penilaianPersonal:
        "Fokus meningkat, makhraj lebih baik; perhatikan mad thabi'i.",
      hafalan: "An-Naba 1–10",
      pr: "An-Naba 11–15 tambah hafalan",
    } as TodaySummary,
    announcements: [
      {
        id: "a1",
        title: "Ujian Tahfiz Pekan Depan",
        date: todayISO,
        body: "Mohon dampingi anak ...",
        type: "info",
      },
    ],
    bills: [
      {
        id: "b1",
        title: "SPP Agustus 2025",
        amount: 150000,
        dueDate: inDays(5),
        status: "unpaid",
      },
    ],
    sessionsToday: [
      {
        class_attendance_sessions_title: "Tahsin Kelas",
        class_attendance_sessions_general_info: "Aula 1",
        class_attendance_sessions_date: todayISO,
      },
      {
        class_attendance_sessions_title: "Hafalan Juz 30",
        class_attendance_sessions_general_info: "R. Tahfiz",
        class_attendance_sessions_date: todayISO,
      },
    ],
  });
}

/* ---------- Helpers ---------- */
const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

/* ---------- Page ---------- */
export default function StudentDashboard() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  const { data } = useQuery({
    queryKey: ["parent-home-single"],
    queryFn: fetchParentHome,
    staleTime: 60_000,
  });

  const gregorianISO =
    normalizeISOToLocalNoon(data?.gregorianDate) ?? toLocalNoonISO(new Date());
  const todayScheduleItems: TodayScheduleItem[] = data?.sessionsToday?.length
    ? mapSessionsToTodaySchedule(
        data.sessionsToday.map((s) => ({
          ...s,
          class_attendance_sessions_date: normalizeISOToLocalNoon(
            s.class_attendance_sessions_date
          )!,
        }))
      )
    : mockTodaySchedule;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      // ❗ Mobile-only: tutup overflow horizontal, kasih safe-area padding
      className="min-h-screen w-full overflow-x-hidden sm:overflow-x-visible"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* (Optional) TopBar/Sidebar tetap seperti semula jika sudah berfungsi baik */}
      <main className="w-full pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div
          // ❗ Mobile padding agar konten tak “nempel tepi” & tak memicu scroll horizontal
          className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 sm:px-6"
        >
          <div className="flex-1 flex flex-col space-y-6 min-w-0">
            <section className="min-w-0 overflow-hidden">
              <ChildSummaryCard
                child={data?.child}
                today={data?.today}
                palette={palette}
                detailPath="detail"
                detailState={{ child: data?.child, today: data?.today }}
                todayDisplay="compact"
              />
            </section>

            <section
              // ❗ Jaga grid tidak melebar di mobile
              className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:items-stretch min-w-0"
            >
              <div className="lg:col-span-8 min-w-0 overflow-hidden">
                <BillsSectionCard
                  palette={palette}
                  dateFmt={dateFmt}
                  formatIDR={formatIDR}
                  seeAllPath="all-invoices"
                  getPayHref={(b) => `/tagihan/${b.id}`}
                />
              </div>

              <div className="lg:col-span-4 min-w-0 overflow-hidden">
                <TodayScheduleCard
                  palette={palette}
                  title="Jadwal Hari Ini"
                  items={todayScheduleItems}
                  seeAllPath="all-schedule"
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}