import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dkm/home/DashboardAdminDKM.tsx
import { LayoutDashboardIcon, UserIcon, Sun, Moon } from "lucide-react";
import DashboardSidebar from "@/components/common/navigation/SidebarMenu";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { colors } from "@/constants/thema";
export default function DashboardAdminDKM() {
    const menus = [
        { name: "Beranda", icon: _jsx(LayoutDashboardIcon, {}), to: "/dkm" },
        { name: "Profil Saya", icon: _jsx(UserIcon, {}), to: "/dkm/profil-saya" },
    ];
    const { isDark, toggleDark, themeName, setThemeName } = useHtmlDarkMode();
    const themeVariant = colors[themeName] ?? colors.default;
    const palette = isDark ? themeVariant.dark : themeVariant.light;
    return (_jsxs("div", { className: "flex gap-4", children: [_jsx(DashboardSidebar, { menus: menus, title: "Navigasi" }), _jsxs("div", { className: "flex-1 grid grid-cols-4 gap-4", children: [_jsx("div", { className: "rounded-xl shadow-sm p-4", style: { backgroundColor: palette.white1, color: palette.black1 }, children: "Jumlah Kajian" }), _jsx("div", { className: "rounded-xl shadow-sm p-4", style: { backgroundColor: palette.white1, color: palette.black1 }, children: "Total Donasi" }), _jsx("div", { className: "rounded-xl shadow-sm p-4", style: { backgroundColor: palette.white1, color: palette.black1 }, children: "Total Donatur" }), _jsx("div", { className: "rounded-xl shadow-sm p-4", style: { backgroundColor: palette.white1, color: palette.black1 }, children: "Total Pengikut" }), _jsxs("div", { className: "col-span-4 flex items-center justify-between rounded-xl shadow-sm p-4 mt-4", style: { backgroundColor: palette.white1, color: palette.black1 }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: toggleDark, className: "flex items-center gap-2 px-3 py-1 rounded border", style: {
                                            borderColor: palette.silver1,
                                            backgroundColor: palette.white2,
                                        }, children: [isDark ? _jsx(Sun, { size: 16 }) : _jsx(Moon, { size: 16 }), isDark ? "Mode Terang" : "Mode Gelap"] }), _jsxs("select", { value: themeName, onChange: (e) => setThemeName(e.target.value), className: "px-3 py-1 rounded border", style: {
                                            borderColor: palette.silver1,
                                            backgroundColor: palette.white2,
                                            color: palette.black1,
                                        }, children: [_jsx("option", { value: "default", children: "Default" }), _jsx("option", { value: "sunrise", children: "Sunrise" }), _jsx("option", { value: "midnight", children: "Midnight" })] })] }), _jsxs("span", { className: "text-sm text-gray-500", children: ["Tema aktif: ", themeName, " (", isDark ? "dark" : "light", ")"] })] })] })] }));
}
