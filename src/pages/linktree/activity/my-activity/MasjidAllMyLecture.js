import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/public/aktivitas/MyActivityAllLectures.tsx
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import LectureMaterialList from "@/components/pages/lecture/LectureMaterialList";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import FormattedDate from "@/constants/formattedDate";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
export default function MasjidAllMyLecture() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data: currentUser } = useCurrentUser();
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: lectureSessions = [], isLoading, isError, } = useQuery({
        queryKey: ["allKajianBySlug", slug, currentUser?.id],
        queryFn: async () => {
            const headers = currentUser?.id ? { "X-User-Id": currentUser.id } : {};
            const res = await axios.get(`/public/lecture-sessions-u/soal-materi/${slug}?attendance_only=true`, { headers });
            return res.data?.data ?? [];
        },
        enabled: !!slug,
    });
    const mappedSessions = lectureSessions.map((sesi) => ({
        id: sesi.lecture_session_id,
        imageUrl: sesi.lecture_session_image_url,
        title: sesi.lecture_session_title?.trim() || "-",
        teacher: sesi.lecture_session_teacher_name?.trim() || "-",
        masjidName: "-",
        location: sesi.lecture_session_place || "-",
        // Ganti toLocaleString dengan FormattedDate
        time: (_jsx(FormattedDate, { value: sesi.lecture_session_start_time, fullMonth: true, className: "text-xs text-gray-500" })),
        attendanceStatus: sesi.user_attendance_status,
        gradeResult: sesi.user_grade_result,
        status: sesi.user_grade_result !== undefined ? "tersedia" : "proses",
    }));
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Riwayat Kajian Saya", onBackClick: () => navigate(`/masjid/${slug}/aktivitas`) }), _jsx("div", { className: "min-h-screen pb-28 px-4 space-y-4", children: isLoading ? (_jsx("p", { className: "text-sm text-gray-500", children: "Memuat data..." })) : isError ? (_jsx("p", { className: "text-red-500 text-sm", children: "Gagal memuat data kajian." })) : mappedSessions.length === 0 ? (_jsx("p", { className: "text-sm italic text-gray-500", children: "Belum ada kajian yang dihadiri." })) : (_jsx(LectureMaterialList, { data: mappedSessions })) }), _jsx(BottomNavbar, {})] }));
}
