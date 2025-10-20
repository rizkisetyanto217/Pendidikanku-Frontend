import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Outlet, useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import axios from "@/lib/axios";
// import { useEffectiveMasjidId } from "@/hooks/useEffectiveMasjidId";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import TodayScheduleCard from "@/pages/sekolahislamku/components/card/TodayScheduleCard";
import AnnouncementsList from "@/pages/sekolahislamku/components/card/AnnouncementsListCard";
import BillsSectionCard from "@/pages/sekolahislamku/components/card/BillsSectionCard";
import { Users, UserCog, BookOpen, ArrowLeft, Wallet, GraduationCap, } from "lucide-react";
import { mapSessionsToTodaySchedule, mockTodaySchedule, } from "./types/TodaySchedule";
/* ============ Query Keys ============ */
const QK = {
    HOME: ["school-home"],
    STATS: ["lembaga-stats"],
    TODAY_SESSIONS: (d) => ["class-attendance-sessions", "today", d],
    ANNOUNCEMENTS: ["announcements", "u"],
    THEMES: ["announcement-themes"],
};
/* ================= Utils ================ */
const slugify = (text) => text
    .toLowerCase()
    .trim()
    .replace(/[_—–]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
const themeToType = (a) => {
    const n = a.theme?.name?.toLowerCase() ?? "";
    if (n.includes("warning") || n.includes("perhatian"))
        return "warning";
    if (n.includes("success") || n.includes("berhasil"))
        return "success";
    return "info";
};
const yyyyMmDdLocal = (d = new Date()) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const dateFmt = (iso) => {
    if (!iso)
        return "-";
    try {
        return new Date(iso).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }
    catch {
        return iso;
    }
};
const hijriLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const formatIDR = (n) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
}).format(n);
/* ============ Dummy Home ============ */
async function fetchSchoolHome() {
    const now = new Date();
    const iso = now.toISOString();
    return {
        schoolName: "Sekolah Islamku",
        hijriDate: "16 Muharram 1447 H",
        gregorianDate: iso,
        finance: {
            unpaidCount: 18,
            unpaidTotal: 7_500_000,
            paidThisMonth: 42_250_000,
            outstandingBills: [
                {
                    id: "b101",
                    title: "SPP Agustus - Kelas 3A",
                    amount: 150_000,
                    dueDate: new Date(now.getTime() + 5 * 864e5).toISOString(),
                    status: "unpaid",
                },
                {
                    id: "b102",
                    title: "SPP Agustus - Kelas 4B",
                    amount: 300_000,
                    dueDate: new Date(now.getTime() + 3 * 864e5).toISOString(),
                    status: "unpaid",
                },
                {
                    id: "b103",
                    title: "Seragam Baru",
                    amount: 250_000,
                    dueDate: new Date(now.getTime() + 9 * 864e5).toISOString(),
                    status: "unpaid",
                },
            ],
        },
        todaySchedule: mockTodaySchedule,
        announcements: [],
        attendanceTodayByStatus: {
            hadir: 286,
            online: 8,
            sakit: 10,
            izin: 9,
            alpa: 7,
        },
    };
}
/* ============ Hooks ============ */
function useAnnouncements() {
    return useQuery({
        queryKey: QK.ANNOUNCEMENTS,
        queryFn: async () => {
            const res = await axios.get("/api/a/announcements", { params: { limit: 20, offset: 0 }, withCredentials: true });
            const items = res.data?.data ?? [];
            return items.map((a) => ({
                id: a.announcement_id,
                title: a.announcement_title,
                date: a.announcement_date,
                body: a.announcement_content,
                themeId: a.announcement_theme_id ?? undefined,
                type: themeToType(a),
                slug: slugify(a.announcement_title),
            }));
        },
    });
}
function useAnnouncementThemes() {
    return useQuery({
        queryKey: QK.THEMES,
        queryFn: async () => {
            const res = await axios.get("/api/a/announcement-themes", { params: { limit: 50, offset: 0 }, withCredentials: true });
            return (res.data?.data.map((t) => ({
                id: t.announcement_themes_id,
                name: t.announcement_themes_name,
                color: t.announcement_themes_color ?? undefined,
                description: t.announcement_themes_description ?? undefined,
                slug: t.announcement_themes_slug,
                isActive: t.announcement_themes_is_active,
                createdAt: t.announcement_themes_created_at,
            })) ?? []);
        },
    });
}
function useLembagaStats() {
    return useQuery({
        queryKey: QK.STATS,
        queryFn: async () => {
            const res = await axios.get("/api/a/lembaga-stats", { withCredentials: true });
            return res.data?.found ? res.data.data : null;
        },
    });
}
function useTodaySessions() {
    const today = yyyyMmDdLocal();
    return useQuery({
        queryKey: QK.TODAY_SESSIONS(today),
        queryFn: async () => {
            const res = await axios.get("/api/u/class-attendance-sessions", {
                params: { date_from: today, date_to: today, limit: 50, offset: 0 },
                withCredentials: true,
            });
            return res.data?.data?.items ?? [];
        },
    });
}
/* ============ Shared UI ============ */
function Flash({ palette, flash, }) {
    if (!flash)
        return null;
    const isOk = flash.type === "success";
    return (_jsx("div", { className: "mx-auto max-w-6xl px-4", children: _jsx("div", { className: "mb-3 rounded-lg px-3 py-2 text-sm", style: {
                background: isOk ? palette.success2 : palette.error2,
                color: isOk ? palette.success1 : palette.error1,
            }, children: flash.msg }) }));
}
function KpiTile({ palette, label, value, icon, }) {
    return (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 flex items-center gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: { background: palette.primary2, color: palette.primary }, children: icon }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: label }), _jsx("div", { className: "text-xl font-semibold", children: value })] })] }) }));
}
function MiniStat({ palette, label, value, sub, tone, }) {
    const badgeVariant = tone === "warning" ? "warning" : "outline";
    return (_jsxs("div", { className: "p-3 rounded-xl border w-full", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2", children: [_jsx("div", { className: "text-sm font-medium leading-tight md:flex-1 truncate", style: { color: palette.black2 }, children: label }), _jsx(Badge, { palette: palette, variant: badgeVariant, className: "flex-shrink-0 w-fit text-sm", children: label.includes("Tunggakan") ? "Perlu perhatian" : "OK" })] }), _jsx("div", { className: "text-lg md:text-xl font-semibold leading-tight mb-1", children: value }), sub && (_jsx("div", { className: "text-sm leading-relaxed", style: { color: palette.black2 }, children: sub }))] }));
}
/* ============ AddThemeModal tetap ada ============ */
function AddThemeModal({ open, onClose, onSubmit, saving, error, palette, }) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#007074");
    const [description, setDescription] = useState("");
    useEffect(() => {
        if (open) {
            setName("");
            setColor("#007074");
            setDescription("");
        }
    }, [open]);
    if (!open)
        return null;
    const disabled = saving || !name.trim();
    return (_jsx("div", { className: "fixed inset-0 z-[70] grid place-items-center", style: { background: "rgba(0,0,0,.35)" }, children: _jsxs("div", { className: "w-[min(520px,92vw)] rounded-2xl p-4 shadow-xl ring-1", style: {
                background: palette.white1,
                color: palette.black1,
                borderColor: palette.silver1,
            }, children: [_jsx("div", { className: "mb-3 text-lg font-semibold", children: "Tambah Tema Pengumuman" }), _jsxs("div", { className: "grid gap-3", children: [_jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { className: "opacity-80", children: "Nama Tema" }), _jsx("input", { className: "w-full rounded-lg border px-3 py-2 text-sm", style: {
                                        borderColor: palette.silver2,
                                        background: palette.white2,
                                    }, value: name, onChange: (e) => setName(e.target.value), placeholder: "Mis. 'Pengumuman', 'Peringatan', 'Sukses'" })] }), _jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { className: "opacity-80", children: "Deskripsi (opsional)" }), _jsx("textarea", { rows: 3, className: "w-full rounded-lg border px-3 py-2 text-sm", style: {
                                        borderColor: palette.silver2,
                                        background: palette.white2,
                                    }, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Penjelasan singkat tema" })] }), _jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { className: "opacity-80", children: "Warna (opsional)" }), _jsx("input", { type: "color", className: "h-9 w-16 rounded border", style: {
                                        borderColor: palette.silver2,
                                        background: palette.white2,
                                    }, value: color, onChange: (e) => setColor(e.target.value) })] }), !!error && (_jsx("div", { className: "text-sm", style: { color: palette.error1 }, children: error }))] }), _jsxs("div", { className: "mt-4 flex items-center justify-end gap-2", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, disabled: saving, children: "Batal" }), _jsx(Btn, { palette: palette, onClick: () => onSubmit({
                                name: name.trim(),
                                color,
                                description: description.trim() || undefined,
                            }), disabled: disabled, children: saving ? "Menyimpan…" : "Tambah" })] })] }) }));
}
/* ================= Page ================= */
const SchoolDashboard = ({ showBack = false, backTo, backLabel = "Kembali", }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const qc = useQueryClient();
    const navigate = useNavigate();
    const [flash, setFlash] = useState(null);
    useEffect(() => {
        if (flash) {
            const t = setTimeout(() => setFlash(null), 3000);
            return () => clearTimeout(t);
        }
    }, [flash]);
    // useEffectiveMasjidId();
    const homeQ = useQuery({ queryKey: QK.HOME, queryFn: fetchSchoolHome });
    const statsQ = useLembagaStats();
    const todaySessionsQ = useTodaySessions();
    const announcementsQ = useAnnouncements();
    // Jadwal
    const scheduleItems = useMemo(() => {
        const apiItems = todaySessionsQ.data ?? [];
        return apiItems.length > 0
            ? mapSessionsToTodaySchedule(apiItems)
            : mockTodaySchedule;
    }, [todaySessionsQ.data]);
    const topbarGregorianISO = toLocalNoonISO(new Date());
    const [mobileOpen, setMobileOpen] = useState(false);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Dashboard Sekolah", gregorianDate: topbarGregorianISO, hijriDate: hijriLong(topbarGregorianISO) }), _jsx(Flash, { palette: palette, flash: flash }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette, mode: "auto", openMobile: mobileOpen, onCloseMobile: () => setMobileOpen(false) }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 ", children: [
                                        { label: "Guru", value: 26, icon: _jsx(UserCog, { size: 18 }) },
                                        { label: "Siswa", value: 342, icon: _jsx(Users, { size: 18 }) },
                                        {
                                            label: "Program",
                                            value: 12,
                                            icon: _jsx(GraduationCap, { size: 18 }),
                                        },
                                        { label: "Kelas", value: 18, icon: _jsx(BookOpen, { size: 18 }) },
                                    ].map((k) => (_jsx(KpiTile, { palette: palette, label: k.label, value: k.value, icon: k.icon }, k.label))) }), showBack && (_jsx("div", { className: "flex py-2", children: _jsxs(Btn, { palette: palette, variant: "ghost", onClick: () => (backTo ? navigate(backTo) : navigate(-1)), className: "inline-flex items-center gap-2", children: [_jsx(ArrowLeft, { size: 20 }), " ", backLabel] }) })), _jsx(Outlet, {}), _jsxs("section", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch", children: [_jsxs("div", { className: "col-span-1 md:col-span-6", children: [_jsx(TodayScheduleCard, { palette: palette, items: scheduleItems, seeAllPath: "all-schedule", title: "Jadwal Hari Ini", maxItems: 3 }), (todaySessionsQ.isLoading || todaySessionsQ.isFetching) && (_jsx("div", { className: "px-4 pt-2 text-xs opacity-70", children: "Memuat jadwal hari ini\u2026" }))] }), _jsxs("div", { className: "md:col-span-1 lg:col-span-6 space-y-6 min-w-0", children: [_jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 pb-1 font-medium flex items-center gap-2 mb-4", children: [_jsx("div", { className: "h-9 w-9 rounded-xl flex items-center justify-center ", style: {
                                                                        background: palette.white3,
                                                                        color: palette.quaternary,
                                                                    }, children: _jsx(Wallet, { size: 18 }) }), _jsx("h1", { className: "text-base font-semibold", children: "Snapshot Keuangan" })] }), _jsxs("div", { className: "px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsx(MiniStat, { palette: palette, label: "Tertagih Bulan Ini", value: formatIDR(homeQ.data?.finance.paidThisMonth ?? 0) }), _jsx(MiniStat, { palette: palette, label: "Tunggakan", value: `${homeQ.data?.finance.unpaidCount ?? 0} tagihan`, sub: formatIDR(homeQ.data?.finance.unpaidTotal ?? 0), tone: "warning" })] })] }), _jsx(BillsSectionCard, { palette: palette, bills: homeQ.data?.finance.outstandingBills ?? [], dateFmt: dateFmt, formatIDR: formatIDR, seeAllPath: "all-invoices", getPayHref: (b) => `/tagihan/${b.id}` })] }), _jsxs("div", { className: "lg:col-span-12", children: [_jsx(AnnouncementsList, { palette: palette, dateFmt: dateFmt, items: announcementsQ.data ?? homeQ.data?.announcements ?? [], seeAllPath: "all-announcement", getDetailHref: (a) => `/pengumuman/${a.slug ?? a.id}`, showActions: true, canAdd: true }), (announcementsQ.isLoading || announcementsQ.isFetching) && (_jsx("div", { className: "px-4 pt-2 text-xs opacity-70", children: "Memuat pengumuman\u2026" })), announcementsQ.isError && (_jsx("div", { className: "px-4 pt-2 text-xs opacity-70", children: "Gagal memuat pengumuman. Menampilkan data sementara." }))] })] })] })] }) })] }));
};
export default SchoolDashboard;
