import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AttendanceModal from "./components/AttendanceModal";
import FormattedDate from "@/constants/formattedDate";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import ShowImageFull from "@/components/pages/home/ShowImageFull";
export default function MasjidInformationLectureSessions() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const queryClient = useQueryClient();
    const { data: currentUser } = useCurrentUser();
    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const { lecture_session_slug, slug } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ["lectureSessionDetail", lecture_session_slug, currentUser?.id],
        queryFn: async () => {
            const headers = currentUser?.id ? { "X-User-Id": currentUser.id } : {};
            const res = await axios.get(`/public/lecture-sessions-u/by-slug/${lecture_session_slug}`, { headers });
            return res.data;
        },
        enabled: !!lecture_session_slug,
        staleTime: 5 * 60 * 1000,
    });
    const info = {
        materi: data?.lecture_session_title || "-",
        ustadz: data?.lecture_session_teacher_name || "-",
        jadwal: data?.lecture_session_start_time || "-",
        tempat: data?.lecture_session_place || "-",
        deskripsi: data?.lecture_session_description || "-",
        gambar: data?.lecture_session_image_url,
    };
    return (_jsxs("div", { className: "pb-24 max-w-2xl mx-auto", children: [_jsx(PageHeaderUser, { title: "Informasi Kajian", onBackClick: () => navigate(`/masjid/${slug}/soal-materi/${lecture_session_slug}`) }), isLoading ? (_jsx("p", { style: { color: theme.silver2 }, children: "Memuat informasi kajian..." })) : (_jsxs("div", { className: "rounded-xl overflow-hidden border flex flex-col md:flex-row", style: {
                    borderColor: theme.silver1,
                    backgroundColor: theme.white1,
                    color: theme.black1,
                }, children: [_jsx("div", { className: "w-full md:w-1/3 aspect-[4/5] md:aspect-auto md:h-auto overflow-hidden", style: {
                            maxHeight: "500px",
                            borderRight: `1px solid ${theme.silver1}`,
                        }, children: _jsx(ShimmerImage, { src: info.gambar ? decodeURIComponent(info.gambar) : undefined, alt: "Gambar Kajian", className: "w-full h-full object-cover cursor-pointer", shimmerClassName: "rounded", onClick: () => setShowImageModal(true) }) }), _jsxs("div", { className: "flex-1 p-4 space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { style: { color: theme.black1 }, children: "Materi:" }), " ", info.materi] }), _jsxs("div", { children: [_jsx("strong", { style: { color: theme.black1 }, children: "Pengajar:" }), " ", info.ustadz] }), _jsxs("div", { children: ["\uD83D\uDCC5 ", _jsx("strong", { style: { color: theme.black1 }, children: "Jadwal:" }), " ", info.jadwal !== "-" ? (_jsx(FormattedDate, { value: info.jadwal, fullMonth: true })) : ("-")] }), _jsxs("div", { children: [_jsx("strong", { style: { color: theme.black1 }, children: "Tempat:" }), " ", info.tempat] }), _jsxs("div", { children: [_jsx("strong", { style: { color: theme.black1 }, children: "Deskripsi:" }), _jsx("div", { className: "text-sm mt-1 leading-relaxed prose prose-sm prose-slate max-w-none dark:prose-invert", dangerouslySetInnerHTML: {
                                            __html: cleanTranscriptHTML(info.deskripsi || ""),
                                        } })] }), _jsxs("div", { className: "flex flex-col gap-3 mt-4", children: [_jsxs("div", { className: "rounded-md px-3 py-2 text-sm", style: {
                                            backgroundColor: typeof data?.user_grade_result === "number"
                                                ? "#D1FAE5"
                                                : "#FDE68A",
                                            color: typeof data?.user_grade_result === "number"
                                                ? "#065F46"
                                                : "#92400E",
                                            border: "1px solid #D1D5DB",
                                        }, children: [_jsx("strong", { children: "Materi & Soal:" }), " ", typeof data?.user_grade_result === "number"
                                                ? `Sudah dikerjakan ✓ | Nilai: ${data.user_grade_result}`
                                                : "Tanpa Keterangan ✕"] }), _jsxs("div", { className: "rounded-md px-3 py-2 text-sm cursor-pointer hover:opacity-80", style: {
                                            backgroundColor: data?.user_attendance_status === 1 ? "#D1FAE5" : "#FDE68A",
                                            color: data?.user_attendance_status === 1 ? "#065F46" : "#92400E",
                                            border: "1px solid #D1D5DB",
                                        }, onClick: () => setShowModal(true), children: [_jsx("strong", { children: "Status Kehadiran:" }), " ", data?.user_attendance_status === 1
                                                ? "Hadir Tatap Muka ✓"
                                                : "✎ Catat Kehadiran"] })] }), _jsx(AttendanceModal, { show: showModal, onClose: () => setShowModal(false), sessionId: data?.lecture_session_id || "", onSuccess: () => {
                                    setShowModal(false);
                                    queryClient.invalidateQueries({
                                        queryKey: [
                                            "lectureSessionDetail",
                                            lecture_session_slug,
                                            currentUser?.id,
                                        ],
                                    });
                                } })] })] })), showImageModal && info.gambar && (_jsx(ShowImageFull, { url: info.gambar, onClose: () => setShowImageModal(false) }))] }));
}
