import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import FormattedDate from "@/constants/formattedDate";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import ShowImageFull from "@/components/pages/home/ShowImageFull";
import { useState } from "react";
export default function MasjidDetailLecture() {
    const { id, slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [showImageModal, setShowImageModal] = useState(false);
    const { data: kajian, isLoading, isError, error, } = useQuery({
        queryKey: ["detail-agenda", id],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-u/by-id/${id}`);
            return res.data;
        },
        enabled: !!id,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });
    if (isLoading)
        return _jsx("p", { className: "p-4", children: "Memuat data..." });
    if (isError || !kajian)
        return (_jsxs("p", { className: "p-4 text-red-500", children: ["Gagal memuat data kajian. ", String(error)] }));
    const handleBack = () => {
        // 1) prioritas: from (kirim saat push ke halaman ini)
        if (location.state && location.state.from) {
            navigate(location.state.from);
            return;
        }
        // 2) ada riwayat? (React Router v6 simpan idx di history.state)
        const idx = (window.history.state && window.history.state.idx) ?? 0;
        if (idx > 0) {
            navigate(-1);
            return;
        }
        // 3) fallback
        navigate(`/masjid/${slug}/jadwal-kajian`);
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx(PageHeaderUser, { title: "Detail Kajian", onBackClick: handleBack }), _jsx("div", { className: "rounded-md shadow-sm", style: {
                    backgroundColor: theme.white1,
                    color: theme.black1,
                }, children: _jsxs("div", { className: "md:flex md:gap-6", children: [_jsx("div", { className: "w-full md:w-1/2 aspect-[3/4] md:aspect-auto md:h-[420px] rounded-xl overflow-hidden", children: _jsx(ShimmerImage, { src: kajian.lecture_session_image_url
                                    ? decodeURIComponent(kajian.lecture_session_image_url)
                                    : undefined, alt: kajian.lecture_session_title, className: "w-full h-full object-cover cursor-pointer", shimmerClassName: "rounded", onClick: () => setShowImageModal(true) }) }), _jsxs("div", { className: "w-full md:w-1/2 space-y-4 p-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-base font-semibold", style: { color: theme.quaternary }, children: "Informasi Kajian" }), _jsxs("ul", { className: "text-sm space-y-1 mt-1", children: [_jsxs("li", { children: ["\uD83D\uDCD8 ", _jsx("strong", { children: "Materi:" }), " ", kajian.lecture_session_title] }), _jsxs("li", { children: ["\uD83D\uDC64 ", _jsx("strong", { children: "Pengajar:" }), " ", kajian.lecture_session_teacher_name || "-"] }), _jsxs("li", { children: ["\uD83D\uDD52 ", _jsx("strong", { children: "Jadwal:" }), " ", _jsx(FormattedDate, { value: kajian.lecture_session_start_time, fullMonth: true, className: "inline" })] }), _jsxs("li", { children: ["\uD83D\uDCCD ", _jsx("strong", { children: "Tempat:" }), " ", kajian.lecture_session_place || "-"] })] })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-base font-semibold", style: { color: theme.quaternary }, children: "Keterangan" }), _jsx("p", { className: "text-sm leading-relaxed", style: { color: theme.black2 }, children: kajian.lecture_session_description ||
                                                "Tidak ada deskripsi yang tersedia." })] })] })] }) }), showImageModal && kajian.lecture_session_image_url && (_jsx(ShowImageFull, { url: kajian.lecture_session_image_url, onClose: () => setShowImageModal(false) }))] }));
}
