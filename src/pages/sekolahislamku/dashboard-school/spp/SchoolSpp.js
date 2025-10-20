import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/finance/SchoolSpp.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// Theme & utils
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
// UI primitives
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
// Icons
import { Filter as FilterIcon, RefreshCcw, Download, ArrowLeft, } from "lucide-react";
/* ================= Helpers ================= */
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const hijriLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const idr = (n) => n == null
    ? "-"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);
/* ================= Page ================= */
const SchoolSpp = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const gregorianISO = toLocalNoonISO(new Date());
    // Filters
    const today = new Date();
    const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const [month, setMonth] = useState(ym);
    const [kelas, setKelas] = useState("");
    const [status, setStatus] = useState("semua");
    const [q, setQ] = useState("");
    // State modal
    const [detailBill, setDetailBill] = useState(null);
    const [tagihBill, setTagihBill] = useState(null);
    // Dummy data
    const billsQ = useQuery({
        queryKey: ["spp-bills", { month, q, kelas, status }],
        queryFn: async () => {
            const dummy = {
                list: Array.from({ length: 10 }).map((_, i) => ({
                    id: `spp-${i + 1}`,
                    student_id: `S-${1000 + i}`,
                    student_name: `Siswa ${i + 1}`,
                    class_name: ["1A", "1B", "2A", "2B"][i % 4],
                    amount: 150000 + (i % 3) * 50000,
                    due_date: new Date(today.getFullYear(), today.getMonth(), 20).toISOString(),
                    status: ["unpaid", "partial", "paid", "overdue"][i % 4],
                })),
                classes: ["1A", "1B", "2A", "2B", "3A"],
            };
            return dummy;
        },
    });
    const bills = billsQ.data?.list ?? [];
    const classOptions = billsQ.data?.classes ?? [];
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "SPP", gregorianDate: gregorianISO, hijriDate: hijriLong(gregorianISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: "inline-flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-base font-semibold", children: "SPP Murid" })] }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 font-medium flex items-center gap-2", children: [_jsx(FilterIcon, { size: 18 }), " Filter"] }), _jsxs("div", { className: "px-4 md:px-5 pb-4 grid grid-cols-1 md:grid-cols-5 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm mb-1", style: { color: palette.black2 }, children: "Bulan" }), _jsx("input", { type: "month", value: month, onChange: (e) => setMonth(e.target.value), className: "w-full h-11 rounded-lg border px-3 text-sm bg-transparent", style: {
                                                                borderColor: palette.silver1,
                                                                color: palette.black1,
                                                            } })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm mb-1", style: { color: palette.black2 }, children: "Kelas" }), _jsxs("select", { value: kelas, onChange: (e) => setKelas(e.target.value), className: "w-full h-11 rounded-lg border px-3 text-sm bg-transparent", style: {
                                                                borderColor: palette.silver1,
                                                                color: palette.black1,
                                                            }, children: [_jsx("option", { value: "", children: "Semua" }), classOptions.map((c) => (_jsx("option", { value: c, children: c }, c)))] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm mb-1", style: { color: palette.black2 }, children: "Status" }), _jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "w-full h-11 rounded-lg border px-3 text-sm bg-transparent", style: {
                                                                borderColor: palette.silver1,
                                                                color: palette.black1,
                                                            }, children: [_jsx("option", { value: "semua", children: "Semua" }), _jsx("option", { value: "paid", children: "Lunas" }), _jsx("option", { value: "partial", children: "Sebagian" }), _jsx("option", { value: "unpaid", children: "Belum Bayar" }), _jsx("option", { value: "overdue", children: "Terlambat" })] })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("div", { className: "text-sm mb-1", style: { color: palette.black2 }, children: "Cari siswa/ID" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Ketik nama siswa\u2026", className: "w-full h-11 rounded-lg border px-3 text-sm bg-transparent", style: {
                                                                        borderColor: palette.silver1,
                                                                        color: palette.black1,
                                                                    } }), _jsx(Btn, { palette: palette, variant: "outline", size: "sm", onClick: () => billsQ.refetch(), children: _jsx(RefreshCcw, { size: 16 }) })] })] })] })] }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 flex items-center justify-between", children: [_jsx("div", { className: "font-medium", children: "Daftar SPP" }), _jsxs(Btn, { palette: palette, variant: "outline", size: "sm", children: [_jsx(Download, { size: 16 }), " Export"] })] }), _jsx("div", { className: "px-4 md:px-5 pb-4 overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm min-w-[880px]", children: [_jsx("thead", { className: "text-left", style: { color: palette.black2 }, children: _jsxs("tr", { className: "border-b", style: { borderColor: palette.silver1 }, children: [_jsx("th", { className: "py-2 pr-4", children: "Siswa" }), _jsx("th", { className: "py-2 pr-4", children: "Kelas" }), _jsx("th", { className: "py-2 pr-4", children: "Nominal" }), _jsx("th", { className: "py-2 pr-4", children: "Jatuh Tempo" }), _jsx("th", { className: "py-2 pr-4", children: "Status" }), _jsx("th", { className: "py-2 pr-2 text-right", children: "Aksi" })] }) }), _jsx("tbody", { className: "divide-y", style: { borderColor: palette.silver1 }, children: bills.map((r) => (_jsxs("tr", { className: "align-middle", children: [_jsx("td", { className: "py-3 pr-4 font-medium", children: r.student_name }), _jsx("td", { className: "py-3 pr-4", children: r.class_name ?? "-" }), _jsx("td", { className: "py-3 pr-4", children: idr(r.amount) }), _jsx("td", { className: "py-3 pr-4", children: new Date(r.due_date).toLocaleDateString("id-ID") }), _jsxs("td", { className: "py-3 pr-4", children: [r.status === "paid" && (_jsx(Badge, { palette: palette, variant: "success", children: "Lunas" })), r.status === "partial" && (_jsx(Badge, { palette: palette, variant: "info", children: "Sebagian" })), r.status === "unpaid" && (_jsx(Badge, { palette: palette, variant: "outline", children: "Belum Bayar" })), r.status === "overdue" && (_jsx(Badge, { palette: palette, variant: "warning", children: "Terlambat" }))] }), _jsx("td", { className: "py-3 pr-2", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => setDetailBill(r), children: "Detail" }), r.status !== "paid" && (_jsx(Btn, { palette: palette, size: "sm", onClick: () => setTagihBill(r), children: "Tagih" }))] }) })] }, r.id))) })] }) })] })] })] }) }), _jsx(SppDetailModal, { bill: detailBill, onClose: () => setDetailBill(null), palette: palette }), _jsx(SppTagihModal, { bill: tagihBill, onClose: () => setTagihBill(null), palette: palette })] }));
};
export default SchoolSpp;
/* ================= Modals ================= */
function SppDetailModal({ bill, onClose, palette, }) {
    if (!bill)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 grid place-items-center", style: { background: "rgba(0,0,0,0.35)" }, onClick: onClose, children: _jsxs("div", { className: "w-[min(480px,94vw)] rounded-2xl shadow-xl p-5 bg-white", style: { color: palette.black1 }, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Detail Tagihan" }), _jsx("button", { className: "text-sm px-2 py-1 rounded-lg", style: { color: palette.black2 }, onClick: onClose, children: "Tutup" })] }), _jsxs("div", { className: "grid gap-3 text-sm", children: [_jsx(InfoRow, { label: "Nama", value: bill.student_name }), _jsx(InfoRow, { label: "ID", value: bill.student_id }), _jsx(InfoRow, { label: "Kelas", value: bill.class_name ?? "-" }), _jsx(InfoRow, { label: "Nominal", value: idr(bill.amount) }), _jsx(InfoRow, { label: "Jatuh Tempo", value: new Date(bill.due_date).toLocaleDateString("id-ID") }), _jsx(InfoRow, { label: "Status", value: _jsx(Badge, { palette: palette, variant: bill.status === "paid"
                                    ? "success"
                                    : bill.status === "partial"
                                        ? "info"
                                        : bill.status === "unpaid"
                                            ? "outline"
                                            : "warning", children: bill.status === "paid"
                                    ? "Lunas"
                                    : bill.status === "partial"
                                        ? "Sebagian"
                                        : bill.status === "unpaid"
                                            ? "Belum Bayar"
                                            : "Terlambat" }) })] })] }) }));
}
function SppTagihModal({ bill, onClose, palette, }) {
    if (!bill)
        return null;
    const handleSend = () => {
        alert(`Notifikasi tagihan dikirim ke ${bill.student_name}`);
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 grid place-items-center", style: { background: "rgba(0,0,0,0.35)" }, onClick: onClose, children: _jsxs("div", { className: "w-[min(420px,94vw)] rounded-2xl shadow-xl p-5 bg-white", style: { color: palette.black1 }, onClick: (e) => e.stopPropagation(), children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Tagih SPP" }), _jsxs("p", { className: "text-sm mb-4", children: ["Kirim notifikasi penagihan kepada", " ", _jsx("span", { className: "font-medium", children: bill.student_name }), " untuk nominal", " ", _jsx("span", { className: "font-medium", children: idr(bill.amount) }), "?"] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, onClick: handleSend, children: "Kirim Tagihan" })] })] }) }));
}
/* ================= Helpers ================= */
function InfoRow({ label, value }) {
    return (_jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm opacity-70", children: label }), _jsx("span", { className: "font-medium", children: value })] }));
}
