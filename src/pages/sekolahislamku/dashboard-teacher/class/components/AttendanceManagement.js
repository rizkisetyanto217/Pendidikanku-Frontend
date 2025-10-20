import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/attendance/AttendanceManagement.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
export default function AttendanceManagement() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // ⬇️ langsung pakai data dari state
    const [students, setStudents] = useState(state?.students ?? []);
    const handleChange = (id, status) => {
        setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    };
    const handleSave = () => {
        // kirim ke API
        console.log("Absen disimpan:", students);
        alert("Data kehadiran berhasil disimpan (lihat console)");
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: `Kelola Absensi ${state?.className ?? ""}`, gregorianDate: new Date().toISOString() }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:gap-6", children: [_jsx("aside", { className: "lg:w-64 mb-6 lg:mb-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold text-lg", children: [_jsx("button", { onClick: () => navigate(-1), className: "inline-flex items-center justify-center rounded-full p-1 hover:opacity-80", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("span", { children: "Manajemen Kehadiran" })] }), _jsx(SectionCard, { palette: palette, className: "p-4", children: students.length === 0 ? (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Tidak ada data siswa diterima. Buka halaman ini melalui tombol \u201CKelola Absen\u201D." })) : (_jsxs(_Fragment, { children: [_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left", style: { borderBottom: `1px solid ${palette.silver1}` }, children: [_jsx("th", { className: "py-2", children: "Nama Siswa" }), _jsx("th", { className: "py-2", children: "Status" })] }) }), _jsx("tbody", { children: students.map((s) => (_jsxs("tr", { style: {
                                                                borderBottom: `1px solid ${palette.silver1}`,
                                                            }, children: [_jsx("td", { className: "py-2", children: s.name }), _jsx("td", { className: "py-2", children: _jsx("select", { value: s.status, onChange: (e) => handleChange(s.id, e.target.value), className: "h-8 rounded-lg px-2 border outline-none", style: {
                                                                            background: palette.white1,
                                                                            color: palette.black1,
                                                                            borderColor: palette.silver1,
                                                                        }, children: ["hadir", "online", "sakit", "izin", "alpa"].map((opt) => (_jsx("option", { value: opt, children: opt.toUpperCase() }, opt))) }) })] }, s.id))) })] }), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx(Btn, { palette: palette, onClick: handleSave, children: "Simpan Absensi" }) })] })) })] })] }) })] }));
}
