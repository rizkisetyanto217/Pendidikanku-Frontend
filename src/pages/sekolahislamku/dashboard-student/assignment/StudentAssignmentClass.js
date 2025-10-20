import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/student/StudentAssignment.tsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { ArrowLeft, Search, Filter, CalendarDays, Clock, Eye, Send, Paperclip, CheckCircle, } from "lucide-react";
/* ===== Helpers ===== */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const SUBJECT_LABEL = {
    tahsin: "Tahsin",
    tahfidz: "Tahfidz",
    fiqih: "Fiqih",
};
/* ===== Dummy data: seluruh tugas siswa lintas mapel ===== */
const DUMMY_ALL = [
    // Tahsin
    {
        id: "tahsin-1",
        subject: "tahsin",
        title: "Latihan Mad Thabi'i",
        description: "Kerjakan 10 soal pilihan ganda tentang mad thabi'i.",
        dueAt: new Date(Date.now() + 2 * 864e5).toISOString(),
        points: 100,
        status: "belum",
    },
    {
        id: "tahsin-2",
        subject: "tahsin",
        title: "Ringkasan Hukum Nun Sukun",
        description: "Tuliskan ringkasan 1 halaman.",
        dueAt: new Date(Date.now() - 2 * 864e5).toISOString(),
        points: 100,
        status: "dinilai",
        submittedAt: new Date(Date.now() - 3 * 864e5).toISOString(),
        grade: 88,
        attachmentName: "ringkasan-nun-sukun.pdf",
    },
    // Tahfidz
    {
        id: "tahfidz-1",
        subject: "tahfidz",
        title: "Setoran An-Naba’ 1–10",
        description: "Setor hafalan ayat 1–10.",
        dueAt: new Date(Date.now() + 864e5).toISOString(),
        points: 100,
        status: "terkumpul",
        submittedAt: new Date().toISOString(),
        attachmentName: "setoran-1-10.mp3",
    },
    {
        id: "tahfidz-2",
        subject: "tahfidz",
        title: "Muraja’ah Audio 11–20",
        description: "Unggah audio muraja’ah.",
        dueAt: new Date(Date.now() - 864e5).toISOString(),
        points: 100,
        status: "belum",
    },
    // Fiqih
    {
        id: "fiqih-1",
        subject: "fiqih",
        title: "Rangkuman Thaharah",
        description: "Rangkum bab najis & cara menyucikannya.",
        dueAt: new Date(Date.now() + 3 * 864e5).toISOString(),
        points: 100,
        status: "belum",
    },
    {
        id: "fiqih-2",
        subject: "fiqih",
        title: "Latihan Soal Wudhu",
        description: "10 soal tentang rukun & sunnah wudhu.",
        dueAt: new Date(Date.now() + 2 * 864e5).toISOString(),
        points: 100,
        status: "dinilai",
        submittedAt: new Date(Date.now() - 864e5).toISOString(),
        grade: 92,
        attachmentName: "jawaban-wudhu.pdf",
    },
];
const StudentAssignment = () => {
    const { slug, subject } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // Support 2 rute: /:slug/murid/tugas (tanpa subject) dan /.../my-class/:subject/tugas
    const defaultSubject = subject || "all";
    const [subjectFilter, setSubjectFilter] = useState(defaultSubject === "tahsin" ||
        defaultSubject === "tahfidz" ||
        defaultSubject === "fiqih"
        ? defaultSubject
        : "all");
    const [list, setList] = useState(DUMMY_ALL);
    // search & filter
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("belum"); // default seperti screenshot
    const isOverdue = (a) => new Date(a.dueAt).getTime() < Date.now() && a.status === "belum";
    const bySubject = useMemo(() => list.filter((a) => subjectFilter === "all" ? true : a.subject === subjectFilter), [list, subjectFilter]);
    const counts = useMemo(() => {
        const total = bySubject.length;
        const belum = bySubject.filter((x) => x.status === "belum").length;
        const terkumpul = bySubject.filter((x) => x.status === "terkumpul").length;
        const dinilai = bySubject.filter((x) => x.status === "dinilai").length;
        return { total, belum, terkumpul, dinilai };
    }, [bySubject]);
    const filtered = useMemo(() => {
        const key = q.trim().toLowerCase();
        return bySubject
            .filter((a) => (status === "all" ? true : a.status === status))
            .filter((a) => !key ||
            a.title.toLowerCase().includes(key) ||
            (a.description ?? "").toLowerCase().includes(key))
            .sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt));
    }, [bySubject, q, status]);
    // Actions (dummy)
    const handleSubmit = (a) => {
        const now = new Date().toISOString();
        setList((old) => old.map((x) => x.id === a.id
            ? {
                ...x,
                status: "terkumpul",
                submittedAt: now,
                attachmentName: x.attachmentName || "tugas-dikumpulkan.pdf",
            }
            : x));
        alert(`Tugas "${a.title}" sudah dikumpulkan!`);
    };
    const handleView = (a) => {
        const detail = [
            `Mapel: ${SUBJECT_LABEL[a.subject]}`,
            `Judul: ${a.title}`,
            a.description ? `Deskripsi: ${a.description}` : "",
            `Jatuh tempo: ${dateLong(a.dueAt)}`,
            `Status: ${a.status}`,
            a.submittedAt ? `Dikumpulkan: ${dateLong(a.submittedAt)}` : "",
            typeof a.grade === "number" ? `Nilai: ${a.grade}` : "",
            a.attachmentName ? `Lampiran: ${a.attachmentName}` : "",
        ]
            .filter(Boolean)
            .join("\n");
        alert(detail);
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: subjectFilter === "all"
                    ? "Daftar Tugas"
                    : `Tugas — ${SUBJECT_LABEL[subjectFilter]}`, gregorianDate: new Date().toISOString(), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Daftar Tugas" })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 flex flex-wrap gap-3 items-center", children: [_jsxs("div", { className: "text-sm", children: ["Total: ", _jsx("b", { children: counts.total })] }), _jsxs(Badge, { palette: palette, variant: "outline", className: "h-6", children: ["Belum: ", counts.belum] }), _jsxs(Badge, { palette: palette, variant: "secondary", className: "h-6", children: ["Terkumpul: ", counts.terkumpul] }), _jsxs(Badge, { palette: palette, variant: "success", className: "h-6", children: ["Dinilai: ", counts.dinilai] })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 h-10", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx(Search, { size: 16 }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari tugas\u2026", className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 } })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 h-10", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx(Filter, { size: 16 }), _jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 }, children: [_jsx("option", { value: "belum", children: "Belum dikumpulkan" }), _jsx("option", { value: "terkumpul", children: "Terkumpul" }), _jsx("option", { value: "dinilai", children: "Dinilai" }), _jsx("option", { value: "all", children: "Semua status" })] })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 h-10", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx(Filter, { size: 16 }), _jsxs("select", { value: subjectFilter, onChange: (e) => setSubjectFilter(e.target.value), className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 }, children: [_jsx("option", { value: "all", children: "Semua mapel" }), _jsx("option", { value: "tahsin", children: "Tahsin" }), _jsx("option", { value: "tahfidz", children: "Tahfidz" }), _jsx("option", { value: "fiqih", children: "Fiqih" })] })] })] }) }), _jsxs("div", { className: "grid gap-3", children: [filtered.map((a) => (_jsxs(SectionCard, { palette: palette, className: "p-0", children: [_jsx("div", { className: "p-4 md:p-5", children: _jsx("div", { className: "flex items-start justify-between gap-4", children: _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("div", { className: "text-base md:text-lg font-semibold", children: a.title }), _jsx(Badge, { palette: palette, variant: "outline", className: "h-6", children: SUBJECT_LABEL[a.subject] }), _jsxs(Badge, { palette: palette, variant: a.status === "dinilai"
                                                                                ? "success"
                                                                                : a.status === "terkumpul"
                                                                                    ? "secondary"
                                                                                    : isOverdue(a)
                                                                                        ? "warning"
                                                                                        : "outline", className: "h-6", children: [a.status === "belum" &&
                                                                                    (isOverdue(a) ? "Terlambat" : "Belum"), a.status === "terkumpul" && "Terkumpul", a.status === "dinilai" && "Dinilai"] }), typeof a.grade === "number" && (_jsxs(Badge, { palette: palette, variant: "info", className: "h-6", children: ["Nilai: ", a.grade] }))] }), a.description && (_jsx("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: a.description })), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-sm", style: { color: palette.black2 }, children: [_jsx(CalendarDays, { size: 14 }), _jsxs("span", { children: ["Jatuh tempo: ", dateLong(a.dueAt)] }), a.submittedAt && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsx(Clock, { size: 14 }), _jsxs("span", { children: ["Dikumpulkan: ", dateLong(a.submittedAt)] })] })), a.attachmentName && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsx(Paperclip, { size: 14 }), _jsx("span", { children: a.attachmentName })] }))] })] }) }) }), _jsxs("div", { className: "px-4 md:px-5 pb-4 md:pb-5 pt-3 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Aksi" }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => handleView(a), children: [_jsx(Eye, { size: 16, className: "mr-1" }), "Lihat"] }), a.status === "belum" && (_jsxs(Btn, { palette: palette, size: "sm", onClick: () => handleSubmit(a), children: [_jsx(Send, { size: 16, className: "mr-1" }), "Kumpulkan"] })), a.status === "terkumpul" && (_jsxs(Badge, { palette: palette, variant: "secondary", className: "h-6 flex items-center gap-1", children: [_jsx(CheckCircle, { size: 14 }), "Menunggu penilaian"] })), a.status === "dinilai" && (_jsxs(Badge, { palette: palette, variant: "success", className: "h-6 flex items-center gap-1", children: [_jsx(CheckCircle, { size: 14 }), "Selesai"] }))] })] })] }, a.id))), filtered.length === 0 && (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-6 text-sm text-center", style: { color: palette.silver2 }, children: "Tidak ada tugas yang cocok." }) }))] })] })] }) })] }));
};
export default StudentAssignment;
