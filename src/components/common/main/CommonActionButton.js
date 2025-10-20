import { jsx as _jsx } from "react/jsx-runtime";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function CommonActionButton({ text, onClick, variant = "solid", className = "", style = {}, type = "button", disabled = false, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const isOutline = variant === "outline";
    return (_jsx("button", { type: type, onClick: onClick, disabled: disabled, className: `px-4 py-2 text-sm font-semibold rounded ${className}`, style: {
            backgroundColor: isOutline ? "transparent" : theme.primary,
            color: isOutline ? theme.primary : "#ffffff",
            border: isOutline ? `1px solid ${theme.primary}` : "none",
            opacity: disabled ? 0.5 : 1,
            ...style,
        }, children: text }));
}
