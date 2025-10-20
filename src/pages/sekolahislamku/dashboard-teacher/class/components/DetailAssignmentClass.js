import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { ArrowLeft, CalendarDays, ClipboardList, Users } from "lucide-react";
// ⬇️ Pakai sumber yang sama dengan halaman list
import { QK, fetchAssignmentsByClass, } from "../types/assignments";
/* ========= Helpers tanggal ========= */
const dateLong = (isoStr) => isoStr
    ? new Date(isoStr).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    : "-";
/* ========= Page ========= */
export default function DetailAssignmentClass() {
    const { id: classId = "", assignmentId = "" } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // Ambil list tugas via query & cache yg sama
    const { data: assignments = [], isFetching } = useQuery({
        queryKey: QK.ASSIGNMENTS(classId),
        queryFn: () => fetchAssignmentsByClass(classId),
        enabled: !!classId,
        staleTime: 2 * 60_000,
    });
    // Pilih item
    const assignment = useMemo(() => assignments.find((a) => a.id === assignmentId), [assignments, assignmentId]);
    const hijriToday = useMemo(() => new Date().toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }), []);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Tugas", gregorianDate: new Date().toISOString(), hijriDate: hijriToday }), _jsx("main", { className: "mx-auto max-w-5xl px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsxs(Btn, { palette: palette, variant: "ghost", size: "sm", onClick: () => navigate(-1), children: [_jsx(ArrowLeft, { size: 16, className: "mr-1" }), "Kembali"] }), _jsxs(SectionCard, { palette: palette, className: "p-5 space-y-4", children: [isFetching && (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Memuat detail tugas\u2026" })), !isFetching && assignment && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-1", children: assignment.title }), _jsxs("p", { className: "text-sm", style: { color: palette.silver2 }, children: [assignment.author ? (_jsxs(_Fragment, { children: ["Oleh ", assignment.author, " \u2022 "] })) : null, "Dibuat ", dateLong(assignment.createdAt)] })] }), assignment.description && (_jsx("p", { className: "text-sm", style: { color: palette.black2 }, children: assignment.description })), _jsxs("div", { className: "flex flex-wrap gap-2 mt-3 text-sm", children: [assignment.dueDate && (_jsxs(Badge, { palette: palette, variant: "secondary", children: [_jsx(CalendarDays, { size: 14, className: "mr-1" }), "Batas: ", dateLong(assignment.dueDate)] })), (assignment.totalSubmissions ?? 0) > 0 && (_jsxs(Badge, { palette: palette, variant: "outline", children: [_jsx(Users, { size: 14, className: "mr-1" }), assignment.totalSubmissions, " Pengumpulan"] })), typeof assignment.graded === "number" && (_jsxs(Badge, { palette: palette, variant: "success", children: [_jsx(ClipboardList, { size: 14, className: "mr-1" }), assignment.graded, " Dinilai"] }))] })] })), !isFetching && !assignment && (_jsx("p", { className: "text-sm", style: { color: palette.silver2 }, children: "Tugas tidak ditemukan untuk kelas ini." }))] })] })] }) })] }));
}
