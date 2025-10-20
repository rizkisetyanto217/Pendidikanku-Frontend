import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// Constants & utils
import { colors } from "@/constants/colorsThema";
// UI primitives
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
// Icons
import { ArrowLeft, Calendar as CalendarIcon, Receipt, ShieldCheck, } from "lucide-react";
// Layout components
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
/* ===================== Helpers ===================== */
const badgeVariants = {
    unpaid: "secondary",
    overdue: "destructive",
    paid: "success",
};
const statusText = {
    unpaid: "Belum bayar",
    overdue: "Terlambat",
    paid: "Lunas",
};
const formatIDR = (n) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
}).format(n);
const dateFmt = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
});
/** TODO: sambungkan ke API-mu kalau mau fallback fetch by id */
async function fetchBillById(id) {
    console.warn("[Bill] fetchBillById belum diimplementasikan. ID:", id);
    return null;
}
/* ===================== Page ===================== */
export default function Bill({ palette: paletteProp, } = {}) {
    const { id, slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const linkState = (location.state ?? {});
    const palette = paletteProp ?? colors.light;
    const [bill, setBill] = React.useState(linkState.bill);
    const [loading, setLoading] = React.useState(!linkState.bill && !!id);
    const [error, setError] = React.useState(null);
    const payUrl = linkState.payUrl ?? null;
    React.useEffect(() => {
        let mounted = true;
        if (!bill && id) {
            (async () => {
                try {
                    setLoading(true);
                    const res = await fetchBillById(id);
                    if (!mounted)
                        return;
                    if (res)
                        setBill(res);
                    else
                        setError("Data tagihan tidak ditemukan.");
                }
                catch (e) {
                    console.error(e);
                    if (mounted)
                        setError("Gagal memuat data tagihan.");
                }
                finally {
                    if (mounted)
                        setLoading(false);
                }
            })();
        }
        return () => {
            mounted = false;
        };
    }, [bill, id]);
    const isPaid = bill?.status === "paid";
    const backHref = linkState.basePath ?? (slug ? `/${slug}/sekolah/all-invoices` : "..");
    const handleBayar = () => {
        if (isPaid || !bill)
            return;
        if (payUrl) {
            window.location.href = payUrl;
            return;
        }
        alert("Integrasi pembayaran belum dikonfigurasi.");
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { showBack: true, palette: palette, title: "Tagihan & Pembayaran" }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 justify-between", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { variant: "ghost", palette: palette, onClick: () => navigate(-1), className: "inline-flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h2", { className: "text-lg md:text-xl font-semibold", children: "Detail Tagihan" })] }), bill && (_jsx(Badge, { variant: badgeVariants[bill.status], palette: palette, className: "shrink-0", children: statusText[bill.status] }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [_jsxs("div", { className: "lg:col-span-2 space-y-4", children: [_jsxs(SectionCard, { palette: palette, className: "p-5", children: [loading && (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Memuat data tagihan\u2026" })), !loading && error && (_jsx("div", { className: "text-sm", style: { color: palette.error1 }, children: error })), !loading && !error && !bill && (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Data tagihan tidak tersedia." })), bill && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-base md:text-lg font-semibold truncate", children: bill.title }), bill.invoiceNo && (_jsxs("div", { className: "text-xs", style: { color: palette.black2 }, children: ["No. Invoice: ", bill.invoiceNo] }))] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xs", style: { color: palette.black2 }, children: "Total" }), _jsx("div", { className: "text-xl md:text-2xl font-bold", children: formatIDR(bill.amount) })] })] }), _jsxs("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(CalendarIcon, { size: 16 }), _jsxs("span", { children: ["Jatuh tempo: ", dateFmt(bill.dueDate)] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Receipt, { size: 16 }), _jsxs("span", { children: ["Status: ", statusText[bill.status]] })] })] }), bill.description && (_jsx("p", { className: "mt-3 text-sm leading-relaxed", style: { color: palette.black2 }, children: bill.description }))] }))] }), _jsxs(SectionCard, { palette: palette, className: "p-4 flex items-start gap-3", children: [_jsx(ShieldCheck, { size: 18, className: "mt-0.5", color: palette.quaternary }), _jsx("p", { className: "text-sm", style: { color: palette.black2 }, children: "Pembayaran diproses secara aman. Simpan bukti transaksi setelah berhasil." })] })] }), _jsx("div", { className: "space-y-3", children: _jsxs(SectionCard, { palette: palette, className: "p-4 sticky top-20 space-y-4", children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Total Pembayaran" }), _jsx("div", { className: "text-2xl font-bold", children: bill ? formatIDR(bill.amount) : "-" }), _jsx(Btn, { size: "lg", palette: palette, className: "w-full", disabled: isPaid, onClick: handleBayar, children: isPaid ? "Sudah Dibayar" : "Hubungi Sekarang" }), !isPaid && payUrl && (_jsx("a", { href: payUrl, className: "block text-center text-sm underline", style: { color: palette.secondary }, children: "Buka tautan pembayaran" }))] }) })] })] })] }) })] }));
}
