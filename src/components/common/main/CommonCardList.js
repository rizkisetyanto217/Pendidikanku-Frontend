import { jsx as _jsx } from "react/jsx-runtime";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function CommonCardList({ children, className = "", padding = true, borderColor, backgroundColor, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsx("div", { className: `rounded-xl border ${className}`, style: {
            borderColor: borderColor || theme.silver1,
            backgroundColor: backgroundColor || (isDark ? theme.white2 : theme.white1),
        }, children: children }));
}
