import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/layouts/SchoolLayout.tsx
import { Outlet } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
export default function SchoolLayout() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    return (_jsx("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: _jsxs("div", { className: "mx-auto Replace pb-6 lg:flex lg:items-start lg:gap-4", children: [_jsx(ParentSidebar, { palette: palette }), _jsx("div", { className: "flex-1", children: _jsx(Outlet, {}) })] }) }));
}
