import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { Plus, X, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Tabs, TabsContent } from "@/components/common/main/Tabs";
export default function DKMVideoAudioLectureSessions() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [tab, setTab] = useState("youtube");
    const [newLink, setNewLink] = useState("");
    const [newAudioFile, setNewAudioFile] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [youtubeTitle, setYoutubeTitle] = useState("");
    const [audioTitle, setAudioTitle] = useState("");
    const { data: assets = [] } = useQuery({
        queryKey: ["lecture-session-assets", id],
        queryFn: async () => {
            const res = await axios.get("/public/lecture-sessions-assets/filter", {
                params: { lecture_session_id: id, file_type: "1,2" },
            });
            return Array.isArray(res.data) ? res.data : [];
        },
        enabled: !!id,
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
    const addYoutubeLink = async () => {
        if (!newLink.trim() || !id || isSubmitting)
            return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("lecture_sessions_asset_title", youtubeTitle.trim() ||
                `Video - ${new Date().toLocaleTimeString("id-ID")}`);
            formData.append("lecture_sessions_asset_file_url", newLink.trim());
            formData.append("lecture_sessions_asset_file_type", "1");
            formData.append("lecture_sessions_asset_lecture_session_id", id);
            await axios.post("/api/a/lecture-sessions-assets", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Video berhasil ditambahkan");
            setNewLink("");
            setYoutubeTitle(""); // reset
            await queryClient.invalidateQueries({
                queryKey: ["lecture-session-assets", id],
            });
        }
        catch {
            toast.error("Gagal menambahkan video");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const addAudioFile = async () => {
        if (!newAudioFile || !id || isSubmitting)
            return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("lecture_sessions_asset_title", audioTitle.trim() || `Audio - ${new Date().toLocaleTimeString("id-ID")}`);
            formData.append("lecture_sessions_asset_file_url", newAudioFile);
            formData.append("lecture_sessions_asset_file_type", "2");
            formData.append("lecture_sessions_asset_lecture_session_id", id);
            await axios.post("/api/a/lecture-sessions-assets", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Audio berhasil ditambahkan");
            setNewAudioFile(null);
            setAudioTitle(""); // reset
            await queryClient.invalidateQueries({
                queryKey: ["lecture-session-assets", id],
            });
        }
        catch (error) {
            console.error("Gagal menambahkan audio:", error);
            toast.error("Gagal menambahkan audio");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const removeAsset = async (assetId, index) => {
        setDeletingId(assetId);
        try {
            await axios.delete(`/api/a/lecture-sessions-assets/${assetId}`);
            toast.success("Berhasil dihapus");
            await queryClient.invalidateQueries({
                queryKey: ["lecture-session-assets", id],
            });
            if (activeIndex === index)
                setActiveIndex(0);
            else if (index < activeIndex)
                setActiveIndex((prev) => prev - 1);
        }
        catch {
            toast.error("Gagal menghapus");
        }
        finally {
            setDeletingId(null);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Video & Rekaman", onBackClick: () => navigate(`/dkm/kajian/kajian-detail/${id}`) }), _jsx(Tabs, { value: tab, onChange: setTab, tabs: [
                    { label: "YouTube", value: "youtube" },
                    { label: "Audio", value: "audio" },
                ] }), _jsxs("div", { className: "p-5 rounded-2xl shadow-sm", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsx(TabsContent, { value: "youtube", current: tab, children: videoAssets.length > 0 && (_jsx("div", { className: "aspect-video w-full mb-6 rounded-xl overflow-hidden", style: { backgroundColor: theme.black1 }, children: _jsx("iframe", { className: "w-full h-full", src: `https://www.youtube.com/embed/${getYoutubeEmbed(videoAssets[activeIndex]?.lecture_sessions_asset_file_url)}`, title: "YouTube Video", allowFullScreen: true }) })) }), _jsx(TabsContent, { value: "audio", current: tab, children: audioAssets.length > 0 && (_jsx("div", { className: "w-full mb-6", children: _jsx("audio", { controls: true, preload: "none", className: "w-full", src: audioAssets[activeIndex]?.lecture_sessions_asset_file_url }) })) }), _jsx("div", { className: "mb-6 flex flex-wrap gap-3", children: currentAssets.map((asset, index) => (_jsxs("div", { className: `flex items-center gap-2 border px-3 py-1 rounded-full cursor-pointer ${activeIndex === index ? "border-primary" : "border-gray-300"}`, style: {
                                backgroundColor: activeIndex === index ? theme.primary2 : theme.white2,
                                color: theme.black1,
                            }, onClick: () => setActiveIndex(index), children: [_jsx("span", { className: "text-xs truncate max-w-[160px]", children: asset.lecture_sessions_asset_title }), _jsx("button", { disabled: !!deletingId, onClick: (e) => {
                                        e.stopPropagation();
                                        if (!deletingId)
                                            removeAsset(asset.lecture_sessions_asset_id, index);
                                    }, children: deletingId === asset.lecture_sessions_asset_id ? (_jsx(Loader2, { size: 14, className: "animate-spin" })) : (_jsx(X, { size: 14 })) })] }, asset.lecture_sessions_asset_id))) }), tab === "youtube" && (_jsxs("div", { className: "space-y-5 text-sm", children: [_jsx("label", { className: "font-medium block", style: { color: theme.black1 }, children: "Tambah Link YouTube" }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "font-medium mb-1", style: { color: theme.black1 }, children: "Judul Video" }), _jsx("input", { type: "text", value: youtubeTitle, onChange: (e) => setYoutubeTitle(e.target.value), placeholder: "Contoh: Penjelasan tentang Tauhid", className: "px-3 py-2 border rounded-lg", style: {
                                                    backgroundColor: theme.white2,
                                                    borderColor: theme.primary2,
                                                    color: theme.black1,
                                                } })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "font-medium mb-1", style: { color: theme.black1 }, children: "Link Video" }), _jsx("input", { type: "text", placeholder: "https://youtube.com/watch?v=...", value: newLink, onChange: (e) => setNewLink(e.target.value), className: "px-3 py-2 border rounded-lg", style: {
                                                    backgroundColor: theme.white2,
                                                    borderColor: theme.primary2,
                                                    color: theme.black1,
                                                } })] }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { onClick: addYoutubeLink, disabled: isSubmitting, className: `text-sm px-4 py-2 rounded-md font-medium flex items-center gap-1 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`, style: {
                                                backgroundColor: theme.primary,
                                                color: theme.white1,
                                            }, children: [isSubmitting ? (_jsx(Loader2, { size: 16, className: "animate-spin" })) : (_jsx(Plus, { size: 16 })), " ", "Tambah"] }) })] })] })), tab === "audio" && (_jsxs("div", { className: "space-y-5 text-sm", children: [_jsx("label", { className: "font-medium block", style: { color: theme.black1 }, children: "Upload Audio (MP3)" }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "font-medium mb-1", style: { color: theme.black1 }, children: "Judul Audio" }), _jsx("input", { type: "text", value: audioTitle, onChange: (e) => setAudioTitle(e.target.value), placeholder: "Contoh: Rekaman Kajian Ust. Asep", className: "px-3 py-2 border rounded-lg", style: {
                                                    backgroundColor: theme.white2,
                                                    borderColor: theme.primary2,
                                                    color: theme.black1,
                                                } })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "font-medium mb-1", style: { color: theme.black1 }, children: "File Audio" }), _jsx("input", { type: "file", accept: "audio/*", onChange: (e) => setNewAudioFile(e.target.files?.[0] || null), className: "px-3 py-2 border rounded-lg", style: {
                                                    backgroundColor: theme.white2,
                                                    borderColor: theme.primary2,
                                                    color: theme.black1,
                                                } })] }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { onClick: addAudioFile, disabled: isSubmitting || !newAudioFile, className: `text-sm px-4 py-2 rounded-md font-medium flex items-center gap-1 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`, style: {
                                                backgroundColor: theme.primary,
                                                color: theme.white1,
                                            }, children: [isSubmitting ? (_jsx(Loader2, { size: 16, className: "animate-spin" })) : (_jsx(Plus, { size: 16 })), " ", "Upload"] }) })] })] }))] })] }));
}
