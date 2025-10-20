import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import PublicUserDropdown from "@/components/common/public/UserDropDown"; // ⬅️ import
export default function PageTopBar({ palette, backTo = "/student", onBack, label, title, rightSlot = _jsx(PublicUserDropdown, { variant: "icon" }), // ⬅️ default-nya dropdown
sticky = true, className, }) {
    const navigate = useNavigate();
    return (_jsx("div", { className: `${sticky ? "sticky top-0 z-40" : ""} border-b ${className ?? ""}`, style: {
            background: `${palette.white1}E6`,
            borderColor: palette.silver1,
        }, children: _jsxs("div", { className: "mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [onBack ? (_jsx("button", { onClick: onBack, children: _jsx(Btn, { variant: "outline", size: "sm", palette: palette, children: _jsx(ArrowLeft, { size: 16 }) }) })) : (_jsx(Link, { to: backTo, children: _jsx(Btn, { variant: "outline", size: "sm", palette: palette, children: _jsx(ArrowLeft, { size: 16 }) }) })), (label || title) && (_jsxs("div", { className: "pl-1 flex items-center gap-2 min-w-0", children: [label && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-sm", style: { color: palette.silver2 }, children: label }), _jsx("span", { className: "hidden sm:inline-block w-1 h-1 rounded-full", style: { background: palette.silver2 } })] })), title && (_jsx("span", { className: "font-semibold truncate max-w-[50vw]", children: title }))] }))] }), rightSlot /* akan default ke PublicUserDropdown kalau tidak diisi */] }) }));
}
