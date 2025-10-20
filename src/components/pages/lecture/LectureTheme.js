import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function LectureThemeCard({ slug, lecture_slug, lecture_title, total_lecture_sessions, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    return (_jsxs("div", { onClick: () => navigate(`/masjid/${slug}/tema/${lecture_slug}`, {
            state: {
                from: { slug, tab: "tema" },
            },
        }), className: "p-4 rounded-lg cursor-pointer hover:opacity-90", style: {
            backgroundColor: theme.white1,
            border: `1px solid ${theme.silver1}`,
        }, children: [_jsx("h3", { className: "text-base font-medium", children: lecture_title }), _jsxs("p", { className: "text-sm", style: { color: theme.silver2 }, children: ["Total ", total_lecture_sessions, " kajian"] })] }));
}
