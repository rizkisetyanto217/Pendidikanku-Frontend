// src/pages/sekolahislamku/pages/finance/SchoolSpp.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";

// UI primitives
import {
  SectionCard,
  Btn,
  Badge,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

// Common DataViewKit utilities
import {
  useOffsetLimit,
  PaginationBar,
  DataTable,
  type Column,
  CardGrid,
  SearchBar,
  PerPageSelect,
} from "@/pages/pendidikanku-dashboard/components/common/CDataViewKit";

// Icons
import {
  Filter as FilterIcon,
  RefreshCcw,
  Download,
  ArrowLeft,
  Users,
  Info,
} from "lucide-react";
import { useTopBar } from "../../components/home/CUseTopBar";

/* ===================== Types & Helpers ===================== */
type SppStatus = "unpaid" | "paid" | "overdue";

interface SppBillRow {
  id: string;
  student_name: string;
  class_name: string;
  amount: number;
  due_date: string;
  status: SppStatus;
}

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

/* ===================== Page ===================== */
const SchoolSpp: React.FC = () => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  const { setTopBar, resetTopBar } = useTopBar();
  useEffect(() => {
    setTopBar({ mode: "back", title: "SPP Murid" });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  const today = new Date();
  const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  const [month, setMonth] = useState(ym);
  const [kelas, setKelas] = useState("");
  const [status, setStatus] = useState<SppStatus | "semua">("semua");
  const [q, setQ] = useState("");

  // Dummy Query
  const billsQ = useQuery({
    queryKey: ["spp-bills", { month, kelas, status, q }],
    queryFn: async () => {
      const dummy: SppBillRow[] = Array.from({ length: 45 }).map((_, i) => ({
        id: `spp-${i + 1}`,
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
      return {
        list: dummy,
        classes: ["1A", "1B", "2A", "3A"],
      };
    },
  });

  const bills = billsQ.data?.list ?? [];
  const classes = billsQ.data?.classes ?? [];

  // Filter
  const filtered = useMemo(() => {
    return bills.filter((b) => {
      if (kelas && b.class_name !== kelas) return false;
      if (status !== "semua" && b.status !== status) return false;
      if (q && !b.student_name.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [bills, kelas, status, q]);

  // Pagination
  const total = filtered.length;
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

  const pageRows = filtered.slice(offset, offset + limit);

  // Columns
  const columns: Column<SppBillRow>[] = useMemo(
    () => [
      {
        key: "student_name",
        header: "Nama Siswa",
        cell: (r) => <span className="font-medium">{r.student_name}</span>,
      },
      { key: "class_name", header: "Kelas", cell: (r) => r.class_name },
      { key: "amount", header: "Nominal", cell: (r) => idr(r.amount) },
      { key: "due_date", header: "Jatuh Tempo", cell: (r) => dateFmt(r.due_date) },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <Badge
            palette={palette}
            variant={
              r.status === "paid"
                ? "success"
                : r.status === "unpaid"
                ? "outline"
                : "warning"
            }
          >
            {r.status === "paid"
              ? "Lunas"
              : r.status === "unpaid"
              ? "Belum Bayar"
              : "Terlambat"}
          </Badge>
        ),
      },
    ],
    [palette]
  );

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
        <div className="hidden md:flex items-center gap-2 font-semibold order-1">
          <Btn
            palette={palette}
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          >
            <ArrowLeft size={18} />
          </Btn>
         <h1>SPP Murid</h1>
        </div>

        <div className="order-3 sm:order-2 w-full sm:w-auto flex-1 min-w-0">
          <SearchBar
            palette={palette}
            value={q}
            onChange={setQ}
            placeholder="Cari nama siswa…"
            debounceMs={400}
            className="w-full"
            rightExtra={
              <PerPageSelect palette={palette} value={limit} onChange={setLimit} />
            }
          />
        </div>
      </div>

      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6 p-4 md:p-5">
          {/* ===== Filter Section ===== */}
          <SectionCard palette={palette}>
            <div
              className="p-4 md:p-5 pb-2 border-b flex items-center gap-2 font-semibold"
              style={{ borderColor: palette.silver1 }}
            >
              <FilterIcon size={18} color={palette.quaternary} /> Filter
            </div>

            <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </div>
          </SectionCard>

          {/* ===== Data Section ===== */}
          <SectionCard palette={palette}>
            <div
              className="p-4 md:p-5 pb-2 border-b flex items-center justify-between"
              style={{ borderColor: palette.silver1 }}
            >
              <div className="font-semibold flex items-center gap-2">
                <Users size={18} color={palette.quaternary} /> Daftar SPP
              </div>
              <div className="text-sm" style={{ color: palette.black2 }}>
                {total} total
              </div>
            </div>

            <div className="p-4 md:p-5">
              {billsQ.isLoading ? (
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Info size={16} /> Memuat data SPP...
                </div>
              ) : total === 0 ? (
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Info size={16} /> Tidak ada data tagihan.
                </div>
              ) : (
                <>
                  {/* Mobile: Cards */}
                  <div className="md:hidden">
                    <CardGrid<SppBillRow>
                      items={pageRows}
                      renderItem={(r) => (
                        <div
                          key={r.id}
                          className="rounded-2xl border p-4 flex flex-col gap-2"
                          style={{
                            borderColor: palette.silver1,
                            background: palette.white1,
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-base">
                                {r.student_name}
                              </div>
                              <div className="text-sm opacity-70">
                                Kelas {r.class_name}
                              </div>
                            </div>
                            <Badge
                              palette={palette}
                              variant={
                                r.status === "paid"
                                  ? "success"
                                  : r.status === "unpaid"
                                  ? "outline"
                                  : "warning"
                              }
                            >
                              {r.status === "paid"
                                ? "Lunas"
                                : r.status === "unpaid"
                                ? "Belum Bayar"
                                : "Terlambat"}
                            </Badge>
                          </div>

                          <div className="text-sm">
                            Jatuh Tempo: {dateFmt(r.due_date)}
                          </div>
                          <div className="font-semibold text-right">
                            {idr(r.amount)}
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  {/* Desktop: Table */}
                  <div className="hidden md:block">
                    <DataTable<SppBillRow>
                      palette={palette}
                      columns={columns}
                      rows={pageRows}
                      minWidth={720}
                    />
                  </div>

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
                    rightExtra={
                      <PerPageSelect
                        palette={palette}
                        value={limit}
                        onChange={setLimit}
                      />
                    }
                  />
                </>
              )}
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
};

export default SchoolSpp;
