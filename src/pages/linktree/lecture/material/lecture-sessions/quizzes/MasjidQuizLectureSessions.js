import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
const SCORING_MODE = "mastery";
export default function MasjidQuizLectureSessions() {
    const { lecture_session_slug = "", slug = "" } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const startTimeRef = useRef(Date.now());
    const isCompletingRef = useRef(false);
    const sp = new URLSearchParams(location.search);
    const qpBackTo = sp.get("backTo");
    const backTo = qpBackTo ||
        location.state?.backTo ||
        `/masjid/${slug}/soal-materi/${lecture_session_slug}`;
    // State
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    // untuk 'mastery'
    const [isRetrying, setIsRetrying] = useState(false);
    const [wrongQuestions, setWrongQuestions] = useState([]);
    // progress putaran pertama (untuk progress bar & first-pass grade)
    const [progressCount, setProgressCount] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);
    useEffect(() => {
        setIndex(0);
        setSelected(null);
        setShowAnswer(false);
        setIsCorrect(false);
        setIsRetrying(false);
        setWrongQuestions([]);
        setProgressCount(0);
        setIsFinishing(false);
        isCompletingRef.current = false;
        startTimeRef.current = Date.now();
    }, [lecture_session_slug]);
    // Fetch
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["quiz", lecture_session_slug],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-quiz/${lecture_session_slug}/with-questions-by-slug`);
            return res.data.data;
        },
        enabled: !!lecture_session_slug,
        staleTime: 5 * 60 * 1000,
    });
    const totalQuestions = data?.questions?.length ?? 0;
    const questions = useMemo(() => SCORING_MODE === "mastery" && isRetrying
        ? wrongQuestions
        : (data?.questions ?? []), [data?.questions, isRetrying, wrongQuestions]);
    // Clamp index saat panjang berubah
    useEffect(() => {
        if (questions.length > 0 && index >= questions.length)
            setIndex(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questions.length]);
    const current = questions[index];
    const selectedLetter = (s) => (s ?? "").trim().charAt(0).toUpperCase();
    const submitQuizResult = useCallback(async (grade, duration) => {
        if (!data?.quiz)
            return;
        const payload = {
            user_lecture_sessions_quiz_grade_result: grade,
            user_lecture_sessions_quiz_duration_seconds: duration,
            user_lecture_sessions_quiz_quiz_id: data.quiz.lecture_sessions_quiz_id,
            user_lecture_sessions_quiz_lecture_session_id: data.quiz.lecture_sessions_quiz_lecture_session_id,
        };
        await axios.post(`/public/user-lecture-sessions-quiz/by-session/${lecture_session_slug}`, payload);
    }, [data?.quiz, lecture_session_slug]);
    const finishWith = useCallback(async (grade, correctCount) => {
        if (isCompletingRef.current)
            return;
        isCompletingRef.current = true;
        setIsFinishing(true);
        const durationSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
        try {
            await submitQuizResult(grade, durationSec);
        }
        catch (e) {
            console.error("❌ submitQuizResult failed:", e);
        }
        finally {
            navigate(`/masjid/${slug}/soal-materi/${lecture_session_slug}/latihan-soal/hasil`, {
                state: {
                    correct: correctCount,
                    total: totalQuestions,
                    duration: durationSec,
                    slug,
                    lecture_session_slug,
                    from: backTo,
                },
                replace: true,
            });
        }
    }, [
        backTo,
        lecture_session_slug,
        navigate,
        slug,
        submitQuizResult,
        totalQuestions,
    ]);
    // // ganti jadi
    // const finishMastery100 = useCallback(() => {
    //   // grade 100 (tuntas), tapi 'correct' = benar di percobaan pertama
    //   return finishWith(100, progressCount);
    // }, [finishWith, progressCount]);
    // ⬇️ hitung grade dari jawaban pertama (progressCount) lalu kirim ke backend
    const finishMasteryEnd = useCallback(() => {
        const gradeFirstAttempt = Math.round((progressCount / (totalQuestions || 1)) * 100);
        return finishWith(gradeFirstAttempt, progressCount);
    }, [finishWith, progressCount, totalQuestions]);
    // Actions
    const handleCheck = useCallback(() => {
        if (!current || !selected)
            return;
        const right = selectedLetter(selected) ===
            current.lecture_sessions_question_correct.toUpperCase();
        setIsCorrect(right);
        setShowAnswer(true);
        if (right) {
            if (SCORING_MODE === "mastery" && isRetrying) {
                setWrongQuestions((prev) => prev.filter((q) => q.lecture_sessions_question_id !==
                    current.lecture_sessions_question_id));
            }
            else {
                setProgressCount((v) => v + 1);
            }
        }
        else if (SCORING_MODE === "mastery") {
            setWrongQuestions((prev) => {
                if (prev.some((q) => q.lecture_sessions_question_id ===
                    current.lecture_sessions_question_id)) {
                    return prev;
                }
                return [...prev, current];
            });
        }
    }, [current, isRetrying, selected]);
    const handleNext = useCallback(() => {
        setShowAnswer(false);
        setSelected(null);
        // Putaran pertama
        if (SCORING_MODE === "first-pass" || !isRetrying) {
            const isLastFirstPass = index + 1 === totalQuestions;
            if (!isLastFirstPass) {
                setIndex((i) => i + 1);
                return;
            }
            // ✅ FIRST-PASS: submit nilai (0 kalau semua salah)
            if (SCORING_MODE === "first-pass") {
                const correct = progressCount;
                const grade = Math.round((correct / (totalQuestions || 1)) * 100);
                finishWith(grade, correct);
                return;
            }
            // ✅ MASTERY: kalau ada salah → retry, kalau tidak → 100
            if (wrongQuestions.length > 0) {
                setIsRetrying(true);
                setIndex(0);
                return;
            }
            finishMasteryEnd();
            return;
        }
        // Retry (hanya mastery)
        const remaining = wrongQuestions.length;
        if (remaining === 0) {
            finishMasteryEnd();
            return;
        }
        if (index + 1 >= remaining)
            setIndex(0);
        else
            setIndex((i) => i + 1);
    }, [
        finishMasteryEnd,
        finishWith,
        index,
        isRetrying,
        progressCount,
        totalQuestions,
        wrongQuestions.length,
    ]);
    useEffect(() => {
        if (SCORING_MODE === "mastery" &&
            isRetrying &&
            wrongQuestions.length === 0 &&
            !isFinishing &&
            !isCompletingRef.current) {
            // semua salah sudah dibereskan → akhiri kuis (100)
            finishMasteryEnd();
        }
    }, [isRetrying, wrongQuestions.length, isFinishing, finishMasteryEnd]);
    // Render guards
    if (isLoading)
        return _jsx("div", { className: "p-4", children: "Memuat soal..." });
    if (isError) {
        console.error("❌ Fetch quiz error:", error);
        return (_jsxs("div", { className: "pb-28", children: [_jsx(PageHeaderUser, { title: "Latihan Soal", onBackClick: () => navigate(backTo) }), _jsx("div", { className: "mt-4 text-sm text-center text-red-500", children: "Gagal memuat soal. Coba lagi ya." })] }));
    }
    if (!data || totalQuestions === 0) {
        return (_jsxs("div", { className: "pb-28", children: [_jsx(PageHeaderUser, { title: "Latihan Soal", onBackClick: () => navigate(backTo) }), _jsx("div", { className: "mt-4 text-sm text-center text-gray-500 dark:text-white/70", children: "Belum ada soal tersedia untuk sesi ini." })] }));
    }
    // Transisi sesaat saat index di-clamp
    if (!current) {
        return (_jsx("div", { className: "p-4 text-sm text-gray-500 dark:text-white/70", children: "Memuat soal berikutnya..." }));
    }
    if (isFinishing) {
        return (_jsxs("div", { className: "p-4 flex flex-col items-center justify-center min-h-[60vh] text-sm text-gray-500 dark:text-white/70", children: [_jsx("div", { className: "animate-spin w-8 h-8 border-4 border-t-transparent border-gray-400 rounded-full mb-4" }), "Menyiapkan hasil..."] }));
    }
    // UI
    return (_jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx(PageHeaderUser, { title: data.quiz?.lecture_sessions_quiz_title || "Latihan Soal", onBackClick: () => navigate(backTo) }), _jsxs("div", { className: "p-4 rounded-lg shadow-sm", style: { backgroundColor: theme.white1, borderColor: theme.silver1 }, children: [_jsx("div", { className: "relative h-2 rounded-full bg-gray-200 dark:bg-white/10 mb-6 mt-2", children: _jsx("div", { className: "absolute top-0 left-0 h-full rounded-full transition-all duration-300", style: {
                                width: `${(progressCount / (totalQuestions || 1)) * 100}%`,
                                backgroundColor: theme.primary,
                            } }) }), _jsx("p", { className: "text-sm font-medium mb-4", style: { color: theme.black1 }, children: current.lecture_sessions_question }), _jsx("div", { className: "space-y-3 mb-6", children: current.lecture_sessions_question_answers.map((opt) => {
                            const isSel = selected === opt;
                            const isUserAnswerCorrect = selectedLetter(selected) ===
                                current.lecture_sessions_question_correct.toUpperCase();
                            const showRight = showAnswer && isUserAnswerCorrect && isSel;
                            const showWrong = showAnswer && !isUserAnswerCorrect && isSel;
                            return (_jsx("button", { onClick: () => setSelected(opt), disabled: showAnswer, className: clsx("w-full px-4 py-3 rounded-lg text-sm text-left border transition-all font-medium", isSel && !showAnswer ? "text-white" : ""), style: {
                                    backgroundColor: showAnswer
                                        ? showRight
                                            ? theme.success2
                                            : showWrong
                                                ? theme.error2
                                                : theme.white3
                                        : isSel
                                            ? theme.primary
                                            : theme.white3,
                                    color: showAnswer
                                        ? theme.black1
                                        : isSel
                                            ? theme.white1
                                            : theme.black1,
                                    borderColor: showAnswer
                                        ? showRight
                                            ? theme.success1
                                            : showWrong
                                                ? theme.error1
                                                : theme.silver1
                                        : isSel
                                            ? theme.primary
                                            : theme.silver1,
                                }, children: opt }, opt));
                        }) }), showAnswer && isCorrect && (_jsxs("div", { className: "text-sm mb-4 p-3 rounded", style: { backgroundColor: theme.success2, color: theme.success1 }, children: [_jsx("strong", { children: "\u2705 Jawaban Benar" }), _jsx("br", {}), current.lecture_sessions_question_explanation] })), _jsx("button", { className: "w-full py-3 mt-3 rounded-lg text-sm font-semibold transition-all", style: {
                            backgroundColor: selected || showAnswer ? theme.primary : theme.silver2,
                            color: theme.white1,
                        }, onClick: showAnswer ? handleNext : handleCheck, disabled: !selected && !showAnswer, children: showAnswer ? "Lanjut" : "Cek" })] })] }));
}
