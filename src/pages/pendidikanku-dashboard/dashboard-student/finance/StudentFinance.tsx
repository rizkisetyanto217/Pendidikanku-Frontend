import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Wallet, CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/Primitives";

/* =========================
   Types & Helpers
========================= */
type BillStatus = "unpaid" | "paid" | "overdue";
type BillItem = { id: string; name: string; qty?: number; amount: number };

interface BillDetail {
  id: string;
  title: string;
  invoiceNo: string;
  createdAt: string;
  dueDate: string;
  status: BillStatus;
  student: { name: string; className: string };
  items: BillItem[];
  discount?: number;
  adminFee?: number;
  total: number;
  payment?: { date: string; method: string; ref: string };
}

const dateLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

/* =========================
   Dummy Fetch Data
========================= */
async function fetchBillDetail(billId: string): Promise<BillDetail> {
  const now = new Date();
  const iso = (d: Date) => d.toISOString();

  return {
    id: billId || "default",
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
    total: 162_500,
  };
}

/* =========================
   Tabs Header Component
========================= */
function TabsHeader({
  activeTab,
  setActiveTab,
  palette,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  palette: Palette;
}) {
  const tabs = [
    { key: "today", label: "Tagihan Hari Ini", icon: <Clock size={16} /> },
    { key: "history", label: "Riwayat Pembayaran", icon: <CheckCircle2 size={16} /> },
  ];

  return (
    <div className="flex gap-3 border-b mb-4" style={{ borderColor: palette.silver1 }}>
      {tabs.map((t) => {
        const isActive = activeTab === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all"
            style={{
              background: isActive ? palette.white1 : "transparent",
              color: isActive ? palette.primary : palette.silver2,
              borderBottom: isActive
                ? `2px solid ${palette.primary}`
                : "2px solid transparent",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* =========================
   Main Page
========================= */
export default function StudentFinance() {
  const { billId: billIdParam } = useParams();
  const billId = billIdParam || "default";
  const navigate = useNavigate();
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  const [activeTab, setActiveTab] = useState("today");

  const { data, isLoading, error } = useQuery({
    queryKey: ["bill-detail", billId],
    queryFn: () => fetchBillDetail(billId),
    staleTime: 60_000,
  });

  const paidList: BillDetail[] = [
    {
      id: "paid-1",
      title: "SPP Juli 2025",
      invoiceNo: "INV-2025-07-014",
      createdAt: new Date(2025, 6, 1).toISOString(),
      dueDate: new Date(2025, 6, 10).toISOString(),
      status: "paid",
      student: { name: "Ahmad", className: "TPA A" },
      items: [
        { id: "i1", name: "SPP Bulanan", amount: 150_000 },
        { id: "i2", name: "Infaq Kegiatan", amount: 10_000 },
      ],
      total: 160_000,
      payment: {
        date: new Date(2025, 6, 5).toISOString(),
        method: "VA BSI",
        ref: "MID-VA-7F3K2Q",
      },
    },
  ];

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="max-w-screen-2xl mx-auto p-4 space-y-6">
        {/* Header dengan tombol back icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border transition hover:bg-opacity-70"
              style={{
                borderColor: palette.silver1,
                background: palette.white1,
                color: palette.black1,
              }}
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>

            <h1 className="text-lg font-semibold" style={{ color: palette.black1 }}>
              Pembayaran
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} palette={palette} />

        {/* Tab: Tagihan Hari Ini */}
        {activeTab === "today" && (
          <>
            {error ? (
              <SectionCard palette={palette} className="p-4">
                <div style={{ color: palette.error1 }}>Gagal memuat data tagihan.</div>
              </SectionCard>
            ) : (
              <>
                <SectionCard palette={palette} className="p-4 md:p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet size={18} color={palette.primary} />
                    <div className="font-medium" style={{ color: palette.black1 }}>
                      Tagihan Aktif
                    </div>
                  </div>
                  <div style={{ color: palette.black2 }}>
                    Berikut tagihan Anda yang masih belum dibayar.
                  </div>
                </SectionCard>

                {!isLoading && data && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Rincian Item */}
                    <SectionCard palette={palette} className="p-4 md:p-5 lg:col-span-2">
                      <div className="font-medium mb-2" style={{ color: palette.black1 }}>
                        Rincian Tagihan
                      </div>
                      <div
                        className="rounded-xl border"
                        style={{
                          borderColor: palette.silver1,
                          background: palette.white1,
                        }}
                      >
                        {(data.items ?? []).map((it) => (
                          <div
                            key={it.id}
                            className="grid grid-cols-12 px-3 py-2 border-b last:border-none"
                            style={{ borderColor: palette.silver1, color: palette.black2 }}
                          >
                            <div className="col-span-7">{it.name}</div>
                            <div className="col-span-2 text-right">{it.qty ?? 1}x</div>
                            <div className="col-span-3 text-right">{formatIDR(it.amount)}</div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>

                    {/* Ringkasan */}
                    <SectionCard palette={palette} className="p-4 md:p-5">
                      <div className="font-medium mb-2" style={{ color: palette.black1 }}>
                        Ringkasan
                      </div>
                      <div style={{ color: palette.black2 }}>
                        Total:{" "}
                        <span className="font-semibold" style={{ color: palette.primary }}>
                          {formatIDR(data.total ?? 0)}
                        </span>
                      </div>
                      <Btn palette={palette} className="mt-4 w-full">
                        Bayar Sekarang
                      </Btn>
                    </SectionCard>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Tab: Riwayat Pembayaran */}
        {activeTab === "history" && (
          <SectionCard palette={palette} className="p-4 md:p-5">
            <div className="font-medium mb-3" style={{ color: palette.black1 }}>
              Riwayat Pembayaran
            </div>
            {paidList.map((b) => (
              <div
                key={b.id}
                className="border rounded-xl p-3 mb-3 transition"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium" style={{ color: palette.black1 }}>
                      {b.title}
                    </div>
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      Dibayar pada {dateLong(b.payment?.date)} via {b.payment?.method}
                    </div>
                  </div>
                  <div
                    className="font-semibold"
                    style={{ color: palette.success1 }}
                  >
                    {formatIDR(b.total)}
                  </div>
                </div>
              </div>
            ))}
          </SectionCard>
        )}
      </main>
    </div>
  );
}
  