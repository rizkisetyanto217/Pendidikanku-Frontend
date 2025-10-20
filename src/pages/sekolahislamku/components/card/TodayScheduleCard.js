import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/components/card/TodayScheduleCard.tsx
import { Link } from "react-router-dom";
import { CalendarDays, ChevronRight } from "lucide-react";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
const slugify = (text) => (text ?? "")
    .toString()
    .normalize("NFKD") // buang diakritik
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
export default function TodayScheduleCard({ palette, items, title = "Daftar Jadwal", seeAllPath = "/jadwal", seeAllState, getSeeAllState, onAdd, addLabel = "Tambah Jadwal", addHref, maxItems = 3, onItemClick, }) {
    const visible = maxItems > 0 ? items.slice(0, maxItems) : items;
    const finalState = typeof getSeeAllState === "function" ? getSeeAllState(items) : seeAllState;
    return (_jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 flex items-center justify-between", children: [_jsxs("div", { className: " pb-1 font-medium flex items-center gap-2 md:-mt-1", children: [_jsx("div", { className: "h-9 w-9 rounded-xl flex items-center justify-center ", style: {
                                    background: palette.white3,
                                    color: palette.quaternary,
                                }, children: _jsx(CalendarDays, { size: 18 }) }), _jsx("h1", { className: "text-base font-semibold", children: title })] }), addHref ? (_jsx(Link, { to: addHref, children: _jsx(Btn, { size: "sm", variant: "ghost", palette: palette, "aria-label": addLabel, children: addLabel }) })) : onAdd ? (_jsx(Btn, { size: "sm", variant: "ghost", palette: palette, onClick: onAdd, "aria-label": addLabel, children: addLabel })) : null] }), _jsxs("div", { className: "p-4  sm:p-4 lg:px-3 lg:py-0 mb-4 space-y-3 -mt-1", children: [visible.map((s, i) => {
                        const slug = s.slug || slugify(s.title);
                        const href = `/jadwal/${slug}`;
                        return (_jsx(Link, { to: href, onClick: (e) => {
                                if (onItemClick) {
                                    e.preventDefault();
                                    onItemClick(s, i);
                                }
                            }, children: _jsxs(SectionCard, { palette: palette, className: "p-3 flex items-center justify-between hover:bg-gray-50 transition rounded-xl mb-4", style: { background: palette.white2 }, children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium flex gap-3", children: _jsx("h1", { className: "text-base", children: s.title }) }), (s.room || s.time) && (_jsx("div", { style: { fontSize: 12, color: palette.black2 }, children: _jsx("h2", { className: "text-sm", children: s.room }) }))] }), _jsx(Badge, { variant: "white1", palette: palette, "aria-label": `Waktu ${s.time}`, children: _jsxs("p", { className: "text-sm", children: [" ", s.time] }) })] }) }, `${slug}-${s.time}-${i}`));
                    }), _jsx("div", { className: "pt-3", children: _jsx(Link, { to: seeAllPath, state: finalState, children: _jsx(Link, { to: seeAllPath, state: finalState, children: _jsxs(Btn, { variant: "ghost", className: "w-full", palette: palette, children: ["Lihat Jadwal ", _jsx(ChevronRight, { className: "ml-1", size: 16 })] }) }) }) })] })] }));
}
