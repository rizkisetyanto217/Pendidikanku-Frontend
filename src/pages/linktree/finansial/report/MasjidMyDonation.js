import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { useParams } from "react-router-dom";
import FormattedDate from "@/constants/formattedDate";
export default function MasjidMyDonation() {
    const { slug } = useParams();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data, isLoading } = useQuery({
        queryKey: ["my-donations", slug],
        queryFn: async () => {
            const res = await api.get(`/public/donations/by-user/${slug}`);
            console.log("📦 Data donasi by slug:", res.data);
            return res.data;
        },
        enabled: !!slug,
    });
    const format = (n) => `Rp ${new Intl.NumberFormat("id-ID").format(n || 0)}`;
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Donasi Saya", onBackClick: () => history.back() }), _jsx("div", { className: "p-4 space-y-4", children: isLoading ? (_jsx("p", { style: { color: theme.silver2 }, children: "Memuat donasi..." })) : !data?.length ? (_jsx("p", { style: { color: theme.silver2 }, children: "Belum ada donasi." })) : (data.map((item) => (_jsxs("div", { className: "p-4 rounded border space-y-2", style: { borderColor: theme.silver1 }, children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-sm font-semibold", style: { color: theme.primary }, children: item.donation_name || "Anonim" }), _jsx(FormattedDate, { value: item.created_at, className: "text-xs" })] }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "\uD83D\uDCB0 Total Donasi" }), _jsx("span", { children: format(item.donation_amount) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Untuk Masjid" }), _jsx("span", { children: format(item.donation_amount_masjid) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Dukungan Aplikasi" }), _jsx("span", { children: format(item.donation_amount_masjidku) })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "pl-2 text-gray-500", children: "\u21B3 ke Masjid" }), _jsx("span", { children: format(item.donation_amount_masjidku_to_masjid) })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "pl-2 text-gray-500", children: "\u21B3 ke Masjidku" }), _jsx("span", { children: format(item.donation_amount_masjidku_to_app) })] })] }), item.donation_message && (_jsxs("p", { className: "text-sm italic mt-2", style: { color: theme.black2 }, children: ["\u201C", item.donation_message, "\u201D"] })), _jsxs("div", { className: "text-xs flex justify-between items-center pt-2 border-t", style: { borderColor: theme.silver1 }, children: [_jsxs("span", { style: { color: theme.silver2 }, children: ["Status: ", item.donation_status] }), _jsxs("span", { style: { color: theme.primary }, children: ["\u2764\uFE0F ", item.like_count || 0, " ", item.is_liked_by_user && "(Anda menyukai)"] })] })] }, item.donation_id)))) })] }));
}
