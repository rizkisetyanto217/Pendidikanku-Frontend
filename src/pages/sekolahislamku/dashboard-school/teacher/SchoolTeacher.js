import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* ================= Imports ================= */
import { useState, useMemo } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "../../components/home/ParentSideBar";
import { UserPlus, ChevronRight, Upload, AlertTriangle, Mail, Phone, ArrowLeft, } from "lucide-react";
import TambahGuru from "./components/AddTeacher";
import UploadFileGuru from "./components/UploadFileTeacher";
/* ================= Helpers ================= */
const genderLabel = (gender) => gender === "L" ? "Laki-laki" : gender === "P" ? "Perempuan" : "-";
const DEFAULT_SUBJECTS = [
    "Matematika",
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "IPA",
    "IPS",
    "Agama",
];
const hijriWithWeekday = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
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
    },
    {
        id: "2",
        nip: "19800202",
        name: "Siti Nurhaliza",
        subject: "Bahasa Indonesia",
        gender: "P",
        phone: "081298765432",
        email: "siti.nurhaliza@example.com",
    },
    {
        id: "3",
        nip: "19800303",
        name: "Budi Santoso",
        subject: "IPA",
        gender: "L",
        phone: "081377788899",
        email: "budi.santoso@example.com",
    },
    {
        id: "4",
        nip: "19800404",
        name: "Dewi Anggraini",
        subject: "Bahasa Inggris",
        gender: "P",
        phone: "081366655544",
        email: "dewi.anggraini@example.com",
    },
];
/* ================= Slug Hook ================= */
function useSchoolSlug() {
    const { slug } = useParams();
    const makePath = (path) => `/${slug}/sekolah/${path}`;
    return { slug, makePath };
}
/* ================= Components ================= */
const PageHeader = ({ palette, onImportClick, onAddClick, onBackClick, backLabel = "Kembali", }) => (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-6 ", children: [_jsxs("div", { className: "flex items-center gap-3  md:mt-0", children: [onBackClick && (_jsx(Btn, { palette: palette, variant: "ghost", onClick: onBackClick, className: " items-center gap-1.5 md:mt-0  hidden md:block", children: _jsx(ArrowLeft, { size: 20 }) })), _jsx("h1", { className: "text-lg font-semibold hidden md:block", children: "Guru" })] }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap -mt-3 md:-mt-0", children: [_jsxs(Btn, { onClick: onImportClick, className: "flex items-center gap-1.5 text-xs sm:text-sm", size: "sm", palette: palette, variant: "outline", children: [_jsx(Upload, { size: 14 }), _jsx("span", { className: "hidden sm:inline", children: "Import CSV" }), _jsx("span", { className: "sm:hidden", children: "Import" })] }), _jsxs(Btn, { variant: "default", className: "flex items-center gap-1.5 text-xs sm:text-sm", size: "sm", palette: palette, onClick: onAddClick, children: [_jsx(UserPlus, { size: 14 }), _jsx("span", { className: "hidden sm:inline", children: "Tambah Guru" }), _jsx("span", { className: "sm:hidden", children: "Tambah" })] })] })] }));
function TeacherCardMobile({ teacher, palette, }) {
    const { makePath } = useSchoolSlug();
    return (_jsxs("div", { className: "border rounded-lg p-4 space-y-3", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "font-medium", children: teacher.name }), _jsx("div", { className: "text-xs opacity-70", children: teacher.subject ?? "-" }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-600", children: "NIP: " }), teacher.nip ?? "-"] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600", children: "Gender: " }), genderLabel(teacher.gender)] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600", children: "Kontak: " }), _jsxs("div", { className: "flex gap-3 mt-1", children: [teacher.phone && (_jsxs("a", { href: `tel:${teacher.phone}`, className: "flex items-center gap-1 text-sm hover:underline", style: { color: palette.primary }, children: [_jsx(Phone, { size: 14 }), " ", teacher.phone] })), teacher.email && (_jsxs("a", { href: `mailto:${teacher.email}`, className: "flex items-center gap-1 text-sm hover:underline", style: { color: palette.primary }, children: [_jsx(Mail, { size: 14 }), " Email"] }))] })] })] }), _jsx("div", { className: "flex gap-2 pt-2 border-t", style: { borderColor: palette.silver1 }, children: _jsx(NavLink, { to: makePath(`guru/${teacher.id}`), className: "underline text-sm", style: { color: palette.primary }, children: "Detail" }) })] }, teacher.id));
}
const TeacherTableRow = ({ teacher, palette, }) => {
    const { makePath } = useSchoolSlug();
    return (_jsxs("tr", { className: "border-t hover:bg-black/5 dark:hover:bg-white/5 transition-colors", style: { borderColor: palette.silver1 }, children: [_jsx("td", { className: "py-3 px-5", children: teacher.nip ?? "-" }), _jsxs("td", { className: "py-3", children: [_jsx("div", { className: "font-medium", children: teacher.name }), teacher.email && (_jsx("div", { className: "text-sm opacity-70", children: teacher.email }))] }), _jsx("td", { className: "py-3", children: teacher.subject ?? "-" }), _jsx("td", { className: "py-3", children: genderLabel(teacher.gender) }), _jsx("td", { className: "py-3", children: _jsxs("div", { className: "flex items-center gap-3 text-sm", children: [teacher.phone && (_jsxs("a", { href: `tel:${teacher.phone}`, className: "flex items-center gap-1 hover:underline", style: { color: palette.primary }, children: [_jsx(Phone, { size: 14 }), " ", teacher.phone] })), teacher.email && (_jsxs("a", { href: `mailto:${teacher.email}`, className: "flex items-center gap-1 hover:underline", style: { color: palette.primary }, children: [_jsx(Mail, { size: 14 }), " Email"] }))] }) }), _jsx("td", { className: "py-3 text-right", children: _jsx("div", { className: "flex items-center gap-2 justify-end mr-3", children: _jsx(NavLink, { to: makePath(`guru/${teacher.id}`), children: _jsxs(Btn, { size: "sm", palette: palette, variant: "quaternary", className: "flex items-center gap-1", children: ["Detail ", _jsx(ChevronRight, { size: 14 })] }) }) }) })] }));
};
const TeachersTable = ({ palette, teachers, isLoading, isError, isFetching, onRefetch, }) => (_jsxs(SectionCard, { palette: palette, className: "p-0", children: [_jsxs("div", { className: "block md:hidden p-4 space-y-3", children: [isLoading && _jsx("div", { className: "text-center text-sm", children: "Memuat data\u2026" }), isError && (_jsxs("div", { className: "text-center text-sm", style: { color: palette.warning1 }, children: [_jsx(AlertTriangle, { size: 16, className: "inline mr-1" }), " Terjadi kesalahan.", " ", _jsx("button", { className: "underline", onClick: onRefetch, children: "Coba lagi" })] })), !isLoading && !isError && teachers.length === 0 && (_jsx("div", { className: "text-center text-sm opacity-70", children: "Belum ada data guru." })), !isLoading &&
                    !isError &&
                    teachers.map((t) => (_jsx(TeacherCardMobile, { teacher: t, palette: palette }, t.id)))] }), _jsx("div", { className: "hidden md:block overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left border-b", style: { color: palette.black2, borderColor: palette.silver1 }, children: [_jsx("th", { className: "py-3 px-5", children: "NIP" }), _jsx("th", { children: "Nama" }), _jsx("th", { children: "Mapel" }), _jsx("th", { children: "Gender" }), _jsx("th", { children: "Kontak" })] }) }), _jsxs("tbody", { children: [isLoading && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "py-8 text-center opacity-70", children: "Memuat data\u2026" }) })), isError && (_jsx("tr", { children: _jsxs("td", { colSpan: 6, className: "py-8 text-center", style: { color: palette.warning1 }, children: [_jsx(AlertTriangle, { size: 16, className: "inline mr-1" }), " Terjadi kesalahan."] }) })), !isLoading && !isError && teachers.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "py-10 text-center opacity-70", children: "Belum ada data guru." }) })), !isLoading &&
                                !isError &&
                                teachers.map((t) => (_jsx(TeacherTableRow, { teacher: t, palette: palette }, t.id)))] })] }) }), _jsxs("div", { className: "p-3 text-sm flex items-center justify-between border-t", style: { color: palette.black2, borderColor: palette.silver1 }, children: [_jsx("div", { children: isFetching ? "Memuat ulang…" : `Menampilkan ${teachers.length} data` }), _jsx("button", { className: "underline", onClick: onRefetch, children: "Refresh" })] })] }));
/* ================= Main Component ================= */
const TeachersPage = ({ showBack = false }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    const [openAdd, setOpenAdd] = useState(false);
    const [openImport, setOpenImport] = useState(false);
    const [q, setQ] = useState("");
    const { data: user } = useCurrentUser();
    const masjidId = useMemo(() => {
        const u = user || {};
        return u.masjid_id || u.lembaga_id || u?.masjid?.id || u?.lembaga?.id || "";
    }, [user]);
    const { data: resp, isLoading, isError, refetch, isFetching, } = useQuery({
        queryKey: ["masjid-teachers", masjidId],
        enabled: !!masjidId,
        staleTime: 2 * 60 * 1000,
        queryFn: async () => {
            const res = await axios.get("/api/a/masjid-teachers/by-masjid", {
                params: masjidId ? { masjid_id: masjidId } : undefined,
            });
            return res.data;
        },
    });
    const teachersFromApi = resp?.data?.teachers?.map((t) => ({
        id: t.masjid_teachers_id,
        nip: "N/A",
        name: t.user_name,
        subject: "Umum",
    })) ?? [];
    const teachersAll = teachersFromApi.length > 0 ? teachersFromApi : DUMMY_TEACHERS;
    const teachers = useMemo(() => {
        let list = teachersAll;
        if (q.trim()) {
            const needle = q.toLowerCase();
            list = list.filter((t) => t.name.toLowerCase().includes(needle) ||
                (t.nip ?? "").toLowerCase().includes(needle) ||
                (t.email ?? "").toLowerCase().includes(needle));
        }
        return list;
    }, [teachersAll, q]);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(TambahGuru, { open: openAdd, onClose: () => setOpenAdd(false), palette: palette, subjects: DEFAULT_SUBJECTS, masjidId: masjidId, onCreated: () => refetch() }), _jsx(UploadFileGuru, { open: openImport, onClose: () => setOpenImport(false), palette: palette }), _jsx(ParentTopBar, { palette: palette, title: "Guru", hijriDate: hijriWithWeekday(new Date().toISOString()), showBack: isFromMenuUtama }), _jsx("main", { className: "w-full px-4 md:px-6   md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsx(PageHeader, { palette: palette, onImportClick: () => setOpenImport(true), onAddClick: () => setOpenAdd(true), onBackClick: showBack ? () => navigate(-1) : undefined }), _jsx(TeachersTable, { palette: palette, teachers: teachers, isLoading: isLoading && !!masjidId, isError: isError, isFetching: isFetching, onRefetch: refetch })] })] }) })] }));
};
export default TeachersPage;
