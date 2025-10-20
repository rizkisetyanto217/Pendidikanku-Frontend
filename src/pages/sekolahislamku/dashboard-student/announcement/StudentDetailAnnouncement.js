import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/student/announcements/AnnouncementDetailPage.tsx
import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentTopBar from "../../components/home/ParentTopBar";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { Bell, ArrowLeft, Paperclip, ExternalLink, User, Users, } from "lucide-react";
import ParentSidebar from "../../components/home/ParentSideBar";
/* ===== Helpers ===== */
const dateFmt = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});
/* ===== DUMMY DATA ===== */
const now = new Date();
const addDays = (d) => new Date(now.getTime() + d * 86400000);
const DUMMY_ANNOUNCEMENTS = [
    {
        id: "a1",
        title: "Ujian Tahfiz Pekan Depan",
        date: addDays(0).toISOString(),
        type: "info",
        status: "published",
        audience: "siswa",
        authorName: "Ust. Fulan",
        body: "Assalamu’alaikum.\n\nPekan depan akan diadakan ujian tahfiz Juz 30. Mohon orang tua mendampingi muraja’ah di rumah, fokus pada surat Al-Balad s.d. Asy-Syams.\n\nJazakumullahu khairan.",
        attachments: [
            {
                id: "f1",
                name: "Panduan Ujian.pdf",
                url: "#",
            },
        ],
    },
    {
        id: "a2",
        title: "Pengumpulan Infaq Jumat",
        date: addDays(2).toISOString(),
        type: "success",
        status: "published",
        audience: "semua",
        authorName: "Panitia",
        body: "Infaq Jumat kembali dibuka. Silakan titipkan melalui anak masing-masing. Semoga Allah membalas kebaikan antum semua.",
    },
    {
        id: "a3",
        title: "Perubahan Jadwal Ekstrakurikuler",
        date: addDays(4).toISOString(),
        type: "warning",
        status: "scheduled",
        audience: "siswa",
        authorName: "Bag. Kesiswaan",
        body: "Ekstrakurikuler pramuka dipindah ke hari Sabtu pukul 07.00. Mohon menyesuaikan.",
    },
    {
        id: "a4",
        title: "Rapat Orang Tua Wali",
        date: addDays(-3).toISOString(),
        type: "info",
        status: "published",
        audience: "siswa",
        authorName: "Kurikulum",
        body: "Rapat orang tua wali kelas insyaAllah dilaksanakan pekan ini. Detail akan menyusul pada grup kelas masing-masing.",
    },
];
/* Dummy fetcher */
async function fetchAnnouncementDummy(id) {
    const detail = DUMMY_ANNOUNCEMENTS.find((a) => a.id === id) ?? DUMMY_ANNOUNCEMENTS[0];
    const related = DUMMY_ANNOUNCEMENTS.filter((a) => a.id !== detail.id).slice(0, 5);
    return Promise.resolve({
        detail,
        related,
        hijriDate: "16 Muharram 1447 H",
        gregorianDate: new Date().toISOString(),
    });
}
/* ===== Page ===== */
export default function StudentDetailAnnouncement() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["student-ann-detail", id],
        queryFn: () => fetchAnnouncementDummy(id),
    });
    const ann = data?.detail;
    const related = useMemo(() => (data?.related ?? []).filter((r) => r.id !== ann?.id).slice(0, 5), [data, ann?.id]);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Pengumuman", gregorianDate: data?.gregorianDate, hijriDate: data?.hijriDate }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Btn, { variant: "outline", size: "sm", palette: palette, onClick: () => navigate(-1), children: [_jsx(ArrowLeft, { size: 16 }), " Kembali"] }), isError && (_jsx(Btn, { variant: "destructive", size: "sm", palette: palette, onClick: () => refetch(), children: "Coba lagi" }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-4", children: [_jsx(SectionCard, { palette: palette, className: "lg:col-span-8 p-4 md:p-6", children: isLoading ? (_jsx("div", { style: { color: palette.silver2 }, children: "Memuat detail\u2026" })) : !ann ? (_jsx("div", { style: { color: palette.silver2 }, children: "Pengumuman tidak ditemukan." })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("h1", { className: "text-xl font-semibold flex items-center gap-2", children: [_jsx(Bell, { size: 20, color: palette.quaternary }), _jsx("span", { className: "truncate", children: ann.title })] }), _jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-xs", style: { color: palette.silver2 }, children: [_jsx("span", { children: dateFmt(ann.date) }), ann.authorName && (_jsxs("span", { className: "inline-flex items-center gap-1", children: ["\u2022 ", _jsx(User, { size: 12 }), " ", ann.authorName] })), ann.audience && (_jsxs("span", { className: "inline-flex items-center gap-1", children: ["\u2022 ", _jsx(Users, { size: 12 }), " ", ann.audience === "semua"
                                                                                        ? "Semua"
                                                                                        : ann.audience === "siswa"
                                                                                            ? "Siswa"
                                                                                            : "Guru"] }))] })] }), _jsxs("div", { className: "flex flex-col items-end gap-2 shrink-0", children: [ann.type && (_jsx(Badge, { palette: palette, variant: ann.type === "warning"
                                                                            ? "warning"
                                                                            : ann.type === "success"
                                                                                ? "success"
                                                                                : "info", children: ann.type })), ann.status && (_jsx(Badge, { palette: palette, variant: ann.status === "published"
                                                                            ? "success"
                                                                            : ann.status === "scheduled"
                                                                                ? "info"
                                                                                : "outline", children: ann.status }))] })] }), ann.attachments && ann.attachments.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "text-xs mb-2", style: { color: palette.silver2 }, children: "Lampiran" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ann.attachments.map((f) => (_jsx("a", { href: f.url, target: "_blank", rel: "noreferrer", children: _jsxs(Btn, { palette: palette, variant: "white1", size: "sm", className: "inline-flex items-center", children: [_jsx(Paperclip, { size: 14, className: "mr-1" }), f.name, _jsx(ExternalLink, { size: 14, className: "ml-1" })] }) }, f.id ?? f.url))) })] })), _jsx("div", { className: "mt-5 text-sm leading-6 whitespace-pre-wrap", style: { color: palette.black1 }, children: ann.body })] })) }), _jsxs(SectionCard, { palette: palette, className: "lg:col-span-4 p-4 md:p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: "font-medium", children: "Pengumuman Lainnya" }), _jsx(Link, { to: "/student/pengumuman", children: _jsx(Btn, { size: "sm", variant: "ghost", palette: palette, children: "Lihat semua" }) })] }), isLoading ? (_jsx("div", { style: { color: palette.silver2 }, children: "Memuat\u2026" })) : related.length === 0 ? (_jsx("div", { style: { color: palette.silver2 }, children: "Tidak ada pengumuman lain." })) : (_jsx("ul", { className: "space-y-2", children: related.map((r) => (_jsx("li", { children: _jsxs(Link, { to: `/student/pengumuman/${r.id}`, className: "block rounded-xl border p-3", style: {
                                                                borderColor: palette.silver1,
                                                                background: palette.white2,
                                                            }, children: [_jsx("div", { className: "font-medium truncate", children: r.title }), _jsx("div", { className: "text-xs mt-1", style: { color: palette.silver2 }, children: dateFmt(r.date) })] }) }, r.id))) }))] })] })] })] }) })] }));
}
