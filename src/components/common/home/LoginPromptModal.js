import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function LoginPromptModal({ show, onClose, onLogin, onContinue, title = "Login Diperlukan", message = "Silakan login terlebih dahulu untuk mengakses fitur ini.", continueLabel = "Lanjutkan Tanpa Login", showContinueButton = false, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    if (!show)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", children: _jsxs("div", { className: "rounded-lg p-6 w-[90%] max-w-sm text-center shadow-lg", style: { backgroundColor: theme.white1 }, children: [_jsx("h3", { className: "text-lg font-semibold mb-4", style: { color: theme.black1 }, children: title }), _jsx("p", { className: "text-sm mb-4", style: { color: theme.silver2 }, children: message }), _jsxs("div", { className: "flex justify-center gap-2 flex-wrap", children: [showContinueButton && (_jsx("button", { onClick: onContinue, className: "px-4 py-2 text-sm rounded", style: {
                                backgroundColor: theme.white3,
                                color: theme.black1,
                            }, children: continueLabel })), _jsx("button", { onClick: onLogin || (() => (window.location.href = "/login")), className: "px-4 py-2 text-sm rounded", style: {
                                backgroundColor: theme.primary,
                                color: theme.white1,
                            }, children: "Login" }), _jsx("button", { onClick: onClose, className: "px-4 py-2 text-sm rounded", style: {
                                backgroundColor: theme.error1,
                                color: theme.white1,
                            }, children: "Tutup" })] })] }) }));
}
