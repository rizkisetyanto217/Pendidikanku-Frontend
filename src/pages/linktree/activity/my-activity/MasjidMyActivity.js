import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/linktree/activity/my-activity/MasjidMyActivity.tsx
import { useMemo } from "react";
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import PublicNavbar from "@/components/common/public/PublicNavbar";
import LectureMaterialList from "@/components/pages/lecture/LectureMaterialList";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import CommonButton from "@/components/common/main/CommonButton";
import CommonActionButton from "@/components/common/main/CommonActionButton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import axios from "@/lib/axios";
/* ===================== Utils ===================== */
function pickJoinDate(u) {
    if (!u)
        return undefined;
    const iso = u.created_at ??
        u.createdAt ??
        u.first_seen_at ??
        (typeof u.created_at_unix === "number"
            ? new Date(u.created_at_unix * 1000).toISOString()
            : undefined);
    if (!iso)
        return undefined;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? undefined : d;
}
function normalizeUser(u) {
    if (!u)
        return undefined;
    return {
        displayName: u.user_name || u.name || "Pengguna",
        role: u.role || undefined,
        joinedAt: pickJoinDate(u),
    };
}
/* ===================== Page ===================== */
export default function MasjidMyActivity() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark); // ⬅️ Palette
    const navigate = useNavigate();
    const { slug } = useParams();
    const { data: currentUserRaw } = useCurrentUser();
    // Normalisasi user agar aman dipakai komponen anak
    const user = useMemo(() => normalizeUser(currentUserRaw), [currentUserRaw]);
    const { data: lectureSessions = [], isLoading, isError, } = useQuery({
        queryKey: [
            "kajianListBySlug",
            slug,
            currentUserRaw?.id,
        ],
        queryFn: async () => {
            const u = currentUserRaw;
            const headers = u?.id ? { "X-User-Id": u.id } : {};
            const res = await axios.get(`/public/lecture-sessions-u/soal-materi/${slug}?attendance_only=true`, { headers });
            return res.data?.data ?? [];
        },
        enabled: Boolean(slug) && Boolean(currentUserRaw?.id),
    });
    // Map ke tipe komponen
    const mappedSessions = useMemo(() => lectureSessions.map((sesi) => {
        const slug = sesi.lecture_session_slug ?? sesi.lecture_session_id;
        const lectureId = sesi.lecture_id ?? sesi.lectureId ?? sesi.lecture_session_id;
        const attendance = typeof sesi.user_attendance_status === "number"
            ? sesi.user_attendance_status
            : undefined;
        const grade = typeof sesi.user_grade_result === "number"
            ? sesi.user_grade_result
            : undefined;
        const base = {
            id: sesi.lecture_session_id,
            lecture_session_slug: slug,
            lectureId,
            title: sesi.lecture_session_title?.trim() || "-",
            teacher: sesi.lecture_session_teacher_name?.trim() || "-",
            masjidName: "-",
            location: sesi.lecture_session_place || "-",
            time: new Date(sesi.lecture_session_start_time).toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
            status: grade !== undefined ? "tersedia" : "proses",
        };
        const item = {
            ...base,
            ...(sesi.lecture_session_image_url
                ? { imageUrl: sesi.lecture_session_image_url }
                : {}),
            ...(attendance !== undefined ? { attendanceStatus: attendance } : {}),
            ...(grade !== undefined ? { gradeResult: grade } : {}),
        };
        return item;
    }), [lectureSessions]);
    const displayedSessions = mappedSessions.slice(0, 5);
    return (_jsxs(_Fragment, { children: [_jsx(PublicNavbar, { masjidName: "Aktivitas Saya" }), !currentUserRaw ? (_jsx(GuestView, { themeColors: theme, onLogin: () => navigate("/login") })) : (_jsx(UserActivityView, { user: user, themeColors: theme, isDark: isDark, slug: slug || "", sessions: displayedSessions, isLoading: isLoading, isError: isError })), _jsx(BottomNavbar, {})] }));
}
/* ===================== Subcomponents ===================== */
function GuestView({ themeColors, onLogin, }) {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center text-center px-4", children: _jsxs("div", { children: [_jsx("p", { className: "text-sm mb-4", style: { color: themeColors.black1 }, children: "Silakan login terlebih dahulu untuk mulai melihat aktivitas belajar Anda." }), _jsx(CommonActionButton, { text: "Login", onClick: onLogin, className: "px-4 py-2 text-sm rounded-md", style: {
                        backgroundColor: themeColors.primary,
                        color: themeColors.white1,
                    } })] }) }));
}
function UserActivityView({ user, themeColors, isDark, slug, sessions, isLoading, isError, }) {
    return (_jsxs("div", { className: "min-h-screen pb-28 bg-cover bg-no-repeat bg-center pt-16", children: [_jsx(UserProfileCard, { user: user, themeColors: themeColors, isDark: isDark }), _jsxs("div", { className: "mt-6", children: [_jsx("h2", { className: "text-sm font-semibold mb-3", style: { color: themeColors.primary }, children: "Riwayat Kajian Saya" }), isLoading ? (_jsx("p", { children: "Memuat data..." })) : isError ? (_jsx("p", { className: "text-red-500 text-sm", children: "Gagal memuat data kajian." })) : sessions.length === 0 ? (_jsx("p", { className: "text-sm italic text-gray-500", children: "Belum ada kajian yang dihadiri." })) : (_jsx(LectureMaterialList, { data: sessions })), _jsx("br", {}), _jsx(CommonButton, { to: `/masjid/${slug}/aktivitas/kajian-saya`, text: "Selengkapnya", className: "w-full py-3 rounded-lg text-sm", style: {
                            backgroundColor: themeColors.primary,
                            color: themeColors.white1,
                        } })] })] }));
}
function UserProfileCard({ user, themeColors, isDark, }) {
    const joinDate = user?.joinedAt;
    const isValidDate = !!joinDate && !isNaN(joinDate.getTime());
    return (_jsxs("div", { className: "rounded-xl p-4", style: { backgroundColor: themeColors.primary2 }, children: [_jsx("h1", { className: "text-base font-semibold", style: { color: themeColors.black1 }, children: user?.displayName || "Nama tidak tersedia" }), user?.role && (_jsxs("p", { className: "text-sm mt-1", style: { color: themeColors.black1 }, children: ["Role: ", user.role] })), _jsxs("p", { className: "text-sm mt-1", style: { color: themeColors.black1 }, children: ["Bergabung pada", " ", isValidDate
                        ? joinDate.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })
                        : "-"] }), _jsx("button", { className: "mt-4 px-4 py-2 text-sm font-medium rounded-full", style: {
                    backgroundColor: themeColors.primary,
                    color: isDark ? themeColors.black1 : themeColors.white1,
                }, children: "Profil Saya" })] }));
}
