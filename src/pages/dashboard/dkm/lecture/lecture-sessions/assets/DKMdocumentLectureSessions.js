import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useNavigate, useParams } from "react-router-dom";
import ActionEditDelete from "@/components/common/main/MainActionEditDelete";
import toast from "react-hot-toast";
import SimpleTable from "@/components/common/main/SimpleTable";
export default function DKMDocumentLectureSessions() {
    const { id: lecture_session_id } = useParams();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: documents = [], isLoading, isError, } = useQuery({
        queryKey: ["lecture-sessions-documents", lecture_session_id],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-assets/filter?lecture_session_id=${lecture_session_id}&file_type=3,4,5,6`);
            return Array.isArray(res.data) ? res.data : [];
        },
        enabled: !!lecture_session_id,
    });
    const handleDelete = async (doc) => {
        const konfirmasi = confirm("Yakin ingin menghapus dokumen ini?");
        if (!konfirmasi)
            return;
        try {
            await axios.delete(`/api/a/lecture-sessions-assets/${doc.lecture_sessions_asset_id}`);
            toast.success("Dokumen berhasil dihapus");
        }
        catch (error) {
            toast.error("Gagal menghapus dokumen");
        }
    };
    const handleAdd = () => {
        navigate(`/dkm/kajian/kajian-detail/${lecture_session_id}/dokumen/tambah-edit`);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Dokumen", onBackClick: () => navigate(`/dkm/kajian/kajian-detail/${id}`) }), _jsx("div", { className: "rounded-2xl shadow-sm p-2", style: { backgroundColor: theme.white1, color: theme.black1 }, children: _jsx(SimpleTable, { columns: ["No", "Judul", "URL", "Format", "Aksi"], rows: isLoading || isError
                        ? []
                        : documents.map((doc, index) => [
                            index + 1,
                            doc.lecture_sessions_asset_title,
                            _jsx("a", { href: doc.lecture_sessions_asset_file_url, className: "underline", target: "_blank", rel: "noopener noreferrer", style: { color: theme.primary }, children: doc.lecture_sessions_asset_file_url }, doc.lecture_sessions_asset_id),
                            _jsx("span", { className: "px-2 py-1 rounded text-xs font-medium", style: {
                                    backgroundColor: theme.primary2,
                                    color: theme.primary,
                                }, children: doc.lecture_sessions_asset_file_type_label }),
                            _jsx(ActionEditDelete, { showEdit: true, onDelete: () => handleDelete(doc), onEdit: () => navigate(`/dkm/kajian/kajian-detail/${lecture_session_id}/dokumen/tambah-edit/${doc.lecture_sessions_asset_id}`) }),
                        ]), emptyText: isLoading
                        ? "Memuat dokumen..."
                        : isError
                            ? "❌ Gagal memuat dokumen."
                            : "Belum ada dokumen." }) }), _jsx("div", { className: "text-right", children: _jsx("button", { onClick: handleAdd, className: "px-5 py-2 rounded-lg font-semibold", style: { backgroundColor: theme.primary, color: theme.white1 }, children: "+ Tambah Dokumen" }) })] }));
}
