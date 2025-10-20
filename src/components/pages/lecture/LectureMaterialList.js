import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useNavigate, useParams } from "react-router-dom";
export default function LectureMaterialList({ data, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { slug = "" } = useParams();
    return (_jsx("div", { className: "space-y-3", children: data.map((item) => (_jsxs("div", { onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("🧭 Navigasi klik item:");
                console.log("   👉 ID:", item.id);
                console.log("   🔗 Slug:", item.lecture_session_slug);
                console.log("   📍 Target URL:", `/masjid/${slug}/soal-materi/${item.lecture_session_slug}`);
                navigate(`/masjid/${slug}/soal-materi/${item.lecture_session_slug}`);
            }, className: "flex rounded-xl shadow-sm cursor-pointer transition hover:opacity-90", style: {
                backgroundColor: theme.white1,
                border: `1px solid ${theme.silver1}`,
            }, children: [item.imageUrl && (_jsx("div", { className: "aspect-[4/5] w-[90px] min-h-[112px] flex-shrink-0 overflow-hidden rounded-lg border", style: { borderColor: theme.white3 }, children: _jsx(ShimmerImage, { src: decodeURIComponent(item.imageUrl), alt: item.title, className: "w-full h-full object-cover" }) })), _jsxs("div", { className: "flex flex-col justify-between flex-1 py-3 pr-3 px-4 md:px-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold mb-1", style: { color: theme.black1 }, children: item.title }), _jsx("p", { className: "text-xs", style: { color: theme.silver2 }, children: item.teacher }), _jsx("p", { className: "text-xs", style: { color: theme.silver2 }, children: item.time })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mt-2", children: [item.attendanceStatus !== undefined &&
                                    item.attendanceStatus !== 0 && (_jsx("span", { className: "text-xs px-2 py-1 rounded-full font-medium", style: {
                                        backgroundColor: item.attendanceStatus === 1
                                            ? theme.success2
                                            : item.attendanceStatus === 2
                                                ? theme.warning1
                                                : theme.white3,
                                        color: item.attendanceStatus === 1
                                            ? theme.success1
                                            : item.attendanceStatus === 2
                                                ? theme.white1
                                                : theme.silver2,
                                    }, children: item.attendanceStatus === 1
                                        ? "Hadir Tatap Muka ✅"
                                        : item.attendanceStatus === 2
                                            ? "Hadir Online 💻"
                                            : "Tidak Hadir" })), item.gradeResult === undefined && (_jsx("span", { className: "text-xs px-2 py-1 rounded-full font-medium", style: {
                                        backgroundColor: item.status === "tersedia"
                                            ? theme.success1
                                            : theme.white3,
                                        color: item.status === "tersedia" ? theme.white1 : theme.silver2,
                                    }, children: item.status === "tersedia"
                                        ? "Materi & Soal Tersedia"
                                        : "Materi & Soal Dalam Proses" })), item.gradeResult !== undefined && (_jsxs("span", { className: "text-xs px-2 py-1 rounded-full font-medium", style: {
                                        backgroundColor: item.gradeResult >= 70 ? theme.primary2 : theme.success1,
                                        color: item.gradeResult >= 70 ? theme.primary : theme.success2,
                                    }, children: ["Nilai : ", item.gradeResult] }))] })] })] }, item.id))) }));
}
