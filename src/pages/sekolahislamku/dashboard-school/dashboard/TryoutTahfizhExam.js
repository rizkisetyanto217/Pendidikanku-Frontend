import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/tryout/TryoutTahfizhExam.tsx
import { useState } from "react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
const StatusBadge = ({ status }) => {
    const getStatusStyle = () => {
        switch (status) {
            case "Akan Datang":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Berlangsung":
                return "bg-green-100 text-green-800 border-green-200";
            case "Selesai":
                return "bg-gray-100 text-gray-800 border-gray-200";
            case "Dibatalkan":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };
    return (_jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle()}`, children: status }));
};
const JenisBadge = ({ jenis }) => {
    const getJenisStyle = () => {
        switch (jenis) {
            case "Internal":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "Eksternal":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "Ujian Resmi":
                return "bg-emerald-100 text-emerald-800 border-emerald-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };
    return (_jsx("span", { className: `px-2 py-1 rounded text-xs font-medium border ${getJenisStyle()}`, children: jenis }));
};
const TryoutCard = ({ tryout, palette, onDetailClick, }) => {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    return (_jsx(SectionCard, { palette: palette, className: "p-0 overflow-hidden hover:shadow-lg transition-shadow duration-200", children: _jsxs("div", { className: "p-5", children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-start gap-2 mb-2", children: [_jsx(JenisBadge, { jenis: tryout.jenisTryout }), _jsx(StatusBadge, { status: tryout.status })] }), _jsx("h3", { className: "text-lg font-semibold mb-1", children: tryout.judul }), _jsxs("div", { className: "flex gap-4 text-sm opacity-70", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z", clipRule: "evenodd" }) }), _jsx("span", { children: formatDate(tryout.tanggal) })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", clipRule: "evenodd" }) }), _jsx("span", { children: tryout.waktu })] })] })] }) }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm leading-relaxed opacity-90", children: tryout.deskripsi }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t", style: { borderColor: palette.silver1 }, children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold opacity-60 mb-1", children: "TARGET PESERTA" }), _jsx("p", { className: "text-sm", children: tryout.targetPeserta })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold opacity-60 mb-1", children: "LOKASI" }), _jsx("p", { className: "text-sm", children: tryout.lokasi })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold opacity-60 mb-1", children: "DURASI" }), _jsx("p", { className: "text-sm", children: tryout.durasi })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold opacity-60 mb-1", children: "PENDAFTAR" }), _jsxs("p", { className: "text-sm", children: [tryout.jumlahPendaftar || 0, "/", tryout.maxPeserta || "∞", " peserta"] })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold opacity-60 mb-2", children: "MATERI TAHFIZ" }), _jsx("div", { className: "flex flex-wrap gap-1", children: tryout.materiTahfiz.map((materi, index) => (_jsx("span", { className: "px-2 py-1 rounded text-xs", style: {
                                            background: palette.white1,
                                            border: `1px solid ${palette.silver1}`,
                                            color: palette.black1,
                                        }, children: materi }, index))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold opacity-60 mb-2", children: "PENGAWAS" }), _jsx("div", { className: "text-sm", children: tryout.pengawas.join(", ") })] })] }), _jsxs("div", { className: "flex items-center justify-between mt-6 pt-4 border-t", style: { borderColor: palette.silver1 }, children: [_jsxs("div", { className: "flex items-center gap-2 text-xs opacity-60", children: [_jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }), _jsxs("span", { children: ["ID: ", tryout.id.toString().padStart(4, "0")] })] }), _jsx("button", { onClick: () => onDetailClick(tryout), className: "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:opacity-80", style: {
                                background: palette.black1,
                                color: palette.white1,
                            }, children: "Lihat Detail" })] })] }) }));
};
const FilterBar = ({ palette, statusFilter, jenisFilter, onStatusChange, onJenisChange, }) => {
    return (_jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-start md:items-center", children: [_jsx("h3", { className: "font-semibold text-sm", children: "Filter Tryout:" }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("select", { value: statusFilter, onChange: (e) => onStatusChange(e.target.value), className: "px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500", style: {
                                background: palette.white1,
                                borderColor: palette.silver1,
                                color: palette.black1,
                            }, children: [_jsx("option", { value: "", children: "Semua Status" }), _jsx("option", { value: "Akan Datang", children: "Akan Datang" }), _jsx("option", { value: "Berlangsung", children: "Berlangsung" }), _jsx("option", { value: "Selesai", children: "Selesai" }), _jsx("option", { value: "Dibatalkan", children: "Dibatalkan" })] }), _jsxs("select", { value: jenisFilter, onChange: (e) => onJenisChange(e.target.value), className: "px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500", style: {
                                background: palette.white1,
                                borderColor: palette.silver1,
                                color: palette.black1,
                            }, children: [_jsx("option", { value: "", children: "Semua Jenis" }), _jsx("option", { value: "Internal", children: "Internal" }), _jsx("option", { value: "Eksternal", children: "Eksternal" }), _jsx("option", { value: "Ujian Resmi", children: "Ujian Resmi" })] })] })] }) }));
};
// Komponen utama
const TryoutTahfizhExam = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const [statusFilter, setStatusFilter] = useState("");
    const [jenisFilter, setJenisFilter] = useState("");
    // Data tryout
    const tryoutList = [
        {
            id: 1,
            judul: "Tryout Ujian Tahfiz Semester Ganjil",
            tanggal: "2025-08-22",
            waktu: "08:00 - 12:00 WIB",
            deskripsi: "Tryout internal Kamis depan. Mohon guru menyiapkan rubrik penilaian untuk evaluasi kemampuan tahfiz siswa semester ini.",
            status: "Akan Datang",
            jenisTryout: "Internal",
            targetPeserta: "Kelas 4-6 SD",
            materiTahfiz: ["Juz 30", "Surah Al-Mulk", "Surah Yasin"],
            pengawas: ["Ustadz Ahmad", "Ustadzah Fatimah", "Ustadz Yusuf"],
            lokasi: "Aula Utama",
            durasi: "4 jam",
            maxPeserta: 50,
            jumlahPendaftar: 35,
        },
        {
            id: 2,
            judul: "Ujian Tahfiz Bulanan - September",
            tanggal: "2025-09-15",
            waktu: "09:00 - 11:00 WIB",
            deskripsi: "Ujian rutin bulanan untuk mengukur progress hafalan siswa. Meliputi evaluasi kelancaran, tajwid, dan makhorijul huruf.",
            status: "Akan Datang",
            jenisTryout: "Ujian Resmi",
            targetPeserta: "Semua Tingkat",
            materiTahfiz: ["Sesuai Target Bulanan", "Muroja'ah"],
            pengawas: ["Ustadz Mahmud", "Ustadzah Khadijah"],
            lokasi: "Ruang Kelas Masing-masing",
            durasi: "2 jam",
            maxPeserta: 150,
            jumlahPendaftar: 142,
        },
        {
            id: 3,
            judul: "Tryout Persiapan Musabaqah",
            tanggal: "2025-08-30",
            waktu: "07:30 - 10:30 WIB",
            deskripsi: "Persiapan khusus untuk siswa yang akan mengikuti Musabaqah Tilawatil Quran tingkat kota. Fokus pada teknik dan mental bertanding.",
            status: "Akan Datang",
            jenisTryout: "Eksternal",
            targetPeserta: "Tim Musabaqah",
            materiTahfiz: ["Juz 1-5", "Tilawah", "Tahfiz 5 Juz"],
            pengawas: ["Ustadz Hafiz", "Qori Abdullah"],
            lokasi: "Masjid Sekolah",
            durasi: "3 jam",
            maxPeserta: 15,
            jumlahPendaftar: 12,
        },
        {
            id: 4,
            judul: "Evaluasi Tahfiz Semester Genap",
            tanggal: "2025-07-20",
            waktu: "08:00 - 15:00 WIB",
            deskripsi: "Evaluasi komprehensif tahfiz untuk semester genap yang telah berlalu. Hasil akan menjadi dasar penentuan level tahfiz semester depan.",
            status: "Selesai",
            jenisTryout: "Ujian Resmi",
            targetPeserta: "Kelas 1-6 SD",
            materiTahfiz: ["Juz 30", "Juz 29", "Surah Pilihan"],
            pengawas: ["Ustadz Ali", "Ustadzah Maryam", "Ustadz Umar"],
            lokasi: "Gedung Utama",
            durasi: "7 jam (bertahap)",
            maxPeserta: 200,
            jumlahPendaftar: 185,
        },
    ];
    // Filter data
    const filteredTryout = tryoutList.filter((tryout) => {
        if (statusFilter && tryout.status !== statusFilter)
            return false;
        if (jenisFilter && tryout.jenisTryout !== jenisFilter)
            return false;
        return true;
    });
    const handleDetailClick = (tryout) => {
        console.log("Detail tryout:", tryout);
        // Navigate to detail page or open modal
    };
    const currentDate = new Date().toISOString();
    return (_jsxs("div", { className: "min-h-screen w-full transition-colors duration-200", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, gregorianDate: currentDate, title: "Tryout Ujian Tahfiz" }), _jsx("main", { className: "mx-auto max-w-7xl px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-6", children: [_jsx("div", { className: "lg:w-64 mb-6 lg:mb-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsx(SectionCard, { palette: palette, className: "p-6", children: _jsxs("div", { className: "text-stsrt", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Tryout Ujian Tahfiz" }), _jsx("p", { className: "opacity-70 mb-4", children: "Lihat semua jadwal tryout dan ujian tahfiz yang akan datang" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mt-6", children: [_jsxs("div", { className: "text-center p-3 rounded-lg", style: { background: palette.white1 }, children: [_jsx("p", { className: "text-2xl font-bold text-blue-600", children: tryoutList.filter((t) => t.status === "Akan Datang")
                                                                    .length }), _jsx("p", { className: "text-sm opacity-70", children: "Akan Datang" })] }), _jsxs("div", { className: "text-center p-3 rounded-lg", style: { background: palette.white1 }, children: [_jsx("p", { className: "text-2xl font-bold text-green-600", children: tryoutList.filter((t) => t.status === "Berlangsung")
                                                                    .length }), _jsx("p", { className: "text-sm opacity-70", children: "Berlangsung" })] }), _jsxs("div", { className: "text-center p-3 rounded-lg", style: { background: palette.white1 }, children: [_jsx("p", { className: "text-2xl font-bold text-gray-600", children: tryoutList.filter((t) => t.status === "Selesai").length }), _jsx("p", { className: "text-sm opacity-70", children: "Selesai" })] }), _jsxs("div", { className: "text-center p-3 rounded-lg", style: { background: palette.white1 }, children: [_jsx("p", { className: "text-2xl font-bold text-purple-600", children: tryoutList.length }), _jsx("p", { className: "text-sm opacity-70", children: "Total Tryout" })] })] })] }) }), _jsx(FilterBar, { palette: palette, statusFilter: statusFilter, jenisFilter: jenisFilter, onStatusChange: setStatusFilter, onJenisChange: setJenisFilter }), _jsx("div", { className: "space-y-4", children: filteredTryout.length > 0 ? (filteredTryout.map((tryout) => (_jsx(TryoutCard, { tryout: tryout, palette: palette, onDetailClick: handleDetailClick }, tryout.id)))) : (_jsx(SectionCard, { palette: palette, className: "p-12 text-center", children: _jsxs("div", { className: "opacity-60", children: [_jsx("svg", { className: "w-16 h-16 mx-auto mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("h3", { className: "text-lg font-semibold mb-2", children: "Tidak Ada Tryout" }), _jsx("p", { className: "text-sm", children: "Tidak ada tryout yang sesuai dengan filter yang dipilih." })] }) })) }), _jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "text-green-500 mt-1", children: _jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-1", children: "Informasi Tryout" }), _jsx("p", { className: "text-sm opacity-70 leading-relaxed", children: "Semua siswa wajib mengikuti tryout sesuai jadwal yang telah ditentukan. Untuk informasi lebih lanjut, silakan hubungi guru tahfiz atau bagian akademik." })] })] }) })] })] }) })] }));
};
export default TryoutTahfizhExam;
