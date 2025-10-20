import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "@/lib/axios";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import FormattedDate from "@/constants/formattedDate";
import SimpleTable from "@/components/common/main/SimpleTable";
import { ExternalLink } from "lucide-react";
export default function DKMVideoAudioLecture() {
    const { id: lecture_id } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data: assets = [], isLoading, isError, } = useQuery({
        queryKey: ["video-audio", lecture_id],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-assets/filter`, {
                params: {
                    lecture_id,
                    file_type: "1,2",
                },
            });
            return res.data || [];
        },
        enabled: typeof lecture_id === "string" && lecture_id.length > 10,
        staleTime: 1000 * 60 * 5,
    });
    const columns = ["Jenis", "Judul", "Tanggal", "Aksi"];
    const rows = assets.map((item) => {
        const isYoutube = item.lecture_sessions_asset_file_type_label.toLowerCase() === "youtube";
        const viewElement = isYoutube ? (_jsx("a", { href: item.lecture_sessions_asset_file_url.trim(), target: "_blank", rel: "noopener noreferrer", className: "text-xs underline", style: { color: theme.primary }, children: "Tonton di YouTube" }, item.lecture_sessions_asset_id + "-yt")) : (_jsx("audio", { controls: true, preload: "none", className: "w-full", style: { borderRadius: 8 }, src: item.lecture_sessions_asset_file_url.trim() }, item.lecture_sessions_asset_id + "-audio"));
        const handleEdit = () => {
            navigate(`/dkm/kajian/kajian-detail/${item.lecture_sessions_asset_lecture_session_id}/video-audio`, {
                state: { from: location.pathname },
            });
        };
        return [
            item.lecture_sessions_asset_file_type_label,
            item.lecture_sessions_asset_title,
            _jsx(FormattedDate, { value: item.lecture_sessions_asset_created_at, className: "text-xs" }, item.lecture_sessions_asset_id + "-date"),
            _jsxs("div", { className: "flex items-center gap-2", children: [viewElement, _jsx("button", { onClick: handleEdit, className: "p-1", title: "Kelola Video/Audio", children: _jsx(ExternalLink, { size: 16, style: { color: theme.black1 } }) })] }, item.lecture_sessions_asset_id + "-actions"),
        ];
    });
    return (_jsxs("div", { className: "pb-24 space-y-4", children: [_jsx(PageHeader, { title: "Video & Audio Kajian", onBackClick: () => navigate(-1) }), isLoading && (_jsx("p", { className: "text-sm text-gray-500", children: "Memuat video/audio..." })), isError && (_jsx("p", { className: "text-sm text-red-500", children: "Gagal memuat data video/audio." })), !isLoading && assets.length === 0 && (_jsx("p", { className: "text-sm text-gray-500", children: "Belum ada video atau audio tersedia." })), !isLoading && assets.length > 0 && (_jsx(SimpleTable, { columns: columns, rows: rows, emptyText: "Belum ada video atau audio tersedia." }))] }));
}
