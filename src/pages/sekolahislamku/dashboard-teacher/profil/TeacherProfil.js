import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { MessageCircle, Camera, BookOpen, MapPin, GraduationCap, Calendar, } from "lucide-react";
/* ================= Date/Time Utils ================ */
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const normalizeISOToLocalNoon = (iso) => iso ? toLocalNoonISO(new Date(iso)) : undefined;
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
/* ==========================================
   MAIN COMPONENT
========================================== */
export default function TeacherProfil() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const [loading, setLoading] = useState(false);
    const [teacher, setTeacher] = useState(null);
    const [form, setForm] = useState({
        user_teacher_name: "",
        user_teacher_field: "",
        user_teacher_short_bio: "",
        user_teacher_long_bio: "",
        user_teacher_greeting: "",
        user_teacher_education: "",
        user_teacher_activity: "",
        user_teacher_experience_years: 0,
        user_teacher_gender: "male",
        user_teacher_location: "",
        user_teacher_city: "",
        user_teacher_specialties: [],
        user_teacher_certificates: [],
        user_teacher_instagram_url: "",
        user_teacher_whatsapp_url: "",
        user_teacher_youtube_url: "",
        user_teacher_linkedin_url: "",
        user_teacher_github_url: "",
        user_teacher_telegram_username: "",
        user_teacher_title_prefix: "",
        user_teacher_title_suffix: "",
        user_teacher_is_verified: false,
        user_teacher_is_active: true,
    });
    const TODAY_ISO = normalizeISOToLocalNoon(new Date().toISOString()) ??
        toLocalNoonISO(new Date());
    const getInitials = (name) => name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "U";
    /* ======================================================
       FETCH DATA
    ====================================================== */
    const fetchTeacherData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/u/user-teachers/list");
            const items = res.data?.data?.items || [];
            setTeacher(items.length > 0 ? items[0] : null);
        }
        catch (err) {
            console.error("❌ Gagal ambil data guru:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTeacherData();
    }, []);
    /* ======================================================
       CREATE TEACHER PROFILE
    ====================================================== */
    const handleCreateTeacher = async () => {
        try {
            setLoading(true);
            await api.post("/api/u/user-teachers", form);
            await fetchTeacherData();
        }
        catch (err) {
            console.error("❌ Gagal membuat profil guru:", err);
        }
        finally {
            setLoading(false);
        }
    };
    /* ======================================================
       UI - FORM CREATE
    ====================================================== */
    const renderCreateForm = () => (_jsx("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-6", children: "Buat Profil Guru" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Nama Lengkap" }), _jsx("input", { type: "text", placeholder: "Masukkan nama lengkap", value: form.user_teacher_name, onChange: (e) => setForm({ ...form, user_teacher_name: e.target.value }), className: "w-full border rounded-lg p-3", style: {
                                            borderColor: palette.silver1,
                                            background: palette.white1,
                                            color: palette.black1,
                                        } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Bidang" }), _jsx("input", { type: "text", placeholder: "Contoh: Fiqih, Tahfiz", value: form.user_teacher_field, onChange: (e) => setForm({ ...form, user_teacher_field: e.target.value }), className: "w-full border rounded-lg p-3", style: {
                                            borderColor: palette.silver1,
                                            background: palette.white1,
                                            color: palette.black1,
                                        } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Bio Singkat" }), _jsx("textarea", { placeholder: "Deskripsi singkat tentang Anda", value: form.user_teacher_short_bio, onChange: (e) => setForm({ ...form, user_teacher_short_bio: e.target.value }), rows: 3, className: "w-full border rounded-lg p-3", style: {
                                            borderColor: palette.silver1,
                                            background: palette.white1,
                                            color: palette.black1,
                                        } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Bio Lengkap" }), _jsx("textarea", { placeholder: "Ceritakan lebih detail tentang pengalaman dan keahlian Anda", value: form.user_teacher_long_bio, onChange: (e) => setForm({ ...form, user_teacher_long_bio: e.target.value }), rows: 5, className: "w-full border rounded-lg p-3", style: {
                                            borderColor: palette.silver1,
                                            background: palette.white1,
                                            color: palette.black1,
                                        } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Salam Pembuka" }), _jsx("input", { type: "text", placeholder: "Assalamualaikum...", value: form.user_teacher_greeting, onChange: (e) => setForm({ ...form, user_teacher_greeting: e.target.value }), className: "w-full border rounded-lg p-3", style: {
                                            borderColor: palette.silver1,
                                            background: palette.white1,
                                            color: palette.black1,
                                        } })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Pendidikan" }), _jsx("input", { type: "text", placeholder: "LIPIA 2018; Pesantren X", value: form.user_teacher_education, onChange: (e) => setForm({ ...form, user_teacher_education: e.target.value }), className: "w-full border rounded-lg p-3", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                    color: palette.black1,
                                                } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Kegiatan Mengajar" }), _jsx("input", { type: "text", placeholder: "Mengajar di...", value: form.user_teacher_activity, onChange: (e) => setForm({ ...form, user_teacher_activity: e.target.value }), className: "w-full border rounded-lg p-3", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                    color: palette.black1,
                                                } })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Tahun Pengalaman" }), _jsx("input", { type: "number", placeholder: "0", value: form.user_teacher_experience_years, onChange: (e) => setForm({
                                                    ...form,
                                                    user_teacher_experience_years: Number(e.target.value),
                                                }), className: "w-full border rounded-lg p-3", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                    color: palette.black1,
                                                } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Kota" }), _jsx("input", { type: "text", placeholder: "Jakarta", value: form.user_teacher_city, onChange: (e) => setForm({ ...form, user_teacher_city: e.target.value }), className: "w-full border rounded-lg p-3", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                    color: palette.black1,
                                                } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Provinsi" }), _jsx("input", { type: "text", placeholder: "DKI Jakarta", value: form.user_teacher_location, onChange: (e) => setForm({ ...form, user_teacher_location: e.target.value }), className: "w-full border rounded-lg p-3", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                    color: palette.black1,
                                                } })] })] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6 pt-4 border-t", style: { borderColor: palette.silver1 }, children: [_jsx(Btn, { palette: palette, variant: "outline", onClick: () => setForm({
                                            user_teacher_name: "",
                                            user_teacher_field: "",
                                            user_teacher_short_bio: "",
                                            user_teacher_long_bio: "",
                                            user_teacher_greeting: "",
                                            user_teacher_education: "",
                                            user_teacher_activity: "",
                                            user_teacher_experience_years: 0,
                                            user_teacher_gender: "male",
                                            user_teacher_location: "",
                                            user_teacher_city: "",
                                            user_teacher_specialties: [],
                                            user_teacher_certificates: [],
                                            user_teacher_instagram_url: "",
                                            user_teacher_whatsapp_url: "",
                                            user_teacher_youtube_url: "",
                                            user_teacher_linkedin_url: "",
                                            user_teacher_github_url: "",
                                            user_teacher_telegram_username: "",
                                            user_teacher_title_prefix: "",
                                            user_teacher_title_suffix: "",
                                            user_teacher_is_verified: false,
                                            user_teacher_is_active: true,
                                        }), children: "Reset" }), _jsx(Btn, { palette: palette, onClick: handleCreateTeacher, disabled: loading, children: loading ? "Menyimpan..." : "Simpan Profil Guru" })] })] })] }) }) }));
    /* ======================================================
       UI - TAMPIL DATA
    ====================================================== */
    const renderProfileView = () => (_jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6", children: [_jsxs("div", { className: "relative flex-shrink-0", children: [_jsx("div", { className: "w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-white text-2xl font-semibold overflow-hidden", style: { backgroundColor: palette.primary }, children: teacher.user_teacher_avatar_url ? (_jsx("img", { src: teacher.user_teacher_avatar_url, alt: teacher.user_teacher_name, className: "w-full h-full object-cover" })) : (getInitials(teacher.user_teacher_name)) }), _jsx("button", { className: "absolute -bottom-1 -right-1 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform", style: { backgroundColor: palette.primary }, children: _jsx(Camera, { size: 18 }) })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsxs("h2", { className: "font-semibold text-xl md:text-2xl", children: [teacher.user_teacher_title_prefix, " ", teacher.user_teacher_name, " ", teacher.user_teacher_title_suffix] }), _jsx("p", { className: "text-base mt-1", style: { color: palette.black2 }, children: teacher.user_teacher_field })] }), _jsx(Badge, { palette: palette, children: teacher.user_teacher_is_active ? "Aktif" : "Nonaktif" })] }), _jsxs("div", { className: "mt-4 flex flex-wrap gap-4 text-sm", style: { color: palette.black2 }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { size: 16 }), _jsxs("span", { children: [teacher.user_teacher_city, ", ", teacher.user_teacher_location] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { size: 16 }), _jsxs("span", { children: [teacher.user_teacher_experience_years, " tahun pengalaman"] })] })] })] })] }) }), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch", children: [_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 h-full", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("div", { className: "h-9 w-9 rounded-xl flex items-center justify-center", style: {
                                                background: palette.white3,
                                                color: palette.quaternary,
                                            }, children: _jsx(MessageCircle, { size: 18 }) }), _jsx("h3", { className: "font-semibold text-base", children: "Salam Pembuka" })] }), _jsxs("p", { className: "italic leading-relaxed", style: { color: palette.black2 }, children: ["\"", teacher.user_teacher_greeting, "\""] })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 h-full", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("div", { className: "h-9 w-9 rounded-xl flex items-center justify-center", style: {
                                                background: palette.white3,
                                                color: palette.secondary,
                                            }, children: _jsx(BookOpen, { size: 18 }) }), _jsx("h3", { className: "font-semibold text-base", children: "Informasi" })] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(GraduationCap, { size: 16, className: "mt-0.5 flex-shrink-0", style: { color: palette.primary } }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Pendidikan: " }), _jsx("span", { style: { color: palette.black2 }, children: teacher.user_teacher_education })] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(BookOpen, { size: 16, className: "mt-0.5 flex-shrink-0", style: { color: palette.primary } }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Kegiatan: " }), _jsx("span", { style: { color: palette.black2 }, children: teacher.user_teacher_activity })] })] })] })] }) })] }), _jsx("section", { children: _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5", children: [_jsx("h3", { className: "font-semibold text-lg mb-4", children: "Tentang" }), _jsx("p", { className: "leading-relaxed whitespace-pre-line", style: { color: palette.black2 }, children: teacher.user_teacher_long_bio })] }) }) })] }));
    /* ======================================================
       RENDER FINAL
    ====================================================== */
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Profil Guru", gregorianDate: TODAY_ISO, hijriDate: hijriLong(TODAY_ISO) }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), loading ? (_jsx("div", { className: "flex-1 flex items-center justify-center py-20", children: _jsx("div", { className: "text-center", style: { color: palette.silver2 }, children: "Memuat data guru..." }) })) : teacher ? (renderProfileView()) : (renderCreateForm())] }) })] }));
}
