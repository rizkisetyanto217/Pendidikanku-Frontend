import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import axios from "@/lib/axios";
export default function LectureSelectField({ masjidId, name, value, label = "Pilih Tema Kajian", onChange, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data: lectures = [], isLoading, isError, error, } = useQuery({
        queryKey: ["lectures", masjidId],
        queryFn: async () => {
            const res = await axios.get("/api/a/lectures/by-masjid", {
                params: { masjid_id: masjidId },
                withCredentials: true,
            });
            console.log("📥 Lecture options response:", res.data);
            return res.data.data;
        },
        enabled: !!masjidId,
        staleTime: 1000 * 60 * 5,
    });
    if (!masjidId) {
        return _jsx("p", { className: "text-sm text-gray-500", children: "Masjid belum tersedia." });
    }
    if (isError) {
        return (_jsxs("p", { className: "text-sm text-red-500", children: ["Gagal memuat daftar tema kajian: ", error.message] }));
    }
    console.log("📥 Daftar tema kajian:", lectures);
    return (_jsxs("div", { className: "w-full space-y-1", children: [label && (_jsx("label", { htmlFor: name, className: "block text-sm font-medium", style: { color: theme.black2 }, children: label })), _jsxs("div", { className: "relative", children: [_jsxs("select", { id: name, name: name, value: value, onChange: onChange, disabled: isLoading, className: "w-full text-sm px-4 py-2.5 pr-10 border rounded-lg transition-all appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500", style: {
                            backgroundColor: theme.white2,
                            borderColor: theme.silver1,
                            color: theme.black1,
                        }, children: [_jsx("option", { value: "", disabled: true, children: isLoading ? "Memuat tema kajian..." : "Pilih Tema Kajian" }), lectures.map((lecture) => (_jsx("option", { value: lecture.lecture_id, children: lecture.lecture_title }, lecture.lecture_id)))] }), _jsx("div", { className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm", style: { color: theme.black2 }, children: "^" })] })] }));
}
