import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
const generateSlug = (text) => text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
export default function ListJadwal({ palette, items, title = "Daftar Jadwal", onAdd, addLabel = "Tambah Jadwal", }) {
    return (_jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 flex items-center justify-between", children: [_jsxs("h3", { className: "text-base font-semibold tracking-tight flex items-center gap-2", children: [_jsx(CalendarDays, { size: 20, color: palette.quaternary }), " ", title] }), onAdd && (_jsx(Btn, { size: "sm", variant: "ghost", palette: palette, onClick: onAdd, children: addLabel }))] }), _jsx("div", { className: "p-4 pt-2 sm:p-4 lg:px-3 lg:py-0 space-y-3 mb-5", children: items.length > 0 ? (items.map((s, i) => {
                    const slug = s.slug || generateSlug(s.title);
                    return (_jsx(Link, { to: `/jadwal/${slug}`, children: _jsxs(SectionCard, { palette: palette, className: "p-3 flex items-center justify-between hover:bg-gray-50 transition rounded-xl mb-3", style: { background: palette.white2 }, children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium flex gap-3", children: s.title }), s.room && (_jsx("div", { style: { fontSize: 12, color: palette.silver2 }, className: "truncate", children: s.room }))] }), _jsx(Badge, { variant: "white1", palette: palette, children: s.time })] }) }, `${s.title}-${i}`));
                })) : (_jsx("div", { className: "text-sm text-center py-4", style: { color: palette.silver2 }, children: "Belum ada jadwal tersedia." })) })] }));
}
