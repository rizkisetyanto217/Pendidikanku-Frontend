import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dkm/home/DashboardAdminDKM.tsx
import { LayoutDashboardIcon, UserIcon } from "lucide-react";
import DashboardSidebar from "@/components/common/navigation/SidebarMenu";
export default function DashboardAdminDKM() {
    const menus = [
        { name: "Beranda", icon: _jsx(LayoutDashboardIcon, {}), to: "/dkm" },
        { name: "Profil Saya", icon: _jsx(UserIcon, {}), to: "/dkm/profil-saya" },
        // Tambahkan menu lain jika dibutuhkan
    ];
    return (_jsxs("div", { className: "flex gap-4", children: [_jsx(DashboardSidebar, { menus: menus, title: "Navigasi" }), _jsxs("div", { className: "flex-1 grid grid-cols-4 gap-4", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm p-4", children: "Jumlah Kajian" }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-4", children: "Total Donasi" }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-4", children: "Total Donatur" }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-4", children: "Total Pengikut" })] })] }));
}
