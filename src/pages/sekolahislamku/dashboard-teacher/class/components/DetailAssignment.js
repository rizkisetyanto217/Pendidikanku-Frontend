import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/assignment/DetailAssignment.tsx
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Calendar, Clock, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ModalAddAssignmentClass from "./ModalAddAssignmentClass";
import ModalEditAssignmentClass from "./ModalEditAssignmentClass";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
const fmtDateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })
    : "-";
export default function DetailAssignment() {
    const { id: assignmentId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // data awal dari state (kalau navigasi dari list)
    const initial = state?.assignment;
    const [data, setData] = useState(initial ?? null);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const handleDelete = async () => {
        const title = data?.title ?? assignmentId;
        const res = await Swal.fire({
            title: "Hapus Tugas?",
            text: `Apakah Anda yakin ingin menghapus tugas "${title}"?`,
            icon: "warning",
            iconColor: palette.warning1, // override spesifik (opsional)
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });
        if (!res.isConfirmed)
            return;
        // TODO: panggil API delete
        await Swal.fire({
            title: "Terhapus!",
            text: "Tugas berhasil dihapus.",
            icon: "success",
            iconColor: palette.success1,
            confirmButtonText: "OK",
        });
        navigate("..");
    };
    const handleEditSubmit = (p) => {
        // TODO: API update
        setData((prev) => ({
            ...(prev ?? {}),
            ...p,
        }));
        setShowEdit(false);
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Tugas", gregorianDate: new Date().toISOString() }), _jsx(ModalEditAssignmentClass, { open: showEdit, onClose: () => setShowEdit(false), palette: palette, defaultValues: {
                    title: data?.title,
                    dueDate: data?.dueDate,
                    total: data?.total,
                    submitted: data?.submitted,
                }, onSubmit: handleEditSubmit }), _jsx(ModalAddAssignmentClass, { open: showAdd, onClose: () => setShowAdd(false), palette: palette, onSubmit: (payload) => {
                    // contoh: tambah subtugas/penugasan baru terkait
                    console.log("Tambah sub-tugas:", payload);
                    setShowAdd(false);
                } }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx("aside", { className: "lg:w-64 mb-6 lg:mb-0 lg:sticky lg:top-16 shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold text-lg", children: [_jsx("button", { onClick: () => navigate(-1), className: "inline-flex items-center justify-center rounded-full p-1 hover:opacity-80", "aria-label": "Kembali", title: "Kembali", children: _jsx(ArrowLeft, { size: 20, strokeWidth: 3 }) }), _jsx("span", { children: "Detail Tugas" })] }), _jsxs(Btn, { palette: palette, size: "sm", variant: "white1", onClick: () => setShowAdd(true), children: [_jsx(Plus, { size: 16, className: "mr-1" }), " Tambah Tugas"] })] }), _jsxs(SectionCard, { palette: palette, className: "p-4 space-y-4", children: [_jsx("div", { className: "font-bold text-xl", children: data?.title ?? `Tugas ${assignmentId}` }), _jsxs("div", { className: "text-sm space-y-1", style: { color: palette.black2 }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { size: 16 }), _jsxs("span", { children: ["Batas: ", fmtDateLong(data?.dueDate)] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { size: 16 }), _jsxs("span", { children: ["Terkumpul: ", data?.submitted ?? 0, "/", data?.total ?? 0] })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Btn, { palette: palette, size: "sm", onClick: () => navigate(`../${assignmentId}/score`, {
                                                        state: { assignment: data }, // biar TaskScore bisa tampilkan judul, dll.
                                                    }), children: "Nilai" }), _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: () => setShowEdit(true), children: "Edit" }), _jsx(Btn, { palette: palette, size: "sm", variant: "destructive", onClick: handleDelete, children: "Hapus" })] }), !data && (_jsxs("div", { className: "text-sm", style: { color: palette.silver2 }, children: ["Data tidak dikirim via state. Sambungkan ", _jsx("em", { children: "fetch by ID" }), " ", "di sini (gunakan ", _jsx("code", { children: assignmentId }), ") bila perlu."] }))] })] })] }) })] }));
}
