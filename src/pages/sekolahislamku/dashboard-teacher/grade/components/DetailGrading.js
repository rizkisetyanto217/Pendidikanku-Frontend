import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/DetailGrading.tsx
import { useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Users, FileText, Clock } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import ModalGrading from "./ModalGrading";
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    : "-";
export default function DetailGrading() {
    const { id: classId, assignmentId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // Ambil data dari state yang dikirim dari TeacherGrading
    const assignment = state?.assignment;
    const className = assignment?.className ?? state?.className ?? "";
    const submissions = useMemo(() => state?.submissions ?? [], [state?.submissions]);
    // Modal grading
    const [gradingOpen, setGradingOpen] = useState(false);
    const [gradingStudent, setGradingStudent] = useState(null);
    const handleOpenGrading = (s) => {
        setGradingStudent({ id: s.id, name: s.studentName, score: s.score });
        setGradingOpen(true);
    };
    const emptyState = !assignment && submissions.length === 0;
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Penilaian", gregorianDate: new Date().toISOString() }), _jsx(ModalGrading, { open: gradingOpen, onClose: () => setGradingOpen(false), palette: palette, student: gradingStudent ?? undefined, assignmentTitle: assignment?.title
                    ? `${assignment.title}${className ? ` — (${className})` : ""}`
                    : className || undefined, onSubmit: (payload) => {
                    // TODO: panggil API update nilai & refresh data (React Query/invalidations)
                    console.log("Simpan nilai:", payload);
                    setGradingOpen(false);
                } }), _jsx("main", { className: "mx-auto max-w-7xl px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-6", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-10 hover:bg-black", style: { color: palette.black1 }, children: [_jsx(ArrowLeft, { size: 24, className: "font-bold" }), _jsx("span", { className: " font-semibold text-md", children: "Kembali" })] }), _jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-4 md:p-6 space-y-2", children: _jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "text-lg md:text-xl font-bold truncate", children: assignment?.title ?? "Tugas" }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-sm", style: { color: palette.silver2 }, children: [className && (_jsx(Badge, { palette: palette, variant: "secondary", children: className })), assignment?.dueDate && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(CalendarDays, { size: 14 }), " ", dateLong(assignment.dueDate)] })), typeof assignment?.total === "number" && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Users, { size: 14 }), " ", assignment.total, " siswa"] }))] })] }), _jsxs("div", { className: "text-xs", style: { color: palette.silver2 }, children: ["Class ID: ", classId ?? "-", " \u2022 Assignment ID:", " ", assignmentId ?? assignment?.id ?? "-"] })] }) }) }), emptyState && (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-6 text-center", style: { color: palette.silver2 }, children: "Data tidak tersedia. Buka halaman ini melalui daftar tugas (TeacherGrading) agar data ikut terkirim." }) })), !emptyState && (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-6", children: [_jsxs("h2", { className: "font-semibold mb-4 flex items-center gap-2", children: [_jsx(FileText, { size: 18 }), " Daftar Pengumpulan"] }), _jsx("div", { className: "overflow-x-auto rounded-xl border", style: { borderColor: palette.silver1 }, children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { style: { background: palette.white2 }, children: _jsxs("tr", { children: [_jsx("th", { className: "text-left py-3 px-4", children: "Nama Siswa" }), _jsx("th", { className: "text-center py-3 px-3", children: "Status" }), _jsx("th", { className: "text-center py-3 px-3", children: "Nilai" }), _jsx("th", { className: "text-right py-3 px-4", children: "Aksi" })] }) }), _jsxs("tbody", { children: [submissions.map((s, i) => (_jsxs("tr", { style: {
                                                                        background: i % 2 === 0 ? palette.white1 : palette.white2,
                                                                        borderTop: i === 0
                                                                            ? "none"
                                                                            : `1px solid ${palette.silver1}`,
                                                                    }, children: [_jsxs("td", { className: "py-3 px-4", children: [_jsx("div", { className: "font-medium", children: s.studentName }), s.submittedAt && (_jsxs("div", { className: "text-xs mt-0.5 flex items-center gap-1", style: { color: palette.silver2 }, children: [_jsx(Clock, { size: 12 }), " Dikumpulkan", " ", dateLong(s.submittedAt)] }))] }), _jsx("td", { className: "py-3 px-3 text-center", children: _jsx(Badge, { palette: palette, variant: s.status === "graded"
                                                                                    ? "success"
                                                                                    : s.status === "submitted"
                                                                                        ? "info"
                                                                                        : "destructive", children: s.status === "graded"
                                                                                    ? "Sudah Dinilai"
                                                                                    : s.status === "submitted"
                                                                                        ? "Terkumpul"
                                                                                        : "Belum" }) }), _jsx("td", { className: "py-3 px-3 text-center", children: typeof s.score === "number" ? (_jsx("span", { className: "font-semibold text-base", children: s.score })) : (_jsx("span", { style: { color: palette.silver2 }, children: "-" })) }), _jsx("td", { className: "py-3 px-4", children: _jsx("div", { className: "flex justify-end gap-2", children: _jsx(Btn, { palette: palette, size: "sm", variant: s.status === "submitted"
                                                                                        ? "default"
                                                                                        : "outline", onClick: () => handleOpenGrading(s), children: s.status === "graded"
                                                                                        ? "Edit Nilai"
                                                                                        : "Beri Nilai" }) }) })] }, s.id))), submissions.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "py-8 text-center", style: { color: palette.silver2 }, children: "Belum ada data pengumpulan." }) }))] })] }) })] }) }))] })] }) })] }));
}
