import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/components/ModalGrading.tsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
export default function ModalGrading({ open, onClose, palette, student, assignmentTitle, assignmentClassName, // ⬅️ NEW
onSubmit, }) {
    const [score, setScore] = useState("");
    useEffect(() => {
        setScore(student?.score ?? "");
    }, [student]);
    if (!open)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (score === "")
            return;
        onSubmit({ id: student?.id ?? "new", score: Number(score) });
        onClose();
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center px-3", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose }), _jsxs("div", { className: "relative w-full max-w-md rounded-xl shadow-lg p-6", style: { background: palette.white1, color: palette.black1 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: student ? `Nilai ${student.name}` : "Buat Penilaian" }), _jsx("button", { onClick: onClose, children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "mb-4 space-y-1 text-sm", children: [_jsxs("p", { children: [_jsx("span", { style: { color: palette.silver2 }, children: "Siswa: " }), _jsx("span", { className: "font-medium", children: student?.name ?? "Belum dipilih" })] }), assignmentClassName && (_jsxs("p", { children: [_jsx("span", { style: { color: palette.silver2 }, children: "Kelas: " }), _jsx("span", { className: "font-medium", children: assignmentClassName })] })), assignmentTitle && (_jsxs("p", { children: [_jsx("span", { style: { color: palette.silver2 }, children: "Tugas: " }), _jsx("span", { className: "font-medium", children: assignmentTitle })] }))] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", style: { color: palette.silver2 }, children: "Nilai (0\u2013100)" }), _jsx("input", { type: "number", min: 0, max: 100, value: score, onChange: (e) => setScore(e.target.value ? Number(e.target.value) : ""), className: "w-full rounded-lg border px-3 py-2 outline-none", style: {
                                            borderColor: palette.silver1,
                                            background: palette.white2,
                                            color: palette.black1,
                                        } })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Btn, { type: "button", palette: palette, variant: "outline", onClick: onClose, children: "Batal" }), _jsx(Btn, { type: "submit", palette: palette, children: "Simpan" })] })] })] })] }));
}
