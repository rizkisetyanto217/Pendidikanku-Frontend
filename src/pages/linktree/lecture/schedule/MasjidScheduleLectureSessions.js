import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import FormattedDate from "@/constants/formattedDate";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import { Tabs, TabsContent } from "@/components/common/main/Tabs";
import { useSearchParams } from "react-router-dom";
import ShimmerImage from "@/components/common/main/ShimmerImage";
export default function MasjidScheduleLecture() {
    const { slug } = useParams();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get("tab") || "mendatang";
    const [tab, setTab] = useState(tabParam);
    const { data: kajianList, isLoading } = useQuery({
        queryKey: ["kajianList", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-u/mendatang/${slug}`);
            return res.data?.data ?? [];
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
    // update URL when tab changes
    useEffect(() => {
        setSearchParams({ tab });
    }, [tab, setSearchParams]);
    const { data: jadwalRutin = [], isLoading: loadingRutin } = useQuery({
        queryKey: ["jadwalRutin", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-schedules/by-masjid/${slug}`);
            return res.data ?? [];
        },
        enabled: !!slug && tab === "rutin",
        staleTime: 5 * 60 * 1000,
    });
    const getNamaHari = (day) => {
        const hari = [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
        ];
        return hari[day] || "-";
    };
    const renderCardRutin = (item) => (_jsx("div", { className: "border rounded-xl overflow-hidden shadow-sm", style: {
            borderColor: theme.silver1,
            backgroundColor: theme.white1,
        }, children: _jsxs("div", { className: "flex gap-3", children: [_jsx(ShimmerImage, { src: item.lecture?.lecture_image_url
                        ? decodeURIComponent(item.lecture.lecture_image_url)
                        : undefined, alt: item.lecture_schedules_title, className: "w-36 h-36 object-cover rounded-l-xl", shimmerClassName: "rounded-l-xl" }), _jsxs("div", { className: "flex-1 text-sm p-2", children: [_jsx("p", { className: "text-xs font-semibold", style: { color: theme.primary }, children: item.lecture?.lecture_title }), _jsx("p", { className: "font-semibold line-clamp-2 pt-2", style: { color: theme.black1 }, children: item.lecture_schedules_title }), _jsxs("p", { className: "text-xs pt-2", style: { color: theme.silver2 }, children: [getNamaHari(item.lecture_schedules_day_of_week), " \u2013", " ", item.lecture_schedules_start_time?.slice(0, 5), " WIB"] }), _jsx("p", { className: "text-xs pt-1", style: { color: theme.silver2 }, children: item.lecture_schedules_place })] })] }) }, item.lecture_schedules_id));
    const renderCard = (kajian) => (_jsx("div", { onClick: () => navigate(`/masjid/${slug}/jadwal-kajian/${kajian.lecture_session_id}`), className: "border rounded-xl overflow-hidden shadow-sm cursor-pointer transition hover:scale-[1.01]", style: {
            borderColor: theme.silver1,
            backgroundColor: theme.white1,
        }, children: _jsxs("div", { className: "flex gap-3", children: [_jsx(ShimmerImage, { src: kajian.lecture_session_image_url || undefined, alt: kajian.lecture_session_title, className: "w-36 h-36 object-cover rounded-l-xl", shimmerClassName: "rounded-l-xl" }), _jsxs("div", { className: "flex-1 text-sm p-2", children: [_jsx("p", { className: "text-xs font-semibold", style: { color: theme.primary }, children: kajian.lecture_title }), _jsx("p", { className: "font-semibold line-clamp-2 pt-2", style: { color: theme.black1 }, children: kajian.lecture_session_title }), _jsx("p", { style: { color: theme.silver2 }, className: "pt-2", children: kajian.lecture_session_teacher_name }), _jsx("p", { className: "text-xs pt-1", style: { color: theme.silver2 }, children: _jsx(FormattedDate, { value: kajian.lecture_session_start_time }) })] })] }) }, kajian.lecture_session_id));
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Jadwal Kajian", backTo: `/masjid/${slug}` }), _jsxs("div", { className: "", children: [_jsx(Tabs, { value: tab, onChange: setTab, tabs: [
                            { label: "Kajian Mendatang", value: "mendatang" },
                            { label: "Kajian Rutin", value: "rutin" },
                        ] }), _jsx(TabsContent, { value: "mendatang", current: tab, children: isLoading ? (_jsx("p", { className: "p-4", children: "Memuat jadwal kajian..." })) : kajianList && kajianList.length > 0 ? (_jsx("div", { className: "space-y-4", children: kajianList.map(renderCard) })) : (_jsx("p", { className: "p-4", children: "Belum ada jadwal kajian." })) }), _jsx(TabsContent, { value: "rutin", current: tab, children: loadingRutin ? (_jsx("p", { className: "p-4", children: "Memuat jadwal rutin..." })) : jadwalRutin && jadwalRutin.length > 0 ? (_jsx("div", { className: "space-y-4", children: jadwalRutin.map(renderCardRutin) })) : (_jsx("p", { className: "p-4", children: "Belum ada jadwal rutin tersedia." })) })] }), _jsx(BottomNavbar, {})] }));
}
