import { jsx as _jsx } from "react/jsx-runtime";
import { BeakerIcon, LayoutDashboardIcon, PieChartIcon, } from "lucide-react";
export const treasurerMobileDataSidebar = [
    { text: "Beranda", icon: _jsx(BeakerIcon, {}), to: "/dkm" },
    {
        text: "Profil",
        icon: _jsx(LayoutDashboardIcon, {}),
        children: [
            { text: "Profil Masjid", to: "/dkm/profil" },
            { text: "Profil DKM", to: "/dkm/profil-dkm" },
        ],
    },
    { text: "Keuangan", icon: _jsx(PieChartIcon, {}), to: "/dkm/keuangan" },
];
