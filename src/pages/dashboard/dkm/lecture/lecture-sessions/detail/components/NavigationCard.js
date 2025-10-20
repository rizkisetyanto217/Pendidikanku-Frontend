import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function NavigationCard({ icon, label, to, state, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsxs(Link, { to: to, state: state, className: "flex flex-col items-center justify-center text-center p-4 rounded-2xl border hover:shadow-md transition", style: {
            backgroundColor: theme.white1,
            borderColor: theme.primary2,
            color: theme.black1,
        }, children: [_jsx("div", { children: icon }), _jsx("span", { className: "mt-3 text-sm font-medium", style: { color: theme.black1 }, children: label })] }));
}
