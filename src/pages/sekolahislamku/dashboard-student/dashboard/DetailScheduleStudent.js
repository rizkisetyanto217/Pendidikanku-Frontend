import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/student/DetailSheduleStudent.tsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
export default function DetailScheduleStudent() {
    const { scheduleId = "" } = useParams();
    const location = useLocation();
    const state = (location.state ?? {});
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const item = state?.item;
    const readableId = (() => {
        try {
            return decodeURIComponent(scheduleId);
        }
        catch {
            return scheduleId;
        }
    })();
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Jadwal", gregorianDate: new Date().toISOString(), dateFmt: (iso) => new Date(iso).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }) }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsxs(Btn, { palette: palette, variant: "ghost", size: "sm", onClick: () => navigate(-1), children: [_jsx(ArrowLeft, { size: 16, className: "mr-1" }), "Kembali"] }), _jsx(SectionCard, { palette: palette, className: "p-4 md:p-5", children: item ? (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-lg font-bold", children: item.title }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-4 text-sm", children: [_jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(Clock, { size: 14 }), _jsx(Badge, { variant: "outline", palette: palette, children: _jsx("p", { style: { color: palette.black2 }, children: item.time || "-" }) })] }), item.room && (_jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(MapPin, { size: 14 }), _jsx(Badge, { variant: "outline", palette: palette, children: _jsx("p", { style: { color: palette.black2 }, children: item.room }) })] }))] })] })) : (_jsxs("div", { className: "text-sm", style: { color: palette.silver2 }, children: ["Data tidak dikirim dari halaman sebelumnya. ID:", " ", _jsx("b", { children: readableId })] })) })] })] }) })] }));
}
