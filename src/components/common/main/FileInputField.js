import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/common/main/FileInputField.tsx
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function FileInputField({ label, name, onChange, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsxs("div", { className: "w-full space-y-1", children: [_jsx("label", { htmlFor: name, className: "block text-sm font-medium", style: { color: theme.black2 }, children: label }), _jsx("input", { id: name, name: name, type: "file", onChange: onChange, className: "w-full text-sm px-4 py-2.5 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500", style: {
                    backgroundColor: theme.white2,
                    borderColor: theme.silver1,
                    color: theme.black1,
                } })] }));
}
