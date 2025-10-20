import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// MasjidDKMTeacherDetailMobile.tsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function MasjidDetailDKMPengajarMobile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const itemFromState = location.state?.item;
    const slug = location.state?.slug;
    // Fallback fetch kalau user masuk langsung tanpa state
    const { data: list, isLoading, isError, } = useQuery({
        queryKey: ["masjid-profile-teacher-dkm", slug],
        queryFn: async () => {
            if (!slug)
                return [];
            const res = await axios.get(`/public/masjid-profile-teacher-dkm/by-masjid-slug/${slug}`);
            return (res.data?.data || []);
        },
        enabled: !!slug && !itemFromState,
        staleTime: 60_000,
    });
    const item = useMemo(() => {
        if (itemFromState)
            return itemFromState;
        if (!list || !id)
            return null;
        return list.find((x) => x.masjid_profile_teacher_dkm_id === id) || null;
    }, [itemFromState, list, id]);
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(PageHeaderUser, { title: "Detail Profil", onBackClick: () => window.history.length > 1 ? navigate(-1) : navigate("/") }), _jsxs("div", { className: "space-y-4", children: [!item &&
                        (isLoading ? (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Memuat data\u2026" })) : isError ? (_jsx("p", { className: "text-sm text-red-500", children: "Gagal memuat data." })) : (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Data tidak ditemukan." }))), item && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold", style: { color: theme.black1 }, children: item.masjid_profile_teacher_dkm_name }), _jsx("span", { className: "inline-block mt-1 px-3 py-1 rounded-full text-xs", style: {
                                            backgroundColor: theme.white2,
                                            color: theme.quaternary,
                                            border: `1px solid ${theme.silver1}`,
                                        }, children: item.masjid_profile_teacher_dkm_role || "—" })] }), item.masjid_profile_teacher_dkm_description && (_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "font-semibold", style: { color: theme.black2 }, children: "Deskripsi" }), _jsx("p", { className: "text-base leading-relaxed", style: { color: theme.black1 }, children: item.masjid_profile_teacher_dkm_description })] })), item.masjid_profile_teacher_dkm_message && (_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "font-semibold", style: { color: theme.black2 }, children: "Sambutan" }), _jsx("p", { className: "text-base leading-relaxed", style: { color: theme.black1 }, children: item.masjid_profile_teacher_dkm_message })] }))] }))] })] }));
}
