import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/TeacherMenuGrids.tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
// UI
import { SectionCard, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
// Icons
import { Users, Layers, IdCard, Megaphone, CalendarDays, Settings, NotebookPen, Award, } from "lucide-react";
/* ================= Helpers ================= */
const toLocalNoonISO = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x.toISOString();
};
/* ================= Page ================= */
export default function TeacherMenuGrids() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const topbarISO = toLocalNoonISO(new Date());
    const items = useMemo(() => [
        {
            key: "kelas-saya",
            label: "Kelas Saya",
            to: "kelas",
            icon: _jsx(Users, {}),
        },
        {
            key: "kelas-all",
            label: "Seluruh Kelas",
            to: "all-classes",
            icon: _jsx(Layers, {}),
        },
        {
            key: "profil",
            label: "Profil Guru",
            to: "profil-guru",
            icon: _jsx(IdCard, {}),
        },
        {
            key: "pengumuman",
            label: "Pengumuman",
            to: "all-announcement-teacher",
            icon: _jsx(Megaphone, {}),
        },
        {
            key: "jadwal",
            label: "Jadwal",
            to: "jadwal",
            icon: _jsx(CalendarDays, {}),
        },
        {
            key: "pengaturan",
            label: "Pengaturan",
            to: "pengaturan",
            icon: _jsx(Settings, {}),
        },
        {
            key: "tugas",
            label: "Tugas",
            to: "tugas",
            icon: _jsx(NotebookPen, {}),
        },
        {
            key: "sertifikat",
            label: "Sertifikat",
            to: "sertifikat",
            icon: _jsx(Award, {}),
        },
    ], []);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Menu Guru", gregorianDate: topbarISO, dateFmt: (iso) => new Date(iso).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }) }), _jsx("main", { className: "w-full px-4 md:px-6 py-4  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsx("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsx("div", { className: "mb-4 font-semibold text-lg", children: "Akses Cepat Guru" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4", children: items.map((it) => (_jsx(MenuTile, { item: it, palette: palette }, it.key))) })] }) })] }) })] }));
}
/* ================= Tile ================= */
function MenuTile({ item, palette }) {
    return (_jsx(Link, { to: item.to || "#", className: "block hover:scale-[1.02] active:scale-[0.99] focus:outline-none", style: { transition: "transform 160ms ease" }, children: _jsxs("div", { className: "h-full w-full rounded-2xl border p-3 md:p-4 flex flex-col items-center justify-center text-center gap-2", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsx("span", { className: "h-12 w-12 md:h-14 md:w-14 grid place-items-center rounded-xl", style: { background: palette.primary2, color: palette.primary }, children: item.icon }), _jsx("div", { className: "text-xs md:text-sm font-medium leading-tight line-clamp-2", children: item.label })] }) }));
}
