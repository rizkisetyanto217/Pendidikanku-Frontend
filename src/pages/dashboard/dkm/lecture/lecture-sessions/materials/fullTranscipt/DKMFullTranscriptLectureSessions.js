import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import FormattedDate from "@/constants/formattedDate";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML"; // sesuaikan path jika perlu
export default function DKMFullTranscriptLectureSessions() {
    const { id: lecture_session_id } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { id } = useParams();
    // ✅ Ambil data sesi langsung dari backend
    const { data: session, isLoading: isLoadingSession, isError: isErrorSession, } = useQuery({
        queryKey: ["lecture-session", lecture_session_id],
        queryFn: async () => {
            const res = await axios.get(`/api/a/lecture-sessions/by-id/${lecture_session_id}`);
            return res.data;
        },
        enabled: !!lecture_session_id,
        staleTime: 1000 * 60 * 5,
    });
    // ✅ Ambil data transkrip
    const { data: materialData, isLoading: isLoadingTranscript, isError: isErrorTranscript, } = useQuery({
        queryKey: ["lecture-session-transcript", lecture_session_id],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-materials/filter?lecture_session_id=${lecture_session_id}&type=transcript`);
            console.log("📘 Data transkrip materi sesi kajian:", res.data.data);
            return res.data.data?.[0] ?? null;
        },
        enabled: !!lecture_session_id,
        staleTime: 1000 * 60 * 5,
    });
    const transcript = materialData?.lecture_sessions_material_transcript_full || "";
    const materialId = materialData?.lecture_sessions_material_id;
    const handleEditClick = () => {
        const base = `/dkm/kajian/kajian-detail/${lecture_session_id}/materi-lengkap`;
        const target = materialId
            ? `${base}/tambah-edit/${materialId}`
            : `${base}/tambah-edit`;
        navigate(target, { state: session });
    };
    // ⏳ Loading atau error
    if (isLoadingSession) {
        return _jsx("p", { className: "text-sm text-gray-500", children: "Memuat sesi kajian..." });
    }
    if (isErrorSession || !session) {
        return (_jsx("p", { className: "text-sm text-red-500", children: "Gagal memuat data sesi kajian." }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(PageHeader, { title: "Materi Lengkap", onBackClick: () => navigate(`/dkm/kajian/kajian-detail/${id}`) }), _jsxs("div", { className: "p-6 rounded-2xl shadow-sm", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsxs("div", { className: "space-y-1 mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-sky-600", children: session.lecture_session_title || "-" }), _jsx("p", { className: "text-sm text-gray-500", children: session.lecture_session_start_time ? (_jsxs(_Fragment, { children: [_jsx(FormattedDate, { value: session.lecture_session_start_time, fullMonth: true, className: "inline" }), " ", "/ ", session.lecture_session_place || "-"] })) : ("- / -") }), _jsx("p", { className: "text-sm font-semibold", style: { color: theme.primary }, children: session.lecture_session_teacher_name || "-" })] }), _jsx("div", { className: "space-y-4 text-sm leading-relaxed text-justify", style: { color: theme.black1 }, children: isLoadingTranscript ? (_jsx("p", { children: "Memuat data materi..." })) : isErrorTranscript ? (_jsx("p", { className: "text-red-500", children: "Gagal memuat data materi lengkap." })) : transcript ? (_jsx("div", { dangerouslySetInnerHTML: {
                                __html: cleanTranscriptHTML(transcript),
                            } })) : (_jsx("p", { className: "italic text-gray-500", children: "Belum ada materi lengkap tersedia." })) }), _jsx("div", { className: "mt-6 text-right", children: _jsx("button", { className: "px-5 py-2 rounded-lg font-semibold", style: { backgroundColor: theme.primary, color: theme.white1 }, onClick: handleEditClick, children: materialId ? "Edit Materi" : "Tambah Materi" }) })] })] }));
}
