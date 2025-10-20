import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// Theme & utils
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
// UI primitives & layout
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
// Icons
import { Wallet, Calendar, CheckCircle2, ArrowLeft, Search, Plus, Download, } from "lucide-react";
// Modals
import Export from "./modal/Export";
import Pembayaran from "./modal/Payment";
import CreateInvoiceModal from "./modal/SchoolBill";
/* ================== Date helpers ================== */
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const normalizeISOToLocalNoon = (iso) => iso ? toLocalNoonISO(new Date(iso)) : undefined;
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
const dateFmt = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
/* ================= Dummy Data ================= */
const dummySummary = {
    billed: 15750000,
    collected: 10800000,
    outstanding: 4950000,
    alerts: 2,
};
const dummyInvoices = [
    {
        id: "inv001",
        title: "SPP September 2025",
        student_id: "stu001",
        student_name: "Ahmad Fauzi",
        class_name: "1A",
        due_date: "2025-09-15T12:00:00.000Z",
        amount: 500000,
        status: "paid",
        type: "SPP",
    },
    {
        id: "inv002",
        title: "Uang Seragam",
        student_id: "stu002",
        student_name: "Siti Nurhaliza",
        class_name: "1B",
        due_date: "2025-09-20T12:00:00.000Z",
        amount: 350000,
        status: "unpaid",
        type: "Seragam",
    },
    {
        id: "inv003",
        title: "Buku Semester 1",
        student_id: "stu003",
        student_name: "Budi Santoso",
        class_name: "2A",
        due_date: "2025-09-10T12:00:00.000Z",
        amount: 400000,
        paid_amount: 200000,
        status: "partial",
        type: "Buku",
    },
    {
        id: "inv004",
        title: "SPP Agustus 2025",
        student_id: "stu004",
        student_name: "Dewi Lestari",
        class_name: "3C",
        due_date: "2025-08-30T12:00:00.000Z",
        amount: 500000,
        status: "overdue",
        type: "SPP",
    },
    {
        id: "inv005",
        title: "Uang Kegiatan",
        student_id: "stu005",
        student_name: "Andi Pratama",
        class_name: "2B",
        due_date: "2025-09-25T12:00:00.000Z",
        amount: 200000,
        status: "paid",
        type: "Kegiatan",
    },
    {
        id: "inv006",
        title: "Praktikum Lab",
        student_id: "stu006",
        student_name: "Fatimah Zahra",
        class_name: "3A",
        due_date: "2025-09-22T12:00:00.000Z",
        amount: 150000,
        status: "unpaid",
        type: "Praktikum",
    },
];
const dummyPayments = [
    {
        id: "pay001",
        date: "2025-09-14T12:00:00.000Z",
        payer_name: "Ahmad Fauzi",
        invoice_title: "SPP September 2025",
        amount: 500000,
        method: "Transfer Bank",
    },
    {
        id: "pay002",
        date: "2025-09-12T12:00:00.000Z",
        payer_name: "Budi Santoso",
        invoice_title: "Buku Semester 1",
        amount: 200000,
        method: "Tunai",
    },
    {
        id: "pay003",
        date: "2025-09-16T12:00:00.000Z",
        payer_name: "Andi Pratama",
        invoice_title: "Uang Kegiatan",
        amount: 200000,
        method: "E-Wallet",
    },
    {
        id: "pay004",
        date: "2025-09-11T12:00:00.000Z",
        payer_name: "Siti Aminah",
        invoice_title: "SPP Agustus 2025",
        amount: 500000,
        method: "Transfer Bank",
    },
];
/* ================= Status Badge Component ================= */
const StatusBadge = ({ status, palette, }) => {
    const statusConfig = {
        paid: { variant: "success", icon: "✓", label: "Lunas" },
        partial: { variant: "info", icon: "◐", label: "Sebagian" },
        unpaid: { variant: "outline", icon: "○", label: "Belum Bayar" },
        overdue: { variant: "warning", icon: "⚠", label: "Terlambat" },
    };
    const config = statusConfig[status];
    return (_jsx(Badge, { palette: palette, variant: config.variant, children: _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { children: config.icon }), _jsx("span", { children: config.label })] }) }));
};
/* ================= Loading Component ================= */
const LoadingSpinner = ({ text = "Memuat...", palette, }) => (_jsx("div", { className: "py-12 text-center", children: _jsxs("div", { className: "inline-flex items-center gap-2", style: { color: palette.black2 }, children: [_jsx("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }), text] }) }));
/* ================= Empty State Component ================= */
const EmptyState = ({ icon, title, description, palette }) => (_jsxs("div", { className: "py-12 text-center", children: [_jsx("div", { className: "text-4xl mb-3", children: icon }), _jsx("div", { className: "font-medium mb-1", children: title }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: description })] }));
/* ================= KPI Tile Component ================= */
const KpiTile = ({ palette, label, value, icon }) => (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-3 sm:p-4 md:p-5 flex items-center gap-3", children: [_jsx("span", { className: "h-8 w-8 sm:h-10 sm:w-10 grid place-items-center rounded-xl flex-shrink-0", style: { background: palette.primary2, color: palette.primary }, children: icon ?? _jsx(Wallet, { size: 16, className: "sm:w-[18px] sm:h-[18px]" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "text-sm sm:text-sm truncate", style: { color: palette.black2 }, children: label }), _jsx("div", { className: "text-lg sm:text-xl font-semibold truncate", children: value })] })] }) }));
/* ================= Invoice Table Component ================= */
const InvoiceTable = ({ palette, invoices, query, onDetail, markPaid }) => (_jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "px-4 py-4 border-b", style: { borderColor: palette.silver1 }, children: [_jsx("h3", { className: "font-semibold text-lg", children: "Daftar Tagihan" }), _jsxs("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: [invoices.length, " tagihan ditemukan"] })] }), _jsx("div", { className: "block md:hidden", children: query.isLoading ? (_jsx(LoadingSpinner, { text: "Memuat data tagihan...", palette: palette })) : invoices.length === 0 ? (_jsx(EmptyState, { icon: "\uD83D\uDCCB", title: "Tidak ada tagihan", description: "Belum ada data tagihan untuk periode ini", palette: palette })) : (_jsx("div", { className: "divide-y", style: { borderColor: palette.silver1 }, children: invoices.map((inv) => {
                    const due = normalizeISOToLocalNoon(inv.due_date);
                    const isOverdue = inv.status === "overdue";
                    return (_jsxs("div", { className: `p-4 hover:bg-opacity-50 transition-colors ${isOverdue ? "bg-red-50" : ""}`, style: {
                            backgroundColor: isOverdue
                                ? `${palette.warning1}10`
                                : undefined,
                        }, children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-semibold text-base mb-1 truncate", children: inv.title }), inv.type && (_jsx("span", { className: "inline-block px-2 py-1 text-sm rounded-md", style: {
                                                    backgroundColor: palette.primary2,
                                                    color: palette.primary,
                                                }, children: inv.type }))] }), _jsx("div", { className: "ml-3 flex-shrink-0", children: _jsx(StatusBadge, { status: inv.status, palette: palette }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4", children: [_jsxs("div", { children: [_jsx("span", { style: { color: palette.black2 }, children: "Siswa:" }), _jsx("div", { className: "font-medium truncate", children: inv.student_name ?? "-" })] }), _jsxs("div", { children: [_jsx("span", { style: { color: palette.black2 }, children: "Kelas:" }), _jsx("div", { className: "font-medium", children: inv.class_name ?? "-" })] }), _jsxs("div", { children: [_jsx("span", { style: { color: palette.black2 }, children: "Jatuh Tempo:" }), _jsx("div", { className: `font-medium ${isOverdue ? "text-red-600" : ""}`, children: dateFmt(due) })] }), _jsxs("div", { children: [_jsx("span", { style: { color: palette.black2 }, children: "Nominal:" }), _jsx("div", { className: "font-semibold text-lg", children: idr(inv.amount) }), inv.paid_amount && (_jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: ["Dibayar: ", idr(inv.paid_amount)] }))] })] }), _jsxs("div", { className: "flex gap-2 pt-3 border-t", style: { borderColor: palette.silver1 }, children: [_jsx("button", { onClick: () => onDetail(inv), className: "text-sm underline hover:no-underline transition-all", style: { color: palette.primary }, children: "Lihat Detail" }), inv.status !== "paid" && (_jsx(Btn, { size: "sm", palette: palette, onClick: () => markPaid.mutate({ id: inv.id }), disabled: markPaid.isPending, className: "ml-auto text-sm px-3 py-1", children: markPaid.isPending ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" }), "Proses..."] })) : ("Tandai Lunas") }))] })] }, inv.id));
                }) })) }), _jsx("div", { className: "hidden md:block overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { style: { backgroundColor: palette.white2 }, children: [
                                "Tagihan",
                                "Siswa",
                                "Kelas",
                                "Jatuh Tempo",
                                "Nominal",
                                "Status",
                                "Aksi",
                            ].map((header) => (_jsx("th", { className: `py-4 px-4 font-semibold border-b ${header === "Aksi" ? "text-center" : "text-left"}`, style: { borderColor: palette.silver1, color: palette.black2 }, children: header }, header))) }) }), _jsxs("tbody", { className: "divide-y", style: { borderColor: palette.silver1 }, children: [query.isLoading && (_jsx("tr", { children: _jsx("td", { colSpan: 7, children: _jsx(LoadingSpinner, { text: "Memuat data tagihan...", palette: palette }) }) })), !query.isLoading && invoices.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 7, children: _jsx(EmptyState, { icon: "\uD83D\uDCCB", title: "Tidak ada tagihan", description: "Belum ada data tagihan untuk periode ini", palette: palette }) }) })), invoices.map((inv) => {
                                const due = normalizeISOToLocalNoon(inv.due_date);
                                const isOverdue = inv.status === "overdue";
                                return (_jsxs("tr", { className: `hover:bg-gray-50 transition-colors ${isOverdue ? "bg-red-50" : ""}`, style: {
                                        backgroundColor: isOverdue
                                            ? `${palette.warning1}08`
                                            : undefined,
                                    }, children: [_jsxs("td", { className: "py-4 px-4", children: [_jsx("div", { className: "font-semibold text-base mb-1", children: inv.title }), inv.type && (_jsx("span", { className: "inline-block px-2 py-1 text-sm rounded-md", style: {
                                                        backgroundColor: palette.primary2,
                                                        color: palette.primary,
                                                    }, children: inv.type }))] }), _jsx("td", { className: "py-4 px-4 font-medium", children: inv.student_name ?? "-" }), _jsx("td", { className: "py-4 px-4 font-medium", children: inv.class_name ?? "-" }), _jsx("td", { className: "py-4 px-4", children: _jsx("div", { className: `font-medium ${isOverdue ? "text-red-600" : ""}`, children: dateFmt(due) }) }), _jsxs("td", { className: "py-4 px-4", children: [_jsx("div", { className: "font-semibold text-base", children: idr(inv.amount) }), inv.paid_amount && (_jsxs("div", { className: "text-sm mt-1", style: { color: palette.black2 }, children: ["Dibayar: ", idr(inv.paid_amount)] }))] }), _jsx("td", { className: "py-4 px-4", children: _jsx(StatusBadge, { status: inv.status, palette: palette }) }), _jsx("td", { className: "py-4 px-4", children: _jsxs("div", { className: "flex gap-2 justify-center items-center", children: [_jsx("button", { onClick: () => onDetail(inv), className: "text-sm underline hover:no-underline transition-all px-2 py-1", style: { color: palette.primary }, children: "Detail" }), inv.status !== "paid" && (_jsx(Btn, { size: "sm", palette: palette, onClick: () => markPaid.mutate({ id: inv.id }), disabled: markPaid.isPending, className: "text-sm px-3 py-1", children: markPaid.isPending ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" }), "Proses..."] })) : ("Tandai Lunas") }))] }) })] }, inv.id));
                            })] })] }) })] }));
/* ================= Payment Table Component ================= */
const PaymentTable = ({ palette, payments, query }) => {
    const getPaymentMethodIcon = (method) => {
        const iconMap = {
            "Transfer Bank": "🏦",
            Tunai: "💵",
            "E-Wallet": "📱",
        };
        return iconMap[method || ""] || "💳";
    };
    return (_jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "px-4 py-4 border-b", style: { borderColor: palette.silver1 }, children: [_jsx("h3", { className: "font-semibold text-lg", children: "Daftar Pembayaran" }), _jsxs("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: [payments.length, " pembayaran ditemukan"] })] }), _jsx("div", { className: "block md:hidden", children: query.isLoading ? (_jsx(LoadingSpinner, { text: "Memuat data pembayaran...", palette: palette })) : payments.length === 0 ? (_jsx(EmptyState, { icon: "\uD83D\uDCB8", title: "Tidak ada pembayaran", description: "Belum ada data pembayaran untuk periode ini", palette: palette })) : (_jsx("div", { className: "divide-y", style: { borderColor: palette.silver1 }, children: payments.map((p) => {
                        const dt = normalizeISOToLocalNoon(p.date);
                        return (_jsxs("div", { className: "p-4 hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-base mb-1", children: dateFmt(dt) }), _jsx("div", { className: "text-2xl font-bold", style: { color: palette.primary }, children: idr(p.amount) })] }), _jsx("div", { className: "ml-3", children: _jsxs("span", { className: "inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg font-medium", style: {
                                                    backgroundColor: palette.primary2,
                                                    color: palette.primary,
                                                }, children: [_jsx("span", { children: getPaymentMethodIcon(p.method) }), _jsx("span", { children: p.method ?? "Tidak diketahui" })] }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", style: { color: palette.black2 }, children: "Pembayar:" }), _jsx("span", { className: "font-semibold text-base", children: p.payer_name ?? "-" })] }), _jsxs("div", { className: "flex justify-between items-start", children: [_jsx("span", { className: "text-sm flex-shrink-0", style: { color: palette.black2 }, children: "Untuk Tagihan:" }), _jsx("span", { className: "text-right text-sm font-medium ml-3", children: p.invoice_title ?? "-" })] })] })] }, p.id));
                    }) })) }), _jsx("div", { className: "hidden md:block overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { style: { backgroundColor: palette.white2 }, children: [
                                    "Tanggal",
                                    "Pembayar",
                                    "Untuk Tagihan",
                                    "Metode Bayar",
                                    "Jumlah",
                                ].map((header, index) => (_jsx("th", { className: `py-4 px-4 font-semibold border-b ${index === 3
                                        ? "text-center"
                                        : index === 4
                                            ? "text-right"
                                            : "text-left"}`, style: {
                                        borderColor: palette.silver1,
                                        color: palette.black2,
                                    }, children: header }, header))) }) }), _jsxs("tbody", { className: "divide-y", style: { borderColor: palette.silver1 }, children: [query.isLoading && (_jsx("tr", { children: _jsx("td", { colSpan: 5, children: _jsx(LoadingSpinner, { text: "Memuat data pembayaran...", palette: palette }) }) })), !query.isLoading && payments.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, children: _jsx(EmptyState, { icon: "\uD83D\uDCB8", title: "Tidak ada pembayaran", description: "Belum ada data pembayaran untuk periode ini", palette: palette }) }) })), payments.map((p) => {
                                    const dt = normalizeISOToLocalNoon(p.date);
                                    return (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "py-4 px-4 font-medium", children: dateFmt(dt) }), _jsx("td", { className: "py-4 px-4 font-semibold text-base", children: p.payer_name ?? "-" }), _jsx("td", { className: "py-4 px-4", children: _jsx("div", { className: "max-w-sm truncate", title: p.invoice_title ?? "-", children: p.invoice_title ?? "-" }) }), _jsx("td", { className: "py-4 px-4 text-center", children: _jsxs("span", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium", style: {
                                                        backgroundColor: palette.primary2,
                                                        color: palette.primary,
                                                    }, children: [_jsx("span", { children: getPaymentMethodIcon(p.method) }), _jsx("span", { children: p.method ?? "Tidak diketahui" })] }) }), _jsx("td", { className: "py-4 px-4 text-right", children: _jsx("div", { className: "font-bold text-lg", style: { color: palette.primary }, children: idr(p.amount) }) })] }, p.id));
                                })] })] }) })] }));
};
/* ================= Main Component ================= */
const SchoolFinance = ({ showBack = false, backTo, backLabel = "Kembali", }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const qc = useQueryClient();
    const gregorianISO = toLocalNoonISO(new Date());
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    // ===== MODALS =====
    const [openExport, setOpenExport] = useState(false);
    const [openPay, setOpenPay] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    // ===== Filters & Tabs =====
    const today = new Date();
    const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const [month, setMonth] = useState(ym);
    const [kelas, setKelas] = useState(undefined);
    const [status, setStatus] = useState("semua");
    const [q, setQ] = useState("");
    const [tab, setTab] = useState("invoices");
    const [type, setType] = useState(undefined);
    // ===== Summary Query =====
    const summary = useQuery({
        queryKey: ["finance-summary", { month }],
        queryFn: async () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(dummySummary), 500);
            });
        },
        initialData: dummySummary,
    });
    // ===== Invoices Query =====
    const invoicesQuery = useQuery({
        queryKey: ["invoices", { month, kelas, status, q, type }],
        queryFn: async () => {
            let filteredInvoices = [...dummyInvoices];
            if (kelas) {
                filteredInvoices = filteredInvoices.filter((inv) => inv.class_name === kelas);
            }
            if (status !== "semua") {
                filteredInvoices = filteredInvoices.filter((inv) => inv.status === status);
            }
            if (q) {
                filteredInvoices = filteredInvoices.filter((inv) => inv.title.toLowerCase().includes(q.toLowerCase()) ||
                    inv.student_name?.toLowerCase().includes(q.toLowerCase()));
            }
            if (type) {
                filteredInvoices = filteredInvoices.filter((inv) => inv.type === type);
            }
            return new Promise((resolve) => {
                setTimeout(() => resolve({
                    list: filteredInvoices,
                    classes: ["1A", "1B", "2A", "2B", "3A", "3C"],
                    types: ["SPP", "Seragam", "Buku", "Kegiatan", "Praktikum"],
                }), 300);
            });
        },
        initialData: {
            list: dummyInvoices,
            classes: ["1A", "1B", "2A", "2B", "3A", "3C"],
            types: ["SPP", "Seragam", "Buku", "Kegiatan", "Praktikum"],
        },
    });
    // ===== Payments Query =====
    const paymentsQuery = useQuery({
        queryKey: ["payments", { month, q }],
        queryFn: async () => {
            let filteredPayments = [...dummyPayments];
            if (q) {
                filteredPayments = filteredPayments.filter((pay) => pay.payer_name?.toLowerCase().includes(q.toLowerCase()) ||
                    pay.invoice_title?.toLowerCase().includes(q.toLowerCase()));
            }
            return new Promise((resolve) => {
                setTimeout(() => resolve({ list: filteredPayments }), 300);
            });
        },
        initialData: { list: dummyPayments },
    });
    const invoices = invoicesQuery.data?.list ?? [];
    const payments = paymentsQuery.data?.list ?? [];
    const classes = invoicesQuery.data?.classes ?? [];
    const types = invoicesQuery.data?.types ?? [];
    // ===== Mutations =====
    const markPaid = useMutation({
        mutationFn: async (payload) => {
            return new Promise((resolve) => {
                console.log("Marking invoice as paid:", payload);
                setTimeout(resolve, 1000);
            });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["invoices"] });
            qc.invalidateQueries({ queryKey: ["finance-summary"] });
        },
    });
    const createInvoice = useMutation({
        mutationFn: async (payload) => {
            return new Promise((resolve) => {
                console.log("Creating invoice:", payload);
                setTimeout(resolve, 1000);
            });
        },
        onSuccess: () => {
            setOpenCreate(false);
            qc.invalidateQueries({ queryKey: ["invoices"] });
            qc.invalidateQueries({ queryKey: ["finance-summary"] });
        },
    });
    // ===== Event Handlers =====// ===== Event Handlers =====
    const onDetail = (inv) => {
        // Navigate ke halaman detail dengan ID invoice
        navigate(`detail/${inv.id}`);
    };
    const handleGoBack = () => {
        if (backTo) {
            navigate(backTo);
        }
        else {
            navigate(-1);
        }
    };
    const handleExportSubmit = (data) => {
        console.log("Export UI only:", data);
        setOpenExport(false);
    };
    const handlePaymentSubmit = (data) => {
        console.log("Pembayaran:", data);
        setOpenPay(false);
    };
    const handleCreateInvoiceSubmit = (data) => {
        console.log("Invoice baru:", data);
        setOpenCreate(false);
    };
    return (_jsxs("div", { className: "min-h-full w-full ", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Keuangan", gregorianDate: gregorianISO, hijriDate: hijriLong(gregorianISO), showBack: isFromMenuUtama }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [showBack && (_jsx(Btn, { palette: palette, variant: "ghost", onClick: handleGoBack, className: "inline-flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) })), _jsx("h1", { className: "text-lg font-semibold", children: "Keuangan Sekolah" })] }), _jsxs("section", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-3 md:py-0", children: [_jsx(KpiTile, { palette: palette, label: "Total Tertagih", value: idr(summary.data?.billed), icon: _jsx(Calendar, { size: 18 }) }), _jsx(KpiTile, { palette: palette, label: "Tunggakan", value: idr(summary.data?.outstanding), icon: _jsx(Wallet, { size: 18 }) }), _jsx(KpiTile, { palette: palette, label: "Terkumpul", value: idr(summary.data?.collected), icon: _jsx(CheckCircle2, { size: 18 }) })] }), _jsxs("section", { className: "flex flex-wrap gap-2 sm:gap-3", children: [_jsxs(Btn, { palette: palette, variant: "default", onClick: () => setOpenCreate(true), className: "inline-flex items-center gap-2 text-sm", children: [_jsx(Plus, { size: 16 }), _jsx("span", { className: "hidden sm:inline", children: "Buat Tagihan" }), _jsx("span", { className: "sm:hidden", children: "Buat" })] }), _jsxs(Btn, { palette: palette, variant: "outline", onClick: () => setOpenPay(true), className: "inline-flex items-center gap-2 text-sm", children: [_jsx(Wallet, { size: 16 }), _jsx("span", { className: "hidden sm:inline", children: "Catat Pembayaran" }), _jsx("span", { className: "sm:hidden", children: "Bayar" })] }), _jsxs(Btn, { palette: palette, variant: "outline", onClick: () => setOpenExport(true), className: "inline-flex items-center gap-2 text-sm", children: [_jsx(Download, { size: 16 }), _jsx("span", { className: "hidden sm:inline", children: "Export Data" }), _jsx("span", { className: "sm:hidden", children: "Export" })] })] }), _jsxs("div", { className: "flex gap-1 sm:gap-2 overflow-x-auto", children: [_jsxs(Btn, { palette: palette, variant: tab === "invoices" ? "default" : "outline", onClick: () => setTab("invoices"), className: "whitespace-nowrap text-sm sm:text-base flex items-center gap-2", children: [_jsx("span", { children: "\uD83D\uDCCB" }), _jsx("span", { children: "Tagihan" }), _jsx(Badge, { palette: palette, variant: "secondary", className: "text-sm", children: invoices.length })] }), _jsxs(Btn, { palette: palette, variant: tab === "payments" ? "default" : "outline", onClick: () => setTab("payments"), className: "whitespace-nowrap text-sm sm:text-base flex items-center gap-2", children: [_jsx("span", { children: "\uD83D\uDCB0" }), _jsx("span", { children: "Pembayaran" }), _jsx(Badge, { palette: palette, variant: "secondary", className: "text-sm", children: payments.length })] })] }), tab === "invoices" && (_jsxs("section", { className: "flex flex-wrap gap-3 items-center", children: [_jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [_jsx(Search, { size: 16, className: "absolute left-3 top-3 opacity-50" }), _jsx("input", { type: "text", placeholder: "Cari tagihan atau nama siswa...", value: q, onChange: (e) => setQ(e.target.value), className: "w-full pl-10 pr-4 py-2 border rounded-lg text-sm", style: {
                                                        borderColor: palette.silver1,
                                                        backgroundColor: palette.white1,
                                                    } })] }), _jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "px-3 py-2 border rounded-lg text-sm", style: {
                                                borderColor: palette.silver1,
                                                backgroundColor: palette.white1,
                                            }, children: [_jsx("option", { value: "semua", children: "Semua Status" }), _jsx("option", { value: "unpaid", children: "Belum Bayar" }), _jsx("option", { value: "partial", children: "Sebagian" }), _jsx("option", { value: "paid", children: "Lunas" }), _jsx("option", { value: "overdue", children: "Terlambat" })] }), _jsxs("select", { value: kelas || "", onChange: (e) => setKelas(e.target.value || undefined), className: "px-3 py-2 border rounded-lg text-sm", style: {
                                                borderColor: palette.silver1,
                                                backgroundColor: palette.white1,
                                            }, children: [_jsx("option", { value: "", children: "Semua Kelas" }), classes.map((cls) => (_jsxs("option", { value: cls, children: ["Kelas ", cls] }, cls)))] })] })), tab === "payments" && (_jsx("section", { className: "flex flex-wrap gap-3 items-center", children: _jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [_jsx(Search, { size: 16, className: "absolute left-3 top-3 opacity-50" }), _jsx("input", { type: "text", placeholder: "Cari pembayaran...", value: q, onChange: (e) => setQ(e.target.value), className: "w-full pl-10 pr-4 py-2 border rounded-lg text-sm", style: {
                                                    borderColor: palette.silver1,
                                                    backgroundColor: palette.white1,
                                                } })] }) })), tab === "invoices" ? (_jsx(InvoiceTable, { palette: palette, invoices: invoices, query: invoicesQuery, onDetail: onDetail, markPaid: markPaid })) : (_jsx(PaymentTable, { palette: palette, payments: payments, query: paymentsQuery }))] })] }) }), _jsx(Export, { open: openExport, onClose: () => setOpenExport(false), palette: palette, onSubmit: handleExportSubmit }), _jsx(Pembayaran, { open: openPay, onClose: () => setOpenPay(false), onSubmit: handlePaymentSubmit, palette: palette, invoiceOptions: invoices.map((inv) => ({
                    value: inv.id,
                    label: `${inv.title} — ${inv.student_name ?? "-"}`,
                })) }), _jsx(CreateInvoiceModal, { open: openCreate, onClose: () => setOpenCreate(false), palette: palette, classOptions: classes, typeOptions: types, studentOptions: [], loading: createInvoice.isPending, error: createInvoice.error?.response?.data?.message ??
                    createInvoice.error?.message ??
                    null, onSubmit: handleCreateInvoiceSubmit })] }));
};
export default SchoolFinance;
