import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import QRCodeLink from "@/components/common/main/QRCodeLink";
export default function MasjidCertificateLecture() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { user_exam_id } = useParams();
    const { data, isLoading } = useQuery({
        queryKey: ["certificate-by-user-exam", user_exam_id],
        queryFn: async () => {
            const res = await axios.get(`/public/certificates/by-user-exam/${user_exam_id}`);
            console.log("📦 Data sertifikat:", res.data);
            return res.data;
        },
        enabled: !!user_exam_id,
    });
    const formatGrade = (n) => {
        if (n == null)
            return "-";
        if (n >= 91)
            return `${n} (Istimewa)`;
        if (n >= 81)
            return `${n} (Sangat Baik)`;
        if (n >= 71)
            return `${n} (Baik)`;
        if (n >= 61)
            return `${n} (Cukup)`;
        return `${n} (Perlu Bimbingan)`;
    };
    if (isLoading) {
        return _jsx("p", { className: "text-center py-10", children: "Memuat sertifikat..." });
    }
    const certificate = data;
    return (_jsxs("div", { className: "min-h-screen space-y-4 pb-20", style: { backgroundColor: theme.white2 }, children: [_jsx(PageHeaderUser, { title: "Sertifikat", onBackClick: () => {
                    if (window.history.length > 1)
                        window.history.back();
                } }), _jsxs("div", { className: "rounded-lg p-6 space-y-3", style: {
                    backgroundColor: theme.tertiary,
                    color: theme.black1,
                }, children: [_jsx("h2", { className: "text-center font-semibold text-lg", style: { color: theme.primary }, children: certificate?.certificate_title || "Sertifikat Kelulusan" }), _jsx("p", { className: "text-center text-sm", style: { color: theme.silver2 }, children: "No. 221/03-05-2025" }), _jsxs("div", { className: "text-center text-sm", style: { color: theme.black1 }, children: [_jsx("p", { children: "Diberikan Kepada" }), _jsx("p", { className: "font-semibold text-base", children: certificate?.user_lecture_exam_user_name || "Nama Tidak Diketahui" }), _jsx("p", { children: "Nomor Induk Peserta : 10202025" })] }), _jsxs("div", { className: "text-center text-sm", style: { color: theme.black1 }, children: [_jsx("p", { children: "Atas pencapaiannya sebagai peserta telah menyelesaikan pembelajaran" }), _jsxs("p", { className: "font-semibold", style: { color: theme.primary }, children: [certificate?.lecture_title, " - ", certificate?.masjid_name] }), _jsxs("p", { children: ["Dengan Nilai", " ", _jsx("span", { className: "font-bold", children: formatGrade(certificate?.user_lecture_exam_grade_result) })] }), _jsx("p", { children: "Semoga ilmu yang telah dipelajari bermanfaat dan mendapatkan ridho Allah ta'ala" })] }), _jsxs("div", { className: "flex justify-between items-center mt-6 flex-wrap gap-y-6", children: [_jsxs("div", { className: "text-center w-[30%] min-w-[100px]", children: [_jsx("div", { className: "w-20 h-10 rounded-sm mb-1 mx-auto", style: { backgroundColor: theme.black1 } }), _jsx("p", { className: "text-xs", style: { color: theme.silver2 }, children: "Ustadz Fehri, Lc" }), _jsx("p", { className: "text-xs", style: { color: theme.silver4 }, children: "Pengajar" })] }), _jsx("div", { className: "w-[30%] min-w-[100px]", children: _jsx(QRCodeLink, { value: window.location.href }) }), _jsxs("div", { className: "text-center w-[30%] min-w-[100px]", children: [_jsx("div", { className: "w-20 h-10 rounded-sm mb-1 mx-auto", style: { backgroundColor: theme.black1 } }), _jsx("p", { className: "text-xs", style: { color: theme.silver2 }, children: "Bapak Hendi" }), _jsx("p", { className: "text-xs", style: { color: theme.silver4 }, children: "Ketua DKM" })] })] })] }), _jsxs("div", { className: "pt-4 space-y-3", children: [_jsx(Button, { className: "w-full", style: { backgroundColor: theme.primary }, children: "Unduh Sertifikat" }), _jsxs(Button, { variant: "outline", className: "w-full flex items-center justify-center gap-2", style: {
                            color: theme.black1,
                            borderColor: theme.silver1,
                            backgroundColor: theme.white1,
                        }, children: [_jsx(Share2, { className: "w-4 h-4" }), " Bagikan Sertifikat"] })] })] }));
}
