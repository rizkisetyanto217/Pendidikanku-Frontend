import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function ConfirmModal({ isOpen, onClose, onConfirm, title = "Konfirmasi", message = "Apakah Anda yakin ingin melanjutkan tindakan ini?", confirmText = "Ya", cancelText = "Batal", isLoading = false, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center", children: _jsxs("div", { className: "rounded-xl p-6 w-[90%] max-w-sm shadow-xl", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsx("h2", { className: "text-lg font-semibold mb-2", style: { color: theme.black1 }, children: title }), _jsx("p", { className: "text-sm mb-4", style: { color: theme.black2 }, children: message }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { className: "px-4 py-2 rounded-lg text-sm font-medium transition", onClick: onClose, style: {
                                backgroundColor: theme.white3,
                                color: theme.black1,
                            }, children: cancelText }), _jsx("button", { className: "px-4 py-2 rounded-lg text-sm font-medium transition", onClick: onConfirm, disabled: isLoading, style: {
                                backgroundColor: theme.error1,
                                color: theme.white1,
                                opacity: isLoading ? 0.7 : 1,
                            }, children: isLoading ? "Memproses..." : confirmText })] })] }) }));
}
