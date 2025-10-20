import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Share2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import axios from "@/lib/axios";
import PublicNavbar from "@/components/common/public/PublicNavbar";
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import FormattedDate from "@/constants/formattedDate";
import CommonCardList from "@/components/common/main/CommonCardList";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import LoginPromptModal from "@/components/common/home/LoginPromptModal";
function InlineShare({ title, url }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [showShare, setShowShare] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        alert("Link berhasil disalin!");
        setShowShare(false);
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: (e) => {
                    e.stopPropagation(); // cegah trigger ke parent
                    setShowShare(!showShare);
                }, className: "flex items-center space-x-1 text-sm", style: { color: theme.quaternary }, children: [_jsx(Share2, { size: 16 }), _jsx("span", { children: "Bagikan" })] }), showShare && (_jsxs("div", { className: "absolute z-50 mt-2 p-3 border rounded shadow w-64 right-0", style: {
                    backgroundColor: theme.white1,
                    borderColor: theme.silver1,
                }, children: [_jsx("p", { className: "text-xs mb-2", style: { color: theme.black2 }, children: "Bagikan link:" }), _jsx("input", { type: "text", readOnly: true, value: url, className: "w-full text-xs p-1 border rounded mb-2", style: {
                            backgroundColor: theme.white3,
                            borderColor: theme.silver1,
                            color: theme.black1,
                        } }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: handleCopy, className: "text-sm font-semibold hover:underline", style: { color: theme.success1 }, children: "Salin Link" }), _jsx("a", { href: `https://wa.me/?text=${encodeURIComponent(`Assalamualaikum! Lihat ini yuk: ${title} — ${url}`)}`, target: "_blank", rel: "noopener noreferrer", className: "text-sm font-semibold hover:underline", style: { color: theme.success1 }, children: "WhatsApp" })] })] }))] }));
}
export default function MasjidPost() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [activeTab, setActiveTab] = useState("masjid");
    const { slug = "" } = useParams();
    const { data: user } = useCurrentUser();
    const isLoggedIn = !!user;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [showHeartId, setShowHeartId] = useState(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [loginPromptSource, setLoginPromptSource] = useState(null);
    const { data: posts = [], isLoading: isLoadingPosts } = useQuery({
        queryKey: ["masjidPosts", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/posts/by-masjid/${slug}`);
            return res.data.data;
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
    });
    // Normalisasi post_type agar "image", "video", dll dianggap "masjid"
    const normalizedPosts = Array.isArray(posts)
        ? posts.map((post) => ({
            ...post,
            post_type: post.post_type === "motivasi" ? "motivasi" : "masjid",
        }))
        : [];
    const filteredPosts = normalizedPosts.filter((post) => post.post_type === activeTab);
    const handlePostLike = async (postId, isAlreadyLiked) => {
        if (!isLoggedIn) {
            setLoginPromptSource("like");
            setShowLoginPrompt(true);
            return;
        }
        try {
            // ✅ Tampilkan animasi ❤️ hanya kalau BELUM di-like
            if (!isAlreadyLiked) {
                setShowHeartId(postId);
                setTimeout(() => setShowHeartId(null), 800);
            }
            await axios.post(`/public/post-likes/${slug}/toggle`, {
                post_id: postId,
            });
            queryClient.invalidateQueries({ queryKey: ["masjidPosts", slug] });
        }
        catch (err) {
            console.error("Gagal like:", err);
        }
    };
    const handleDoubleClickLike = async (post) => {
        if (!isLoggedIn) {
            setLoginPromptSource("like");
            setShowLoginPrompt(true);
            return;
        }
        if (post.is_liked_by_user)
            return;
        try {
            setShowHeartId(post.post_id);
            setTimeout(() => setShowHeartId(null), 800);
            await axios.post(`/public/post-likes/${slug}/toggle`, {
                post_id: post.post_id,
            });
            queryClient.invalidateQueries({ queryKey: ["masjidPosts", slug] });
        }
        catch (err) {
            console.error("Gagal like:", err);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PublicNavbar, { masjidName: "Postingan" }), _jsxs("div", { className: "pt-20 space-y-4 pb-20", children: [isLoadingPosts ? (_jsx("p", { className: "text-center text-sm", style: { color: theme.silver2 }, children: "Memuat postingan..." })) : filteredPosts.length === 0 ? (_jsx("div", { className: "text-center text-sm pt-10", style: { color: theme.silver2 }, children: "Belum ada postingan." })) : (filteredPosts.map((post) => (_jsxs(CommonCardList, { children: [post.post_image_url && (
                            // <Link to={`/masjid/${slug}/post/${post.post_id}`}>
                            _jsxs("div", { className: "relative", children: [_jsx(ShimmerImage, { src: post.post_image_url, alt: "Post Gambar", className: "w-full aspect-[4/3] object-cover rounded-lg", shimmerClassName: "rounded-lg", onDoubleClick: () => handleDoubleClickLike(post) }), showHeartId === post.post_id && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: _jsx(Heart, { size: 64, className: "text-white animate-ping-fast", fill: "white" }) }))] })
                            // </Link>
                            ), _jsxs("div", { className: "space-y-1 p-4", children: [_jsx("p", { className: "font-semibold text-base", style: { color: theme.black2 }, children: post.post_theme?.post_theme_name || "Tanpa Tema" }), _jsxs("p", { className: "text-base", style: { color: theme.silver4 }, children: [_jsx("strong", { children: post.post_title }), " \u2013 ", post.post_content] }), _jsx(FormattedDate, { value: post.post_created_at, fullMonth: true, className: "text-sm pt-1" }), _jsxs("div", { className: "flex items-center justify-between pt-2 text-xs", children: [_jsx("div", { className: "flex items-center space-x-4", children: _jsxs("div", { className: "flex items-center space-x-1 cursor-pointer", onClick: () => handlePostLike(post.post_id, post.is_liked_by_user), children: [_jsx(Heart, { size: 20, fill: post.is_liked_by_user ? theme.primary : "none", stroke: post.is_liked_by_user
                                                                ? theme.primary
                                                                : theme.black2 }), _jsxs("span", { children: [post.like_count, " Suka"] })] }) }), _jsx(InlineShare, { title: post.post_title, url: `${window.location.origin}/masjid/${slug}/post/${post.post_id}` })] })] })] }, post.post_id)))), _jsx(BottomNavbar, {}), _jsx(LoginPromptModal, { show: showLoginPrompt, onClose: () => {
                            setShowLoginPrompt(false);
                            setLoginPromptSource(null);
                        }, onLogin: () => (window.location.href = "/login"), showContinueButton: false, title: loginPromptSource === "like"
                            ? "Login untuk Menyukai Postingan"
                            : "Login untuk Mendukung Postingan", message: loginPromptSource === "like"
                            ? "Silakan login untuk memberi like pada postingan ini."
                            : "Silakan login untuk mendukung atau menyimpan postingan ini." })] })] }));
}
