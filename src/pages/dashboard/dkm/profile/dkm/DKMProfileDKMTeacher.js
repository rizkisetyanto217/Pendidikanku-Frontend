import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useResponsive } from "@/hooks/isResponsive";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
export default function DKMProfileDKMTeacher() {
    const { isMobile } = useResponsive();
    const navigate = useNavigate();
    const [selectedDetail, setSelectedDetail] = useState(null);
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data, isLoading } = useQuery({
        queryKey: ["masjid-profile-teacher-dkm"],
        queryFn: async () => {
            const res = await axios.get("/api/a/masjid-profile-teacher-dkm/by-masjid-id");
            console.log("📦 Data pengajar:", res.data.data);
            return res.data.data;
        },
    });
    const handleSelect = (person) => {
        if (isMobile) {
            navigate("/dkm/pengajar/edit/" + person.masjid_profile_teacher_dkm_id);
        }
        else {
            setSelectedDetail(person);
        }
    };
    const renderPersonCard = (item) => {
        const isActive = selectedDetail?.masjid_profile_teacher_dkm_id ===
            item.masjid_profile_teacher_dkm_id;
        return (_jsxs("button", { onClick: () => handleSelect(item), className: "w-full flex justify-between items-center p-3 rounded border mt-2", style: {
                backgroundColor: isActive ? theme.success2 : theme.white1,
                borderColor: theme.silver1,
                color: theme.black1,
            }, onMouseEnter: (e) => {
                if (!isActive) {
                    e.currentTarget.style.backgroundColor = theme.white2;
                }
            }, onMouseLeave: (e) => {
                if (!isActive) {
                    e.currentTarget.style.backgroundColor = theme.white1;
                }
            }, children: [_jsxs("span", { className: "flex flex-col items-start text-left", children: [_jsx("span", { className: "font-medium", children: item.masjid_profile_teacher_dkm_role }), _jsx("span", { className: "text-sm", style: { color: theme.silver2 }, children: item.masjid_profile_teacher_dkm_name })] }), _jsx("span", { className: "text-lg", children: "\u203A" })] }, item.masjid_profile_teacher_dkm_id));
    };
    const pengurus = data?.filter((p) => ["ketua", "sekretaris", "bendahara", "dkm"].includes(p.masjid_profile_teacher_dkm_role.toLowerCase()));
    const pengajar = data?.filter((p) => ["teacher", "pengajar", "ustadz"].includes(p.masjid_profile_teacher_dkm_role.toLowerCase()));
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Profil DKM & Pengajar", onBackClick: () => {
                    if (window.history.length > 1)
                        navigate(-1);
                } }), _jsxs("div", { className: "md:flex md:gap-6", children: [_jsxs("div", { className: "md:w-1/2 space-y-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-semibold text-lg", style: { color: theme.primary }, children: "DKM Masjid" }), pengurus?.map(renderPersonCard)] }), _jsxs("div", { className: "pt-4", children: [_jsx("h3", { className: "text-md font-semibold", style: { color: theme.primary }, children: "Pengajar" }), pengajar?.map(renderPersonCard)] })] }), !isMobile && (_jsx("div", { className: "md:w-1/2 rounded shadow p-4 space-y-3 mt-6 md:mt-0", style: { backgroundColor: theme.white1 }, children: selectedDetail ? (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-lg font-semibold", style: { color: theme.quaternary }, children: selectedDetail.masjid_profile_teacher_dkm_name }), _jsxs("div", { className: "space-y-2 text-sm", style: { color: theme.black2 }, children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Jabatan / Peran" }), _jsx("p", { children: selectedDetail.masjid_profile_teacher_dkm_role })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Sambutan" }), _jsx("p", { children: selectedDetail.masjid_profile_teacher_dkm_message })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Deskripsi" }), _jsx("p", { children: selectedDetail.masjid_profile_teacher_dkm_description })] })] })] })) : (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Klik salah satu untuk melihat detail." })) }))] })] }));
}
