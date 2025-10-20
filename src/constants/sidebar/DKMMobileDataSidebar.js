import { jsx as _jsx } from "react/jsx-runtime";
import { LayoutDashboardIcon, CalendarIcon, UsersIcon, } from "lucide-react";
export const DKMMobileDataSidebar = [
    // { text: "Beranda", icon: <BeakerIcon />, to: "/dkm" },
    {
        text: "Profil",
        icon: _jsx(LayoutDashboardIcon, {}),
        children: [
            { text: "Profil Masjid", to: "/dkm/profil-masjid" },
            { text: "Profil DKM", to: "/dkm/profil-dkm" },
        ],
    },
    // { text: "Notifikasi", icon: <BellIcon />, to: "/dkm/notifikasi" },
    { text: "Kajian", icon: _jsx(CalendarIcon, {}),
        children: [
            { text: "Kajian", to: "/dkm/kajian" },
            { text: "Tema", to: "/dkm/tema" },
        ] },
    // { text: "Sertifikat", icon: <FileIcon />, to: "/dkm/sertifikat" },
    // { text: "Keuangan", icon: <PieChartIcon />, to: "/dkm/keuangan" },
    { text: "Postingan", icon: _jsx(UsersIcon, {}), to: "/dkm/post" },
];
