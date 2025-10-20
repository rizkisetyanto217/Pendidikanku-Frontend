import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/academic/AttendanceDetail.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// Theme & utils
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
// UI
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
// Icons
import { X, Save, ArrowLeft } from "lucide-react";
/* ========== Dummy API ========== */
let dummyData = {
    user_attendance_masjid_id: "747d6c09-1370-46c2-8268-6b7345a2d325",
    user_attendance_session_id: "0f4b7f8a-0b21-4f36-9d0f-8a7d6a4c1c9e",
    user_attendance_masjid_student_id: "a3d9f6b2-4d2b-4a1f-9d2e-2d7c0f7e1a11",
    user_attendance_status: "present",
    user_attendance_type_id: "5a2f3b74-0e5a-4c1a-9f1c-0c9f7a3b2d10",
    user_attendance_desc: "Menyetor hafalan Al-Mulk 1-10",
    user_attendance_score: 85.5,
    user_attendance_is_passed: true,
    user_attendance_user_note: "Alhamdulillah lancar",
    user_attendance_teacher_note: "Tajwid sudah baik, perbaiki mad wajib",
};
const fakeApi = {
    async get() {
        await new Promise((r) => setTimeout(r, 400));
        return { ...dummyData };
    },
    async save(payload) {
        await new Promise((r) => setTimeout(r, 600));
        dummyData = { ...payload };
        return { ...dummyData };
    },
};
/* ========== Page ========== */
const AttendanceDetailPage = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const qc = useQueryClient();
    const q = useQuery({
        queryKey: ["attendance-detail"],
        queryFn: () => fakeApi.get(),
    });
    const saveMut = useMutation({
        mutationFn: (payload) => fakeApi.save(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["attendance-detail"] });
            alert("Data berhasil disimpan ✅");
        },
    });
    const [form, setForm] = useState(null);
    const data = form ?? q.data;
    const set = (k, v) => setForm((s) => ({ ...(s || q.data), [k]: v }));
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Kehadiran Santri", gregorianDate: new Date().toISOString(), hijriDate: new Date().toLocaleDateString("id-ID-u-ca-islamic-umalqura"), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: "gap-1", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Pengaturan" })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 space-y-4", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsx("div", { className: "text-lg font-semibold", children: "Form Kehadiran" }) }), !data ? (_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Memuat data\u2026" })) : (_jsxs(_Fragment, { children: [_jsx(SelectField, { label: "Status", value: data.user_attendance_status, options: [
                                                            { value: "present", label: "Hadir" },
                                                            { value: "absent", label: "Absen" },
                                                            { value: "excused", label: "Izin" },
                                                            { value: "late", label: "Terlambat" },
                                                        ], onChange: (v) => set("user_attendance_status", v) }), _jsx(InputField, { label: "Deskripsi", value: data.user_attendance_desc, onChange: (v) => set("user_attendance_desc", v) }), _jsx(InputField, { label: "Nilai", type: "number", value: String(data.user_attendance_score), onChange: (v) => set("user_attendance_score", parseFloat(v)) }), _jsx(ToggleField, { label: "Lulus", value: data.user_attendance_is_passed, onChange: (v) => set("user_attendance_is_passed", v) }), _jsx(InputField, { label: "Catatan Santri", value: data.user_attendance_user_note || "", onChange: (v) => set("user_attendance_user_note", v) }), _jsx(InputField, { label: "Catatan Ustadz", value: data.user_attendance_teacher_note || "", onChange: (v) => set("user_attendance_teacher_note", v) }), _jsxs("div", { className: "flex justify-end gap-2 pt-4", children: [_jsxs(Btn, { palette: palette, variant: "ghost", onClick: () => setForm(null), children: [_jsx(X, { size: 16 }), " Batal"] }), _jsxs(Btn, { palette: palette, onClick: () => data && saveMut.mutate(data), className: "gap-1", children: [_jsx(Save, { size: 16 }), " Simpan"] })] })] }))] }) })] })] }) })] }));
};
export default AttendanceDetailPage;
/* ========== Small helpers ========== */
function InputField({ label, value, onChange, type = "text", }) {
    return (_jsxs("div", { children: [_jsx("div", { className: "text-sm mb-1 text-gray-500", children: label }), _jsx("input", { type: type, value: value, onChange: (e) => onChange(e.target.value), className: "w-full h-10 rounded-lg border px-3 bg-transparent text-sm" })] }));
}
function ToggleField({ label, value, onChange, }) {
    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm", children: label }), _jsx("input", { type: "checkbox", checked: value, onChange: (e) => onChange(e.target.checked) })] }));
}
function SelectField({ label, value, options, onChange, }) {
    return (_jsxs("div", { children: [_jsx("div", { className: "text-sm mb-1 text-gray-500", children: label }), _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), className: "w-full h-10 rounded-lg border px-3 bg-transparent text-sm", children: options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] }));
}
