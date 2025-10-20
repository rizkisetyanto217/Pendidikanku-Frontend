import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import FormattedDate from "@/constants/formattedDate";
export default function MasjidDetailDonation() {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data: donation, isLoading, isError, } = useQuery({
        queryKey: ["donationDetail", id],
        queryFn: async () => {
            const res = await axios.get(`/public/donations/by-id/${id}`);
            return res.data ?? null;
        },
        enabled: !!id,
    });
    if (isLoading)
        return _jsx("p", { className: "text-center mt-10", children: "Memuat donasi..." });
    if (isError || !donation)
        return (_jsx("p", { className: "text-center mt-10 text-red-500", children: "Donasi tidak ditemukan." }));
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Detail Donasi", onBackClick: () => {
                    if (window.history.length > 1)
                        navigate(-1);
                } }), _jsxs("div", { className: "m-4 p-4 rounded-xl space-y-2", style: {
                    backgroundColor: isDark ? theme.white2 : theme.white1,
                    color: theme.black2,
                    border: `1px solid ${theme.silver1}`,
                }, children: [_jsx("p", { className: "text-sm font-semibold", children: "\uD83D\uDC9D Donatur:" }), _jsx("p", { className: "text-base font-bold", children: donation.donation_name }), _jsx("p", { className: "text-sm mt-2", style: { color: theme.silver4 }, children: donation.donation_message }), _jsx(FormattedDate, { value: donation.created_at, fullMonth: true }), _jsxs("p", { className: "text-sm", style: { color: theme.silver2 }, children: ["Status: ", donation.donation_status] }), _jsxs("p", { className: "text-sm", style: { color: theme.silver2 }, children: ["Jumlah Donasi: Rp", donation.donation_amount.toLocaleString("id-ID")] })] })] }));
}
