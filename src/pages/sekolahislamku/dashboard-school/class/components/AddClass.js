import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { X, Save } from "lucide-react";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
export function generateClassId(code) {
    const slug = code.toLowerCase().replace(/\s+/g, "-");
    return `c-${slug}-${Date.now()}`;
}
function saveNewClassToLocalStorage(row) {
    const key = "sis_extras_classes";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    prev.push(row);
    localStorage.setItem(key, JSON.stringify(prev));
}
export default function AddClass({ open, onClose, palette, onCreated, }) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [grade, setGrade] = useState("1");
    const [homeroom, setHomeroom] = useState("");
    const [studentCount, setStudentCount] = useState("");
    const [schedule, setSchedule] = useState("Pagi");
    const [status, setStatus] = useState("active");
    // Autofill nama dari code/grade jika kosong
    useEffect(() => {
        if (!name && code)
            setName(`Kelas ${code}`);
    }, [code, name]);
    const isValid = useMemo(() => {
        return (code.trim().length > 0 &&
            name.trim().length > 0 &&
            grade.trim().length > 0 &&
            homeroom.trim().length > 0 &&
            typeof studentCount === "number" &&
            studentCount > 0);
    }, [code, name, grade, homeroom, studentCount]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid)
            return;
        const row = {
            id: generateClassId(code),
            code: code.trim(),
            name: name.trim(),
            grade: grade.trim(),
            homeroom: homeroom.trim(),
            studentCount: Number(studentCount),
            schedule,
            status,
        };
        // Persist sementara ke localStorage supaya muncul di daftar
        saveNewClassToLocalStorage(row);
        onCreated?.(row);
        onClose();
        // reset form
        setCode("");
        setName("");
        setGrade("1");
        setHomeroom("");
        setStudentCount("");
        setSchedule("Pagi");
        setStatus("active");
    };
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", "aria-modal": true, role: "dialog", children: [_jsx("div", { className: "absolute inset-0", style: { background: "rgba(0,0,0,0.4)" }, onClick: onClose }), _jsx("div", { className: "relative w-full max-w-xl mx-4", children: _jsx(SectionCard, { palette: palette, children: _jsxs("form", { onSubmit: handleSubmit, className: "p-4 md:p-5 space-y-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-lg font-semibold", children: "Tambah Kelas" }), _jsx("div", { className: "text-xs", style: { color: palette.black2 }, children: "Lengkapi informasi kelas di bawah ini." })] }), _jsx("button", { type: "button", onClick: onClose, className: "p-2 rounded-lg", style: { background: palette.white2, color: palette.silver2 }, "aria-label": "Tutup", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Kode" }), _jsx("input", { value: code, onChange: (e) => setCode(e.target.value), placeholder: "Mis. 3A", className: "w-full rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Nama Kelas" }), _jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Mis. Kelas 3A", className: "w-full rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Tingkat" }), _jsx("select", { value: grade, onChange: (e) => setGrade(e.target.value), className: "w-full rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, required: true, children: Array.from({ length: 12 }).map((_, i) => {
                                                    const g = String(i + 1);
                                                    return (_jsx("option", { value: g, children: g }, g));
                                                }) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Wali Kelas" }), _jsx("input", { value: homeroom, onChange: (e) => setHomeroom(e.target.value), placeholder: "Mis. Ust. Ahmad", className: "w-full rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Jumlah Siswa" }), _jsx("input", { inputMode: "numeric", pattern: "[0-9]*", value: String(studentCount), onChange: (e) => {
                                                    const v = e.target.value;
                                                    if (v === "")
                                                        return setStudentCount("");
                                                    const n = Number(v);
                                                    if (!Number.isNaN(n))
                                                        setStudentCount(n);
                                                }, placeholder: "Mis. 30", className: "w-full rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Shift" }), _jsxs("select", { value: schedule, onChange: (e) => setSchedule(e.target.value), className: "w-full rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, children: [_jsx("option", { value: "Pagi", children: "Pagi" }), _jsx("option", { value: "Sore", children: "Sore" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Status" }), _jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "w-full rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, children: [_jsx("option", { value: "active", children: "Aktif" }), _jsx("option", { value: "inactive", children: "Nonaktif" })] })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [_jsx(Btn, { type: "button", palette: palette, variant: "quaternary", onClick: onClose, children: "Batalkan" }), _jsxs(Btn, { palette: palette, disabled: !isValid, children: [_jsx(Save, { size: 16, className: "mr-2" }), " Simpan"] })] })] }) }) })] }));
}
