import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/student/DetailStudent.tsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { ArrowLeft, GraduationCap, Clock, Activity } from "lucide-react";
const DetailStudent = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { studentId } = useParams();
    const { state } = useLocation();
    const s = state?.student;
    const badgeColor = (st) => {
        switch (st) {
            case "hadir":
                return { bg: palette.success2, fg: palette.success1 };
            case "online":
                return { bg: palette.secondary, fg: palette.secondary };
            case "sakit":
                return { bg: palette.warning1, fg: palette.warning1 };
            case "izin":
                return { bg: palette.quaternary, fg: palette.quaternary };
            case "alpa":
                return { bg: palette.error2, fg: palette.error1 };
            default:
                return { bg: palette.silver1, fg: palette.black2 };
        }
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Siswa", gregorianDate: new Date().toISOString() }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-6", children: [_jsx("aside", { className: "lg:w-64 mb-6 lg:mb-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold text-lg", children: [_jsx("button", { onClick: () => navigate(-1), className: "inline-flex items-center justify-center rounded-full p-1 hover:opacity-80", title: "Kembali", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("span", { children: "Profil Siswa" })] }), _jsxs(SectionCard, { palette: palette, className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0", style: {
                                                        background: palette.primary2,
                                                        color: palette.primary,
                                                    }, children: s?.name ? s.name.charAt(0).toUpperCase() : "?" }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-xl font-semibold truncate", children: s?.name ?? `ID: ${studentId ?? "-"}` }), _jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: s?.className ? `Kelas ${s.className}` : "—" })] })] }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "text-xs font-medium opacity-60 flex items-center gap-2", children: [_jsx(GraduationCap, { size: 12 }), "Level Iqra"] }), _jsx("div", { className: "text-lg font-semibold", children: s?.iqraLevel ?? (_jsx("span", { className: "opacity-60", children: "Belum ada" })) })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "text-xs font-medium opacity-60 flex items-center gap-2", children: [_jsx(Clock, { size: 12 }), "Waktu Kehadiran"] }), _jsx("div", { className: "text-lg font-semibold", children: s?.time ?? _jsx("span", { className: "opacity-60", children: "\u2014" }) })] })] }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-xs font-medium opacity-60 flex items-center gap-2 mb-2", children: [_jsx(Activity, { size: 12 }), "Progress Juz"] }), _jsx("div", { className: "h-2 w-full rounded-full overflow-hidden", style: { background: palette.white2 }, children: _jsx("div", { className: "h-full", style: {
                                                                    width: `${Math.round((s?.juzProgress ?? 0) * 100)}%`,
                                                                    background: palette.secondary,
                                                                } }) }), _jsxs("div", { className: "text-xs mt-1", style: { color: palette.silver2 }, children: [Math.round((s?.juzProgress ?? 0) * 100), "%"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "text-xs font-medium opacity-60", children: "Status Hari Ini" }), _jsx(Badge, { palette: palette, children: (s?.statusToday ?? "—").toString().toUpperCase() }), s?.mode ? (_jsx(Badge, { palette: palette, variant: "outline", children: s.mode.toUpperCase() })) : null] })] }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-xs font-medium opacity-60", children: "Nilai Terakhir" }), _jsx("div", { className: "text-2xl font-bold", children: typeof s?.lastScore === "number" ? s.lastScore : "—" })] }) }), _jsx("div", { className: "flex flex-wrap gap-2 justify-end", children: _jsx(Btn, { palette: palette, onClick: () => navigate(-1), children: "Kembali" }) }), !s && (_jsxs("div", { className: "text-sm mt-2", style: { color: palette.silver2 }, children: ["Data siswa tidak dikirim via ", _jsx("code", { children: "location.state" }), ". Buka halaman ini dari \u201CDaftar Siswa\u201D agar detail terisi, atau tambahkan fetch by ID."] }))] })] })] }) })] }));
};
export default DetailStudent;
