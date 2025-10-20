import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/student/StudentMateri.tsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { ArrowLeft, CalendarDays, BookOpen, Download, Search, } from "lucide-react";
/* ===== Utils ===== */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
/* ===== Meta kelas (opsional, untuk judul) ===== */
const CLASS_META = {
    "tpa-a": { name: "TPA A", room: "Aula 1", homeroom: "Ustadz Abdullah" },
    "tpa-b": { name: "TPA B", room: "R. Tahfiz", homeroom: "Ustadz Salman" },
};
/* ===== Dummy materi per kelas (key by id dari MyClass) ===== */
const MATERIALS_BY_CLASS = {
    "tpa-a": [
        {
            id: "m-001",
            title: "Mad Thabi'i — Ringkasan & Contoh",
            desc: "Definisi, cara membaca, dan contoh bacaan mad thabi'i.",
            type: "pdf",
            createdAt: new Date(Date.now() - 864e5).toISOString(),
            author: "Ustadz Abdullah",
            attachments: [{ name: "mad-thabii.pdf" }],
        },
        {
            id: "m-002",
            title: "Video: Makharijul Huruf (Ringkas)",
            desc: "Ringkasan tempat keluarnya huruf hijaiyah.",
            type: "video",
            createdAt: new Date().toISOString(),
            author: "Ustadzah Amina",
            attachments: [{ name: "YouTube", url: "https://youtu.be/dQw4w9WgXcQ" }],
        },
    ],
    "tpa-b": [
        {
            id: "m-101",
            title: "Target Hafalan Juz 30 (Pekan Ini)",
            desc: "Daftar ayat & target hafalan mingguan.",
            type: "ppt",
            createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
            author: "Ustadz Salman",
            attachments: [{ name: "target-hafalan.pptx" }],
        },
    ],
};
const StudentMateri = () => {
    const { slug, id } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const classMeta = CLASS_META[id ?? ""] ?? { name: id ?? "-" };
    const allMaterials = MATERIALS_BY_CLASS[id ?? ""] ?? [];
    /* Search/filter */
    const [q, setQ] = useState("");
    const materials = useMemo(() => {
        const key = q.trim().toLowerCase();
        if (!key)
            return allMaterials;
        return allMaterials.filter((m) => m.title.toLowerCase().includes(key) ||
            (m.desc ?? "").toLowerCase().includes(key) ||
            (m.author ?? "").toLowerCase().includes(key));
    }, [q, allMaterials]);
    const goBackToList = () => navigate(`/${slug}/murid/menu-utama/my-class`, { replace: false });
    const handleDownload = (m) => {
        const att = m.attachments?.[0];
        if (!att) {
            alert("Belum ada lampiran untuk materi ini.");
            return;
        }
        if (att.url) {
            window.open(att.url, "_blank", "noopener,noreferrer");
            return;
        }
        // Fallback: buat file dummy agar UX unduh tetap ada
        const blob = new Blob([
            `Materi: ${m.title}\n\nIni adalah placeholder untuk lampiran "${att.name}".`,
        ], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = att.name || `${m.title}.txt`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: `Materi — ${classMeta.name}`, gregorianDate: new Date().toISOString(), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: goBackToList, children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Materi Kelas" })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 flex items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BookOpen, { size: 18, style: { color: palette.primary } }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "Daftar Materi" }), _jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: [classMeta.room ? `${classMeta.room} • ` : "", classMeta.homeroom ? `Wali: ${classMeta.homeroom}` : ""] })] })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 h-10 w-full md:w-80", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx(Search, { size: 16 }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari judul/penjelasan/penulis\u2026", className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 } })] })] }) }), _jsxs("div", { className: "grid gap-3", children: [materials.map((m) => (_jsxs(SectionCard, { palette: palette, className: "p-0", children: [_jsx("div", { className: "p-4 md:p-5", children: _jsx("div", { className: "flex items-start justify-between gap-4", children: _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "text-base font-semibold", style: { color: palette.black2 }, children: m.title }), _jsx(Badge, { palette: palette, variant: m.type === "pdf"
                                                                                ? "secondary"
                                                                                : m.type === "doc"
                                                                                    ? "info"
                                                                                    : m.type === "ppt"
                                                                                        ? "warning"
                                                                                        : m.type === "video"
                                                                                            ? "success"
                                                                                            : "outline", className: "h-6", children: m.type.toUpperCase() })] }), m.desc && (_jsx("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: m.desc })), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-sm", style: { color: palette.black2 }, children: [_jsx(CalendarDays, { size: 14 }), _jsxs("span", { children: ["Dibuat: ", dateLong(m.createdAt)] }), m.author && _jsxs("span", { children: ["\u2022 Oleh ", m.author] }), m.attachments?.length ? (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsxs("span", { children: [m.attachments.length, " lampiran"] })] })) : null] })] }) }) }), _jsxs("div", { className: "px-4 md:px-5 pb-4 md:pb-5 pt-3 border-t flex items-center justify-between", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Aksi" }), _jsx("div", { className: "flex gap-2", children: _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => handleDownload(m), children: [_jsx(Download, { size: 16, className: "mr-1" }), "Unduh"] }) })] })] }, m.id))), materials.length === 0 && (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-6 text-sm text-center", style: { color: palette.silver2 }, children: "Belum ada materi untuk kelas ini." }) }))] }), _jsx("div", { className: "md:hidden", children: _jsxs(Btn, { palette: palette, variant: "outline", onClick: goBackToList, children: [_jsx(ArrowLeft, { size: 16, className: "mr-1" }), " Kembali ke Kelas"] }) })] })] }) })] }));
};
export default StudentMateri;
