// src/pages/sekolahislamku/pages/finance/SchoolSpp.tsx
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";

// Theme & utils
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";

// UI primitives
import {
  SectionCard,
  Badge,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/CParentTopBar";
import ParentSidebar from "@/pages/pendidikanku-dashboard/components/home/CParentSideBar";

// Icons
import {
  BarChart2,
  Filter as FilterIcon,
  RefreshCcw,
  Download,
  ArrowLeft,
} from "lucide-react";

/* ================= Helpers ================= */
const atLocalNoon = (d: Date) => {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x;
};
const toLocalNoonISO = (d: Date) => atLocalNoon(d).toISOString();
const dateLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";
const hijriLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";
const idr = (n?: number) =>
  n == null
    ? "-"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(n);

/* ================= Types ================= */
export type SppStatus = "unpaid" | "paid" | "overdue";

type SppBillRow = {
  id: string;
  student_id: string;
  student_name: string;
  class_name?: string;
  amount: number;
  due_date: string;
  status: SppStatus;
};

type ApiSppBillsResp = {
  list: SppBillRow[];
  classes?: string[];
};

/* ================= Page ================= */
const SchoolSpp: React.FC = () => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const gregorianISO = toLocalNoonISO(new Date());

  // Filters
  const today = new Date();
  const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [month, setMonth] = useState<string>(ym);
  const [kelas, setKelas] = useState<string>("");
  const [status, setStatus] = useState<SppStatus | "semua">("semua");
  const [q, setQ] = useState<string>("");

  // State modal
  const [detailBill, setDetailBill] = useState<SppBillRow | null>(null);
  const [tagihBill, setTagihBill] = useState<SppBillRow | null>(null);

  // Dummy data
  const billsQ = useQuery({
    queryKey: ["spp-bills", { month, q, kelas, status }],
    queryFn: async () => {
      const dummy: ApiSppBillsResp = {
        list: Array.from({ length: 10 }).map((_, i) => ({
          id: `spp-${i + 1}`,
          student_id: `S-${1000 + i}`,
          student_name: `Siswa ${i + 1}`,
          class_name: ["1A", "1B", "2A"][i % 4],
          amount: 150000 + (i % 3) * 50000,
          due_date: new Date(
            today.getFullYear(),
            today.getMonth(),
            20
          ).toISOString(),
          status: (["unpaid", "paid", "overdue"] as SppStatus[])[i % 4],
        })),
        classes: ["1A", "1B", "2A", "3A"],
      };
      return dummy;
    },
  });

  const bills = billsQ.data?.list ?? [];
  const classOptions = billsQ.data?.classes ?? [];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="w-full">
        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-x-auto">
          {/* Main */}
          <section className="flex-1 flex flex-col space-y-6 min-w-0">
            {/* Header */}
            <section className="flex items-center justify-between">
              <div className="flex items-center font-semibold text-lg">
                <Btn
                  palette={palette}
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="cursor-pointer mr-3"
                >
                  <ArrowLeft size={20} />
                </Btn>
                <h1>SPP Murid</h1>
              </div>

              <div className="flex items-center gap-2">
                <Btn
                  palette={palette}
                  variant="outline"
                  size="sm"
                  onClick={() => billsQ.refetch()}
                  className="text-sm"
                >
                  <RefreshCcw size={16} className="mr-1" />
                  Muat Ulang
                </Btn>
              </div>
            </section>

            {/* Filter */}
            <SectionCard palette={palette}>
              <div className="p-4 md:p-5 pb-2 font-medium flex items-center gap-2">
                <FilterIcon size={18} /> Filter
              </div>
              <div className="px-4 md:px-5 pb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Bulan */}
                <div>
                  <div
                    className="text-sm mb-1"
                    style={{ color: palette.black2 }}
                  >
                    Bulan
                  </div>
                  <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full h-11 rounded-lg border px-3 text-sm bg-transparent"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.black1,
                    }}
                  />
                </div>
                {/* Kelas */}
                <div>
                  <div
                    className="text-sm mb-1"
                    style={{ color: palette.black2 }}
                  >
                    Kelas
                  </div>
                  <select
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full h-11 rounded-lg border px-3 text-sm bg-transparent"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.black1,
                    }}
                  >
                    <option value="">Semua</option>
                    {classOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Status */}
                <div>
                  <div
                    className="text-sm mb-1"
                    style={{ color: palette.black2 }}
                  >
                    Status
                  </div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-11 rounded-lg border px-3 text-sm bg-transparent"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.black1,
                    }}
                  >
                    <option value="semua">Semua</option>
                    <option value="paid">Lunas</option>
                    <option value="unpaid">Belum Bayar</option>
                    <option value="overdue">Terlambat</option>
                  </select>
                </div>
                {/* Cari */}
                <div className="md:col-span-2">
                  <div
                    className="text-sm mb-1"
                    style={{ color: palette.black2 }}
                  >
                    Cari siswa/ID
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Ketik nama siswa…"
                      className="w-full h-11 rounded-lg border px-3 text-sm bg-transparent"
                      style={{
                        borderColor: palette.silver1,
                        color: palette.black1,
                      }}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Table */}
            <SectionCard palette={palette}>
              <div className="p-4 md:p-5 pb-2 flex items-center justify-between">
                <div className="font-medium">Daftar SPP</div>
                <Btn palette={palette} variant="outline" size="sm">
                  <Download size={16} /> Export
                </Btn>
              </div>

              {/* ✅ Scroll container */}
              <div className="relative" aria-label="Scrollable table">
                <div className="overflow-x-auto overscroll-x-contain max-w-full rounded-xl border border-gray-200 bg-white dark:bg-neutral-900 shadow-sm">
                  {/* Optional fade shadows */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white dark:from-neutral-900 to-transparent rounded-l-xl"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white dark:from-neutral-900 to-transparent rounded-r-xl"
                  />

                  {/* ✅ Table with fixed min-width */}
                  <table className="min-w-[960px] w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-neutral-800/60 sticky top-0 z-10">
                      <tr
                        className="border-b"
                        style={{ borderColor: palette.silver1 }}
                      >
                        <th className="py-2 px-4">Siswa</th>
                        <th className="py-2 px-4">Kelas</th>
                        <th className="py-2 px-4">Nominal</th>
                        <th className="py-2 px-4">Jatuh Tempo</th>
                        <th className="py-2 px-4">Status</th>
                        <th className="py-2 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody
                      className="divide-y"
                      style={{ borderColor: palette.silver1 }}
                    >
                      {bills.map((r) => (
                        <tr key={r.id}>
                          <td className="py-3 px-4 font-medium whitespace-nowrap">
                            {r.student_name}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {r.class_name ?? "-"}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {idr(r.amount)}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {new Date(r.due_date).toLocaleDateString("id-ID")}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {r.status === "paid" && (
                              <Badge palette={palette} variant="success">
                                Lunas
                              </Badge>
                            )}
                            {r.status === "unpaid" && (
                              <Badge palette={palette} variant="outline">
                                Belum Bayar
                              </Badge>
                            )}
                            {r.status === "overdue" && (
                              <Badge palette={palette} variant="warning">
                                Terlambat
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <Btn
                                palette={palette}
                                size="sm"
                                variant="outline"
                                onClick={() => setDetailBill(r)}
                              >
                                Detail
                              </Btn>
                              {r.status !== "paid" && (
                                <Btn
                                  palette={palette}
                                  size="sm"
                                  onClick={() => setTagihBill(r)}
                                >
                                  Tagih
                                </Btn>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Helper text */}
                <p className="mt-2 text-[11px] text-gray-500">
                  Geser tabel ke kiri/kanan untuk melihat semua kolom.
                </p>
              </div>
            </SectionCard>
          </section>
        </div>
      </main>

      {/* Modals */}
      <SppDetailModal
        bill={detailBill}
        onClose={() => setDetailBill(null)}
        palette={palette}
      />
      <SppTagihModal
        bill={tagihBill}
        onClose={() => setTagihBill(null)}
        palette={palette}
      />
    </div>
  );
};

export default SchoolSpp;

/* ================= Modals ================= */
function SppDetailModal({
  bill,
  onClose,
  palette,
}: {
  bill: SppBillRow | null;
  onClose: () => void;
  palette: Palette;
}) {
  if (!bill) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="w-[min(480px,94vw)] rounded-2xl shadow-xl p-5 bg-white"
        style={{ color: palette.black1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Detail Tagihan</h3>
          <button
            className="text-sm px-2 py-1 rounded-lg"
            style={{ color: palette.black2 }}
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
        <div className="grid gap-3 text-sm">
          <InfoRow label="Nama" value={bill.student_name} />
          <InfoRow label="ID" value={bill.student_id} />
          <InfoRow label="Kelas" value={bill.class_name ?? "-"} />
          <InfoRow label="Nominal" value={idr(bill.amount)} />
          <InfoRow
            label="Jatuh Tempo"
            value={new Date(bill.due_date).toLocaleDateString("id-ID")}
          />
          <InfoRow
            label="Status"
            value={
              <Badge
                palette={palette}
                variant={
                  bill.status === "paid"
                    ? "success"
                    : bill.status === "unpaid"
                      ? "outline"
                      : "warning"
                }
              >
                {bill.status === "paid"
                  ? "Lunas"
                  : bill.status === "unpaid"
                    ? "Belum Bayar"
                    : "Terlambat"}
              </Badge>
            }
          />
        </div>
      </div>
    </div>
  );
}

function SppTagihModal({
  bill,
  onClose,
  palette,
}: {
  bill: SppBillRow | null;
  onClose: () => void;
  palette: Palette;
}) {
  if (!bill) return null;

  const handleSend = () => {
    alert(`Notifikasi tagihan dikirim ke ${bill.student_name}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="w-[min(420px,94vw)] rounded-2xl shadow-xl p-5 bg-white"
        style={{ color: palette.black1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3">Tagih SPP</h3>
        <p className="text-sm mb-4">
          Kirim notifikasi penagihan kepada{" "}
          <span className="font-medium">{bill.student_name}</span> untuk nominal{" "}
          <span className="font-medium">{idr(bill.amount)}</span>?
        </p>
        <div className="flex justify-end gap-2">
          <Btn palette={palette} variant="ghost" onClick={onClose}>
            Batal
          </Btn>
          <Btn palette={palette} onClick={handleSend}>
            Kirim Tagihan
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ================= Helpers ================= */
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm opacity-70">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
