import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import axios from "@/lib/axios";
import { ArrowLeft, Plus, CalendarDays } from "lucide-react";
import Swal from "sweetalert2";

/* ===== Types ===== */
type BillItem = {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "unpaid" | "paid" | "overdue";
};

type LocationState = {
  bills?: BillItem[];
  heading?: string;
};

/* ===== Small UI ===== */
interface Tagihan {
  id: string;
  nama: string;
  jumlah: number;
  status: "Lunas" | "Belum Lunas";
  tanggalJatuhTempo: string;
}

function toTagihan(b: BillItem): Tagihan {
  return {
    id: b.id,
    nama: b.title,
    jumlah: b.amount,
    status: b.status === "paid" ? "Lunas" : "Belum Lunas",
    tanggalJatuhTempo: new Date(b.dueDate).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };
}

/* ===== Modal Add/Edit ===== */
// (kode modal tetap sama seperti sebelumnya)

const InvoiceModal = ({
  open,
  onClose,
  palette,
  defaultValue,
  onSubmit,
  title,
}: any) => {
  const [nama, setNama] = useState(defaultValue?.title ?? "");
  const [jumlah, setJumlah] = useState<number>(defaultValue?.amount ?? 0);
  const [jatuhTempo, setJatuhTempo] = useState<string>(
    defaultValue?.dueDate ? defaultValue.dueDate.slice(0, 10) : ""
  );
  const [status, setStatus] = useState<BillItem["status"]>(
    defaultValue?.status ?? "unpaid"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNama(defaultValue?.title ?? "");
    setJumlah(defaultValue?.amount ?? 0);
    setJatuhTempo(
      defaultValue?.dueDate ? defaultValue.dueDate.slice(0, 10) : ""
    );
    setStatus(defaultValue?.status ?? "unpaid");
  }, [defaultValue, open]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !jatuhTempo) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi data",
        text: "Nama dan tanggal jatuh tempo wajib diisi.",
      });
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        id: defaultValue?.id,
        title: nama,
        amount: Number(jumlah) || 0,
        dueDate: new Date(jatuhTempo).toISOString(),
        status,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.35)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-4 md:p-5"
        style={{
          background: palette.white2,
          color: palette.black1,
          border: `1px solid ${palette.silver1}`,
        }}
      >
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm">Nama Tagihan</label>
            <input
              className="mt-1 w-full h-10 rounded-xl px-3 text-sm"
              style={{
                background: palette.white1,
                border: `1px solid ${palette.silver1}`,
              }}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm">Jumlah (Rp)</label>
            <input
              type="number"
              className="mt-1 w-full h-10 rounded-xl px-3 text-sm"
              style={{
                background: palette.white1,
                border: `1px solid ${palette.silver1}`,
              }}
              value={jumlah}
              onChange={(e) => setJumlah(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm">Jatuh Tempo</label>
            <input
              type="date"
              className="mt-1 w-full h-10 rounded-xl px-3 text-sm"
              style={{
                background: palette.white1,
                border: `1px solid ${palette.silver1}`,
              }}
              value={jatuhTempo}
              onChange={(e) => setJatuhTempo(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm">Status</label>
            <select
              className="mt-1 w-full h-10 rounded-xl px-3 text-sm"
              style={{
                background: palette.white1,
                border: `1px solid ${palette.silver1}`,
              }}
              value={status}
              onChange={(e) => setStatus(e.target.value as BillItem["status"])}
            >
              <option value="unpaid">Belum Lunas</option>
              <option value="paid">Lunas</option>
              <option value="overdue">Terlambat</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Btn palette={palette} variant="ghost" onClick={onClose}>
              Batal
            </Btn>
            <Btn type="submit" palette={palette} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ===== Ringkasan ===== */
const Total = ({ data, palette }: { data: Tagihan[]; palette: Palette }) => {
  const totalBelum = data
    .filter((d) => d.status !== "Lunas")
    .reduce((n, d) => n + d.jumlah, 0);
  const totalSemua = data.reduce((n, d) => n + d.jumlah, 0);
  return (
    <SectionCard palette={palette} className="p-4">
      <h3 className="text-lg font-semibold mb-3">Ringkasan Tagihan</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg" style={{ background: palette.white1 }}>
          <p className="text-sm opacity-90" style={{ color: palette.black2 }}>
            Total Tagihan
          </p>
          <p className="text-xl font-bold">
            Rp {totalSemua.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-red-50 text-center">
          <p className="text-sm text-red-600">Belum Lunas</p>
          <p className="text-xl font-bold text-red-700">
            Rp {totalBelum.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-3 rounded-lg text-center">
          <p className="text-sm opacity-70">Jumlah Tagihan</p>
          <p className="text-xl font-bold">{data.length} item</p>
        </div>
      </div>
    </SectionCard>
  );
};

/* ===== Page ===== */
export default function AllInvoices() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const { state } = useLocation() as { state: LocationState };
  const navigate = useNavigate();

  const initialBills: BillItem[] = state?.bills ?? [];
  const [items, setItems] = useState<BillItem[]>(initialBills);
  useEffect(() => setItems(initialBills), [initialBills]);

  const tagihanList: Tagihan[] = useMemo(() => items.map(toTagihan), [items]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<BillItem | null>(null);

  const handleAdd = async (payload: Omit<BillItem, "id"> & { id?: string }) => {
    const created: BillItem = {
      id: payload.id ?? String(Date.now()),
      title: payload.title,
      amount: payload.amount,
      dueDate: payload.dueDate,
      status: payload.status,
    };
    setItems((prev) => [...prev, created]);
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Tagihan berhasil ditambahkan.",
      timer: 1400,
      showConfirmButton: false,
    });
  };

  const openEditById = (id: string) => {
    const found = items.find((x) => x.id === id) ?? null;
    setSelected(found);
    setOpenEdit(true);
  };

  const handleEdit = async (
    payload: Omit<BillItem, "id"> & { id?: string }
  ) => {
    if (!selected) return;
    const id = selected.id;
    const updated: BillItem = { ...payload, id };
    setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    Swal.fire({
      icon: "success",
      title: "Tersimpan",
      text: "Perubahan tagihan berhasil disimpan.",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleDelete = async (id: string) => {
    const target = items.find((x) => x.id === id);
    if (!target) return;
    const res = await Swal.fire({
      title: "Hapus tagihan?",
      text: `Tagihan "${target.title}" akan dihapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });
    if (!res.isConfirmed) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
    Swal.fire({
      icon: "success",
      title: "Terhapus",
      text: `Tagihan "${target.title}" telah dihapus.`,
      timer: 1200,
      showConfirmButton: false,
    });
  };

  return (
    <div
      className="w-full transition-colors duration-200"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* Modal Add & Edit */}
      <InvoiceModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        palette={palette}
        title="Tambah Tagihan"
        onSubmit={handleAdd}
      />
      <InvoiceModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelected(null);
        }}
        palette={palette}
        defaultValue={selected ?? undefined}
        title={`Edit Tagihan${selected ? `: ${selected.title}` : ""}`}
        onSubmit={handleEdit}
      />

      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col space-y-6">
          {/* ===== Header ===== */}
          <div className="flex items-center justify-between">
            <div className="font-semibold text-lg flex items-center">
              <div className="items-center md:flex">
                <Btn
                  palette={palette}
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="cursor-pointer mr-3"
                >
                  <ArrowLeft size={20} />
                </Btn>
              </div>
              <h1 className="items-center md:flex">Tagihan</h1>
            </div>

            <Btn palette={palette} onClick={() => setOpenAdd(true)}>
              <Plus size={18} className="mr-1" /> Tambah
            </Btn>
          </div>

          {/* ===== Ringkasan ===== */}
          <Total data={tagihanList} palette={palette} />

          {/* ===== Daftar Tagihan (Card) ===== */}
          <SectionCard palette={palette}>
            <div
              className="p-4 border-b"
              style={{ borderColor: palette.silver1 }}
            >
              <h2 className="text-xl font-semibold">Daftar Tagihan</h2>
              <p className="text-sm opacity-90 mt-1">
                Berikut adalah daftar semua tagihan sekolah
              </p>
            </div>

            <div className="p-4 space-y-3">
              {tagihanList.length > 0 ? (
                tagihanList.map((t) => (
                  <div
                    key={t.id}
                    className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    style={{
                      borderColor: palette.silver1,
                      background: palette.white1,
                    }}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">{t.nama}</h3>
                      <p className="text-sm mt-1 opacity-80 flex items-center gap-1">
                        <CalendarDays size={14} /> {t.tanggalJatuhTempo}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${
                          t.status === "Lunas"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {t.status}
                      </span>
                      <p className="font-semibold text-sm">
                        Rp {t.jumlah.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:ml-4">
                      <Btn
                        size="sm"
                        variant="ghost"
                        palette={palette}
                        onClick={() => openEditById(t.id)}
                      >
                        Edit
                      </Btn>
                      <Btn
                        size="sm"
                        variant="destructive"
                        palette={palette}
                        onClick={() => handleDelete(t.id)}
                      >
                        Hapus
                      </Btn>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 opacity-70">
                  Tidak ada tagihan yang ditemukan.
                </p>
              )}
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
