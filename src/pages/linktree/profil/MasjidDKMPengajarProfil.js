import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// MasjidDKMPengajarProfil.tsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResponsive } from "@/hooks/isResponsive";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
export default function MasjidDKMPengajarProfil() {
    const { slug } = useParams();
    const { isMobile } = useResponsive();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["masjid-profile-teacher-dkm", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/masjid-profile-teacher-dkm/by-masjid-slug/${slug}`);
            return (res.data.data || []);
        },
        enabled: !!slug,
    });
    const dkmList = useMemo(() => (data || []).filter((x) => (x.masjid_profile_teacher_dkm_role || "").toUpperCase() === "DKM"), [data]);
    const pengajarList = useMemo(() => (data || []).filter((x) => (x.masjid_profile_teacher_dkm_role || "").toUpperCase() !== "DKM"), [data]);
    // di MasjidDKMPengajarProfil.tsx
    const handleSelect = (person) => {
        if (isMobile) {
            navigate(`detail/${person.masjid_profile_teacher_dkm_id}`, {
                state: { item: person, slug },
            });
        }
        else {
            setSelectedDetail(person);
        }
    };
    const renderPersonCard = (item, label) => {
        const isActive = selectedDetail?.masjid_profile_teacher_dkm_id ===
            item.masjid_profile_teacher_dkm_id;
        return (_jsxs("button", { onClick: () => handleSelect(item), className: "w-full flex justify-between items-center p-3 rounded border mt-2 transition-colors", style: {
                backgroundColor: isActive ? theme.success2 : theme.white1,
                borderColor: theme.silver1,
                color: theme.black1,
            }, onMouseEnter: (e) => {
                if (!isActive)
                    e.currentTarget.style.backgroundColor = theme.white2;
            }, onMouseLeave: (e) => {
                if (!isActive)
                    e.currentTarget.style.backgroundColor = theme.white1;
            }, children: [_jsxs("span", { className: "flex flex-col items-start text-left", children: [_jsx("span", { className: "font-medium", children: label || item.masjid_profile_teacher_dkm_role || "—" }), _jsx("span", { className: "text-sm", style: { color: theme.silver2 }, children: item.masjid_profile_teacher_dkm_name })] }), _jsx("span", { className: "text-lg", children: "\u203A" })] }, item.masjid_profile_teacher_dkm_id));
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Profil DKM & Pengajar", onBackClick: () => {
                    if (window.history.length > 1)
                        navigate(-1);
                } }), _jsxs("div", { className: "md:flex md:gap-6", children: [_jsx("div", { className: "md:w-1/2 space-y-4", children: isLoading ? (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Memuat data\u2026" })) : isError ? (_jsx("p", { className: "text-sm text-red-500", children: "Gagal memuat data." })) : (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("h2", { className: "font-semibold text-lg", style: { color: theme.black1 }, children: "DKM Masjid" }), dkmList.length > 0 ? (dkmList.map((item) => renderPersonCard(item, item.masjid_profile_teacher_dkm_role))) : (_jsx("p", { className: "text-sm mt-2", style: { color: theme.silver2 }, children: "Belum ada data DKM." }))] }), _jsxs("div", { className: "pt-4", children: [_jsx("h3", { className: "text-md font-semibold", style: { color: theme.black1 }, children: "Pengajar" }), pengajarList.length > 0 ? (pengajarList.map((item) => renderPersonCard(item))) : (_jsx("p", { className: "text-sm mt-2", style: { color: theme.silver2 }, children: "Belum ada data pengajar." }))] })] })) }), !isMobile && (_jsx("div", { className: "md:w-1/2 rounded shadow p-4 space-y-3 mt-6 md:mt-0", style: { backgroundColor: theme.white1 }, children: selectedDetail ? (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-lg font-semibold", style: { color: theme.quaternary }, children: selectedDetail.masjid_profile_teacher_dkm_name }), _jsxs("div", { className: "space-y-2 text-sm", style: { color: theme.black2 }, children: [selectedDetail.masjid_profile_teacher_dkm_role && (_jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Peran" }), _jsx("p", { children: selectedDetail.masjid_profile_teacher_dkm_role })] })), selectedDetail.masjid_profile_teacher_dkm_description && (_jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Deskripsi" }), _jsx("p", { children: selectedDetail.masjid_profile_teacher_dkm_description })] })), selectedDetail.masjid_profile_teacher_dkm_message && (_jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Sambutan" }), _jsx("p", { children: selectedDetail.masjid_profile_teacher_dkm_message })] }))] })] })) : (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Klik salah satu untuk melihat detail." })) }))] })] }));
}
