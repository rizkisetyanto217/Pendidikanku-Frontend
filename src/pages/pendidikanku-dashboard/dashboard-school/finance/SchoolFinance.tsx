// src/pages/pendidikanku-dashboard/dashboard-school/finance/SchoolFinance.tsx
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { pickTheme, type Palette } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useTopBar } from "../../components/home/CUseTopBar";

import {
  Wallet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Info,
} from "lucide-react";

import { Btn, Badge, SectionCard } from "../../components/ui/CPrimitives";

/* === 🔌 DataViewKit components === */
import {
  useSearchQuery,
  SearchBar,
  useOffsetLimit,
  PaginationBar,
  DataTable,
  type Column,
  CardGrid,
  PerPageSelect,
} from "@/pages/pendidikanku-dashboard/components/common/CDataViewKit";

/* ===================== Dummy Types & Data ===================== */
type InvoiceStatus = "unpaid" | "paid" | "overdue";

type Invoice = {
  id: string;
  title: string;
  student_name: string;
  class_name: string;
  due_date: string;
  amount: number;
  status: InvoiceStatus;
};

type Payment = {
  id: string;
  date: string;
  payer_name: string;
  invoice_title: string;
  amount: number;
  method: string;
};

const dummyInvoices: Invoice[] = [
  {
    id: "inv001",
    title: "SPP September 2025",
    student_name: "Ahmad Fauzi",
    class_name: "1A",
    due_date: "2025-09-15",
    amount: 500000,
    status: "paid",
  },
  {
    id: "inv002",
    title: "SPP Oktober 2025",
    student_name: "Siti Aminah",
    class_name: "2A",
    due_date: "2025-10-15",
    amount: 500000,
    status: "unpaid",
  },
  {
    id: "inv003",
    title: "SPP Agustus 2025",
    student_name: "Budi Santoso",
    class_name: "3C",
    due_date: "2025-08-10",
    amount: 500000,
    status: "overdue",
  },
];

const dummyPayments: Payment[] = [
  {
    id: "pay001",
    date: "2025-09-14",
    payer_name: "Ahmad Fauzi",
    invoice_title: "SPP September 2025",
    amount: 500000,
    method: "Transfer Bank",
  },
  {
    id: "pay002",
    date: "2025-09-20",
    payer_name: "Siti Aminah",
    invoice_title: "SPP Agustus 2025",
    amount: 500000,
    method: "E-Wallet",
  },
];

/* ===================== Helpers ===================== */
const idr = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ===================== Main Page ===================== */
const SchoolFinance: React.FC = () => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as any, isDark);
  const { setTopBar, resetTopBar } = useTopBar();

  React.useEffect(() => {
    setTopBar({ mode: "menu", title: "Keuangan Sekolah" });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  // Tabs
  const [tab, setTab] = useState<"invoices" | "payments">("invoices");

  // Data Queries
  const invoicesQ = useQuery({
    queryKey: ["school-finance-invoices"],
    queryFn: async () => dummyInvoices,
    initialData: dummyInvoices,
  });

  const paymentsQ = useQuery({
    queryKey: ["school-finance-payments"],
    queryFn: async () => dummyPayments,
    initialData: dummyPayments,
  });

  const invoices = invoicesQ.data ?? [];
  const payments = paymentsQ.data ?? [];

  /* ==== 🔎 Search (sinkron ?q=) ==== */
  const { q, setQ } = useSearchQuery("q");
  const filteredInvoices = useMemo(() => {
    if (!q) return invoices;
    return invoices.filter(
      (x) =>
        x.title.toLowerCase().includes(q.toLowerCase()) ||
        x.student_name.toLowerCase().includes(q.toLowerCase())
    );
  }, [q, invoices]);

  const filteredPayments = useMemo(() => {
    if (!q) return payments;
    return payments.filter(
      (x) =>
        x.payer_name.toLowerCase().includes(q.toLowerCase()) ||
        x.invoice_title.toLowerCase().includes(q.toLowerCase())
    );
  }, [q, payments]);

  /* ==== Pagination ==== */
  const total = tab === "invoices" ? filteredInvoices.length : filteredPayments.length;
  const {
    offset,
    limit,
    setLimit,
    pageStart,
    pageEnd,
    canPrev,
    canNext,
    handlePrev,
    handleNext,
  } = useOffsetLimit(total, 10, 100);

  const pageInvoices = filteredInvoices.slice(offset, offset + limit);
  const pagePayments = filteredPayments.slice(offset, offset + limit);

  /* ==== Columns ==== */
  const columnsInvoice: Column<Invoice>[] = [
    { key: "title", header: "Tagihan", cell: (x) => x.title },
    { key: "student", header: "Siswa", cell: (x) => x.student_name },
    { key: "class", header: "Kelas", cell: (x) => x.class_name },
    { key: "due_date", header: "Jatuh Tempo", cell: (x) => dateFmt(x.due_date) },
    { key: "amount", header: "Nominal", cell: (x) => idr(x.amount) },
    {
      key: "status",
      header: "Status",
      cell: (x) => (
        <Badge
          palette={palette}
          variant={
            x.status === "paid"
              ? "success"
              : x.status === "unpaid"
              ? "outline"
              : "warning"
          }
        >
          {x.status === "paid"
            ? "Lunas"
            : x.status === "unpaid"
            ? "Belum Bayar"
            : "Terlambat"}
        </Badge>
      ),
    },
  ];

  const columnsPayment: Column<Payment>[] = [
    { key: "date", header: "Tanggal", cell: (x) => dateFmt(x.date) },
    { key: "payer", header: "Pembayar", cell: (x) => x.payer_name },
    { key: "invoice", header: "Untuk Tagihan", cell: (x) => x.invoice_title },
    { key: "method", header: "Metode", cell: (x) => x.method },
    { key: "amount", header: "Jumlah", cell: (x) => idr(x.amount) },
  ];

  /* ==== Summary Dummy ==== */
  const summary = {
    totalBilled: idr(1500000),
    collected: idr(1000000),
    outstanding: idr(500000),
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* ===== Header ===== */}
      <div
        className="p-4 md:p-5 pb-3 border-b flex flex-wrap items-center gap-2"
        style={{ borderColor: palette.silver1 }}
      >
        <div className="flex items-center gap-2 font-semibold order-1">
          <Layers size={18} color={palette.quaternary} /> Keuangan Sekolah
        </div>

        <div className="order-3 sm:order-2 w-full sm:w-auto flex-1 min-w-0">
          <SearchBar
            palette={palette}
            value={q}
            onChange={setQ}
            placeholder={
              tab === "invoices" ? "Cari tagihan atau siswa…" : "Cari pembayaran…"
            }
            debounceMs={400}
            className="w-full"
            rightExtra={
              <PerPageSelect palette={palette} value={limit} onChange={setLimit} />
            }
          />
        </div>

        <div className="order-2 sm:order-3 ml-auto flex items-center gap-2">
          <Btn palette={palette} size="sm" className="gap-1">
            <Download size={14} /> Export
          </Btn>
        </div>
      </div>

      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6 p-4 md:p-5">
          {/* ===== Ringkasan Keuangan ===== */}
          <SectionCard palette={palette}>
            <div className="p-5 grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm opacity-70">Total Tertagih</div>
                <div className="text-xl font-semibold">{summary.totalBilled}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Terkumpul</div>
                <div className="text-xl font-semibold text-green-600">
                  {summary.collected}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-70">Tunggakan</div>
                <div className="text-xl font-semibold text-red-600">
                  {summary.outstanding}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ===== Tabs ===== */}
          <div className="flex gap-2">
            <Btn
              palette={palette}
              variant={tab === "invoices" ? "default" : "outline"}
              onClick={() => setTab("invoices")}
              className="flex items-center gap-2"
            >
              <Wallet size={16} /> Tagihan
            </Btn>
            <Btn
              palette={palette}
              variant={tab === "payments" ? "default" : "outline"}
              onClick={() => setTab("payments")}
              className="flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Pembayaran
            </Btn>
          </div>

          {/* ===== Content ===== */}
          <SectionCard palette={palette}>
            {tab === "invoices" ? (
              <>
                {pageInvoices.length === 0 ? (
                  <div className="p-6 flex items-center gap-2 text-sm opacity-70">
                    <Info size={16} /> Tidak ada data tagihan.
                  </div>
                ) : (
                  <>
                    <div className="md:hidden">
                      <CardGrid<Invoice>
                        items={pageInvoices}
                        renderItem={(inv) => (
                          <div
                            key={inv.id}
                            className="rounded-xl border p-4 flex flex-col gap-2"
                            style={{
                              borderColor: palette.silver1,
                              background: palette.white1,
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="font-semibold">{inv.title}</div>
                              <Badge
                                palette={palette}
                                variant={
                                  inv.status === "paid"
                                    ? "success"
                                    : inv.status === "unpaid"
                                    ? "outline"
                                    : "warning"
                                }
                              >
                                {inv.status === "paid"
                                  ? "Lunas"
                                  : inv.status === "unpaid"
                                  ? "Belum Bayar"
                                  : "Terlambat"}
                              </Badge>
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: palette.black2 }}
                            >
                              {inv.student_name} · Kelas {inv.class_name}
                            </div>
                            <div className="text-sm">
                              Jatuh Tempo: {dateFmt(inv.due_date)}
                            </div>
                            <div className="font-semibold text-right">
                              {idr(inv.amount)}
                            </div>
                          </div>
                        )}
                      />
                    </div>

                    <div className="hidden md:block">
                      <DataTable<Invoice>
                        palette={palette}
                        columns={columnsInvoice}
                        rows={pageInvoices}
                        minWidth={840}
                      />
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {pagePayments.length === 0 ? (
                  <div className="p-6 flex items-center gap-2 text-sm opacity-70">
                    <Info size={16} /> Tidak ada data pembayaran.
                  </div>
                ) : (
                  <>
                    <div className="md:hidden">
                      <CardGrid<Payment>
                        items={pagePayments}
                        renderItem={(p) => (
                          <div
                            key={p.id}
                            className="rounded-xl border p-4 flex flex-col gap-2"
                            style={{
                              borderColor: palette.silver1,
                              background: palette.white1,
                            }}
                          >
                            <div className="font-semibold text-base">
                              {idr(p.amount)}
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: palette.black2 }}
                            >
                              {p.payer_name} · {dateFmt(p.date)}
                            </div>
                            <div className="text-sm">{p.invoice_title}</div>
                            <div
                              className="inline-block text-xs px-2 py-1 rounded-lg self-start"
                              style={{
                                background: palette.primary2,
                                color: palette.primary,
                              }}
                            >
                              {p.method}
                            </div>
                          </div>
                        )}
                      />
                    </div>

                    <div className="hidden md:block">
                      <DataTable<Payment>
                        palette={palette}
                        columns={columnsPayment}
                        rows={pagePayments}
                        minWidth={720}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Pagination */}
            <PaginationBar
              palette={palette}
              pageStart={pageStart}
              pageEnd={pageEnd}
              total={total}
              canPrev={canPrev}
              canNext={canNext}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </SectionCard>
        </div>
      </main>
    </div>
  );
};

export default SchoolFinance;
