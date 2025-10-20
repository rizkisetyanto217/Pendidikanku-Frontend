import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BookOpen, FileText, Home, MessageSquare, PlayCircle, StickyNote, Video, } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML";
export default function DKMDetailLecture() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const initialLecture = state;
    const { data: lecture, isLoading, isError, error, } = useQuery({
        queryKey: ["lecture", id],
        enabled: !!id,
        queryFn: async () => {
            const res = await axios.get(`/api/a/lectures/${id}`);
            return res.data.data;
        },
        initialData: initialLecture,
    });
    const navItems = [
        { icon: _jsx(Home, { size: 20 }), label: "Informasi", to: "informasi" },
        { icon: _jsx(BookOpen, { size: 20 }), label: "Latihan Soal", to: "latihan-soal" },
        {
            icon: _jsx(FileText, { size: 20 }),
            label: "Materi Lengkap",
            to: "materi-lengkap",
        },
        {
            icon: _jsx(MessageSquare, { size: 20 }),
            label: "Masukan & Saran",
            to: "saran-masukan",
        },
        {
            icon: _jsx(PlayCircle, { size: 20 }),
            label: "Kumpulan Kajian",
            to: "semua-kajian",
        },
        { icon: _jsx(Video, { size: 20 }), label: "Video Audio", to: "video" },
        { icon: _jsx(StickyNote, { size: 20 }), label: "Ringkasan", to: "ringkasan" },
        {
            icon: _jsx(MessageSquare, { size: 20 }),
            label: "Tanya Jawab",
            to: "tanya-jawab",
        },
        { icon: _jsx(FileText, { size: 20 }), label: "Dokumen", to: "dokumen" },
    ];
    if (isLoading)
        return _jsx("p", { className: "text-sm text-gray-500", children: "Memuat data..." });
    if (isError && !lecture) {
        // Hanya render error jika benar-benar tidak ada data sama sekali
        const errMsg = error?.response?.data?.message ||
            error?.message ||
            "Data tidak ditemukan.";
        return (_jsxs("p", { className: "text-sm text-red-500 p-4", children: ["Gagal memuat data kajian. ", errMsg] }));
    }
    if (!lecture) {
        // Jika data belum tersedia (bahkan dari initialData), tampilkan placeholder
        return _jsx("p", { className: "text-sm text-gray-500", children: "Memuat data kajian..." });
    }
    // Nama Pengajar
    let teacherName = "Pengajar belum ditentukan";
    if (Array.isArray(lecture.lecture_teachers)) {
        const names = lecture.lecture_teachers
            .map((t) => t?.name?.trim())
            .filter(Boolean);
        if (names.length > 0)
            teacherName = names.join(", ");
    }
    else if (typeof lecture.lecture_teachers === "string") {
        teacherName = lecture.lecture_teachers;
    }
    else if (lecture.lecture_teachers?.name) {
        teacherName = lecture.lecture_teachers.name;
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Tema Detail", backTo: "/dkm/tema" }), _jsxs("div", { className: "p-2 rounded-xl flex flex-col lg:flex-row gap-4", style: { backgroundColor: theme.white1 }, children: [_jsx(ShimmerImage, { src: lecture.lecture_image_url || "", alt: "Poster Kajian", className: "w-full lg:w-40 h-40 object-cover rounded-md" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold", style: { color: theme.primary }, children: lecture.lecture_title }), _jsxs("p", { className: "text-sm", style: { color: theme.silver2 }, children: [lecture.lecture_created_at?.split("T")[0], " / Aula utama Masjid"] }), _jsx("p", { className: "text-sm font-medium mt-2", style: { color: theme.black2 }, children: teacherName }), _jsx("div", { className: "text-sm mt-1 leading-relaxed", style: { color: theme.silver2 }, dangerouslySetInnerHTML: {
                                    __html: cleanTranscriptHTML(lecture.lecture_description),
                                } }), _jsxs("div", { className: "flex justify-between items-center mt-3", children: [_jsx("span", { className: "text-xs font-semibold px-2 py-0.5 rounded", style: {
                                            backgroundColor: theme.specialColor,
                                            color: theme.white1,
                                        }, children: "Sertifikat" }), _jsxs("span", { className: "text-sm", style: { color: theme.silver2 }, children: ["\uD83D\uDC64 ", lecture.total_lecture_sessions ?? 0, " Pertemuan"] })] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-base font-semibold mb-3", style: { color: theme.black1 }, children: "Navigasi Utama" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4", children: navItems.map((item) => (_jsxs("button", { onClick: () => navigate(`/dkm/tema/tema-detail/${lecture.lecture_id}/${item.to}`, {
                                state: lecture,
                            }), className: "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition", style: {
                                backgroundColor: theme.white1,
                                border: `1px solid ${theme.silver1}`,
                            }, children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", style: { color: theme.black1 }, children: [item.icon, item.label] }), _jsx("span", { style: { color: theme.silver2 }, children: "\u203A" })] }, item.label))) })] })] }));
}
