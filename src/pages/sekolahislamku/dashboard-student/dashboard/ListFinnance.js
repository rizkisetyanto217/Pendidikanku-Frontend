import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Receipt, ArrowLeft } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
/* ---------------- Fake fetch (samakan dengan StudentDashboard untuk fallback) ---------------- */
async function fetchParentHome() {
    return Promise.resolve({
        parentName: "Bapak/Ibu",
        hijriDate: "16 Muharram 1447 H",
        gregorianDate: new Date().toISOString(),
        bills: [
            {
                id: "b1",
                title: "SPP Agustus 2025",
                amount: 150000,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
                status: "unpaid",
            },
            {
                id: "b2",
                title: "Seragam Olahraga",
                amount: 80000,
                dueDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
                status: "overdue",
            },
            {
                id: "b3",
                title: "Buku Paket",
                amount: 120000,
                dueDate: new Date().toISOString(),
                status: "paid",
            },
        ],
    });
}
/* ---------------- Helpers ---------------- */
const formatIDR = (n) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
}).format(n);
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })
    : "-";
/* ================= Page ================= */
export default function ListFinance() {
    const { state } = useLocation();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const { data } = useQuery({
        queryKey: ["parent-home-single"], // sama dengan dashboard
        queryFn: fetchParentHome,
        staleTime: 60_000,
    });
    // Prioritaskan bills dari state (klik "Lihat semua"), kalau tidak ada ambil dari fetch.
    const bills = state?.bills ?? data?.bills ?? [];
    // Urutkan: overdue -> unpaid -> paid; lalu dueDate terdekat
    const sorted = useMemo(() => {
        const priority = { overdue: 0, unpaid: 1, paid: 2 };
        return [...bills].sort((a, b) => {
            const p = priority[a.status] - priority[b.status];
            if (p !== 0)
                return p;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    }, [bills]);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: state?.parentName ?? "Daftar Tagihan", hijriDate: state?.hijriDate, gregorianDate: state?.gregorianDate ?? new Date().toISOString(), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Link, { to: "..", relative: "path", children: _jsx(Btn, { palette: palette, variant: "ghost", size: "md", children: _jsx(ArrowLeft, { size: 20, className: "mr-1" }) }) }), _jsx("h1", { className: "font-semibold text-lg", children: "List Tagihan" })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-6", children: [_jsxs("h2", { className: "text-base md:text-lg font-semibold flex items-center gap-2 mb-4", children: [_jsx(Receipt, { size: 18 }), "Semua Tagihan"] }), _jsxs("div", { className: "space-y-3", children: [sorted.map((b) => {
                                                        const isOverdue = b.status === "overdue";
                                                        const isPaid = b.status === "paid";
                                                        return (_jsxs("div", { className: "rounded-xl border p-3 md:p-4 flex items-start justify-between gap-3", style: {
                                                                borderColor: palette.silver1,
                                                                background: palette.white1,
                                                            }, children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-semibold", children: b.title }), _jsxs("div", { className: "text-xs mt-1 flex items-center gap-2 flex-wrap", style: { color: palette.black2 }, children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(CalendarDays, { size: 12 }), "Jatuh tempo: ", dateLong(b.dueDate)] }), _jsx(Badge, { palette: palette, variant: isPaid
                                                                                        ? "success"
                                                                                        : isOverdue
                                                                                            ? "destructive"
                                                                                            : "warning", children: isPaid
                                                                                        ? "Lunas"
                                                                                        : isOverdue
                                                                                            ? "Terlambat"
                                                                                            : "Belum Dibayar" })] })] }), _jsxs("div", { className: "text-right shrink-0", children: [_jsx("div", { className: "font-bold", children: formatIDR(b.amount) }), _jsx("div", { className: "mt-2", children: isPaid ? (_jsx(Btn, { palette: palette, size: "sm", variant: "outline", disabled: true, children: "Lunas" })) : (_jsx(Link, { to: `${b.id}`, children: _jsx(Btn, { palette: palette, size: "sm", children: "Bayar" }) })) })] })] }, b.id));
                                                    }), sorted.length === 0 && (_jsx("div", { className: "text-center py-10 rounded-xl border-2 border-dashed", style: {
                                                            borderColor: palette.silver1,
                                                            color: palette.silver2,
                                                            background: palette.white1,
                                                        }, children: "Tidak ada tagihan." }))] })] }) })] })] }) })] }));
}
