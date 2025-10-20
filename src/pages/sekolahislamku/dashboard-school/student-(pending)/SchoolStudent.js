import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/students/StudentsPage.tsx
/* ================= Imports ================= */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "../../components/home/ParentSideBar";
import TambahSiswa from "./modal/AddStudent";
import UploadFileSiswa from "./modal/UploadFileStudent";
import { UserPlus, Upload, ArrowLeft, Eye, Edit3, Trash2, X, } from "lucide-react";
/* ================= Helpers ================= */
const genderLabel = (g) => g === "L" ? "Laki-laki" : g === "P" ? "Perempuan" : "-";
const hijriWithWeekday = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
/* ================= Dummy Data ================= */
const DUMMY_STUDENTS = [
    {
        id: "s1",
        nis: "202301",
        name: "Ahmad Fauzi",
        class_name: "1A",
        gender: "L",
        parent_name: "Bapak Fauzan",
        phone: "081234567890",
        email: "ahmad.fauzi@example.com",
        status: "aktif",
    },
    {
        id: "s2",
        nis: "202302",
        name: "Siti Nurhaliza",
        class_name: "1B",
        gender: "P",
        parent_name: "Ibu Rahma",
        phone: "081298765432",
        email: "siti.nurhaliza@example.com",
        status: "aktif",
    },
];
/* ================= Modals ================= */
function StudentDetailModal({ open, onClose, student, palette, }) {
    if (!open || !student)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 grid place-items-center", style: { background: "rgba(0,0,0,.35)" }, onClick: onClose, children: _jsxs("div", { className: "w-[min(480px,95vw)] rounded-2xl shadow-xl p-5", onClick: (e) => e.stopPropagation(), style: { background: palette.white1, color: palette.black1 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold text-lg", children: "Detail Siswa" }), _jsx("button", { className: "p-1 rounded-lg", onClick: onClose, style: { color: palette.black2 }, children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Nama:" }), " ", student.name] }), _jsxs("div", { children: [_jsx("strong", { children: "NIS:" }), " ", student.nis ?? "-"] }), _jsxs("div", { children: [_jsx("strong", { children: "Kelas:" }), " ", student.class_name ?? "-"] }), _jsxs("div", { children: [_jsx("strong", { children: "JK:" }), " ", genderLabel(student.gender)] }), _jsxs("div", { children: [_jsx("strong", { children: "Orang Tua:" }), " ", student.parent_name ?? "-"] }), _jsxs("div", { children: [_jsx("strong", { children: "Kontak:" }), " ", student.phone ?? "-", " |", " ", student.email ?? "-"] }), _jsx("div", { children: _jsx(Badge, { palette: palette, variant: student.status === "aktif"
                                    ? "success"
                                    : student.status === "nonaktif"
                                        ? "warning"
                                        : "info", children: student.status }) })] })] }) }));
}
function StudentEditModal({ open, onClose, onSave, palette, student, }) {
    const [form, setForm] = useState(student ?? {
        id: "",
        nis: "",
        name: "",
        class_name: "",
        gender: "L",
        parent_name: "",
        phone: "",
        email: "",
        status: "aktif",
    });
    useMemo(() => {
        if (student)
            setForm(student);
    }, [student]);
    if (!open)
        return null;
    const handleSave = () => {
        if (!form.name)
            return;
        onSave(form);
        onClose();
    };
    const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));
    return (_jsx("div", { className: "fixed inset-0 z-50 grid place-items-center", style: { background: "rgba(0,0,0,.35)" }, onClick: onClose, children: _jsxs("div", { className: "w-[min(500px,95vw)] rounded-2xl shadow-xl p-5", onClick: (e) => e.stopPropagation(), style: { background: palette.white1, color: palette.black1 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold text-lg", children: "Edit Siswa" }), _jsx("button", { className: "p-1 rounded-lg", onClick: onClose, style: { color: palette.black2 }, children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "grid gap-3 text-sm", children: [_jsx("input", { placeholder: "Nama", value: form.name, onChange: (e) => set("name", e.target.value), className: "border px-3 py-2 rounded-lg", style: { borderColor: palette.silver1 } }), _jsx("input", { placeholder: "NIS", value: form.nis, onChange: (e) => set("nis", e.target.value), className: "border px-3 py-2 rounded-lg", style: { borderColor: palette.silver1 } }), _jsx("input", { placeholder: "Kelas", value: form.class_name, onChange: (e) => set("class_name", e.target.value), className: "border px-3 py-2 rounded-lg", style: { borderColor: palette.silver1 } }), _jsxs("select", { value: form.status, onChange: (e) => set("status", e.target.value), className: "border px-3 py-2 rounded-lg", style: { borderColor: palette.silver1 }, children: [_jsx("option", { value: "aktif", children: "Aktif" }), _jsx("option", { value: "nonaktif", children: "Nonaktif" }), _jsx("option", { value: "alumni", children: "Alumni" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, onClick: handleSave, children: "Simpan" })] })] }) }));
}
/* ================= Main Component ================= */
const StudentsPage = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { data: user } = useCurrentUser();
    const [openAdd, setOpenAdd] = useState(false);
    const [openImport, setOpenImport] = useState(false);
    const [students, setStudents] = useState(DUMMY_STUDENTS);
    const [detail, setDetail] = useState(null);
    const [edit, setEdit] = useState(null);
    const handleDelete = (s) => {
        if (!confirm(`Hapus siswa ${s.name}?`))
            return;
        setStudents((prev) => prev.filter((x) => x.id !== s.id));
    };
    const handleSaveEdit = (s) => {
        setStudents((prev) => prev.map((x) => (x.id === s.id ? { ...s } : x)));
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(TambahSiswa, { open: openAdd, onClose: () => setOpenAdd(false), palette: palette, classes: ["1A", "1B", "2A"] }), _jsx(UploadFileSiswa, { open: openImport, onClose: () => setOpenImport(false), palette: palette }), _jsx(StudentDetailModal, { open: !!detail, onClose: () => setDetail(null), student: detail, palette: palette }), _jsx(StudentEditModal, { open: !!edit, onClose: () => setEdit(null), student: edit, onSave: handleSaveEdit, palette: palette }), _jsx(ParentTopBar, { palette: palette, title: "Siswa", hijriDate: hijriWithWeekday(new Date().toISOString()), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "  md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { className: "cursor-pointer", size: 20 }) }), _jsx("h1", { className: "font-semibold text-lg", children: "Data Siswa" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Btn, { onClick: () => setOpenImport(true), size: "sm", palette: palette, variant: "outline", className: "flex items-center gap-1.5 text-xs sm:text-sm", children: [_jsx(Upload, { size: 14 }), " Import CSV"] }), _jsxs(Btn, { onClick: () => setOpenAdd(true), size: "sm", palette: palette, className: "flex items-center gap-1.5 text-xs sm:text-sm", children: [_jsx(UserPlus, { size: 14 }), " Tambah Siswa"] })] })] }), _jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-[800px] w-full text-sm border-collapse", children: [_jsx("thead", { style: { color: palette.black2 }, children: _jsxs("tr", { className: "border-b", style: { borderColor: palette.silver1 }, children: [_jsx("th", { className: "py-3 px-4 text-left", children: "NIS" }), _jsx("th", { className: "py-3 px-4 text-left", children: "Nama" }), _jsx("th", { className: "py-3 px-4 text-left", children: "Kelas" }), _jsx("th", { className: "py-3 px-4 text-left", children: "Status" }), _jsx("th", { className: "py-3 px-4 text-right", children: "Aksi" })] }) }), _jsx("tbody", { children: students.map((s) => (_jsxs("tr", { className: "border-b hover:bg-black/5 transition-colors", style: { borderColor: palette.silver1 }, children: [_jsx("td", { className: "py-3 px-4", children: s.nis }), _jsx("td", { className: "py-3 px-4", children: s.name }), _jsx("td", { className: "py-3 px-4", children: s.class_name }), _jsx("td", { className: "py-3 px-4", children: _jsx(Badge, { palette: palette, variant: s.status === "aktif"
                                                                        ? "success"
                                                                        : s.status === "nonaktif"
                                                                            ? "warning"
                                                                            : "info", children: s.status }) }), _jsx("td", { className: "py-3 px-4", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Btn, { size: "sm", variant: "ghost", palette: palette, onClick: () => setDetail(s), children: _jsx(Eye, { size: 16 }) }), _jsx(Btn, { size: "sm", variant: "ghost", palette: palette, onClick: () => setEdit(s), children: _jsx(Edit3, { size: 16 }) }), _jsx(Btn, { size: "sm", variant: "ghost", palette: palette, onClick: () => handleDelete(s), children: _jsx(Trash2, { size: 16 }) })] }) })] }, s.id))) })] }) }) })] })] }) })] }));
};
export default StudentsPage;
