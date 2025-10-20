import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/academic/SchoolActiveClass.tsx
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
import { Filter as FilterIcon, ArrowLeft, } from "lucide-react";
/* ============== Helpers ============== */
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
/* ============== Page ============== */
const SchoolActiveClass = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const gregorianISO = toLocalNoonISO(new Date());
    // Query data (dummy)
    const classesQ = useQuery({
        queryKey: ["active-classes"],
        queryFn: async () => {
            // Ganti ke axios.get("/api/a/classes/active") nanti
            const dummy = {
                list: Array.from({ length: 8 }).map((_, i) => ({
                    id: `cls-${i + 1}`,
                    name: `Kelas ${i + 1}${["A", "B"][i % 2]}`,
                    academic_year: "2025/2026",
                    homeroom_teacher: `Ustadz/Ustadzah ${i + 1}`,
                    student_count: 25 + (i % 6),
                    status: i % 5 === 0 ? "inactive" : "active",
                })),
            };
            return dummy;
        },
        staleTime: 60_000,
    });
    const rows = useMemo(() => classesQ.data?.list ?? [], [classesQ.data]);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Kelas Aktif", gregorianDate: gregorianISO, hijriDate: hijriLong(gregorianISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("section", { className: "md:flex hidden items-center gap-7 ", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl rounded-t-none font-bold ", children: _jsx(Btn, { onClick: () => navigate(-1), palette: palette, variant: "ghost", children: _jsx(ArrowLeft, { size: 20, className: "cursor-pointer" }) }) }), _jsx("div", { className: "flex-1 min-w-0", children: _jsx("div", { className: "text-lg font-semibold", children: "Daftar Kelas Aktif" }) })] }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 font-medium flex items-center gap-2", children: [_jsx(FilterIcon, { size: 18 }), " Daftar Kelas"] }), _jsxs("div", { className: "px-4 md:px-5 pb-4 overflow-x-auto", children: [_jsxs("table", { className: "w-full text-sm min-w-[760px]", children: [_jsx("thead", { className: "text-left", style: { color: palette.black2 }, children: _jsxs("tr", { className: "border-b", style: { borderColor: palette.silver1 }, children: [_jsx("th", { className: "py-2 pr-4", children: "Nama Kelas" }), _jsx("th", { className: "py-2 pr-4", children: "Wali Kelas" }), _jsx("th", { className: "py-2 pr-4", children: "Tahun Ajaran" }), _jsx("th", { className: "py-2 pr-4", children: "Jumlah Siswa" }), _jsx("th", { className: "py-2 pr-4", children: "Status" })] }) }), _jsx("tbody", { className: "divide-y", style: { borderColor: palette.silver1 }, children: rows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "py-8 text-center", style: { color: palette.black2 }, children: "Tidak ada data kelas." }) })) : (rows.map((r) => (_jsxs("tr", { children: [_jsx("td", { className: "py-3 pr-4 font-medium", children: r.name }), _jsx("td", { className: "py-3 pr-4", children: r.homeroom_teacher }), _jsx("td", { className: "py-3 pr-4", children: r.academic_year }), _jsx("td", { className: "py-3 pr-4", children: r.student_count }), _jsx("td", { className: "py-3 pr-4", children: _jsx(Badge, { palette: palette, variant: r.status === "active" ? "success" : "outline", children: r.status === "active" ? "Aktif" : "Nonaktif" }) })] }, r.id)))) })] }), _jsxs("div", { className: "pt-3 text-sm", style: { color: palette.black2 }, children: ["Menampilkan ", rows.length, " kelas"] })] })] })] })] }) })] }));
};
export default SchoolActiveClass;
