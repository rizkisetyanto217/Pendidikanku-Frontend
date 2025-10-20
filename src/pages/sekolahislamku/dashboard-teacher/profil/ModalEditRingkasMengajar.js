import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const ModalEditInformasiMengajar = ({ open, onClose, initial, onSubmit, palette, teacherId, }) => {
    const [form, setForm] = useState(initial);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    if (!open)
        return null;
    const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);
            // bentuk payload sesuai struktur backend
            const payload = {
                user_teacher_activity: form.activity,
                user_teacher_rating: form.rating,
                user_teacher_total_students: form.totalStudents,
                user_teacher_experience_years: form.experience,
                user_teacher_is_active: form.isActive,
            };
            // panggil endpoint PATCH
            await api.patch(`/api/u/user-teachers/update`, {
                ...(teacherId ? { user_teacher_id: teacherId } : {}),
                ...payload,
            });
            // update parent data
            onSubmit(form);
            onClose();
        }
        catch (err) {
            console.error("❌ Gagal update data guru:", err);
            setError(err?.response?.data?.message || "Gagal memperbarui data guru.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 grid place-items-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/30", onClick: onClose }), _jsxs("div", { className: "relative w-full max-w-lg rounded-xl border p-5 bg-white max-h-[90vh] overflow-y-auto", style: { borderColor: palette.silver1, color: palette.black1 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h2", { className: "font-semibold text-base", children: "Edit Informasi Mengajar" }), _jsx("button", { onClick: onClose, children: _jsx(X, { size: 18 }) })] }), error && (_jsx("div", { className: "text-red-600 text-sm mb-3 border border-red-200 rounded-md p-2 bg-red-50", children: error })), _jsxs("div", { className: "space-y-4 text-sm", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium", children: "Kegiatan Mengajar" }), _jsx("textarea", { value: form.activity, onChange: (e) => set("activity", e.target.value), rows: 3, className: "w-full border rounded-lg px-3 py-2", style: { borderColor: palette.silver1 } })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium", children: "Rating (0 - 5)" }), _jsx("input", { type: "number", step: "0.1", min: 0, max: 5, value: form.rating, onChange: (e) => set("rating", Number(e.target.value)), className: "w-full border rounded-lg px-3 py-2", style: { borderColor: palette.silver1 } })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium", children: "Total Siswa" }), _jsx("input", { type: "number", value: form.totalStudents, onChange: (e) => set("totalStudents", Number(e.target.value)), className: "w-full border rounded-lg px-3 py-2", style: { borderColor: palette.silver1 } })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium", children: "Pengalaman (tahun)" }), _jsx("input", { type: "number", value: form.experience, onChange: (e) => set("experience", Number(e.target.value)), className: "w-full border rounded-lg px-3 py-2", style: { borderColor: palette.silver1 } })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium", children: "Status" }), _jsxs("select", { value: form.isActive ? "true" : "false", onChange: (e) => set("isActive", e.target.value === "true"), className: "w-full border rounded-lg px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, children: [_jsx("option", { value: "true", children: "Aktif" }), _jsx("option", { value: "false", children: "Nonaktif" })] })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, disabled: loading, children: "Batal" }), _jsx(Btn, { palette: palette, onClick: handleSave, disabled: loading, children: loading ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Loader2, { size: 16, className: "animate-spin" }), " Menyimpan..."] })) : ("Simpan") })] })] })] }));
};
export default ModalEditInformasiMengajar;
