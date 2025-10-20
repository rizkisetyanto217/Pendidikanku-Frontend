import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { Tabs, TabsContent } from "@/components/common/main/Tabs";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { Check } from "lucide-react";
export default function MasjidVideoAudioDetailLectureSessions() {
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [tab, setTab] = useState("youtube");
    const [activeIndex, setActiveIndex] = useState(0);
    const { lecture_session_slug, slug } = useParams();
    const { data: assets = [] } = useQuery({
        queryKey: ["lecture-session-assets", lecture_session_slug],
        queryFn: async () => {
            const res = await axios.get("/public/lecture-sessions-assets/filter-slug", {
                params: {
                    lecture_session_slug,
                    file_type: "1,2", // 1 = video, 2 = audio
                },
            });
            return Array.isArray(res.data) ? res.data : [];
        },
        enabled: !!lecture_session_slug,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
    const videoAssets = assets.filter((a) => a.lecture_sessions_asset_file_type === 1);
    const audioAssets = assets.filter((a) => a.lecture_sessions_asset_file_type === 2);
    const currentAssets = tab === "youtube" ? videoAssets : audioAssets;
    const getYoutubeEmbed = (url) => {
        const idMatch = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
        return idMatch?.[1] ?? "";
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx(PageHeaderUser, { title: "Video & Audio", onBackClick: () => {
                    navigate(`/masjid/${slug}/soal-materi/${lecture_session_slug}`);
                } }), _jsx(Tabs, { value: tab, onChange: setTab, tabs: [
                    { label: "YouTube", value: "youtube" },
                    { label: "Audio", value: "audio" },
                ] }), _jsxs("div", { className: "rounded-2xl shadow-sm overflow-hidden pt-4", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [tab === "youtube" && videoAssets.length > 0 && (_jsx("div", { className: "aspect-video w-full", style: { backgroundColor: theme.black1 }, children: _jsx("iframe", { className: "w-full h-full", src: `https://www.youtube.com/embed/${getYoutubeEmbed(videoAssets[activeIndex]?.lecture_sessions_asset_file_url)}`, title: "YouTube Video", allowFullScreen: true }) })), _jsxs("div", { className: "p-5", children: [_jsx(TabsContent, { value: "audio", current: tab, children: audioAssets.length > 0 && (_jsx("div", { className: "w-full mb-6", children: _jsx("audio", { controls: true, className: "w-full", src: audioAssets[activeIndex]?.lecture_sessions_asset_file_url }) })) }), _jsx("ul", { className: "space-y-2", children: currentAssets.map((asset, index) => (_jsxs("li", { onClick: () => setActiveIndex(index), className: "cursor-pointer rounded-lg border px-4 py-3 flex items-center justify-between transition", style: {
                                        backgroundColor: activeIndex === index ? theme.primary2 : theme.white2,
                                        borderColor: activeIndex === index ? theme.primary : theme.silver1,
                                        color: theme.black1,
                                        borderWidth: 1,
                                    }, children: [_jsx("span", { className: "text-sm font-medium", children: asset.lecture_sessions_asset_title }), activeIndex === index && (_jsx(Check, { size: 16, style: { color: theme.primary } }))] }, asset.lecture_sessions_asset_id))) })] })] })] }));
}
