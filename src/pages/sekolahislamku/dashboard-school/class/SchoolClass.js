import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/classes/SchoolClasses.tsx
import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, Link, useParams, useNavigate, } from "react-router-dom";
import { Filter as FilterIcon, Plus, Layers, ChevronDown, ArrowLeft, } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "../../components/home/ParentSideBar";
import TambahKelas from "./components/AddClass";
import TambahLevel from "./components/AddLevel";
import axios from "@/lib/axios";
/* ================= Helpers ================= */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "";
const hijriWithWeekday = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const parseGrade = (code, name) => {
    const from = (code ?? name ?? "").toString();
    const m = from.match(/\d+/);
    return m ? m[0] : "-";
};
const scheduleToText = (sch) => {
    if (!sch)
        return "-";
    const days = (sch.days ?? []).join(", ");
    const time = [sch.start, sch.end].every(Boolean)
        ? `${sch.start}–${sch.end}`
        : sch.start || sch.end || "";
    const loc = sch.location ? ` @${sch.location}` : "";
    const left = [days, time].filter(Boolean).join(" ");
    return left ? `${left}${loc}` : "-";
};
const getShiftFromSchedule = (sch) => {
    if (!sch?.start)
        return "-";
    const [hh] = sch.start.split(":").map((x) => parseInt(x, 10));
    if (Number.isNaN(hh))
        return "-";
    return hh < 12 ? "Pagi" : "Sore";
};
const uid = (p = "tmp") => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
/* ================= Dummy Data ================= */
const DUMMY_LEVELS = [
    {
        id: "lv-1",
        name: "SD Kelas 1",
        slug: "sd-1",
        level: "1",
        fee: 150000,
        is_active: true,
    },
    {
        id: "lv-2",
        name: "SD Kelas 2",
        slug: "sd-2",
        level: "2",
        fee: 150000,
        is_active: true,
    },
];
const DUMMY_CLASSES = [
    {
        id: "cls-1",
        code: "1A",
        name: "Kelas 1A",
        grade: "1",
        homeroom: "Ahmad Fauzi",
        studentCount: 28,
        schedule: "Senin, Rabu, Jumat 07:30–09:30 @Ruang A1",
        status: "active",
        classId: "lv-1",
    },
    {
        id: "cls-2",
        code: "1B",
        name: "Kelas 1B",
        grade: "1",
        homeroom: "Siti Nurhaliza",
        studentCount: 26,
        schedule: "Selasa & Kamis 08:00–10:00 @Ruang A2",
        status: "inactive",
        classId: "lv-1",
    },
    {
        id: "cls-3",
        code: "2A",
        name: "Kelas 2A",
        grade: "2",
        homeroom: "Budi Santoso",
        studentCount: 30,
        schedule: "Senin–Kamis 09:00–11:00 @Ruang B1",
        status: "active",
        classId: "lv-2",
    },
];
/* ================= Fetchers ================= */
async function fetchClassSections({ q, status, classId, }) {
    const params = {};
    if (q?.trim())
        params.search = q.trim();
    if (status && status !== "all")
        params.active_only = status === "active";
    if (classId)
        params.class_id = classId;
    const res = await axios.get("/api/a/class-sections", {
        params,
    });
    return res.data?.data ?? [];
}
function mapLevelRow(x) {
    return {
        id: x.class_id,
        name: x.class_name,
        slug: x.class_slug,
        level: x.class_level ?? null,
        fee: x.class_fee_monthly_idr ?? null,
        is_active: x.class_is_active,
    };
}
async function fetchLevels() {
    const res = await axios.get("/api/a/classes");
    return (res.data?.data ?? []).map(mapLevelRow);
}
/* ================= UI ================= */
function SelectBox({ value, onChange, children, palette, className = "", }) {
    return (_jsxs("div", { className: `relative ${className}`, children: [_jsx("select", { value: value, onChange: onChange, className: "w-full h-11 rounded-lg border pl-3 pr-10 bg-transparent text-sm appearance-none", style: { borderColor: palette.silver1, color: palette.black1 }, children: children }), _jsx(ChevronDown, { size: 16, className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" })] }));
}
/* ================= Page ================= */
const SchoolClass = ({ showBack = false, backTo, backLabel = "Kembali", }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const [sp, setSp] = useSearchParams();
    const qc = useQueryClient();
    const [openTambah, setOpenTambah] = useState(false);
    const [openTambahLevel, setOpenTambahLevel] = useState(false);
    const { slug = "" } = useParams();
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    const q = (sp.get("q") ?? "").trim();
    const status = (sp.get("status") ?? "all");
    const shift = (sp.get("shift") ?? "all");
    const levelId = sp.get("level_id") ?? "";
    const levelsQ = useQuery({
        queryKey: ["levels"],
        queryFn: fetchLevels,
        staleTime: 60_000,
    });
    const { data: apiItems, isLoading, refetch, isFetching, } = useQuery({
        queryKey: ["class-sections", q, status, levelId],
        queryFn: () => fetchClassSections({ q, status, classId: levelId || undefined }),
        staleTime: 60_000,
    });
    useEffect(() => {
        if (!openTambah)
            refetch();
    }, [openTambah, refetch]);
    const mappedRows = useMemo(() => (apiItems ?? []).map((it) => ({
        id: it.class_sections_id,
        classId: it.class_sections_class_id,
        code: it.class_sections_code ?? "-",
        name: it.class_sections_name,
        grade: parseGrade(it.class_sections_code, it.class_sections_name),
        homeroom: it.teacher?.user_name ?? "-",
        studentCount: 0,
        schedule: scheduleToText(it.class_sections_schedule),
        status: it.class_sections_is_active ? "active" : "inactive",
    })), [apiItems]);
    const filteredRows = useMemo(() => {
        return mappedRows.filter((r) => {
            const apiItem = (apiItems ?? []).find((x) => x.class_sections_id === r.id);
            const rowShift = getShiftFromSchedule(apiItem?.class_sections_schedule);
            return shift === "all" || rowShift === shift;
        });
    }, [mappedRows, shift, apiItems]);
    const sectionCountByLevel = useMemo(() => {
        const m = new Map();
        mappedRows.forEach((r) => {
            if (r.classId)
                m.set(r.classId, (m.get(r.classId) ?? 0) + 1);
        });
        return m;
    }, [mappedRows]);
    const setParam = (k, v) => {
        const next = new URLSearchParams(sp);
        v ? next.set(k, v) : next.delete(k);
        setSp(next, { replace: true });
    };
    const items = filteredRows.length > 0 ? filteredRows : DUMMY_CLASSES;
    const levels = levelsQ.data && levelsQ.data.length > 0 ? levelsQ.data : DUMMY_LEVELS;
    const toSlug = (s) => (s || "level-baru").toLowerCase().trim().replace(/\s+/g, "-");
    const handleLevelCreated = (payload) => {
        const lvl = {
            id: payload?.id ?? uid("lv"),
            name: payload?.name ?? "Level Baru",
            slug: payload?.slug ?? toSlug(payload?.name ?? ""),
            level: payload?.level ?? null,
            fee: payload?.fee ?? null,
            is_active: payload?.is_active ?? true,
        };
        qc.setQueryData(["levels"], (old = []) => [lvl, ...(old ?? [])]);
        setOpenTambahLevel(false);
    };
    const handleClassCreated = (row) => {
        const dummy = {
            class_sections_id: row.id ?? uid("sec"),
            class_sections_class_id: row.classId ?? levels[0]?.id ?? "",
            class_sections_masjid_id: row.masjidId ?? "",
            class_sections_teacher_id: row.teacherId ?? null,
            class_sections_slug: row.slug ?? toSlug(row.name ?? "kelas-baru"),
            class_sections_name: row.name ?? "Kelas Baru",
            class_sections_code: row.code ?? "-",
            class_sections_capacity: row.capacity ?? null,
            class_sections_schedule: row.schedule ?? {
                days: [],
                start: undefined,
                end: undefined,
            },
            class_sections_is_active: row.is_active ?? true,
            class_sections_created_at: new Date().toISOString(),
            class_sections_updated_at: new Date().toISOString(),
            teacher: row.teacher
                ? {
                    id: row.teacher.id ?? uid("tch"),
                    user_name: row.teacher.user_name ?? "Guru Baru",
                    email: row.teacher.email ?? "",
                    is_active: row.teacher.is_active ?? true,
                }
                : null,
        };
        qc.setQueryData(["class-sections", q, status, levelId], (old = []) => [dummy, ...(old ?? [])]);
        setOpenTambah(false);
    };
    return (_jsxs("div", { className: "h-full w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Kelas", gregorianDate: new Date().toISOString(), hijriDate: hijriWithWeekday(new Date().toISOString()), showBack: isFromMenuUtama }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [showBack && (_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => (backTo ? navigate(backTo) : navigate(-1)), className: "inline-flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) })), _jsx("h1", { className: "text-lg font-semibold", children: "Seluruh Kelas" })] }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "flex p-4 md:p-5 pb-2 items-center justify-between", children: [_jsxs("div", { className: "font-medium flex items-center gap-2", children: [_jsx(Layers, { size: 18 }), " Tingkat"] }), _jsxs(Btn, { palette: palette, variant: "outline", onClick: () => setOpenTambahLevel(true), children: [_jsx(Layers, { size: 16, className: "mr-2" }), " Tambah Level"] })] }), _jsxs("div", { className: "px-4 md:px-5 pb-4 flex flex-wrap gap-2", children: [_jsx("button", { className: `px-3 py-1.5 rounded-lg border text-sm ${!levelId ? "font-semibold" : ""}`, style: {
                                                        borderColor: palette.silver1,
                                                        background: !levelId ? palette.primary2 : palette.white1,
                                                        color: !levelId ? palette.primary : palette.quaternary,
                                                    }, onClick: () => setParam("level_id", ""), children: "Semua Tingkat" }), levels.map((lv) => {
                                                    const cnt = sectionCountByLevel.get(lv.id) ?? 0;
                                                    const active = levelId === lv.id;
                                                    return (_jsxs("button", { className: `px-3 py-1.5 rounded-lg border text-sm ${active ? "font-semibold" : ""}`, style: {
                                                            borderColor: palette.silver1,
                                                            background: active ? palette.primary2 : palette.white1,
                                                            color: active ? palette.primary : palette.quaternary,
                                                        }, onClick: () => setParam("level_id", lv.id), children: [lv.name, " ", _jsxs("span", { style: { color: palette.black2 }, children: ["(", cnt, ")"] })] }, lv.id));
                                                })] })] }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 font-medium flex items-center gap-2", children: [_jsx(FilterIcon, { size: 18 }), " Filter"] }), _jsxs("div", { className: "px-4 md:px-5 pb-4 grid grid-cols-1 md:grid-cols-5 gap-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("div", { className: "text-sm mb-1", children: "Pencarian" }), _jsx("input", { placeholder: "Cari slug/nama/kode\u2026", defaultValue: sp.get("q") ?? "", onKeyDown: (e) => {
                                                                if (e.key === "Enter")
                                                                    setParam("q", e.target.value);
                                                            }, className: "w-full h-11 rounded-lg border px-3 bg-transparent text-sm", style: { borderColor: palette.silver1 } })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm mb-1", children: "Shift" }), _jsxs(SelectBox, { value: shift, onChange: (e) => setParam("shift", e.target.value), palette: palette, children: [_jsx("option", { value: "all", children: "Semua" }), _jsx("option", { value: "Pagi", children: "Pagi" }), _jsx("option", { value: "Sore", children: "Sore" })] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm mb-1", children: "Status" }), _jsxs(SelectBox, { value: status, onChange: (e) => setParam("status", e.target.value), palette: palette, children: [_jsx("option", { value: "all", children: "Semua" }), _jsx("option", { value: "active", children: "Aktif" }), _jsx("option", { value: "inactive", children: "Nonaktif" })] })] })] })] }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 flex items-center justify-between", children: [_jsx("div", { className: "font-medium", children: "Daftar Kelas" }), _jsxs(Btn, { palette: palette, onClick: () => setOpenTambah(true), children: [_jsx(Plus, { className: "mr-2", size: 16 }), " Tambah Kelas"] })] }), _jsxs("div", { className: "px-4 md:px-5 pb-4 overflow-x-auto", children: [_jsxs("table", { className: "min-w-[800px] w-full text-sm", children: [_jsx("thead", { className: "text-left border-b", style: {
                                                                color: palette.black2,
                                                                borderColor: palette.silver1,
                                                            }, children: _jsxs("tr", { children: [_jsx("th", { className: "py-2 pr-4", children: "Kode" }), _jsx("th", { className: "py-2 pr-4", children: "Nama Kelas" }), _jsx("th", { className: "py-2 pr-4", children: "Tingkat" }), _jsx("th", { className: "py-2 pr-4", children: "Wali Kelas" }), _jsx("th", { className: "py-2 pr-4", children: "Siswa" }), _jsx("th", { className: "py-2 pr-4", children: "Jadwal" }), _jsx("th", { className: "py-2 pr-4", children: "Status" }), _jsx("th", { className: "py-2 pr-2 text-right", children: "Aksi" })] }) }), _jsx("tbody", { className: "divide-y", style: { borderColor: palette.silver1 }, children: isLoading || isFetching ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "py-6 text-center", children: "Memuat data\u2026" }) })) : items.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "py-6 text-center", children: "Tidak ada data yang cocok." }) })) : (items.map((r) => (_jsxs("tr", { className: "align-middle", children: [_jsx("td", { className: "py-3 pr-4 font-medium", children: r.code }), _jsx("td", { className: "py-3 pr-4", children: r.name }), _jsx("td", { className: "py-3 pr-4", children: r.grade }), _jsx("td", { className: "py-3 pr-4", children: r.homeroom }), _jsx("td", { className: "py-3 pr-4", children: r.studentCount }), _jsx("td", { className: "py-3 pr-4", children: r.schedule }), _jsx("td", { className: "py-3 pr-4", children: _jsx(Badge, { palette: palette, variant: r.status === "active" ? "success" : "outline", children: r.status === "active" ? "Aktif" : "Nonaktif" }) }), _jsx("td", { className: "py-3 pr-2", children: _jsx("div", { className: "flex justify-end gap-2", children: _jsx(Link, { to: `/${slug}/sekolah/kelas/detail/${r.id}`, children: _jsx(Btn, { palette: palette, variant: "outline", size: "sm", children: "Kelola" }) }) }) })] }, r.id)))) })] }), _jsxs("div", { className: "pt-3 flex items-center justify-between text-sm", style: { color: palette.black2 }, children: [_jsxs("div", { children: ["Menampilkan ", items.length, " kelas"] }), _jsx("button", { onClick: () => refetch(), className: "underline", children: "Refresh" })] })] })] })] })] }) }), _jsx(TambahLevel, { open: openTambahLevel, onClose: () => setOpenTambahLevel(false), onCreated: handleLevelCreated, palette: palette }), _jsx(TambahKelas, { open: openTambah, onClose: () => setOpenTambah(false), palette: palette, onCreated: handleClassCreated })] }));
};
export default SchoolClass;
