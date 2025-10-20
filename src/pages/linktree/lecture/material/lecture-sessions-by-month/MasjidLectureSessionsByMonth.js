import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import LectureMaterialList from "@/components/pages/lecture/LectureMaterialList";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import FormattedDate from "@/constants/formattedDate";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { useCurrentUser } from "@/hooks/useCurrentUser";
export default function MasjidMaterialByMonth() {
    const { slug, month } = useParams();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { data: currentUser } = useCurrentUser(); // ambil user saat ini
    const { data: sessions = [], isLoading } = useQuery({
        queryKey: ["kajianByMonth", slug, month, currentUser?.id],
        queryFn: async () => {
            const headers = currentUser?.id ? { "X-User-Id": currentUser.id } : {};
            const res = await axios.get(`/public/lecture-sessions-u/by-masjid-slug/${slug}/by-month/${month}`, { headers });
            console.log("📦 Data sesi kajian:", res.data);
            return res.data?.data ?? [];
        },
        enabled: !!slug && !!month,
    });
    const mappedMaterial = sessions.map((item) => ({
        id: item.lecture_session_id,
        title: item.lecture_session_title,
        teacher: item.lecture_session_teacher_name,
        masjidName: "",
        location: item.lecture_session_place,
        time: (_jsx(FormattedDate, { value: item.lecture_session_start_time, fullMonth: true })),
        lecture_session_slug: item.lecture_session_slug,
        status: item.lecture_session_approved_by_dkm_at ? "tersedia" : "proses",
        lectureId: item.lecture_session_lecture_id,
        gradeResult: item.user_grade_result,
        attendanceStatus: item.user_attendance_status,
        imageUrl: item.lecture_session_image_url,
    }));
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Kajian Detail", onBackClick: () => {
                    navigate(`/masjid/${slug}/soal-materi?tab=tanggal`);
                } }), _jsx("div", { className: "space-y-3", children: _jsx(LectureMaterialList, { data: mappedMaterial }) })] }));
}
