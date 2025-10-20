import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { Tabs, TabsContent } from "@/components/common/main/Tabs";
import api from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import FormattedDate from "@/constants/formattedDate";
const FinancialReportPage = () => {
    const [tab, setTab] = useState("recent");
    const { slug } = useParams();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    // 1. Get Masjid Data
    const { data: masjidRes, isLoading: isMasjidLoading } = useQuery({
        queryKey: ["masjid-detail", slug],
        queryFn: async () => {
            const res = await api.get(`/public/masjids/${slug}`);
            console.log("🏷️ Detail masjid berhasil:", res.data);
            return res.data;
        },
        enabled: !!slug,
    });
    const masjidId = masjidRes?.data?.masjid_id;
    const masjidName = masjidRes?.data?.masjid_name;
    console.log("🆔 masjidId:", masjidId);
    console.log("🏛️ masjidName:", masjidName);
    // 2. Get Donations
    const { data: donations, isLoading: isDonasiLoading } = useQuery({
        queryKey: ["masjid-donations", masjidId],
        queryFn: async () => {
            const res = await api.get(`/public/donations/by-masjid/${slug}`);
            console.log("📦 Data donasi:", res.data);
            return res.data;
        },
        enabled: !!masjidId,
        staleTime: 1000 * 60 * 3,
    });
    const stats = useMemo(() => {
        const total = donations?.reduce((acc, curr) => {
            return acc + (curr.donation_amount_masjid || 0);
        }, 0);
        const count = donations?.length || 0;
        return { total, count };
    }, [donations]);
    const renderDonationList = () => {
        if (isDonasiLoading)
            return (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Memuat donasi..." }));
        if (!donations?.length)
            return (_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Belum ada donasi" }));
        return donations.map((item) => (_jsxs("div", { className: "flex justify-between px-4 py-2 rounded", style: { border: `1px solid ${theme.silver1}` }, children: [_jsx("p", { className: "text-sm capitalize", style: { color: theme.black1 }, children: item.donation_name || "Anonim" }), _jsxs("div", { className: "text-right text-sm", children: [_jsxs("p", { style: { color: theme.black1 }, children: ["Rp. ", (item.donation_amount_masjid || 0).toLocaleString("id-ID")] }), _jsx(FormattedDate, { value: item.created_at, className: "text-xs" })] })] }, item.donation_id)));
    };
    const renderMotivationMessages = () => {
        const messages = donations?.filter((d) => d.donation_message);
        if (!messages?.length)
            return null;
        return (_jsxs("div", { className: "space-y-2 mt-4", children: [_jsx("h3", { className: "text-sm font-semibold", style: { color: theme.primary }, children: "Motivasi & Doa" }), messages.map((d) => (_jsxs("div", { className: "rounded p-3 space-y-2", style: { border: `1px solid ${theme.silver1}` }, children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-sm font-medium", style: { color: theme.black1 }, children: d.donation_name || "Anonim" }), _jsx("button", { className: "text-xs", style: { color: theme.primary }, children: "Bagikan" })] }), _jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: d.donation_message })] }, d.donation_id)))] }));
    };
    if (isMasjidLoading) {
        return (_jsx("p", { className: "p-4 text-sm", style: { color: theme.silver2 }, children: "Memuat data masjid..." }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Laporan Keuangan", onBackClick: () => history.back() }), _jsx(Tabs, { value: tab, onChange: setTab, tabs: [
                    { label: "Terbaru", value: "recent" },
                    { label: "Informasi", value: "info" },
                ] }), _jsx(TabsContent, { value: "recent", current: tab, children: _jsxs("div", { className: "mt-4 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 rounded", style: { border: `1px solid ${theme.silver1}` }, children: [_jsxs("div", { children: [_jsxs("p", { className: "text-sm", style: { color: theme.black1 }, children: ["Rp. ", stats.total?.toLocaleString("id-ID") || 0] }), _jsxs("p", { className: "text-xs", style: { color: theme.silver2 }, children: [stats.count, " Donatur"] })] }), _jsx("div", { className: "text-2xl", children: "\uD83D\uDCCA" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold", style: { color: theme.black1 }, children: "Donasi" }), renderDonationList()] }), renderMotivationMessages()] }) }), _jsx(TabsContent, { value: "info", current: tab, children: _jsx("p", { className: "text-sm p-4", style: { color: theme.silver2 }, children: "[Coming soon]" }) })] }));
};
export default FinancialReportPage;
