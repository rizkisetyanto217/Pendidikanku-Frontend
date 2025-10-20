import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AttendanceModal from "./components/AttendanceModal";
import { Home, Video, BookOpen, FileText, FolderOpen, User, CalendarDays, MapPin, ClipboardCheck, FileWarning, } from "lucide-react";
import FormattedDate from "@/constants/formattedDate";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import LoginPromptModal from "@/components/common/home/LoginPromptModal";
import ShowImageFull from "@/components/pages/home/ShowImageFull";
import ShareBCButton from "@/components/common/public/ShareBCLectureSessionsButton";
export default function MasjidLectureSessions() {
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { lecture_session_slug = "", slug = "" } = useParams();
    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "navigasi";
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const queryClient = useQueryClient();
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showCatatanModal, setShowCatatanModal] = useState(false);
    const [loginPromptSource, setLoginPromptSource] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    // 1) Ambil status user + flags
    const { data: currentUser, isLoading: loadingUser, isFetched: userFetched, } = useCurrentUser();
    // Bikin key khusus (agar cache anon ≠ cache user)
    const userKey = currentUser?.id ?? "anon";
    // ✅ Ambil data sesi berdasarkan slug
    // 2) Query detail sesi — tunggu userFetched, bedakan key dengan userKey
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["lectureSessionDetail", lecture_session_slug, userKey],
        queryFn: async () => {
            const headers = currentUser ? { "X-User-Id": currentUser.id } : undefined;
            const res = await axios.get(`/public/lecture-sessions-u/by-slug/${lecture_session_slug}`, { headers });
            console.log("📦 Data sesi kajian:", res.data);
            return res.data;
        },
        enabled: !!lecture_session_slug && userFetched, // ⬅️ jangan fetch sebelum tahu status user
        staleTime: 60 * 1000, // aman lebih pendek
        refetchOnMount: "always", // hindari pakai cache anon
    });
    // ✅ Ambil data kehadiran berdasarkan session_id dari data
    const { data: attendanceData } = useQuery({
        queryKey: ["userAttendance", data?.lecture_session_id, currentUser?.id],
        queryFn: async () => {
            const headers = currentUser?.id ? { "X-User-Id": currentUser.id } : {};
            const res = await axios.get(`/public/user-lecture-sessions-attendance/${data?.lecture_session_id}`, { headers });
            return res.data;
        },
        enabled: !!data?.lecture_session_id && !!currentUser?.id,
        staleTime: 5 * 60 * 1000,
    });
    const info = {
        materi: data?.lecture_session_title || "-",
        ustadz: data?.lecture_session_teacher_name || "-",
        jadwal: data?.lecture_session_start_time || "-",
        tempat: data?.lecture_session_place || "-",
    };
    const resolvePath = (p) => {
        // kalau "informasi" mau tetap di halaman ini, arahkan ke root detail
        return `/masjid/${slug}/soal-materi/${lecture_session_slug}/${p}`;
    };
    const menuItems = [
        { label: "Informasi", icon: Home, path: "informasi" },
        { label: "Video-Audio", icon: Video, path: "video-audio" },
        { label: "Latihan Soal", icon: BookOpen, path: "latihan-soal" },
        // { label: "Materi Lengkap", icon: Book, path: "materi-lengkap" },
        { label: "Materi", icon: FileText, path: "ringkasan" },
        { label: "Dokumen", icon: FolderOpen, path: "dokumen" },
        { label: "Catatanku", icon: FolderOpen, path: "catatanku" },
    ];
    const isApproved = Boolean(data?.lecture_session_approved_by_dkm_at);
    // menu yang ditampilkan
    const visibleMenuItems = isApproved
        ? menuItems
        : menuItems.filter((m) => !["ringkasan", "latihan-soal"].includes(m.path));
    return (_jsxs("div", { className: "pb-20 space-y-0 max-w-2xl mx-auto", children: [_jsx(PageHeaderUser, { title: "Kajian Detail", onBackClick: () => {
                    navigate(`/masjid/${slug}/soal-materi?tab=terbaru`);
                } }), _jsxs("div", { className: "rounded-xl overflow-hidden border flex flex-col md:flex-row", style: {
                    borderColor: theme.silver1,
                    backgroundColor: theme.white1,
                    color: theme.black1,
                }, children: [_jsx("div", { className: "w-full md:w-1/3 aspect-[4/5] md:aspect-auto md:h-auto overflow-hidden", style: {
                            maxHeight: "500px",
                            borderRight: `1px solid ${theme.silver1}`,
                        }, children: _jsx(ShimmerImage, { src: data?.lecture_session_image_url
                                ? decodeURIComponent(data.lecture_session_image_url)
                                : undefined, alt: data?.lecture_session_title || "Gambar Kajian", className: "w-full h-full object-cover cursor-pointer", shimmerClassName: "rounded", onClick: () => setShowImageModal(true) }) }), _jsx("div", { className: "flex-1 p-4 space-y-2 text-sm", children: isLoading ? (_jsx("p", { style: { color: theme.silver2 }, children: "Memuat data..." })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(BookOpen, { size: 16, style: { marginTop: 2 } }), _jsxs("p", { children: [_jsx("strong", { children: "Materi:" }), " ", info.materi] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(User, { size: 16, style: { marginTop: 2 } }), _jsxs("p", { children: [_jsx("strong", { children: "Pengajar:" }), " ", info.ustadz] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CalendarDays, { size: 16, style: { marginTop: 2 } }), _jsxs("p", { children: [_jsx("strong", { children: "Jadwal:" }), " ", info.jadwal !== "-" ? (_jsx(FormattedDate, { value: info.jadwal, fullMonth: true })) : ("-")] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(MapPin, { size: 16, style: { marginTop: 2 } }), _jsxs("p", { children: [_jsx("strong", { children: "Tempat:" }), " ", info.tempat] })] })] }), _jsxs("div", { className: "flex flex-col gap-3 mt-4", children: [_jsxs("div", { className: "rounded-md px-3 py-2 text-sm flex items-start gap-2", style: {
                                                backgroundColor: typeof data?.user_grade_result === "number"
                                                    ? "#D1FAE5"
                                                    : "#FDE68A",
                                                color: typeof data?.user_grade_result === "number"
                                                    ? "#065F46"
                                                    : "#92400E",
                                                border: "1px solid #D1D5DB",
                                            }, children: [typeof data?.user_grade_result === "number" ? (_jsx(ClipboardCheck, { size: 16 })) : (_jsx(FileWarning, { size: 16 })), _jsxs("p", { children: [_jsx("strong", { children: "Materi & Soal:" }), " ", typeof data?.user_grade_result === "number"
                                                            ? `Sudah dikerjakan ✓ | Nilai: ${data.user_grade_result}`
                                                            : "Tanpa Keterangan ✕"] })] }), _jsxs("div", { className: "rounded-md px-3 py-2 text-sm flex items-start gap-2 cursor-pointer hover:opacity-80", style: {
                                                backgroundColor: attendanceData?.user_lecture_sessions_attendance_status ===
                                                    1
                                                    ? "#D1FAE5"
                                                    : "#FDE68A",
                                                color: attendanceData?.user_lecture_sessions_attendance_status ===
                                                    1
                                                    ? "#065F46"
                                                    : "#92400E",
                                                border: "1px solid #D1D5DB",
                                            }, onClick: () => {
                                                if (!currentUser) {
                                                    setLoginPromptSource("attendance");
                                                    setShowLoginPrompt(true);
                                                }
                                                else {
                                                    setShowAttendanceModal(true);
                                                }
                                            }, children: [attendanceData?.user_lecture_sessions_attendance_status ===
                                                    1 ? (_jsx(ClipboardCheck, { size: 16 })) : (_jsx(FileWarning, { size: 16 })), _jsxs("p", { children: [_jsx("strong", { children: "Status Kehadiran:" }), " ", attendanceData?.user_lecture_sessions_attendance_status ===
                                                            1
                                                            ? "Hadir ✓"
                                                            : "✕ Catat Kehadiran"] })] })] }), _jsx("div", { className: "mt-2 pt-2 w-full flex justify-end", children: _jsx(ShareBCButton, { variant: "ghost", title: data?.lecture_session_title || "Kajian Masjid", teacher: data?.lecture_session_teacher_name || "", dateIso: data?.lecture_session_start_time, place: data?.lecture_session_place || "", url: `${window.location.origin}/masjid/${slug}/soal-materi/${lecture_session_slug}`, masjidSlug: slug }) })] })) })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-base font-semibold mb-2 mt-4", style: { color: theme.primary }, children: "Navigasi Utama" }), _jsx("div", { className: "grid grid-cols-3 lg:grid-cols-4 gap-4", children: visibleMenuItems.map((item) => (_jsxs("div", { onClick: () => {
                                if (item.path === "catatanku" && !currentUser) {
                                    setShowCatatanModal(true);
                                    return;
                                }
                                if (item.path === "latihan-soal" && !currentUser) {
                                    setLoginPromptSource("quiz");
                                    setShowLoginPrompt(true);
                                    return;
                                }
                                navigate(resolvePath(item.path), {
                                    state: {
                                        backTo: `/masjid/${slug}/soal-materi/${lecture_session_slug}`,
                                    },
                                });
                            }, className: "flex flex-col items-center text-center text-sm p-3 rounded-md cursor-pointer hover:opacity-90 transition", style: {
                                backgroundColor: theme.white3,
                                color: theme.black1,
                            }, children: [_jsx("div", { className: "text-2xl mb-1", children: _jsx(item.icon, { size: 24 }) }), _jsx("span", { children: item.label })] }, item.label))) }), _jsx(BottomNavbar, {}), showAttendanceModal && currentUser && (_jsx(AttendanceModal, { show: true, onClose: () => setShowAttendanceModal(false), sessionId: data?.lecture_session_id || "", onSuccess: () => {
                            setShowAttendanceModal(false);
                            queryClient.invalidateQueries({
                                queryKey: [
                                    "userAttendance",
                                    data?.lecture_session_id,
                                    currentUser?.id,
                                ],
                            });
                            queryClient.invalidateQueries({
                                queryKey: [
                                    "lectureSessionDetail",
                                    lecture_session_slug,
                                    currentUser?.id,
                                ],
                            });
                        } })), showCatatanModal && !currentUser && (_jsx(LoginPromptModal, { show: true, onClose: () => setShowCatatanModal(false), onLogin: () => (window.location.href = "/login"), showContinueButton: false, title: "Login untuk Akses Catatan", message: "Silakan login terlebih dahulu agar dapat melihat dan menyimpan catatan pribadi Anda." })), _jsx(LoginPromptModal, { show: showLoginPrompt, onClose: () => {
                            setShowLoginPrompt(false);
                            setLoginPromptSource(null);
                        }, onLogin: () => (window.location.href = "/login"), showContinueButton: loginPromptSource === "quiz", continueLabel: "Lanjutkan Tanpa Login", onContinue: () => {
                            setShowLoginPrompt(false);
                            setLoginPromptSource(null);
                            if (loginPromptSource === "quiz") {
                                navigate(`/masjid/${slug}/soal-materi/${lecture_session_slug}/latihan-soal`, { state: { fromTab: tab } });
                            }
                        }, title: loginPromptSource === "quiz"
                            ? "Login untuk Menyimpan Progres"
                            : "Login untuk Mencatat Kehadiran", message: loginPromptSource === "quiz"
                            ? "Silakan login terlebih dahulu jika ingin progres latihan soal Anda tersimpan."
                            : "Silakan login terlebih dahulu untuk mencatat kehadiran Anda dalam kajian ini." }), showImageModal && data?.lecture_session_image_url && (_jsx(ShowImageFull, { url: data.lecture_session_image_url, onClose: () => setShowImageModal(false) }))] })] }));
}
