import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import SimpleTable from "@/components/common/main/SimpleTable";
import FormattedDate from "@/constants/formattedDate";
import { ExternalLink } from "lucide-react";
export default function DKMQuizLecture() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { id: lecture_id } = useParams();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["lecture-quiz", lecture_id],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-quiz/by-lecture/${lecture_id}`);
            console.log("📡 Quiz data:", res.data);
            return res.data.data;
        },
        enabled: !!lecture_id,
        staleTime: 5 * 60 * 1000,
    });
    const columns = ["No", "Judul Quiz", "Deskripsi", "Tanggal Buat", "Aksi"];
    const rows = data?.map((quiz, index) => [
        index + 1,
        quiz.lecture_sessions_quiz_title,
        quiz.lecture_sessions_quiz_description || "-",
        _jsx(FormattedDate, { value: quiz.lecture_sessions_quiz_created_at }, quiz.lecture_sessions_quiz_id),
        _jsxs("button", { onClick: (e) => {
                e.stopPropagation();
                navigate(`/dkm/kajian/kajian-detail/${quiz.lecture_sessions_quiz_lecture_session_id}/latihan-soal`, {
                    state: { from: location.pathname },
                });
            }, className: "flex items-center gap-1 text-sm underline", style: { color: theme.primary }, children: [_jsx(ExternalLink, { size: 16, style: { color: theme.black1 } }), " "] }, `btn-${quiz.lecture_sessions_quiz_id}`),
    ]) || [];
    const handleRowClick = (index) => {
        const selected = data?.[index];
        if (!selected)
            return;
        navigate(`/dkm/kajian/kajian-detail/${selected.lecture_sessions_quiz_lecture_session_id}/latihan-soal`);
    };
    return (_jsxs("div", { className: "pb-24", children: [_jsx(PageHeader, { title: "Daftar Quiz Kajian", onBackClick: () => navigate(-1) }), isLoading ? (_jsx("p", { className: "text-sm text-gray-500", children: "Memuat data quiz..." })) : isError ? (_jsx("p", { className: "text-sm text-red-500", children: "Gagal memuat data quiz." })) : (_jsx(SimpleTable, { columns: columns, rows: rows, onRowClick: handleRowClick, emptyText: "Belum ada quiz tersedia." }))] }));
}
