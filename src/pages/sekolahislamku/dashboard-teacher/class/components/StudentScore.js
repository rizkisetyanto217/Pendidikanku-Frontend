import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/student/StudentScore.tsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import InputField from "@/components/common/main/InputField"; // pastikan path benar
export default function StudentScore() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { id: classId, studentId } = useParams();
    const { state } = useLocation();
    const student = state?.student;
    const incomingAssignments = state?.assignments ?? [];
    // dummy fallback kalau assignment tidak dikirim
    const defaultAssignments = useMemo(() => incomingAssignments.length
        ? incomingAssignments
        : [
            { id: "t1", title: "Evaluasi Wudhu" },
            { id: "t2", title: "Hafalan Juz 30 (1–10)" },
            { id: "t3", title: "Tajwid: Mad Thabi'i" },
        ], [incomingAssignments]);
    const [scores, setScores] = useState({});
    const handleChange = (aid, val) => {
        // validasi biar 0–100
        if (val === "") {
            setScores((p) => ({ ...p, [aid]: "" }));
        }
        else {
            const num = Math.max(0, Math.min(100, Number(val)));
            setScores((p) => ({ ...p, [aid]: String(num) }));
        }
    };
    const handleSave = () => {
        const payload = defaultAssignments.map((a) => ({
            assignmentId: a.id,
            score: scores[a.id] === "" || scores[a.id] == null
                ? null
                : Number(scores[a.id]),
        }));
        console.log("Simpan nilai siswa", {
            classId,
            studentId,
            studentName: student?.name,
            payload,
        });
        alert("Nilai siswa disimpan (lihat console).");
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Penilaian Siswa", gregorianDate: new Date().toISOString() }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-6", children: [_jsx("aside", { className: "lg:w-64 mb-6 lg:mb-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold text-lg", children: [_jsx("button", { onClick: () => navigate(-1), className: "inline-flex items-center justify-center rounded-full p-1 hover:opacity-80", title: "Kembali", children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("span", { children: ["Nilai \u2022 ", student?.name ?? `Siswa ${studentId ?? ""}`, " ", student?.className ? (_jsxs(Badge, { palette: palette, variant: "outline", className: "ml-2", children: ["Kelas ", student.className] })) : null] })] }), _jsxs(SectionCard, { palette: palette, className: "p-4", children: [_jsx("div", { className: "text-sm mb-4", style: { color: palette.silver2 }, children: "Isi nilai 0\u2013100 untuk setiap tugas." }), _jsx("div", { className: "grid gap-4", children: defaultAssignments.map((a) => (_jsx("div", { className: "space-y-1", children: _jsx(InputField, { label: a.title, name: `score-${a.id}`, type: "number", value: scores[a.id] ?? "", placeholder: "0-100", onChange: (e) => handleChange(a.id, e.target.value) }) }, a.id))) }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx(Btn, { palette: palette, onClick: handleSave, children: "Simpan Nilai" }) }), !student && (_jsxs("div", { className: "mt-3 text-sm", style: { color: palette.silver2 }, children: ["Tip: buka halaman ini lewat tombol ", _jsx("em", { children: "Nilai" }), " di \u201CDaftar Siswa\u201D agar data siswa & daftar tugas terisi otomatis."] }))] })] })] }) })] }));
}
