import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import useHtmlDarkMode from '@/hooks/userHTMLDarkMode';
import { colors } from '@/constants/colorsThema';
export default function SupportCard({ title, description, action }) {
    const { isDark } = useHtmlDarkMode();
    const theme = isDark ? colors.dark : colors.light;
    return (_jsxs("div", { className: "border rounded-xl p-4 shadow-sm space-y-2", style: {
            backgroundColor: theme.white2,
            borderColor: theme.silver1,
            color: theme.black1,
        }, children: [_jsx("h3", { className: "text-base font-semibold", children: title }), _jsx("div", { className: "text-sm", children: description }), action && _jsx("div", { children: action })] }));
}
