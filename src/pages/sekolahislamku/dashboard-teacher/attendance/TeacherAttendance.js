import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/TeacherAttendance.tsx
import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, CheckSquare, Filter as FilterIcon, Users, Download, Check, } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "../../components/home/ParentSideBar";
import MiniBar from "../../components/ui/MiniBar";
import StatPill from "../../components/ui/StatPill";
/* ================= Date/Time Utils (timezone-safe) ================= */
/** Jadikan Date pada pukul 12:00 waktu lokal (hindari crossing hari) */
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
/** ISO string yang aman (siang lokal) dari Date */
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
/** Normalisasi ISO string apapun menjadi ISO siang lokal (tetap tanggal yang sama secara lokal) */
const normalizeISOToLocalNoon = (iso) => toLocalNoonISO(new Date(iso));
/** Parse nilai input[type="date"] -> ISO siang lokal ("YYYY-MM-DD" -> "YYYY-MM-DDT12:00:00.xxxZ") */
const parseDateInputToISO = (value) => new Date(`${value}T12:00:00`).toISOString();
/** Untuk value input[type="date"] dari ISO: selalu tampilkan YYYY-MM-DD sesuai waktu lokal */
const toDateInputValue = (iso) => {
    const d = new Date(iso);
    // geser ke "waktu lokal" agar slice(0,10) tidak kena offset
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
};
/** Format tanggal panjang (Gregorian, lokal) */
const dateLong = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
});
/** Format tanggal pendek (Gregorian, lokal) */
const dateShort = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
});
/** YYYY-MM-DD untuk nama file (aman lokal) */
/* tambahkan helper di blok Date/Time Utils (tepat di bawah dateShort) */
const hijriLong = (iso) => new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
});
const dateForFilename = (iso) => toDateInputValue(iso);
/* ================= Helpers/Constants ================= */
const STATUS_LABEL = {
    hadir: "Hadir",
    online: "Online",
    izin: "Izin",
    sakit: "Sakit",
    alpa: "Alpa",
};
const STATUS_BADGE = {
    hadir: "success",
    online: "info",
    izin: "secondary",
    sakit: "warning",
    alpa: "destructive",
};
const percent = (a, b) => b > 0 ? Math.round((a / b) * 100) : 0;
const toStatusFilter = (v) => v === "all" ||
    v === "hadir" ||
    v === "online" ||
    v === "izin" ||
    v === "sakit" ||
    v === "alpa"
    ? v
    : "all";
const toModeFilter = (v) => v === "all" || v === "onsite" || v === "online" ? v : "all";
/* ================= Dummy Data & API ================= */
const CLASSES = [
    { id: "tpa-a", name: "TPA A", time: "07:30", room: "Aula 1" },
    { id: "tpa-b", name: "TPA B", time: "09:30", room: "R. Tahfiz" },
];
const NAMA_DUMMY = [
    "Ahmad",
    "Fatimah",
    "Hasan",
    "Aisyah",
    "Umar",
    "Zainab",
    "Bilal",
    "Abdullah",
    "Amina",
    "Khalid",
    "Maryam",
    "Hafsa",
    "Yusuf",
    "Ali",
    "Hassan",
    "Husein",
    "Salim",
    "Rahma",
    "Saad",
    "Imran",
    "Farah",
    "Sofia",
    "Nadia",
    "Omar",
    "Layla",
    "Khadijah",
    "Usman",
    "Sumayyah",
    "Amir",
    "Lubna",
    "Ridwan",
    "Siti",
    "Abdurrahman",
    "Juwairiyah",
    "Talha",
    "Ammar",
    "Musa",
    "Ismail",
    "Hamzah",
    "Sahl",
];
function statusFor(i) {
    const m = i % 10;
    if (m === 0)
        return "izin";
    if (m === 1)
        return "sakit";
    if (m === 2)
        return "alpa";
    if (m === 3)
        return "online";
    return "hadir";
}
function timeFor(s) {
    if (s === "hadir" || s === "online") {
        const hh = 7 + Math.floor(Math.random() * 2); // 07–08
        const mm = 10 + Math.floor(Math.random() * 40);
        return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    }
    return undefined;
}
function modeFor(s) {
    if (s === "hadir")
        return "onsite";
    if (s === "online")
        return "online";
    return undefined;
}
async function fetchTeacherAttendance({ dateISO, classId, }) {
    const currentClass = classId
        ? CLASSES.find((c) => c.id === classId)
        : undefined;
    let size = 0;
    if (currentClass?.id === "tpa-a")
        size = 25;
    if (currentClass?.id === "tpa-b")
        size = 20;
    const students = Array.from({ length: size }).map((_, i) => {
        const st = statusFor(i);
        return {
            id: `${currentClass?.id}-${i + 1}`,
            name: NAMA_DUMMY[i % NAMA_DUMMY.length],
            status: st,
            mode: modeFor(st),
            time: timeFor(st),
        };
    });
    const stats = students.reduce((acc, s) => {
        acc.total += 1;
        acc[s.status] += 1;
        return acc;
    }, { total: 0, hadir: 0, online: 0, izin: 0, sakit: 0, alpa: 0 });
    return { dateISO, classes: CLASSES, currentClass, stats, students };
}
/* ================= Reusable row (mobile) ================= */
function AttendanceRow({ st, palette, }) {
    return (_jsxs("div", { className: "flex items-center justify-between rounded-xl border px-3 py-2", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsxs("div", { className: "text-sm", children: [_jsx("div", { className: "font-medium", children: st.name }), _jsxs("div", { className: "text-xs", style: { color: palette.silver2 }, children: [st.mode ? (st.mode === "onsite" ? "Tatap muka" : "Online") : "", " ", st.time ? `• ${st.time}` : ""] })] }), _jsx(Badge, { variant: STATUS_BADGE[st.status], palette: palette, children: STATUS_LABEL[st.status] })] }));
}
/* ================= CSV Export helper ================= */
function toCSV(rows) {
    const header = ["id", "nama", "status", "mode", "jam"];
    const body = rows.map((r) => [
        r.id,
        `"${r.name.replace(/"/g, '""')}"`,
        r.status,
        r.mode ?? "",
        r.time ?? "",
    ].join(","));
    return [header.join(","), ...body].join("\n");
}
function download(filename, text) {
    const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
/* ================= Page ================= */
export default function TeacherAttendance() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const [sp, setSp] = useSearchParams();
    const navigate = useNavigate();
    const { slug } = useParams();
    // Normalisasi qDate agar konsisten di siang lokal
    const rawSpDate = sp.get("date");
    const qDate = rawSpDate
        ? normalizeISOToLocalNoon(rawSpDate)
        : toLocalNoonISO(new Date());
    const classId = sp.get("class") ?? undefined;
    const status = toStatusFilter(sp.get("status"));
    const mode = toModeFilter(sp.get("mode"));
    const { data: s } = useQuery({
        queryKey: ["teacher-attendance", qDate, classId],
        queryFn: () => fetchTeacherAttendance({ dateISO: qDate, classId }),
        staleTime: 60_000,
    });
    // === Ringkasan dari students (single source of truth) ===
    const attendanceFromStudents = useMemo(() => {
        const list = s?.students ?? [];
        const byStatus = {
            hadir: 0,
            online: 0,
            sakit: 0,
            izin: 0,
            alpa: 0,
        };
        for (const st of list)
            byStatus[st.status] += 1;
        const total = list.length;
        const present = byStatus.hadir + byStatus.online;
        const presentPct = percent(present, total);
        return { total, present, presentPct, byStatus };
    }, [s?.students]);
    const filtered = useMemo(() => {
        if (!s)
            return [];
        return s.students.filter((st) => {
            const mStatus = status === "all" ? true : st.status === status;
            const mMode = mode === "all" ? true : st.mode === mode;
            return mStatus && mMode;
        });
    }, [s, status, mode]);
    const handleChange = useCallback((key, value) => {
        const next = new URLSearchParams(sp);
        next.set(key, value);
        setSp(next, { replace: true });
    }, [sp, setSp]);
    const handleGoDetail = useCallback((c) => {
        navigate(`/${slug}/guru/kehadiran/${c.id}`, {
            state: { classInfo: c, dateISO: qDate },
        });
    }, [navigate, slug, qDate]);
    const markAllPresent = useCallback(() => {
        if (!s?.currentClass || filtered.length === 0)
            return;
        const newRows = filtered.map((r) => ({
            ...r,
            status: "hadir",
            mode: "onsite",
            time: r.time ?? "07:30",
        }));
        const filename = `rekap-${s.currentClass.id}-${dateForFilename(qDate)}-all-hadir.csv`;
        download(filename, toCSV(newRows));
        alert("Contoh aksi: semua ditandai hadir dan file CSV diunduh.");
    }, [s?.currentClass, filtered, qDate]);
    const exportCSV = useCallback(() => {
        if (!s?.currentClass)
            return;
        const name = `rekap-${s.currentClass.id}-${dateForFilename(qDate)}.csv`;
        download(name, toCSV(filtered));
    }, [filtered, s?.currentClass, qDate]);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Kehadiran", gregorianDate: qDate, hijriDate: hijriLong(qDate) }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch", children: [_jsxs(SectionCard, { palette: palette, className: "lg:col-span-6", children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 flex items-center justify-between", children: [_jsxs("h3", { className: "text-base font-semibold tracking-tight flex items-center gap-2", children: [_jsx(CalendarDays, { size: 18, color: palette.quaternary }), " Kelas Hari Ini"] }), _jsx(Badge, { palette: palette, variant: "outline", children: dateShort(qDate) })] }), _jsx("div", { className: "px-4 md:px-5 pb-4 space-y-2", children: CLASSES.map((c) => (_jsxs("div", { className: "flex items-center justify-between rounded-xl border px-3 py-2", style: {
                                                            borderColor: palette.silver1,
                                                            background: palette.white1,
                                                        }, children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: c.name }), _jsx("div", { className: "text-xs", style: { color: palette.silver2 }, children: c.room ?? "-" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { palette: palette, variant: "outline", children: c.time }), _jsx(Btn, { palette: palette, size: "sm", onClick: () => handleGoDetail(c), children: "Kelola" })] })] }, c.id))) })] }), _jsx(SectionCard, { palette: palette, className: "lg:col-span-6", children: _jsxs("div", { className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-2 flex items-center gap-2", children: [_jsx(CheckSquare, { size: 16 }), " Ringkasan Kehadiran Hari Ini"] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [_jsx(StatPill, { palette: palette, label: "Total Siswa", value: attendanceFromStudents.total }), _jsx(StatPill, { palette: palette, label: "Hadir", value: attendanceFromStudents.byStatus.hadir })] }), _jsx("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [
                                                            "hadir",
                                                            "online",
                                                            "sakit",
                                                            "izin",
                                                            "alpa",
                                                        ].map((k) => (_jsx(MiniBar, { palette: palette, label: k.toUpperCase(), value: attendanceFromStudents.byStatus[k], total: attendanceFromStudents.total }, k))) }), _jsx("div", { className: "mt-4", children: _jsx(Btn, { palette: palette, size: "sm", onClick: () => navigate(`/${slug}/guru/attendance-management`, {
                                                                state: {
                                                                    className: s?.currentClass?.name,
                                                                    students: (s?.students ?? []).map((row) => ({
                                                                        id: row.id,
                                                                        name: row.name,
                                                                        status: row.status,
                                                                    })),
                                                                },
                                                            }), disabled: !s?.currentClass, children: "Kelola Absen" }) })] }) })] }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 font-medium flex items-center gap-2", children: [_jsx(FilterIcon, { size: 18, color: palette.quaternary }), " Filter"] }), _jsxs("div", { className: "px-4 md:px-5 pb-4 grid grid-cols-1 sm:grid-cols-4 gap-3", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Tanggal" }), _jsx("input", { type: "date", value: toDateInputValue(qDate), onChange: (e) => {
                                                                const iso = parseDateInputToISO(e.target.value);
                                                                handleChange("date", iso);
                                                            }, className: "rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 } })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Kelas" }), _jsxs("select", { value: classId ?? "", onChange: (e) => handleChange("class", e.target.value), className: "rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, children: [_jsx("option", { value: "", children: "\u2014 Pilih kelas \u2014" }), CLASSES.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Status" }), _jsxs("select", { value: status, onChange: (e) => handleChange("status", e.target.value), className: "rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, children: [_jsx("option", { value: "all", children: "Semua" }), _jsx("option", { value: "hadir", children: "Hadir" }), _jsx("option", { value: "online", children: "Online" }), _jsx("option", { value: "izin", children: "Izin" }), _jsx("option", { value: "sakit", children: "Sakit" }), _jsx("option", { value: "alpa", children: "Alpa" })] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Mode" }), _jsxs("select", { value: mode, onChange: (e) => handleChange("mode", e.target.value), className: "rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, children: [_jsx("option", { value: "all", children: "Semua" }), _jsx("option", { value: "onsite", children: "Tatap muka" }), _jsx("option", { value: "online", children: "Online" })] })] })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-0 hidden md:block", children: [_jsxs("div", { className: "p-4 md:p-5 pb-3 font-medium flex items-center gap-2", children: [_jsx(Users, { size: 18, color: palette.quaternary }), " Daftar Kehadiran"] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left", style: { borderBottom: `1px solid ${palette.silver1}` }, children: [_jsx("th", { className: "py-3 px-4 w-[45%]", children: "Nama Siswa" }), _jsx("th", { className: "py-3 px-4 w-[20%]", children: "Mode" }), _jsx("th", { className: "py-3 px-4 w-[20%]", children: "Jam" }), _jsx("th", { className: "py-3 px-4", children: "Status" })] }) }), _jsxs("tbody", { children: [!s?.currentClass && (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "py-6 px-4", children: _jsx("div", { className: "text-sm text-center", style: { color: palette.silver2 }, children: "Pilih kelas untuk melihat daftar siswa." }) }) })), s?.currentClass && filtered.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "py-6 px-4", children: _jsx("div", { className: "text-sm text-center", style: { color: palette.silver2 }, children: "Tidak ada data untuk filter saat ini." }) }) })), s?.currentClass &&
                                                                filtered.map((st) => (_jsxs("tr", { style: {
                                                                        borderBottom: `1px solid ${palette.silver1}`,
                                                                    }, children: [_jsx("td", { className: "py-3 px-4", children: st.name }), _jsx("td", { className: "py-3 px-4", children: st.mode
                                                                                ? st.mode === "onsite"
                                                                                    ? "Tatap muka"
                                                                                    : "Online"
                                                                                : "-" }), _jsx("td", { className: "py-3 px-4", children: st.time ?? "-" }), _jsx("td", { className: "py-3 px-4", children: _jsx(Badge, { variant: STATUS_BADGE[st.status], palette: palette, children: STATUS_LABEL[st.status] }) })] }, st.id)))] })] }) }), s?.currentClass && (_jsxs("div", { className: "px-4 md:px-5 py-3 flex gap-2 justify-end", children: [_jsxs(Btn, { palette: palette, variant: "white1", onClick: markAllPresent, children: [_jsx(Check, { className: "mr-1", size: 14 }), "Tandai semua hadir"] }), _jsxs(Btn, { palette: palette, onClick: exportCSV, children: [_jsx(Download, { className: "mr-1", size: 14 }), "Unduh rekap"] })] }))] }), _jsxs(SectionCard, { palette: palette, className: "p-3 space-y-2 md:hidden", children: [_jsxs("div", { className: "font-medium flex items-center gap-2 mb-1", children: [_jsx(Users, { size: 18, color: palette.quaternary }), " Daftar Kehadiran"] }), !s?.currentClass && (_jsx("div", { className: "rounded-xl border px-3 py-3 text-sm", style: {
                                                borderColor: palette.silver1,
                                                background: palette.white1,
                                                color: palette.silver2,
                                            }, children: "Pilih kelas terlebih dahulu untuk melihat daftar siswa." })), s?.currentClass && filtered.length === 0 && (_jsx("div", { className: "rounded-xl border px-3 py-3 text-sm", style: {
                                                borderColor: palette.silver1,
                                                background: palette.white1,
                                                color: palette.silver2,
                                            }, children: "Tidak ada data untuk filter saat ini." })), s?.currentClass &&
                                            filtered.map((st) => (_jsx(AttendanceRow, { st: st, palette: palette }, st.id))), s?.currentClass && (_jsxs("div", { className: "pt-2 flex gap-2", children: [_jsx(Btn, { palette: palette, variant: "white1", onClick: markAllPresent, className: "w-1/2", children: "Tandai semua" }), _jsx(Btn, { palette: palette, onClick: exportCSV, className: "w-1/2", children: "Unduh" })] }))] })] })] }) })] }));
}
