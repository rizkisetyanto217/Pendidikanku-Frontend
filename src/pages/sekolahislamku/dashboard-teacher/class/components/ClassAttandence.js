import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/ClassAttandence.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { CheckSquare, Users, ArrowLeft, Save, Search, CalendarDays, } from "lucide-react";
import { fetchStudentsByClasses, } from "../types/teacherClass";
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const toYmd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    : "-";
const hijriLong = (iso) => new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
});
/* ========== Local storage for attendance ========== */
const LS_KEY = "teacher_attendance_v1";
const readStore = () => {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : {};
    }
    catch {
        return {};
    }
};
const writeStore = (v) => localStorage.setItem(LS_KEY, JSON.stringify(v));
/* ========== Row component ========== */
function StatusPill({ value, onChange, palette, }) {
    const opts = ["hadir", "online", "sakit", "izin", "alpa"];
    const variant = {
        hadir: "success",
        online: "info",
        sakit: "warning",
        izin: "secondary",
        alpa: "destructive",
    };
    return (_jsx("div", { className: "flex flex-wrap gap-1", children: opts.map((o) => (_jsx("button", { onClick: () => onChange(o), className: "h-7 px-2 rounded-lg text-sm font-medium", style: {
                background: value === o ? palette.primary2 : palette.white2,
                color: value === o ? palette.primary : palette.black1,
                border: `1px solid ${palette.silver1}`,
            }, title: o, children: o }, o))) }));
}
function StudentRow({ s, status, onChange, palette, }) {
    return (_jsxs("div", { className: "flex items-center justify-between rounded-xl border px-3 py-2", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm font-medium truncate", children: s.name }), s.nis && (_jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: ["NIS: ", s.nis] }))] }), _jsx(StatusPill, { value: status, onChange: onChange, palette: palette })] }));
}
/* ========== Page ========== */
export default function ClassAttandence() {
    const { id: classId } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
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
    const students = useMemo(() => map[classId ?? ""] ?? [], [map, classId]);
    // state absensi (muat dari localStorage bila ada)
    const initialStatuses = useMemo(() => {
        const store = readStore();
        return store[storageKey] ?? {};
    }, [storageKey]);
    const [statuses, setStatuses] = useState(initialStatuses);
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
        const c = { hadir: 0, online: 0, sakit: 0, izin: 0, alpa: 0 };
        for (const s of students) {
            const v = statuses[s.id] ?? "hadir";
            c[v] = (c[v] ?? 0) + 1;
        }
        return c;
    }, [statuses, students]);
    const handleChange = (sid, st) => setStatuses((prev) => ({ ...prev, [sid]: st }));
    const handleSave = () => {
        const store = readStore();
        const payload = {};
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
        if (!students?.length)
            return;
        // Jika belum ada di storage, set default semua "hadir"
        const hasStored = Object.keys(initialStatuses).length > 0;
        if (!hasStored) {
            const next = {};
            for (const s of students)
                next[s.id] = "hadir";
            setStatuses(next);
        }
        else {
            // Pastikan siswa baru juga default "hadir"
            setStatuses((prev) => {
                const next = { ...prev };
                for (const s of students) {
                    if (!next[s.id])
                        next[s.id] = "hadir";
                }
                return next;
            });
        }
    }, [students, initialStatuses]);
    function downloadFile(filename, content, mime = "text/plain") {
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
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Absensi Kelas", gregorianDate: todayISO, hijriDate: hijriLong(todayISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: "gap-1", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Absensi Kelas" })] }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckSquare, { size: 18, color: palette.quaternary }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "Absensi Hari Ini" }), _jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: [_jsx(CalendarDays, { size: 12, className: "inline mr-1" }), dateLong(todayISO), " \u2014 ", hijriLong(todayISO)] })] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs(Btn, { palette: palette, variant: "secondary", onClick: handleSave, children: [_jsx(Save, { size: 16, className: "mr-1" }), "Simpan"] }) })] }), _jsxs("div", { className: "px-4 pb-4 grid grid-cols-2 sm:grid-cols-5 gap-2", children: [_jsxs(Badge, { palette: palette, variant: "success", className: "justify-center", children: ["Hadir: ", counts.hadir] }), _jsxs(Badge, { palette: palette, variant: "info", className: "justify-center", children: ["Online: ", counts.online] }), _jsxs(Badge, { palette: palette, variant: "warning", className: "justify-center", children: ["Sakit: ", counts.sakit] }), _jsxs(Badge, { palette: palette, variant: "secondary", className: "justify-center", children: ["Izin: ", counts.izin] }), _jsxs(Badge, { palette: palette, variant: "destructive", className: "justify-center", children: ["Alpa: ", counts.alpa] })] })] }), _jsx(SectionCard, { palette: palette, className: "p-3", children: _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 h-10 w-full md:w-1/2", style: {
                                            borderColor: palette.silver1,
                                            background: palette.white2,
                                        }, children: [_jsx(Search, { size: 16 }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari nama siswa\u2026", className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 } })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: [_jsx(Users, { size: 14, className: "inline mr-1" }), filtered.length, " siswa", isFetching ? " • memuat…" : ""] }), _jsx("div", { className: "hidden md:flex items-center gap-2", children: _jsx(Btn, { size: "sm", variant: "outline", palette: palette, onClick: () => {
                                                                const next = {};
                                                                for (const s of filtered)
                                                                    next[s.id] = "hadir";
                                                                setStatuses((prev) => ({ ...prev, ...next }));
                                                            }, children: "Tandai Hadir Semua" }) })] }), filtered.length === 0 && (_jsx("div", { className: "rounded-xl border p-4 text-sm", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white2,
                                                    color: palette.black2,
                                                }, children: "Tidak ada siswa yang cocok." })), filtered.map((s) => (_jsx(StudentRow, { s: s, status: statuses[s.id] ?? "hadir", onChange: (v) => handleChange(s.id, v), palette: palette }, s.id)))] }) }), _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsxs(Btn, { palette: palette, variant: "secondary", onClick: handleSave, children: [_jsx(Save, { size: 16, className: "mr-1" }), "Simpan Absensi"] }), _jsx(Link, { to: "..", relative: "path", children: _jsx(Btn, { palette: palette, variant: "outline", children: "Selesai" }) })] })] })] }) })] }));
}
