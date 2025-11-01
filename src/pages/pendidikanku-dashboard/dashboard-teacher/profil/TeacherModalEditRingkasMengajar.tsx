import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import {
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

type InformasiMengajarData = {
  activity: string;
  rating: number;
  totalStudents: number;
  experience: number;
  isActive: boolean;
};

type ModalEditInformasiMengajarProps = {
  open: boolean;
  onClose: () => void;
  initial: InformasiMengajarData;
  onSubmit: (data: InformasiMengajarData) => void;
  palette: Palette;
  teacherId?: string; // optional untuk identifikasi guru
};

const ModalEditInformasiMengajar: React.FC<ModalEditInformasiMengajarProps> = ({
  open,
  onClose,
  initial,
  onSubmit,
  palette,
  teacherId,
}) => {
  const [form, setForm] = useState<InformasiMengajarData>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const set = (k: keyof InformasiMengajarData, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // bentuk payload sesuai struktur backend
      const payload = {
        user_teacher_activity: form.activity,
        user_teacher_rating: form.rating,
        user_teacher_total_students: form.totalStudents,
        user_teacher_experience_years: form.experience,
        user_teacher_is_active: form.isActive,
      };

      // panggil endpoint PATCH
      await api.patch(`/api/u/user-teachers/update`, {
        ...(teacherId ? { user_teacher_id: teacherId } : {}),
        ...payload,
      });

      // update parent data
      onSubmit(form);
      onClose();
    } catch (err: any) {
      console.error("❌ Gagal update data guru:", err);
      setError(err?.response?.data?.message || "Gagal memperbarui data guru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* modal */}
      <div
        className="relative w-full max-w-lg rounded-xl border p-5 bg-white max-h-[90vh] overflow-y-auto"
        style={{ borderColor: palette.silver1, color: palette.black1 }}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base">Edit Informasi Mengajar</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* error */}
        {error && (
          <div className="text-red-600 text-sm mb-3 border border-red-200 rounded-md p-2 bg-red-50">
            {error}
          </div>
        )}

        {/* form */}
        <div className="space-y-4 text-sm">
          {/* Kegiatan */}
          <div>
            <label className="block mb-1 font-medium">Kegiatan Mengajar</label>
            <textarea
              value={form.activity}
              onChange={(e) => set("activity", e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
              style={{ borderColor: palette.silver1 }}
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block mb-1 font-medium">Rating (0 - 5)</label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={5}
              value={form.rating}
              onChange={(e) => set("rating", Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              style={{ borderColor: palette.silver1 }}
            />
          </div>

          {/* Total siswa */}
          <div>
            <label className="block mb-1 font-medium">Total Siswa</label>
            <input
              type="number"
              value={form.totalStudents}
              onChange={(e) => set("totalStudents", Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              style={{ borderColor: palette.silver1 }}
            />
          </div>

          {/* Pengalaman */}
          <div>
            <label className="block mb-1 font-medium">Pengalaman (tahun)</label>
            <input
              type="number"
              value={form.experience}
              onChange={(e) => set("experience", Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              style={{ borderColor: palette.silver1 }}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={form.isActive ? "true" : "false"}
              onChange={(e) => set("isActive", e.target.value === "true")}
              className="w-full border rounded-lg px-3 py-2 bg-transparent"
              style={{ borderColor: palette.silver1 }}
            >
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* footer */}
        <div className="flex justify-end gap-2 mt-4">
          <Btn
            palette={palette}
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Btn>
          <Btn palette={palette} onClick={handleSave} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Menyimpan...
              </span>
            ) : (
              "Simpan"
            )}
          </Btn>
        </div>
      </div>
    </div>
  );
};

export default ModalEditInformasiMengajar;
