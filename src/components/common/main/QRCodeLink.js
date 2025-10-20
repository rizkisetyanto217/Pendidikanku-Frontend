import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import toast from "react-hot-toast";
export default function QRCodeLink({ value }) {
    const [showUrl, setShowUrl] = useState(false);
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        toast.success("Link berhasil disalin!");
    };
    return (_jsx("div", { className: "flex justify-center py-4", children: _jsxs("div", { className: "flex flex-col items-center space-y-2", children: [_jsx("div", { onClick: () => setShowUrl(!showUrl), className: "cursor-pointer", children: _jsx(QRCodeSVG, { value: value, size: 128, bgColor: theme.white1, fgColor: theme.black1, includeMargin: true }) }), _jsx("p", { className: "text-xs text-center", style: { color: theme.silver2 }, children: "Klik QR Code untuk melihat dan menyalin tautan" }), showUrl && (_jsxs("div", { className: "text-center mt-2 space-y-1", children: [_jsx("a", { href: value, target: "_blank", rel: "noopener noreferrer", className: "text-sm underline block", style: { color: theme.primary }, children: value }), _jsx("button", { onClick: handleCopy, className: "text-xs px-3 py-1 rounded border", style: {
                                color: theme.success1,
                                borderColor: theme.success1,
                            }, children: "\uD83D\uDCCB Salin Link" })] }))] }) }));
}
