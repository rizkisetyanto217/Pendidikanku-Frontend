import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/academic/AcademicSchool.tsx
import { useMemo, useState } from "react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useNavigate } from "react-router-dom";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { CalendarDays, CheckCircle2, Users, MapPin, Link as LinkIcon, Building2, Layers, Info, ArrowLeft, } from "lucide-react";
import { Link } from "react-router-dom";
/* ===================== Dummy Data ===================== */
// Term aktif (sesuai contoh)
const DUMMY_TERM = {
    academic_terms_masjid_id: "e9876a6e-ab91-4226-84f7-cda296ec747e",
    academic_terms_academic_year: "2025/2026",
    academic_terms_name: "Ganjil",
    academic_terms_start_date: "2025-07-15T00:00:00+07:00",
    academic_terms_end_date: "2026-01-10T23:59:59+07:00",
    academic_terms_is_active: true,
    academic_terms_angkatan: 2025,
};
// Dua contoh ruang (fisik & virtual)
const DUMMY_ROOMS = [
    {
        class_rooms_masjid_id: "e9876a6e-ab91-4226-84f7-cda296ec747e",
        class_rooms_name: "Ruang Tahfidz A",
        class_rooms_code: "R-TFZ-A",
        class_rooms_location: "Gedung Utama Lt. 2",
        class_rooms_floor: 2,
        class_rooms_capacity: 40,
        class_rooms_description: "Ruang untuk setoran hafalan & halaqah kecil.",
        class_rooms_is_virtual: false,
        class_rooms_is_active: true,
        class_rooms_features: ["AC", "Proyektor", "Whiteboard", "Karpet"],
    },
    {
        class_rooms_masjid_id: "e9876a6e-ab91-4226-84f7-cda296ec747e",
        class_rooms_name: "Kelas Daring Malam",
        class_rooms_code: "VR-NIGHT-01",
        class_rooms_location: "https://meet.google.com/abc-defg-hij",
        class_rooms_is_virtual: true,
        class_rooms_capacity: 100,
        class_rooms_description: "Sesi online untuk murid pekanan.",
        class_rooms_is_active: true,
        class_rooms_features: ["Virtual", "Google Meet", "Rekaman Otomatis"],
    },
];
/* ===================== Helpers ===================== */
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
const dateShort = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
    : "-";
/* ===================== Page ===================== */
const AcademicSchool = ({ showBack = false, backTo, backLabel = "Kembali", }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    // State kecil untuk filter rooms
    const [filter, setFilter] = useState("all");
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    const rooms = useMemo(() => {
        if (filter === "physical")
            return DUMMY_ROOMS.filter((r) => !r.class_rooms_is_virtual);
        if (filter === "virtual")
            return DUMMY_ROOMS.filter((r) => r.class_rooms_is_virtual);
        return DUMMY_ROOMS;
    }, [filter]);
    // KPI kecil
    const kpIs = {
        totalRooms: DUMMY_ROOMS.length,
        physical: DUMMY_ROOMS.filter((r) => !r.class_rooms_is_virtual).length,
        virtual: DUMMY_ROOMS.filter((r) => r.class_rooms_is_virtual).length,
        capacitySum: DUMMY_ROOMS.reduce((s, r) => s + (r.class_rooms_capacity || 0), 0),
    };
    const topbarISO = toLocalNoonISO(new Date());
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Akademik", gregorianDate: topbarISO, showBack: isFromMenuUtama }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsx("div", { className: "flex items-center justify-between ", children: _jsxs("div", { className: "font-semibold text-lg flex items-center ", children: [_jsx("div", { className: " items-center hidden md:flex", children: showBack && (_jsx(Btn, { palette: palette, onClick: () => navigate(-1), variant: "ghost", className: "cursor-pointer mr-3", children: _jsx(ArrowLeft, { "aria-label": backLabel, 
                                                        // title={backLabel}
                                                        size: 20 }) })) }), _jsx("h1", { className: " items-center hidden md:flex", children: "Periode Akademik Aktif" })] }) }), _jsx(SectionCard, { palette: palette, className: "overflow-hidden ", children: _jsxs("div", { className: "p-5 grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Tahun Ajaran" }), _jsxs("div", { className: "text-xl font-semibold", children: [DUMMY_TERM.academic_terms_academic_year, " \u2014", " ", DUMMY_TERM.academic_terms_name] }), _jsxs("div", { className: "text-sm flex items-center gap-2", style: { color: palette.black2 }, children: [_jsx(CalendarDays, { size: 16 }), dateShort(DUMMY_TERM.academic_terms_start_date), " s/d", " ", dateShort(DUMMY_TERM.academic_terms_end_date)] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Angkatan" }), _jsx("div", { className: "text-xl font-semibold", children: DUMMY_TERM.academic_terms_angkatan }), _jsxs("div", { className: "text-sm flex items-center gap-2", style: { color: palette.black2 }, children: [_jsx(CheckCircle2, { size: 16 }), "Status:", " ", DUMMY_TERM.academic_terms_is_active ? "Aktif" : "Nonaktif"] })] })] }) }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-3 border-b flex flex-wrap items-center justify-between gap-2", style: { borderColor: palette.silver1 }, children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold", children: [_jsx(Layers, { size: 18, color: palette.quaternary }), "Daftar Ruang Kelas"] }), _jsx("div", { className: "flex items-center gap-2", children: ["all", "physical", "virtual"].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: "px-3 py-1.5 rounded-lg border text-sm", style: {
                                                            background: filter === f ? palette.primary2 : palette.white1,
                                                            color: filter === f ? palette.primary : palette.black1,
                                                            borderColor: filter === f ? palette.primary : palette.silver1,
                                                        }, children: f === "all"
                                                            ? "Semua"
                                                            : f === "physical"
                                                                ? "Fisik"
                                                                : "Virtual" }, f))) })] }), _jsx("div", { className: "p-4 md:p-5", children: rooms.length === 0 ? (_jsxs("div", { className: "rounded-xl border p-4 text-sm flex items-center gap-2", style: {
                                                    borderColor: palette.silver1,
                                                    color: palette.silver2,
                                                }, children: [_jsx(Info, { size: 16 }), "Tidak ada ruang untuk filter ini."] })) : (_jsx("ul", { className: "grid sm:grid-cols-2 gap-3", children: rooms.map((r) => (_jsx("li", { children: _jsx(RoomCard, { palette: palette, room: r }) }, r.class_rooms_code))) })) })] })] })] }) })] }));
};
/* ===================== Small UI ===================== */
function MiniKPI({ palette, icon, label, value, }) {
    return (_jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: { background: palette.primary2, color: palette.primary }, children: icon }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: label }), _jsx("div", { className: "text-xl font-semibold", children: value })] })] }) }));
}
function RoomCard({ room, palette }) {
    const isVirtual = room.class_rooms_is_virtual;
    return (_jsxs("div", { className: "rounded-2xl border p-4 h-full flex flex-col gap-3", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-semibold truncate", children: room.class_rooms_name }), _jsxs("div", { className: "text-sm mt-0.5", style: { color: palette.black2 }, children: ["Kode: ", room.class_rooms_code] })] }), _jsx(Badge, { palette: palette, variant: isVirtual ? "info" : "black1", children: isVirtual ? "Virtual" : "Fisik" })] }), _jsxs("div", { className: "text-sm flex items-center gap-2", style: { color: palette.black2 }, children: [isVirtual ? _jsx(LinkIcon, { size: 14 }) : _jsx(MapPin, { size: 14 }), room.class_rooms_location] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-sm", style: { color: palette.black2 }, children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Users, { size: 14 }), " ", room.class_rooms_capacity, " kursi"] }), !isVirtual && room.class_rooms_floor != null && (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Building2, { size: 14 }), " Lantai ", room.class_rooms_floor] }))] }), room.class_rooms_description && (_jsx("p", { className: "text-sm", style: { color: palette.black2 }, children: room.class_rooms_description })), !!room.class_rooms_features?.length && (_jsx("div", { className: "flex flex-wrap gap-1.5", children: room.class_rooms_features.map((f, i) => (_jsx(Badge, { palette: palette, variant: "outline", children: _jsx("span", { style: { color: palette.black2 }, children: f }) }, i))) })), _jsxs("div", { className: "pt-1 mt-auto flex items-center justify-end gap-2", children: [_jsx(Link, { to: "detail", state: { term: DUMMY_TERM }, children: _jsx(Btn, { palette: palette, variant: "secondary", size: "sm", children: "Detail" }) }), _jsx(Link, { to: "manage", state: { room }, children: _jsx(Btn, { palette: palette, size: "sm", children: "Kelola" }) })] })] }));
}
export default AcademicSchool;
