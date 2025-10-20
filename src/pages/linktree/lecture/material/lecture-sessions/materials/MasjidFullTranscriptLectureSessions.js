import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PageHeader from "@/components/common/home/PageHeaderUser";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import FormattedDate from "@/constants/formattedDate";
import parse from "html-react-parser";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML";
export default function MasjidFullTranscriptLectureSessions() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { lecture_session_slug, slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const backUrl = location.state?.from ||
        `/masjid/${slug}/soal-materi/${lecture_session_slug}`;
    // 📥 Fetch detail sesi kajian
    const { data: sessionDetail, isLoading: isLoadingSession, isError: isErrorSession, } = useQuery({
        queryKey: ["lecture-session-detail", lecture_session_slug],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-u/by-slug/${lecture_session_slug}`);
            console.log("📦 Detail sesi kajian:", res.data);
            return res.data;
        },
        enabled: !!lecture_session_slug,
        staleTime: 1000 * 60 * 5,
    });
    // 📥 Fetch transkrip materi
    const { data: materialData, isLoading: isLoadingTranscript, isError: isErrorTranscript, } = useQuery({
        queryKey: ["public-lecture-session-transcript", lecture_session_slug],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-materials/filter-slug?lecture_session_slug=${lecture_session_slug}&type=transcript`);
            console.log("📘 Data transkrip materi sesi kajian:", res?.data?.data);
            return res?.data?.data?.[0] ?? null;
        },
        enabled: !!lecture_session_slug,
        staleTime: 1000 * 60 * 5,
    });
    const transcript = materialData?.lecture_sessions_material_transcript_full || "";
    return (_jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx(PageHeader, { title: "Materi Lengkap", onBackClick: () => navigate(backUrl) }), _jsx("div", { className: "p-4 rounded-xl shadow-sm", style: { backgroundColor: theme.white1, color: theme.black1 }, children: isLoadingSession || isLoadingTranscript ? (_jsx("p", { children: "Memuat data..." })) : isErrorSession ? (_jsx("p", { className: "text-red-500", children: "Gagal memuat detail sesi kajian." })) : isErrorTranscript ? (_jsx("p", { className: "text-red-500", children: "Gagal memuat data materi lengkap." })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-1 mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-sky-600", children: sessionDetail?.lecture_session_title || "-" }), _jsxs("p", { className: "text-sm text-gray-500", children: [sessionDetail?.lecture_session_start_time && (_jsx(FormattedDate, { value: sessionDetail.lecture_session_start_time, fullMonth: true, className: "inline" })), " ", "/ ", sessionDetail?.lecture_session_place || "-"] }), _jsx("p", { className: "text-sm font-semibold", style: { color: theme.primary }, children: sessionDetail?.lecture_session_teacher_name || "-" })] }), _jsx("div", { className: "space-y-4 text-sm leading-relaxed text-justify", style: { color: theme.black1 }, children: transcript ? (_jsx("div", { className: "whitespace-pre-wrap text-sm text-justify leading-relaxed", children: parse(cleanTranscriptHTML(transcript)) })) : (_jsx("p", { className: "italic text-gray-500", children: "Belum ada materi lengkap tersedia." })) })] })) })] }));
}
