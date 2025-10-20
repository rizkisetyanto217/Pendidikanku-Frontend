import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, Clock, MapPin, CalendarDays, } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
const decodeId = (id) => {
    try {
        return decodeURIComponent(id);
    }
    catch {
        return id;
    }
};
const fmtDateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })
    : "-";
export default function DetailScheduleSevenDays() {
    const { scheduleId = "" } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // data dari state (opsional)
    const incoming = state?.item;
    const [item, setItem] = useState(incoming ?? null);
    const [editOpen, setEditOpen] = useState(false);
    const readableId = useMemo(() => decodeId(scheduleId), [scheduleId]);
    const handleDelete = () => {
        if (!confirm("Hapus jadwal ini?"))
            return;
        // TODO: panggil API delete pakai readableId (atau item.id kalau ada)
        navigate(-1);
    };
    const handleSubmitEdit = (p) => {
        // TODO: panggil API update
        setItem((prev) => ({
            title: p.title,
            time: p.time,
            room: p.room,
            dateISO: prev?.dateISO,
        }));
        setEditOpen(false);
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, gregorianDate: new Date().toISOString(), title: "Detail Jadwal (7 Hari)", dateFmt: (iso) => new Date(iso).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }) }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx("aside", { className: "lg:w-64 mb-6 lg:mb-0 lg:sticky lg:top-16 shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-4", children: [_jsx("div", { className: "flex items-center justify-between gap-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ArrowLeft, { size: 20, onClick: () => navigate(-1), strokeWidth: 3, className: "mr-1 cursor-pointer" }), _jsx("div", { className: "font-semibold text-lg", children: "Detail Jadwal" })] }) }), _jsx(SectionCard, { palette: palette, className: "p-4 md:p-5", children: item ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "font-bold text-xl", children: item.title }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm", children: [_jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(CalendarDays, { size: 16 }), _jsx(Badge, { palette: palette, variant: "outline", children: fmtDateLong(item.dateISO) })] }), _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(Clock, { size: 16 }), _jsx(Badge, { palette: palette, variant: "white1", children: item.time || "-" })] }), _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(MapPin, { size: 16 }), _jsx(Badge, { palette: palette, variant: "outline", children: item.room || "-" })] })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "font-bold text-xl break-words", children: ["Jadwal: ", _jsx("span", { className: "font-normal", children: readableId })] }), _jsx("div", { className: "mt-2 text-sm", style: { color: palette.silver2 }, children: "Data tidak dikirim via state. Sambungkan fetch by ID di sini bila diperlukan." })] })) })] })] }) })] }));
}
