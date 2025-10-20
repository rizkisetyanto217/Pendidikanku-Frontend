import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export default function ImagePreview({ label, url }) {
    if (!url)
        return null;
    return (_jsxs("div", { className: "mt-2", children: [_jsxs("p", { className: "text-xs text-muted-foreground mb-1", children: ["Gambar ", label, " Saat Ini:"] }), _jsx("img", { src: url, alt: `Gambar ${label}`, className: "rounded-md w-full max-h-40 object-contain border" })] }));
}
