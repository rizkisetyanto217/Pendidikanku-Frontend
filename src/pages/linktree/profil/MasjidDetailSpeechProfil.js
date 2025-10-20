import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// MasjidDetailSpeech.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useMemo } from "react";
export default function MasjidDetailSpeech() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["masjid-profile-teacher-dkm", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/masjid-profile-teacher-dkm/by-masjid-slug/${slug}`);
            return (res.data?.data || []);
        },
        enabled: !!slug,
        staleTime: 60_000,
    });
    const speeches = useMemo(() => (data || [])
        .filter((p) => !!p.masjid_profile_teacher_dkm_message)
        .sort((a, b) => new Date(b.masjid_profile_teacher_dkm_created_at).getTime() -
        new Date(a.masjid_profile_teacher_dkm_created_at).getTime()), [data]);
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Sambutan", onBackClick: () => {
                    if (window.history.length > 1)
                        navigate(-1);
                } }), _jsx("div", { className: "space-y-4 mt-4", children: isLoading ? (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Memuat sambutan\u2026" })) : isError ? (_jsx("p", { className: "text-sm text-red-500", children: "Gagal memuat sambutan." })) : speeches.length === 0 ? (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Belum ada sambutan." })) : (speeches.map((item) => (_jsx("div", { className: "border rounded-md p-4 shadow-sm", style: {
                        backgroundColor: theme.white1,
                        borderColor: theme.silver1,
                    }, children: _jsx("div", { className: "flex items-start gap-3", children: _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-semibold", style: { color: theme.black1 }, children: item.masjid_profile_teacher_dkm_name }), _jsx("p", { className: "text-sm mb-2", style: { color: theme.silver2 }, children: item.masjid_profile_teacher_dkm_role || "—" }), _jsx("p", { className: "text-base leading-relaxed", style: { color: theme.black2 }, children: item.masjid_profile_teacher_dkm_message })] }) }) }, item.masjid_profile_teacher_dkm_id)))) })] }));
}
