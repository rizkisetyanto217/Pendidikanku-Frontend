import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import { Loader2 } from "lucide-react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
export default function DKMAddEditDocumentLectureSessions() {
    const { id: lecture_session_id, docId } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = Boolean(docId);
    // Fetch dokumen lama saat edit
    useEffect(() => {
        if (isEditMode) {
            axios
                .get(`/api/a/lecture-sessions-assets/${docId}`)
                .then((res) => {
                setTitle(res.data.lecture_sessions_asset_title);
            })
                .catch((err) => {
                console.error("❌ Gagal fetch data dokumen:", err);
                toast.error("Gagal memuat data dokumen.");
            });
        }
    }, [docId, isEditMode]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) {
            toast.error("Judul harus diisi.");
            return;
        }
        const formData = new FormData();
        formData.append("lecture_sessions_asset_title", title);
        formData.append("lecture_sessions_asset_lecture_session_id", lecture_session_id || "");
        if (file) {
            formData.append("lecture_sessions_asset_file_url", file);
        }
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await axios.put(`/api/a/lecture-sessions-assets/${docId}`, formData);
                toast.success("Dokumen berhasil diperbarui!");
            }
            else {
                await axios.post("/api/a/lecture-sessions-assets", formData);
                toast.success("Dokumen berhasil ditambahkan!");
            }
            navigate(`/dkm/kajian/kajian-detail/${lecture_session_id}/dokumen`);
        }
        catch (err) {
            console.error("❌ Gagal simpan dokumen:", err);
            toast.error("Gagal menyimpan dokumen.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: isEditMode ? "Edit Dokumen" : "Tambah Dokumen", onBackClick: () => history.back() }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 text-sm", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1", style: { color: theme.black1 }, children: "Judul Dokumen" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Contoh: Materi PDF Tauhid", className: "w-full px-4 py-2 border rounded-lg", style: {
                                    backgroundColor: theme.white2,
                                    borderColor: theme.primary2,
                                    color: theme.black1,
                                } })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1", style: { color: theme.black1 }, children: "Upload File Dokumen (PDF, DOCX, DLL)" }), _jsx("input", { type: "file", accept: ".pdf,.doc,.docx,.ppt,.pptx", onChange: (e) => setFile(e.target.files?.[0] || null), className: "w-full px-4 py-2 border rounded-lg", style: {
                                    backgroundColor: theme.white2,
                                    borderColor: theme.primary2,
                                    color: theme.black1,
                                } }), isEditMode && !file && (_jsx("p", { className: "mt-1 text-xs italic", style: { color: theme.quaternary }, children: "Biarkan kosong jika tidak ingin mengganti file." }))] }), _jsxs("button", { type: "submit", disabled: isSubmitting, className: `text-sm px-5 py-2 rounded-lg font-semibold flex items-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`, style: { backgroundColor: theme.primary, color: theme.white1 }, children: [isSubmitting && _jsx(Loader2, { className: "animate-spin", size: 16 }), isEditMode ? "Simpan Perubahan" : "Simpan Dokumen"] })] })] }));
}
