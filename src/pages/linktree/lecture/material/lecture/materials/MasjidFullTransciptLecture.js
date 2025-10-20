import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// MasjidFullTransciptLecture.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useNavigate, useParams } from "react-router-dom";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
export default function MasjidFullTransciptLecture() {
    const { slug = "", id = "" } = useParams();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ["lectureTranscripts", id],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-materials/filter-by-lecture-id?lecture_id=${id}&type=transcript`);
            return res.data;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Tema Kajian Full Transkrip", onBackClick: () => {
                    navigate(`/masjid/${slug}/tema/${id}`);
                } }), _jsx("div", { className: "space-y-4 p-4 max-w-3xl mx-auto", children: isLoading ? (_jsx("p", { style: { color: theme.silver2 }, children: "Memuat data transkrip..." })) : (data?.data.map((session) => (_jsxs("div", { className: "rounded-xl p-4 border shadow-sm space-y-2", style: {
                        borderColor: theme.silver2,
                        backgroundColor: theme.white2,
                    }, onClick: () => navigate(`/masjid/${slug}/soal-materi/${session.lecture_session_id}/materi-lengkap`, { state: { from: location.pathname + location.search } } // ⬅️ kirim URL sekarang
                    ), children: [_jsx("h3", { className: "text-lg font-bold", style: { color: theme.primary }, children: session.lecture_session_title.trim() }), session.materials.map((mat) => (_jsx("div", { className: "space-y-1 mt-2", children: _jsx("div", { className: "text-sm leading-relaxed whitespace-pre-wrap", style: { color: theme.black2 }, children: mat.lecture_sessions_material_transcript_full
                                    ? mat.lecture_sessions_material_transcript_full
                                    : "Belum ada transkrip lengkap untuk sesi ini." }) }, mat.lecture_sessions_material_id)))] }, session.lecture_session_id)))) })] }));
}
