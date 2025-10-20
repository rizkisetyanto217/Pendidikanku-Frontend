import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/academic/SchoolStatistik.tsx
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// Theme & utils
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
// UI primitives & layout
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
// Icons
import { Users, UserCog, GraduationCap, BookOpen, CalendarDays, ArrowLeft, } from "lucide-react";
/* ========= helpers ========= */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const hijriLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const toLocalNoonISO = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x.toISOString();
};
/* ========= page ========= */
const SchoolStatistik = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const gregorianISO = toLocalNoonISO(new Date());
    // ---- data (dummy => ganti axios.get('/api/...') jika siap) ----
    const statsQ = useQuery({
        queryKey: ["school-stats"],
        queryFn: async () => {
            // const { data } = await axios.get("/api/a/school/statistics");
            // return data;
            return {
                stats: {
                    teachers: 26,
                    students: 342,
                    classes: 12,
                    subjects: 18,
                    events: 43,
                    studentsByLevel: {
                        "1": 60,
                        "2": 58,
                        "3": 56,
                        "4": 56,
                        "5": 56,
                        "6": 56,
                    },
                    studentsByGender: { male: 170, female: 172 },
                    eventsByMonth: [2, 3, 4, 6, 5, 3, 4, 4, 3, 5, 2, 2],
                },
            };
        },
        staleTime: 60_000,
    });
    const s = statsQ.data?.stats;
    const kpis = useMemo(() => s
        ? [
            { label: "Guru", value: s.teachers, icon: _jsx(UserCog, { size: 18 }) },
            { label: "Siswa", value: s.students, icon: _jsx(Users, { size: 18 }) },
            {
                label: "Kelas",
                value: s.classes,
                icon: _jsx(GraduationCap, { size: 18 }),
            },
            { label: "Mapel", value: s.subjects, icon: _jsx(BookOpen, { size: 18 }) },
            {
                label: "Agenda",
                value: s.events,
                icon: _jsx(CalendarDays, { size: 18 }),
            },
        ]
        : [], [s]);
    // Donut ratio guru:siswa
    const donutData = useMemo(() => {
        if (!s)
            return null;
        const total = s.teachers + s.students;
        const pctTeachers = s.teachers / total;
        const degTeachers = Math.round(pctTeachers * 360);
        return {
            pctTeachers: Math.round(pctTeachers * 100),
            pctStudents: 100 - Math.round(pctTeachers * 100),
            conic: `conic-gradient(${palette.primary} 0deg ${degTeachers}deg, ${palette.silver1} ${degTeachers}deg 360deg)`,
        };
    }, [s, palette]);
    // Bars level
    const levelBars = useMemo(() => {
        if (!s)
            return [];
        const entries = Object.entries(s.studentsByLevel);
        const max = Math.max(...entries.map(([, v]) => v), 1);
        return entries.map(([lvl, val]) => ({
            label: `Kls ${lvl}`,
            val,
            w: (val / max) * 100,
        }));
    }, [s]);
    // Bars events by month
    const monthBars = useMemo(() => {
        if (!s)
            return [];
        const arr = s.eventsByMonth;
        const max = Math.max(...arr, 1);
        const labels = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Agu",
            "Sep",
            "Okt",
            "Nov",
            "Des",
        ];
        return arr.map((v, i) => ({ label: labels[i], val: v, h: (v / max) * 72 })); // max 72px
    }, [s]);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Statistik Sekolah", gregorianDate: gregorianISO, hijriDate: hijriLong(gregorianISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsx("section", { className: "flex items-start gap-7", children: _jsxs("div", { className: "md:flex hidden gap-3 items-center ", children: [_jsx(Btn, { palette: palette, variant: "ghost", className: "inline-flex items-center gap-2", children: _jsx(ArrowLeft, { onClick: () => navigate(-1), size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Statistik Sekolah" })] }) }), _jsx("section", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3", children: kpis.map((k) => (_jsx(KpiTile, { palette: palette, label: k.label, value: k.value, icon: k.icon }, k.label))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-3", children: [_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5", children: [_jsx("div", { className: "font-medium mb-3", children: "Rasio Guru : Siswa" }), s && donutData ? (_jsxs("div", { className: "flex items-center gap-5", children: [_jsxs("div", { className: "relative h-28 w-28 rounded-full", style: { background: donutData.conic }, children: [_jsx("div", { className: "absolute inset-3 rounded-full", style: { background: palette.white1 } }), _jsxs("div", { className: "absolute inset-0 grid place-items-center text-sm font-semibold", children: [s.teachers, ":", s.students] })] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "h-2 w-2 rounded-full", style: { background: palette.primary } }), _jsx("span", { children: "Guru" }), _jsx(Badge, { palette: palette, variant: "outline", children: _jsxs("p", { style: { color: palette.black2 }, children: [donutData.pctTeachers, "%"] }) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "h-2 w-2 rounded-full", style: { background: palette.silver1 } }), _jsx("span", { children: "Siswa" }), _jsx(Badge, { palette: palette, variant: "outline", children: _jsxs("p", { style: { color: palette.black2 }, children: [donutData.pctStudents, "%"] }) })] })] })] })) : (_jsx(EmptyLoading, { palette: palette }))] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5", children: [_jsx("div", { className: "font-medium mb-3", children: "Distribusi Siswa per Kelas" }), s ? (_jsx("div", { className: "space-y-2", children: levelBars.map((b) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", style: { color: palette.black2 }, children: [_jsx("span", { children: b.label }), _jsx("span", { children: b.val })] }), _jsx("div", { className: "h-2.5 rounded-full", style: {
                                                                        background: palette.white2,
                                                                        border: `1px solid ${palette.silver1}`,
                                                                    }, children: _jsx("div", { className: "h-full rounded-full", style: {
                                                                            width: `${b.w}%`,
                                                                            background: palette.primary,
                                                                        } }) })] }, b.label))) })) : (_jsx(EmptyLoading, { palette: palette }))] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5", children: [_jsx("div", { className: "font-medium mb-3", children: "Agenda per Bulan" }), s ? (_jsx("div", { className: "h-40 flex items-end gap-2", children: monthBars.map((b) => (_jsxs("div", { className: "flex flex-col items-center gap-1", children: [_jsx("div", { className: "w-5 rounded-md", style: {
                                                                        height: `${b.h}px`,
                                                                        background: palette.primary,
                                                                    } }), _jsx("div", { className: "text-[10px]", style: { color: palette.black2 }, children: b.label })] }, b.label))) })) : (_jsx(EmptyLoading, { palette: palette }))] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5", children: [_jsx("div", { className: "font-medium mb-2", children: "Ringkasan" }), s ? (_jsxs("ul", { className: "list-disc pl-5 space-y-1 text-sm", children: [_jsxs("li", { children: [s.teachers, " guru aktif mengajar."] }), _jsxs("li", { children: [s.students, " siswa terdaftar pada ", s.classes, " kelas."] }), _jsxs("li", { children: [s.subjects, " mata pelajaran tersedia."] }), _jsxs("li", { children: [s.events, " agenda tercatat tahun ini."] })] })) : (_jsx(EmptyLoading, { palette: palette }))] }) })] })] })] }) })] }));
};
export default SchoolStatistik;
/* ===== UI helpers ===== */
function KpiTile({ palette, label, value, icon, }) {
    return (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 flex items-center gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: { background: palette.primary2, color: palette.primary }, children: icon }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: label }), _jsx("div", { className: "text-xl font-semibold", children: value })] })] }) }));
}
function EmptyLoading({ palette }) {
    return (_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Memuat data\u2026" }));
}
