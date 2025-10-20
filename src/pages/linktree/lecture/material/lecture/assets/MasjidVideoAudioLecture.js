import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
export default function MasjidVideoAudioLecture() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    // ✅ ambil lecture_slug dari route
    const { lecture_slug } = useParams();
    const { data: groupedAssets = [], isLoading } = useQuery({
        queryKey: ["lecture-assets-by-slug", lecture_slug, "1,2"],
        queryFn: async () => {
            const res = await axios.get("/public/lecture-sessions-assets/filter-by-lecture-slug", {
                params: { lecture_slug, file_type: "1,2" },
            });
            return res.data?.data || [];
        },
        enabled: !!lecture_slug,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
    const getYoutubeEmbed = (url) => {
        // dukung: ?v=, /embed/, youtu.be/, tangani &t=
        const match = url?.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
        return match?.[1] || "";
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx(PageHeaderUser, { title: "Video & Audio Kajian", onBackClick: () => {
                    if (window.history.length > 1)
                        navigate(-1);
                } }), isLoading ? (_jsx("div", { className: "text-center text-sm text-silver-500 mt-4", children: "Memuat data..." })) : groupedAssets.length === 0 ? (_jsx("div", { className: "rounded-2xl p-4 shadow-sm text-center mt-4", style: {
                    backgroundColor: theme.white1,
                    color: theme.black1,
                }, children: _jsx("p", { className: "text-sm text-silver-400", children: "Belum ada data video/audio." }) })) : (groupedAssets.map((group) => (_jsx("div", { className: "rounded-2xl shadow-md overflow-hidden mb-6", style: {
                    backgroundColor: theme.white1,
                    borderColor: theme.silver2,
                    color: theme.black1,
                }, children: _jsxs("div", { className: "p-4 space-y-4", children: [_jsx("h2", { className: "text-sm font-semibold", children: group.lecture_session_title?.trim() || "Tanpa Judul" }), group.assets.map((asset) => {
                            const isVideo = asset.lecture_sessions_asset_file_type === 1;
                            const isAudio = asset.lecture_sessions_asset_file_type === 2;
                            const embedId = getYoutubeEmbed(asset.lecture_sessions_asset_file_url);
                            return (_jsxs("div", { className: "space-y-2 border-t pt-4", style: { borderColor: theme.silver2 }, children: [_jsx("p", { className: "text-sm font-medium", children: asset.lecture_sessions_asset_title || "Tanpa Judul" }), _jsx("p", { className: "text-xs text-silver-500 italic", children: asset.lecture_sessions_asset_file_type_label || "" }), isVideo && embedId && (_jsx("div", { className: "aspect-video w-full rounded-xl overflow-hidden", style: { backgroundColor: theme.black1 }, children: _jsx("iframe", { className: "w-full h-full", src: `https://www.youtube.com/embed/${embedId}`, title: asset.lecture_sessions_asset_title, allowFullScreen: true }) })), isAudio && asset.lecture_sessions_asset_file_url && (_jsx("audio", { controls: true, className: "w-full", src: asset.lecture_sessions_asset_file_url }))] }, asset.lecture_sessions_asset_id));
                        })] }) }, group.lecture_session_id))))] }));
}
