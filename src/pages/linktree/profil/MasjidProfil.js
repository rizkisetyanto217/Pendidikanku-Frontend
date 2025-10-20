import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import { Landmark, BookOpen, Users, ClipboardList, ChevronRight, Megaphone, } from "lucide-react";
import { useMemo } from "react";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML";
import { limitWords } from "@/constants/limitWords";
export default function MasjidProfile() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    // Profil masjid (umum)
    const { data: masjid, isLoading } = useQuery({
        queryKey: ["masjid-profile", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/masjids/${slug}`);
            return res.data.data;
        },
        enabled: !!slug,
    });
    // Detail profil lembaga masjid (description, created_at, founded_year)
    const { data: masjidProfile, isLoading: loadingProfile, isError: errorProfile, } = useQuery({
        queryKey: ["masjid-profile-detail-by-slug", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/masjid-profiles/by-slug/${slug}`);
            return res.data.data;
        },
        enabled: !!slug,
        staleTime: 60_000,
    });
    // Greetings (DKM & Pengajar)
    const { data: profiles, isLoading: loadingGreetings, isError: errorGreetings, } = useQuery({
        queryKey: ["masjid-profile-teacher-dkm", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/masjid-profile-teacher-dkm/by-masjid-slug/${slug}`);
            return (res.data?.data || []);
        },
        enabled: !!slug,
        staleTime: 60_000,
    });
    const visibleGreetings = useMemo(() => (profiles || [])
        .filter((p) => !!p.masjid_profile_teacher_dkm_message)
        .slice(0, 3)
        .map((p) => ({
        name: p.masjid_profile_teacher_dkm_name,
        role: p.masjid_profile_teacher_dkm_role,
        message: p.masjid_profile_teacher_dkm_message,
    })), [profiles]);
    // Format "Bulan YYYY" (id-ID)
    const didirikanText = useMemo(() => {
        const year = masjidProfile?.masjid_profile_founded_year;
        if (!year)
            return null;
        return `Didirikan tahun ${year}`;
    }, [masjidProfile?.masjid_profile_founded_year]);
    // Bersihkan & render deskripsi HTML
    const cleanedDesc = useMemo(() => masjidProfile?.masjid_profile_description
        ? cleanTranscriptHTML(masjidProfile.masjid_profile_description)
        : "", [masjidProfile?.masjid_profile_description]);
    if (isLoading || !masjid)
        return _jsx("div", { children: "Loading..." });
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Profil Masjid", onBackClick: () => {
                    if (window.history.length > 1)
                        navigate(-1);
                } }), _jsxs("div", { className: "rounded-xl overflow-hidden pb-20", children: [_jsx(ShimmerImage, { src: masjid.masjid_image_url || "", alt: `Foto ${masjid.masjid_name}`, className: "w-full h-48 md:h-64 object-cover", shimmerClassName: "rounded-none" }), _jsxs("div", { className: "py-4 md:p-5 space-y-2 text-base", style: { color: theme.black1 }, children: [_jsxs("h1", { className: "text-xl md:text-2xl font-semibold flex items-center gap-2", style: { color: theme.primary }, children: [_jsx(Landmark, { size: 20, style: { color: theme.primary } }), _jsx("span", { children: masjid.masjid_name })] }), _jsx("p", { className: "text-base", style: { color: theme.silver2 }, children: "Dikelola oleh DKM Masjid untuk umat muslim" }), _jsx("p", { className: "text-base font-medium", style: { color: theme.black2 }, children: masjid.masjid_location }), _jsx("p", { className: "text-base", style: { color: theme.silver2 }, children: loadingProfile
                                    ? "Memuat tahun didirikan…"
                                    : errorProfile
                                        ? "—"
                                        : didirikanText || "—" })] }), _jsxs("div", { className: "border-t-[5px] py-4 md:p-5 space-y-2 text-base", style: { borderColor: theme.white3 }, children: [_jsxs("h2", { className: "text-lg font-semibold flex items-center gap-2", style: { color: theme.quaternary }, children: [_jsx(BookOpen, { size: 18 }), _jsx("span", { children: "Profil Lembaga" })] }), _jsx("div", { className: "text-base leading-relaxed", style: { color: theme.black2 }, children: loadingProfile ? (_jsx("span", { children: "Memuat deskripsi\u2026" })) : cleanedDesc ? (_jsx("span", { children: limitWords(cleanedDesc, 50) })) : ("Masjid ini didirikan dengan tujuan menjadi tempat ibadah dan pusat kegiatan umat Islam di lingkungan sekitarnya.") }), _jsxs("button", { onClick: () => navigate("detail"), className: "mt-2 px-4 py-2 text-base rounded hover:opacity-80 border flex items-center gap-2", style: {
                                    borderColor: theme.quaternary,
                                    color: theme.quaternary,
                                }, children: [_jsx("span", { children: "Profil Lengkap" }), _jsx(ChevronRight, { size: 18 })] })] }), _jsxs("div", { className: "border-t-[5px] py-4 md:p-5 space-y-2 text-base", style: { borderColor: theme.white3 }, children: [_jsxs("h2", { className: "text-lg font-semibold flex items-center gap-2", style: { color: theme.primary }, children: [_jsx(Users, { size: 18 }), _jsx("span", { children: "Pengurus & Pengajar" })] }), _jsx("p", { className: "text-base", style: { color: theme.black2 }, children: "Pengurus dan Pengajar berasal dari masyarakat setempat yang memiliki tujuan memajukan Masjid." }), _jsx("div", { className: "space-y-2 pt-1", children: _jsxs("button", { onClick: () => navigate("dkm-pengajar"), className: "w-full flex justify-between items-center p-3 rounded hover:opacity-80 text-base", style: {
                                        backgroundColor: theme.white2,
                                        borderColor: theme.white3,
                                        borderWidth: 1,
                                        color: theme.black1,
                                    }, children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(ClipboardList, { size: 18 }), _jsx("span", { children: "Profil Pengurus Masjid dan Pengajar" })] }), _jsx(ChevronRight, { size: 18, style: { color: theme.silver2 } })] }) })] }), _jsxs("div", { className: "border-t-[5px] py-4 md:p-5 space-y-3 text-base", style: { borderColor: theme.white3 }, children: [_jsxs("h2", { className: "flex items-center gap-2 text-lg font-semibold", style: { color: theme.quaternary }, children: [_jsx(Megaphone, { size: 18 }), _jsx("span", { children: "Sambutan dan Motivasi" })] }), _jsxs("p", { className: "text-base", style: { color: theme.black2 }, children: ["Tulisan dari pengurus, pengajar dan jamaah", " ", _jsx("strong", { children: masjid.masjid_name })] }), loadingGreetings ? (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Memuat sambutan\u2026" })) : errorGreetings ? (_jsx("p", { className: "text-sm text-red-500", children: "Gagal memuat sambutan." })) : visibleGreetings.length > 0 ? (visibleGreetings.map((greet, i) => (_jsxs("div", { className: "p-3 rounded-lg text-base space-y-1", style: {
                                    backgroundColor: theme.white2,
                                    borderColor: theme.white3,
                                    borderWidth: 1,
                                }, children: [_jsx("p", { className: "font-semibold", style: { color: theme.black1 }, children: greet.name }), _jsx("p", { className: "text-base", style: { color: theme.silver2 }, children: greet.role }), _jsx("p", { className: "text-base leading-relaxed", style: { color: theme.black2 }, children: greet.message })] }, i)))) : (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Belum ada sambutan." })), _jsxs("button", { onClick: () => navigate("sambutan"), className: "w-full text-base rounded px-4 py-2 font-medium flex justify-between items-center border hover:opacity-80", style: {
                                    borderColor: theme.quaternary,
                                    color: theme.quaternary,
                                }, children: [_jsx("span", { children: "Selengkapnya" }), _jsx(ChevronRight, { size: 18 })] })] }), _jsx(BottomNavbar, {})] })] }));
}
