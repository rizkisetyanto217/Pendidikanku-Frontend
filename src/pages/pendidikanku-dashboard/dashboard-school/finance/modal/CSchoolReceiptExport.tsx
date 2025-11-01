import React, { useState } from "react";
import {
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { paymentId?: string; format: string }) => void;
  palette: Palette;
  paymentOptions: { value: string; label: string }[];
}

const SchoolReceiptExport: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  palette,
  paymentOptions,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  if (!open) return null;

  const handlePrint = () => {
    if (!selectedPayment) return;
    onSubmit({ paymentId: selectedPayment, format: "pdf" }); // 👈 langsung ke PDF
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-5"
        style={{
          backgroundColor: palette.white1,
          color: palette.black1,
        }}
      >
        <h2 className="text-lg font-semibold mb-1">
          Cetak Kuitansi Pembayaran
        </h2>
        <p className="text-sm" style={{ color: palette.black2 }}>
          Pilih pembayaran untuk langsung mengunduh kuitansi dalam format PDF.
        </p>

        {/* Select pembayaran */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Pilih Pembayaran
          </label>
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            style={{
              borderColor: palette.silver1,
              backgroundColor: palette.white2,
            }}
          >
            <option value="">-- Pilih Pembayaran --</option>
            {paymentOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol aksi */}
        <div className="flex justify-end gap-2 pt-3">
          <Btn palette={palette} variant="ghost" onClick={onClose}>
            Batal
          </Btn>
          <Btn
            palette={palette}
            onClick={handlePrint}
            disabled={!selectedPayment}
            className="inline-flex items-center gap-2"
          >
            Cetak PDF
          </Btn>
        </div>
      </div>
    </div>
  );
};

export default SchoolReceiptExport;
