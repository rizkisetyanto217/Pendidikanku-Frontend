import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { Btn, SectionCard, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { ArrowLeft, Plus, Pencil, Trash, CheckCircle, XCircle, } from "lucide-react";
/* ===== Helpers ===== */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "";
const DUMMY = {
    "qz-1": {
        id: "qz-1",
        title: "Quiz Aljabar Dasar",
        published: true,
        createdAt: new Date().toISOString(),
        questions: [
            {
                id: "q1",
                text: "Hasil dari 2x + 3 = 7 adalah?",
                options: ["x = 1", "x = 2", "x = 3", "x = 4"],
                answer: 1,
            },
        ],
    },
    "qz-2": {
        id: "qz-2",
        title: "Kuis Tajwid Dasar",
        published: false,
        createdAt: new Date().toISOString(),
        questions: [],
    },
};
/* ===== Page ===== */
const DetailClassQuiz = () => {
    const { id } = useParams(); // :id dari route /:slug/guru/quizClass/:id
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const [quiz, setQuiz] = useState(() => DUMMY[id ?? "qz-1"] ?? DUMMY["qz-1"]);
    const [editingQid, setEditingQid] = useState(null);
    const [form, setForm] = useState({
        text: "",
        options: ["", "", "", ""],
        answer: 0,
    });
    const resetForm = () => setForm({ text: "", options: ["", "", "", ""], answer: 0 });
    const headerDateISO = useMemo(() => new Date().toISOString(), []);
    /* ===== Actions ===== */
    const togglePublish = () => setQuiz((q) => ({ ...q, published: !q.published }));
    const addQuestion = () => {
        setQuiz((q) => ({
            ...q,
            questions: [
                ...q.questions,
                {
                    id: "q" + (q.questions.length + 1),
                    text: form.text || "Soal baru...",
                    options: form.options.map((o, i) => o || `Pilihan ${String.fromCharCode(65 + i)}`),
                    answer: Number.isInteger(form.answer) ? form.answer : 0,
                },
            ],
        }));
        resetForm();
    };
    const startEdit = (qid) => {
        const target = quiz.questions.find((x) => x.id === qid);
        if (!target)
            return;
        setEditingQid(qid);
        setForm({
            text: target.text,
            options: [...target.options],
            answer: target.answer,
        });
    };
    const saveEdit = () => {
        if (!editingQid)
            return;
        setQuiz((q) => ({
            ...q,
            questions: q.questions.map((it) => it.id === editingQid
                ? {
                    ...it,
                    text: form.text || "Soal (tanpa judul)",
                    options: form.options.map((o, i) => o || `Pilihan ${String.fromCharCode(65 + i)}`),
                    answer: form.answer,
                }
                : it),
        }));
        setEditingQid(null);
        resetForm();
    };
    const deleteQuestion = (qid) => setQuiz((q) => ({
        ...q,
        questions: q.questions.filter((x) => x.id !== qid),
    }));
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Quiz", gregorianDate: headerDateISO, showBack: true }), _jsx("main", { className: "px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-6", children: [_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 flex items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "font-semibold text-lg", children: quiz.title }), _jsxs("div", { className: "ml-auto flex items-center gap-2", children: [quiz.published ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 18, style: { color: "#16a34a" } }), _jsx("span", { className: "text-sm", children: "Terpublikasi" })] })) : (_jsxs(_Fragment, { children: [_jsx(XCircle, { size: 18, style: { color: "#ef4444" } }), _jsx("span", { className: "text-sm", children: "Draft" })] })), _jsx(Btn, { palette: palette, size: "sm", variant: "outline", onClick: togglePublish, children: quiz.published ? "Tarik Publikasi" : "Publikasikan" })] })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5", children: [_jsx("h2", { className: "font-medium mb-3", children: editingQid ? "Edit Soal" : "Tambah Soal" }), _jsx("input", { type: "text", placeholder: "Teks soal", className: "w-full border rounded p-2 mb-3", value: form.text, onChange: (e) => setForm({ ...form, text: e.target.value }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 mb-3", children: form.options.map((opt, i) => (_jsx("input", { type: "text", placeholder: `Opsi ${String.fromCharCode(65 + i)}`, className: "w-full border rounded p-2", value: opt, onChange: (e) => {
                                                        const copy = [...form.options];
                                                        copy[i] = e.target.value;
                                                        setForm({ ...form, options: copy });
                                                    } }, i))) }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "mr-2 font-medium", children: "Jawaban benar:" }), _jsxs("select", { className: "border rounded px-2 py-1", value: form.answer, onChange: (e) => setForm({ ...form, answer: Number(e.target.value) }), children: [_jsx("option", { value: 0, children: "A" }), _jsx("option", { value: 1, children: "B" }), _jsx("option", { value: 2, children: "C" }), _jsx("option", { value: 3, children: "D" })] })] }), _jsxs("div", { className: "flex gap-3", children: [editingQid ? (_jsx(Btn, { palette: palette, onClick: saveEdit, children: "Simpan Perubahan" })) : (_jsxs(Btn, { palette: palette, onClick: addQuestion, children: [_jsx(Plus, { size: 16, className: "mr-1" }), " Tambah"] })), _jsx(Btn, { palette: palette, variant: "secondary", onClick: resetForm, children: "Reset" })] })] }) }), _jsx("div", { className: "space-y-4", children: quiz.questions.length === 0 ? (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-6 text-sm opacity-70", children: "Belum ada soal." }) })) : (quiz.questions.map((q, idx) => (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5", children: [_jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [_jsxs("div", { className: "font-medium", children: [idx + 1, ". ", q.text] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Btn, { palette: palette, variant: "secondary", size: "sm", onClick: () => startEdit(q.id), children: _jsx(Pencil, { size: 14 }) }), _jsx(Btn, { palette: palette, variant: "destructive", size: "sm", onClick: () => deleteQuestion(q.id), children: _jsx(Trash, { size: 14 }) })] })] }), _jsx("div", { className: "ml-4 space-y-1 text-sm", children: q.options.map((opt, i) => (_jsxs("div", { children: [String.fromCharCode(65 + i), ".", " ", i === q.answer ? (_jsxs("strong", { style: { color: "#16a34a" }, children: [opt, " (benar)"] })) : (opt)] }, i))) })] }) }, q.id)))) })] })] }) })] }));
};
export default DetailClassQuiz;
