import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import { FileText, MapPin, BarChartHorizontal } from "lucide-react"; // ✅ lucide icons
export default function MasjidInformationLecture() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { slug: masjidSlug, lecture_slug } = useParams();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["lecture-by-slug", lecture_slug],
        queryFn: async () => {
            const res = await axios.get(`/public/lectures/by-slug/${lecture_slug}`);
            return res.data?.data;
        },
        enabled: !!lecture_slug,
        staleTime: 5 * 60 * 1000,
    });
    const lecture = data
        ? { ...data.lecture, lecture_teachers: data.lecture_teachers || [] }
        : undefined;
    const userProgress = data?.user_progress;
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Tema Kajian", onBackClick: () => navigate(`/masjid/${masjidSlug}/tema/${lecture_slug}`) }), _jsx("div", { className: "lg:p-4", children: isLoading ? (_jsx("p", { className: "text-sm text-silver-400", children: "Memuat data..." })) : isError || !lecture ? (_jsx("p", { className: "text-red-500 text-sm", children: "Gagal memuat data tema kajian." })) : (_jsxs("div", { className: "rounded-xl overflow-hidden shadow-lg flex flex-col lg:flex-row", style: {
                        backgroundColor: theme.white2,
                        borderColor: theme.silver2,
                    }, children: [lecture.lecture_image_url && (_jsx("div", { className: "lg:w-1/2 w-full", children: _jsx(ShimmerImage, { src: lecture.lecture_image_url, alt: "Gambar Materi", className: "w-full object-cover h-full", style: { aspectRatio: "4 / 5", maxHeight: "540px" }, shimmerClassName: "rounded-none" }) })), _jsxs("div", { className: "p-4 space-y-4 lg:w-1/2", children: [_jsx("h2", { className: "text-xl font-semibold", style: { color: theme.primary }, children: lecture.lecture_title }), lecture.lecture_teachers?.length > 0 && (_jsxs("p", { className: "text-sm", style: { color: theme.black2 }, children: [_jsx("strong", { children: "Pengajar:" }), " ", [
                                            ...new Set(lecture.lecture_teachers.map((t) => t.name)),
                                        ].join(", ")] })), _jsxs("div", { className: "flex items-start gap-2 text-sm", style: { color: theme.black2 }, children: [_jsx(FileText, { className: "w-4 h-4 mt-1" }), _jsxs("div", { children: [_jsx("strong", { children: "Deskripsi:" }), _jsx("p", { className: "mt-1 whitespace-pre-wrap", children: lecture.lecture_description || "-" })] })] }), _jsxs("div", { className: "flex items-start gap-2 text-sm", style: { color: theme.black2 }, children: [_jsx(MapPin, { className: "w-4 h-4 mt-1" }), _jsxs("p", { children: [_jsx("strong", { children: "Lokasi:" }), " Masjid At-Taqwa, Ciracas"] })] }), userProgress && (_jsxs("div", { className: "pt-2 border-t border-gray-300 dark:border-zinc-600", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(BarChartHorizontal, { className: "w-4 h-4", style: { color: theme.black2 } }), _jsx("p", { className: "text-sm font-semibold", style: { color: theme.black2 }, children: "Progress Belajar:" })] }), _jsxs("ul", { className: "text-sm list-disc ml-5", style: { color: theme.black2 }, children: [_jsxs("li", { children: ["Nilai Akhir: ", userProgress.grade_result ?? "-"] }), _jsxs("li", { children: ["Sesi Selesai: ", userProgress.total_completed_sessions ?? 0] }), _jsxs("li", { children: ["Terdaftar: ", userProgress.is_registered ? "Ya" : "Belum"] }), _jsxs("li", { children: ["Pembayaran: ", userProgress.has_paid ? "Lunas" : "Belum"] })] })] }))] })] })) })] }));
}
