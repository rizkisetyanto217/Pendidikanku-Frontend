import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { ArrowLeft } from "lucide-react";
// === Badge helper (boleh ekstrak ke file utils) ===
const PriorityBadge = ({ prioritas }) => {
    const cls = prioritas === "Urgent"
        ? "bg-red-100 text-red-800 border-red-300 animate-pulse"
        : prioritas === "Tinggi"
            ? "bg-orange-100 text-orange-800 border-orange-300"
            : prioritas === "Sedang"
                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                : "bg-green-100 text-green-800 border-green-300";
    const icon = prioritas === "Urgent"
        ? "🚨"
        : prioritas === "Tinggi"
            ? "⚠️"
            : prioritas === "Sedang"
                ? "📌"
                : "📝";
    return (_jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${cls}`, children: [_jsx("span", { children: icon }), prioritas] }));
};
const CategoryBadge = ({ kategori }) => {
    const cls = kategori === "Tahfidz"
        ? "bg-green-100 text-green-800 border-green-300"
        : kategori === "Tahsin"
            ? "bg-blue-100 text-blue-800 border-blue-300"
            : kategori === "Kajian"
                ? "bg-purple-100 text-purple-800 border-purple-300"
                : "bg-gray-100 text-gray-800 border-gray-300";
    const icon = kategori === "Tahfidz"
        ? "📖"
        : kategori === "Tahsin"
            ? "🎵"
            : kategori === "Kajian"
                ? "🕌"
                : "📢";
    return (_jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${cls}`, children: [_jsx("span", { children: icon }), kategori] }));
};
const StatusBadge = ({ status }) => {
    const cls = status === "Aktif"
        ? "bg-green-100 text-green-800 border-green-300"
        : status === "Draft"
            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
            : "bg-gray-100 text-gray-800 border-gray-300";
    return (_jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium border ${cls}`, children: status }));
};
const fmtDate = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});
const DetailAnnouncementTeacher = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const location = useLocation();
    const navigate = useNavigate();
    const pengumuman = location.state?.pengumuman;
    if (!pengumuman) {
        return (_jsxs("div", { className: "p-8 text-center", children: [_jsx("p", { className: "text-gray-500", children: "Data pengumuman tidak ditemukan." }), _jsxs(Btn, { palette: palette, onClick: () => navigate(-1), children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), " Kembali"] })] }));
    }
    const currentDate = new Date().toISOString();
    const { id } = useParams();
    return (_jsxs("div", { className: "min-h-screen w-full transition-colors duration-200", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, gregorianDate: currentDate, title: "Detail Pengumuman", showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: "gap-1", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Pengaturan" })] }), _jsxs(SectionCard, { palette: palette, className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx(CategoryBadge, { kategori: pengumuman.kategori }), _jsx(PriorityBadge, { prioritas: pengumuman.prioritas }), _jsx(StatusBadge, { status: pengumuman.status }), pengumuman.isPinned && (_jsx("span", { className: "text-blue-600 text-xs font-semibold", children: "\uD83D\uDCCC Disematkan" }))] }), _jsx("h1", { className: "text-2xl font-bold", children: pengumuman.judul }), _jsxs("div", { className: "flex flex-wrap gap-4 text-sm opacity-70", children: [_jsxs("span", { children: ["\u270D\uFE0F ", pengumuman.penulis] }), _jsxs("span", { children: ["\uD83D\uDCC5 ", fmtDate(pengumuman.tanggalPublish)] }), pengumuman.tanggalBerakhir && (_jsxs("span", { children: ["\u23F3 Berakhir: ", fmtDate(pengumuman.tanggalBerakhir)] })), _jsxs("span", { children: ["\uD83D\uDC41\uFE0F ", pengumuman.views, " views"] })] }), _jsx("div", { className: "prose max-w-none text-base leading-relaxed", children: pengumuman.konten }), pengumuman.target.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-sm mb-1", children: "Target Peserta" }), _jsx("div", { className: "flex flex-wrap gap-2", children: pengumuman.target.map((t, i) => (_jsx("span", { className: "px-3 py-1 rounded text-xs", style: {
                                                            background: palette.white1,
                                                            border: `1px solid ${palette.silver1}`,
                                                            color: palette.black1,
                                                        }, children: t }, i))) })] })), pengumuman.tags.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-sm mb-1", children: "Tags" }), _jsx("div", { className: "flex flex-wrap gap-2", children: pengumuman.tags.map((tag, i) => (_jsxs("span", { className: "px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800", children: ["#", tag] }, i))) })] })), pengumuman.lampiran && pengumuman.lampiran.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-sm mb-1", children: "Lampiran" }), _jsx("ul", { className: "list-disc list-inside space-y-1 text-sm", children: pengumuman.lampiran.map((f, i) => (_jsx("li", { className: "underline text-blue-600", children: f }, i))) })] }))] })] })] }) })] }));
};
export default DetailAnnouncementTeacher;
