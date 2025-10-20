import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { colors } from '@/constants/colorsThema';
export default function StatCard({ label, value, icon, bgIcon, }) {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);
    const theme = isDark ? colors.dark : colors.light;
    return (_jsxs("div", { className: "w-[250px] h-[116px] rounded-xl shadow flex justify-between p-4", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: label }), _jsx("p", { className: "text-xl font-bold mt-1", children: value })] }), _jsx("div", { className: `w-10 h-10 flex items-center justify-center rounded-full shrink-0 mt-2 ${bgIcon ?? ''}`, style: !bgIcon ? { backgroundColor: theme.primary2 } : undefined, children: icon })] }));
}
