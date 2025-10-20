import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import FormattedDate from "@/constants/formattedDate";
import { Clock, Repeat2, Play } from "lucide-react";
export default function MasjidQuizLecture() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { slug = "", lecture_slug = "" } = useParams();
    const { data: currentUser } = useCurrentUser();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["lecture-quiz-by-lecture-slug", lecture_slug, currentUser?.id],
        queryFn: async () => {
            const headers = currentUser?.id ? { "X-User-Id": currentUser.id } : {};
            const res = await axios.get(`/public/lecture-sessions-quiz/by-lecture-slug/${lecture_slug}`, { headers, params: { only_with_quiz: true } });
            return res.data;
        },
        enabled: !!lecture_slug,
        staleTime: 5 * 60 * 1000,
    });
    const rows = data?.data ?? [];
    // Bagi dua: belum dikerjakan vs sudah dikerjakan (berdasar user_quiz_grade_result)
    const { todo, done } = useMemo(() => {
        const todoList = [];
        const doneList = [];
        for (const r of rows) {
            (r.user_quiz_grade_result == null ? todoList : doneList).push(r);
        }
        return { todo: todoList, done: doneList };
    }, [rows]);
    const goBack = () => navigate(`/masjid/${slug}/tema/${lecture_slug}`);
    // jadi begini (pakai halaman yang sama + type + backTo):
    const handleOpenQuiz = (r, type = "quiz") => {
        // contoh di Card tombol "Mulai Quiz" dari tema
        navigate(`/masjid/${slug}/soal-materi/${r.lecture_session_slug}/latihan-soal`, {
            state: {
                backTo: `/masjid/${slug}/tema/${lecture_slug}`, // <- balik ke tema
            },
        });
    };
    // helper kecil
    const formatDuration = (sec) => {
        if (!sec || sec <= 0)
            return "-";
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${String(s).padStart(2, "0")}`;
    };
    // ==== Card baru, drop-in replacement ====
    const Card = ({ r }) => {
        const grade = r.user_quiz_grade_result;
        const attempts = r.user_quiz_attempt_count ?? 0;
        const durText = formatDuration(r.user_quiz_duration_seconds);
        const hasQuiz = !!r.lecture_sessions_quiz_id;
        const isDone = grade != null;
        const ctaLabel = isDone ? "Lihat / Ulangi" : "Mulai Quiz";
        const ctaIcon = isDone ? _jsx(Repeat2, { size: 16 }) : _jsx(Play, { size: 16 });
        const progressPct = Math.max(0, Math.min(100, Number(grade ?? 0)));
        return (_jsxs("div", { className: "group p-4 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-default", style: {
                background: theme.white1,
                borderColor: theme.silver2,
            }, children: [_jsx("div", { className: "flex items-start justify-between gap-3", children: _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("h3", { className: "font-semibold truncate", style: { color: theme.black1 }, title: r.lecture_session_title, children: r.lecture_session_title }), _jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full border", style: {
                                            background: isDone ? theme.success1 : theme.warning1,
                                            color: theme.white1,
                                            borderColor: isDone ? theme.success1 : theme.warning1,
                                        }, children: isDone ? "Selesai" : "Belum" })] }), _jsxs("p", { className: "text-xs mt-1 flex items-center gap-1", style: { color: theme.silver2 }, children: [_jsx(Clock, { size: 14 }), r.lecture_session_start_time ? (_jsx(FormattedDate, { value: r.lecture_session_start_time })) : ("-")] })] }) }), _jsxs("div", { className: "mt-3", children: [_jsx("p", { className: "text-sm font-medium", style: { color: theme.black2 }, children: r.lecture_sessions_quiz_title || "Latihan Soal" }), !!r.lecture_sessions_quiz_description && (_jsx("p", { className: "text-xs mt-0.5 line-clamp-2", style: { color: theme.silver2 }, children: r.lecture_sessions_quiz_description }))] }), _jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2 text-xs", style: { color: theme.black2 }, children: [_jsxs("div", { className: "rounded-lg px-2 py-1 border", style: { borderColor: theme.silver2 }, children: [_jsx("div", { className: "opacity-70", children: "Nilai" }), _jsx("div", { className: "font-semibold", children: isDone ? grade : "-" })] }), _jsxs("div", { className: "rounded-lg px-2 py-1 border", style: { borderColor: theme.silver2 }, children: [_jsx("div", { className: "opacity-70", children: "Kali Coba" }), _jsx("div", { className: "font-semibold", children: attempts })] }), _jsxs("div", { className: "rounded-lg px-2 py-1 border", style: { borderColor: theme.silver2 }, children: [_jsx("div", { className: "opacity-70", children: "Durasi" }), _jsx("div", { className: "font-semibold", children: durText })] })] }), isDone && (_jsxs("div", { className: "mt-3", children: [_jsx("div", { className: "h-2 w-full rounded-full", style: { background: theme.white3 }, children: _jsx("div", { className: "h-2 rounded-full transition-all", style: {
                                    width: `${progressPct}%`,
                                    background: theme.success1,
                                } }) }), _jsxs("div", { className: "mt-1 text-[10px]", style: { color: theme.silver2 }, children: ["Progres nilai ", progressPct, "%"] })] })), _jsx("div", { className: "mt-4 flex justify-end", children: _jsxs("button", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border font-medium\n                     hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed", style: {
                            borderColor: theme.silver2,
                            color: theme.black1,
                            background: theme.white2,
                        }, onClick: () => handleOpenQuiz(r), disabled: !hasQuiz, title: !hasQuiz ? "Quiz belum tersedia" : "", children: [ctaIcon, ctaLabel] }) })] }));
    };
    return (_jsxs("div", { className: "max-w-3xl mx-auto p-4", children: [_jsx(PageHeaderUser, { title: "Latihan Soal Kajian", onBackClick: goBack }), isLoading ? (_jsx("p", { style: { color: theme.silver2 }, children: "Memuat daftar quiz\u2026" })) : isError ? (_jsx("p", { className: "text-red-500", children: "Gagal memuat data." })) : !rows.length ? (_jsx("p", { style: { color: theme.silver2 }, children: "Belum ada quiz untuk tema ini." })) : (_jsxs("div", { className: "space-y-8", children: [!!todo.length && (_jsxs("section", { children: [_jsx("h4", { className: "text-sm font-semibold mb-2", style: { color: theme.black1 }, children: "Belum dikerjakan" }), _jsx("div", { className: "space-y-3", children: todo.map((r) => (_jsx(Card, { r: r }, r.lecture_session_id))) })] })), !!done.length && (_jsxs("section", { children: [_jsx("h4", { className: "text-sm font-semibold mb-2", style: { color: theme.black1 }, children: "Sudah dikerjakan" }), _jsx("div", { className: "space-y-3", children: done.map((r) => (_jsx(Card, { r: r }, r.lecture_session_id))) })] }))] }))] }));
}
