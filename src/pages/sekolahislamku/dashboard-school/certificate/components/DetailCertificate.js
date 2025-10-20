import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/academic/DetailCertificate.tsx
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
// Theme & utils
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
// UI primitives & layout
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
// Icons
import { Award, ArrowLeft, Printer, Download } from "lucide-react";
/* ============== Helpers ============== */
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
/** Generator nomor sertifikat fallback ketika API tidak menyediakan */
const genCertNo = (issueISO, className, idx) => {
    const yy = issueISO
        ? String(new Date(issueISO).getFullYear()).slice(2)
        : "00";
    return `${yy}-${className}-${String(idx + 1).padStart(3, "0")}`;
};
/* ============== Component ============== */
const DetailCertificate = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const qc = useQueryClient();
    const { classId = "", studentId = "" } = useParams();
    // ---- Ambil dari CACHE dulu (hasil halaman SchoolCertificate) ----
    const cached = qc.getQueryData([
        "certificate-class-detail",
        classId,
    ]);
    const cachedRow = useMemo(() => {
        if (!cached)
            return null;
        const idx = cached.recipients.findIndex((r) => r.id === studentId);
        if (idx < 0)
            return null;
        const r = cached.recipients[idx];
        const number = 
        // fallback lokal (anda bisa ganti jika backend sudah menyediakan nomor)
        genCertNo(cached.class.issue_date, cached.class.name, idx);
        const status = r.published
            ? "published"
            : "draft";
        const detail = {
            id: r.id,
            number,
            type: cached.certificate_type,
            student_name: r.student_name,
            class_name: cached.class.name,
            academic_year: cached.class.academic_year,
            issue_date: cached.class.issue_date,
            status,
            score: r.final_score,
        };
        return detail;
    }, [cached, classId, studentId]);
    // ---- Query ke API (fallback / refresh) ----
    const certQ = useQuery({
        queryKey: ["certificate-detail", classId, studentId],
        queryFn: async () => {
            const { data } = await axios.get(`/api/a/certificates/${classId}/${studentId}`);
            return data;
        },
        // tampilkan data cache sebagai initialData agar UI instan
        initialData: cachedRow ?? undefined,
        // tetap fetch untuk sync; jika gagal kita akan tampilkan soft error di bawah
        staleTime: 0,
        enabled: !!classId && !!studentId,
        // opsional: kurangi kebisingan error otomatis
        retry: 1,
        refetchOnWindowFocus: false,
    });
    const detail = certQ.data;
    const gIso = useMemo(() => new Date().toISOString(), []);
    const exportPdf = () => {
        if (!classId || !studentId)
            return;
        window.open(`/api/a/certificates/${classId}/${studentId}/pdf`, "_blank");
    };
    const printCert = () => {
        if (!classId || !studentId)
            return;
        window.open(`/api/a/certificates/${classId}/${studentId}/print`, "_blank");
    };
    // ====== Render guards: jangan timpa data dengan layar error kalau refetch gagal ======
    const showHardError = certQ.isError && !detail; // benar2 tidak ada data
    const showSoftError = certQ.isError && !!detail; // ada data, tapi refresh gagal
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Sertifikat", gregorianDate: gIso, hijriDate: hijriLong(gIso) }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-4", children: [_jsx("aside", { className: "lg:col-span-3", children: _jsx(ParentSidebar, { palette: palette }) }), _jsx("section", { className: "lg:col-span-9 space-y-6", children: _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 flex items-center gap-3 border-b", style: { borderColor: palette.silver1 }, children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: {
                                                    background: palette.primary2,
                                                    color: palette.primary,
                                                }, children: _jsx(Award, { size: 18 }) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-lg font-semibold", children: "Detail Sertifikat" }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Informasi lengkap sertifikat siswa" })] }), _jsxs(Btn, { palette: palette, variant: "ghost", className: "gap-1", onClick: () => navigate(-1), children: [_jsx(ArrowLeft, { size: 16 }), " Kembali"] })] }), certQ.isLoading && !detail ? (_jsx("div", { className: "p-6 text-center", style: { color: palette.silver2 }, children: "Memuat data\u2026" })) : showHardError ? (_jsx("div", { className: "p-6 text-center text-sm", style: { color: palette.warning1 }, children: "Gagal memuat data. Coba ulang." })) : !detail ? (_jsx("div", { className: "p-6 text-center", style: { color: palette.silver2 }, children: "Data tidak ditemukan." })) : (_jsxs("div", { className: "p-6 space-y-4", children: [certQ.isFetching && (_jsx("div", { className: "text-xs", style: { color: palette.silver2 }, role: "status", children: "Menyegarkan data dari server\u2026" })), showSoftError && (_jsx("div", { className: "text-xs", style: { color: palette.warning1 }, role: "alert", children: "Gagal menyegarkan. Menampilkan data terakhir yang tersedia." })), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "No. Sertifikat" }), _jsx("div", { children: detail.number })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Jenis" }), _jsx("div", { children: detail.type })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Nama Siswa" }), _jsx("div", { children: detail.student_name })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Kelas" }), _jsx("div", { children: detail.class_name })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Tahun Ajaran" }), _jsx("div", { children: detail.academic_year })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Tanggal Terbit" }), _jsx("div", { children: dateLong(detail.issue_date) })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Nilai Akhir" }), _jsx("div", { children: detail.score })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Status" }), _jsx(Badge, { palette: palette, variant: detail.status === "published"
                                                                    ? "success"
                                                                    : detail.status === "expired"
                                                                        ? "warning"
                                                                        : "outline", children: detail.status === "published"
                                                                    ? "Terbit"
                                                                    : detail.status === "draft"
                                                                        ? "Draft"
                                                                        : "Kedaluwarsa" })] })] }), _jsxs("div", { className: "flex gap-2 pt-4", children: [_jsxs(Btn, { palette: palette, onClick: printCert, className: "gap-1", children: [_jsx(Printer, { size: 16 }), " Cetak"] }), _jsxs(Btn, { palette: palette, onClick: exportPdf, className: "gap-1", children: [_jsx(Download, { size: 16 }), " PDF"] })] })] }))] }) })] }) })] }));
};
export default DetailCertificate;
