import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
// Theme & utils
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
// UI primitives & layout
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
// Icons
import { Award, Users, CalendarRange, GraduationCap, ArrowLeft, Eye, Download, Filter as FilterIcon, RefreshCcw, Settings2, CheckCircle2, XCircle, } from "lucide-react";
/* ================= Helpers ================= */
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const hijriLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const dateOnly = (iso) => iso ? new Date(iso).toLocaleDateString("id-ID") : "-";
/* ===== nomor sertifikat (dummy generator) ===== */
const genCertNo = (cls, idx) => {
    const yy = String(new Date(cls.issue_date).getFullYear()).slice(2);
    return `${yy}-${cls.name}-${String(idx + 1).padStart(3, "0")}`;
};
const PASS = 75; // ambang kelulusan default
/* ================= ENDPOINTS (pastikan sesuai backend) =================
- GET  /api/a/certificate/classes?month=YYYY-MM
- GET  /api/a/certificate/classes/:classId/finals
- POST /api/a/certificates/publish       { class_id, student_id }
- POST /api/a/certificates/revoke        { class_id, student_id }
- POST /api/a/certificates/publish-bulk  { class_id, student_ids: [] }
- POST /api/a/certificates/revoke-bulk   { class_id, student_ids: [] }
- GET  /api/a/certificates/:classId/:studentId/pdf
- GET  /api/a/certificates/:classId/:studentId/print
- GET  /api/a/certificates/class/:classId/pdf
======================================================================= */
/** Icon-only button helper */
function IconBtn({ title, onClick, disabled, palette, children, }) {
    return (_jsx("button", { type: "button", title: title, "aria-label": title, onClick: onClick, disabled: disabled, className: "h-9 w-9 grid place-items-center rounded-lg border transition", style: {
            borderColor: palette.silver1,
            color: palette.quaternary,
            background: "transparent",
            opacity: disabled ? 0.5 : 1,
        }, children: children }));
}
const SchoolCertificate = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const qc = useQueryClient();
    const gregorianISO = toLocalNoonISO(new Date());
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [month, setMonth] = useState(() => {
        const t = new Date();
        return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
    });
    // Banner feedback sederhana
    const [banner, setBanner] = useState(null);
    const showBanner = (msg) => {
        setBanner(msg);
        setTimeout(() => setBanner(null), 2500);
    };
    /* ================= QUERIES ================= */
    const classesQ = useQuery({
        queryKey: ["certificate-classes", month],
        queryFn: async () => {
            // const { data } = await axios.get("/api/a/certificate/classes", { params: { month } });
            // return data;
            const base = new Date();
            base.setDate(5);
            const y = base.getFullYear();
            const AY = `${y}/${y + 1}`;
            const list = Array.from({ length: 6 }).map((_, i) => {
                const d = new Date(base);
                d.setMonth(base.getMonth() - i);
                return {
                    id: `C-${i + 1}`,
                    name: `${i + 1}${["A", "B"][i % 2]}`,
                    academic_year: AY,
                    issue_date: d.toISOString(),
                    student_count: 20 + (i % 6),
                };
            });
            return { list };
        },
        staleTime: 60_000,
    });
    const classDetailQ = useQuery({
        queryKey: ["certificate-class-detail", selectedClassId],
        enabled: !!selectedClassId,
        queryFn: async () => {
            // const { data } = await axios.get(`/api/a/certificate/classes/${selectedClassId}/finals`);
            // return data;
            const cls = classesQ.data?.list.find((c) => c.id === selectedClassId) ??
                {
                    id: selectedClassId,
                    name: "1A",
                    academic_year: "2025/2026",
                    issue_date: new Date().toISOString(),
                    student_count: 0,
                };
            const recipients = Array.from({ length: 24 }).map((_, i) => ({
                id: `${cls.id}-S-${i + 1}`,
                student_name: `Siswa ${i + 1}`,
                final_score: 60 + ((i * 7) % 41),
                published: i % 4 !== 0,
            }));
            const certificate_type = Number(cls.name.replace(/\D/g, "")) >= 6
                ? "Kelulusan"
                : "Kenaikan Kelas";
            return { class: cls, recipients, certificate_type };
        },
        staleTime: 60_000,
    });
    const classList = classesQ.data?.list ?? [];
    const selectedClass = classDetailQ.data?.class ?? null;
    const recipients = classDetailQ.data?.recipients ?? [];
    const certType = classDetailQ.data?.certificate_type ?? "Kenaikan Kelas";
    /* ================= SELECTION ================= */
    const [selectedIds, setSelectedIds] = useState(new Set());
    useEffect(() => setSelectedIds(new Set()), [selectedClassId]);
    const allChecked = recipients.length > 0 && selectedIds.size === recipients.length;
    const someChecked = selectedIds.size > 0 && selectedIds.size < recipients.length;
    const toggleAll = () => {
        if (allChecked)
            setSelectedIds(new Set());
        else
            setSelectedIds(new Set(recipients.map((r) => r.id)));
    };
    const toggleOne = (id) => {
        setSelectedIds((prev) => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };
    /* ================= MUTATIONS (with optimistic update) ================= */
    const patchCache = (ids, published) => {
        qc.setQueryData(["certificate-class-detail", selectedClassId], (old) => {
            if (!old)
                return old;
            return {
                ...old,
                recipients: old.recipients.map((r) => ids.includes(r.id) ? { ...r, published } : r),
            };
        });
    };
    const publishOneMut = useMutation({
        mutationFn: async ({ class_id, student_id, }) => axios.post("/api/a/certificates/publish", { class_id, student_id }),
        onMutate: async (vars) => {
            await qc.cancelQueries({
                queryKey: ["certificate-class-detail", selectedClassId],
            });
            patchCache([vars.student_id], true);
        },
        onError: (_e, vars) => {
            patchCache([vars.student_id], false);
            showBanner("Gagal menerbitkan sertifikat.");
        },
        onSuccess: () => showBanner("Sertifikat diterbitkan."),
    });
    const revokeOneMut = useMutation({
        mutationFn: async ({ class_id, student_id, }) => axios.post("/api/a/certificates/revoke", { class_id, student_id }),
        onMutate: async (vars) => {
            await qc.cancelQueries({
                queryKey: ["certificate-class-detail", selectedClassId],
            });
            patchCache([vars.student_id], false);
        },
        onError: (_e, vars) => {
            patchCache([vars.student_id], true);
            showBanner("Gagal mencabut sertifikat.");
        },
        onSuccess: () => showBanner("Sertifikat dicabut."),
    });
    const publishBulkMut = useMutation({
        mutationFn: async ({ class_id, student_ids, }) => axios.post("/api/a/certificates/publish-bulk", { class_id, student_ids }),
        onMutate: async (vars) => {
            await qc.cancelQueries({
                queryKey: ["certificate-class-detail", selectedClassId],
            });
            patchCache(vars.student_ids, true);
        },
        onError: (_e, vars) => {
            patchCache(vars.student_ids, false);
            showBanner("Gagal menerbitkan sebagian/semua sertifikat.");
        },
        onSuccess: () => {
            showBanner("Sertifikat berhasil diterbitkan (bulk).");
            setSelectedIds(new Set());
        },
    });
    const revokeBulkMut = useMutation({
        mutationFn: async ({ class_id, student_ids, }) => axios.post("/api/a/certificates/revoke-bulk", { class_id, student_ids }),
        onMutate: async (vars) => {
            await qc.cancelQueries({
                queryKey: ["certificate-class-detail", selectedClassId],
            });
            patchCache(vars.student_ids, false);
        },
        onError: (_e, vars) => {
            patchCache(vars.student_ids, true);
            showBanner("Gagal mencabut sebagian/semua sertifikat.");
        },
        onSuccess: () => {
            showBanner("Sertifikat berhasil dicabut (bulk).");
            setSelectedIds(new Set());
        },
    });
    /* ================= FILE ACTIONS ================= */
    const openInNewTab = (url) => {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    const exportClass = () => {
        if (!selectedClass)
            return;
        openInNewTab(`/api/a/certificates/class/${selectedClass.id}/pdf`);
    };
    const exportOnePdf = (studentId) => {
        if (!selectedClass)
            return;
        openInNewTab(`/api/a/certificates/${selectedClass.id}/${studentId}/pdf`);
    };
    const printOne = (studentId) => {
        if (!selectedClass)
            return;
        openInNewTab(`/api/a/certificates/${selectedClass.id}/${studentId}/print`);
    };
    const viewOne = (studentId) => {
        if (!selectedClass)
            return;
        openInNewTab(`/api/a/certificates/${selectedClass.id}/${studentId}`);
    };
    /* ================= DERIVED ================= */
    const totalRecipients = useMemo(() => classList.reduce((a, b) => a + (b.student_count || 0), 0), [classList]);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Sertifikat", gregorianDate: gregorianISO, hijriDate: hijriLong(gregorianISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [!!banner && (_jsx("div", { className: "rounded-lg px-4 py-2 text-sm", style: { background: palette.primary2, color: palette.primary }, children: banner })), _jsxs("section", { className: "flex items-start gap-5", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center ", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: "inline-flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Sertifikat" })] }), selectedClass && (_jsx("div", { className: "ml-auto", children: _jsxs(Btn, { palette: palette, variant: "ghost", onClick: () => setSelectedClassId(null), className: "inline-flex items-center gap-2", children: [_jsx(ArrowLeft, { size: 16 }), " Kembali"] }) }))] }), !selectedClass && (_jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 font-medium flex items-center gap-2", children: [_jsx(FilterIcon, { size: 18 }), " Filter"] }), _jsx("div", { className: "px-4 md:px-5 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-4", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm mb-1", style: { color: palette.black2 }, children: "Bulan Terbit" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "month", value: month, onChange: (e) => setMonth(e.target.value), className: "w-full h-11 rounded-lg border px-3 bg-transparent text-sm", style: {
                                                                    borderColor: palette.silver1,
                                                                    color: palette.black1,
                                                                } }), _jsx(Btn, { palette: palette, variant: "outline", size: "sm", onClick: () => classesQ.refetch(), children: _jsx(RefreshCcw, { size: 16 }) })] })] }) })] })), !selectedClass && (_jsx(_Fragment, { children: _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 font-medium flex items-center gap-2", children: [_jsx(GraduationCap, { size: 18 }), " Daftar Kelas"] }), _jsxs("div", { className: "px-4 md:px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3", children: [classList.map((c) => (_jsxs("button", { className: "rounded-xl border text-left p-4 hover:-translate-y-0.5 transition", style: {
                                                            borderColor: palette.silver1,
                                                            background: palette.white1,
                                                        }, onClick: () => setSelectedClassId(c.id), "aria-label": `Lihat nilai akhir kelas ${c.name}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: {
                                                                            background: palette.primary2,
                                                                            color: palette.primary,
                                                                        }, children: _jsx(Users, { size: 18 }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-semibold truncate", children: c.name }), _jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: ["Tahun Ajaran ", c.academic_year] })] })] }), _jsxs("div", { className: "mt-3 flex items-center justify-between text-sm", children: [_jsxs("div", { className: "inline-flex items-center gap-1", style: { color: palette.black2 }, children: [_jsx(CalendarRange, { size: 14 }), " Terbit", " ", dateOnly(c.issue_date)] }), _jsxs(Badge, { palette: palette, variant: "outline", children: [c.student_count, " murid"] })] })] }, c.id))), classList.length === 0 && (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Tidak ada kelas." }))] })] }) })), selectedClass && (_jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 flex flex-wrap items-center justify-between gap-2", children: [_jsxs("div", { className: "font-medium", children: ["Nilai Akhir \u2014 Kelas ", selectedClass.name] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(IconBtn, { title: "Pengaturan", palette: palette, onClick: () => {
                                                                /* buka modal setting */
                                                            }, children: _jsx(Settings2, { size: 18 }) }), _jsx(IconBtn, { title: "Export kelas (PDF)", palette: palette, onClick: exportClass, children: _jsx(Download, { size: 18 }) }), selectedIds.size > 0 && (_jsxs(_Fragment, { children: [_jsx(IconBtn, { title: `Terbitkan ${selectedIds.size} siswa`, palette: palette, onClick: () => publishBulkMut.mutate({
                                                                        class_id: selectedClass.id,
                                                                        student_ids: Array.from(selectedIds),
                                                                    }), disabled: publishBulkMut.isPending, children: _jsx(CheckCircle2, { size: 18 }) }), _jsx(IconBtn, { title: `Cabut ${selectedIds.size} siswa`, palette: palette, onClick: () => revokeBulkMut.mutate({
                                                                        class_id: selectedClass.id,
                                                                        student_ids: Array.from(selectedIds),
                                                                    }), disabled: revokeBulkMut.isPending, children: _jsx(XCircle, { size: 18 }) })] }))] })] }), _jsxs("div", { className: "px-4 md:px-5 pb-4 overflow-x-auto", children: [_jsxs("table", { className: "w-full text-sm min-w-[1060px]", children: [_jsx("thead", { className: "text-left", style: { color: palette.black2 }, children: _jsxs("tr", { className: "border-b", style: { borderColor: palette.silver1 }, children: [_jsx("th", { className: "py-2 pr-3 w-10", children: _jsx("input", { type: "checkbox", "aria-label": "Pilih semua", checked: allChecked, ref: (el) => {
                                                                                if (el)
                                                                                    el.indeterminate = someChecked;
                                                                            }, onChange: toggleAll }) }), _jsx("th", { className: "py-2 pr-4 w-12", children: "No." }), _jsx("th", { className: "py-2 pr-4", children: "No. Sertifikat" }), _jsx("th", { className: "py-2 pr-4", children: "Nama Siswa" }), _jsx("th", { className: "py-2 pr-4", children: "Nilai Akhir" }), _jsx("th", { className: "py-2 pr-4", children: "Status" }), _jsx("th", { className: "py-2 pr-2 text-right", children: "Aksi" })] }) }), _jsx("tbody", { className: "divide-y", style: { borderColor: palette.silver1 }, children: classDetailQ.isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "py-8 text-center", style: { color: palette.silver2 }, children: "Memuat data\u2026" }) })) : recipients.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "py-8 text-center", style: { color: palette.silver2 }, children: "Belum ada data nilai." }) })) : (recipients.map((r, i) => {
                                                                const lulus = r.final_score >= PASS;
                                                                const noSertif = genCertNo(selectedClass, i);
                                                                const checked = selectedIds.has(r.id);
                                                                return (_jsxs("tr", { children: [_jsx("td", { className: "py-3 pr-3 align-middle", children: _jsx("input", { type: "checkbox", checked: checked, onChange: () => toggleOne(r.id), "aria-label": `pilih ${r.student_name}` }) }), _jsx("td", { className: "py-3 pr-4 align-middle", children: i + 1 }), _jsx("td", { className: "py-3 pr-4 align-middle font-mono", children: noSertif }), _jsx("td", { className: "py-3 pr-4 align-middle font-medium", children: r.student_name }), _jsx("td", { className: "py-3 pr-4 align-middle", children: r.final_score }), _jsx("td", { className: "py-3 pr-4 align-middle", children: _jsx("div", { className: "flex items-center gap-2", children: r.published ? (_jsx(Badge, { palette: palette, variant: "success", children: "Terbit" })) : (_jsx(Badge, { palette: palette, variant: "warning", children: "Draft" })) }) }), _jsx("td", { className: "py-3 pr-2 align-middle", children: _jsxs("div", { className: "flex justify-end gap-1.5", children: [r.published ? (_jsx(IconBtn, { title: "Cabut sertifikat", palette: palette, onClick: () => revokeOneMut.mutate({
                                                                                            class_id: selectedClass.id,
                                                                                            student_id: r.id,
                                                                                        }), disabled: revokeOneMut.isPending, children: _jsx(XCircle, { size: 18, style: { color: palette.error1 } }) })) : (_jsx(IconBtn, { title: "Terbitkan sertifikat", palette: palette, onClick: () => publishOneMut.mutate({
                                                                                            class_id: selectedClass.id,
                                                                                            student_id: r.id,
                                                                                        }), disabled: publishOneMut.isPending, children: _jsx(CheckCircle2, { size: 18, style: { color: palette.success1 } }) })), _jsx(IconBtn, { title: "Lihat", palette: palette, onClick: () => navigate(`detail/${selectedClass.id}/${r.id}`), children: _jsx(Eye, { size: 18, style: { color: palette.primary } }) })] }) })] }, r.id));
                                                            })) })] }), _jsxs("div", { className: "pt-3 text-sm flex items-center justify-between", style: { color: palette.silver2 }, children: [_jsxs("div", { children: ["Menampilkan ", recipients.length, " siswa \u2022 Jenis Sertifikat:", " ", certType, " \u2022 Ambang Lulus: ", PASS] }), selectedIds.size > 0 && (_jsxs("div", { children: [selectedIds.size, " dipilih"] }))] })] })] }))] })] }) })] }));
};
export default SchoolCertificate;
/* ================= Small UI helpers ================= */
function KpiTile({ palette, label, value, icon, tone, }) {
    const toneBg = tone === "success"
        ? "#DCFCE7"
        : tone === "warning"
            ? "#FEF3C7"
            : tone === "danger"
                ? "#FEE2E2"
                : undefined;
    return (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 flex items-center gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: {
                        background: toneBg ?? palette.primary2,
                        color: palette.primary,
                    }, children: icon ?? _jsx(Award, { size: 18 }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: label }), _jsx("div", { className: "text-xl font-semibold", children: value })] })] }) }));
}
