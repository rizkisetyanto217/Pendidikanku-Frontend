import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/school/SchoolMenuGrids.tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { CalendarDays, Building2, Layers, CheckCircle2, CreditCard, Banknote, UserCog, Users, IdCard, Globe, BookOpen, LibraryBig, Bell, Award, CalendarRange, BarChart2, Settings, } from "lucide-react";
/* ============== Helpers ============== */
const toLocalNoonISO = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x.toISOString();
};
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
/* ============== Page ============== */
export default function SchoolMenuGrids() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const topbarISO = toLocalNoonISO(new Date());
    const items = useMemo(() => [
        {
            key: "periode",
            label: "Periode Akademik",
            to: "academic",
            icon: CalendarDays,
        },
        { key: "ruangan", label: "Ruangan", to: "room-school", icon: Building2 },
        { key: "kelas-all", label: "Seluruh Kelas", to: "kelas", icon: Layers },
        {
            key: "kelas-aktif",
            label: "Kelas Aktif",
            to: "kelas-aktif",
            icon: CheckCircle2,
        },
        { key: "keuangan", label: "Keuangan", to: "keuangan", icon: CreditCard },
        { key: "spp", label: "SPP", to: "spp", icon: Banknote },
        { key: "guru", label: "Guru", to: "guru", icon: UserCog },
        {
            key: "murid",
            label: "Murid",
            to: "murid",
            icon: Users,
            note: "Cari Murid",
        },
        { key: "profil", label: "Profil", to: "profil-sekolah", icon: IdCard },
        { key: "website", label: "Website", to: "/website", icon: Globe },
        { key: "buku", label: "Buku", to: "buku", icon: BookOpen },
        {
            key: "pelajaran",
            label: "Pelajaran",
            to: "pelajaran",
            icon: LibraryBig,
        },
        {
            key: "pengumuman",
            label: "Pengumuman",
            to: "all-announcement",
            icon: Bell,
        },
        { key: "sertifikat", label: "Sertifikat", to: "sertifikat", icon: Award },
        {
            key: "kalender",
            label: "Kalender Akademik",
            to: "kalender",
            icon: CalendarRange,
        },
        {
            key: "statistik",
            label: "Statistik",
            to: "statistik",
            icon: BarChart2,
        },
        {
            key: "pengaturan",
            label: "Pengaturan",
            to: "pengaturan",
            icon: Settings,
        },
    ], []);
    return (_jsxs("div", { className: "min-h-screen w-full ", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Menu Sekolah", gregorianDate: topbarISO }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsx("div", { className: "mb-2 font-semibold text-lg", children: "Akses Cepat" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4", children: items.map((it) => (_jsx(MenuTile, { item: it, palette: palette }, it.key))) })] })] }) })] }));
}
/* ============== Tile ============== */
function MenuTile({ item, palette }) {
    const Icon = item.icon;
    const content = (_jsxs("div", { className: "h-full w-full rounded-2xl border p-3 md:p-4 flex flex-col items-center justify-center text-center gap-2 transition-transform", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsx("span", { className: "h-12 w-12 md:h-14 md:w-14 grid place-items-center rounded-xl", style: { color: palette.primary, background: palette.primary2 }, "aria-hidden": true, children: _jsx(Icon, { size: 22 }) }), _jsx("div", { className: "text-sm md:text-sm font-medium leading-tight line-clamp-2", children: item.label }), item.note && (_jsx("div", { className: "text-[11px] md:text-sm", style: { color: palette.silver2 }, children: item.note }))] }));
    return item.to ? (_jsx(Link, { to: item.to, className: "block hover:scale-[1.02] active:scale-[0.99] focus:outline-none transition-transform", children: content })) : (_jsx("button", { type: "button", onClick: item.onClick, className: "block w-full hover:scale-[1.02] active:scale-[0.99] focus:outline-none transition-transform", children: content }));
}
