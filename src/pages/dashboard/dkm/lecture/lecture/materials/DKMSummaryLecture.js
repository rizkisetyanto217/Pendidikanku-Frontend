import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import axios from "@/lib/axios";
import SimpleTable from "@/components/common/main/SimpleTable";
import { ExternalLink } from "lucide-react";
export default function DKMSummaryLecture() {
    const { id } = useParams(); // lecture_id
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const location = useLocation();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["lecture-sessions-summary", id],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-materials/filter?lecture_id=${id}&type=summary`);
            return res.data.data;
        },
        enabled: !!id,
    });
    const columns = ["No", "Judul", "Deskripsi", "Status", "Aksi"];
    const rows = data?.map((item, index) => [
        index + 1,
        item.lecture_sessions_material_title,
        item.lecture_sessions_material_summary || "-",
        _jsx("span", { className: "px-2 py-1 text-xs rounded-full font-semibold", style: {
                backgroundColor: "#DEF7EC",
                color: "#03543F",
            }, children: "Aktif" }, `status-${item.lecture_sessions_material_id}`),
        _jsx("button", { className: "p-1", onClick: (e) => {
                e.stopPropagation();
                const sessionId = item.lecture_sessions_material_lecture_session_id;
                if (sessionId) {
                    navigate(`/dkm/kajian/kajian-detail/${sessionId}/ringkasan`, {
                        state: { from: location.pathname },
                    });
                }
                else {
                    alert("ID sesi kajian tidak ditemukan.");
                }
            }, children: _jsx(ExternalLink, { size: 16, style: { color: theme.black1 } }) }, `btn-${item.lecture_sessions_material_id}`),
    ]) || [];
    return (_jsxs("div", { className: "space-y-6 pb-24", children: [_jsx(PageHeader, { title: "Ringkasan Kajian", backTo: `/dkm/tema/tema-detail/${id}` }), isLoading ? (_jsx("p", { className: "text-sm text-gray-500", children: "Memuat data ringkasan..." })) : isError ? (_jsx("p", { className: "text-sm text-red-500", children: "Gagal memuat data ringkasan." })) : (_jsx(SimpleTable, { columns: columns, rows: rows, emptyText: "Belum ada ringkasan kajian tersedia." }))] }));
}
