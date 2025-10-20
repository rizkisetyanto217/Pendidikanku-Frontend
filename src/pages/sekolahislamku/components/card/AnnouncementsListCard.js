import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Bell, ChevronRight, Edit3, Trash2, Plus } from "lucide-react";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
/* ================= Utils ================= */
const generateSlug = (text) => (text ?? "")
    .toLowerCase()
    .trim()
    .replace(/[_—–]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
const getBadgeVariant = (type) => {
    switch (type) {
        case "warning":
            return "warning";
        case "success":
            return "success";
        default:
            return "info";
    }
};
const defaultDateFormat = (iso) => {
    try {
        return new Date(iso).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }
    catch {
        return iso;
    }
};
/* ================= Subcomponents ================= */
const EmptyState = ({ palette }) => (_jsx("div", { className: "rounded-xl border p-4 text-sm", style: { borderColor: palette.silver1, color: palette.black2 }, children: "Belum ada pengumuman." }));
const Header = ({ palette, canAdd, onAdd, addHref, seeAllPath, seeAllState, }) => (_jsx("div", { className: "p-4 md:p-5 pb-3 border-b", style: { borderColor: palette.silver1 }, children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [_jsxs("div", { className: "pb-1 font-medium flex items-center gap-2 md:-mt-1", children: [_jsx("div", { className: "h-9 w-9 rounded-xl flex items-center justify-center", style: {
                            background: palette.white3,
                            color: palette.quaternary,
                        }, children: _jsx(Bell, { size: 18 }) }), _jsx("h1", { className: "text-base font-semibold", children: "Pengumuman" })] }), _jsxs("div", { className: "hidden md:flex flex-wrap items-center gap-2", children: [canAdd && (_jsx(_Fragment, { children: onAdd ? (_jsx(Btn, { size: "sm", palette: palette, onClick: onAdd, children: _jsx(Plus, { className: "mr-1", size: 16 }) })) : addHref ? (_jsx(Link, { to: addHref, children: _jsx(Btn, { size: "sm", palette: palette, children: _jsx(Plus, { className: "mr-1", size: 16 }) }) })) : null })), _jsx(Link, { to: seeAllPath, state: seeAllState, children: _jsxs(Btn, { variant: "ghost", size: "sm", palette: palette, className: "gap-1", children: ["Lihat semua", _jsx(ChevronRight, { size: 16 })] }) })] })] }) }));
const AnnouncementCard = ({ announcement, palette, dateFmt, detailHref, editHref, showActions, onEdit, onDelete, isDeleting, }) => (_jsx("div", { className: "rounded-xl border transition-all hover:translate-x-[1px]", style: {
        borderColor: palette.silver1,
        background: palette.white1,
    }, children: _jsxs("div", { className: "p-3 sm:p-4 md:p-5 grid gap-3 md:gap-4 md:grid-cols-[1fr,auto]", children: [_jsxs(Link, { to: detailHref, className: "min-w-0 block", children: [_jsx("div", { className: "font-medium truncate", children: announcement.title }), _jsx("div", { className: "mt-0.5 text-sm", style: { color: palette.black2 }, children: dateFmt(announcement.date) }), _jsx("p", { className: "text-sm mt-2 line-clamp-3", style: { color: palette.black2 }, children: announcement.body }), _jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: _jsx(Badge, { variant: getBadgeVariant(announcement.type), palette: palette, children: announcement.type ?? "info" }) })] }), showActions && (onEdit || onDelete) && (_jsxs("div", { className: "flex items-center gap-2 justify-end", children: [onEdit && (_jsx(Btn, { size: "sm", variant: "outline", palette: palette, onClick: () => onEdit(announcement), children: _jsx(Edit3, { size: 14 }) })), onDelete && (_jsx(Btn, { size: "sm", variant: "quaternary", palette: palette, onClick: () => onDelete(announcement), disabled: isDeleting, children: _jsx(Trash2, { size: 14 }) }))] }))] }) }));
const Footer = ({ palette, seeAllPath, seeAllState }) => (_jsx("div", { className: "px-4 pb-4 md:hidden", children: _jsx(Link, { to: seeAllPath, state: seeAllState, children: _jsxs(Btn, { size: "sm", variant: "ghost", palette: palette, className: "w-full flex items-center justify-center gap-1", children: ["Lihat semua", _jsx(ChevronRight, { size: 16 })] }) }) }));
/* ================= Main Component ================= */
export default function AnnouncementsListCard({ palette, items, dateFmt = defaultDateFormat, seeAllPath, seeAllState, getDetailHref, getEditHref, onEdit, onDelete, showActions = false, canAdd = false, onAdd, addHref, deletingId, className = "", }) {
    const isEmpty = !items || items.length === 0;
    return (_jsxs(SectionCard, { palette: palette, className: className, children: [_jsx(Header, { palette: palette, canAdd: canAdd, onAdd: onAdd, addHref: addHref, seeAllPath: seeAllPath, seeAllState: seeAllState }), _jsx("div", { className: "p-4 md:p-5 space-y-3", children: isEmpty ? (_jsx(EmptyState, { palette: palette })) : (items.map((announcement) => {
                    const slug = announcement.slug || generateSlug(announcement.title);
                    const detailHref = getDetailHref
                        ? getDetailHref(announcement)
                        : `/pengumuman/${slug}`;
                    const editHref = getEditHref?.(announcement) ?? detailHref;
                    const isDeleting = deletingId === announcement.id;
                    return (_jsx(AnnouncementCard, { announcement: announcement, palette: palette, dateFmt: dateFmt, detailHref: detailHref, editHref: editHref, showActions: showActions, onEdit: onEdit, onDelete: onDelete, isDeleting: isDeleting }, announcement.id));
                })) }), _jsx(Footer, { palette: palette, seeAllPath: seeAllPath, seeAllState: seeAllState })] }));
}
