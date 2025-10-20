import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/TeacherAttendancePage.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Users, CheckCircle2, Thermometer, FileCheck2, XCircle, Search, Save, Check, GraduationCap, } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, ProgressBar, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "../../components/home/ParentTopBar";
import ParentSidebar from "../../components/home/ParentSideBar";
const STATUS_OPTIONS = [
    { key: "hadir", label: "Hadir" },
    { key: "sakit", label: "Sakit" },
    { key: "izin", label: "Izin" },
    { key: "alpa", label: "Alpa" },
];
/* ========================================
   Helpers
======================================== */
const toISODate = (d) => d.toISOString().slice(0, 10);
const idDateLong = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});
const nowHHMM = () => {
    const t = new Date();
    return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
};
/* ========================================
   Fake APIs (gampang diganti backend)
======================================== */
async function fetchTeacherClasses() {
    return Promise.resolve([
        { id: "tpa-a", name: "TPA A", room: "Aula 1", studentsCount: 22 },
        { id: "tpa-b", name: "TPA B", room: "Aula 2", studentsCount: 20 },
        { id: "tpa-c", name: "TPA C", room: "Aula 3", studentsCount: 18 },
    ]);
}
async function fetchRoster(classId) {
    // bisa dihubungkan dengan classId
    return Promise.resolve([
        { id: "s1", name: "Ahmad" },
        { id: "s2", name: "Fatimah" },
        { id: "s3", name: "Hasan" },
        { id: "s4", name: "Aisyah" },
        { id: "s5", name: "Umar" },
        { id: "s6", name: "Zainab" },
        { id: "s7", name: "Bilal" },
    ]);
}
/* ========================================
   LocalStorage store (keyed by class+date)
======================================== */
const LS_KEY = "tpa_attend_progress_v1";
const makeKey = (classId, dateISO) => `${classId}__${dateISO}`;
function readStore() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : {};
    }
    catch {
        return {};
    }
}
function writeStore(s) {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
}
function loadOrCreateDoc(classId, dateISO, roster) {
    const s = readStore();
    const key = makeKey(classId, dateISO);
    const exist = s[key];
    if (exist)
        return exist;
    const doc = {
        classId,
        dateISO,
        entries: roster.map((st) => ({
            studentId: st.id,
            status: null, // wajib tapi belum diisi
        })),
    };
    s[key] = doc;
    writeStore(s);
    return doc;
}
function saveDoc(doc) {
    const s = readStore();
    s[makeKey(doc.classId, doc.dateISO)] = doc;
    writeStore(s);
}
/* ========================================
   UI bits (kecil & reusable)
======================================== */
function StatusBadge({ s, palette }) {
    const map = {
        hadir: {
            v: "success",
            label: "Hadir",
            icon: _jsx(CheckCircle2, { size: 12, className: "mr-1" }),
        },
        sakit: {
            v: "warning",
            label: "Sakit",
            icon: _jsx(Thermometer, { size: 12, className: "mr-1" }),
        },
        izin: {
            v: "secondary",
            label: "Izin",
            icon: _jsx(FileCheck2, { size: 12, className: "mr-1" }),
        },
        alpa: {
            v: "destructive",
            label: "Alpa",
            icon: _jsx(XCircle, { size: 12, className: "mr-1" }),
        },
    };
    const m = map[s];
    return (_jsx(Badge, { palette: palette, variant: m.v, children: _jsxs("span", { className: "inline-flex items-center", children: [m.icon, m.label] }) }));
}
function StatusSelector({ value, onChange, palette, }) {
    return (_jsx("div", { className: "flex gap-1 overflow-x-auto", "aria-label": "Pilih status", children: STATUS_OPTIONS.map((o) => {
            const active = value === o.key;
            return (_jsx("button", { onClick: () => onChange(o.key), className: "px-3 h-8 rounded-full border text-xs whitespace-nowrap", style: {
                    background: active ? palette.primary2 : palette.white2,
                    color: active ? palette.primary : palette.black1,
                    borderColor: active ? palette.primary : palette.silver1,
                }, "aria-pressed": active, children: o.label }, o.key));
        }) }));
}
function StatChip({ icon, label, value, palette, }) {
    return (_jsxs("div", { className: "px-3 py-2 rounded-xl border text-sm flex items-center gap-2", style: { borderColor: palette.silver1, background: palette.white2 }, role: "status", "aria-label": `${label}: ${value}`, children: [icon, _jsx("span", { className: "text-xs", style: { color: palette.silver2 }, children: label }), _jsx("span", { className: "font-semibold", children: value })] }));
}
/* ====== Modal editor siswa ====== */
function StudentDetailEditor({ open, onClose, palette, name, value, onSave, }) {
    const [data, setData] = useState(value);
    useEffect(() => {
        if (!open)
            return;
        setData(value);
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, value, onClose]);
    if (!open)
        return null;
    const mustTime = data.status === "hadir";
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center p-3 md:p-6", role: "dialog", "aria-modal": "true", onClick: onClose, style: { background: "rgba(0,0,0,0.35)" }, children: _jsxs("div", { onClick: (e) => e.stopPropagation(), className: "w-full max-w-2xl rounded-2xl shadow-lg flex flex-col overflow-hidden", style: {
                background: palette.white1,
                color: palette.black1,
                border: `1px solid ${palette.silver1}`,
                maxHeight: "86vh",
            }, children: [_jsxs("div", { className: "p-4 md:p-5 border-b sticky top-0 bg-inherit", style: { borderColor: palette.silver1 }, children: [_jsxs("div", { className: "font-semibold", children: ["Absensi & Detail \u2014 ", name] }), _jsx("div", { className: "text-xs mt-1", style: { color: palette.silver2 }, children: "Status & Informasi Umum wajib. Yang lain opsional." })] }), _jsxs("div", { className: "p-4 md:p-5 space-y-4 overflow-y-auto min-h-0", style: { WebkitOverflowScrolling: "touch" }, children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs mb-1", style: { color: palette.silver2 }, children: "Status (WAJIB)" }), _jsx(StatusSelector, { value: data.status ?? null, onChange: (s) => setData((v) => ({ ...v, status: s })), palette: palette })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Jam (opsional, aktif saat Hadir)" }), _jsx("input", { type: "time", disabled: !mustTime, value: data.time ?? "", onChange: (e) => setData((s) => ({ ...s, time: e.target.value || undefined })), className: "h-9 w-full rounded-xl px-3 text-sm disabled:opacity-60", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                border: `1px solid ${palette.silver1}`,
                                            } })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Nilai (0\u2013100) \u2014 OPSIONAL" }), _jsx("input", { type: "number", min: 0, max: 100, value: typeof data.score === "number" ? data.score : "", onChange: (e) => setData((s) => ({
                                                ...s,
                                                score: e.target.value === ""
                                                    ? undefined
                                                    : Number(e.target.value),
                                            })), className: "h-9 w-full rounded-xl px-3 text-sm", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                border: `1px solid ${palette.silver1}`,
                                            }, placeholder: "contoh: 89" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Materi Personal (OPSIONAL)" }), _jsx("input", { value: data.materiPersonal ?? "", onChange: (e) => setData((s) => ({ ...s, materiPersonal: e.target.value })), className: "h-9 w-full rounded-xl px-3 text-sm", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, placeholder: "Membaca Al-Baqarah 255\u2013257" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Penilaian Personal (OPSIONAL)" }), _jsx("textarea", { value: data.penilaianPersonal ?? "", onChange: (e) => setData((s) => ({ ...s, penilaianPersonal: e.target.value })), className: "min-h-[70px] w-full rounded-xl px-3 py-2 text-sm", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, placeholder: "Budi bercanda di kelas\u2026" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "Hafalan (OPSIONAL)" }), _jsx("input", { value: data.hafalan ?? "", onChange: (e) => setData((s) => ({ ...s, hafalan: e.target.value })), className: "h-9 w-full rounded-xl px-3 text-sm", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                border: `1px solid ${palette.silver1}`,
                                            }, placeholder: "An-Naba 1\u201310" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.silver2 }, children: "PR (OPSIONAL)" }), _jsx("input", { value: data.pr ?? "", onChange: (e) => setData((s) => ({ ...s, pr: e.target.value })), className: "h-9 w-full rounded-xl px-3 text-sm", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                border: `1px solid ${palette.silver1}`,
                                            }, placeholder: "An-Naba 11\u201315 tambah hafalan" })] })] })] }), _jsxs("div", { className: "p-4 md:p-5 pt-0 flex items-center justify-end gap-2 border-t bg-inherit sticky bottom-0", style: { borderColor: palette.silver1 }, children: [_jsx(Btn, { variant: "white1", size: "sm", palette: palette, onClick: onClose, children: "Batal" }), _jsx(Btn, { variant: "default", size: "sm", palette: palette, onClick: () => {
                                if (!data.status)
                                    return alert("Status wajib diisi.");
                                onSave(data);
                                onClose();
                            }, children: "Simpan" })] })] }) }));
}
/* ========================================
   Main Page
======================================== */
export default function TeacherAttendancePage({ classId: initialClassId = "tpa-a", }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // ----- state utama
    const [classId, setClassId] = useState(initialClassId);
    const [dateISO, setDateISO] = useState(() => toISODate(new Date()));
    const [doc, setDoc] = useState(null);
    const [q, setQ] = useState("");
    const [filter, setFilter] = useState("all");
    const [editing, setEditing] = useState(null);
    // ----- data kelas & roster
    const { data: classList } = useQuery({
        queryKey: ["teacher-classes"],
        queryFn: fetchTeacherClasses,
        staleTime: 5 * 60_000,
    });
    const currentClass = useMemo(() => classList?.find((c) => c.id === classId), [classList, classId]);
    const { data: roster } = useQuery({
        queryKey: ["teacher-roster", classId],
        queryFn: () => fetchRoster(classId),
        staleTime: 60_000,
    });
    // ----- load/create dokumen saat class/date/roster berubah
    useEffect(() => {
        if (!roster)
            return;
        const d = loadOrCreateDoc(classId, dateISO, roster);
        setDoc(d);
    }, [classId, dateISO, roster]);
    // ----- autosave draft (debounce ringan)
    useEffect(() => {
        if (!doc)
            return;
        const t = setTimeout(() => saveDoc(doc), 300);
        return () => clearTimeout(t);
    }, [doc]);
    // ----- helper map id->student
    const mapStudent = useMemo(() => {
        const m = new Map();
        (roster ?? []).forEach((s) => m.set(s.id, s));
        return m;
    }, [roster]);
    // ----- update helpers
    const setEntry = useCallback((studentId, patch) => {
        if (!doc)
            return;
        setDoc({
            ...doc,
            entries: doc.entries.map((e) => e.studentId === studentId ? { ...e, ...patch } : e),
        });
    }, [doc]);
    // (optional util) tandai semua hadir — *tidak dipakai UI*, tapi rapi
    const markAll = useCallback(() => {
        if (!doc)
            return;
        const t = nowHHMM();
        setDoc({
            ...doc,
            entries: doc.entries.map((e) => ({
                ...e,
                status: "hadir",
                time: e.time ?? t,
            })),
        });
    }, [doc]);
    const clearAll = useCallback(() => {
        if (!doc)
            return;
        setDoc({
            ...doc,
            entries: doc.entries.map((e) => ({
                ...e,
                status: null,
                time: undefined,
            })),
            finalized: false,
        });
    }, [doc]);
    // ----- ringkasan
    const counts = useMemo(() => {
        const base = {
            hadir: 0,
            online: 0, // disimpan utk kompatibilitas UI lama
            sakit: 0,
            izin: 0,
            alpa: 0,
            total: doc?.entries.length ?? 0,
            recorded: 0,
        };
        if (!doc)
            return base;
        for (const e of doc.entries) {
            if (e.status) {
                base.recorded += 1;
                base[e.status] += 1;
            }
        }
        return base;
    }, [doc]);
    const infoFilledPct = useMemo(() => {
        const total = doc?.entries.length ?? 0;
        if (!doc || total === 0)
            return 0;
        const n = doc.entries.filter((e) => e.infoUmum && e.infoUmum.trim()).length;
        return Math.round((n / total) * 100);
    }, [doc]);
    // ----- filter + search
    const filtered = useMemo(() => {
        if (!doc)
            return [];
        const withName = doc.entries
            .map((e) => ({ ...e, name: mapStudent.get(e.studentId)?.name ?? "-" }))
            .sort((a, b) => a.name.localeCompare(b.name));
        const byStatus = filter === "all" ? withName : withName.filter((e) => e.status === filter);
        const qtrim = q.trim().toLowerCase();
        return qtrim
            ? byStatus.filter((e) => e.name.toLowerCase().includes(qtrim))
            : byStatus;
    }, [doc, mapStudent, filter, q]);
    // ----- finalisasi (validasi wajib)
    const finalize = useCallback(() => {
        if (!doc)
            return;
        const missingStatus = doc.entries
            .filter((e) => !e.status)
            .map((e) => mapStudent.get(e.studentId)?.name ?? "-");
        const missingInfo = doc.entries
            .filter((e) => !e.infoUmum || !e.infoUmum.trim())
            .map((e) => mapStudent.get(e.studentId)?.name ?? "-");
        if (missingStatus.length || missingInfo.length) {
            const head = "Data wajib belum lengkap:";
            const a = missingStatus.length
                ? `\n- Absensi: ${missingStatus
                    .slice(0, 5)
                    .join(", ")}${missingStatus.length > 5 ? "…" : ""}`
                : "";
            const b = missingInfo.length
                ? `\n- Informasi umum: ${missingInfo
                    .slice(0, 5)
                    .join(", ")}${missingInfo.length > 5 ? "…" : ""}`
                : "";
            alert(head + a + b);
            return;
        }
        const newDoc = { ...doc, finalized: true };
        saveDoc(newDoc);
        setDoc(newDoc);
        alert("Absensi & progress harian dikirim. Barakallahu fiikum!");
    }, [doc, mapStudent]);
    /* ===== UI ===== */
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Absensi & Progress Harian (Guru)", gregorianDate: new Date().toISOString() }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsx(SectionCard, { palette: palette, className: "p-3 md:p-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3", children: [_jsxs("div", { className: "md:col-span-5 flex items-center gap-2", children: [_jsx(GraduationCap, { size: 18, color: palette.quaternary }), _jsx("select", { "aria-label": "Pilih kelas", value: classId, onChange: (e) => setClassId(e.target.value), className: "h-9 min-w-[11rem] rounded-xl px-3 text-sm", style: {
                                                            background: palette.white1,
                                                            color: palette.black1,
                                                            border: `1px solid ${palette.silver1}`,
                                                        }, children: (classList ?? []).map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id))) }), _jsxs("div", { className: "hidden md:flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", palette: palette, children: currentClass?.room ?? "-" }), _jsxs(Badge, { variant: "outline", palette: palette, children: [_jsx(Users, { size: 14, className: "mr-1" }), currentClass?.studentsCount ?? roster?.length ?? 0, " siswa"] })] })] }), _jsxs("div", { className: "md:col-span-3 flex items-center gap-2", children: [_jsx(CalendarDays, { size: 18, color: palette.quaternary }), _jsx("input", { "aria-label": "Pilih tanggal", type: "date", value: dateISO, onChange: (e) => setDateISO(e.target.value), className: "h-9 w-44 sm:w-48 rounded-xl px-3 text-sm", style: {
                                                            background: palette.white1,
                                                            color: palette.black1,
                                                            border: `1px solid ${palette.silver1}`,
                                                        } })] }), _jsx("div", { className: "md:col-span-4", children: _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 h-9 w-full", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                    }, children: [_jsx(Search, { size: 16 }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari siswa\u2026", className: "bg-transparent outline-none text-sm w-full", "aria-label": "Cari siswa", style: { color: palette.black1 } })] }) }), _jsxs("div", { className: "md:hidden text-xs flex flex-wrap items-center gap-2 pl-7", style: { color: palette.silver2 }, children: [_jsxs("span", { children: ["Kelas:", " ", _jsx("span", { className: "font-medium", style: { color: palette.black1 }, children: currentClass?.name ?? "-" })] }), currentClass?.room && _jsxs("span", { children: ["\u2022 ", currentClass.room] }), _jsxs("span", { children: ["\u2022 ", currentClass?.studentsCount ?? roster?.length ?? 0, " siswa"] })] }), _jsx("div", { className: "md:col-span-12", children: _jsx("div", { className: "flex items-center gap-1 overflow-x-auto pt-1", role: "tablist", "aria-label": "Filter status", children: ["all", ...STATUS_OPTIONS.map((s) => s.key)].map((s) => (_jsx("button", { onClick: () => setFilter(s), className: "px-3 h-8 rounded-full border text-xs", style: {
                                                            background: filter === s ? palette.primary2 : palette.white1,
                                                            color: filter === s ? palette.primary : palette.black1,
                                                            borderColor: filter === s ? palette.primary : palette.silver1,
                                                        }, "aria-pressed": filter === s, children: s.toUpperCase() }, s))) }) })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 pb-2", children: [_jsx("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: _jsxs("div", { className: "font-medium flex items-center gap-2", children: [_jsx(Users, { size: 16 }), " Ringkasan \u2014 ", idDateLong(dateISO)] }) }), _jsxs("div", { className: "mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2", children: [_jsx(StatChip, { icon: _jsx(Users, { size: 14 }), label: "Total", value: counts.total, palette: palette }), _jsx(StatChip, { icon: _jsx(CheckCircle2, { size: 14 }), label: "Hadir", value: counts.hadir, palette: palette }), _jsx(StatChip, { icon: _jsx(Thermometer, { size: 14 }), label: "Sakit", value: counts.sakit, palette: palette }), _jsx(StatChip, { icon: _jsx(FileCheck2, { size: 14 }), label: "Izin", value: counts.izin, palette: palette }), _jsx(StatChip, { icon: _jsx(XCircle, { size: 14 }), label: "Alpa", value: counts.alpa, palette: palette })] }), _jsxs("div", { className: "mt-3 grid gap-2", children: [_jsxs("div", { children: [_jsx(ProgressBar, { value: Math.round((counts.hadir / (counts.total || 1)) * 100), palette: palette }), _jsx("div", { className: "mt-1 text-xs", style: { color: palette.silver2 }, children: "Progress absensi (hadir)" })] }), _jsxs("div", { children: [_jsx(ProgressBar, { value: infoFilledPct, palette: palette }), _jsxs("div", { className: "mt-1 text-xs", style: { color: palette.silver2 }, children: ["Kelengkapan \u201CInformasi Umum\u201D (", infoFilledPct, "%)"] })] })] })] }) }), _jsxs(SectionCard, { palette: palette, className: "p-4", children: [_jsxs("div", { className: "text-sm font-medium mb-3 flex items-center gap-2", children: [_jsx("span", { className: "inline-block h-2 w-2 rounded-full", style: { background: palette.quaternary } }), "Filter & Aksi"] }), _jsxs("div", { className: "grid gap-2 sm:gap-3 md:grid-cols-12 items-center", children: [_jsx("div", { className: "md:col-span-5", children: _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 h-10", style: {
                                                            borderColor: palette.silver1,
                                                            background: palette.white1,
                                                        }, children: [_jsx(Search, { size: 16 }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari penilaian / siswa\u2026", className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 } })] }) }), _jsxs("div", { className: "md:col-span-3 flex items-center gap-2", children: [_jsx("span", { className: "text-xs sm:text-sm", style: { color: palette.silver2 }, children: "Kelas" }), _jsx("select", { value: classId, onChange: (e) => setClassId(e.target.value), className: "h-10 rounded-xl px-3 text-sm w-full", style: {
                                                                background: palette.white1,
                                                                color: palette.black1,
                                                                border: `1px solid ${palette.silver1}`,
                                                            }, children: (classList ?? []).map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id))) })] }), _jsx("div", { className: "md:col-span-2", children: _jsx("div", { className: "flex items-center gap-2 overflow-x-auto md:overflow-visible", children: ["Semua", "Belum dinilai", "Progress"].map((t, i) => (_jsx("button", { className: "px-4 h-10 rounded-xl border text-sm whitespace-nowrap", style: {
                                                                background: i === 0 ? palette.primary2 : palette.white1,
                                                                color: i === 0 ? palette.primary : palette.black1,
                                                                borderColor: i === 0 ? palette.primary : palette.silver1,
                                                            }, children: t }, t))) }) }), _jsxs("div", { className: "md:col-span-2 md:justify-self-end flex gap-2", children: [_jsxs(Btn, { palette: palette, size: "sm", children: [_jsx("span", { className: "mr-1", children: "\uFF0B" }), " Buat Penilaian"] }), _jsx(Btn, { palette: palette, size: "sm", variant: "white1", children: "\u2913 Export" })] })] }), _jsxs("div", { className: "mt-3 md:hidden text-xs flex flex-wrap gap-2", style: { color: palette.silver2 }, children: [_jsxs("span", { children: ["Kelas:", " ", _jsx("span", { className: "font-medium", style: { color: palette.black1 }, children: currentClass?.name ?? "-" })] }), currentClass?.room && _jsxs("span", { children: ["\u2022 ", currentClass.room] }), _jsxs("span", { children: ["\u2022 ", currentClass?.studentsCount ?? roster?.length ?? 0, " siswa"] })] })] }), _jsx("div", { className: "sticky bottom-0 z-30", children: _jsx("div", { className: "-mx-4 md:mx-0", children: _jsx("div", { className: "px-3 md:px-4 py-2 md:py-2.5 border-t md:border md:rounded-xl md:shadow-sm backdrop-blur", style: {
                                                borderColor: palette.silver1,
                                                background: `${palette.white1}D9`, // transparan halus
                                            }, children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-2", children: [_jsxs("div", { className: "text-[11px] md:text-xs md:flex-1", style: { color: palette.silver2 }, children: ["Disimpan otomatis ke perangkat.", " ", doc?.finalized ? "Status: Terkirim" : "Status: Draft"] }), _jsxs("div", { className: "flex gap-2 w-full md:w-auto", children: [_jsxs(Btn, { palette: palette, variant: "white1", size: "sm", onClick: () => {
                                                                    if (doc) {
                                                                        saveDoc(doc);
                                                                        alert("Draft disimpan.");
                                                                    }
                                                                }, className: "h-9 md:w-auto w-1/3", children: [_jsx(Save, { className: "mr-1", size: 14 }), " Simpan Draft"] }), _jsxs(Btn, { palette: palette, variant: "default", size: "sm", onClick: finalize, className: "h-10 w-full md:w-[220px] justify-center", children: ["Kirim ", _jsx(Check, { className: "ml-1", size: 14 })] })] })] }) }) }) }), editing && doc && (_jsx(StudentDetailEditor, { open: !!editing, onClose: () => setEditing(null), palette: palette, name: editing.name, value: doc.entries.find((x) => x.studentId === editing.id) ?? {
                                        status: null,
                                        time: undefined,
                                        score: undefined,
                                        materiPersonal: "",
                                        penilaianPersonal: "",
                                        hafalan: "",
                                        pr: "",
                                    }, onSave: (v) => setEntry(editing.id, v) }))] })] }) })] }));
}
