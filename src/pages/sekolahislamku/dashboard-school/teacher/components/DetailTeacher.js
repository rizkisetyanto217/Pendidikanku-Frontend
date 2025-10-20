import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* ================= Imports ================= */
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { ArrowLeft, Mail, Phone } from "lucide-react";
/* ================= Dummy Data ================= */
const DUMMY_TEACHERS = [
    {
        id: "1",
        nip: "19800101",
        name: "Ahmad Fauzi",
        subject: "Matematika",
        gender: "L",
        phone: "081234567890",
        email: "ahmad.fauzi@example.com",
        status: "aktif",
    },
    {
        id: "2",
        nip: "19800202",
        name: "Siti Nurhaliza",
        subject: "Bahasa Indonesia",
        gender: "P",
        phone: "081298765432",
        email: "siti.nurhaliza@example.com",
        status: "aktif",
    },
];
/* ================= Helpers ================= */
const genderLabel = (g) => g === "L" ? "Laki-laki" : g === "P" ? "Perempuan" : "-";
const hijriWithWeekday = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
/* ================= Component ================= */
const DetailTeacher = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: user } = useCurrentUser();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const masjidId = useMemo(() => {
        const u = user || {};
        return u.masjid_id || u.lembaga_id || u?.masjid?.id || u?.lembaga?.id || "";
    }, [user]);
    const { data: resp } = useQuery({
        queryKey: ["masjid-teachers", masjidId],
        enabled: !!masjidId,
        queryFn: async () => {
            const res = await axios.get("/api/a/masjid-teachers/by-masjid", {
                params: masjidId ? { masjid_id: masjidId } : undefined,
            });
            return res.data;
        },
    });
    const teachersFromApi = resp?.data?.teachers?.map((t) => ({
        id: t.masjid_teachers_id,
        nip: t.nip ?? "N/A",
        name: t.user_name,
        subject: t.subject ?? "Umum",
        gender: t.gender,
        phone: t.phone,
        email: t.email,
        status: t.status,
    })) ?? [];
    const teachers = teachersFromApi.length > 0 ? teachersFromApi : DUMMY_TEACHERS;
    const teacher = teachers.find((t) => t.id === id);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Guru", hijriDate: hijriWithWeekday(new Date().toISOString()), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0 hidden lg:block", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 min-w-0 space-y-6", children: [_jsxs("div", { className: "mx-auto  md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { className: "cursor-pointer", size: 20 }) }), _jsx("h1", { className: "font-semibold text-lg", children: "Detail Guru" })] }), _jsx(SectionCard, { palette: palette, className: "p-6 space-y-5", children: teacher ? (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold", children: teacher.name }), _jsx("p", { className: "text-sm text-gray-500", children: teacher.subject ?? "-" })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "NIP" }), _jsx("div", { children: teacher.nip ?? "-" })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Gender" }), _jsx("div", { children: genderLabel(teacher.gender) })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Kontak" }), _jsxs("div", { className: "flex gap-3 mt-1", children: [teacher.phone && (_jsxs("a", { href: `tel:${teacher.phone}`, className: "flex items-center gap-1 hover:underline", style: { color: palette.primary }, children: [_jsx(Phone, { size: 14 }), " ", teacher.phone] })), teacher.email && (_jsxs("a", { href: `mailto:${teacher.email}`, className: "flex items-center gap-1 hover:underline", style: { color: palette.primary }, children: [_jsx(Mail, { size: 14 }), " Email"] }))] })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Status" }), _jsx(Badge, { palette: palette, variant: teacher.status === "aktif"
                                                                    ? "success"
                                                                    : teacher.status === "nonaktif"
                                                                        ? "warning"
                                                                        : "info", children: teacher.status ?? "-" })] })] })] })) : (_jsx("div", { className: "text-sm text-gray-500", children: "Data guru tidak ditemukan." })) })] })] }) })] }));
};
export default DetailTeacher;
