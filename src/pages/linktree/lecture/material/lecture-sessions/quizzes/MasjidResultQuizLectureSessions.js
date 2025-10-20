import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useEffect, useMemo } from "react";
export default function MasjidResultQuizDetailLectureSessions() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    // Ambil param untuk fallback jika state kosong
    const { slug: slugParam, lecture_session_slug: sessionParam, lecture_slug, } = useParams();
    const { correct = 0, total = 0, duration = 0, slug = slugParam || "", lecture_session_slug = sessionParam || "", from, // <- dikirim dari halaman quiz
    backTo, // <- alias opsional
     } = state || {};
    // Tentukan tujuan balik
    const backTarget = useMemo(() => {
        // Prioritas: state.from -> state.backTo -> fallback ke halaman sesi -> fallback terakhir ke tema (kalau lecture_slug ada)
        return (from ||
            backTo ||
            (slug && lecture_session_slug
                ? `/masjid/${slug}/soal-materi/${lecture_session_slug}`
                : lecture_slug
                    ? `/masjid/${slug}/tema/${lecture_slug}`
                    : "/"));
    }, [from, backTo, slug, lecture_session_slug, lecture_slug]);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    useEffect(() => {
        console.log("📊 Hasil Quiz Diterima:", {
            correct,
            total,
            duration,
            slug,
            lecture_session_slug,
            backTarget,
        });
    }, [correct, total, duration, slug, lecture_session_slug, backTarget]);
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center", style: { backgroundColor: theme.white1, color: theme.black1 }, children: _jsxs("div", { className: "max-w-md w-full rounded-xl shadow-lg p-6 text-center space-y-6", style: { backgroundColor: theme.white2 }, children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h1", { className: "text-xl font-bold", children: "Alhamdulillah Pembelajaran Selesai" }), _jsx("p", { className: "text-sm font-medium text-gray-500 dark:text-white/70", children: "\u201CBersyukurlah atas apa yang kita telah dapatkan\u201D" })] }), _jsxs("div", { className: "flex justify-center gap-4", children: [_jsxs("div", { className: "rounded-lg px-4 py-3 border text-center flex flex-col items-center w-[100px]", style: { borderColor: theme.silver1 }, children: [_jsxs("span", { className: "text-lg font-bold", children: [score, " %"] }), _jsx("span", { className: "text-xs mt-1 text-gray-500 dark:text-white/70", children: "Penilaian" })] }), _jsxs("div", { className: "rounded-lg px-4 py-3 border text-center flex flex-col items-center w-[100px]", style: { borderColor: theme.silver1 }, children: [_jsx("span", { className: "text-lg font-bold", children: minutes }), _jsx("span", { className: "text-xs mt-1 text-gray-500 dark:text-white/70", children: "Waktu" })] })] }), _jsx("div", { className: "space-y-3 pt-2", children: _jsx("button", { onClick: () => navigate(backTarget, { replace: true }), className: "w-full py-3 rounded-lg text-white font-semibold", style: { backgroundColor: theme.primary }, children: "Lanjut" }) })] }) }));
}
