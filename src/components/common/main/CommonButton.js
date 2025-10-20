import { jsx as _jsx } from "react/jsx-runtime";
// src/components/common/CommonButton.tsx
import { Link } from "react-router-dom";
import useHtmlThema from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
export default function CommonButton({ to, text, variant = "solid", state, className = "", style = {}, }) {
    const { isDark, themeName } = useHtmlThema();
    const theme = pickTheme(themeName, isDark);
    const isOutline = variant === "outline";
    return (_jsx(Link, { to: to, state: state, children: _jsx("button", { className: `px-4 py-2 text-sm font-semibold rounded transition hover:opacity-90 ${className}`, style: {
                backgroundColor: isOutline ? "transparent" : theme.primary,
                color: isOutline ? theme.primary : theme.white1,
                border: isOutline ? `1px solid ${theme.primary}` : "none",
                ...style,
            }, children: text }) }));
}
