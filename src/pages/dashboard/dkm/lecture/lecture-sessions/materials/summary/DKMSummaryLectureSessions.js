import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import FormattedDate from "@/constants/formattedDate";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML";
import parse from "html-react-parser";
export default function DKMSummaryLectureSessions() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { id: lecture_session_id } = useParams();
    const navigate = useNavigate();
    const { id } = useParams();
    // ✅ Ambil data sesi
    const { data: session, isLoading: isLoadingSession, isError: isErrorSession, } = useQuery({
        queryKey: ["lecture-session", lecture_session_id],
        queryFn: async () => {
            const res = await axios.get(`/api/a/lecture-sessions/by-id/${lecture_session_id}`);
            return res.data;
        },
        enabled: !!lecture_session_id,
        staleTime: 1000 * 60 * 5,
    });
    // ✅ Ambil data ringkasan
    const { data: materialData, isLoading: isLoadingSummary, isError: isErrorSummary, } = useQuery({
        queryKey: ["lecture-session-summary", lecture_session_id],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-materials/filter?lecture_session_id=${lecture_session_id}&type=summary`);
            return res.data.data?.[0] ?? null;
        },
        enabled: !!lecture_session_id,
        staleTime: 1000 * 60 * 5,
    });
    const summary = materialData?.lecture_sessions_material_summary || "";
    const materialId = materialData?.lecture_sessions_material_id;
    const handleEditClick = () => {
        const base = `/dkm/kajian/kajian-detail/${lecture_session_id}/ringkasan/tambah-edit`;
        const targetUrl = materialId ? `${base}/${materialId}` : base;
        navigate(targetUrl, { state: session });
    };
    if (isLoadingSession) {
        return _jsx("p", { className: "text-sm text-gray-500", children: "Memuat sesi kajian..." });
    }
    if (isErrorSession || !session) {
        return (_jsx("p", { className: "text-sm text-red-500", children: "Gagal memuat data sesi kajian." }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(PageHeader, { title: "Materi", onBackClick: () => navigate(`/dkm/kajian/kajian-detail/${id}`), actionButton: {
                    label: materialId ? "Edit Ringkasan" : "Tambah Ringkasan",
                    onClick: handleEditClick,
                } }), _jsxs("div", { className: "p-6 rounded-2xl shadow-sm", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsxs("div", { className: "space-y-1 mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-sky-600", children: session.lecture_session_title }), _jsxs("p", { className: "text-sm text-gray-500", children: [_jsx(FormattedDate, { value: session.lecture_session_start_time, fullMonth: true, className: "inline" }), " ", "/ ", session.lecture_session_place] }), _jsx("p", { className: "text-sm font-semibold", style: { color: theme.primary }, children: session.lecture_session_teacher_name })] }), _jsx("div", { className: "space-y-4 text-sm leading-relaxed text-justify", style: { color: theme.black1 }, children: isLoadingSummary ? (_jsx("p", { children: "Memuat data ringkasan..." })) : isErrorSummary ? (_jsx("p", { className: "text-red-500", children: "Gagal memuat data ringkasan." })) : summary ? (_jsx("div", { className: "whitespace-pre-wrap text-sm text-justify leading-relaxed", children: parse(cleanTranscriptHTML(summary)) })) : (_jsx("p", { className: "italic text-gray-500", children: "Belum ada ringkasan tersedia." })) })] })] }));
}
