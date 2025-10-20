import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/pendaftaran/PendaftaranPage.tsx
import { useMemo } from "react";
import { ModalRegister } from "../components/RegisterModalUser";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function RegisterDetailUser() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const styles = useMemo(() => ({
        pageBg: { backgroundColor: theme.white2 },
        card: {
            backgroundColor: theme.white1,
            borderColor: theme.white3,
            color: theme.black1,
        },
        title: { color: theme.black1 },
        subtitle: { color: theme.silver2 },
    }), [theme]);
    return (_jsx("div", { className: "min-h-dvh flex items-center justify-center p-6", style: styles.pageBg, children: _jsxs("div", { className: "w-full max-w-3xl rounded-2xl shadow-sm ring-1 p-6", style: {
                backgroundColor: styles.card.backgroundColor,
                borderColor: styles.card.borderColor,
                color: styles.card.color,
            }, children: [_jsx("h1", { className: "text-2xl font-semibold tracking-tight", style: styles.title, children: "Pendaftaran Peserta Baru" }), _jsx("p", { className: "mt-2 text-sm md:text-base", style: styles.subtitle, children: "Silakan klik tombol di bawah untuk memulai proses pendaftaran." }), _jsx("div", { className: "mt-6", children: _jsx(ModalRegister, { slug: "murid", onSubmit: async (payload) => {
                            console.log("submit payload:", payload);
                        } }) })] }) }));
}
