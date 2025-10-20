import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/quiz/QuizPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Btn } from "@/pages/sekolahislamku/components/ui/Primitives";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { ArrowLeft, Plus, Pencil, Trash } from "lucide-react";
/* Dummy quiz data */
const DUMMY_QUIZZES = [
    {
        id: "qz-1",
        subjectId: "sbj-1",
        title: "Quiz Aljabar Dasar",
        status: "open",
        questions: [
            {
                id: "q1",
                text: "Hasil dari 2x + 3 = 7 adalah?",
                options: ["x = 1", "x = 2", "x = 3", "x = 4"],
                answer: 1,
            },
        ],
    },
];
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "";
const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const [quizzes, setQuizzes] = useState(DUMMY_QUIZZES);
    const quiz = quizzes.find((q) => q.id === id);
    // Form state untuk add/edit
    const [editingQid, setEditingQid] = useState(null);
    const [formQuestion, setFormQuestion] = useState({
        text: "",
        options: ["", "", "", ""],
        answer: 0,
    });
    const resetForm = () => setFormQuestion({ text: "", options: ["", "", "", ""], answer: 0 });
    // Tambah soal
    const handleAddQuestion = () => {
        if (!quiz)
            return;
        const newQuestion = {
            id: "q" + (quiz.questions.length + 1),
            text: formQuestion.text || "Soal baru...",
            options: formQuestion.options.map((opt, i) => opt || `Pilihan ${String.fromCharCode(65 + i)}`),
            answer: formQuestion.answer,
        };
        setQuizzes((prev) => prev.map((q) => q.id === quiz.id
            ? { ...q, questions: [...q.questions, newQuestion] }
            : q));
        resetForm();
    };
    // Edit soal
    const handleEditQuestion = (qid) => {
        if (!quiz)
            return;
        const q = quiz.questions.find((x) => x.id === qid);
        if (q) {
            setFormQuestion({
                text: q.text,
                options: [...q.options],
                answer: q.answer,
            });
            setEditingQid(qid);
        }
    };
    const handleSaveEdit = () => {
        if (!quiz || !editingQid)
            return;
        setQuizzes((prev) => prev.map((q) => q.id === quiz.id
            ? {
                ...q,
                questions: q.questions.map((ques) => ques.id === editingQid
                    ? {
                        ...ques,
                        text: formQuestion.text,
                        options: formQuestion.options,
                        answer: formQuestion.answer,
                    }
                    : ques),
            }
            : q));
        setEditingQid(null);
        resetForm();
    };
    // Hapus soal
    const handleDeleteQuestion = (qid) => {
        if (!quiz)
            return;
        setQuizzes((prev) => prev.map((q) => q.id === quiz.id
            ? { ...q, questions: q.questions.filter((ques) => ques.id !== qid) }
            : q));
    };
    if (!quiz) {
        return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-xl font-semibold", children: "Quiz tidak ditemukan" }), _jsx(Btn, { palette: palette, className: "mt-4", onClick: () => navigate(-1), children: "Kembali" })] }));
    }
    return (_jsxs("div", { className: "h-full w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: `Kelola Quiz`, gregorianDate: new Date().toISOString(), showBack: true }), _jsx("main", { className: "px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "font-semibold text-lg", children: quiz.title })] }), _jsxs("div", { className: "p-4 border rounded-lg", style: { borderColor: palette.silver1 }, children: [_jsx("h2", { className: "font-medium mb-3", children: editingQid ? "Edit Soal" : "Tambah Soal" }), _jsx("input", { type: "text", placeholder: "Teks soal", className: "w-full border rounded p-2 mb-3", value: formQuestion.text, onChange: (e) => setFormQuestion({ ...formQuestion, text: e.target.value }) }), _jsx("div", { className: "grid grid-cols-2 gap-3 mb-3", children: formQuestion.options.map((opt, i) => (_jsx("input", { type: "text", placeholder: `Opsi ${String.fromCharCode(65 + i)}`, className: "w-full border rounded p-2", value: opt, onChange: (e) => {
                                                    const newOpts = [...formQuestion.options];
                                                    newOpts[i] = e.target.value;
                                                    setFormQuestion({ ...formQuestion, options: newOpts });
                                                } }, i))) }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "font-medium mr-2", children: "Jawaban benar:" }), _jsxs("select", { value: formQuestion.answer, onChange: (e) => setFormQuestion({
                                                        ...formQuestion,
                                                        answer: Number(e.target.value),
                                                    }), className: "border rounded px-2 py-1", children: [_jsx("option", { value: 0, children: "A" }), _jsx("option", { value: 1, children: "B" }), _jsx("option", { value: 2, children: "C" }), _jsx("option", { value: 3, children: "D" })] })] }), _jsxs("div", { className: "flex gap-3", children: [editingQid ? (_jsx(Btn, { palette: palette, onClick: handleSaveEdit, children: "Simpan Perubahan" })) : (_jsxs(Btn, { palette: palette, onClick: handleAddQuestion, children: [_jsx(Plus, { size: 16, className: "mr-1" }), " Tambah"] })), _jsx(Btn, { palette: palette, variant: "secondary", onClick: resetForm, children: "Reset" })] })] }), quiz.questions.length === 0 ? (_jsx("div", { className: "p-6 border rounded-lg", style: { borderColor: palette.silver1 }, children: _jsx("p", { children: "Belum ada soal." }) })) : (_jsx("div", { className: "space-y-6", children: quiz.questions.map((q, i) => (_jsxs("div", { className: "p-4 border rounded-lg", style: { borderColor: palette.silver1 }, children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { className: "font-medium", children: [i + 1, ". ", q.text] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Btn, { palette: palette, variant: "secondary", onClick: () => handleEditQuestion(q.id), children: _jsx(Pencil, { size: 14 }) }), _jsx(Btn, { palette: palette, variant: "destructive", onClick: () => handleDeleteQuestion(q.id), children: _jsx(Trash, { size: 14 }) })] })] }), _jsx("div", { className: "space-y-1 ml-4", children: q.options.map((opt, idx) => (_jsxs("div", { className: "text-sm", children: [String.fromCharCode(65 + idx), ".", " ", idx === q.answer ? (_jsxs("span", { className: "font-bold text-green-600", children: [opt, " (benar)"] })) : (opt)] }, idx))) })] }, q.id))) }))] })] }) })] }));
};
export default QuizPage;
