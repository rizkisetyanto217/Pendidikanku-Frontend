import { jsx as _jsx } from "react/jsx-runtime";
// MasjidLayout.tsx
import { Outlet } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function MasjidLayout() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsx("div", { className: "w-full h-screen flex flex-col", style: { backgroundColor: theme.white2 }, children: _jsx("div", { className: "w-full flex-1 overflow-y-auto px-4 md:px-6", children: _jsx("div", { className: "w-full max-w-2xl mx-auto pb-24 pt-4", children: _jsx(Outlet, {}) }) }) }));
}
