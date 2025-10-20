import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/settings/Appereance.tsx
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ThemeSelect from "@/components/pages/settings/ThemeSelect";
export default function MasjidAppereance() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Tampilan" }), _jsx(ThemeSelect, {})] }));
}
