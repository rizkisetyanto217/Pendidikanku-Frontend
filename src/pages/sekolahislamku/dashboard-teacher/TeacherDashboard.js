import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/TeacherDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { BookOpen, GraduationCap, UserCog, Users } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import TodayScheduleCard from "@/pages/sekolahislamku/components/card/TodayScheduleCard";
import AnnouncementsList from "@/pages/sekolahislamku/components/card/AnnouncementsListCard";
import TeacherAddEditAnnouncement from "./announcement/TeacherAddEditAnnouncement";
// 🔁 API bersama
import { fetchTeacherHome, TEACHER_HOME_QK, } from "./class/types/teacher";
import ParentTopBar from "../components/home/ParentTopBar";
import ParentSidebar from "../components/home/ParentSideBar";
import AddSchedule from "./dashboard/AddSchedule";
import { useNavigate, useParams } from "react-router-dom";
/* ================= Date/Time Utils (timezone-safe) ================ */
/** Jadikan Date pada pukul 12:00 waktu lokal (hindari crossing hari) */
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
/** ISO string aman (siang lokal) dari Date */
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
/** Normalisasi ISO apapun menjadi ISO siang lokal, menjaga tanggal lokal */
const normalizeISOToLocalNoon = (iso) => iso ? toLocalNoonISO(new Date(iso)) : undefined;
/** Start of day lokal untuk perbandingan range tanggal */
const startOfDay = (d = new Date()) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};
/** Formatter pendek (gunakan ISO yang sudah dinormalisasi agar aman) */
const fmtShort = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
    })
    : "-";
/** Formatter panjang (gunakan ISO yang sudah dinormalisasi agar aman) */
const fmtLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "";
const hijriLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "";
function KpiTile({ palette, label, value, icon, }) {
    return (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 flex items-center gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: { background: palette.primary2, color: palette.primary }, children: icon }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: label }), _jsx("div", { className: "text-xl font-semibold", children: value })] })] }) }));
}
/* ================= Page ================= */
export default function TeacherDashboard() {
    // Thema
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // Query data utama (API bersama)
    const { data, isLoading } = useQuery({
        queryKey: TEACHER_HOME_QK,
        queryFn: fetchTeacherHome,
        staleTime: 60_000,
    });
    // 🔒 Normalisasi tanggal dari API ke "siang lokal" agar topbar & hijriah stabil
    const normalizedGregorianISO = normalizeISOToLocalNoon(data?.gregorianDate) ?? toLocalNoonISO(new Date());
    /* -------- Jadwal 3 HARI KE DEPAN (fallback: hari ini) -------- */
    const scheduleItemsNext3Days = useMemo(() => {
        const upcomingRaw = data?.upcomingClasses ?? [];
        // Normalisasi semua dateISO ke siang lokal sebelum dibandingkan
        const upcoming = upcomingRaw.map((c) => ({
            ...c,
            dateISO: normalizeISOToLocalNoon(c.dateISO),
        }));
        const start = startOfDay(new Date()); // hari ini 00:00 lokal
        const end = startOfDay(new Date());
        end.setDate(end.getDate() + 2); // +2 = total 3 hari (hari ini s/d lusa)
        const within3Days = upcoming.filter((c) => {
            if (!c.dateISO)
                return false;
            const d = startOfDay(new Date(c.dateISO));
            return d >= start && d <= end;
        });
        const src = within3Days.length > 0 ? within3Days : (data?.todayClasses ?? []);
        return src.map((c) => {
            const datePart = c.dateISO ? fmtShort(c.dateISO) + " • " : "";
            return {
                time: c.time,
                title: `${c.className} — ${c.subject}`,
                room: c.dateISO ? `${datePart}${c.room ?? "-"}` : c.room,
            };
        });
    }, [data?.upcomingClasses, data?.todayClasses]);
    /* -------- Daftar Jadwal (mock terpisah untuk demo) -------- */
    const [listScheduleItems, setListScheduleItems] = useState([]);
    useEffect(() => {
        const daftar = [
            { time: "10:30", title: "TPA C — Fiqih Ibadah", room: "R. 2" },
            { time: "13:00", title: "TPA D — Tahfiz Juz 29", room: "Aula 2" },
            { time: "15:30", title: "TPA A — Mentoring Guru", room: "R. Meeting" },
        ];
        const key3Hari = new Set(scheduleItemsNext3Days.map((t) => `${t.time}|${t.title}`));
        setListScheduleItems(daftar.filter((d) => !key3Hari.has(`${d.time}|${d.title}`)));
    }, [scheduleItemsNext3Days]);
    /* -------- Pengumuman (seed dari API, lalu local mutate) -------- */
    const [announcements, setAnnouncements] = useState([]);
    const [announceOpen, setAnnounceOpen] = useState(false);
    const [announceInitial, setAnnounceInitial] = useState(null);
    const [announceSaving, setAnnounceSaving] = useState(false);
    const [announceError, setAnnounceError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    useEffect(() => {
        setAnnouncements(data?.announcements ?? []);
    }, [data?.announcements]);
    const handleSubmitAnnouncement = async (form) => {
        try {
            setAnnounceSaving(true);
            setAnnounceError(null);
            if (form.id) {
                // EDIT (sementara local)
                setAnnouncements((prev) => prev.map((a) => a.id === form.id
                    ? { ...a, title: form.title, date: form.date, body: form.body }
                    : a));
            }
            else {
                // ADD (sementara local)
                const id = `temp-${Date.now()}`;
                setAnnouncements((prev) => [
                    {
                        id,
                        title: form.title,
                        date: form.date,
                        body: form.body,
                        type: "info",
                    },
                    ...prev,
                ]);
            }
            setAnnounceOpen(false);
            setAnnounceInitial(null);
        }
        catch (e) {
            setAnnounceError(e?.response?.data?.message ?? "Gagal menyimpan pengumuman.");
        }
        finally {
            setAnnounceSaving(false);
        }
    };
    const handleDeleteAnnouncement = async (a) => {
        const res = await Swal.fire({
            title: "Hapus pengumuman?",
            text: `“${a.title}” akan dihapus permanen.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
            confirmButtonColor: palette.error1,
            cancelButtonColor: palette.silver2,
            focusCancel: true,
        });
        if (!res.isConfirmed)
            return;
        try {
            setDeletingId(a.id);
            Swal.fire({
                title: "Menghapus…",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
                showConfirmButton: false,
                background: palette.white1,
            });
            // TODO: await axios.delete(`/api/u/announcements/${a.id}`)
            setAnnouncements((prev) => prev.filter((x) => x.id !== a.id));
            await Swal.fire({
                title: "Terhapus",
                text: "Pengumuman berhasil dihapus.",
                icon: "success",
                timer: 1400,
                showConfirmButton: false,
                background: palette.white1,
            });
        }
        finally {
            setDeletingId(null);
        }
    };
    /* -------- Modal: Tambah Jadwal -------- */
    const [showTambahJadwal, setShowTambahJadwal] = useState(false);
    const managedClasses = useMemo(() => {
        const map = new Map();
        (data?.todayClasses ?? []).forEach((c) => {
            const key = c.className;
            if (!map.has(key)) {
                map.set(key, {
                    id: key.toLowerCase().replace(/\s+/g, "-"),
                    name: key,
                    students: c.studentCount,
                    lastSubject: c.subject,
                });
            }
        });
        return Array.from(map.values());
    }, [data?.todayClasses]);
    const { slug } = useParams();
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Dashboard Pengajar", gregorianDate: normalizedGregorianISO, hijriDate: hijriLong(normalizedGregorianISO) }), _jsx(AddSchedule, { open: showTambahJadwal, onClose: () => setShowTambahJadwal(false), palette: palette, onSubmit: (item) => {
                    // Demo realtime lokal; nantinya POST + invalidateQueries(TEACHER_HOME_QK)
                    setListScheduleItems((prev) => [...prev, item].sort((a, b) => a.time.localeCompare(b.time)));
                } }), _jsx(TeacherAddEditAnnouncement, { palette: palette, open: announceOpen, onClose: () => {
                    setAnnounceOpen(false);
                    setAnnounceInitial(null);
                }, initial: announceInitial, onSubmit: handleSubmitAnnouncement, saving: announceSaving, error: announceError }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
                                        { label: "Guru", value: 26, icon: _jsx(UserCog, { size: 18 }) },
                                        { label: "Siswa", value: 342, icon: _jsx(Users, { size: 18 }) },
                                        {
                                            label: "Program",
                                            value: 12,
                                            icon: _jsx(GraduationCap, { size: 18 }),
                                        },
                                        { label: "Kelas", value: 18, icon: _jsx(BookOpen, { size: 18 }) },
                                    ].map((k) => (_jsx(KpiTile, { palette: palette, label: k.label, value: k.value, icon: k.icon }, k.label))) }), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch", children: [_jsx("div", { className: "lg:col-span-6", children: _jsx(TodayScheduleCard, { palette: palette, items: scheduleItemsNext3Days.slice(0, 3), seeAllPath: "schedule-3-hari" // ⬅️ route ke komponen baru
                                                , seeAllState: { items: scheduleItemsNext3Days }, addLabel: "Tambah Jadwal", title: "Jadwal 3 Hari Kedepan", onAdd: () => setShowTambahJadwal(true) }) }), _jsx("div", { className: "lg:col-span-6", children: _jsxs(SectionCard, { palette: palette, children: [_jsx("div", { className: "p-4 md:p-5 pb-2 font-medium flex items-center gap-2", children: _jsxs("div", { className: " pb-1 font-medium flex items-center gap-2 md:-mt-1", children: [_jsx("div", { className: "h-9 w-9 rounded-xl flex items-center justify-center ", style: {
                                                                        background: palette.white3,
                                                                        color: palette.quaternary,
                                                                    }, children: _jsx(Users, { size: 18 }) }), _jsx("h1", { className: "text-base font-semibold", children: "Kelas yang Saya Kelola" })] }) }), _jsx("div", { className: "px-4 md:px-5 pb-4 grid gap-2", children: managedClasses.length > 0 ? (managedClasses.map((c) => (_jsx(MyClassItem, { name: c.name, students: c.students, lastSubject: c.lastSubject, palette: palette }, c.id)))) : (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Belum ada kelas terdaftar." })) })] }) })] }), _jsxs("section", { children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("h3", { className: "font-medium", children: "Pengumuman" }) }), _jsx(AnnouncementsList, { palette: palette, items: announcements, dateFmt: (iso) => fmtLong(normalizeISOToLocalNoon(iso)), seeAllState: { announcements }, seeAllPath: "all-announcement-teacher", getDetailHref: (a) => `/${slug}/guru/all-announcement-teacher/detail/${a.id}`, 
                                            // showActions
                                            canAdd: false, onEdit: (a) => {
                                                setAnnounceInitial({
                                                    id: a.id,
                                                    title: a.title,
                                                    date: a.date,
                                                    body: a.body,
                                                });
                                                setAnnounceOpen(true);
                                            }, onDelete: handleDeleteAnnouncement, deletingId: deletingId })] }), isLoading && (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Memuat data dashboard\u2026" }))] })] }) })] }));
}
/* ================= Small UI helpers ================= */
function MyClassItem({ name, students, lastSubject, palette, }) {
    const navigate = useNavigate();
    const { slug } = useParams();
    return (_jsxs("div", { className: "flex items-center justify-between rounded-xl border px-3 py-2", style: { borderColor: palette.silver1, background: palette.white2 }, children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: name }), _jsxs("div", { className: "text-sm truncate", style: { color: palette.black2 }, children: [typeof students === "number" ? `${students} siswa` : "—", " ", lastSubject ? `• ${lastSubject}` : ""] })] }), _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: () => navigate(`/${slug}/guru/management-class/${name}`, {
                    state: { className: name, students, lastSubject },
                }), children: "Kelola" })] }));
}
