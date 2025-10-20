import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/schedule/ParentSchedulePage.tsx
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, GraduationCap } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "../../components/home/ParentTopBar";
import ParentSidebar from "../../components/home/ParentSideBar";
/* =============== Helpers =============== */
const idDate = (d) => d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
});
const toISODate = (d) => d.toISOString().slice(0, 10);
const parseMinutes = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return (h ?? 0) * 60 + (m ?? 0);
};
const formatCurrency = (amount) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
}).format(amount);
// 👉 aman timezone: pakai “siang lokal” utk display/hijriah
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
/* =============== API Functions =============== */
async function fetchClasses() {
    const token = localStorage.getItem("authToken") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");
    if (!token) {
        throw new Error("Unauthorized - Token tidak ditemukan. Silakan login.");
    }
    const response = await fetch("https://masjidkubackend4-production.up.railway.app/api/a/classes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("access_token");
            localStorage.removeItem("token");
            window.location.href = "/login";
            throw new Error("Unauthorized - Silakan login kembali.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}
async function fetchSchedule(selectedISO, classes = []) {
    const classMap = new Map(classes.map((c) => [c.class_id, c]));
    // filter kelas aktif (sementara pakai created_at ≤ selectedISO)
    const filtered = classes.filter((cls) => {
        const created = new Date(cls.class_created_at).toISOString().slice(0, 10);
        return created <= selectedISO;
    });
    const items = filtered.map((cls) => ({
        id: cls.class_id,
        time: "07:30",
        title: cls.class_name,
        room: "Kelas offline",
        teacher: "-",
        type: "class",
        description: cls.class_description,
        class_id: cls.class_id,
        class_info: classMap.get(cls.class_id),
    }));
    const make = (date, items) => ({
        date: date.toISOString(),
        items: items.sort((a, b) => parseMinutes(a.time) - parseMinutes(b.time)),
    });
    const selected = new Date(selectedISO);
    return {
        selected: make(selected, items),
        nextDays: [],
    };
}
/* =============== Small bits =============== */
function TypeBadge({ t, palette, }) {
    if (t === "exam")
        return (_jsx(Badge, { variant: "warning", palette: palette, className: "h-6", children: "Ujian" }));
    if (t === "event")
        return (_jsx(Badge, { variant: "info", palette: palette, className: "h-6", children: "Kegiatan" }));
    return (_jsx(Badge, { variant: "secondary", palette: palette, className: "h-6", children: "Kelas" }));
}
function ClassLevelBadge({ level, palette, }) {
    if (!level)
        return null;
    return (_jsx(Badge, { variant: level === "Dasar"
            ? "success"
            : level === "Menengah"
                ? "warning"
                : "info", palette: palette, className: "h-6", children: level }));
}
function ScheduleDetailModal({ open, onClose, entry, palette, }) {
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);
    if (!open || !entry)
        return null;
    const { item, dateISO } = entry;
    const prettyDate = idDate(new Date(dateISO));
    return (_jsx("div", { className: "fixed inset-0 z-50", role: "dialog", "aria-modal": "true", onClick: onClose, style: { background: "rgba(0,0,0,0.35)" }, children: _jsxs("div", { className: "mx-auto mt-16 w-[92%] max-w-lg rounded-2xl shadow-lg", onClick: (e) => e.stopPropagation(), style: {
                background: palette.white1,
                color: palette.black1,
                border: `1px solid ${palette.silver1}`,
            }, children: [_jsx("div", { className: "p-4 md:p-5 border-b", style: { borderColor: palette.silver1 }, children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-base font-semibold truncate", children: item.title }), _jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-xs", style: { color: palette.silver2 }, children: [_jsx("span", { children: prettyDate }), _jsxs("span", { children: ["\u2022 ", item.time] }), item.type && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsx(TypeBadge, { t: item.type, palette: palette })] }))] })] }), _jsx(Btn, { variant: "outline", size: "sm", palette: palette, onClick: onClose, children: "Tutup" })] }) }), _jsxs("div", { className: "p-4 md:p-5 space-y-3", children: [_jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Tempat:" }), " ", item.room ?? "-"] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Pengajar:" }), " ", item.teacher ?? "-"] }), item.class_info && (_jsxs(_Fragment, { children: [_jsx("div", { className: "pt-2 mt-2 border-t", style: { borderColor: palette.silver1 } }), _jsx("div", { className: "text-xs", style: { color: palette.silver2 }, children: "Informasi Kelas" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(GraduationCap, { size: 16, color: palette.quaternary }), _jsx("span", { className: "text-sm font-medium", children: item.class_info.class_name }), _jsx(ClassLevelBadge, { level: item.class_info.class_level, palette: palette })] }), _jsx("div", { className: "text-sm", children: item.class_info.class_description }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Biaya:" }), " ", formatCurrency(item.class_info.class_fee_monthly_idr), "/bulan"] })] })] }))] }), _jsxs("div", { className: "p-4 md:p-5 pt-0 flex items-center justify-end gap-2", children: [_jsx(Btn, { palette: palette, variant: "white1", size: "sm", onClick: onClose, children: "Mengerti" }), _jsx(Btn, { palette: palette, variant: "default", size: "sm", onClick: onClose, children: "OK" })] })] }) }));
}
/* =============== Page =============== */
export default function StudentSchedule() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const [dateStr, setDateStr] = useState(() => toISODate(new Date()));
    const [active, setActive] = useState(null);
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    const navigate = useNavigate();
    const { data: classesData, isLoading: isLoadingClasses, error: classesError, } = useQuery({
        queryKey: ["classes"],
        queryFn: fetchClasses,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
    const { data: scheduleData, isLoading: isLoadingSchedule, isFetching, } = useQuery({
        queryKey: ["parent-schedule", dateStr, classesData?.data],
        queryFn: () => fetchSchedule(dateStr, classesData?.data || []),
        staleTime: 60_000,
        enabled: !!classesData,
    });
    const selectedPretty = useMemo(() => (scheduleData ? idDate(new Date(scheduleData.selected.date)) : "—"), [scheduleData]);
    const onToday = () => setDateStr(toISODate(new Date()));
    const isLoading = isLoadingClasses || isLoadingSchedule;
    // ISO aman untuk TopBar + hijriah (siang lokal)
    const qISO = toLocalNoonISO(new Date());
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Jadwal", gregorianDate: qISO, hijriDate: hijriWithWeekday(qISO), showBack: isFromMenuUtama }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, onClick: () => navigate(-1), variant: "ghost", className: "cursor-pointer flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "List Jadwal" })] }), classesError && (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-4 text-center", children: _jsx("div", { className: "text-red-500 text-sm font-medium", children: classesError instanceof Error
                                                ? classesError.message
                                                : "Gagal memuat data kelas" }) }) })), _jsx(SectionCard, { palette: palette, className: "p-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CalendarDays, { size: 18, color: palette.quaternary }), _jsx("input", { type: "date", value: dateStr, onChange: (e) => setDateStr(e.target.value), className: "h-9 w-48 rounded-xl px-3 text-sm", style: {
                                                    background: palette.white1,
                                                    color: palette.black1,
                                                    border: `1px solid ${palette.silver1}`,
                                                } }), _jsx(Btn, { size: "sm", variant: "secondary", palette: palette, onClick: onToday, children: "Hari ini" }), classesData && (_jsxs("div", { className: "ml-auto text-xs", style: { color: palette.silver2 }, children: [classesData.data.length, " kelas tersedia"] }))] }) }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2", children: [_jsxs("h3", { className: "text-base font-semibold flex items-center gap-2", children: [_jsx(CalendarDays, { size: 20, color: palette.quaternary }), " Jadwal", " ", selectedPretty] }), (isLoading || isFetching) && (_jsx("div", { className: "mt-2 text-sm", style: { color: palette.silver2 }, children: "Memuat\u2026" }))] }), _jsxs("div", { className: "p-4 space-y-3", children: [scheduleData?.selected.items?.length === 0 && (_jsx("div", { className: "rounded-xl border p-4 text-sm", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white2,
                                                        color: palette.silver2,
                                                    }, children: "Tidak ada jadwal pada tanggal ini." })), scheduleData?.selected.items?.map((s) => (_jsx(SectionCard, { palette: palette, className: "p-0", style: { background: palette.white2 }, children: _jsxs("button", { onClick: () => setActive({
                                                            dateISO: scheduleData.selected.date,
                                                            item: s,
                                                        }), className: "w-full p-3 flex items-center justify-between text-left rounded-2xl", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("div", { className: "text-sm font-medium truncate", children: s.title }), s.class_info && (_jsx(ClassLevelBadge, { level: s.class_info.class_level, palette: palette }))] }), _jsx("div", { className: "text-xs truncate", style: { color: palette.silver2 }, children: s.class_info?.class_description ?? "-" }), _jsxs("div", { className: "text-xs truncate", style: { color: palette.silver2 }, children: [s.room ?? "-", " ", s.teacher ? `• ${s.teacher}` : ""] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsx(TypeBadge, { t: s.type, palette: palette }), _jsx(Badge, { variant: "outline", palette: palette, children: s.time })] })] }) }, s.id)))] })] }), _jsx(ScheduleDetailModal, { open: !!active, onClose: () => setActive(null), entry: active, palette: palette })] })] }) })] }));
}
