import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import parse from "html-react-parser";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML";
// =====================
// Utils
// =====================
const fetchSummariesBySlug = async (lecture_slug) => {
    const res = await axios.get(`/public/lecture-sessions-materials/filter-by-lecture-slug`, { params: { lecture_slug, type: "summary" } });
    return res.data;
};
// Ambil 1–N kalimat sebagai preview (tanpa hooks)
const previewSentences = (html, maxSentences = 2) => {
    if (!html)
        return "";
    const cleaned = cleanTranscriptHTML(html)
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    if (!sentences.length)
        return "";
    const preview = sentences.slice(0, maxSentences).join(" ").trim();
    return sentences.length > maxSentences ? `${preview} …` : preview;
};
// =====================
// Child: Card
// =====================
function SummaryCard({ session, theme, onOpen, }) {
    const summary = session.materials?.[0]?.lecture_sessions_material_summary || "";
    const preview = previewSentences(summary, 2);
    return (_jsxs("article", { className: "rounded-xl p-4 border shadow-sm transition", style: { borderColor: theme.silver2, backgroundColor: theme.white2 }, children: [_jsx("h3", { className: "text-md font-bold mb-2", style: { color: theme.primary }, children: session.lecture_session_title?.trim() || "Tanpa Judul" }), _jsx("div", { className: "space-y-3 text-sm leading-relaxed text-justify", style: { color: theme.black1 }, children: summary ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "whitespace-pre-wrap", children: preview }), _jsx("div", { className: "flex gap-2", children: _jsx("button", { className: "px-3 py-1.5 rounded-lg text-sm border hover:opacity-90", style: { borderColor: theme.silver2 }, onClick: () => onOpen(session), children: "Baca selengkapnya" }) })] })) : (_jsx("p", { className: "italic text-gray-500", children: "Belum ada materi ringkasan tersedia." })) })] }));
}
// =====================
// Child: Modal
// =====================
function SummaryModal({ open, onClose, theme, session, }) {
    if (!open || !session)
        return null;
    const summaryHTML = session.materials?.[0]?.lecture_sessions_material_summary || "";
    return (_jsxs("div", { role: "dialog", "aria-modal": "true", className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose }), _jsxs("div", { className: "relative w-full sm:max-w-3xl max-h-[85vh] overflow-auto rounded-t-2xl sm:rounded-2xl p-4 m-0 sm:m-4 shadow-lg", style: {
                    backgroundColor: theme.white2,
                    color: theme.black1,
                    border: `1px solid ${theme.silver2}`,
                }, children: [_jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsx("h2", { className: "text-base sm:text-lg font-semibold", children: session.lecture_session_title || "Ringkasan Kajian" }), _jsx("button", { className: "px-3 py-1.5 rounded-lg text-sm border hover:opacity-90", style: { borderColor: theme.silver2 }, onClick: onClose, children: "Tutup" })] }), _jsx("div", { className: "mt-3 text-sm leading-relaxed text-justify", children: parse(cleanTranscriptHTML(summaryHTML)) })] })] }));
}
// =====================
// Page
// =====================
export default function MasjidSummaryLecture() {
    const { slug = "", lecture_slug = "" } = useParams();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const location = useLocation();
    // Data utama
    const { data, isLoading } = useQuery({
        queryKey: ["lectureSummariesBySlug", lecture_slug],
        queryFn: () => fetchSummariesBySlug(lecture_slug),
        enabled: !!lecture_slug,
        staleTime: 5 * 60 * 1000,
    });
    // Modal state + sinkronisasi dengan ?detail=slug
    const [selected, setSelected] = useState(null);
    useEffect(() => {
        const sp = new URLSearchParams(location.search);
        const detailSlug = sp.get("detail");
        if (!detailSlug || !data?.data?.length)
            return;
        const found = data.data.find((s) => s.lecture_session_slug === detailSlug);
        if (found)
            setSelected(found);
    }, [location.search, data?.data]);
    const openDetail = (session) => {
        setSelected(session);
        const sp = new URLSearchParams(location.search);
        sp.set("detail", session.lecture_session_slug);
        navigate(`${location.pathname}?${sp.toString()}`, { replace: true });
    };
    const closeDetail = () => {
        setSelected(null);
        const sp = new URLSearchParams(location.search);
        sp.delete("detail");
        navigate(`${location.pathname}?${sp.toString()}`, { replace: true });
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Tema Kajian Ringkasan", onBackClick: () => navigate(`/masjid/${slug}/tema/${lecture_slug}`) }), _jsx("div", { className: "space-y-4 max-w-3xl mx-auto", children: isLoading ? (_jsx("p", { style: { color: theme.silver2 }, children: "Memuat ringkasan kajian..." })) : data?.data?.length ? (data.data.map((s) => (_jsx(SummaryCard, { session: s, theme: theme, onOpen: openDetail }, `${s.lecture_session_slug || "no-slug"}-${s.lecture_session_id || "no-id"}`)))) : (_jsx("p", { style: { color: theme.silver2 }, children: "Belum ada sesi kajian yang memiliki ringkasan." })) }), _jsx(SummaryModal, { open: !!selected, onClose: closeDetail, theme: theme, session: selected })] }));
}
