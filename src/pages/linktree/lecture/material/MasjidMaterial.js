import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { useLocation, useNavigate, useParams, useSearchParams, } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LectureMaterialMonthList from "@/components/pages/lecture/LectureMonthList";
import LectureMaterialList from "@/components/pages/lecture/LectureMaterialList";
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import PublicNavbar from "@/components/common/public/PublicNavbar";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import axios from "@/lib/axios";
import FormattedDate from "@/constants/formattedDate";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import LectureThemeCard from "@/components/pages/lecture/LectureTheme";
export default function MasjidMaterial() {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data: currentUser } = useCurrentUser();
    const urlTab = searchParams.get("tab");
    const stateTab = location.state?.from?.tab;
    const defaultTab = urlTab || stateTab || "terbaru";
    const [tab, setTab] = useState(defaultTab);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const swiperRef = useRef(null);
    const { data: kajianList = [], isLoading: loadingKajian } = useQuery({
        queryKey: ["kajianListBySlug", slug, currentUser?.id],
        queryFn: async () => {
            const headers = currentUser?.id ? { "X-User-Id": currentUser.id } : {};
            const res = await axios.get(`/public/lecture-sessions-u/soal-materi/${slug}`, { headers });
            console.log("📦 Data sesi kajian:", res.data);
            return res.data?.data ?? [];
        },
        enabled: !!slug,
    });
    const { data: lectureThemes = [], isLoading: loadingThemes } = useQuery({
        queryKey: ["lectureThemesBySlug", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/lectures/by-masjid-slug/${slug}`);
            return res.data?.data ?? [];
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });
    const { data: monthData = [] } = useQuery({
        queryKey: ["lectureMonthData", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-u/by-masjid-slug/${slug}/group-by-month`);
            const rawData = res.data?.data ?? {};
            return Object.entries(rawData).map(([month, sessions]) => {
                const m = month;
                const s = sessions;
                return {
                    month: m,
                    total: s.length, // ✅ ini akan cocok dengan tipe `MonthSummary` di komponen `LectureMaterialMonthList`
                };
            });
        },
        enabled: !!slug && tab === "tanggal",
    });
    const mappedMaterial = kajianList.map((item) => ({
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
    if (!slug)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx(PublicNavbar, { masjidName: "Materi Kajian" }), _jsx("div", { className: "sticky top-16 z-40", style: { backgroundColor: theme.white1 }, children: _jsx("div", { className: "flex justify-around border-b", style: { borderColor: theme.silver1 }, children: ["terbaru", "tema", "tanggal"].map((val) => (_jsx("button", { onClick: () => {
                            setTab(val);
                            setSearchParams({ tab: val });
                            const tabValues = ["terbaru", "tema", "tanggal"];
                            const newIndex = tabValues.indexOf(val);
                            if (swiperRef.current && newIndex !== -1) {
                                swiperRef.current.slideTo(newIndex);
                            }
                        }, className: "py-3 text-sm font-medium", style: {
                            color: tab === val ? theme.primary : theme.silver2,
                            borderBottom: tab === val ? `2px solid ${theme.primary}` : "none",
                        }, children: val.charAt(0).toUpperCase() + val.slice(1) }, val))) }) }), _jsxs("div", { className: "pt-16 pb-20", children: [_jsxs(Swiper, { className: "!h-auto", spaceBetween: 10, slidesPerView: 1, onSlideChange: (swiper) => {
                            const tabValues = ["terbaru", "tema", "tanggal"];
                            const newTab = tabValues[swiper.activeIndex] || "terbaru";
                            setTab(newTab);
                            setSearchParams({ tab: newTab });
                            if (newTab === "tanggal")
                                setSelectedMonth(null);
                        }, onSwiper: (swiper) => {
                            swiperRef.current = swiper;
                            const tabValues = ["terbaru", "tema", "tanggal"];
                            const startIndex = tabValues.indexOf(tab);
                            if (startIndex !== -1)
                                swiper.slideTo(startIndex, 0);
                        }, children: [_jsx(SwiperSlide, { children: _jsx("div", { style: { maxHeight: "calc(100vh - 200px)", overflowY: "auto" }, children: loadingKajian ? (_jsx("p", { className: "p-4", children: "Memuat data..." })) : (_jsx(LectureMaterialList, { data: mappedMaterial })) }) }), _jsx(SwiperSlide, { children: _jsx("div", { className: "space-y-3", style: { maxHeight: "calc(100vh - 200px)", overflowY: "auto" }, children: loadingThemes ? (_jsx("p", { children: "Memuat tema kajian..." })) : (lectureThemes.map((themeItem) => (_jsx(LectureThemeCard, { slug: slug, lecture_slug: themeItem.lecture_slug, lecture_title: themeItem.lecture_title, total_lecture_sessions: themeItem.total_lecture_sessions }, themeItem.lecture_slug)))) }) }), _jsx(SwiperSlide, { children: _jsx("div", { style: { maxHeight: "calc(100vh - 200px)", overflowY: "auto" }, children: selectedMonth ? (_jsxs("div", { className: "space-y-3", children: [_jsx("button", { onClick: () => setSelectedMonth(null), className: "text-sm font-medium", style: { color: theme.primary }, children: "\u2190 Kembali ke daftar bulan" }), _jsxs("h2", { className: "text-base font-medium", children: ["Bulan ", selectedMonth] }), _jsx(LectureMaterialList, { data: mappedMaterial })] })) : (_jsx(LectureMaterialMonthList, { data: monthData, onSelectMonth: (month) => navigate(`/masjid/${slug}/materi-bulan/${month}`) })) }) })] }), _jsx(BottomNavbar, {})] })] }));
}
