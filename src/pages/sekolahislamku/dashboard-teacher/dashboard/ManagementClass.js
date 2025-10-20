import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { Btn, SectionCard, } from "@/pages/sekolahislamku/components/ui/Primitives";
// ⬇️ Sesuaikan path import sesuai struktur project
import { ArrowLeft, Users, BookOpen, Calendar } from "lucide-react";
import ParentTopBar from "../../components/home/ParentTopBar";
import ParentSidebar from "../../components/home/ParentSideBar";
import ModalEditManagementClass from "./ModalEditManagementClass";
import AddStudent from "./AddStudent";
import Swal from "sweetalert2";
const ManagementClass = () => {
    const { className } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const info = location.state;
    const currentDate = new Date().toISOString();
    //   state modal edit
    // ✨ state tampilan lokal (tidak mendeklarasikan sumber data baru)
    const [overrides, setOverrides] = useState(null);
    const view = useMemo(() => {
        return {
            className: overrides?.className ?? info?.className ?? String(className ?? ""),
            students: typeof overrides?.students === "number"
                ? overrides?.students
                : typeof info?.students === "number"
                    ? info?.students
                    : undefined,
            lastSubject: overrides?.lastSubject ?? info?.lastSubject ?? undefined,
        };
    }, [overrides, info, className]);
    const [editOpen, setEditOpen] = useState(false);
    //   state add student
    const [openAdd, setOpenAdd] = useState(false);
    //   state delete
    const handleDeleteClass = async () => {
        const res = await Swal.fire({
            title: "Hapus kelas?",
            text: `Kelas “${view.className || className}” akan dihapus.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
            confirmButtonColor: palette.error1, // warnanya mengikuti tema
            cancelButtonColor: palette.silver2,
            background: palette.white1,
            color: palette.black1,
        });
        if (!res.isConfirmed)
            return;
        try {
            // (opsional) tampilkan loading
            await Swal.fire({
                title: "Menghapus…",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
                showConfirmButton: false,
                background: palette.white1,
            });
            // TODO: panggil API penghapusan di sini
            // await axios.delete(`/api/kelas/${idKelas}`);
            // sukses
            await Swal.fire({
                title: "Terhapus",
                text: "Kelas berhasil dihapus.",
                icon: "success",
                timer: 1400,
                showConfirmButton: false,
                background: palette.white1,
                color: palette.black1,
            });
            // misal balik ke halaman sebelumnya
            navigate(-1);
        }
        catch (e) {
            await Swal.fire({
                title: "Gagal menghapus",
                text: e?.message ?? "Terjadi kesalahan saat menghapus kelas.",
                icon: "error",
                confirmButtonText: "Tutup",
                background: palette.white1,
                color: palette.black1,
            });
        }
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Manajemen Kelas", gregorianDate: currentDate, showBack: true }), _jsx(ModalEditManagementClass, { open: editOpen, onClose: () => setEditOpen(false), palette: palette, title: "Edit Kelas", defaultValue: {
                    className: view.className,
                    students: view.students,
                    lastSubject: view.lastSubject,
                }, onSubmit: (val) => {
                    // di sini bisa dihubungkan ke backend (PUT) bila perlu
                    setOverrides(val);
                } }), _jsx(AddStudent, { open: openAdd, onClose: () => setOpenAdd(false), palette: palette, onSubmit: (val) => {
                    console.log("Student added:", val);
                } }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: "gap-1", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Pengelolaan Kelas" })] }), _jsxs(SectionCard, { palette: palette, className: "overflow-hidden", children: [_jsx("div", { className: "px-6 py-4 border-b", style: {
                                                background: `linear-gradient(135deg, ${palette.primary2}15, ${palette.primary2}10)`,
                                                borderColor: `${palette.black1}10`,
                                            }, children: _jsxs("h2", { className: "text-lg font-semibold flex items-center gap-2", children: [_jsx(BookOpen, { size: 20 }), "Informasi Kelas"] }) }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-medium opacity-80", children: [_jsx("div", { className: "w-2 h-2 rounded-full", style: {
                                                                                background: palette.primary2,
                                                                                color: palette.black2,
                                                                            } }), "NAMA KELAS"] }), _jsx("p", { className: "text-xl font-bold", children: info?.className ?? String(className) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-medium opacity-80", style: { color: palette.black2 }, children: [_jsx(Users, { size: 12 }), "JUMLAH SISWA"] }), _jsx("p", { className: "text-xl font-bold flex items-center gap-2", style: { color: palette.black2 }, children: typeof info?.students === "number" ? (_jsxs(_Fragment, { children: [info?.students, _jsx("span", { className: "text-sm font-normal opacity-80", style: { color: palette.black2 }, children: "siswa" })] })) : (_jsx("span", { className: "text-base opacity-60", children: "Tidak ada data" })) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-medium opacity-80", style: { color: palette.black2 }, children: [_jsx(Calendar, { size: 12 }), "PELAJARAN TERAKHIR"] }), _jsx("p", { className: "text-lg font-semibold", children: info?.lastSubject ?? (_jsx("span", { className: "opacity-60 font-normal", children: "Belum ada pelajaran" })) })] })] }), _jsx("div", { className: "my-6 h-px ", style: { background: `${palette.black1}10` } }), _jsxs("div", { className: "flex flex-wrap gap-3 justify-end ", children: [_jsx(Btn, { palette: palette, variant: "white1", onClick: () => setOpenAdd(true), className: "px-6 py-2 font-medium transition-all duration-200 hover:scale-105", children: "Tambah Siswa" }), _jsx(Btn, { variant: "ghost", palette: palette, onClick: () => setEditOpen(true), className: "px-6 py-2 font-medium transition-all duration-200 hover:scale-105", children: "Edit Kelas" }), _jsx(Btn, { variant: "destructive", palette: palette, onClick: handleDeleteClass, className: "px-6 py-2 font-medium transition-all duration-200 hover:scale-105", children: "Hapus Kelas" })] })] })] }), _jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [_jsxs(SectionCard, { palette: palette, className: "p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { background: palette.black2 } }), "Statistik Singkat"] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center py-2", style: { color: palette.black2 }, children: [_jsx("span", { className: "text-sm opacity-90", children: "Status Kelas" }), _jsx("span", { className: "px-3 py-1 rounded-full text-xs font-medium", style: {
                                                                        background: `${palette.primary2}20`,
                                                                        color: palette.black2,
                                                                    }, children: "Aktif" })] }), _jsxs("div", { className: "flex justify-between items-center py-2", children: [_jsx("span", { className: "text-sm opacity-90", style: { color: palette.black2 }, children: "Kehadiran Hari Ini" }), _jsx("span", { className: "font-medium", children: "-" })] }), _jsxs("div", { className: "flex justify-between items-center py-2", style: { color: palette.black2 }, children: [_jsx("span", { className: "text-sm opacity-90", children: "Tugas Pending" }), _jsx("span", { className: "font-medium", children: "-" })] })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: {
                                                                background: palette.primary2,
                                                                color: palette.black2,
                                                            } }), "Aksi Cepat"] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { className: "w-full text-left p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]", style: {
                                                                background: `${palette.primary2}05`,
                                                                border: `1px solid ${palette.primary2}20`,
                                                            }, onClick: () => alert("Lihat daftar siswa"), children: [_jsx("div", { className: "font-medium", children: "Lihat Daftar Siswa" }), _jsx("div", { className: "text-xs opacity-90 mt-1", style: { color: palette.black2 }, children: "Kelola data siswa dalam kelas" })] }), _jsxs("button", { className: "w-full text-left p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]", style: {
                                                                background: `${palette.primary2}05`,
                                                                border: `1px solid ${palette.primary2}20`,
                                                            }, onClick: () => alert("Buat jadwal"), children: [_jsx("div", { className: "font-medium", children: "Atur Jadwal Pelajaran" }), _jsx("div", { className: "text-xs opacity-90 mt-1", style: { color: palette.black2 }, children: "Kelola jadwal mata pelajaran" })] })] })] })] })] })] }) })] }));
};
export default ManagementClass;
