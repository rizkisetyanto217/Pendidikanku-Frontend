import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/teacher/ModalEditRingkasan.tsx
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const ModalEditRingkasan = ({ open, onClose, initial, onSubmit, palette, teacherId, }) => {
    const [form, setForm] = useState(initial);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    if (!open)
        return null;
    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };
    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);
            // Validasi input
            if (!form.greeting.trim()) {
                setError("Salam pembuka tidak boleh kosong");
                return;
            }
            if (!form.shortBio.trim()) {
                setError("Bio singkat tidak boleh kosong");
                return;
            }
            if (form.subjects.length === 0 || !form.subjects[0]) {
                setError("Mata pelajaran tidak boleh kosong");
                return;
            }
            // Bentuk payload sesuai struktur backend
            const payload = {
                user_teacher_greeting: form.greeting,
                user_teacher_short_bio: form.shortBio,
                user_teacher_specialties: form.subjects.filter((s) => s.trim() !== ""),
            };
            // Panggil endpoint PATCH untuk update
            await api.patch(`/api/u/user-teachers/update`, {
                ...(teacherId ? { user_teacher_id: teacherId } : {}),
                ...payload,
            });
            console.log("✅ Data ringkasan berhasil diperbarui");
            // Callback untuk refresh data parent
            onSubmit();
            onClose();
        }
        catch (err) {
            console.error("❌ Gagal update data ringkasan:", err);
            setError(err?.response?.data?.message || "Gagal memperbarui data ringkasan.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 grid place-items-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/30", onClick: onClose }), _jsxs("div", { className: "relative w-full max-w-lg rounded-xl border p-5 bg-white max-h-[90vh] overflow-y-auto", style: { borderColor: palette.silver1, color: palette.black1 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h2", { className: "font-semibold text-base", children: "Edit Ringkasan" }), _jsx("button", { onClick: onClose, disabled: loading, children: _jsx(X, { size: 18 }) })] }), error && (_jsx("div", { className: "text-red-600 text-sm mb-3 border border-red-200 rounded-md p-2 bg-red-50", children: error })), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { children: [_jsxs("label", { className: "block mb-1 font-medium", children: ["Salam Pembuka ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("textarea", { value: form.greeting, onChange: (e) => handleChange("greeting", e.target.value), className: "w-full border rounded-lg px-3 py-2 text-sm", rows: 3, style: { borderColor: palette.silver1 }, placeholder: "Contoh: Assalamu'alaikum warahmatullahi wabarakatuh", disabled: loading })] }), _jsxs("div", { children: [_jsxs("label", { className: "block mb-1 font-medium", children: ["Bio Singkat ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("textarea", { value: form.shortBio, onChange: (e) => handleChange("shortBio", e.target.value), className: "w-full border rounded-lg px-3 py-2 text-sm", rows: 3, style: { borderColor: palette.silver1 }, placeholder: "Contoh: Pengajar fiqih dasar dengan pengalaman 5 tahun", disabled: loading })] }), _jsxs("div", { children: [_jsxs("label", { className: "block mb-1 font-medium", children: ["Mata Pelajaran ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", placeholder: "Pisahkan dengan koma, misal: Fiqih, Adab, Tauhid", value: form.subjects.join(", "), onChange: (e) => handleChange("subjects", e.target.value.split(",").map((s) => s.trim())), className: "w-full border rounded-lg px-3 py-2 text-sm", style: { borderColor: palette.silver1 }, disabled: loading }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Masukkan mata pelajaran yang Anda ajarkan, pisahkan dengan koma" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, disabled: loading, children: "Batal" }), _jsx(Btn, { palette: palette, onClick: handleSave, disabled: loading, children: loading ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Loader2, { size: 16, className: "animate-spin" }), " Menyimpan..."] })) : ("Simpan") })] })] })] }));
};
export default ModalEditRingkasan;
