import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router-dom";
import FormattedDate from "@/constants/formattedDate";
import StatusBadge from "@/components/common/main/MainStatusBadge";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import ShimmerImage from "@/components/common/main/ShimmerImage";
export default function DKMDetailPost() {
    const location = useLocation();
    const navigate = useNavigate();
    const post = location.state;
    if (!post) {
        return _jsx("div", { className: "p-4 text-red-600", children: "Post tidak ditemukan" });
    }
    return (_jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [_jsx(PageHeader, { title: "Detail Post", backTo: "/dkm/post", actionButton: {
                    label: "Edit Post",
                    to: "/dkm/post/tambah-edit",
                    state: post,
                } }), _jsxs("div", { className: "flex flex-col lg:flex-row gap-6 items-start", children: [post.post_image_url && (_jsx(ShimmerImage, { src: post.post_image_url, alt: post.post_title, className: "w-full lg:w-72 h-auto rounded shadow", shimmerClassName: "rounded" })), _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-2xl font-bold", children: post.post_title }), _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: [_jsx(FormattedDate, { value: post.post_created_at }), " \u2022", " ", post.post_theme?.post_theme_name || "Tanpa Tema"] }), _jsx("div", { className: "mt-2", children: _jsx(StatusBadge, { text: post.post_is_published ? "Aktif" : "Draft", variant: post.post_is_published ? "success" : "warning" }) }), _jsx("div", { className: "whitespace-pre-line text-base leading-relaxed mt-4", children: post.post_content }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400 mt-4", children: [_jsx("span", { className: "font-semibold", children: "Disukai:" }), " ", post.like_count, " Jamaah"] })] })] })] }));
}
