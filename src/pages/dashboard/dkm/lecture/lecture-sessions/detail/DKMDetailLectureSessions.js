import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import { BookOpen, PlayCircle, StickyNote, Video, Home } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import NavigationCard from "./components/NavigationCard";
import FormattedDate from "@/constants/formattedDate";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML";
import ConfirmModal from "@/components/common/home/ConfirmModal";
import { useState } from "react";
import ShowImageFull from "@/components/pages/home/ShowImageFull";
export default function DKMDetailLectureSessions() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(null);
    const { data: session, isLoading, isError, refetch, } = useQuery({
        queryKey: ["lecture-session-detail", id],
        queryFn: async () => {
            const res = await axios.get(`/api/a/lecture-sessions/by-id/${id}`);
            return res.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
    const { mutate: approveSession, isPending: isApproving } = useMutation({
        mutationFn: async () => {
            return await axios.patch(`/api/a/lecture-sessions/${id}/approve-dkm`);
        },
        onSuccess: () => {
            toast.success("Kajian berhasil disetujui oleh DKM");
            refetch();
        },
        onError: () => toast.error("Gagal menyetujui kajian"),
    });
    if (isLoading)
        return _jsx("p", { className: "text-gray-500", children: "Memuat data sesi kajian..." });
    if (isError || !session)
        return _jsx("p", { className: "text-red-500", children: "Data sesi kajian tidak tersedia." });
    const navigations = [
        { icon: _jsx(Home, { size: 36 }), label: "Informasi", to: "informasi" },
        { icon: _jsx(Video, { size: 36 }), label: "Video Audio", to: "video-audio" },
        { icon: _jsx(BookOpen, { size: 36 }), label: "Latihan Soal", to: "latihan-soal" },
        { icon: _jsx(StickyNote, { size: 36 }), label: "Materi", to: "ringkasan" },
        { icon: _jsx(PlayCircle, { size: 36 }), label: "Dokumen", to: "dokumen" },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Kajian Detail", onBackClick: () => navigate(`/dkm/kajian`) }), _jsxs("div", { className: "rounded-2xl shadow-sm flex flex-col md:flex-row gap-6", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsx("div", { className: "flex-shrink-0 w-full md:w-48", children: _jsx(ShimmerImage, { src: session.lecture_session_image_url ?? "", alt: "Poster Kajian", className: "rounded-xl w-full h-auto object-cover aspect-[3/4]", shimmerClassName: "rounded-xl", onClick: () => setShowImageModal(session.lecture_session_image_url) }) }), _jsxs("div", { className: "flex-1 flex flex-col gap-1.5", children: [_jsx("h2", { className: "text-xl font-semibold", style: { color: theme.primary }, children: session.lecture_session_title }), _jsxs("p", { className: "text-sm font-medium", style: { color: theme.silver2 }, children: [_jsx(FormattedDate, { value: session.lecture_session_start_time, fullMonth: true }), " ", "/ ", session.lecture_session_place] }), _jsx("p", { className: "text-sm font-semibold", style: { color: theme.black1 }, children: session.lecture_session_teacher_name }), _jsx("div", { className: "text-sm mt-1 leading-relaxed prose prose-sm prose-slate max-w-none dark:prose-invert", dangerouslySetInnerHTML: {
                                    __html: cleanTranscriptHTML(session.lecture_session_description),
                                } }), _jsxs("div", { className: "flex justify-between items-start mt-4 flex-wrap gap-2", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap", children: [_jsxs("div", { className: "flex items-center text-xs font-semibold px-3 py-1 rounded-full gap-1 transition", style: {
                                                    backgroundColor: session.lecture_session_approved_by_dkm_at
                                                        ? (theme.success1 ?? "#16a34a")
                                                        : theme.silver1,
                                                    color: session.lecture_session_approved_by_dkm_at
                                                        ? theme.white1
                                                        : theme.black2,
                                                }, children: [session.lecture_session_approved_by_dkm_at ? "✅" : "⏳", session.lecture_session_approved_by_dkm_at
                                                        ? " Soal & Materi tersedia"
                                                        : " Soal & Materi dalam proses"] }), !session.lecture_session_approved_by_dkm_at && (_jsx("button", { className: "px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50", onClick: () => setShowConfirmModal(true), disabled: isApproving, children: isApproving ? "Menyetujui..." : "Setujui Kajian" }))] }), _jsxs("div", { className: "flex items-center text-sm font-medium", style: { color: theme.silver2 }, children: [_jsx("span", { className: "mr-1", children: "\uD83D\uDC64" }), " 40 peserta"] }), _jsx(ConfirmModal, { isOpen: showConfirmModal, onClose: () => setShowConfirmModal(false), onConfirm: () => {
                                            approveSession();
                                            setShowConfirmModal(false);
                                        }, title: "Setujui Sesi Kajian", message: "Apakah Anda yakin ingin menyetujui sesi kajian ini? Setelah disetujui, soal dan materi dapat diakses oleh peserta.", confirmText: "Setujui", cancelText: "Batal", isLoading: isApproving })] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold mb-4", style: { color: theme.primary }, children: "Navigasi Utama" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4", children: navigations.map((item) => (_jsx(NavigationCard, { ...item, state: session }, item.label))) })] }), showImageModal && (_jsx(ShowImageFull, { url: showImageModal, onClose: () => setShowImageModal(null) }))] }));
}
