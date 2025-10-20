import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/jadwal/DetailSchedule.tsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ModalEditSchedule from "@/pages/sekolahislamku/dashboard-school/dashboard/ModalEditSchedule";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
const decodeId = (id) => {
    try {
        return decodeURIComponent(id);
    }
    catch {
        return id;
    }
};
export default function DetailSchedule() {
    const { scheduleId = "" } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // Ambil item dari state (jika datang dari list). Kalau tidak ada, kita
    // hanya tampilkan ID ter-decode. (Nanti bisa kamu sambungkan ke API by id.)
    const incoming = state?.item;
    const [item, setItem] = useState(incoming ?? null);
    const [editOpen, setEditOpen] = useState(false);
    const readableId = useMemo(() => decodeId(scheduleId), [scheduleId]);
    const handleDelete = () => {
        if (!confirm(`Hapus jadwal ini?`))
            return;
        // TODO: panggil API delete bila sudah ada
        navigate(-1); // kembali ke list
    };
    const handleSubmitEdit = (p) => {
        // TODO: sambungkan ke API update bila sudah ada
        setItem({ title: p.title, time: p.time, room: p.room });
        setEditOpen(false);
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Jadwal", gregorianDate: new Date().toISOString(), showBack: true }), _jsx(ModalEditSchedule, { open: editOpen, onClose: () => setEditOpen(false), palette: palette, defaultTitle: item?.title || "", defaultTime: item?.time || "", defaultRoom: item?.room || "", onSubmit: handleSubmitEdit, onDelete: handleDelete }), _jsx("main", { className: "px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-6", children: [_jsx("div", { className: "flex items-center justify-between gap-2", children: _jsxs("div", { className: "md:flex hidden items-center gap-3 font-semibold text-lg", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { className: "cursor-pointer", size: 20 }) }), _jsx("span", { children: "Detail Jadwal" })] }) }), _jsx(SectionCard, { palette: palette, className: "p-4 md:p-5", children: item ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "font-bold text-xl", children: item.title }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm", children: [_jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(Clock, { size: 16 }), _jsx(Badge, { palette: palette, variant: "white1", children: item.time || "-" })] }), _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(MapPin, { size: 16 }), _jsx(Badge, { palette: palette, variant: "outline", children: item.room || "-" })] })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "font-bold text-xl break-words", children: ["Jadwal: ", _jsx("span", { className: "font-normal", children: readableId })] }), _jsx("div", { className: "mt-2 text-sm", style: { color: palette.silver2 }, children: "Data detail tidak dikirim via state. Sambungkan fetch by ID di sini bila diperlukan." })] })) })] })] }) })] }));
}
