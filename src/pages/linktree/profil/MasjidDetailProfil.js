import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// MasjidProfileDetail.tsx
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { useNavigate, useParams } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import parse from "html-react-parser";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML"; // ← pakai util clean HTML
export default function MasjidProfileDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["masjid-profile-detail", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/masjid-profiles/by-slug/${slug}`);
            return res.data.data;
        },
        enabled: !!slug,
    });
    const InfoItem = ({ label, content, }) => (_jsxs("div", { className: "mb-4", children: [_jsx("p", { style: { color: theme.quaternary, fontWeight: 600 }, children: label }), _jsx("div", { className: "text-base leading-relaxed", style: { color: theme.black1 }, children: content })] }));
    // Bersihkan HTML sebelum render
    const cleanedDesc = data?.masjid_profile_description
        ? cleanTranscriptHTML(data.masjid_profile_description)
        : "";
    return (_jsx("div", { className: "min-h-screen rounded-md", children: _jsxs("div", { className: "mx-auto", children: [_jsx(PageHeaderUser, { title: "Profil Lembaga", onBackClick: () => {
                        if (window.history.length > 1)
                            navigate(-1);
                    } }), _jsx("div", { className: "p-2", children: isLoading ? (_jsx("p", { children: "Memuat data\u2026" })) : isError ? (_jsx("p", { children: "Gagal memuat data profil masjid." })) : (_jsxs(_Fragment, { children: [_jsx(InfoItem, { label: "Tahun Didirikan", content: data?.masjid_profile_founded_year ?? "-" }), _jsx(InfoItem, { label: "Deskripsi", content: cleanedDesc ? parse(cleanedDesc) : "-" })] })) })] }) }));
}
