import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, ArrowRight, Building2, GraduationCap, Users2, CheckCircle2, } from "lucide-react";
import AuthLayout from "@/layout/AuthLayout";
import api from "@/lib/axios";
import { setTokens } from "@/lib/axios";
import LegalModal from "@/pages/dashboard/auth/components/LegalPrivacyModal";
/* =======================
   Modal Pilih Masjid & Role
======================= */
function ModalSelectRoleMasjid({ open, onClose, onSelect, }) {
    const [masjids, setMasjids] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    React.useEffect(() => {
        if (!open)
            return;
        setLoading(true);
        api
            .get("/auth/me/simple-context")
            .then((res) => {
            const memberships = res.data?.data?.memberships ?? [];
            const mapped = memberships.map((m) => ({
                masjid_id: m.masjid_id,
                masjid_name: m.masjid_name,
                masjid_icon_url: m.masjid_icon_url,
                roles: m.roles ?? [],
            }));
            setMasjids(mapped);
        })
            .finally(() => setLoading(false));
    }, [open]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", children: _jsxs("div", { className: "bg-white rounded-2xl w-full max-w-md p-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-3", children: "Pilih Masjid & Role" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Pilih masjid dan peran yang ingin kamu gunakan." }), loading ? (_jsx("div", { className: "text-center text-gray-500 py-10", children: "Memuat..." })) : (_jsx("div", { className: "max-h-80 overflow-y-auto space-y-3", children: masjids.map((m) => (_jsxs("div", { className: `border rounded-xl p-3 ${selected?.masjid_id === m.masjid_id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200"}`, children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("img", { src: m.masjid_icon_url || "/image/Gambar-Masjid.jpeg", alt: m.masjid_name, className: "w-10 h-10 rounded-lg object-cover border" }), _jsx("span", { className: "font-semibold text-gray-800", children: m.masjid_name })] }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: m.roles.map((r) => (_jsx("button", { onClick: () => setSelected({ masjid_id: m.masjid_id, role: r }), className: `px-3 py-1 text-xs rounded-lg border ${selected?.masjid_id === m.masjid_id &&
                                        selected?.role === r
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-gray-300 text-gray-700"}`, children: r.toUpperCase() }, r))) })] }, m.masjid_id))) })), _jsxs("div", { className: "mt-5 flex justify-between", children: [_jsx("button", { onClick: onClose, className: "text-sm text-gray-500", children: "Batal" }), _jsxs("button", { disabled: !selected, onClick: () => selected && onSelect(selected.masjid_id, selected.role), className: "bg-blue-600 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50", children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), " Pilih"] })] })] }) }));
}
/* =======================
   Modal Pilih Tujuan
======================= */
function ModalPilihTujuan({ open, onClose, onPilih, }) {
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-2xl p-6 w-full max-w-md text-center space-y-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Apa peran Anda?" }), _jsx("p", { className: "text-sm text-gray-500", children: "Pilih tujuan Anda bergabung di SekolahIslamKu:" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: () => onPilih("dkm"), className: "w-full py-3 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50", children: [_jsx(Building2, { className: "w-4 h-4" }), " Jadi DKM / Admin Masjid"] }), _jsxs("button", { onClick: () => onPilih("teacher"), className: "w-full py-3 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50", children: [_jsx(Users2, { className: "w-4 h-4" }), " Gabung Sebagai Guru"] }), _jsxs("button", { onClick: () => onPilih("student"), className: "w-full py-3 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50", children: [_jsx(GraduationCap, { className: "w-4 h-4" }), " Gabung Sebagai Murid"] })] }), _jsx("button", { onClick: onClose, className: "text-sm text-gray-500 hover:underline mt-4", children: "Nanti Saja" })] }) }));
}
/* =======================
   Modal Gabung / Buat Masjid
======================= */
function ModalJoinAtauBuat({ open, mode, onClose, onCreateMasjid, onJoinSekolah, }) {
    const [masjidName, setMasjidName] = useState("");
    const [iconFile, setIconFile] = useState(null);
    const [accessCode, setAccessCode] = useState("");
    const [loading, setLoading] = useState(false);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-2xl p-6 w-full max-w-md space-y-4", children: [mode === "dkm" ? (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-lg font-semibold", children: "Buat Masjid Baru" }), _jsx("p", { className: "text-sm text-gray-500", children: "Sebagai DKM / Admin, kamu akan membuat masjid baru di sistem." }), _jsx("input", { type: "text", placeholder: "Nama Masjid", value: masjidName, onChange: (e) => setMasjidName(e.target.value), className: "w-full border rounded-lg px-3 py-2" }), _jsx("input", { type: "file", accept: "image/*", onChange: (e) => setIconFile(e.target.files?.[0] || null), className: "w-full text-sm" }), _jsx("button", { disabled: !masjidName.trim() || loading, onClick: () => {
                                setLoading(true);
                                onCreateMasjid({
                                    name: masjidName,
                                    file: iconFile || undefined,
                                });
                            }, className: "w-full py-2 bg-green-600 text-white rounded-lg disabled:opacity-50", children: loading ? "Membuat..." : "Buat Masjid" })] })) : (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-lg font-semibold", children: "Gabung ke Sekolah" }), _jsx("p", { className: "text-sm text-gray-500", children: "Masukkan kode akses dari sekolah Anda." }), _jsx("input", { type: "text", placeholder: "Kode Akses Sekolah", value: accessCode, onChange: (e) => setAccessCode(e.target.value), className: "w-full border rounded-lg px-3 py-2" }), _jsx("button", { disabled: !accessCode.trim() || loading, onClick: () => {
                                setLoading(true);
                                onJoinSekolah(accessCode, mode);
                            }, className: "w-full py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50", children: loading ? "Memproses..." : "Gabung Sekarang" })] })), _jsx("button", { onClick: onClose, className: "text-sm text-gray-500 hover:underline", children: "Batal" })] }) }));
}
/* =======================
   MAIN COMPONENT
======================= */
export default function Login() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [openSelectMasjid, setOpenSelectMasjid] = useState(false);
    const [openPilihTujuan, setOpenPilihTujuan] = useState(false);
    const [openJoinAtauBuat, setOpenJoinAtauBuat] = useState(false);
    const [selectedTujuan, setSelectedTujuan] = useState(null);
    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await api.post("/auth/login", { identifier, password });
            const { access_token, refresh_token } = res.data.data;
            // ✅ Simpan token ke cookie
            setTokens(access_token, refresh_token);
            // ✅ Ambil context user
            const ctx = await api.get("/auth/me/simple-context");
            const memberships = ctx.data?.data?.memberships ?? [];
            if (memberships.length === 0)
                return setOpenPilihTujuan(true);
            if (memberships.length === 1) {
                const m = memberships[0];
                const role = m.roles?.[0] ?? "user";
                handleSelectMasjidRole(m.masjid_id, role);
                return;
            }
            setOpenSelectMasjid(true);
        }
        catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Login gagal.");
        }
        finally {
            setLoading(false);
        }
    }
    function handlePilihTujuan(tujuan) {
        setSelectedTujuan(tujuan);
        setOpenPilihTujuan(false);
        setOpenJoinAtauBuat(true);
    }
    async function handleCreateMasjid(data) {
        try {
            const fd = new FormData();
            fd.append("masjid_name", data.name);
            if (data.file)
                fd.append("icon", data.file);
            const res = await api.post("/u/masjids/user", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const item = res.data?.data?.item;
            if (!item)
                throw new Error("Masjid gagal dibuat.");
            const masjidId = item.masjid_id;
            const name = item.masjid_name || data.name;
            const iconUrl = item.masjid_icon_url || "/image/Gambar-Masjid.jpeg";
            const activeMasjid = {
                masjid_id: masjidId,
                masjid_name: name,
                masjid_icon_url: iconUrl,
            };
            localStorage.setItem("active_masjid", JSON.stringify(activeMasjid));
            localStorage.setItem("active_role", "dkm");
            setOpenJoinAtauBuat(false);
            navigate(`/${masjidId}/sekolah`, { replace: true });
        }
        catch (err) {
            alert(err?.response?.data?.message || "Gagal membuat masjid.");
        }
    }
    async function handleJoinSekolah(code, role) {
        try {
            await api.post("/u/user-class-sections/join", { student_code: code });
            const ctx = await api.get("/auth/me/simple-context");
            const memberships = ctx.data?.data?.memberships ?? [];
            if (memberships.length > 0) {
                const m = memberships[0];
                const masjidId = m.masjid_id;
                const masjidData = {
                    masjid_id: masjidId,
                    masjid_name: m.masjid_name || "Masjid",
                    masjid_icon_url: m.masjid_icon_url || "/image/Gambar-Masjid.jpeg",
                };
                localStorage.setItem("active_masjid", JSON.stringify(masjidData));
                localStorage.setItem("active_role", role);
                const path = role === "teacher" ? "guru" : "murid";
                navigate(`/${masjidId}/${path}`, { replace: true });
            }
        }
        catch (err) {
            const msg = err?.response?.data?.message || "Gagal bergabung ke sekolah.";
            alert(msg);
        }
    }
    function handleSelectMasjidRole(masjidId, role) {
        localStorage.setItem("active_role", role);
        localStorage.setItem("active_masjid", JSON.stringify({ masjid_id: masjidId }));
        const path = role === "teacher" ? "guru" : role === "student" ? "murid" : "sekolah";
        navigate(`/${masjidId}/${path}`, { replace: true });
    }
    return (_jsxs(AuthLayout, { mode: "login", fullWidth: true, contentClassName: "max-w-xl mx-auto", children: [_jsxs("div", { className: "bg-white rounded-2xl p-6 md:p-8 border shadow-sm", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Masuk ke Akun Anda" }), error && (_jsx("div", { className: "mb-4 text-red-600 text-sm border border-red-300 rounded-lg p-2", children: error })), _jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium", children: "Email / Username" }), _jsx("input", { value: identifier, onChange: (e) => setIdentifier(e.target.value), className: "w-full border rounded-lg px-3 py-2", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full border rounded-lg px-3 py-2 pr-10", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-2 top-2 text-gray-500", children: showPassword ? _jsx(EyeOffIcon, {}) : _jsx(EyeIcon, {}) })] })] }), _jsx("button", { disabled: loading, className: "w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50", children: loading ? ("Memproses...") : (_jsxs(_Fragment, { children: ["Masuk ", _jsx(ArrowRight, { className: "w-4 h-4" })] })) })] })] }), _jsx(ModalSelectRoleMasjid, { open: openSelectMasjid, onClose: () => setOpenSelectMasjid(false), onSelect: handleSelectMasjidRole }), _jsx(ModalPilihTujuan, { open: openPilihTujuan, onClose: () => setOpenPilihTujuan(false), onPilih: handlePilihTujuan }), _jsx(ModalJoinAtauBuat, { open: openJoinAtauBuat, mode: selectedTujuan || "dkm", onClose: () => setOpenJoinAtauBuat(false), onCreateMasjid: handleCreateMasjid, onJoinSekolah: handleJoinSekolah }), _jsx(LegalModal, { open: false, initialTab: "tos", onClose: () => { } })] }));
}
