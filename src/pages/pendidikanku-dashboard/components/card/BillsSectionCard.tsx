import { Link } from "react-router-dom";
import { ChevronRight, Wallet } from "lucide-react";
import {
  SectionCard,
  Btn,
  Badge,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/Primitives";

/* ===================== Types ===================== */
export interface BillItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // ISO date string
  status: "unpaid" | "paid" | "overdue";
}

interface BillsSectionCardProps {
  palette: Palette;
  bills?: BillItem[];
  dateFmt: (iso: string) => string;
  formatIDR: (n: number) => string;

  /** prefix untuk route sekolah, contoh: `/${slug}/sekolah` */
  basePath?: string;

  /** override opsional */
  seeAllPath?: string;
  seeAllState?: unknown;
  getPayHref?: (bill: BillItem) => string;
  className?: string;
}

/* ============== Mappings ============== */
const badgeVariants = {
  unpaid: "secondary",
  overdue: "destructive",
  paid: "success",
} as const;

const statusTexts = {
  unpaid: "Belum bayar",
  overdue: "Terlambat",
  paid: "Lunas",
} as const;

const getBadgeVariant = (status: BillItem["status"]) => badgeVariants[status];
const getStatusText = (status: BillItem["status"]) => statusTexts[status];

/* ============== Empty State ============== */
const EmptyState = ({ palette }: { palette: Palette }) => (
  <div className="text-sm" style={{ color: palette.silver2 }}>
    Tidak ada tagihan yang belum dibayar. Alhamdulillah!
  </div>
);

/* ============== Single Bill Card ============== */
function BillCard({
  bill,
  palette,
  dateFmt,
  formatIDR,
  getPayHref,
}: {
  bill: BillItem;
  palette: Palette;
  dateFmt: (iso: string) => string;
  formatIDR: (n: number) => string;
  getPayHref: (bill: BillItem) => string;
}) {
  const isPaid = bill.status === "paid";

  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: palette.silver1, background: palette.white2 }}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Info Tagihan */}
        <div className="min-w-0">
          <div className="font-medium truncate">{bill.title}</div>
          <div className="text-sm" style={{ color: palette.black2 }}>
            Jatuh tempo: {dateFmt(bill.dueDate)}
          </div>
        </div>

        {/* Amount & Actions */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <div className="flex items-center gap-2 md:flex-col md:items-center md:gap-1 md:min-w-0 md:flex-1">
            <div className="text-sm font-semibold text-center">
              {formatIDR(bill.amount)}
            </div>
            <Badge
              variant={getBadgeVariant(bill.status)}
              palette={palette}
              className="w-auto text-center"
            >
              {getStatusText(bill.status)}
            </Badge>
          </div>

          <Link
            to={getPayHref(bill)}
            state={{
              bill,
              parentName: undefined,
              hijriDate: undefined,
              gregorianDate: undefined,
            }}
            className="w-full md:w-auto md:flex-shrink-0"
            aria-disabled={isPaid}
            onClick={(e) => {
              if (isPaid) e.preventDefault();
            }}
          >
            <Btn
              size="sm"
              variant="outline"
              palette={palette}
              className="w-full md:w-auto md:px-6 md:mt-2"
              disabled={isPaid}
            >
              {isPaid ? "Sudah dibayar" : "Detail"}
            </Btn>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ============== Main Section ============== */
export default function BillsSectionCard({
  palette,
  bills = [],
  dateFmt,
  formatIDR,
  basePath = "",
  seeAllPath,
  seeAllState,
  getPayHref,
  className = "",
}: BillsSectionCardProps) {
  const unpaidBills = bills.filter((bill) => bill.status !== "paid");

  const _seeAllPath =
    seeAllPath ?? (basePath ? `${basePath}/all-invoices` : `all-invoices`);
  const _getPayHref =
    getPayHref ??
    ((b: BillItem) =>
      basePath ? `${basePath}/all-invoices/${b.id}` : `all-invoices/${b.id}`);

  return (
    <SectionCard
      palette={palette}
      className={`w-full flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-3 pb-2 flex items-center justify-between">
        <div className=" pb-1 font-medium flex items-center gap-2 md:-mt-1">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center "
            style={{
              background: palette.white3,
              color: palette.quaternary,
            }}
          >
            <Wallet size={18} />
          </div>
          <h1 className="text-base font-semibold">Tagihan dan Pembayaran</h1>
        </div>

        {/* tombol hanya tampil di desktop */}
        <Link
          to={_seeAllPath}
          state={seeAllState ?? { bills, heading: "Semua Tagihan" }}
          className="hidden md:block"
        >
          <Btn
            size="sm"
            variant="ghost"
            palette={palette}
            className="flex items-center gap-1"
          >
            Lihat semua
            <ChevronRight size={16} />
          </Btn>
        </Link>
      </div>

      {/* Bills List */}
      <div className="px-4 pb-4 pt-2 space-y-3 flex-1 min-w-0">
        {unpaidBills.length === 0 ? (
          <EmptyState palette={palette} />
        ) : (
          unpaidBills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              palette={palette}
              dateFmt={dateFmt}
              formatIDR={formatIDR}
              getPayHref={_getPayHref}
            />
          ))
        )}
      </div>

      {/* tombol di bawah hanya tampil di mobile */}
      <div className="px-4 pb-4 md:hidden">
        <Link
          to={_seeAllPath}
          state={seeAllState ?? { bills, heading: "Semua Tagihan" }}
        >
          <Btn
            size="sm"
            variant="ghost"
            palette={palette}
            className="w-full flex items-center justify-center gap-1"
          >
            Lihat semua
            <ChevronRight size={16} />
          </Btn>
        </Link>
      </div>
    </SectionCard>
  );
}
