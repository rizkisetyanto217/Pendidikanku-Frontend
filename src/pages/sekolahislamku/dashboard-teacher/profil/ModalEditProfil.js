import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/teacher/ModalEditProfilLengkap.tsx
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const ModalEditProfilLengkap = ({ open, onClose, initial, onSubmit, palette, teacherId, }) => {
    const [form, setForm] = useState({
        fullname: initial.fullname || "",
        phone: initial.phone || "",
        email: initial.email || "",
        city: initial.city || "",
        location: initial.location || "",
        birthPlace: initial.birthPlace || "",
        birthDate: initial.birthDate || "",
        company: initial.company || "",
        position: initial.position || "",
        education: initial.education || "",
        experience: initial.experience || 0,
        gender: initial.gender || "male",
        whatsappUrl: initial.whatsappUrl || "",
        instagramUrl: initial.instagramUrl || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    if (!open)
        return null;
    const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);
            // Validasi input
            if (!form.fullname.trim()) {
                setError("Nama lengkap tidak boleh kosong");
                return;
            }
            // Validasi email format (optional)
            if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                setError("Format email tidak valid");
                return;
            }
            // Validasi URL WhatsApp (optional)
            if (form.whatsappUrl && !form.whatsappUrl.startsWith("https://wa.me/")) {
                setError("URL WhatsApp harus dimulai dengan https://wa.me/");
                return;
            }
            // Validasi URL Instagram (optional)
            if (form.instagramUrl &&
                !form.instagramUrl.startsWith("https://instagram.com/")) {
                setError("URL Instagram harus dimulai dengan https://instagram.com/");
                return;
            }
            // Bentuk payload sesuai struktur backend
            const payload = {
                user_teacher_name: form.fullname,
                user_teacher_phone: form.phone || null,
                user_teacher_email: form.email || null,
                user_teacher_city: form.city || null,
                user_teacher_location: form.location || null,
                user_teacher_birth_place: form.birthPlace || null,
                user_teacher_birth_date: form.birthDate || null,
                user_teacher_company: form.company || null,
                user_teacher_field: form.position || null,
                user_teacher_education: form.education || null,
                user_teacher_experience_years: form.experience,
                user_teacher_gender: form.gender,
                user_teacher_whatsapp_url: form.whatsappUrl || null,
                user_teacher_instagram_url: form.instagramUrl || null,
            };
            // Panggil endpoint PATCH
            await api.patch(`/api/u/user-teachers/update`, {
                ...(teacherId ? { user_teacher_id: teacherId } : {}),
                ...payload,
            });
            console.log("✅ Profil lengkap berhasil diperbarui");
            // Callback untuk refresh data parent
            onSubmit();
            onClose();
        }
        catch (err) {
            console.error("❌ Gagal update profil lengkap:", err);
            setError(err?.response?.data?.message || "Gagal memperbarui profil lengkap.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 grid place-items-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/30", onClick: onClose }), _jsxs("div", { className: "relative w-full max-w-2xl rounded-xl border p-5 bg-white max-h-[90vh] overflow-y-auto", style: { borderColor: palette.silver1, color: palette.black1 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h2", { className: "font-semibold text-base", children: "Edit Profil Lengkap" }), _jsx("button", { onClick: onClose, disabled: loading, children: _jsx(X, { size: 18 }) })] }), error && (_jsx("div", { className: "text-red-600 text-sm mb-3 border border-red-200 rounded-md p-2 bg-red-50", children: error })), _jsxs("div", { className: "space-y-4 text-sm", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Informasi Personal" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("input", { placeholder: "Nama Lengkap *", value: form.fullname, onChange: (e) => set("fullname", e.target.value), className: "border rounded px-3 py-2", style: { borderColor: palette.silver1 }, disabled: loading }), _jsx("input", { placeholder: "Telepon (08xxx)", value: form.phone, onChange: (e) => set("phone", e.target.value), className: "border rounded px-3 py-2", style: { borderColor: palette.silver1 }, disabled: loading }), _jsx("input", { placeholder: "Email (nama@email.com)", type: "email", value: form.email, onChange: (e) => set("email", e.target.value), className: "border rounded px-3 py-2", style: { borderColor: palette.silver1 }, disabled: loading }), _jsxs("select", { value: form.gender, onChange: (e) => set("gender", e.target.value), className: "border rounded px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, disabled: loading, children: [_jsx("option", { value: "male", children: "Laki-laki" }), _jsx("option", { value: "female", children: "Perempuan" })] }), _jsx("input", { placeholder: "Kota (Bandung)", value: form.city, onChange: (e) => set("city", e.target.value), className: "border rounded px-3 py-2", style: { borderColor: palette.silver1 }, disabled: loading }), _jsx("input", { placeholder: "Provinsi/Lokasi (Jawa Barat)", value: form.location, onChange: (e) => set("location", e.target.value), className: "border rounded px-3 py-2", style: { borderColor: palette.silver1 }, disabled: loading }), _jsx("input", { placeholder: "Tempat Lahir (Jakarta)", value: form.birthPlace, onChange: (e) => set("birthPlace", e.target.value), className: "border rounded px-3 py-2", style: { borderColor: palette.silver1 }, disabled: loading }), _jsx("input", { type: "date", value: form.birthDate, onChange: (e) => set("birthDate", e.target.value), className: "border rounded px-3 py-2", style: { borderColor: palette.silver1 }, disabled: loading })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Informasi Profesional" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("input", { placeholder: "Instansi (Pesantren X)", value: form.company, onChange: (e) => set("company", e.target.value), className: "border rounded px-3 py-2", style: { borderColor: palette.silver1 }, disabled: loading }), _jsx("input", { placeholder: "Bidang/Posisi (Fiqih)", value: form.position, onChange: (e) => set("position", e.target.value), className: "border rounded px-3 py-2", style: { borderColor: palette.silver1 }, disabled: loading }), _jsx("input", { placeholder: "Pendidikan (S1 Syariah)", value: form.education, onChange: (e) => set("education", e.target.value), className: "border rounded px-3 py-2 col-span-2", style: { borderColor: palette.silver1 }, disabled: loading }), _jsx("input", { type: "number", placeholder: "Pengalaman (tahun)", value: form.experience, onChange: (e) => set("experience", Number(e.target.value)), className: "border rounded px-3 py-2", style: { borderColor: palette.silver1 }, disabled: loading, min: "0" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Informasi Kontak & Sosial Media" }), _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsxs("div", { children: [_jsx("input", { placeholder: "URL WhatsApp (https://wa.me/6281234567890)", value: form.whatsappUrl, onChange: (e) => set("whatsappUrl", e.target.value), className: "border rounded px-3 py-2 w-full", style: { borderColor: palette.silver1 }, disabled: loading }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Contoh: https://wa.me/6281234567890" })] }), _jsxs("div", { children: [_jsx("input", { placeholder: "URL Instagram (https://instagram.com/username)", value: form.instagramUrl, onChange: (e) => set("instagramUrl", e.target.value), className: "border rounded px-3 py-2 w-full", style: { borderColor: palette.silver1 }, disabled: loading }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Contoh: https://instagram.com/ust_zidan" })] })] })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, disabled: loading, children: "Batal" }), _jsx(Btn, { palette: palette, onClick: handleSave, disabled: loading, children: loading ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Loader2, { size: 16, className: "animate-spin" }), " Menyimpan..."] })) : ("Simpan") })] })] })] }));
};
export default ModalEditProfilLengkap;
