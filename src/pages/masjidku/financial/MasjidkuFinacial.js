import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link, } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import { Wallet, ArrowDownCircle, ArrowUpCircle, FileDown, CalendarDays, Tag, Clock, } from "lucide-react";
/* ============== Utils/format ============= */
const formatUtils = {
    currency: (n) => new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n),
    date: (iso) => new Date(iso).toLocaleDateString("id-ID", { dateStyle: "medium" }),
    time: (iso) => new Date(iso).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }),
};
/* ========= CSV Export (client-side) ======== */
const exportToCSV = (transactions, slug, month) => {
    const header = [
        "Tanggal",
        "Waktu",
        "Deskripsi",
        "Kategori",
        "Tipe",
        "Nominal",
    ];
    const lines = transactions.map((t) => [
        formatUtils.date(t.date_iso),
        formatUtils.time(t.date_iso),
        `"${(t.description || "").replace(/"/g, '""')}"`,
        `"${(t.category || "-").replace(/"/g, '""')}"`,
        t.type,
        t.amount.toString(),
    ]);
    const csv = [header, ...lines].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-keuangan-${slug}-${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};
const MonthFilter = ({ month, onMonthChange, onExport, theme, }) => (_jsxs("div", { className: "mt-2 rounded-xl border p-3 flex items-center justify-between gap-3", style: { backgroundColor: theme.white1, borderColor: theme.silver1 }, children: [_jsxs("label", { className: "flex items-center gap-2 text-sm", style: { color: theme.black1 }, children: [_jsx(CalendarDays, { size: 18 }), _jsx("span", { children: "Pilih Bulan" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "month", value: month, onChange: onMonthChange, className: "rounded-md px-2 py-1 text-sm ring-1", style: {
                        backgroundColor: theme.white2,
                        color: theme.black1,
                        borderColor: theme.white3,
                    } }), _jsxs("button", { onClick: onExport, className: "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:opacity-90 transition", style: {
                        backgroundColor: theme.white2,
                        color: theme.black1,
                        border: `1px solid ${theme.white3}`,
                    }, children: [_jsx(FileDown, { size: 16 }), "Ekspor CSV"] })] })] }));
const SummaryCard = ({ title, value, icon, color, loading, theme, linkTo, }) => (_jsxs("div", { className: "rounded-xl p-3 ring-1", style: {
        backgroundColor: theme.white1,
        borderColor: theme.white3,
        color: theme.black1,
    }, children: [_jsx(Link, { to: linkTo, children: _jsxs("div", { className: "flex items-center justify-between mb-2 cursor-pointer", children: [_jsx("span", { className: "text-xs", style: { color: theme.silver2 }, children: title }), icon] }) }), _jsx("div", { className: "text-sm font-semibold", style: { color: color || theme.black1 }, children: loading
                ? "..."
                : value !== undefined
                    ? formatUtils.currency(value)
                    : "-" })] }));
const SummaryGrid = ({ summary, loading, theme, }) => {
    const summaryItems = [
        {
            title: "Saldo Akhir",
            value: summary?.ending_balance,
            icon: _jsx(Wallet, { size: 18 }),
            linkTo: "/financial/saldo-akhir",
        },
        {
            title: "Pemasukan",
            value: summary?.total_income,
            icon: _jsx(ArrowDownCircle, { size: 18 }),
            color: theme.success1,
            linkTo: "/financial/pemasukan",
        },
        {
            title: "Pengeluaran",
            value: summary?.total_expense,
            icon: _jsx(ArrowUpCircle, { size: 18 }),
            color: theme.error1,
            linkTo: "/financial/pengeluaran",
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-3 gap-3 mt-3", children: summaryItems.map((item, index) => (_jsx(SummaryCard, { title: item.title, value: item.value, icon: item.icon, color: item.color, loading: loading, theme: theme, linkTo: item.linkTo }, index))) }));
};
const TransactionItem = ({ transaction, theme, }) => {
    const isIncome = transaction.type === "income";
    return (_jsx("li", { className: "px-3 py-2", children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm font-medium", style: { color: theme.black1 }, children: transaction.description }), _jsxs("div", { className: "flex items-center gap-2 mt-1 text-xs", style: { color: theme.silver2 }, children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Tag, { size: 12 }), " ", transaction.category || "-"] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), " ", formatUtils.time(transaction.date_iso)] })] })] }), _jsxs("div", { className: "text-sm font-semibold shrink-0 text-right", style: {
                        color: isIncome ? theme.success1 : theme.error1,
                    }, children: [isIncome ? "+" : "-", formatUtils.currency(transaction.amount)] })] }) }));
};
const TransactionGroup = ({ dateLabel, transactions, theme, }) => (_jsxs("div", { className: "rounded-xl border overflow-hidden", style: {
        backgroundColor: theme.white1,
        borderColor: theme.silver1,
    }, children: [_jsx("div", { className: "px-3 py-2 text-xs font-semibold", style: {
                backgroundColor: theme.white2,
                color: theme.black2,
                borderBottom: `1px solid ${theme.white3}`,
            }, children: dateLabel }), _jsx("ul", { className: "divide-y", style: { borderColor: theme.white3 }, children: transactions.map((transaction) => (_jsx(TransactionItem, { transaction: transaction, theme: theme }, transaction.id))) })] }));
const TransactionList = ({ transactions, loading, error, theme, }) => {
    const groupedTransactions = useMemo(() => {
        const map = {};
        transactions.forEach((transaction) => {
            const key = formatUtils.date(transaction.date_iso);
            if (!map[key])
                map[key] = [];
            map[key].push(transaction);
        });
        // Sort by date (newest first)
        return Object.entries(map).sort((a, b) => new Date(b[1][0]?.date_iso || 0).getTime() -
            new Date(a[1][0]?.date_iso || 0).getTime());
    }, [transactions]);
    if (loading) {
        return (_jsx("div", { className: "text-sm", style: { color: theme.silver2 }, children: "Memuat transaksi\u2026" }));
    }
    if (error) {
        return (_jsx("div", { className: "text-sm", style: { color: theme.error1 }, children: "Gagal memuat transaksi." }));
    }
    if (!transactions.length) {
        return (_jsx("div", { className: "text-sm", style: { color: theme.silver2 }, children: "Belum ada transaksi untuk bulan ini." }));
    }
    return (_jsx("div", { className: "space-y-3", children: groupedTransactions.map(([dateLabel, items]) => (_jsx(TransactionGroup, { dateLabel: dateLabel, transactions: items, theme: theme }, dateLabel))) }));
};
/* ================= Main Component ================ */
export default function MasjidkuFinancial() {
    const { slug = "" } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [searchParams, setSearchParams] = useSearchParams();
    const monthParam = searchParams.get("month") || new Date().toISOString().slice(0, 7);
    const [month, setMonth] = useState(monthParam);
    const onMonthChange = (e) => {
        const newMonth = e.target.value;
        setMonth(newMonth);
        setSearchParams((sp) => {
            sp.set("month", newMonth);
            return sp;
        });
    };
    /* ======== API Queries ======== */
    const { data: summaryResp, isLoading: loadingSummary, isError: errorSummary, } = useQuery({
        queryKey: ["financials-summary", slug, month],
        queryFn: async () => (await axios.get(`/public/masjids/${slug}/financials/summary`, {
            params: { month },
        })).data,
        enabled: !!slug && !!month,
        staleTime: 2 * 60 * 1000,
    });
    const { data: txResp, isLoading: loadingTx, isError: errorTx, } = useQuery({
        queryKey: ["financials", slug, month],
        queryFn: async () => (await axios.get(`/public/masjids/${slug}/financials`, {
            params: { month },
        })).data,
        enabled: !!slug && !!month,
        staleTime: 2 * 60 * 1000,
    });
    const summary = summaryResp?.data;
    const transactions = txResp?.data ?? [];
    const handleExport = () => {
        if (!transactions.length)
            return;
        exportToCSV(transactions, slug, month);
    };
    return (_jsxs("div", { className: "pb-24 max-w-2xl mx-auto", children: [_jsx(PageHeaderUser, { title: "Laporan Keuangan", onBackClick: () => navigate(`/`), withPaddingTop: true }), _jsx(MonthFilter, { month: month, onMonthChange: onMonthChange, onExport: handleExport, theme: theme }), _jsx(SummaryGrid, { summary: summary, loading: loadingSummary, theme: theme }), _jsx("div", { className: "mt-4", children: _jsx(TransactionList, { transactions: transactions, loading: loadingTx, error: errorTx, theme: theme }) }), _jsx(BottomNavbar, {})] }));
}
