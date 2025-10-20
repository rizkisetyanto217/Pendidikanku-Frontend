import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// src/pages/dkm/setting/faq/FaqItem.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { colors } from '@/constants/colorsThema';
import useHtmlDarkMode from '@/hooks/userHTMLDarkMode';
export default function FaqItem({ number, question, answer }) {
    const [open, setOpen] = useState(false);
    const { isDark } = useHtmlDarkMode();
    const theme = isDark ? colors.dark : colors.light;
    return (_jsxs("div", { className: "rounded-lg border px-4 py-2 transition-all", style: {
            backgroundColor: theme.white1,
            borderColor: theme.white3,
            color: theme.black1,
        }, children: [_jsxs("button", { onClick: () => setOpen(!open), className: "flex justify-between items-center w-full font-medium text-left", children: [_jsxs("span", { children: [number, ". ", question] }), _jsx(ChevronDown, { className: `w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}` })] }), open && (_jsx("p", { className: "mt-2 text-sm", style: { color: theme.silver2 }, children: answer }))] }));
}
