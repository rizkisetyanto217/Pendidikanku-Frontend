import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/quiz/QuizDetailPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Btn } from "@/pages/sekolahislamku/components/ui/Primitives";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { ArrowLeft } from "lucide-react";
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
            {
                id: "q2",
                text: "Rumus luas lingkaran adalah?",
                options: ["πr²", "2πr", "πd", "r²"],
                answer: 0,
            },
        ],
    },
    {
        id: "qz-2",
        subjectId: "sbj-1",
        title: "Quiz Geometri",
        status: "closed",
        questions: [],
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
const QuizDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const quiz = DUMMY_QUIZZES.find((q) => q.id === id);
    const [answers, setAnswers] = useState({});
    if (!quiz) {
        return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-xl font-semibold", children: "Quiz tidak ditemukan" }), _jsx(Btn, { palette: palette, className: "mt-4", onClick: () => navigate(-1), children: "Kembali" })] }));
    }
    const handleAnswer = (qid, idx) => {
        setAnswers((prev) => ({ ...prev, [qid]: idx }));
    };
    return (_jsxs("div", { className: "h-full w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: `Kerjakan: ${quiz.title}`, gregorianDate: new Date().toISOString(), showBack: true }), _jsx("main", { className: "px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-6", children: [_jsxs("div", { className: " md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { className: "cursor-pointer", size: 20 }) }), _jsx("h1", { className: "font-semibold text-lg", children: "Mulai Quizz" })] }), quiz.questions.length === 0 ? (_jsx("div", { className: "p-6 border rounded-lg", style: { borderColor: palette.silver1 }, children: _jsx("p", { children: "Quiz ini belum memiliki soal." }) })) : (_jsxs("div", { className: "space-y-6", children: [quiz.questions.map((q, i) => (_jsxs("div", { className: "p-4 border rounded-lg", style: { borderColor: palette.silver1 }, children: [_jsxs("div", { className: "font-medium mb-3", children: [i + 1, ". ", q.text] }), _jsx("div", { className: "space-y-2", children: q.options.map((opt, idx) => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "radio", name: q.id, checked: answers[q.id] === idx, onChange: () => handleAnswer(q.id, idx) }), opt] }, idx))) })] }, q.id))), _jsxs("div", { className: "mt-6 flex gap-3", children: [_jsx(Btn, { palette: palette, onClick: () => navigate(-1), children: "Batal" }), _jsx(Btn, { palette: palette, onClick: () => alert("Jawaban tersimpan!"), children: "Kumpulkan Jawaban" })] })] }))] })] }) })] }));
};
export default QuizDetailPage;
