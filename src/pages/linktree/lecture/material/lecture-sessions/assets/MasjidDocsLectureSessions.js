import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/linktree/activity/my-activity/MasjidDocsLectureSessions.tsx
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { Download } from "lucide-react";
import FormattedDate from "@/constants/formattedDate";
/* =========================
   Helpers
========================= */
const extractExt = (url) => {
    try {
        const u = new URL(url);
        const pathname = decodeURIComponent(u.pathname);
        const last = pathname.split("/").pop() || "";
        const raw = last.includes(".") ? last.split(".").pop() || "" : "";
        return raw.toLowerCase();
    }
    catch {
        const noQuery = url.split("?")[0];
        const last = noQuery.split("/").pop() || "";
        const raw = last.includes(".") ? last.split(".").pop() || "" : "";
        return raw.toLowerCase();
    }
};
const toLabel = (ext) => {
    switch (ext) {
        case "pdf":
            return "PDF";
        case "doc":
        case "docx":
            return "DOCX";
        case "xls":
        case "xlsx":
            return "XLSX";
        case "ppt":
        case "pptx":
            return "PPT";
        default:
            return ext ? ext.toUpperCase() : "FILE";
    }
};
const labelColors = (ext, theme) => {
    switch (ext) {
        case "pdf":
            return { backgroundColor: "#FFD700", color: "#000000" };
        case "doc":
        case "docx":
            return { backgroundColor: "#4A90E2", color: "#FFFFFF" };
        case "xls":
        case "xlsx":
            return { backgroundColor: "#21A366", color: "#FFFFFF" };
        case "ppt":
        case "pptx":
            return { backgroundColor: "#D24726", color: "#FFFFFF" };
        default:
            return { backgroundColor: theme.specialColor, color: "#000000" };
    }
};
/* =========================
   Item Component
========================= */
function DocItem({ asset, theme, onDownload, }) {
    const rawExt = extractExt(asset.lecture_sessions_asset_file_url);
    const label = toLabel(rawExt);
    const badgeStyle = labelColors(rawExt, theme);
    const safeFilename = rawExt
        ? `${asset.lecture_sessions_asset_title}.${rawExt}`
        : asset.lecture_sessions_asset_title;
    return (_jsxs("div", { onClick: () => window.open(asset.lecture_sessions_asset_file_url, "_blank", "noopener,noreferrer"), className: "cursor-pointer border rounded-xl p-4 flex justify-between items-center", style: { backgroundColor: theme.white1, borderColor: theme.silver1 }, role: "button", "aria-label": `Buka dokumen ${asset.lecture_sessions_asset_title}`, children: [_jsxs("div", { children: [_jsx("p", { className: "text-base font-medium", style: { color: theme.primary }, children: asset.lecture_sessions_asset_title }), _jsx(FormattedDate, { value: asset.lecture_sessions_asset_created_at, className: "text-base mt-1 text-gray-500 dark:text-white/70" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[14px] font-bold px-2 py-1 rounded", style: badgeStyle, children: label }), _jsx("button", { onClick: (e) => {
                            e.stopPropagation();
                            onDownload(asset.lecture_sessions_asset_file_url, safeFilename);
                        }, className: "p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition", "aria-label": `Unduh ${asset.lecture_sessions_asset_title}`, title: "Unduh", children: _jsx(Download, { size: 16, style: { color: theme.primary } }) })] })] }));
}
/* =========================
   Page
========================= */
export default function MasjidDocsLectureSessions() {
    const { lecture_session_slug = "", slug = "" } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const handleDownload = useCallback((url, filename) => {
        try {
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.rel = "noopener";
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        catch {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    }, []);
    const { data: documents = [], isLoading, isError, error, } = useQuery({
        queryKey: ["lecture-sessions-documents", lecture_session_slug],
        enabled: !!lecture_session_slug,
        staleTime: 5 * 60 * 1000,
        retry: 1,
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-assets/filter-slug`, {
                params: {
                    lecture_session_slug,
                    file_type: "3,4,5,6",
                },
            });
            const payload = res.data?.data ?? res.data;
            return Array.isArray(payload) ? payload : [];
        },
        select: (rows) => [...rows].sort((a, b) => new Date(b.lecture_sessions_asset_created_at).getTime() -
            new Date(a.lecture_sessions_asset_created_at).getTime()),
    });
    return (_jsxs("div", { className: "pb-28 max-w-2xl mx-auto", children: [_jsx(PageHeaderUser, { title: "Dokumen", onBackClick: () => navigate(`/masjid/${slug}/soal-materi/${lecture_session_slug}`) }), isLoading ? (_jsx("div", { className: "mt-6 text-base text-gray-500 dark:text-white/70", children: "Memuat dokumen..." })) : isError ? (_jsxs("div", { className: "mt-6 text-base text-red-500", children: ["Gagal memuat dokumen", error?.response?.data?.message
                        ? `: ${error.response.data.message}`
                        : "."] })) : documents.length === 0 ? (_jsx("div", { className: "mt-6 text-base text-gray-500 dark:text-white/70 text-center", children: "Belum ada dokumen tersedia." })) : (_jsx("div", { className: "space-y-3 mt-4", children: documents.map((doc) => (_jsx(DocItem, { asset: doc, theme: theme, onDownload: handleDownload }, doc.lecture_sessions_asset_id))) }))] }));
}
