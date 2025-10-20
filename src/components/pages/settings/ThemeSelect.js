import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/common/ThemeSelect.tsx
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function ThemeSelect({ label = "Tema", className = "", }) {
    const { isDark, mode, setMode, themeName, setThemeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsxs("div", { className: `space-y-3 w-fit ${className}`, children: [label && (_jsx("label", { htmlFor: "themeSelect", className: "block text-sm font-medium", style: { color: theme.black2 }, children: label })), _jsxs("select", { id: "modeSelect", onChange: (e) => setMode(e.target.value), value: mode, className: "appearance-none border pr-10 pl-4 py-2 rounded-md text-sm w-40 transition focus:outline-none focus:ring-2 focus:ring-teal-500", style: {
                    backgroundColor: theme.white2,
                    color: theme.black1,
                    borderColor: theme.silver1,
                }, children: [_jsx("option", { value: "light", children: "Terang" }), _jsx("option", { value: "dark", children: "Gelap" }), _jsx("option", { value: "system", children: "Sistem" })] }), _jsxs("select", { id: "themeVariant", onChange: (e) => setThemeName(e.target.value), value: themeName, className: "appearance-none border pr-10 pl-4 py-2 rounded-md text-sm w-40 transition focus:outline-none focus:ring-2 focus:ring-teal-500", style: {
                    backgroundColor: theme.white2,
                    color: theme.black1,
                    borderColor: theme.silver1,
                }, children: [_jsx("option", { value: "default", children: "Default" }), _jsx("option", { value: "sunrise", children: "Sunrise" }), _jsx("option", { value: "midnight", children: "Midnight" })] })] }));
}
