import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Wallet, BadgeCheck, Printer, } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
/* ------------ Fallback fetch (sama pola dengan dashboard) ------------ */
async function fetchParentHome() {
    return Promise.resolve({
        parentName: "Bapak/Ibu",
        gregorianDate: new Date().toISOString(),
        hijriDate: "16 Muharram 1447 H",
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
/* ------------ Helpers ------------ */
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
const statusVariant = (s) => s === "paid" ? "success" : s === "overdue" ? "destructive" : "warning";
/* ============== Page ============== */
export default function InvoiceTagihan() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const { data } = useQuery({
        queryKey: ["parent-home-single"],
        queryFn: fetchParentHome,
        staleTime: 60_000,
    });
    // Cari bill: prioritas dari state, kalau tidak ada cari dari fetch
    const billFromState = state?.bill;
    const bill = useMemo(() => {
        if (billFromState)
            return billFromState;
        return data?.bills?.find((b) => b.id === id);
    }, [billFromState, data?.bills, id]);
    // Local paid simulation (tanpa API)
    const [isPaidLocal, setPaidLocal] = useState(false);
    const effectiveStatus = isPaidLocal
        ? "paid"
        : (bill?.status ?? "unpaid");
    const handlePay = () => {
        // Di sini nanti ganti dengan call ke API gateway/payment
        setPaidLocal(true);
        // Bisa juga diarahkan ke page sukses pembayaran
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: state?.parentName ?? "Invoice Tagihan", hijriDate: state?.hijriDate ?? data?.hijriDate, gregorianDate: state?.gregorianDate ?? data?.gregorianDate, showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6  py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", size: "md", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { size: 16, className: "mr-1" }) }), _jsx("h1", { className: "font-semibold text-lg", children: "Invoice Tagihan" })] }), _jsxs(Btn, { palette: palette, variant: "outline", size: "sm", onClick: () => window.print(), children: [_jsx(Printer, { size: 16, className: "mr-1" }), "Cetak / Unduh"] })] }), _jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-4 md:p-6", children: !bill ? (_jsx("div", { className: "text-center py-10 rounded-xl border-2 border-dashed", style: {
                                                borderColor: palette.black2,
                                                color: palette.black2,
                                                background: palette.white1,
                                            }, children: "Tagihan tidak ditemukan." })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3 mb-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("h1", { className: "text-lg md:text-xl font-bold", children: ["Invoice #", bill.id.toUpperCase()] }), _jsxs("div", { className: "text-sm mt-1 flex items-center gap-2 flex-wrap", style: { color: palette.black2 }, children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Wallet, { size: 16 }), bill.title] }), _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(CalendarDays, { size: 16 }), "Jatuh tempo: ", dateLong(bill.dueDate)] })] })] }), _jsx(Badge, { palette: palette, variant: statusVariant(effectiveStatus), children: effectiveStatus === "paid"
                                                                ? "Lunas"
                                                                : effectiveStatus === "overdue"
                                                                    ? "Terlambat"
                                                                    : "Belum Bayar" })] }), _jsx("div", { className: "overflow-x-auto rounded-xl border", style: { borderColor: palette.silver1 }, children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { style: { background: palette.white2 }, children: _jsxs("tr", { children: [_jsx("th", { className: "text-left py-3 px-4", children: "Deskripsi" }), _jsx("th", { className: "text-right py-3 px-4 w-40", children: "Jumlah" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { style: { background: palette.white1 }, children: [_jsx("td", { className: "py-3 px-4", children: bill.title }), _jsx("td", { className: "py-3 px-4 text-right", children: formatIDR(bill.amount) })] }), _jsxs("tr", { children: [_jsx("td", { className: "py-3 px-4 text-right font-semibold", colSpan: 1, style: { background: palette.white2 }, children: "Total" }), _jsx("td", { className: "py-3 px-4 text-right font-semibold", style: { background: palette.white2 }, children: formatIDR(bill.amount) })] })] })] }) }), _jsxs("div", { className: "mt-4 flex  items-center gap-2 justify-end", children: [_jsx(Btn, { palette: palette, onClick: handlePay, disabled: effectiveStatus === "paid", children: effectiveStatus === "paid" ? (_jsxs(_Fragment, { children: [_jsx(BadgeCheck, { size: 16, className: "mr-2" }), "Sudah Dibayar"] })) : ("Bayar Sekarang") }), effectiveStatus !== "paid" &&
                                                            bill.status === "overdue" && (_jsx("span", { className: "text-sm", style: { color: "#EF4444" }, children: "Tagihan melewati jatuh tempo." }))] }), _jsx("p", { className: "mt-4 text-xs", style: { color: palette.black2 }, children: "*Simpan invoice ini untuk arsip Anda. Klik \u201CCetak / Unduh\u201D untuk menyimpan sebagai PDF." })] })) }) })] })] }) })] }));
}
