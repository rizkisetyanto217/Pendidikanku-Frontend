import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import FormattedDate from "@/constants/formattedDate";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML"; // pastikan path-nya sesuai
export default function DKMInformationLecture() {
    const { state } = useLocation();
    const lecture = state;
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Informasi Tema", onBackClick: () => history.back() }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-2", style: { backgroundColor: theme.white1 }, children: [_jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [_jsx(ShimmerImage, { src: lecture.lecture_image_url || "", alt: "Poster Kajian", className: "w-full lg:w-40 h-40 object-cover rounded-md" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx("h3", { className: "text-xl font-bold", style: { color: theme.primary }, children: lecture?.lecture_title }), _jsxs("p", { className: "text-sm", style: { color: theme.silver2 }, children: ["Dimulai:", " ", _jsx(FormattedDate, { value: lecture?.lecture_created_at, fullMonth: true }), " - 20.00 WIB"] }), _jsx("p", { className: "text-sm font-medium", style: { color: theme.black2 }, children: Array.isArray(lecture.lecture_teachers)
                                            ? lecture.lecture_teachers
                                                .map((t) => t.name?.trim())
                                                .filter(Boolean)
                                                .join(", ") || "Pengajar belum ditentukan"
                                            : typeof lecture.lecture_teachers === "string"
                                                ? lecture.lecture_teachers
                                                : (lecture.lecture_teachers?.name ??
                                                    "Pengajar belum ditentukan") }), _jsx("div", { className: "text-sm prose dark:prose-invert max-w-none", style: { color: theme.silver2 }, dangerouslySetInnerHTML: {
                                            __html: cleanTranscriptHTML(lecture?.lecture_description || ""),
                                        } }), _jsxs("div", { className: "flex gap-3 mt-2", children: [_jsx("span", { className: "text-xs font-semibold px-2 py-0.5 rounded", style: {
                                                    backgroundColor: theme.specialColor,
                                                    color: theme.white1,
                                                }, children: "Sertifikat" }), _jsxs("span", { className: "text-xs font-medium px-2 py-0.5 rounded-full border", style: {
                                                    color: theme.primary,
                                                    borderColor: theme.primary,
                                                }, children: ["\uD83D\uDC64 ", lecture?.total_lecture_sessions ?? 0, " Pertemuan"] })] })] })] }), _jsx("div", { className: "flex justify-end mt-6", children: _jsx("button", { onClick: () => navigate(`/dkm/tema/tambah-edit/${lecture.lecture_id}`, {
                                state: lecture,
                            }), className: "px-6 py-2 rounded-md font-semibold", style: {
                                backgroundColor: theme.primary,
                                color: theme.white1,
                            }, children: "Edit Tema" }) })] })] }));
}
