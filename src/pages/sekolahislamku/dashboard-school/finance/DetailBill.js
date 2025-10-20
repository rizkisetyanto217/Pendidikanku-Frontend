import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
// Theme & utils
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
// UI primitives & layout
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
// Icons
import { ArrowLeft, Calendar, User, CreditCard, Clock, FileText, CheckCircle2, AlertCircle, Download, Edit3, Trash2, } from "lucide-react";
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
const timeFmt = (iso) => iso
    ? new Date(iso).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    })
    : "-";
/* ================= Dummy Data ================= */
const dummyInvoiceDetail = {
    id: "inv001",
    title: "SPP September 2025",
    description: "Pembayaran SPP untuk bulan September 2025 kelas 1A",
    student_id: "stu001",
    student_name: "Ahmad Fauzi",
    class_name: "1A",
    created_date: "2025-09-01T12:00:00.000Z",
    due_date: "2025-09-15T12:00:00.000Z",
    amount: 500000,
    paid_amount: 500000,
    status: "paid",
    type: "SPP",
    payment_history: [
        {
            id: "pay001",
            date: "2025-09-14T12:00:00.000Z",
            amount: 500000,
            method: "Transfer Bank",
            notes: "Transfer via BCA",
            receipt_number: "TRX20250914001",
        },
    ],
};
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
/* ================= Info Row Component ================= */
const InfoRow = ({ icon, label, value, palette, className = "" }) => (_jsxs("div", { className: `flex items-start gap-3 ${className}`, children: [_jsx("span", { className: "w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0", style: { backgroundColor: palette.primary2, color: palette.primary }, children: icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: label }), _jsx("div", { className: "font-medium text-base mt-1", children: value })] })] }));
/* ================= Main Component ================= */
const DetailBill = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const qc = useQueryClient();
    const { id } = useParams();
    const gregorianISO = toLocalNoonISO(new Date());
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    // ===== Query =====
    const invoiceQuery = useQuery({
        queryKey: ["invoice-detail", id],
        queryFn: async () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(dummyInvoiceDetail), 500);
            });
        },
        enabled: !!id,
    });
    const invoice = invoiceQuery.data;
    // ===== Mutations =====
    const markPaid = useMutation({
        mutationFn: async (payload) => {
            return new Promise((resolve) => {
                console.log("Marking invoice as paid:", payload);
                setTimeout(resolve, 1000);
            });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["invoice-detail", id] });
        },
    });
    const deleteInvoice = useMutation({
        mutationFn: async (payload) => {
            return new Promise((resolve) => {
                console.log("Deleting invoice:", payload);
                setTimeout(resolve, 1000);
            });
        },
        onSuccess: () => {
            navigate("/keuangan");
        },
    });
    // ===== Event Handlers =====
    const handleGoBack = () => {
        navigate(-1);
    };
    const handleEdit = () => {
        console.log("Edit invoice:", id);
        // Navigate to edit page or open edit modal
    };
    const handleDelete = () => {
        if (confirm("Apakah Anda yakin ingin menghapus tagihan ini?")) {
            deleteInvoice.mutate({ id: id });
        }
    };
    const handleMarkPaid = () => {
        if (!invoice)
            return;
        const remainingAmount = invoice.amount - (invoice.paid_amount || 0);
        markPaid.mutate({ id: invoice.id, amount: remainingAmount });
    };
    const handleDownloadReceipt = (paymentId) => {
        console.log("Download receipt for payment:", paymentId);
        // Implement receipt download logic
    };
    const getPaymentMethodIcon = (method) => {
        const iconMap = {
            "Transfer Bank": "🏦",
            Tunai: "💵",
            "E-Wallet": "📱",
        };
        return iconMap[method || ""] || "💳";
    };
    if (invoiceQuery.isLoading) {
        return (_jsxs("div", { className: "min-h-full w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Tagihan", gregorianDate: gregorianISO, hijriDate: hijriLong(gregorianISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsx("section", { className: "flex-1", children: _jsx(LoadingSpinner, { text: "Memuat detail tagihan...", palette: palette }) })] }) })] }));
    }
    if (!invoice) {
        return (_jsxs("div", { className: "min-h-full w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Tagihan", gregorianDate: gregorianISO, hijriDate: hijriLong(gregorianISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsx("section", { className: "flex-1", children: _jsxs("div", { className: "py-12 text-center", children: [_jsx("div", { className: "text-4xl mb-3", children: "\u274C" }), _jsx("div", { className: "font-medium mb-1", children: "Tagihan Tidak Ditemukan" }), _jsx("div", { className: "text-sm mb-4", style: { color: palette.black2 }, children: "Tagihan dengan ID tersebut tidak ada atau telah dihapus" }), _jsx(Btn, { palette: palette, onClick: handleGoBack, children: "Kembali ke Daftar Tagihan" })] }) })] }) })] }));
    }
    const dueDate = normalizeISOToLocalNoon(invoice.due_date);
    const createdDate = normalizeISOToLocalNoon(invoice.created_date);
    const isOverdue = invoice.status === "overdue";
    const remainingAmount = invoice.amount - (invoice.paid_amount || 0);
    return (_jsxs("div", { className: "min-h-full w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Tagihan", gregorianDate: gregorianISO, hijriDate: hijriLong(gregorianISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between", children: [_jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: handleGoBack, className: "md:inline-flex items-center gap-2 hidden ", children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-lg font-semibold", children: invoice.title }), _jsxs("p", { className: "text-sm", style: { color: palette.black2 }, children: ["ID: ", invoice.id] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Btn, { palette: palette, variant: "outline", onClick: handleEdit, className: "inline-flex items-center gap-2", children: [_jsx(Edit3, { size: 16 }), _jsx("span", { className: "hidden sm:inline", children: "Edit" })] }), _jsxs(Btn, { palette: palette, variant: "ghost", onClick: handleDelete, disabled: deleteInvoice.isPending, className: "inline-flex items-center gap-2 text-red-600 hover:text-red-700", children: [_jsx(Trash2, { size: 16 }), _jsx("span", { className: "hidden sm:inline", children: "Hapus" })] })] })] }), isOverdue && (_jsx("div", { className: "p-4 rounded-lg border-l-4", style: {
                                        backgroundColor: `${palette.warning1}15`,
                                        borderLeftColor: palette.warning1,
                                    }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { size: 20, className: "flex-shrink-0 mt-0.5", style: { color: palette.warning1 } }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", style: { color: palette.warning1 }, children: "Tagihan Terlambat" }), _jsxs("div", { className: "text-sm mt-1", style: { color: palette.black2 }, children: ["Tagihan ini telah melewati batas waktu pembayaran pada", " ", dateFmt(dueDate)] })] })] }) })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(SectionCard, { palette: palette, children: [_jsx("div", { className: "px-4 py-4 border-b", style: { borderColor: palette.silver1 }, children: _jsxs("h3", { className: "font-semibold text-lg flex items-center gap-2", children: [_jsx(FileText, { size: 20 }), "Informasi Tagihan"] }) }), _jsxs("div", { className: "p-4 space-y-4", children: [_jsx(InfoRow, { icon: _jsx(User, { size: 16 }), label: "Nama Siswa", value: invoice.student_name || "-", palette: palette }), _jsx(InfoRow, { icon: _jsx(FileText, { size: 16 }), label: "Kelas", value: invoice.class_name || "-", palette: palette }), _jsx(InfoRow, { icon: _jsx(Calendar, { size: 16 }), label: "Tanggal Dibuat", value: dateFmt(createdDate), palette: palette }), _jsx(InfoRow, { icon: _jsx(Clock, { size: 16 }), label: "Jatuh Tempo", value: _jsx("span", { className: isOverdue ? "text-red-600 font-semibold" : "", children: dateFmt(dueDate) }), palette: palette }), _jsx(InfoRow, { icon: _jsx(Badge, { palette: palette, variant: "outline", children: invoice.type || "Umum" }), label: "Jenis Tagihan", value: "", palette: palette }), invoice.description && (_jsx(InfoRow, { icon: _jsx(FileText, { size: 16 }), label: "Keterangan", value: invoice.description, palette: palette }))] })] }), _jsxs(SectionCard, { palette: palette, children: [_jsx("div", { className: "px-4 py-4 border-b", style: { borderColor: palette.silver1 }, children: _jsxs("h3", { className: "font-semibold text-lg flex items-center gap-2", children: [_jsx(CreditCard, { size: 20 }), "Ringkasan Pembayaran"] }) }), _jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center py-2", children: [_jsx("span", { style: { color: palette.black2 }, children: "Total Tagihan:" }), _jsx("span", { className: "font-bold text-xl", children: idr(invoice.amount) })] }), _jsxs("div", { className: "flex justify-between items-center py-2", children: [_jsx("span", { style: { color: palette.black2 }, children: "Sudah Dibayar:" }), _jsx("span", { className: "font-semibold text-lg", style: { color: palette.primary }, children: idr(invoice.paid_amount || 0) })] }), _jsx("div", { className: "h-px", style: { backgroundColor: palette.silver1 } }), _jsxs("div", { className: "flex justify-between items-center py-2", children: [_jsx("span", { className: "font-medium", children: "Sisa Tagihan:" }), _jsx("span", { className: `font-bold text-xl ${remainingAmount > 0 ? "text-red-600" : ""}`, style: {
                                                                        color: remainingAmount === 0 ? palette.primary : undefined,
                                                                    }, children: idr(remainingAmount) })] }), _jsx("div", { className: "pt-2", children: _jsx(StatusBadge, { status: invoice.status, palette: palette }) }), remainingAmount > 0 && (_jsx("div", { className: "pt-2", children: _jsx(Btn, { palette: palette, onClick: handleMarkPaid, disabled: markPaid.isPending, className: "w-full", children: markPaid.isPending ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" }), "Memproses..."] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle2, { size: 16 }), "Tandai Lunas"] })) }) }))] })] })] }), invoice.payment_history.length > 0 && (_jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "px-4 py-4 border-b", style: { borderColor: palette.silver1 }, children: [_jsx("h3", { className: "font-semibold text-lg", children: "Riwayat Pembayaran" }), _jsxs("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: [invoice.payment_history.length, " pembayaran tercatat"] })] }), _jsx("div", { className: "divide-y", style: { borderColor: palette.silver1 }, children: invoice.payment_history.map((payment) => {
                                                const paymentDate = normalizeISOToLocalNoon(payment.date);
                                                return (_jsx("div", { className: "p-4", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: "text-2xl", children: getPaymentMethodIcon(payment.method) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-lg", children: idr(payment.amount) }), _jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: [dateFmt(paymentDate), " \u2022", " ", timeFmt(paymentDate)] })] })] }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsxs("div", { children: [_jsxs("span", { style: { color: palette.black2 }, children: ["Metode:", " "] }), _jsx("span", { className: "font-medium", children: payment.method || "Tidak diketahui" })] }), payment.receipt_number && (_jsxs("div", { children: [_jsxs("span", { style: { color: palette.black2 }, children: ["No. Kuitansi:", " "] }), _jsx("span", { className: "font-mono text-sm", children: payment.receipt_number })] })), payment.notes && (_jsxs("div", { children: [_jsxs("span", { style: { color: palette.black2 }, children: ["Catatan:", " "] }), _jsx("span", { children: payment.notes })] }))] })] }), _jsx("div", { className: "flex gap-2", children: _jsxs(Btn, { palette: palette, variant: "outline", size: "sm", onClick: () => handleDownloadReceipt(payment.id), className: "inline-flex items-center gap-2", children: [_jsx(Download, { size: 14 }), _jsx("span", { className: "hidden sm:inline", children: "Kuitansi" })] }) })] }) }, payment.id));
                                            }) })] }))] })] }) })] }));
};
export default DetailBill;
