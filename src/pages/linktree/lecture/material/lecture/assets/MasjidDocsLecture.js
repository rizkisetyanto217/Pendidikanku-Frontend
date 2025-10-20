import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
export default function MasjidDocsLecture() {
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    // ✅ ambil slug dari route
    const { lecture_slug } = useParams();
    const { data: groupedAssets = [], isLoading } = useQuery({
        queryKey: ["lecture-docs-by-slug", lecture_slug, "3,4,5,6"],
        queryFn: async () => {
            const res = await axios.get("/public/lecture-sessions-assets/filter-by-lecture-slug", { params: { lecture_slug, file_type: "3,4,5,6" } });
            return res.data?.data || [];
        },
        enabled: !!lecture_slug,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
    return (_jsxs("div", { className: "space-y-6 max-w-2xl mx-auto", children: [_jsx(PageHeaderUser, { title: "Dokumen Kajian", onBackClick: () => {
                    if (window.history.length > 1)
                        navigate(-1);
                } }), isLoading ? (_jsx("div", { className: "text-center text-sm text-silver-500", children: "Memuat data..." })) : groupedAssets.length === 0 ? (_jsx("div", { className: "p-5 rounded-2xl shadow-sm", style: { backgroundColor: theme.white1, color: theme.black1 }, children: _jsx("p", { className: "text-sm text-silver-400", children: "Belum ada dokumen yang tersedia." }) })) : (groupedAssets.map((group) => (_jsxs("div", { className: "p-4 rounded-2xl shadow-md space-y-4", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsx("h2", { className: "text-sm font-semibold", children: group.lecture_session_title?.trim() || "Tanpa Judul" }), group.assets.map((asset) => (_jsxs("div", { className: "space-y-2 border-t pt-4", style: { borderColor: theme.silver2 }, children: [_jsx("p", { className: "text-sm font-medium", children: asset.lecture_sessions_asset_title || "Tanpa Judul" }), _jsx("p", { className: "text-xs text-silver-500 italic", children: asset.lecture_sessions_asset_file_type_label || "" }), _jsx("a", { href: asset.lecture_sessions_asset_file_url, target: "_blank", rel: "noopener noreferrer", className: "inline-block mt-1 text-blue-500 text-sm underline", children: "Lihat Dokumen" })] }, asset.lecture_sessions_asset_id)))] }, group.lecture_session_id))))] }));
}
