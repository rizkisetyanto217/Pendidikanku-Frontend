import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/dkm/keuangan/PengeluaranPage.tsx
import { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import { ArrowUpCircle, CalendarDays, Tag, Clock, FileDown, TrendingDown, DollarSign, } from "lucide-react";
// =====================
// Utils
// =====================
const formatCurrency = (n) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
}).format(n);
const formatDate = (iso) => new Date(iso).toLocaleDateString("id-ID", { dateStyle: "medium" });
const formatTime = (iso) => new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});
const exportToCSV = (transactions, slug, month) => {
    const header = [
        "Tanggal",
        "Waktu",
        "Deskripsi",
        "Kategori",
        "Tujuan",
        "Nominal",
    ];
    const rows = transactions.map((t) => [
        formatDate(t.date_iso),
        formatTime(t.date_iso),
        `"${(t.description || "").replace(/"/g, '""')}"`,
        `"${(t.category || "-").replace(/"/g, '""')}"`,
        `"${(t.destination || "-").replace(/"/g, '""')}"`,
        t.amount,
    ]);
    const csvContent = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pengeluaran-${slug}-${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};
// =====================
// Dummy Fallback Data
// =====================
const dummyTransactions = [
    {
        id: "dummy-1",
        date_iso: new Date().toISOString(),
        description: "Pembelian Peralatan Kebersihan",
        category: "Operasional",
        amount: 50000,
        destination: "Toko Alat Bersih",
    },
    {
        id: "dummy-2",
        date_iso: new Date().toISOString(),
        description: "Bayar Listrik",
        category: "Utilitas",
        amount: 200000,
        destination: "PLN",
    },
];
// =====================
// Sub Components
// =====================
const MonthFilter = ({ month, onMonthChange, onExport, theme }) => (_jsxs("div", { className: "mt-4 rounded-xl border p-3 flex flex-wrap gap-3 items-center justify-between", style: { backgroundColor: theme.white1, borderColor: theme.silver1 }, children: [_jsxs("label", { className: "flex items-center gap-2 text-sm whitespace-nowrap", style: { color: theme.black1 }, children: [_jsx(CalendarDays, { size: 18 }), "Pilih Bulan"] }), _jsxs("div", { className: "flex flex-wrap gap-2 w-full sm:w-auto", children: [_jsx("input", { type: "month", value: month, onChange: onMonthChange, className: "rounded-md px-2 py-1 text-sm ring-1 flex-1 min-w-[120px]", style: {
                        backgroundColor: theme.white2,
                        color: theme.black1,
                        borderColor: theme.white3,
                    } }), _jsxs("button", { onClick: onExport, className: "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:opacity-90 transition w-full sm:w-auto justify-center", style: {
                        backgroundColor: theme.white2,
                        color: theme.black1,
                        border: `1px solid ${theme.white3}`,
                    }, children: [_jsx(FileDown, { size: 16 }), " Ekspor CSV"] })] })] }));
const StatsGrid = ({ stats, loading, theme }) => {
    const items = [
        {
            title: "Total Pengeluaran",
            value: stats ? formatCurrency(stats.total_expense) : "-",
            icon: _jsx(DollarSign, { size: 20 }),
        },
        {
            title: "Jumlah Transaksi",
            value: stats?.transaction_count || "-",
            icon: _jsx(TrendingDown, { size: 20 }),
        },
        {
            title: "Rata-rata per Transaksi",
            value: stats ? formatCurrency(stats.avg_per_transaction) : "-",
            icon: _jsx(ArrowUpCircle, { size: 20 }),
        },
        {
            title: "Kategori Terbanyak",
            value: stats?.top_category || "-",
            icon: _jsx(Tag, { size: 20 }),
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4", children: items.map((item, i) => (_jsxs("div", { className: "rounded-xl p-4 ring-1", style: { backgroundColor: theme.white1, borderColor: theme.white3 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-xs font-medium truncate", style: { color: theme.silver2 }, children: item.title }), _jsx("div", { style: { color: theme.error1 }, children: item.icon })] }), _jsx("div", { className: "text-lg font-bold truncate", style: { color: theme.error1 }, children: loading ? "..." : item.value })] }, i))) }));
};
const ExpenseList = ({ transactions, loading, error, theme }) => {
    const grouped = useMemo(() => {
        const map = {};
        transactions.forEach((t) => {
            const date = formatDate(t.date_iso);
            map[date] = [...(map[date] || []), t];
        });
        return Object.entries(map).sort((a, b) => new Date(b[1][0].date_iso).getTime() -
            new Date(a[1][0].date_iso).getTime());
    }, [transactions]);
    if (loading)
        return (_jsx("p", { className: "text-center py-8", style: { color: theme.silver2 }, children: "Memuat data pengeluaran\u2026" }));
    if (error)
        return (_jsx("p", { className: "text-center py-8", style: { color: theme.error1 }, children: "Gagal memuat data pengeluaran." }));
    if (!transactions.length) {
        return (_jsxs("div", { className: "text-center py-8", children: [_jsx(ArrowUpCircle, { size: 48, className: "mx-auto mb-3 opacity-50", style: { color: theme.silver2 } }), _jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Belum ada pengeluaran untuk bulan ini." })] }));
    }
    return (_jsx("div", { className: "space-y-3", children: grouped.map(([dateLabel, items]) => {
            const dailyTotal = items.reduce((sum, t) => sum + t.amount, 0);
            return (_jsxs("div", { className: "rounded-xl border overflow-hidden", style: {
                    backgroundColor: theme.white1,
                    borderColor: theme.silver1,
                }, children: [_jsxs("div", { className: "px-4 py-3 flex flex-wrap items-center justify-between gap-2", style: {
                            backgroundColor: theme.white2,
                            borderBottom: `1px solid ${theme.white3}`,
                        }, children: [_jsx("span", { className: "text-sm font-semibold", style: { color: theme.black2 }, children: dateLabel }), _jsxs("span", { className: "text-sm font-bold", style: { color: theme.error1 }, children: ["-", formatCurrency(dailyTotal)] })] }), _jsx("ul", { className: "divide-y", style: { borderColor: theme.white3 }, children: items.map((t) => (_jsxs("li", { className: "px-4 py-3 flex flex-wrap justify-between gap-2", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-medium mb-1 truncate", style: { color: theme.black1 }, children: t.description }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs", style: { color: theme.silver2 }, children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Tag, { size: 12 }), " ", t.category || "Umum"] }), " ", "\u2022", _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), " ", formatTime(t.date_iso)] }), t.destination && (_jsxs(_Fragment, { children: [" ", "\u2022", " ", _jsx("span", { className: "truncate max-w-[120px]", children: t.destination })] }))] })] }), _jsxs("p", { className: "text-sm font-bold shrink-0", style: { color: theme.error1 }, children: ["-", formatCurrency(t.amount)] })] }, t.id))) })] }, dateLabel));
        }) }));
};
// =====================
// Main Component
// =====================
const PengeluaranPage = () => {
    const { slug = "" } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [searchParams, setSearchParams] = useSearchParams();
    const [month, setMonth] = useState(searchParams.get("month") || new Date().toISOString().slice(0, 7));
    const onMonthChange = (e) => {
        const newMonth = e.target.value;
        setMonth(newMonth);
        setSearchParams((sp) => {
            sp.set("month", newMonth);
            return sp;
        });
    };
    const { data: statsResp, isLoading: loadingStats } = useQuery({
        queryKey: ["expense-stats", slug, month],
        queryFn: async () => (await axios.get(`/public/masjids/${slug}/financials/expense/stats`, {
            params: { month },
        })).data,
        enabled: !!slug && !!month,
        staleTime: 120000,
    });
    const { data: expenseResp, isLoading: loadingExpense, isError: errorExpense, } = useQuery({
        queryKey: ["expense-transactions", slug, month],
        queryFn: async () => (await axios.get(`/public/masjids/${slug}/financials/expense`, {
            params: { month },
        })).data,
        enabled: !!slug && !!month,
        staleTime: 120000,
    });
    const transactions = [...(expenseResp?.data ?? []), ...dummyTransactions];
    return (_jsxs("div", { className: "pb-24 max-w-2xl mx-auto", children: [_jsx(PageHeaderUser, { title: "Data Pengeluaran", onBackClick: () => navigate(-1), withPaddingTop: true }), _jsx(MonthFilter, { month: month, onMonthChange: onMonthChange, onExport: () => exportToCSV(transactions, slug, month), theme: theme }), _jsx(StatsGrid, { stats: statsResp?.data, loading: loadingStats, theme: theme }), _jsxs("section", { className: "mt-6", children: [_jsxs("header", { className: "flex items-center gap-2 mb-4", children: [_jsx(ArrowUpCircle, { size: 20, style: { color: theme.error1 } }), _jsx("h2", { className: "text-lg font-semibold", style: { color: theme.black1 }, children: "Riwayat Pengeluaran" })] }), _jsx(ExpenseList, { transactions: transactions, loading: loadingExpense, error: errorExpense, theme: theme })] }), _jsx(BottomNavbar, {})] }));
};
export default PengeluaranPage;
