import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { ArrowLeft, MapPin, Link as LinkIcon, Users, Building2, Plus, Pencil, Trash2, } from "lucide-react";
/* ===== Dummy fallback kalau tidak ada state ===== */
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
/* ===== Helpers ===== */
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
export default function ManagementAcademic() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    // ambil data room dari state (opsional)
    const { state } = useLocation();
    const [rooms, setRooms] = useState(state?.room ? [state.room] : DUMMY_ROOMS);
    const topbarISO = toLocalNoonISO(new Date());
    // handler dummy
    const handleDelete = (code) => {
        if (window.confirm("Hapus ruang ini?")) {
            setRooms((prev) => prev.filter((r) => r.class_rooms_code !== code));
        }
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Manajemen Ruang Kelas", gregorianDate: topbarISO, showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-8 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between ", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", size: "sm", onClick: () => navigate(-1), className: "flex items-center gap-1.5 p-5", children: _jsx(ArrowLeft, { size: 20, className: "mr-1" }) }), _jsx("h1", { className: "md:flex hidden items-center text-lg font-semibold ", children: "Kelola Akademik" })] }), _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", children: _jsx(Plus, { size: 16, className: "mr-1 " }) })] }), _jsx(SectionCard, { palette: palette, className: "p-5", children: _jsx("div", { className: "space-y-4", children: rooms.length === 0 ? (_jsx("div", { className: "rounded-xl border p-4 text-sm text-center", style: {
                                                borderColor: palette.silver1,
                                                color: palette.black2,
                                            }, children: "Belum ada ruang terdaftar." })) : (rooms.map((room) => (_jsxs("div", { className: "rounded-xl border p-4 flex flex-col gap-3", style: {
                                                borderColor: palette.silver1,
                                                background: palette.white1,
                                            }, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: room.class_rooms_name }), _jsx("div", { className: "text-xs", style: { color: palette.black2 }, children: room.class_rooms_code })] }), _jsx(Badge, { palette: palette, variant: room.class_rooms_is_virtual ? "info" : "black1", children: room.class_rooms_is_virtual ? "Virtual" : "Fisik" })] }), _jsxs("div", { className: "text-sm flex items-center gap-2", style: { color: palette.black2 }, children: [room.class_rooms_is_virtual ? (_jsx(LinkIcon, { size: 14 })) : (_jsx(MapPin, { size: 14 })), room.class_rooms_location] }), _jsxs("div", { className: "flex flex-wrap gap-4 text-sm", style: { color: palette.black2 }, children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Users, { size: 14 }), " ", room.class_rooms_capacity, " kursi"] }), !room.class_rooms_is_virtual &&
                                                            room.class_rooms_floor && (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Building2, { size: 14 }), " Lantai", " ", room.class_rooms_floor] }))] }), room.class_rooms_description && (_jsx("p", { className: "text-sm", style: { color: palette.black2 }, children: room.class_rooms_description })), !!room.class_rooms_features?.length && (_jsx("div", { className: "flex flex-wrap gap-1.5", children: room.class_rooms_features.map((f, i) => (_jsx(Badge, { palette: palette, variant: "outline", children: _jsx("span", { style: { color: palette.black2 }, children: f }) }, i))) })), _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsxs(Btn, { palette: palette, size: "sm", variant: "secondary", children: [_jsx(Pencil, { size: 14, className: "mr-1" }), " Edit"] }), _jsxs(Btn, { palette: palette, size: "sm", variant: "destructive", onClick: () => handleDelete(room.class_rooms_code), children: [_jsx(Trash2, { size: 14, className: "mr-1" }), " Hapus"] })] })] }, room.class_rooms_code)))) }) })] })] }) })] }));
}
