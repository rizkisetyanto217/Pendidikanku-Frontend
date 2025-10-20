import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Heart, Share2 } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
    const { data: posts = [], isLoading: isLoadingPosts } = useQuery({
        queryKey: ["masjidPosts", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/posts/by-masjid/${slug}`);
            return res.data.data;
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
    });
    const { data: donations = [], isLoading: isLoadingDonations } = useQuery({
        queryKey: ["masjidDonations", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/donations/by-masjid/${slug}`);
            return res.data;
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
    });
    // Normalisasi post_type agar "image", "video", dll dianggap "masjid"
    const normalizedPosts = posts.map((post) => ({
        ...post,
        post_type: post.post_type === "motivasi" ? "motivasi" : "masjid",
    }));
    const filteredPosts = normalizedPosts.filter((post) => post.post_type === activeTab);
    const handlePostLike = async (postId) => {
        if (!isLoggedIn) {
            alert("Silakan login untuk menyukai postingan.");
            return;
        }
        try {
            await axios.post(`/public/post-likes/${slug}/toggle`, {
                post_id: postId,
            });
            queryClient.invalidateQueries({ queryKey: ["masjidPosts", slug] });
        }
        catch (err) {
            console.error("Gagal like:", err);
        }
    };
    const handleDonationLike = async (donationId) => {
        if (!isLoggedIn) {
            alert("Silakan login untuk menyukai donasi.");
            return;
        }
        try {
            await axios.post(`/public/donations/likes/${slug}/toggle`, {
                donation_like_donation_id: donationId,
            });
            queryClient.invalidateQueries({ queryKey: ["masjidDonations", slug] });
        }
        catch (err) {
            console.error("Gagal like donasi:", err);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PublicNavbar, { masjidName: "Postingan" }), _jsxs("div", { className: "pt-20 space-y-4 pb-20", children: [_jsx("div", { className: "flex items-center justify-start space-x-2", children: ["masjid", "motivasi"].map((tabKey) => (_jsx("button", { onClick: () => setActiveTab(tabKey), className: "px-4 py-1 rounded-full border text-sm font-medium capitalize", style: {
                                backgroundColor: activeTab === tabKey ? theme.primary : "transparent",
                                color: activeTab === tabKey ? "#fff" : theme.black2,
                                borderColor: activeTab === tabKey
                                    ? theme.primary
                                    : theme.silver1,
                            }, children: tabKey === "masjid" ? "🕌 Masjid" : "✍️ Motivasi & Doa" }, tabKey))) }), isLoadingPosts ? (_jsx("p", { className: "text-center text-sm", style: { color: theme.silver2 }, children: "Memuat postingan..." })) : (filteredPosts.map((post) => (_jsxs(CommonCardList, { children: [post.post_image_url && (_jsx(Link, { to: `/masjid/${slug}/post/${post.post_id}`, children: _jsx(ShimmerImage, { src: post.post_image_url, alt: "Post Gambar", className: "w-full aspect-[4/3] object-cover rounded-lg", shimmerClassName: "rounded-lg" }) })), _jsxs("div", { className: "space-y-1 p-4", children: [_jsxs(Link, { to: `/masjid/${slug}/post/${post.post_id}`, children: [_jsx("p", { className: "font-semibold text-sm", style: { color: theme.black2 }, children: post.post_theme?.post_theme_name || "Tanpa Tema" }), _jsxs("p", { className: "text-sm", style: { color: theme.silver4 }, children: [_jsx("strong", { children: post.post_title }), " \u2013 ", post.post_content] })] }), _jsx(FormattedDate, { value: post.post_created_at, fullMonth: true, className: "text-xs pt-1" }), _jsxs("div", { className: "flex items-center justify-between pt-2 text-xs", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-1 cursor-pointer", onClick: () => handlePostLike(post.post_id), children: [_jsx(Heart, { size: 14, fill: post.is_liked_by_user ? theme.primary : "none" }), _jsxs("span", { children: [post.like_count, " Suka"] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Bookmark, { size: 14 }), _jsx("span", { children: "Dukungan" })] })] }), _jsx(InlineShare, { title: post.post_title, url: `${window.location.origin}/masjid/${slug}/post/${post.post_id}` })] })] })] }, post.post_id)))), activeTab === "motivasi" &&
                        !isLoadingDonations &&
                        donations.length > 0 && (_jsxs(_Fragment, { children: [_jsx("p", { className: "pt-4 text-sm font-semibold", style: { color: theme.black2 }, children: "\uD83D\uDC9D Doa & Dukungan dari Donatur:" }), donations.map((donation) => {
                                const shareUrl = `${window.location.origin}/masjid/${slug}/motivation/${donation.donation_id}`;
                                const donorName = donation.donation_name ||
                                    `User ${donation.donation_user_id?.slice(0, 5)}`;
                                return (_jsxs("div", { className: "rounded-xl border px-4 py-3 cursor-pointer", style: {
                                        borderColor: theme.primary,
                                        backgroundColor: isDark
                                            ? theme.white2
                                            : theme.white1,
                                    }, onClick: () => navigate(`/masjid/${slug}/motivation/${donation.donation_id}`), children: [_jsx("p", { className: "font-semibold text-sm", style: { color: theme.black2 }, children: donorName }), _jsx("p", { className: "text-sm", style: { color: theme.silver4 }, children: donation.donation_message }), _jsx(FormattedDate, { value: donation.created_at, fullMonth: true, className: "text-xs pt-1" }), _jsxs("div", { className: "flex items-center justify-between pt-2 text-xs", style: { color: theme.silver2 }, children: [_jsxs("div", { className: "flex items-center space-x-1 cursor-pointer", onClick: (e) => {
                                                        e.stopPropagation(); // hindari klik ke detail
                                                        handleDonationLike(donation.donation_id);
                                                    }, children: [_jsx(Heart, { size: 14, fill: donation.is_liked_by_user
                                                                ? theme.primary
                                                                : "none", stroke: donation.is_liked_by_user
                                                                ? theme.primary
                                                                : theme.silver2 }), _jsxs("span", { children: [donation.like_count, " Suka"] })] }), _jsx(InlineShare, { title: donorName, url: shareUrl })] })] }, donation.donation_id));
                            })] })), _jsx(BottomNavbar, {})] })] }));
}
