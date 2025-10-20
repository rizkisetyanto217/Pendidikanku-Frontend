import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/ParentChildDetail.tsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, BookOpen, CheckCircle2, Clock, FileSpreadsheet, MessageSquare, NotebookPen, Phone, Mail, ChevronRight, } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, ProgressBar, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "../../components/home/ParentTopBar";
import ParentSidebar from "../../components/home/ParentSideBar";
/* ===== Date helpers (timezone-safe) ===== */
// jadikan Date ke pukul 12:00 waktu lokal
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const normalizeISOToLocalNoon = (iso) => iso ? toLocalNoonISO(new Date(iso)) : undefined;
// formatter tampilan (pakai ISO yang sudah “siang lokal”)
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    : "-";
const dateShort = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
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
/* ===== Fake API (dibuat local-noon safe) ===== */
async function fetchChildDetail() {
    const now = new Date();
    const todayIso = toLocalNoonISO(now);
    const minusDays = (n) => toLocalNoonISO(new Date(now.getTime() - n * 864e5));
    return {
        parentName: "Bapak/Ibu",
        child: {
            id: "c1",
            name: "Ahmad",
            className: "TPA A",
            iqraLevel: "Iqra 2",
            memorizationJuz: 0.6,
            lastScore: 88,
        },
        stats: {
            hadirCount: 18,
            totalSessions: 20,
            avgScore: 86,
            memorizationJuz: 0.6,
            iqraLevel: "Iqra 2",
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
        attendanceHistory: [
            { date: todayIso, status: "hadir", mode: "onsite", time: "07:28" },
            { date: minusDays(1), status: "hadir", mode: "online", time: "07:35" },
            { date: minusDays(2), status: "izin" },
            { date: minusDays(3), status: "hadir", mode: "onsite", time: "07:31" },
            { date: minusDays(4), status: "sakit" },
            { date: minusDays(5), status: "hadir", mode: "onsite", time: "07:29" },
            { date: minusDays(6), status: "hadir", mode: "onsite", time: "07:33" },
        ],
        notesHistory: [
            {
                date: minusDays(1),
                informasiUmum: "Latihan tajwid: mad thabi'i.",
                materiPersonal: "Muroja'ah Iqra 2 halaman 10–12",
                nilai: 90,
                pr: "Latihan bacaan mad pada Iqra 2 halaman 13–14",
            },
            {
                date: minusDays(3),
                informasiUmum: "Praktik adab di kelas.",
                penilaianPersonal: "Perlu diingatkan tidak bercanda saat teman membaca.",
                hafalan: "Al-Fatihah 1–7",
            },
        ],
        contacts: {
            teacherName: "Ustadz Ali",
            phone: "+62 812-1111-2222",
            email: "ust.ali@sekolahislamku.id",
        },
    };
}
/* ===== Page ===== */
export default function StudentProgress() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    const { data } = useQuery({
        queryKey: ["parent-child-detail"],
        queryFn: fetchChildDetail,
        staleTime: 60_000,
    });
    const child = data?.child;
    // ISO untuk TopBar (local-noon)
    const gregorianISO = toLocalNoonISO(new Date());
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: data?.parentName, gregorianDate: gregorianISO, hijriDate: hijriLong(gregorianISO), showBack: isFromMenuUtama }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-8 min-w-0 ", children: [_jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-full flex items-center justify-center", style: { background: palette.primary2 }, children: _jsx(BookOpen, { size: 18, color: palette.primary }) }), _jsxs("div", { children: [_jsxs("div", { className: "font-semibold flex items-center gap-2", children: [child?.name ?? "—", _jsx(Badge, { variant: "outline", palette: palette, children: child?.className ?? "Kelas" })] }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: dateLong(gregorianISO) })] })] }), _jsx("div", { className: "flex flex-col gap-2 md:flex-row", children: _jsx(Link, { to: "raport", className: "w-full md:w-auto", children: _jsxs(Btn, { size: "sm", variant: "default", palette: palette, children: [_jsx(FileSpreadsheet, { size: 16 }), " Lihat Rapor"] }) }) })] }), _jsxs("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-3", children: [_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Kehadiran" }), _jsxs("div", { className: "mt-1 text-sm", children: [data?.stats.hadirCount, "/", data?.stats.totalSessions, " sesi"] })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Hafalan" }), _jsxs("div", { className: "mt-2", children: [_jsx(ProgressBar, { value: (Math.min(2, data?.stats.memorizationJuz ?? 0) / 2) *
                                                                        100, palette: palette }), _jsxs("div", { className: "mt-1 text-sm", style: { color: palette.black2 }, children: ["~ ", data?.stats.memorizationJuz ?? 0, " Juz"] })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Nilai Rata-rata" }), _jsx("div", { className: "mt-1 text-lg font-semibold", children: data?.stats.avgScore ?? "-" })] })] })] }), data?.today && (_jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(CalendarDays, { size: 18, color: palette.quaternary }), " ", "Ringkasan Hari Ini"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3", children: [_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Absensi" }), _jsxs("div", { className: "mt-2 flex items-center gap-2", children: [data.today.attendance.status === "hadir" && (_jsxs(Badge, { variant: "success", palette: palette, children: [_jsx(CheckCircle2, { size: 12, className: "mr-1" }), " Hadir"] })), data.today.attendance.status === "online" && (_jsxs(Badge, { variant: "info", palette: palette, children: [_jsx(Clock, { size: 12, className: "mr-1" }), " Online"] })), data.today.attendance.status === "sakit" && (_jsx(Badge, { variant: "warning", palette: palette, children: "Sakit" })), data.today.attendance.status === "izin" && (_jsx(Badge, { variant: "secondary", palette: palette, children: "Izin" })), data.today.attendance.status === "alpa" && (_jsx(Badge, { variant: "destructive", palette: palette, children: "Alpa" })), data.today.attendance.time && (_jsxs("span", { className: "text-sm", style: { color: palette.silver2 }, children: ["\u2022 ", data.today.attendance.time] }))] }), data.today.attendance.mode && (_jsx("div", { className: "mt-1 text-sm", style: { color: palette.silver2 }, children: data.today.attendance.mode === "onsite"
                                                                ? "Tatap muka"
                                                                : "Online" }))] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Nilai" }), _jsx("div", { className: "mt-2 text-lg font-semibold", children: typeof data.today.nilai === "number"
                                                                ? data.today.nilai
                                                                : "-" })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Hafalan" }), _jsx("div", { className: "mt-2 text-sm", children: data.today.hafalan ?? "-" })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "PR" }), _jsx("div", { className: "mt-2 text-sm", children: data.today.pr ?? "-" })] })] }), _jsxs("div", { className: "mt-3 grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Informasi Umum" }), _jsx("p", { className: "mt-1 text-sm", children: data.today.informasiUmum })] }), (data.today.materiPersonal ||
                                                    data.today.penilaianPersonal) && (_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Catatan Personal" }), data.today.materiPersonal && (_jsxs("p", { className: "mt-1 text-sm", children: [_jsx("span", { className: "font-medium", children: "Materi:" }), " ", data.today.materiPersonal] })), data.today.penilaianPersonal && (_jsxs("p", { className: "mt-1 text-sm", children: [_jsx("span", { className: "font-medium", children: "Penilaian:" }), " ", data.today.penilaianPersonal] }))] }))] })] })), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "mb-3 flex items-center gap-2 font-medium", children: [_jsx(CalendarDays, { size: 18, color: palette.quaternary }), "Riwayat Absensi (7 Hari)"] }), _jsx("div", { className: "grid grid-cols-1 gap-2", children: (data?.attendanceHistory ?? []).map((a, i) => (_jsxs("div", { className: "flex items-center justify-between rounded-xl border px-3 py-2", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white2,
                                                }, children: [_jsxs("div", { className: "text-sm", children: [_jsx("div", { className: "font-medium", children: dateShort(normalizeISOToLocalNoon(a.date)) }), _jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: [a.mode
                                                                        ? a.mode === "onsite"
                                                                            ? "Tatap muka"
                                                                            : "Online"
                                                                        : "", " ", a.time ? `• ${a.time}` : ""] })] }), _jsxs("div", { children: [a.status === "hadir" && (_jsx(Badge, { variant: "success", palette: palette, children: "Hadir" })), a.status === "online" && (_jsx(Badge, { variant: "info", palette: palette, children: "Online" })), a.status === "izin" && (_jsx(Badge, { variant: "secondary", palette: palette, children: "Izin" })), a.status === "sakit" && (_jsx(Badge, { variant: "warning", palette: palette, children: "Sakit" })), a.status === "alpa" && (_jsx(Badge, { variant: "destructive", palette: palette, children: "Alpa" }))] })] }, i))) }), _jsx("div", { className: "pt-6", children: _jsx(Link, { to: "absensi", className: "block", children: _jsxs(Btn, { variant: "outline", size: "sm", palette: palette, className: "w-full justify-center", children: ["Lihat selengkapnya", " ", _jsx(ChevronRight, { className: "ml-1", size: 16 })] }) }) })] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(NotebookPen, { size: 18, color: palette.quaternary }), " Riwayat Catatan & Hafalan"] }), _jsxs("div", { className: "grid grid-cols-1 gap-3", style: { color: palette.black2 }, children: [(data?.notesHistory ?? []).map((n, i) => (_jsxs("div", { className: "rounded-xl border p-3", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white2,
                                                        color: palette.black2,
                                                    }, children: [_jsx("div", { className: "text-sm mb-1", style: { color: palette.black2 }, children: dateLong(normalizeISOToLocalNoon(n.date)) }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Info Umum:" }), " ", n.informasiUmum] }), n.materiPersonal && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Materi:" }), " ", n.materiPersonal] })), n.hafalan && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Hafalan:" }), " ", n.hafalan] })), n.penilaianPersonal && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Penilaian:" }), " ", n.penilaianPersonal] })), typeof n.nilai === "number" && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Nilai:" }), " ", n.nilai] })), n.pr && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "PR:" }), " ", n.pr] }))] })] }, i))), _jsx("div", { className: "pt-3", children: _jsx(Link, { to: "catatan-hasil", className: "block", children: _jsxs(Btn, { variant: "outline", size: "sm", palette: palette, className: "w-full justify-center", children: ["Lihat selengkapnya", " ", _jsx(ChevronRight, { className: "ml-1", size: 16 })] }) }) })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(MessageSquare, { size: 18, color: palette.quaternary }), " Kontak Guru"] }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: data?.contacts.teacherName }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm", style: { color: palette.black2 }, children: [data?.contacts.phone && (_jsxs("a", { href: `tel:${data.contacts.phone.replace(/\s+/g, "")}`, className: "inline-flex items-center gap-1", "aria-label": `Telepon ${data.contacts.phone}`, children: [_jsx(Phone, { size: 14 }), " ", data.contacts.phone] })), data?.contacts.email && (_jsxs("a", { href: `mailto:${data.contacts.email}`, className: "inline-flex items-center gap-1", "aria-label": `Email ${data.contacts.email}`, children: [_jsx(Mail, { size: 14 }), " ", data.contacts.email] }))] })] }), _jsx("div", { className: "flex flex-col gap-2 md:flex-row", children: _jsx(Link, { to: "/student/komunikasi", className: "w-full md:w-auto", children: _jsxs(Btn, { variant: "default", palette: palette, className: "w-full md:w-auto", children: [_jsx(MessageSquare, { size: 16 }), " Kirim Pesan"] }) }) })] })] })] })] }) })] }));
}
