import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/dashboard-school/rooms/DetailRoomSchool.tsx
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { ArrowLeft, Loader2, Building2, MapPin, Users } from "lucide-react";
import { seed } from "./RoomSchool";
/* ===================== CONFIG ===================== */
const USE_DUMMY = true;
/* ===================== QK ========================= */
const QK = {
    ROOM: (id) => ["room", id],
};
/* ===================== UTILS ====================== */
const atLocalNoonISO = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x.toISOString();
};
/* ================== API QUERY =================== */
function useRoomQuery(id) {
    return useQuery({
        queryKey: QK.ROOM(id),
        queryFn: async () => {
            const res = await axios.get(`/api/a/rooms/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        },
        enabled: !USE_DUMMY && !!id,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}
function InfoRow({ label, value, palette }) {
    return (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-sm opacity-90", style: { color: palette.black1 }, children: label }), _jsx("span", { className: "font-medium text-sm", children: value })] }));
}
function InfoSection({ title, children, palette }) {
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "font-semibold text-base pb-2 border-b", style: { borderColor: palette.silver1 }, children: title }), children] }));
}
/* ===================== PAGE ======================= */
export default function DetailRoomSchool() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // Query untuk data room (disabled jika USE_DUMMY)
    const roomQuery = useRoomQuery(id || "");
    // Data room dari dummy atau API
    const room = USE_DUMMY
        ? seed.find((r) => r.id === id)
        : roomQuery.data;
    const topbarGregorianISO = useMemo(() => atLocalNoonISO(new Date()), []);
    // Loading state
    if (!USE_DUMMY && roomQuery.isLoading) {
        return (_jsx("div", { className: "min-h-screen w-full grid place-items-center", style: { background: palette.white2 }, children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx(Loader2, { className: "animate-spin", size: 32, style: { color: palette.primary } }), _jsx("p", { className: "text-sm opacity-70", children: "Memuat data ruangan..." })] }) }));
    }
    // Error or not found
    if (!room) {
        return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Ruangan", showBack: true, gregorianDate: topbarGregorianISO, hijriDate: new Date(topbarGregorianISO).toLocaleDateString("id-ID-u-ca-islamic-umalqura", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }), dateFmt: (iso) => iso
                        ? new Date(iso).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                        : "-" }), _jsx("main", { className: "px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsx("section", { className: "flex-1", children: _jsxs(SectionCard, { palette: palette, className: "p-8 text-center", children: [_jsx(Building2, { size: 48, className: "mx-auto mb-4 opacity-30" }), _jsx("h2", { className: "text-lg font-semibold mb-2", children: "Ruangan tidak ditemukan" }), _jsx("p", { className: "text-sm opacity-70 mb-4", children: "Data ruangan dengan ID tersebut tidak tersedia." }), _jsx(Btn, { palette: palette, onClick: () => navigate(-1), children: "Kembali" })] }) })] }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Ruangan", showBack: true, gregorianDate: topbarGregorianISO, hijriDate: new Date(topbarGregorianISO).toLocaleDateString("id-ID-u-ca-islamic-umalqura", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }), dateFmt: (iso) => iso
                    ? new Date(iso).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })
                    : "-" }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 min-w-0 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), title: "Kembali", className: "md:flex hidden", children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "font-semibold text-base", children: room.name }), room.code && (_jsxs("p", { className: "text-sm opacity-70 mt-1", children: ["Kode: ", room.code] }))] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-lg grid place-items-center", style: {
                                                            background: palette.primary2,
                                                            color: palette.primary,
                                                        }, children: _jsx(Users, { size: 20 }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm opacity-90", style: { color: palette.black1 }, children: "Kapasitas" }), _jsx("div", { className: "text-lg font-semibold", children: room.capacity })] })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-lg grid place-items-center", style: {
                                                            background: palette.primary2,
                                                            color: palette.primary,
                                                        }, children: _jsx(MapPin, { size: 20 }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm opacity-90", style: { color: palette.black1 }, children: "Lokasi" }), _jsx("div", { className: "text-sm font-medium", children: room.location || "—" })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-5 space-y-4", children: _jsxs(InfoSection, { title: "Informasi Dasar", palette: palette, children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", style: { color: palette.black1 }, children: [_jsx(InfoRow, { label: "Nama Ruangan", value: room.name, palette: palette }), _jsx(InfoRow, { label: "Kode", value: room.code ?? "—", palette: palette }), _jsx(InfoRow, { label: "Kapasitas", value: `${room.capacity} siswa`, palette: palette }), _jsx(InfoRow, { label: "Lokasi", value: room.location ?? "—", palette: palette }), _jsx(InfoRow, { label: "Status", value: _jsx(Badge, { palette: palette, variant: room.is_active ? "success" : "outline", children: room.is_active ? "Aktif" : "Nonaktif" }), palette: palette })] }), room.description && (_jsx("div", { className: "pt-2", children: _jsx(InfoRow, { label: "Deskripsi", value: room.description, palette: palette }) }))] }) }) }), room.is_virtual && (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-5 space-y-4", children: _jsx(InfoSection, { title: "Informasi Virtual Room", palette: palette, children: _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(InfoRow, { label: "Platform", value: room.platform ?? "—", palette: palette }), _jsx(InfoRow, { label: "Meeting ID", value: room.meeting_id ?? "—", palette: palette }), _jsx(InfoRow, { label: "Passcode", value: room.passcode ?? "—", palette: palette }), _jsx(InfoRow, { label: "Join URL", value: room.join_url ? (_jsx("a", { href: room.join_url, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:underline break-all", children: room.join_url })) : ("—"), palette: palette })] }) }) }) }))] }), room.features && room.features.length > 0 && (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-5 space-y-3", children: [_jsx("h3", { className: "font-semibold text-base pb-2 border-b", style: { borderColor: palette.silver1 }, children: "Fasilitas" }), _jsx("div", { className: "flex flex-wrap gap-2", children: room.features.map((feature, idx) => (_jsx(Badge, { palette: palette, variant: "outline", children: feature }, idx))) })] }) })), room.schedule && room.schedule.length > 0 && (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-5 space-y-3 items-center flex-col", children: [_jsx("h3", { className: "font-semibold text-base pb-2 border-b", style: { borderColor: palette.silver1 }, children: "Jadwal" }), _jsx("div", { className: "space-y-2 md:flex  items-center justify-center gap-3", children: room.schedule.map((s, idx) => (_jsxs("div", { className: "p-3 rounded-lg border w-full gap-x-3 flex-col  items-center ", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                    }, children: [_jsx("div", { className: "font-medium text-sm mb-1", children: s.label }), _jsxs("div", { className: "text-sm opacity-90", children: [s.day ?? s.date, " \u2022 ", s.from, " \u2013 ", s.to, " \u2022 Grup ", s.group] })] }, idx))) })] }) })), room.notes && room.notes.length > 0 && (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-5 space-y-3", children: [_jsx("h3", { className: "font-semibold text-base pb-2 border-b", style: { borderColor: palette.silver1 }, children: "Catatan" }), _jsx("div", { className: "space-y-2", children: room.notes.map((note, idx) => (_jsxs("div", { className: "p-3 rounded-lg border", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                    }, children: [_jsx("div", { className: "text-sm opacity-90 mb-1", children: new Date(note.ts).toLocaleString("id-ID", {
                                                                weekday: "short",
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }) }), _jsx("div", { className: "text-sm", children: note.text })] }, idx))) })] }) })), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-5 space-y-3", children: [_jsx("h3", { className: "font-semibold text-base pb-2 border-b", style: { borderColor: palette.silver1 }, children: "Metadata" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(InfoRow, { label: "Dibuat pada", value: room.created_at
                                                            ? new Date(room.created_at).toLocaleString("id-ID")
                                                            : "—", palette: palette }), _jsx(InfoRow, { label: "Diperbarui pada", value: room.updated_at
                                                            ? new Date(room.updated_at).toLocaleString("id-ID")
                                                            : "—", palette: palette })] })] }) })] })] }) })] }));
}
