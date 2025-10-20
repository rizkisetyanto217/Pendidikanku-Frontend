import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/dashboard-school/StudentDashboard.tsx
import { useQuery } from "@tanstack/react-query";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentTopBar from "../components/home/ParentTopBar";
import ParentSidebar from "../components/home/ParentSideBar";
import ChildSummaryCard from "@/pages/sekolahislamku/components/card/ChildSummaryCard";
import BillsSectionCard from "@/pages/sekolahislamku/components/card/BillsSectionCard";
import TodayScheduleCard from "@/pages/sekolahislamku/components/card/TodayScheduleCard";
import AnnouncementsList from "@/pages/sekolahislamku/components/card/AnnouncementsListCard";
import { mapSessionsToTodaySchedule, mockTodaySchedule, } from "@/pages/sekolahislamku/dashboard-school/types/TodaySchedule";
import { BookOpen, GraduationCap, UserCog, Users } from "lucide-react";
import { SectionCard } from "@/pages/sekolahislamku/components/ui/Primitives";
/* ---------- Date helpers (timezone-safe) ---------- */
// jadikan Date ke pukul 12:00 waktu lokal
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const normalizeISOToLocalNoon = (iso) => iso ? toLocalNoonISO(new Date(iso)) : undefined;
// formatter tampilan (pakai ISO yang sudah “siang lokal”)
const dateFmt = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    : "-";
// hijriah (Umm al-Qura)
const hijriLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
function KpiTile({ palette, label, value, icon, }) {
    return (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 flex items-center gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: { background: palette.primary2, color: palette.primary }, children: icon }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: label }), _jsx("div", { className: "text-xl font-semibold", children: value })] })] }) }));
}
/* ---------- Fake API ---------- */
async function fetchParentHome() {
    const now = new Date();
    const todayISO = toLocalNoonISO(now); // ✅ “siang lokal”
    const inDays = (n) => toLocalNoonISO(new Date(now.getTime() + n * 864e5));
    return Promise.resolve({
        parentName: "Bapak/Ibu",
        // hijri dari server opsional — kita tetap hitung sendiri agar konsisten
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
        },
        today: {
            attendance: { status: "hadir", mode: "onsite", time: "07:28" },
            informasiUmum: "Hari ini belajar ngaji & praktik sholat. Evaluasi wudhu dilakukan bergiliran.",
            nilai: 89,
            materiPersonal: "Membaca Al-Baqarah 255–257",
            penilaianPersonal: "Fokus meningkat, makhraj lebih baik; perhatikan mad thabi'i.",
            hafalan: "An-Naba 1–10",
            pr: "An-Naba 11–15 tambah hafalan",
        },
        announcements: [
            {
                id: "a1",
                title: "Ujian Tahfiz Pekan Depan",
                date: todayISO, // ✅
                body: "Mohon dampingi anak dalam muraja'ah surat Al-Balad s.d. Asy-Syams.",
                type: "info",
            },
        ],
        bills: [
            {
                id: "b1",
                title: "SPP Agustus 2025",
                amount: 150000,
                dueDate: inDays(5), // ✅
                status: "unpaid",
            },
        ],
        sessionsToday: [
            {
                class_attendance_sessions_title: "Tahsin Kelas",
                class_attendance_sessions_general_info: "Aula 1",
                class_attendance_sessions_date: todayISO, // ✅
            },
            {
                class_attendance_sessions_title: "Hafalan Juz 30",
                class_attendance_sessions_general_info: "R. Tahfiz",
                class_attendance_sessions_date: todayISO, // ✅
            },
        ],
    });
}
/* ---------- Helpers ---------- */
const formatIDR = (n) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
}).format(n);
/* ---------- Page ---------- */
export default function StudentDashboard() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const { data } = useQuery({
        queryKey: ["parent-home-single"],
        queryFn: fetchParentHome,
        staleTime: 60_000,
    });
    // normalisasi dulu (jaga-jaga kalau nanti dari API nyata)
    const gregorianISO = normalizeISOToLocalNoon(data?.gregorianDate) ?? toLocalNoonISO(new Date());
    const todayScheduleItems = data?.sessionsToday?.length
        ? mapSessionsToTodaySchedule(
        // kalau mapper butuh ISO, pastikan “siang lokal”
        data.sessionsToday.map((s) => ({
            ...s,
            class_attendance_sessions_date: normalizeISOToLocalNoon(s.class_attendance_sessions_date),
        })))
        : mockTodaySchedule;
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: data?.parentName, gregorianDate: gregorianISO, hijriDate: hijriLong(gregorianISO) }), _jsx("main", { className: "w-full px-4 md:px-6 py-4   md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
                                        { label: "Guru", value: 26, icon: _jsx(UserCog, { size: 18 }) },
                                        { label: "Siswa", value: 342, icon: _jsx(Users, { size: 18 }) },
                                        {
                                            label: "Program",
                                            value: 12,
                                            icon: _jsx(GraduationCap, { size: 18 }),
                                        },
                                        { label: "Kelas", value: 18, icon: _jsx(BookOpen, { size: 18 }) },
                                    ].map((k) => (_jsx(KpiTile, { palette: palette, label: k.label, value: k.value, icon: k.icon }, k.label))) }), _jsx("section", { children: _jsx(ChildSummaryCard, { child: data?.child, today: data?.today, palette: palette, detailPath: "detail", detailState: {
                                            child: data?.child,
                                            today: data?.today,
                                        }, todayDisplay: "compact" }) }), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-12 gap-4 lg:items-stretch", children: [_jsx("div", { className: "lg:col-span-8", children: _jsx(BillsSectionCard, { palette: palette, 
                                                // bills={homeQ.data?.finance.outstandingBills ?? []}
                                                dateFmt: dateFmt, formatIDR: formatIDR, seeAllPath: "all-invoices", getPayHref: (b) => `/tagihan/${b.id}` }) }), _jsx("div", { className: "lg:col-span-4", children: _jsx(TodayScheduleCard, { palette: palette, title: "Jadwal Hari Ini", items: todayScheduleItems, seeAllPath: "all-schedule" }) })] }), _jsx("section", { children: _jsx(AnnouncementsList, { palette: palette, items: data?.announcements ?? [], seeAllPath: "announcements", seeAllState: {
                                            items: data?.announcements,
                                            heading: "Semua Pengumuman",
                                        }, getDetailHref: (a) => `/murid/pengumuman/detail/${a.id}`, showActions: false }) })] })] }) })] }));
}
