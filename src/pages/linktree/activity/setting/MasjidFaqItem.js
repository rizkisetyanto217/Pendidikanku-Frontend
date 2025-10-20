import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function MasjidFaqItem({ number, question, answer, }) {
    const [open, setOpen] = useState(false);
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsxs("div", { className: "rounded-xl border px-4 py-3 transition-all shadow-sm", style: {
            backgroundColor: theme.white1,
            borderColor: theme.white3,
            color: theme.black1,
        }, children: [_jsxs("button", { onClick: () => setOpen((prev) => !prev), className: "flex justify-between items-center w-full text-left", children: [_jsxs("span", { className: "text-sm font-medium", children: [number, ". ", question] }), _jsx(ChevronDown, { className: `w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`, style: { color: theme.black2 } })] }), _jsx("div", { className: `overflow-hidden transition-all duration-200 ease-in-out ${open ? "max-h-[500px] mt-3" : "max-h-0"}`, children: _jsx("p", { className: "text-sm leading-relaxed", style: { color: theme.silver2 }, children: answer }) })] }));
}
