import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/AssignmentClass.tsx
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { CalendarDays, ChevronRight, ArrowLeft, Plus, Search, Filter, Download, } from "lucide-react";
import { QK, fetchAssignmentsByClass, } from "../types/assignments";
import ModalEditAssignmentClass from "./ModalEditAssignmentClass";
import Swal from "sweetalert2";
import ModalAddAssignmentClass from "./ModalAddAssignmentClass";
async function fetchTeacherClasses() {
    const now = new Date();
    const mk = (d, addDay = 0) => {
        const x = new Date(d);
        x.setDate(x.getDate() + addDay);
        return x.toISOString();
    };
    return Promise.resolve([
        {
            id: "tpa-a",
            name: "TPA A",
            room: "Aula 1",
            homeroom: "Ustadz Abdullah",
            assistants: ["Ustadzah Amina"],
            studentsCount: 22,
            todayAttendance: { hadir: 18, online: 1, sakit: 1, izin: 1, alpa: 1 },
            nextSession: {
                dateISO: mk(now, 0),
                time: "07:30",
                title: "Tahsin — Tajwid & Makhraj",
                room: "Aula 1",
            },
            materialsCount: 12,
            assignmentsCount: 4,
            academicTerm: "2025/2026 — Ganjil",
            cohortYear: 2025,
        },
        {
            id: "tpa-b",
            name: "TPA B",
            room: "R. Tahfiz",
            homeroom: "Ustadz Salman",
            assistants: ["Ustadzah Maryam"],
            studentsCount: 20,
            todayAttendance: { hadir: 15, online: 2, sakit: 1, izin: 1, alpa: 1 },
            nextSession: {
                dateISO: mk(now, 1),
                time: "09:30",
                title: "Hafalan Juz 30",
                room: "R. Tahfiz",
            },
            materialsCount: 9,
            assignmentsCount: 3,
            academicTerm: "2025/2026 — Ganjil",
            cohortYear: 2025,
        },
    ]);
}
/* ========= Helpers ========= */
const toLocalNoonISO = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x.toISOString();
};
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    : "-";
const dateShort = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
    })
    : "-";
/* ========= Page ========= */
export default function AssignmentClass() {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const qc = useQueryClient();
    // kelas
    const { data: classes = [] } = useQuery({
        queryKey: QK.CLASSES,
        queryFn: fetchTeacherClasses,
        staleTime: 5 * 60_000,
    });
    const cls = useMemo(() => classes.find((c) => c.id === id), [classes, id]);
    // assignments
    const { data: assignments = [], isFetching } = useQuery({
        queryKey: QK.ASSIGNMENTS(id),
        queryFn: () => fetchAssignmentsByClass(id),
        enabled: !!id,
        staleTime: 2 * 60_000,
    });
    // filter & search
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const filtered = useMemo(() => {
        let list = assignments;
        if (status !== "all")
            list = list.filter((a) => a.status === status);
        const qq = q.trim().toLowerCase();
        if (qq) {
            list = list.filter((a) => a.title.toLowerCase().includes(qq) ||
                (a.description ?? "").toLowerCase().includes(qq));
        }
        return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }, [assignments, q, status]);
    const todayISO = toLocalNoonISO(new Date());
    /* ========= Modal state ========= */
    const [openEdit, setOpenEdit] = useState(false);
    const [editing, setEditing] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const onEdit = (a) => {
        setEditing(a);
        setOpenEdit(true);
    };
    const editDefaults = useMemo(() => {
        if (!editing)
            return undefined;
        return {
            title: editing.title,
            dueDate: editing.dueDate,
            total: editing.totalSubmissions ?? 0,
            submitted: editing.totalSubmissions,
        };
    }, [editing]);
    const handleEditSubmit = (payload) => {
        qc.setQueryData(QK.ASSIGNMENTS(id), (old = []) => old.map((a) => a.id !== editing?.id
            ? a
            : {
                ...a,
                title: payload.title.trim(),
                dueDate: payload.dueDate || a.dueDate,
                totalSubmissions: payload.submitted ?? payload.total ?? a.totalSubmissions,
            }));
        setOpenEdit(false);
        setEditing(null);
    };
    const handleDelete = async (a) => {
        const res = await Swal.fire({
            title: "Hapus tugas?",
            text: `"${a.title}" akan dihapus.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            background: palette.white1,
            color: palette.black1,
            confirmButtonColor: palette.destructive ?? "#ef4444",
            cancelButtonColor: palette.primary,
        });
        if (!res.isConfirmed)
            return;
        qc.setQueryData(QK.ASSIGNMENTS(id), (old = []) => old.filter((x) => x.id !== a.id));
        await Swal.fire({
            title: "Terhapus",
            text: "Tugas berhasil dihapus.",
            icon: "success",
            timer: 1400,
            showConfirmButton: false,
            background: palette.white1,
            color: palette.black1,
        });
    };
    const handleAddSubmit = (payload) => {
        const nowISO = new Date().toISOString();
        const newItem = {
            id: `a-${Date.now()}`,
            title: payload.title,
            description: "",
            createdAt: nowISO,
            dueDate: payload.dueDate,
            status: "draft",
            totalSubmissions: payload.total ?? 0,
            graded: 0,
            attachments: [],
            author: cls?.homeroom ?? "Guru",
        };
        qc.setQueryData(QK.ASSIGNMENTS(id), (old = []) => [
            newItem,
            ...old,
        ]);
        setOpenAdd(false);
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: cls ? `Tugas: ${cls.name}` : "Tugas Kelas", gregorianDate: todayISO, hijriDate: new Date().toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }), showBack: true }), _jsx(ModalEditAssignmentClass, { open: openEdit, onClose: () => {
                    setOpenEdit(false);
                    setEditing(null);
                }, palette: palette, defaultValues: editDefaults, onSubmit: handleEditSubmit }), _jsx(ModalAddAssignmentClass, { open: openAdd, onClose: () => setOpenAdd(false), palette: palette, onSubmit: handleAddSubmit }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-8 min-w-0", children: [_jsxs("div", { className: "md:flex hidden items-center gap-4", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: "gap-2", children: _jsx(ArrowLeft, { size: 18 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Tugas Kelas" })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-6 md:p-8 flex items-start justify-between gap-6", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "text-xl md:text-2xl font-semibold mb-3", children: cls?.name ?? "—" }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-sm", style: { color: palette.black2 }, children: [_jsx(Badge, { variant: "outline", palette: palette, className: "px-3 py-1", children: cls?.room ?? "-" }), _jsxs("span", { children: ["Wali Kelas: ", cls?.homeroom ?? "-"] }), _jsxs("span", { children: ["\u2022 ", cls?.academicTerm ?? "-"] }), _jsxs("span", { children: ["\u2022 Angkatan ", cls?.cohortYear ?? "-"] })] })] }), _jsx(Btn, { palette: palette, variant: "ghost", size: "sm", onClick: () => setOpenAdd(true), className: "gap-2", children: _jsx(Plus, { size: 16 }) })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex items-center gap-3 rounded-lg border px-4 h-12", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx(Search, { size: 18, style: { color: palette.black2 } }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari tugas\u2026", className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 } })] }), _jsxs("label", { className: "flex items-center gap-3 rounded-lg border px-4 h-12", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx(Filter, { size: 18, style: { color: palette.black2 } }), _jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 }, children: [_jsx("option", { value: "all", children: "Semua status" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "terbit", children: "Terbit" }), _jsx("option", { value: "selesai", children: "Selesai" })] })] })] }) }), _jsxs("div", { className: "grid gap-6", children: [isFetching && filtered.length === 0 && (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-8 text-sm text-center", style: { color: palette.silver2 }, children: "Memuat tugas\u2026" }) })), filtered.map((a) => {
                                            const dueBadge = a.dueDate
                                                ? new Date(a.dueDate).toDateString() ===
                                                    new Date().toDateString()
                                                    ? "Hari ini"
                                                    : dateShort(a.dueDate)
                                                : null;
                                            return (_jsxs(SectionCard, { palette: palette, className: "hover:shadow-md transition-shadow overflow-hidden", children: [_jsx("div", { className: "p-6 md:p-8", children: _jsx("div", { className: "flex items-start justify-between gap-6 mb-4", children: _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "text-lg font-semibold truncate", style: { color: palette.black2 }, children: a.title }), _jsx(Badge, { palette: palette, variant: a.status === "terbit"
                                                                                    ? "success"
                                                                                    : a.status === "draft"
                                                                                        ? "secondary"
                                                                                        : "warning", className: "h-6 px-3", children: a.status.toUpperCase() }), dueBadge && (_jsxs(Badge, { palette: palette, variant: "outline", className: "h-6 px-3", children: ["tempo: ", dueBadge] }))] }), a.description && (_jsx("p", { className: "text-sm mb-4 line-clamp-2", style: { color: palette.black2 }, children: a.description })), _jsxs("div", { className: "flex flex-wrap items-center gap-4 text-xs", style: { color: palette.black2 }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CalendarDays, { size: 14 }), _jsxs("span", { children: ["Dibuat: ", dateLong(a.createdAt)] })] }), a.author && _jsxs("span", { children: ["\u2022 Oleh ", a.author] }), (a.totalSubmissions ?? 0) > 0 && (_jsxs("span", { children: ["\u2022 ", a.totalSubmissions, " pengumpulan"] })), a.attachments?.length ? (_jsxs("span", { children: ["\u2022 ", a.attachments.length, " lampiran"] })) : null] })] }) }) }), _jsxs("div", { className: "px-6 md:px-8 pb-6 md:pb-8 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "text-xs", style: { color: palette.black2 }, children: "Aksi cepat untuk tugas ini" }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => window.alert("Unduh belum diimplementasikan"), className: "gap-2", children: [_jsx(Download, { size: 16 }), "Unduh"] }), _jsx(Link, { to: `../assignment/${a.id}`, relative: "path", children: _jsxs(Btn, { palette: palette, size: "sm", className: "gap-2", children: ["Buka", _jsx(ChevronRight, { size: 16 })] }) }), _jsx(Btn, { palette: palette, size: "sm", onClick: () => onEdit(a), children: "Edit" }), _jsx(Btn, { palette: palette, size: "sm", variant: "destructive", onClick: () => handleDelete(a), children: "Hapus" })] })] })] }, a.id));
                                        }), filtered.length === 0 && !isFetching && (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-12 text-sm text-center", style: { color: palette.silver2 }, children: "Belum ada tugas untuk kelas ini." }) }))] })] })] }) })] }));
}
