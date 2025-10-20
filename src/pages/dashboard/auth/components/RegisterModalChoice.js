import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dashboard/auth/components/RegisterChoiceModal.tsx
import { useEffect, useState, useMemo } from "react";
import { User, Building2, X, CheckCircle2 } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function RegisterChoiceModal({ open, onClose, onSelect, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [selected, setSelected] = useState(null);
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        if (open)
            document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    useEffect(() => {
        if (!open)
            setSelected(null);
        if (open) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prev;
            };
        }
    }, [open]);
    // ✅ PENTING: hooks (useMemo) dipanggil SEBELUM early return
    const styles = useMemo(() => ({
        cardBase: {
            backgroundColor: isDark ? `${theme.primary}12` : `${theme.primary}0F`,
            border: `1px solid ${theme.white3}`,
        },
        cardSelected: {
            border: `1px solid ${theme.primary}`,
            boxShadow: `0 0 0 3px ${theme.primary}22`,
        },
        muted: { color: theme.silver2 },
        chip: {
            backgroundColor: theme.white2,
            border: `1px solid ${theme.white3}`,
            color: theme.black1,
        },
    }), [isDark, theme]);
    if (!open)
        return null; // ✅ setelah semua hooks
    const Card = ({ title, desc, icon, choice, }) => {
        const active = selected === choice;
        return (_jsx("button", { type: "button", onClick: () => setSelected(choice), onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(choice);
                }
            }, className: "text-left rounded-2xl p-5 border transition w-full focus:outline-none", style: {
                ...styles.cardBase,
                ...(active ? styles.cardSelected : {}),
                color: theme.black1,
            }, "aria-pressed": active, "aria-label": title, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "h-10 w-10 grid place-items-center rounded-xl shrink-0", style: {
                            backgroundColor: theme.white2,
                            border: `1px solid ${theme.white3}`,
                        }, children: icon }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "font-semibold flex items-center gap-2", children: [title, active && (_jsx(CheckCircle2, { className: "h-4 w-4", style: { color: theme.primary } }))] }), _jsx("p", { className: "mt-2 text-sm", style: styles.muted, children: desc })] })] }) }));
    };
    return (_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center px-4", style: { backgroundColor: isDark ? "#00000080" : "#00000066" }, onMouseDown: (e) => e.target === e.currentTarget && onClose(), role: "dialog", "aria-modal": "true", "aria-labelledby": "register-choice-title", children: _jsxs("div", { className: "w-full max-w-2xl rounded-2xl overflow-hidden", style: {
                backgroundColor: theme.white1,
                color: theme.black1,
                border: `1px solid ${theme.white3}`,
            }, children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b", style: { borderColor: theme.white3 }, children: [_jsx("div", { id: "register-choice-title", className: "font-semibold", children: "Pilih Jenis Pendaftaran" }), _jsx("button", { "aria-label": "Tutup", onClick: onClose, className: "p-2 rounded-lg hover:opacity-80", style: { color: theme.silver2 }, children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "p-5", children: [_jsxs("p", { className: "text-sm mb-5", style: styles.muted, children: ["Pilih salah satu: ", _jsx("b", { children: "Daftar atas nama Sekolah" }), " atau", " ", _jsx("b", { children: "Daftar sebagai Pengguna" }), "."] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [_jsx(Card, { choice: "school", title: "Daftar atas nama Sekolah", desc: "Buat akun institusi untuk mengelola data sekolah, pengguna, dan modul.", icon: _jsx(Building2, { className: "h-5 w-5", style: { color: theme.primary } }) }), _jsx(Card, { choice: "user", title: "Daftar sebagai Pengguna", desc: "Buat akun pribadi (orang tua/siswa/guru) untuk akses fitur dasar.", icon: _jsx(User, { className: "h-5 w-5", style: { color: theme.primary } }) })] }), _jsxs("div", { className: "mt-6 flex items-center justify-between", children: [_jsx("span", { className: "text-xs", style: styles.muted, children: "Dengan melanjutkan, Anda menyetujui S&K dan Kebijakan Privasi." }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: onClose, className: "rounded-xl px-4 py-2 text-sm", style: {
                                                border: `1px solid ${theme.white3}`,
                                                color: theme.black1,
                                            }, children: "Batal" }), _jsx("button", { onClick: () => selected && onSelect(selected), disabled: !selected, className: "rounded-xl px-4 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed", style: {
                                                backgroundColor: selected ? theme.primary : theme.white3,
                                                color: selected ? theme.white1 : theme.silver2,
                                            }, children: "Lanjut" })] })] })] })] }) }));
}
