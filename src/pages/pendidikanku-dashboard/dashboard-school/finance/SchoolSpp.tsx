// src/pages/sekolahislamku/pages/finance/SchoolSpp.tsx
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";

// Theme & utils
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";

// UI primitives
import {
  Btn,
  Badge,
  SectionCard,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

import {
  DataTable,
  SearchBar,
  PaginationBar,
  PerPageSelect,
  useOffsetLimit,
} from "@/pages/pendidikanku-dashboard/components/common/CDataViewKit";

import {
  BarChart2,
  Filter as FilterIcon,
  RefreshCcw,
  Download,
  ArrowLeft,
} from "lucide-react";

/* ================= Helpers ================= */
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

/* ================= Page ================= */
const SchoolSpp: React.FC = () => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  const today = new Date();
  const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  // filter state
  const [month, setMonth] = useState<string>(ym);
  const [kelas, setKelas] = useState<string>("");
  const [status, setStatus] = useState<SppStatus | "semua">("semua");
  const [q, setQ] = useState<string>("");

  // pagination
  const billsQ = useQuery({
    queryKey: ["spp-bills", { month, kelas, status, q }],
    queryFn: async () => {
      const dummy = Array.from({ length: 50 }).map((_, i) => ({
        id: `spp-${i + 1}`,
        student_id: `S-${1000 + i}`,
        student_name: `Siswa ${i + 1}`,
        class_name: ["1A", "1B", "2A", "3A"][i % 4],
        amount: 150000 + (i % 3) * 50000,
        due_date: new Date(
          today.getFullYear(),
          today.getMonth(),
          20
        ).toISOString(),
        status: (["unpaid", "paid", "overdue"] as SppStatus[])[i % 3],
      }));
      return { list: dummy, classes: ["1A", "1B", "2A", "3A"] };
    },
  });

  const bills = billsQ.data?.list ?? [];
  const classes = billsQ.data?.classes ?? [];

  const {
    offset,
    limit,
    pageStart,
    pageEnd,
    canPrev,
    canNext,
    handlePrev,
    handleNext,
    setLimit,
  } = useOffsetLimit(bills.length, 10);

  const pagedBills = useMemo(
    () => bills.slice(offset, offset + limit),
    [bills, offset, limit]
  );

  /* ================= Columns ================= */
  const columns = useMemo(
    () => [
      {
        key: "student_name",
        header: "Siswa",
        cell: (r: SppBillRow) => (
          <div className="font-medium">{r.student_name}</div>
        ),
      },
      {
        key: "class_name",
        header: "Kelas",
        cell: (r: SppBillRow) => r.class_name ?? "-",
      },
      {
        key: "amount",
        header: "Nominal",
        cell: (r: SppBillRow) => idr(r.amount),
      },
      {
        key: "due_date",
        header: "Jatuh Tempo",
        cell: (r: SppBillRow) =>
          new Date(r.due_date).toLocaleDateString("id-ID"),
      },
      {
        key: "status",
        header: "Status",
        cell: (r: SppBillRow) => (
          <>
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
          </>
        ),
      },
      {
        key: "actions",
        header: "Aksi",
        className: "text-right",
        cell: (r: SppBillRow) => (
          <div className="flex justify-end gap-2">
            <Btn
              palette={palette}
              size="sm"
              variant="outline"
              onClick={() => alert(`Detail tagihan ${r.student_name}`)}
            >
              Detail
            </Btn>
            {r.status !== "paid" && (
              <Btn
                palette={palette}
                size="sm"
                onClick={() =>
                  alert(`Kirim notifikasi tagihan ke ${r.student_name}`)
                }
              >
                Tagih
              </Btn>
            )}
          </div>
        ),
      },
    ],
    [palette]
  );

  /* ================= Render ================= */
  return (
    <div
      className="w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
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
            >
              <RefreshCcw size={16} className="mr-1" /> Muat Ulang
            </Btn>
          </div>
        </div>

        {/* Filter Section */}
        <SectionCard palette={palette}>
          <div className="p-4 md:p-5 pb-2 font-medium flex items-center gap-2">
            <FilterIcon size={18} /> Filter
          </div>
          <div className="px-4 md:px-5 pb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <div className="text-sm mb-1" style={{ color: palette.black2 }}>
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
            <div>
              <div className="text-sm mb-1" style={{ color: palette.black2 }}>
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
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-sm mb-1" style={{ color: palette.black2 }}>
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
            <div className="md:col-span-2">
              <div className="text-sm mb-1" style={{ color: palette.black2 }}>
                Cari siswa/ID
              </div>
              <SearchBar
                palette={palette}
                value={q}
                onChange={setQ}
                placeholder="Ketik nama siswa…"
              />
            </div>
          </div>
        </SectionCard>

        {/* Table Section */}
        <SectionCard palette={palette} className="mt-6">
          <div className="p-4 md:p-5 pb-2 flex items-center justify-between">
            <div className="font-medium">Daftar SPP</div>
            <Btn palette={palette} variant="outline" size="sm">
              <Download size={16} /> Export
            </Btn>
          </div>

          <DataTable
            palette={palette}
            columns={columns}
            rows={pagedBills}
            zebra
            emptyState="Belum ada tagihan."
          />

          <PaginationBar
            palette={palette}
            pageStart={pageStart}
            pageEnd={pageEnd}
            total={bills.length}
            canPrev={canPrev}
            canNext={canNext}
            onPrev={handlePrev}
            onNext={handleNext}
            rightExtra={
              <PerPageSelect
                palette={palette}
                value={limit}
                onChange={setLimit}
              />
            }
          />
        </SectionCard>
      </main>
    </div>
  );
};

export default SchoolSpp;
