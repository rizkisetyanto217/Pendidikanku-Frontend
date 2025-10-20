import { jsx as _jsx } from "react/jsx-runtime";
import { LayoutDashboardIcon, CalendarIcon, UsersIcon, } from "lucide-react";
export const DKMDesktopDataSidebar = [
    // { text: "Beranda", icon: <BeakerIcon />, to: "/dkm" },
    {
        text: "Profil",
        icon: _jsx(LayoutDashboardIcon, {}),
        to: "/dkm/profil-masjid",
        activeBasePath: ["/dkm/profil-dkm", "/dkm/profil-masjid"],
    },
    {
        text: "Kajian",
        icon: _jsx(CalendarIcon, {}),
        to: "/dkm/kajian",
        activeBasePath: ["/dkm/kajian", "/dkm/tema", "/dkm/kajian-detail"],
    },
    // { text: "Sertifikat", icon: <FileIcon />, to: "/dkm/sertifikat" },
    // { text: "Keuangan", icon: <PieChartIcon />, to: "/dkm/keuangan" },
    { text: "Postingan", icon: _jsx(UsersIcon, {}), to: "/dkm/post" },
];
