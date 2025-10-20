import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/announcements/ParentAnnouncementsPage.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "../../components/home/ParentTopBar";
import ParentSidebar from "../../components/home/ParentSideBar";
/* ======== Helpers ======== */
const dateLong = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});
// --- timezone-safe helpers (pakai “siang lokal”)
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const hijriWithWeekday = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
/* ======== Fake API ======== */
async function fetchAnnouncements({ q, type, }) {
    const base = [
        {
            id: "a1",
            title: "Ujian Tahfiz Pekan Depan",
            date: new Date().toISOString(),
            body: "Mohon dampingi anak dalam muraja'ah surat Al-Balad s.d. Asy-Syams.",
            type: "info",
            attachmentName: "Panduan-Ujian.pdf",
        },
        {
            id: "a2",
            title: "Peringatan Keterlambatan Pembayaran",
            date: new Date(Date.now() - 864e5).toISOString(),
            body: "Tagihan SPP bulan ini jatuh tempo 17 Agustus. Mohon segera diselesaikan.",
            type: "warning",
        },
        {
            id: "a3",
            title: "Syukuran Khatam Iqra",
            date: new Date(Date.now() - 2 * 864e5).toISOString(),
            body: "Alhamdulillah beberapa santri telah khatam Iqra. Acara syukuran pada Jumat pagi.",
            type: "success",
            attachmentName: "Rundown-Acara.docx",
        },
    ];
    let list = base;
    if (type !== "all")
        list = list.filter((x) => x.type === type);
    if (q.trim()) {
        const qq = q.toLowerCase();
        list = list.filter((x) => x.title.toLowerCase().includes(qq) || x.body.toLowerCase().includes(qq));
    }
    list = list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return Promise.resolve(list);
}
/* ======== Page ======== */
export default function StudentAnnouncement() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const [q, setQ] = useState("");
    const [tab, setTab] = useState("all");
    const { data, isLoading } = useQuery({
        queryKey: ["parent-announcements", q, tab],
        queryFn: () => fetchAnnouncements({ q, type: tab }),
        staleTime: 30_000,
    });
    const tabs = [
        { key: "all", label: "Semua" },
        { key: "info", label: "Info" },
        { key: "warning", label: "Peringatan" },
        { key: "success", label: "Sukacita" },
    ];
    const typeToVariant = {
        info: "info",
        warning: "warning",
        success: "success",
    };
    // ISO untuk TopBar (siang lokal) + Hijriah + hari
    const qISO = toLocalNoonISO(new Date());
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, gregorianDate: qISO, title: "Pengumuman", hijriDate: hijriWithWeekday(qISO) }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsx(SectionCard, { palette: palette, className: "p-3 md:p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-3", children: [_jsx("div", { className: "flex-1", children: _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari pengumuman\u2026", className: "h-10 w-full rounded-2xl px-3 text-sm", style: {
                                                        background: palette.white1,
                                                        color: palette.black1,
                                                        border: `1px solid ${palette.silver1}`,
                                                    } }) }), _jsx("div", { className: "flex flex-wrap gap-2", children: tabs.map((t) => (_jsx(Btn, { size: "sm", variant: tab === t.key ? "secondary" : "outline", palette: palette, onClick: () => setTab(t.key), children: t.label }, t.key))) })] }) }), _jsxs("div", { className: "grid gap-3", children: [isLoading && (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Memuat\u2026" })), (data ?? []).map((a) => (_jsx(SectionCard, { palette: palette, className: "p-3 md:p-4", style: { background: palette.white1 }, children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-start md:justify-between gap-2", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium", children: a.title }), _jsx("div", { className: "text-xs", style: { color: palette.black2 }, children: dateLong(a.date) }), _jsx("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: a.body }), _jsxs("div", { className: "mt-2 flex items-center gap-2", children: [_jsx(Badge, { variant: typeToVariant[a.type], palette: palette, children: a.type }), a.attachmentName && (_jsx(Badge, { variant: "outline", palette: palette, children: a.attachmentName }))] })] }), a.attachmentName && (_jsx("div", { className: "flex flex-col sm:flex-row gap-2 md:ml-4 mt-2 md:mt-0", children: _jsxs(Btn, { size: "sm", variant: "outline", palette: palette, children: [_jsx(Download, { className: "mr-2", size: 16 }), "Lampiran"] }) }))] }) }, a.id))), (data?.length ?? 0) === 0 && !isLoading && (_jsx(SectionCard, { palette: palette, className: "p-6 text-center", children: _jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Tidak ada pengumuman yang cocok." }) }))] })] })] }) })] }));
}
