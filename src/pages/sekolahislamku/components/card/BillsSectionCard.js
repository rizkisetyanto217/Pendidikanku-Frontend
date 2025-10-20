import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { ChevronRight, Wallet } from "lucide-react";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
/* ============== Mappings ============== */
const badgeVariants = {
    unpaid: "secondary",
    overdue: "destructive",
    paid: "success",
};
const statusTexts = {
    unpaid: "Belum bayar",
    overdue: "Terlambat",
    paid: "Lunas",
};
const getBadgeVariant = (status) => badgeVariants[status];
const getStatusText = (status) => statusTexts[status];
/* ============== Empty State ============== */
const EmptyState = ({ palette }) => (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Tidak ada tagihan yang belum dibayar. Alhamdulillah!" }));
/* ============== Single Bill Card ============== */
function BillCard({ bill, palette, dateFmt, formatIDR, getPayHref, }) {
    const isPaid = bill.status === "paid";
    return (_jsx("div", { className: "rounded-xl border p-3", style: { borderColor: palette.silver1, background: palette.white2 }, children: _jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: bill.title }), _jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: ["Jatuh tempo: ", dateFmt(bill.dueDate)] })] }), _jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 md:flex-col md:items-center md:gap-1 md:min-w-0 md:flex-1", children: [_jsx("div", { className: "text-sm font-semibold text-center", children: formatIDR(bill.amount) }), _jsx(Badge, { variant: getBadgeVariant(bill.status), palette: palette, className: "w-auto text-center", children: getStatusText(bill.status) })] }), _jsx(Link, { to: getPayHref(bill), state: {
                                bill,
                                parentName: undefined,
                                hijriDate: undefined,
                                gregorianDate: undefined,
                            }, className: "w-full md:w-auto md:flex-shrink-0", "aria-disabled": isPaid, onClick: (e) => {
                                if (isPaid)
                                    e.preventDefault();
                            }, children: _jsx(Btn, { size: "sm", variant: "outline", palette: palette, className: "w-full md:w-auto md:px-6 md:mt-2", disabled: isPaid, children: isPaid ? "Sudah dibayar" : "Detail" }) })] })] }) }));
}
/* ============== Main Section ============== */
export default function BillsSectionCard({ palette, bills = [], dateFmt, formatIDR, basePath = "", seeAllPath, seeAllState, getPayHref, className = "", }) {
    const unpaidBills = bills.filter((bill) => bill.status !== "paid");
    const _seeAllPath = seeAllPath ?? (basePath ? `${basePath}/all-invoices` : `all-invoices`);
    const _getPayHref = getPayHref ??
        ((b) => basePath ? `${basePath}/all-invoices/${b.id}` : `all-invoices/${b.id}`);
    return (_jsxs(SectionCard, { palette: palette, className: `w-full flex flex-col ${className}`, children: [_jsxs("div", { className: "p-3 pb-2 flex items-center justify-between", children: [_jsxs("div", { className: " pb-1 font-medium flex items-center gap-2 md:-mt-1", children: [_jsx("div", { className: "h-9 w-9 rounded-xl flex items-center justify-center ", style: {
                                    background: palette.white3,
                                    color: palette.quaternary,
                                }, children: _jsx(Wallet, { size: 18 }) }), _jsx("h1", { className: "text-base font-semibold", children: "Tagihan dan Pembayaran" })] }), _jsx(Link, { to: _seeAllPath, state: seeAllState ?? { bills, heading: "Semua Tagihan" }, className: "hidden md:block", children: _jsxs(Btn, { size: "sm", variant: "ghost", palette: palette, className: "flex items-center gap-1", children: ["Lihat semua", _jsx(ChevronRight, { size: 16 })] }) })] }), _jsx("div", { className: "px-4 pb-4 pt-2 space-y-3 flex-1 min-w-0", children: unpaidBills.length === 0 ? (_jsx(EmptyState, { palette: palette })) : (unpaidBills.map((bill) => (_jsx(BillCard, { bill: bill, palette: palette, dateFmt: dateFmt, formatIDR: formatIDR, getPayHref: _getPayHref }, bill.id)))) }), _jsx("div", { className: "px-4 pb-4 md:hidden", children: _jsx(Link, { to: _seeAllPath, state: seeAllState ?? { bills, heading: "Semua Tagihan" }, children: _jsxs(Btn, { size: "sm", variant: "ghost", palette: palette, className: "w-full flex items-center justify-center gap-1", children: ["Lihat semua", _jsx(ChevronRight, { size: 16 })] }) }) })] }));
}
