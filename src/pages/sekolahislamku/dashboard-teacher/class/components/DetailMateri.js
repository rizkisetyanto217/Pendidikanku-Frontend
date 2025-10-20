import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { ArrowLeft, Calendar, Paperclip } from "lucide-react";
import ModalEditMateri from "./ModalEditMateri";
import Swal from "sweetalert2";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    : "-";
export default function DetailMateri() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { id: classId, materialId } = useParams();
    const { state } = useLocation();
    const { material: incoming, className } = (state ?? {});
    const material = useMemo(() => {
        if (incoming && (!materialId || incoming.id === materialId))
            return incoming;
        return incoming ?? null;
    }, [incoming, materialId]);
    const [openEdit, setOpenEdit] = useState(false);
    const handleSubmitEditMateri = (p) => {
        if (material) {
            material.title = p.title;
            material.date = p.date;
            material.attachments = p.attachments;
            material.content = p.content;
        }
        setOpenEdit(false);
    };
    /** 🔹 hapus dengan sweetalert */
    const handleDelete = async () => {
        if (!material)
            return;
        const result = await Swal.fire({
            title: "Hapus Materi?",
            text: `Apakah Anda yakin ingin menghapus materi "${material.title}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });
        if (result.isConfirmed) {
            // TODO: panggil API delete pakai material.id
            await Swal.fire("Terhapus!", "Materi berhasil dihapus.", "success");
            navigate(-1);
        }
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ModalEditMateri, { open: openEdit, onClose: () => setOpenEdit(false), palette: palette, defaultValues: {
                    title: material?.title,
                    date: material?.date,
                    attachments: material?.attachments,
                    content: material?.content,
                }, onSubmit: handleSubmitEditMateri, onDelete: handleDelete }), _jsx(ParentTopBar, { palette: palette, title: material?.title || "Detail Materi", gregorianDate: new Date().toISOString() }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx("aside", { className: "lg:w-64 mb-6 lg:mb-0 lg:sticky lg:top-16 shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold text-lg", children: [_jsx("button", { onClick: () => navigate(-1), className: "inline-flex items-center justify-center rounded-full p-1 hover:opacity-80", "aria-label": "Kembali", title: "Kembali", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("span", { children: "Detail Materi" }), className && (_jsx(Badge, { palette: palette, variant: "outline", children: className }))] }), _jsx(SectionCard, { palette: palette, className: "p-4 md:p-5", children: material ? (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "text-xl font-semibold", children: material.title }), _jsxs("div", { className: "text-sm flex flex-wrap items-center gap-3", style: { color: palette.black2 }, children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Calendar, { size: 16 }), " ", dateLong(material.date)] }), typeof material.attachments === "number" && (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Paperclip, { size: 16 }), " ", material.attachments, " lampiran"] }))] }), _jsx("div", { className: "rounded-xl p-3", style: {
                                                    background: palette.white2,
                                                    border: `1px solid ${palette.silver1}`,
                                                    color: palette.black1,
                                                }, children: material.content ? (_jsx("div", { className: "prose max-w-none", children: material.content })) : (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Belum ada konten materi." })) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Btn, { palette: palette, size: "sm", onClick: () => setOpenEdit(true), children: "Edit" }), _jsx(Btn, { palette: palette, size: "sm", variant: "destructive", onClick: handleDelete, children: "Hapus" })] })] })) : (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Materi tidak ditemukan." })) })] })] }) })] }));
}
