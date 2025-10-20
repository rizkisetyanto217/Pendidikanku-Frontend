import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function StudentLayout() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    return (_jsx("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: _jsx("div", { className: "mx-auto Replace pb-6 lg:flex lg:items-start lg:gap-4", children: _jsx("div", { className: "flex-1", children: _jsx(Outlet, {}) }) }) }));
}
