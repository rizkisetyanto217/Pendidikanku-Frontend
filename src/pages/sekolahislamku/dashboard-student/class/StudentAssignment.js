import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/student/StudentAssignment.tsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { ArrowLeft, CalendarDays, Upload, Download, Eye, Undo2, Search, Clock, CheckCircle2, } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
/* ===== Utils ===== */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
/* ===== Meta kelas (opsional untuk header) ===== */
const CLASS_META = {
    "tpa-a": { name: "TPA A", room: "Aula 1", homeroom: "Ustadz Abdullah" },
    "tpa-b": { name: "TPA B", room: "R. Tahfiz", homeroom: "Ustadz Salman" },
};
const nowISO = new Date().toISOString();
const plusDays = (n) => new Date(Date.now() + n * 864e5).toISOString();
const minusDays = (n) => new Date(Date.now() - n * 864e5).toISOString();
const ASSIGNMENTS_BY_CLASS = {
    "tpa-a": [
        {
            id: "a-001",
            title: "Latihan Tajwid — Mad Thabi'i",
            desc: "Kerjakan 10 soal pilihan ganda tentang mad thabi'i.",
            createdAt: minusDays(1),
            dueAt: plusDays(1),
            attachments: [{ name: "latihan-mad-thabii.pdf" }],
            status: "belum",
        },
        {
            id: "a-002",
            title: "Praktek Bacaan — Makharijul Huruf",
            desc: "Rekam suara membaca 5 contoh huruf dengan makhraj yang benar.",
            createdAt: nowISO,
            dueAt: plusDays(3),
            status: "terkumpul",
            submittedAt: nowISO,
        },
        {
            id: "a-003",
            title: "Rangkuman Idgham",
            desc: "Buat rangkuman satu halaman tentang Idgham.",
            createdAt: minusDays(3),
            dueAt: minusDays(1),
            status: "dinilai",
            submittedAt: minusDays(2),
            score: 88,
            feedback: "Sudah bagus, tambahkan contoh tambahan.",
        },
    ],
    "tpa-b": [
        {
            id: "a-101",
            title: "Target Hafalan — Juz 30",
            desc: "Setor hafalan An-Naba' ayat 1—20.",
            createdAt: minusDays(2),
            dueAt: plusDays(2),
            status: "belum",
            attachments: [{ name: "target-hafalan.docx" }],
        },
    ],
};
const StudentAssignment = () => {
    const { slug, id } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const classMeta = CLASS_META[id ?? ""] ?? { name: id ?? "-" };
    const [items, setItems] = useState(ASSIGNMENTS_BY_CLASS[id ?? ""] ?? []);
    /* Search & filter status */
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const filtered = useMemo(() => {
        const key = q.trim().toLowerCase();
        let list = items;
        if (status !== "all")
            list = list.filter((i) => i.status === status);
        if (key) {
            list = list.filter((i) => i.title.toLowerCase().includes(key) ||
                (i.desc ?? "").toLowerCase().includes(key));
        }
        return [...list].sort((a, b) => +new Date(a.dueAt ?? a.createdAt) - +new Date(b.dueAt ?? b.createdAt));
    }, [items, q, status]);
    const goBackToMyClass = () => navigate(`/${slug}/murid/menu-utama/my-class`, { replace: false });
    const handleDownload = (asg) => {
        const att = asg.attachments?.[0];
        if (!att) {
            alert("Tidak ada lampiran untuk tugas ini.");
            return;
        }
        if (att.url) {
            window.open(att.url, "_blank", "noopener,noreferrer");
            return;
        }
        // Fallback: file dummy
        const blob = new Blob([`Tugas: ${asg.title}\n\nIni placeholder lampiran "${att.name}".`], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = att.name || `${asg.title}.txt`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();
    };
    const handleSubmit = async (asg) => {
        const res = await Swal.fire({
            title: "Kumpulkan Tugas",
            html: `
        <input type="file" id="file-submission" class="swal2-file" />
        <textarea id="note" class="swal2-textarea" placeholder="Catatan (opsional)"></textarea>
      `,
            showCancelButton: true,
            confirmButtonText: "Kumpulkan",
            cancelButtonText: "Batal",
            background: palette.white1,
            color: palette.black1,
            confirmButtonColor: palette.primary,
            preConfirm: () => {
                const f = document.getElementById("file-submission")?.files;
                if (!f || f.length === 0) {
                    Swal.showValidationMessage("Silakan pilih file terlebih dahulu.");
                    return;
                }
                return true;
            },
        });
        if (!res.isConfirmed)
            return;
        setItems((prev) => prev.map((x) => x.id === asg.id
            ? { ...x, status: "terkumpul", submittedAt: new Date().toISOString() }
            : x));
        await Swal.fire({
            title: "Terkumpul!",
            icon: "success",
            timer: 1200,
            showConfirmButton: false,
            background: palette.white1,
            color: palette.black1,
        });
    };
    const handleUnsubmit = async (asg) => {
        const ok = await Swal.fire({
            title: "Batalkan pengumpulan?",
            text: "Kamu bisa mengunggah ulang sebelum tenggat.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, batalkan",
            cancelButtonText: "Batal",
            background: palette.white1,
            color: palette.black1,
            confirmButtonColor: palette.primary,
        });
        if (!ok.isConfirmed)
            return;
        setItems((prev) => prev.map((x) => x.id === asg.id ? { ...x, status: "belum", submittedAt: undefined } : x));
    };
    const handleView = async (asg) => {
        await Swal.fire({
            title: asg.title,
            html: `
        <div style="text-align:left">
          <p><strong>Deskripsi:</strong> ${asg.desc ?? "-"}</p>
          <p><strong>Dibuat:</strong> ${dateLong(asg.createdAt)}</p>
          <p><strong>Tenggat:</strong> ${dateLong(asg.dueAt)}</p>
          <p><strong>Status:</strong> ${asg.status}</p>
          ${asg.status !== "belum"
                ? `<p><strong>Dikumpulkan:</strong> ${dateLong(asg.submittedAt)}</p>`
                : ""}
          ${typeof asg.score === "number"
                ? `<p><strong>Nilai:</strong> ${asg.score}</p>`
                : ""}
          ${asg.feedback ? `<p><strong>Umpan balik:</strong> ${asg.feedback}</p>` : ""}
        </div>
      `,
            icon: "info",
            confirmButtonText: "Tutup",
            background: palette.white1,
            color: palette.black1,
            confirmButtonColor: palette.primary,
        });
    };
    const badgeForStatus = (s) => s === "belum" ? "warning" : s === "terkumpul" ? "info" : "success";
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: `Tugas — ${classMeta.name}`, gregorianDate: new Date().toISOString(), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: goBackToMyClass, children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Daftar Tugas" })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 h-10 w-full md:w-96", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx(Search, { size: 16 }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari judul / deskripsi\u2026", className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 } })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 h-10 w-full md:w-64", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx(Clock, { size: 16 }), _jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 }, children: [_jsx("option", { value: "all", children: "Semua status" }), _jsx("option", { value: "belum", children: "Belum dikumpulkan" }), _jsx("option", { value: "terkumpul", children: "Terkumpul" }), _jsx("option", { value: "dinilai", children: "Dinilai" })] })] })] }) }), _jsxs("div", { className: "grid gap-3", children: [filtered.map((asg) => (_jsxs(SectionCard, { palette: palette, className: "p-0", children: [_jsx("div", { className: "p-4 md:p-5", children: _jsx("div", { className: "flex items-start justify-between gap-4", children: _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("div", { className: "text-base md:text-lg font-semibold", style: { color: palette.black2 }, children: asg.title }), _jsx(Badge, { palette: palette, variant: badgeForStatus(asg.status), className: "h-6", children: asg.status === "belum"
                                                                                ? "Belum"
                                                                                : asg.status === "terkumpul"
                                                                                    ? "Terkumpul"
                                                                                    : "Dinilai" }), typeof asg.score === "number" && (_jsxs(Badge, { palette: palette, variant: "secondary", className: "h-6", children: ["Nilai: ", asg.score] }))] }), asg.desc && (_jsx("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: asg.desc })), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-sm", style: { color: palette.black2 }, children: [_jsx(CalendarDays, { size: 14 }), _jsxs("span", { children: ["Tenggat: ", dateLong(asg.dueAt)] }), asg.submittedAt && (_jsxs(_Fragment, { children: [_jsx(CheckCircle2, { size: 14 }), _jsxs("span", { children: ["Dikumpulkan: ", dateLong(asg.submittedAt)] })] })), asg.attachments?.length ? (_jsxs("span", { children: ["\u2022 ", asg.attachments.length, " lampiran"] })) : null] })] }) }) }), _jsxs("div", { className: "px-4 md:px-5 pb-4 md:pb-5 pt-3 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Aksi" }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [asg.attachments?.length ? (_jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => handleDownload(asg), children: [_jsx(Download, { size: 16, className: "mr-1" }), "Unduh"] })) : null, _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => handleView(asg), children: [_jsx(Eye, { size: 16, className: "mr-1" }), "Lihat"] }), asg.status === "belum" && (_jsxs(Btn, { palette: palette, size: "sm", onClick: () => handleSubmit(asg), children: [_jsx(Upload, { size: 16, className: "mr-1" }), "Kumpulkan"] })), asg.status === "terkumpul" && (_jsxs(Btn, { palette: palette, size: "sm", variant: "secondary", onClick: () => handleUnsubmit(asg), children: [_jsx(Undo2, { size: 16, className: "mr-1" }), "Batalkan"] }))] })] })] }, asg.id))), filtered.length === 0 && (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-6 text-sm text-center", style: { color: palette.silver2 }, children: "Belum ada tugas yang cocok." }) }))] }), _jsx("div", { className: "md:hidden", children: _jsxs(Btn, { palette: palette, variant: "outline", onClick: goBackToMyClass, children: [_jsx(ArrowLeft, { size: 16, className: "mr-1" }), " Kembali ke Kelas"] }) })] })] }) })] }));
};
export default StudentAssignment;
