import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Wallet, FileText, CheckCircle2, ArrowLeft } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "../../components/home/ParentTopBar";
import ParentSidebar from "../../components/home/ParentSideBar";
/* =========================
   Date helpers (timezone-safe)
========================= */
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    : "—";
const hijriLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "—";
/* =========================
   Currency
========================= */
const formatIDR = (n) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
}).format(n);
/* =========================
   Fake API (dummy)
========================= */
async function fetchBillDetail(billId) {
    const now = new Date();
    const iso = (d) => d.toISOString();
    const datasets = {
        "paid-example": {
            id: "paid-example",
            title: "SPP Juli 2025",
            invoiceNo: "INV-2025-07-014",
            createdAt: iso(new Date(now.getFullYear(), 6, 1)),
            dueDate: iso(new Date(now.getFullYear(), 6, 10)),
            status: "paid",
            student: { name: "Ahmad", className: "TPA A" },
            items: [
                { id: "i1", name: "SPP Bulanan", amount: 150_000 },
                { id: "i2", name: "Infaq Kegiatan", amount: 10_000 },
            ],
            discount: 0,
            adminFee: 2_500,
            payment: {
                date: iso(new Date(now.getFullYear(), 6, 5, 9, 12)),
                method: "Midtrans (VA BSI)",
                ref: "MID-VA-7F3K2Q",
            },
        },
        "overdue-example": {
            id: "overdue-example",
            title: "SPP Juni 2025",
            invoiceNo: "INV-2025-06-098",
            createdAt: iso(new Date(now.getFullYear(), 5, 1)),
            dueDate: iso(new Date(now.getFullYear(), 5, 10)),
            status: "overdue",
            student: { name: "Ahmad", className: "TPA A" },
            items: [
                { id: "i1", name: "SPP Bulanan", amount: 150_000 },
                { id: "i2", name: "Denda Keterlambatan", amount: 5_000 },
            ],
            discount: 0,
            adminFee: 0,
        },
        default: {
            id: billId || "b1",
            title: "SPP Agustus 2025",
            invoiceNo: "INV-2025-08-001",
            createdAt: iso(new Date(now.getFullYear(), 7, 1)),
            dueDate: iso(new Date(now.getFullYear(), 7, 17)),
            status: "unpaid",
            student: { name: "Ahmad", className: "TPA A" },
            items: [
                { id: "i1", name: "SPP Bulanan", amount: 150_000 },
                { id: "i2", name: "Buku Panduan Iqra", qty: 1, amount: 20_000 },
            ],
            discount: 10_000,
            adminFee: 2_500,
        },
    };
    const data = datasets[billId] ?? datasets.default;
    const subtotal = data.items.reduce((acc, it) => acc + it.amount * (it.qty ?? 1), 0);
    const total = subtotal - (data.discount ?? 0) + (data.adminFee ?? 0);
    return { ...data, total };
}
/* =========================
   Small bits
========================= */
function Row({ left, right, palette, boldRight, className, style, ...rest }) {
    // default teks hitam; masih bisa dioverride
    const mergedStyle = {
        color: palette.black2,
        ...(style || {}),
    };
    return (_jsxs("div", { className: `flex items-center justify-between py-1 text-sm ${className ?? ""}`, style: mergedStyle, ...rest, children: [_jsx("span", { style: { color: palette.black2 }, children: left }), _jsx("span", { style: { fontWeight: boldRight ? 700 : 500 }, children: right })] }));
}
function FinanceHeaderCard({ palette, data, }) {
    return (_jsx(SectionCard, { palette: palette, className: "p-4 md:p-5", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-full flex items-center justify-center", style: { background: palette.primary2 }, children: _jsx(Wallet, { size: 18, color: palette.primary }) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: data?.title ?? "—" }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: data
                                        ? `Invoice ${data.invoiceNo} • Jatuh tempo ${dateLong(data.dueDate)}`
                                        : "—" })] })] }), data && (_jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [data.status !== "paid" ? (_jsx(Link, { to: `/tagihan/${data.id}/bayar`, className: "w-full sm:w-auto", children: _jsx(Btn, { palette: palette, className: "w-full sm:w-auto", children: "Bayar Sekarang" }) })) : (_jsx("div", { className: "flex gap-2", children: _jsxs(Btn, { variant: "success", palette: palette, children: [_jsx(CheckCircle2, { size: 16 }), " Lunas"] }) })), _jsxs(Btn, { variant: "outline", palette: palette, children: [_jsx(FileText, { size: 16 }), " Unduh Invoice"] })] }))] }) }));
}
function ItemsTable({ palette, items, loading, }) {
    return (_jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5 lg:col-span-2", children: [_jsx("div", { className: "font-medium mb-2", children: "Rincian Tagihan" }), _jsxs("div", { className: "rounded-xl border", style: { borderColor: palette.silver1, background: palette.white2 }, children: [_jsxs("div", { className: "grid grid-cols-12 px-3 py-2 text-sm", style: { color: palette.black2 }, children: [_jsx("div", { className: "col-span-7", children: "Item" }), _jsx("div", { className: "col-span-2 text-right", children: "Qty" }), _jsx("div", { className: "col-span-3 text-right", children: "Jumlah" })] }), loading && (_jsx("div", { className: "px-3 py-3 text-sm", style: { color: palette.black2 }, "aria-live": "polite", children: "Memuat..." })), !loading &&
                        (items ?? []).map((it) => (_jsxs("div", { className: "grid grid-cols-12 px-3 py-2 border-t", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "col-span-7", children: it.name }), _jsxs("div", { className: "col-span-2 text-right", children: [it.qty ?? 1, "x"] }), _jsx("div", { className: "col-span-3 text-right", children: formatIDR(it.amount) })] }, it.id))), !loading && (!items || items.length === 0) && (_jsx("div", { className: "px-3 py-3 text-sm", style: { color: palette.black2 }, children: "Tidak ada item." }))] })] }));
}
function SummaryCard({ palette, data, }) {
    const subtotal = useMemo(() => (data?.items ?? []).reduce((a, b) => a + b.amount * (b.qty ?? 1), 0), [data?.items]);
    return (_jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsx("div", { className: "font-medium mb-2", children: "Ringkasan" }), _jsxs("div", { className: "rounded-xl border p-3", style: {
                    borderColor: palette.silver1,
                    background: palette.white2,
                    color: palette.black2,
                }, children: [_jsx(Row, { left: "Siswa", right: `${data?.student.name ?? "—"} • ${data?.student.className ?? "—"}`, palette: palette }), _jsx(Row, { left: "Tanggal dibuat", right: data ? dateLong(data.createdAt) : "—", palette: palette }), _jsx(Row, { left: "Jatuh tempo", right: data ? dateLong(data.dueDate) : "—", palette: palette }), _jsx("div", { className: "my-2 border-t", style: { borderColor: palette.silver1 } }), _jsx(Row, { left: "Subtotal", right: formatIDR(subtotal), palette: palette }), data?.discount ? (_jsx(Row, { left: "Diskon", right: `- ${formatIDR(data.discount)}`, palette: palette })) : null, data?.adminFee ? (_jsx(Row, { left: "Biaya admin", right: formatIDR(data.adminFee), palette: palette })) : null, _jsx("div", { className: "mt-2 border-t", style: { borderColor: palette.silver1 } }), _jsx(Row, { left: _jsx("span", { className: "font-semibold", children: "Total" }), right: formatIDR(data?.total ?? 0), palette: palette, boldRight: true })] }), data?.payment && (_jsxs("div", { className: "mt-3", children: [_jsx("div", { className: "text-sm font-medium mb-1", children: "Pembayaran" }), _jsxs("div", { className: "rounded-xl border p-3 text-sm", style: { borderColor: palette.silver1, background: palette.white2 }, children: [_jsx("div", { style: { color: palette.black2 }, children: "Tanggal" }), _jsx("div", { className: "font-medium", children: dateLong(data.payment.date) }), _jsx("div", { className: "mt-2", style: { color: palette.black2 }, children: "Metode" }), _jsx("div", { className: "font-medium", children: data.payment.method }), _jsx("div", { className: "mt-2", style: { color: palette.black2 }, children: "Ref" }), _jsx("div", { className: "font-medium", children: data.payment.ref })] })] }))] }));
}
/* =========================
   Page
========================= */
export default function StudentFinance() {
    const { billId: billIdParam } = useParams();
    const billId = billIdParam || "default";
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    const { data, isLoading, error } = useQuery({
        queryKey: ["bill-detail", billId],
        queryFn: () => fetchBillDetail(billId),
        staleTime: 60_000,
    });
    const topbarGregorianISO = useMemo(() => toLocalNoonISO(new Date()), []);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, gregorianDate: topbarGregorianISO, hijriDate: hijriLong(topbarGregorianISO), title: "Pembayaran", showBack: isFromMenuUtama }), _jsx("main", { className: "w-full px-4 md:px-6 py-4   md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, onClick: () => navigate(-1), variant: "ghost", className: "cursor-pointer flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Pembayaran" })] }), error ? (_jsx(SectionCard, { palette: palette, className: "p-4", children: _jsx("div", { style: { color: palette.primary }, children: "Gagal memuat data tagihan." }) })) : (_jsxs(_Fragment, { children: [_jsx(FinanceHeaderCard, { palette: palette, data: data }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx(ItemsTable, { palette: palette, items: data?.items, loading: isLoading }), _jsx(SummaryCard, { palette: palette, data: data })] })] }))] })] }) })] }));
}
