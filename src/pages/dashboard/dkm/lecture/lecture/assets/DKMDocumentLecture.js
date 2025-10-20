import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import SimpleTable from "@/components/common/main/SimpleTable";
import FormattedDate from "@/constants/formattedDate";
import { ExternalLink } from "lucide-react";
export default function DKMDocumentLecture() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { id: lecture_id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["lecture-documents", lecture_id],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-assets/filter?lecture_id=${lecture_id}&file_type=3,4,5,6`);
            return res.data;
        },
        enabled: !!lecture_id,
        staleTime: 5 * 60 * 1000,
    });
    const columns = ["No", "Judul", "Tipe", "Tanggal", "Aksi"];
    const rows = data?.map((item, index) => [
        index + 1,
        item.lecture_sessions_asset_title,
        item.lecture_sessions_asset_file_type_label,
        _jsx(FormattedDate, { value: item.lecture_sessions_asset_created_at }, item.lecture_sessions_asset_id),
        _jsx("button", { onClick: (e) => {
                e.stopPropagation();
                navigate(`/dkm/kajian/kajian-detail/${item.lecture_sessions_asset_lecture_session_id}/dokumen`, {
                    state: { from: location.pathname },
                });
            }, className: "p-1", children: _jsx(ExternalLink, { size: 16, style: { color: theme.black1 } }) }, item.lecture_sessions_asset_id + "_action"),
    ]) || [];
    const handleRowClick = (index) => {
        const selected = data?.[index];
        if (!selected)
            return;
        navigate(`/dkm/kajian/kajian-detail/${selected.lecture_sessions_asset_lecture_session_id}/dokumen`);
    };
    return (_jsxs("div", { className: "pb-24", children: [_jsx(PageHeader, { title: "Dokumen Kajian", onBackClick: () => navigate(-1) }), isLoading ? (_jsx("p", { className: "text-sm text-gray-500", children: "Memuat data dokumen..." })) : isError ? (_jsx("p", { className: "text-sm text-red-500", children: "Gagal memuat data dokumen." })) : (_jsx(SimpleTable, { columns: columns, rows: rows, onRowClick: handleRowClick, emptyText: "Belum ada dokumen tersedia." }))] }));
}
