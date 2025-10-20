import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import useHtmlDarkMode from "@/hooks/userHTMLDarkMode";
export default function InputField({ label, name, value, placeholder = "", type = "text", as = "input", rows = 4, accept, onChange, onFileChange, }) {
    const { isDark } = useHtmlDarkMode();
    const baseInputClass = `w-full text-sm px-4 py-2.5 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark
        ? "text-white placeholder-zinc-500 bg-zinc-800 border-zinc-700"
        : "text-black placeholder-gray-400 bg-white border-gray-300"}`;
    return (_jsxs("div", { className: "w-full space-y-1", children: [_jsx("label", { htmlFor: name, className: `block text-sm font-medium ${isDark ? "text-zinc-300" : "text-gray-700"}`, children: label }), as === "textarea" ? (_jsx("textarea", { id: name, name: name, rows: rows, value: value, onChange: onChange, placeholder: placeholder, className: baseInputClass })) : type === "file" ? (_jsx("input", { id: name, name: name, type: "file", accept: accept, onChange: onFileChange, className: baseInputClass })) : (_jsx("input", { id: name, name: name, type: type, value: value, onChange: onChange, placeholder: placeholder, className: baseInputClass }))] }));
}
