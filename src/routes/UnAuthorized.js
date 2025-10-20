import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Unauthorized.tsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home, Building2, Landmark, KeyRound, UsersRound, CheckCircle2, } from "lucide-react";
import useHtmlThema from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
// helper slug
function slugify(s) {
    return (s || "")
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}
export default function Unauthorized() {
    const nav = useNavigate();
    const loc = useLocation();
    const state = (loc.state || {});
    const { isDark, themeName } = useHtmlThema();
    const theme = pickTheme(themeName, isDark);
    // tokens warna biar konsisten dark/light
    const text = {
        title: isDark ? "#fff" : theme.black1,
        body: isDark ? theme.silver2 : theme.black2,
    };
    const surface = {
        card: theme.white1,
        cardAlt: theme.white2,
        border: theme.white3,
    };
    const badgeStyle = useMemo(() => ({
        backgroundColor: isDark ? "rgba(255,255,255,.08)" : theme.white1,
        borderColor: surface.border,
        color: isDark ? "#fff" : theme.black1,
    }), [isDark, surface.border, theme, text]);
    const [mode, setMode] = useState("none");
    // ====== form DKM (dummy) ======
    const [mName, setMName] = useState("Masjid Al-Hikmah");
    const [mCity, setMCity] = useState("Bandung");
    const [mAddress, setMAddress] = useState("Jl. Contoh No. 123");
    const [masjidCreatedSlug, setMasjidCreatedSlug] = useState(null);
    const createMasjid = (e) => {
        e.preventDefault();
        const slug = slugify(mName) || "masjid-baru";
        // dummy “berhasil”
        setMasjidCreatedSlug(slug);
    };
    // ====== form join sekolah (dummy) ======
    const [code, setCode] = useState("");
    const [joinAs, setJoinAs] = useState("teacher");
    const [joined, setJoined] = useState(null);
    const submitJoin = (e) => {
        e.preventDefault();
        // dummy resolver kode
        // contoh kode: ALHIKMAH-2025  -> slug "al-hikmah"
        let school = "SDIT Al-Hikmah";
        let slug = "al-hikmah";
        if (!/alhikmah|al-hikmah|hikmah|2025/i.test(code)) {
            school = "Contoh School";
            slug = "contoh-school";
        }
        setJoined({ slug, school });
    };
    // ===== UI =====
    return (_jsx("div", { className: "min-h-screen grid place-items-center px-6 py-10", style: { backgroundColor: theme.white2 }, children: _jsxs("div", { className: "w-full max-w-3xl rounded-2xl border shadow-sm p-6 md:p-8", style: { backgroundColor: surface.card, borderColor: surface.border }, children: [_jsxs("div", { className: "max-w-xl mx-auto text-center", children: [_jsx("div", { className: "mx-auto mb-4 h-14 w-14 grid place-items-center rounded-2xl", style: { backgroundColor: theme.error2, color: theme.error1 }, children: _jsx(ShieldAlert, { size: 28 }) }), _jsx("h1", { className: "text-2xl font-bold mb-2", style: { color: text.title }, children: "Akses Ditolak" }), _jsxs("p", { className: "text-sm", style: { color: text.body }, children: ["Anda sudah masuk, tetapi tidak memiliki izin untuk mengakses halaman ini.", state.need?.length ? (_jsxs(_Fragment, { children: [" ", "(dibutuhkan: ", _jsx("b", { children: state.need.join(", ") }), ")"] })) : null] }), _jsxs("div", { className: "mt-6 flex gap-2 justify-center", children: [_jsxs("button", { onClick: () => state.from ? nav(state.from, { replace: true }) : nav(-1), className: "inline-flex items-center gap-2 rounded-lg border px-4 py-2", style: {
                                        borderColor: surface.border,
                                        color: text.title,
                                        backgroundColor: surface.cardAlt,
                                    }, children: [_jsx(ArrowLeft, { size: 16 }), " Kembali"] }), _jsxs("button", { onClick: () => nav("/"), className: "inline-flex items-center gap-2 rounded-lg px-4 py-2", style: { backgroundColor: theme.primary, color: "#fff" }, children: [_jsx(Home, { size: 16 }), " Beranda"] })] })] }), _jsxs("div", { className: "my-8 flex items-center gap-3", children: [_jsx("div", { className: "h-px flex-1", style: { backgroundColor: surface.border } }), _jsx("span", { className: "text-xs px-2 py-1 rounded-full border", style: badgeStyle, children: "Belum gabung kemanapun?" }), _jsx("div", { className: "h-px flex-1", style: { backgroundColor: surface.border } })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("button", { onClick: () => setMode("create-masjid"), className: `text-left rounded-2xl border p-4 transition hover:shadow-sm ${mode === "create-masjid" ? "ring-2" : ""}`, style: {
                                borderColor: mode === "create-masjid" ? theme.primary : surface.border,
                                backgroundColor: surface.cardAlt,
                            }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("div", { className: "h-10 w-10 grid place-items-center rounded-xl", style: {
                                                backgroundColor: theme.primary2,
                                                color: theme.primary,
                                            }, children: _jsx(Landmark, { size: 18 }) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", style: { color: text.title }, children: "Saya Pengurus DKM" }), _jsx("div", { className: "text-xs", style: { color: text.body }, children: "Buat profil masjid (dummy)" })] })] }), _jsx("p", { className: "text-xs", style: { color: text.body }, children: "Cocok untuk takmir/pengurus: kelola profil, program, dan operasional." })] }), _jsxs("button", { onClick: () => setMode("join-school"), className: `text-left rounded-2xl border p-4 transition hover:shadow-sm ${mode === "join-school" ? "ring-2" : ""}`, style: {
                                borderColor: mode === "join-school" ? theme.primary : surface.border,
                                backgroundColor: surface.cardAlt,
                            }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("div", { className: "h-10 w-10 grid place-items-center rounded-xl", style: {
                                                backgroundColor: theme.primary2,
                                                color: theme.primary,
                                            }, children: _jsx(UsersRound, { size: 18 }) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", style: { color: text.title }, children: "Saya Guru / Murid" }), _jsx("div", { className: "text-xs", style: { color: text.body }, children: "Masuk dengan kode akses sekolah (dummy)" })] })] }), _jsx("p", { className: "text-xs", style: { color: text.body }, children: "Masukkan kode akses dari sekolah Anda untuk bergabung sebagai guru atau siswa." })] })] }), mode === "create-masjid" && (_jsxs("div", { className: "mt-6 rounded-2xl border p-5", style: {
                        borderColor: surface.border,
                        backgroundColor: surface.card,
                    }, children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Building2, { size: 18 }), _jsx("h3", { className: "font-semibold", style: { color: text.title }, children: "Buat Masjid (Dummy)" })] }), masjidCreatedSlug ? (_jsxs("div", { className: "rounded-xl p-4 border mb-3", style: {
                                backgroundColor: theme.success2,
                                borderColor: theme.success1,
                                color: isDark ? "#bfffe8" : theme.success1,
                            }, children: [_jsxs("div", { className: "flex items-center gap-2 font-medium", children: [_jsx(CheckCircle2, { size: 18 }), "Masjid berhasil dibuat!"] }), _jsxs("div", { className: "text-sm mt-1", children: ["Slug: ", _jsx("code", { children: masjidCreatedSlug })] }), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx("button", { onClick: () => nav(`/${masjidCreatedSlug}/sekolah`), className: "rounded-lg px-4 py-2 text-sm", style: { backgroundColor: theme.primary, color: "#fff" }, children: "Masuk ke Dashboard DKM" }), _jsx("button", { onClick: () => {
                                                setMasjidCreatedSlug(null);
                                                setMode("none");
                                            }, className: "rounded-lg px-4 py-2 text-sm border", style: {
                                                borderColor: surface.border,
                                                backgroundColor: surface.cardAlt,
                                                color: text.title,
                                            }, children: "Selesai" })] })] })) : (_jsxs("form", { onSubmit: createMasjid, className: "grid sm:grid-cols-2 gap-3", children: [_jsx(Field, { label: "Nama Masjid", value: mName, onChange: setMName, placeholder: "cth. Masjid Al-Hikmah", surface: surface, text: text }), _jsx(Field, { label: "Kota/Kabupaten", value: mCity, onChange: setMCity, placeholder: "cth. Bandung", surface: surface, text: text }), _jsx("div", { className: "sm:col-span-2", children: _jsx(Field, { label: "Alamat", value: mAddress, onChange: setMAddress, placeholder: "Jl. Contoh No. 123", surface: surface, text: text }) }), _jsx("div", { className: "sm:col-span-2 flex justify-end", children: _jsx("button", { type: "submit", className: "rounded-lg px-5 py-2.5 text-sm", style: { backgroundColor: theme.primary, color: "#fff" }, children: "Buat Masjid (Dummy)" }) })] }))] })), mode === "join-school" && (_jsxs("div", { className: "mt-6 rounded-2xl border p-5", style: {
                        borderColor: surface.border,
                        backgroundColor: surface.card,
                    }, children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(KeyRound, { size: 18 }), _jsx("h3", { className: "font-semibold", style: { color: text.title }, children: "Masuk ke Sekolah dengan Kode (Dummy)" })] }), joined ? (_jsxs("div", { className: "rounded-xl p-4 border mb-3", style: {
                                backgroundColor: theme.success2,
                                borderColor: theme.success1,
                                color: isDark ? "#bfffe8" : theme.success1,
                            }, children: [_jsxs("div", { className: "flex items-center gap-2 font-medium", children: [_jsx(CheckCircle2, { size: 18 }), "Berhasil bergabung ke ", _jsx("b", { className: "ml-1", children: joined.school }), "."] }), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx("button", { onClick: () => nav(`/${joined.slug}/${joinAs === "teacher" ? "guru" : "murid"}`), className: "rounded-lg px-4 py-2 text-sm", style: { backgroundColor: theme.primary, color: "#fff" }, children: "Masuk Sekarang" }), _jsx("button", { onClick: () => {
                                                setJoined(null);
                                                setMode("none");
                                                setCode("");
                                            }, className: "rounded-lg px-4 py-2 text-sm border", style: {
                                                borderColor: surface.border,
                                                backgroundColor: surface.cardAlt,
                                                color: text.title,
                                            }, children: "Selesai" })] })] })) : (_jsxs("form", { onSubmit: submitJoin, className: "grid sm:grid-cols-2 gap-3", children: [_jsxs("div", { className: "sm:col-span-2", children: [_jsx(Field, { label: "Kode Akses Sekolah", value: code, onChange: setCode, placeholder: "cth. ALHIKMAH-2025", surface: surface, text: text, leadingIcon: _jsx(KeyRound, { size: 16 }) }), _jsxs("p", { className: "text-xs mt-1", style: { color: text.body }, children: ["Contoh kode: ", _jsx("code", { children: "ALHIKMAH-2025" }), " (dummy)."] })] }), _jsxs("div", { children: [_jsx(Label, { text: "Masuk sebagai", textColor: text.title }), _jsxs("select", { value: joinAs, onChange: (e) => setJoinAs(e.target.value), className: "w-full rounded-lg border px-3 py-2.5 outline-none", style: {
                                                borderColor: surface.border,
                                                backgroundColor: surface.cardAlt,
                                                color: text.title,
                                            }, children: [_jsx("option", { value: "teacher", children: "Guru" }), _jsx("option", { value: "student", children: "Murid" })] })] }), _jsx("div", { className: "sm:col-span-2 flex justify-end", children: _jsx("button", { type: "submit", disabled: !code.trim(), className: "rounded-lg px-5 py-2.5 text-sm disabled:opacity-60", style: { backgroundColor: theme.primary, color: "#fff" }, children: "Gabung (Dummy)" }) })] }))] })), _jsx("p", { className: "mt-6 text-center text-xs", style: { color: text.body }, children: "Jika merasa ini keliru, hubungi admin untuk meminta akses." })] }) }));
}
/* ===== sub components ===== */
function Label({ text, textColor }) {
    return (_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: textColor }, children: text }));
}
function Field({ label, value, onChange, placeholder, surface, text, leadingIcon, }) {
    return (_jsxs("div", { children: [_jsx(Label, { text: label, textColor: text.title }), _jsxs("div", { className: "relative", children: [leadingIcon ? (_jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-70", children: leadingIcon })) : null, _jsx("input", { value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: `w-full rounded-lg border px-3 py-2.5 outline-none ${leadingIcon ? "pl-9" : ""}`, style: {
                            borderColor: surface.border,
                            backgroundColor: surface.cardAlt,
                        } })] })] }));
}
