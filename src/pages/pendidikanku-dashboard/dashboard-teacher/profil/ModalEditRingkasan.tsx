// src/pages/sekolahislamku/pages/teacher/ModalEditRingkasan.tsx
import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import {
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/Primitives";

type RingkasanData = {
  greeting: string;
  shortBio: string;
  subjects: string[];
};

type ModalEditRingkasanProps = {
  open: boolean;
  onClose: () => void;
  initial: RingkasanData;
  onSubmit: () => void; // callback untuk refresh data
  palette: Palette;
  teacherId?: string; // optional untuk identifikasi guru
};

const ModalEditRingkasan: React.FC<ModalEditRingkasanProps> = ({
  open,
  onClose,
  initial,
  onSubmit,
  palette,
  teacherId,
}) => {
  const [form, setForm] = useState<RingkasanData>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (field: keyof RingkasanData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validasi input
      if (!form.greeting.trim()) {
        setError("Salam pembuka tidak boleh kosong");
        return;
      }

      if (!form.shortBio.trim()) {
        setError("Bio singkat tidak boleh kosong");
        return;
      }

      if (form.subjects.length === 0 || !form.subjects[0]) {
        setError("Mata pelajaran tidak boleh kosong");
        return;
      }

      // Bentuk payload sesuai struktur backend
      const payload = {
        user_teacher_greeting: form.greeting,
        user_teacher_short_bio: form.shortBio,
        user_teacher_specialties: form.subjects.filter((s) => s.trim() !== ""),
      };

      // Panggil endpoint PATCH untuk update
      await api.patch(`/api/u/user-teachers/update`, {
        ...(teacherId ? { user_teacher_id: teacherId } : {}),
        ...payload,
      });

      console.log("✅ Data ringkasan berhasil diperbarui");

      // Callback untuk refresh data parent
      onSubmit();
      onClose();
    } catch (err: any) {
      console.error("❌ Gagal update data ringkasan:", err);
      setError(
        err?.response?.data?.message || "Gagal memperbarui data ringkasan."
      );
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
          <h2 className="font-semibold text-base">Edit Ringkasan</h2>
          <button onClick={onClose} disabled={loading}>
            <X size={18} />
          </button>
        </div>

        {/* error alert */}
        {error && (
          <div className="text-red-600 text-sm mb-3 border border-red-200 rounded-md p-2 bg-red-50">
            {error}
          </div>
        )}

        {/* form */}
        <div className="space-y-3 text-sm">
          {/* Salam */}
          <div>
            <label className="block mb-1 font-medium">
              Salam Pembuka <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.greeting}
              onChange={(e) => handleChange("greeting", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              rows={3}
              style={{ borderColor: palette.silver1 }}
              placeholder="Contoh: Assalamu'alaikum warahmatullahi wabarakatuh"
              disabled={loading}
            />
          </div>

          {/* Bio Singkat */}
          <div>
            <label className="block mb-1 font-medium">
              Bio Singkat <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.shortBio}
              onChange={(e) => handleChange("shortBio", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              rows={3}
              style={{ borderColor: palette.silver1 }}
              placeholder="Contoh: Pengajar fiqih dasar dengan pengalaman 5 tahun"
              disabled={loading}
            />
          </div>

          {/* Subjects */}
          <div>
            <label className="block mb-1 font-medium">
              Mata Pelajaran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Pisahkan dengan koma, misal: Fiqih, Adab, Tauhid"
              value={form.subjects.join(", ")}
              onChange={(e) =>
                handleChange(
                  "subjects",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
              style={{ borderColor: palette.silver1 }}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Masukkan mata pelajaran yang Anda ajarkan, pisahkan dengan koma
            </p>
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

export default ModalEditRingkasan;
