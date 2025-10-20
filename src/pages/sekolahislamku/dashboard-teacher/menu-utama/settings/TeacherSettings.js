import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/dashboard-teacher/menu-utama/settings/TeacherSettings.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { Bell, Lock, User, ArrowLeft, ChevronRight, Mail, Shield, Moon, Sun, Volume2, VolumeX, LogOut, Settings, Camera, Edit, } from "lucide-react";
/* ===== Helpers ===== */
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
const TODAY_ISO = new Date().toISOString();
/* ===== Component ===== */
const TeacherSettings = ({ showBack = false, backTo, backLabel = "Kembali", }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const [notifEnabled, setNotifEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [emailNotif, setEmailNotif] = useState(false);
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };
    const SettingRow = ({ icon: Icon, title, subtitle, action, value, onToggle, onClick, rightContent, }) => (_jsxs("div", { className: `flex items-center justify-between p-4 ${action === "navigate" ? "cursor-pointer hover:bg-opacity-50" : ""}`, style: action === "navigate"
            ? {
                transition: "background-color 0.2s",
            }
            : {}, onMouseEnter: action === "navigate"
            ? (e) => {
                e.currentTarget.style.backgroundColor = palette.silver1 + "30";
            }
            : undefined, onMouseLeave: action === "navigate"
            ? (e) => {
                e.currentTarget.style.backgroundColor = "transparent";
            }
            : undefined, onClick: action === "navigate" ? onClick : undefined, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center", style: { backgroundColor: palette.primary + "20" }, children: _jsx(Icon, { size: 18, style: { color: palette.primary } }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium", children: title }), subtitle && (_jsx("p", { className: "text-sm mt-0.5", style: { color: palette.black2 }, children: subtitle }))] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [rightContent, action === "toggle" && (_jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "sr-only", checked: value, onChange: (e) => onToggle?.(e.target.checked) }), _jsx("div", { className: `w-11 h-6 rounded-full transition-colors duration-200 ${value ? "shadow-sm" : ""}`, style: {
                                    backgroundColor: value ? palette.primary : palette.silver1,
                                }, children: _jsx("div", { className: `w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0.5"} mt-0.5` }) })] })), action === "navigate" && (_jsx(ChevronRight, { size: 16, style: { color: palette.black2 } }))] })] }));
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Pengaturan", gregorianDate: TODAY_ISO, hijriDate: hijriWithWeekday(TODAY_ISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 py-4  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex  hidden items-center gap-4", children: [_jsx(Btn, { palette: palette, onClick: () => (backTo ? navigate(backTo) : navigate(-1)), variant: "ghost", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "font-semibold text-xl", children: "Pengaturan" })] }), _jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white", style: { backgroundColor: palette.primary }, children: "UA" }), _jsx("button", { className: "absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md border", style: { borderColor: palette.silver1 }, children: _jsx(Camera, { size: 12, style: { color: palette.black2 } }) })] }), _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "font-semibold text-lg", children: "Ustadz Abdullah" }), _jsx("p", { className: "text-sm", style: { color: palette.black2 }, children: "abdullah@sekolah.id" }), _jsx(Badge, { palette: palette, variant: "success", className: "mt-2", children: "Guru Aktif" })] }), _jsxs(Btn, { palette: palette, variant: "outline", size: "sm", children: [_jsx(Edit, { size: 14 }), "Edit"] })] }) }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-2", children: [_jsx("div", { className: "px-4 py-3 border-b", style: { borderColor: palette.silver1 }, children: _jsx("h3", { className: "font-semibold text-base", children: "Akun & Keamanan" }) }), _jsxs("div", { className: "divide-y", style: {
                                                    borderColor: palette.silver1,
                                                }, children: [_jsx(SettingRow, { icon: User, title: "Informasi Personal", subtitle: "Nama, email, dan detail profil", action: "navigate", onClick: () => navigate("/sekolahislamku/teacher/profile") }), _jsx(SettingRow, { icon: Lock, title: "Keamanan", subtitle: "Ubah kata sandi dan keamanan akun", action: "navigate", onClick: () => navigate("/sekolahislamku/teacher/security") }), _jsx(SettingRow, { icon: Shield, title: "Privasi", subtitle: "Kontrol privasi dan data personal", action: "navigate", onClick: () => navigate("/sekolahislamku/teacher/privacy") })] })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-2", children: [_jsx("div", { className: "px-4 py-3 border-b", style: { borderColor: palette.silver1 }, children: _jsx("h3", { className: "font-semibold text-base", children: "Aplikasi" }) }), _jsxs("div", { className: "divide-y", style: {
                                                    borderColor: palette.silver1,
                                                }, children: [_jsx(SettingRow, { icon: isDark ? Sun : Moon, title: "Mode Tampilan", subtitle: `Saat ini: ${isDark ? "Gelap" : "Terang"}`, action: "toggle", value: isDark, onToggle: (value) => {
                                                            // Toggle theme logic here
                                                            console.log("Toggle theme:", value);
                                                        } }), _jsx(SettingRow, { icon: Bell, title: "Notifikasi Push", subtitle: "Terima pemberitahuan penting", action: "toggle", value: notifEnabled, onToggle: setNotifEnabled }), _jsx(SettingRow, { icon: Mail, title: "Email Notifikasi", subtitle: "Notifikasi melalui email", action: "toggle", value: emailNotif, onToggle: setEmailNotif }), _jsx(SettingRow, { icon: soundEnabled ? Volume2 : VolumeX, title: "Suara Notifikasi", subtitle: "Bunyi untuk notifikasi", action: "toggle", value: soundEnabled, onToggle: setSoundEnabled })] })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-2", children: [_jsx("div", { className: "px-4 py-3 border-b", style: { borderColor: palette.silver1 }, children: _jsx("h3", { className: "font-semibold text-base", children: "Lainnya" }) }), _jsxs("div", { className: "divide-y", style: {
                                                    borderColor: palette.silver1,
                                                }, children: [_jsx(SettingRow, { icon: Settings, title: "Pengaturan Lanjutan", subtitle: "Konfigurasi sistem dan backup", action: "navigate", onClick: () => navigate("/sekolahislamku/teacher/advanced-settings") }), _jsx("div", { className: "px-4 py-4", children: _jsxs(Btn, { palette: palette, variant: "outline", className: "w-full justify-center text-red-600 border-red-200 hover:bg-red-50", onClick: () => {
                                                                if (confirm("Apakah Anda yakin ingin keluar?")) {
                                                                    // Logout logic
                                                                    navigate("/login");
                                                                }
                                                            }, children: [_jsx(LogOut, { size: 16 }), "Keluar Akun"] }) })] })] }) })] })] }) })] }));
};
export default TeacherSettings;
