import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import FormattedDate from "@/constants/formattedDate";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import ShowImageFull from "@/components/pages/home/ShowImageFull";
import { BookOpen, User, CalendarClock, MapPin, FileText, CheckCircle2, Clock, } from "lucide-react";
export default function DKMInformationLectureSessions() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { id } = useParams();
    const navigate = useNavigate();
    const { state: session } = useLocation();
    const [showImageModal, setShowImageModal] = useState(false);
    if (!session) {
        return (_jsx("p", { className: "text-sm text-red-500", children: "Data sesi kajian tidak tersedia." }));
    }
    const { lecture_session_title, lecture_session_description, lecture_session_teacher_name, lecture_session_start_time, lecture_session_place, lecture_session_approved_by_dkm_at, lecture_session_image_url, } = session;
    return (_jsxs("div", { className: "pb-16 max-w-4xl mx-auto", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsx(PageHeader, { title: "Informasi Sesi Kajian", onBackClick: () => navigate(`/dkm/kajian/kajian-detail/${id}`) }), _jsxs("div", { className: "rounded-xl overflow-hidden border flex flex-col md:flex-row mt-4", style: { borderColor: theme.silver1 }, children: [_jsx("div", { className: "w-full md:w-1/2 md:h-auto overflow-hidden aspect-[4/3] md:aspect-auto", style: {
                            borderRight: `1px solid ${theme.silver1}`,
                        }, children: _jsx(ShimmerImage, { src: lecture_session_image_url
                                ? decodeURIComponent(lecture_session_image_url)
                                : undefined, alt: "Gambar Kajian", className: "w-full h-full object-cover cursor-pointer", shimmerClassName: "rounded-none", onClick: () => setShowImageModal(true) }) }), _jsxs("div", { className: "flex-1 p-4 space-y-3 text-sm", children: [_jsx(InfoItem, { icon: _jsx(BookOpen, { size: 16 }), label: "Judul", value: lecture_session_title }), _jsx(InfoItem, { icon: _jsx(User, { size: 16 }), label: "Ustadz", value: lecture_session_teacher_name }), _jsx(InfoItem, { icon: _jsx(CalendarClock, { size: 16 }), label: "Jadwal", value: _jsx(FormattedDate, { value: lecture_session_start_time, fullMonth: true }) }), _jsx(InfoItem, { icon: _jsx(MapPin, { size: 16 }), label: "Lokasi", value: lecture_session_place }), _jsx(InfoItem, { icon: lecture_session_approved_by_dkm_at ? (_jsx(CheckCircle2, { size: 16 })) : (_jsx(Clock, { size: 16 })), label: "Status Materi", value: lecture_session_approved_by_dkm_at
                                    ? "Soal & Materi tersedia ✓"
                                    : "Dalam proses ✕" }), _jsxs("div", { children: [_jsxs("span", { className: "flex items-center gap-1 font-medium text-gray-500 dark:text-gray-300 mb-1", children: [_jsx(FileText, { size: 16 }), " Deskripsi:"] }), _jsx("div", { className: "prose prose-sm max-w-none dark:prose-invert", style: { color: theme.silver2 }, dangerouslySetInnerHTML: {
                                            __html: cleanTranscriptHTML(lecture_session_description || ""),
                                        } })] })] })] }), showImageModal && lecture_session_image_url && (_jsx(ShowImageFull, { url: lecture_session_image_url, onClose: () => setShowImageModal(false) }))] }));
}
// ✅ Komponen baris info dengan ikon
function InfoItem({ icon, label, value, }) {
    return (_jsxs("p", { className: "flex items-start gap-1", children: [_jsxs("span", { className: "flex items-center gap-1 font-medium text-gray-500 dark:text-gray-300", children: [icon, " ", label, ":"] }), " ", _jsx("span", { className: "ml-1", children: value })] }));
}
