import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Tabs } from "@/components/common/main/Tabs";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { BookOpen, User, CalendarDays, CalendarCheck, Calculator, Book, XCircle, Info, PlayCircle, ListChecks, NotebookText, MessageSquare, MessageSquarePlus, FileText, Award, } from "lucide-react";
import LectureMaterialList from "@/components/pages/lecture/LectureMaterialList";
import ShareBCLectureButton from "@/components/common/public/ShareBCLectureButton";
/* ---------------- Helpers ---------------- */
const fmtTime = (iso) => new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
});
/** Map API → item list; status diambil dari approved_by_dkm */
function toLectureItem(s, teacherNames, meta = {}) {
    const approved = !!s.lecture_session_approved_by_dkm_at?.trim();
    return {
        id: s.lecture_session_id || s.lecture_session_slug,
        lecture_session_slug: s.lecture_session_slug,
        imageUrl: s.lecture_session_image_url,
        title: s.lecture_session_title,
        teacher: teacherNames,
        time: fmtTime(s.lecture_session_start_time),
        location: s.lecture_session_place || "-",
        lectureId: meta.lectureId ?? "",
        masjidName: meta.masjidName ?? "",
        attendanceStatus: typeof s.user_attendance_status === "number"
            ? s.user_attendance_status
            : undefined,
        gradeResult: typeof s.user_grade_result === "number" ? s.user_grade_result : undefined,
        status: approved ? "tersedia" : "proses",
    };
}
/* ---------------- Component ---------------- */
export default function MasjidLectureMaterial() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { lecture_slug = "", slug = "" } = useParams();
    const { data: currentUser } = useCurrentUser();
    const [swiperInstance, setSwiperInstance] = useState();
    const [tab, setTab] = useState("navigasi");
    /* ---------- Lecture (tetap) ---------- */
    const { data: lectureWrap, isLoading: loadingLecture, isError: errorLecture, } = useQuery({
        queryKey: ["lecture-theme", lecture_slug, currentUser?.id],
        queryFn: async () => {
            const headers = currentUser?.id ? { "X-User-Id": currentUser.id } : {};
            const res = await axios.get(`/public/lectures/by-slug/${lecture_slug}`, {
                headers,
            });
            return res.data?.data;
        },
        enabled: !!lecture_slug,
        staleTime: 5 * 60 * 1000,
    });
    const lecture = lectureWrap?.lecture;
    const userProgress = lectureWrap?.user_progress;
    const teacherNames = useMemo(() => {
        const arr = lecture?.lecture_teachers ?? [];
        if (!arr.length)
            return "-";
        return [...new Set(arr.map((t) => t.name))].join(", ");
    }, [lecture?.lecture_teachers]);
    /* ---------- Sessions buckets ---------- */
    const { data: buckets, isLoading: loadingBuckets, isError: errorBuckets, } = useQuery({
        queryKey: ["lecture-sessions-all", lecture_slug, currentUser?.id],
        queryFn: async () => {
            const headers = currentUser?.id ? { "X-User-Id": currentUser.id } : {};
            const res = await axios.get(`/public/lecture-sessions-u/by-lecture-slug/${lecture_slug}/all`, { headers });
            return res.data;
        },
        enabled: !!lecture_slug,
        staleTime: 5 * 60 * 1000,
    });
    const upcomingItems = useMemo(() => {
        const list = buckets?.upcoming ?? [];
        return list.map((s) => toLectureItem(s, teacherNames));
    }, [buckets?.upcoming, teacherNames]);
    const finishedItems = useMemo(() => {
        const list = buckets?.finished ?? [];
        return list.map((s) => toLectureItem(s, teacherNames));
    }, [buckets?.finished, teacherNames]);
    /* ---------- UI ---------- */
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Tema Kajian Detail", onBackClick: () => navigate(`/masjid/${slug}/soal-materi?tab=tema`) }), _jsx(Tabs, { value: tab, onChange: (val) => {
                    const v = val;
                    setTab(v);
                    if (v === "navigasi")
                        swiperInstance?.slideTo(0);
                    else
                        swiperInstance?.slideTo(1);
                }, tabs: [
                    { label: "Navigasi", value: "navigasi" },
                    { label: "Kajian", value: "kajian" },
                ] }), _jsxs(Swiper, { onSwiper: setSwiperInstance, onSlideChange: (sw) => setTab(sw.activeIndex === 0 ? "navigasi" : "kajian"), initialSlide: tab === "kajian" ? 1 : 0, spaceBetween: 50, slidesPerView: 1, children: [_jsx(SwiperSlide, { children: _jsxs("div", { className: "rounded-lg p-4 shadow mt-4 relative" // ✅ relative untuk anchor tombol share
                            , style: { backgroundColor: theme.white1 }, children: [_jsx("h2", { className: "text-base font-semibold mb-2", style: { color: theme.black1 }, children: "Informasi Tema Kajian" }), loadingLecture ? (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Memuat informasi..." })) : errorLecture || !lecture ? (_jsx("p", { className: "text-red-500 text-sm", children: "Gagal memuat data." })) : (_jsxs("div", { className: "rounded-lg", style: { backgroundColor: theme.white1 }, children: [_jsxs("div", { className: "text-base space-y-2", style: { color: theme.black2 }, children: [_jsxs("div", { className: "flex items-start gap-2 pt-4", children: [_jsx(BookOpen, { size: 18, style: { color: theme.black1, marginTop: 2 } }), _jsxs("p", { children: [_jsx("strong", { style: { color: theme.black1 }, children: "Materi:" }), " ", lecture.lecture_title] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(User, { size: 18, style: { color: theme.black1, marginTop: 2 } }), _jsxs("p", { children: [_jsx("strong", { style: { color: theme.black1 }, children: "Pengajar:" }), " ", teacherNames] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CalendarDays, { size: 18, style: { color: theme.black1, marginTop: 2 } }), _jsxs("p", { children: [_jsx("strong", { style: { color: theme.black1 }, children: "Jadwal:" }), " ", lecture.lecture_description || "-"] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CalendarCheck, { size: 18, style: { color: theme.black1, marginTop: 2 } }), _jsxs("p", { children: [_jsx("strong", { style: { color: theme.black1 }, children: "Mulai:" }), " 24 Mei 2024 \u2013 Sekarang"] })] }), !!userProgress && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Calculator, { size: 18, style: { color: theme.black1, marginTop: 2 } }), _jsxs("p", { children: [_jsx("strong", { style: { color: theme.black1 }, children: "Nilai Akhir:" }), " ", userProgress.grade_result ?? "-"] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Book, { size: 18, style: { color: theme.black1, marginTop: 2 } }), _jsxs("p", { children: [_jsx("strong", { style: { color: theme.black1 }, children: "Sesi Selesai:" }), " ", userProgress.total_completed_sessions ?? 0] })] })] }))] }), !lecture.lecture_is_certificate_generated && (_jsxs("div", { className: "flex items-center gap-2 mt-2 text-sm italic", style: { color: theme.error1 }, children: [_jsx(XCircle, { size: 16 }), _jsx("span", { children: "Sertifikat belum tersedia" })] })), _jsx("div", { className: "absolute top-4 right-2", children: _jsx(ShareBCLectureButton, { variant: "ghost", buttonLabel: "Bagikan", lectureTitle: lecture?.lecture_title || "Tema Kajian", teacherNames: teacherNames, sessions: (buckets?.upcoming || []).map((s) => ({
                                                    startTime: s.lecture_session_start_time,
                                                    place: s.lecture_session_place,
                                                })), url: `${window.location.origin}/masjid/${slug}/tema/${lecture_slug}`, masjidSlug: slug }) })] })), _jsx("h2", { className: "text-base mt-5 font-semibold mb-2", style: { color: theme.black1 }, children: "Navigasi Utama" }), _jsx("div", { className: "space-y-2", children: [
                                        ...(lecture?.lecture_is_certificate_generated
                                            ? [
                                                {
                                                    label: "Sertifikat",
                                                    path: "ujian",
                                                    highlight: true,
                                                    icon: Award,
                                                },
                                            ]
                                            : []),
                                        { label: "Informasi", path: "informasi", icon: Info },
                                        { label: "Video Audio", path: "video-audio", icon: PlayCircle },
                                        {
                                            label: "Latihan Soal",
                                            path: "latihan-soal",
                                            icon: ListChecks,
                                        },
                                        { label: "Ringkasan", path: "ringkasan", icon: NotebookText },
                                        {
                                            label: "Tanya Jawab",
                                            path: "tanya-jawab",
                                            icon: MessageSquare,
                                        },
                                        {
                                            label: "Masukan dan Saran",
                                            path: "masukan-saran",
                                            icon: MessageSquarePlus,
                                        },
                                        { label: "Dokumen", path: "dokumen", icon: FileText },
                                    ].map((item) => {
                                        const isSertifikat = item.label === "Sertifikat";
                                        const isAvailable = item.highlight;
                                        const Icon = item.icon;
                                        return (_jsxs("div", { onClick: () => navigate(`/masjid/${slug}/tema/${lecture_slug}/${item.path}`), className: "flex items-center justify-between p-3 rounded-md border cursor-pointer hover:bg-opacity-90 transition", style: {
                                                backgroundColor: isSertifikat && isAvailable
                                                    ? theme.success1
                                                    : theme.white3,
                                                border: `1px solid ${isSertifikat && isAvailable
                                                    ? theme.success1
                                                    : theme.silver1}`,
                                                color: isSertifikat && isAvailable
                                                    ? theme.specialColor
                                                    : theme.black1,
                                            }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [isSertifikat && isAvailable && _jsx("span", { children: "\uD83C\uDF89" }), Icon && (_jsx(Icon, { size: 18, style: {
                                                                color: isSertifikat && isAvailable
                                                                    ? theme.specialColor
                                                                    : theme.black1,
                                                            } })), _jsx("span", { children: item.label })] }), isSertifikat && isAvailable ? (_jsx("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full", style: {
                                                        backgroundColor: theme.success1,
                                                        color: theme.white1,
                                                    }, children: "Tersedia" })) : (_jsx("span", { style: { color: theme.silver4 }, children: "\u203A" }))] }, item.label));
                                    }) })] }) }), _jsx(SwiperSlide, { children: _jsx("div", { className: "pb-24 space-y-4 mt-4", children: loadingBuckets ? (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Memuat sesi kajian..." })) : errorBuckets ? (_jsx("p", { className: "text-sm text-red-500", children: "Gagal memuat daftar sesi." })) : !upcomingItems.length && !finishedItems.length ? (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Belum ada sesi." })) : (_jsxs(_Fragment, { children: [!!upcomingItems.length && (_jsxs("section", { children: [_jsx("h4", { className: "text-sm font-semibold mb-2", style: { color: theme.black1 }, children: "Mendatang" }), _jsx(LectureMaterialList, { data: upcomingItems })] })), !!upcomingItems.length && !!finishedItems.length && (_jsx("div", { className: "h-px my-2", style: { backgroundColor: theme.silver1 } })), !!finishedItems.length && (_jsxs("section", { children: [_jsx("h4", { className: "text-sm font-semibold mb-2", style: { color: theme.black1 }, children: "Selesai" }), _jsx(LectureMaterialList, { data: finishedItems })] }))] })) }) })] }), _jsx(BottomNavbar, {})] }));
}
