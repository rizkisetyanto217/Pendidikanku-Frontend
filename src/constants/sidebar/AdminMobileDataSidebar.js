import { jsx as _jsx } from "react/jsx-runtime";
import { BeakerIcon, LayoutDashboardIcon, CalendarIcon, } from "lucide-react";
export const adminMobileDataSidebar = [
    { text: "Beranda", icon: _jsx(BeakerIcon, {}), to: "/dkm" },
    {
        text: "Profil",
        icon: _jsx(LayoutDashboardIcon, {}),
        children: [
            { text: "Profil Masjid", to: "/dkm/profil" },
            { text: "Profil DKM", to: "/dkm/profil-dkm" },
        ],
    },
    { text: "Kajian", icon: _jsx(CalendarIcon, {}), to: "/dkm/kajian" },
];
