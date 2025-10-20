import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function MasjidDonationMotivation() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        contact: "",
        message: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    return (_jsxs("div", { className: "min-h-screen pb-20", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsxs("div", { className: "px-4 py-6 space-y-2", children: [_jsx("h1", { className: "text-lg font-semibold", children: "Pesan dan Motivasi" }), _jsx("p", { className: "text-sm font-medium text-green-600", children: "Alhamdulillah donasi berhasil" }), _jsxs("p", { className: "text-sm", children: ["Jazaakumullah khair semoga dibalas dengan yang lebih baik lagi oleh Allah ta'ala. Mohon lengkapi data berikut", " ", _jsx("span", { className: "italic", children: "(opsional)" }), "."] })] }), _jsxs("div", { className: "space-y-4 px-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium", children: "Nama Donatur" }), _jsx("input", { name: "name", value: form.name, onChange: handleChange, placeholder: "Cth: Ahmad, Hamba Allah", className: "w-full border rounded-md px-3 py-2 text-sm", style: {
                                    backgroundColor: theme.white2,
                                    borderColor: theme.silver2,
                                    color: theme.black1,
                                } })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium", children: "Email/No. Whatsapp" }), _jsx("input", { name: "contact", value: form.contact, onChange: handleChange, placeholder: "Masukkan bidang", className: "w-full border rounded-md px-3 py-2 text-sm", style: {
                                    backgroundColor: theme.white2,
                                    borderColor: theme.silver2,
                                    color: theme.black1,
                                } })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm font-medium", children: "Pesan Nasihat / Motivasi" }), _jsx("textarea", { name: "message", value: form.message, onChange: handleChange, placeholder: "Masukan sambutan", className: "w-full border rounded-md px-3 py-2 text-sm", rows: 4, style: {
                                    backgroundColor: theme.white2,
                                    borderColor: theme.silver2,
                                    color: theme.black1,
                                } })] })] }), _jsxs("div", { className: "fixed bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-3 bg-white border-t dark:bg-black dark:border-zinc-800", children: [_jsx("button", { onClick: () => {
                            // TODO: handle upload bukti transfer
                            alert("Fitur upload bukti transfer coming soon");
                        }, className: "flex-1 py-2 rounded-md text-sm font-medium", style: {
                            backgroundColor: theme.white2,
                            color: theme.black1,
                            border: `1px solid ${theme.silver1}`,
                        }, children: "Bukti Transfer" }), _jsx("button", { onClick: () => {
                            // Simpan dan lanjut
                            console.log("Form dikirim:", form);
                            navigate("/masjid/slug/selesai"); // Ganti sesuai alur final
                        }, className: "p-3 rounded-md", style: { backgroundColor: theme.primary }, children: _jsx("span", { className: "text-white text-xl", children: "\u27A4" }) })] })] }));
}
