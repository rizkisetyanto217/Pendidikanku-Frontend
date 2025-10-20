// src/pages/sekolahislamku/pages/teacher/ModalEditProfilLengkap.tsx
import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import {
  Btn,
  type Palette,
} from "@/pages/sekolahislamku/components/ui/Primitives";

type ProfilLengkapData = {
  fullname: string;
  phone: string;
  email: string;
  city: string;
  location: string;
  birthPlace: string;
  birthDate: string;
  company: string;
  position: string;
  education: string;
  experience: number;
  gender: "male" | "female";
  whatsappUrl: string;
  instagramUrl: string;
};

type ModalEditProfilLengkapProps = {
  open: boolean;
  onClose: () => void;
  initial: Partial<ProfilLengkapData>;
  onSubmit: () => void; // callback untuk refresh data
  palette: Palette;
  teacherId?: string; // optional untuk identifikasi guru
};

const ModalEditProfilLengkap: React.FC<ModalEditProfilLengkapProps> = ({
  open,
  onClose,
  initial,
  onSubmit,
  palette,
  teacherId,
}) => {
  const [form, setForm] = useState<ProfilLengkapData>({
    fullname: initial.fullname || "",
    phone: initial.phone || "",
    email: initial.email || "",
    city: initial.city || "",
    location: initial.location || "",
    birthPlace: initial.birthPlace || "",
    birthDate: initial.birthDate || "",
    company: initial.company || "",
    position: initial.position || "",
    education: initial.education || "",
    experience: initial.experience || 0,
    gender: initial.gender || "male",
    whatsappUrl: initial.whatsappUrl || "",
    instagramUrl: initial.instagramUrl || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const set = (k: keyof ProfilLengkapData, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validasi input
      if (!form.fullname.trim()) {
        setError("Nama lengkap tidak boleh kosong");
        return;
      }

      // Validasi email format (optional)
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError("Format email tidak valid");
        return;
      }

      // Validasi URL WhatsApp (optional)
      if (form.whatsappUrl && !form.whatsappUrl.startsWith("https://wa.me/")) {
        setError("URL WhatsApp harus dimulai dengan https://wa.me/");
        return;
      }

      // Validasi URL Instagram (optional)
      if (
        form.instagramUrl &&
        !form.instagramUrl.startsWith("https://instagram.com/")
      ) {
        setError("URL Instagram harus dimulai dengan https://instagram.com/");
        return;
      }

      // Bentuk payload sesuai struktur backend
      const payload = {
        user_teacher_name: form.fullname,
        user_teacher_phone: form.phone || null,
        user_teacher_email: form.email || null,
        user_teacher_city: form.city || null,
        user_teacher_location: form.location || null,
        user_teacher_birth_place: form.birthPlace || null,
        user_teacher_birth_date: form.birthDate || null,
        user_teacher_company: form.company || null,
        user_teacher_field: form.position || null,
        user_teacher_education: form.education || null,
        user_teacher_experience_years: form.experience,
        user_teacher_gender: form.gender,
        user_teacher_whatsapp_url: form.whatsappUrl || null,
        user_teacher_instagram_url: form.instagramUrl || null,
      };

      // Panggil endpoint PATCH
      await api.patch(`/api/u/user-teachers/update`, {
        ...(teacherId ? { user_teacher_id: teacherId } : {}),
        ...payload,
      });

      console.log("✅ Profil lengkap berhasil diperbarui");

      // Callback untuk refresh data parent
      onSubmit();
      onClose();
    } catch (err: any) {
      console.error("❌ Gagal update profil lengkap:", err);
      setError(
        err?.response?.data?.message || "Gagal memperbarui profil lengkap."
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
        className="relative w-full max-w-2xl rounded-xl border p-5 bg-white max-h-[90vh] overflow-y-auto"
        style={{ borderColor: palette.silver1, color: palette.black1 }}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base">Edit Profil Lengkap</h2>
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
        <div className="space-y-4 text-sm">
          {/* Informasi Personal */}
          <div>
            <h3 className="font-medium mb-2">Informasi Personal</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Nama Lengkap *"
                value={form.fullname}
                onChange={(e) => set("fullname", e.target.value)}
                className="border rounded px-3 py-2"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
              />
              <input
                placeholder="Telepon (08xxx)"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="border rounded px-3 py-2"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
              />
              <input
                placeholder="Email (nama@email.com)"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="border rounded px-3 py-2"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
              />
              <select
                value={form.gender}
                onChange={(e) =>
                  set("gender", e.target.value as "male" | "female")
                }
                className="border rounded px-3 py-2 bg-transparent"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
              <input
                placeholder="Kota (Bandung)"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="border rounded px-3 py-2"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
              />
              <input
                placeholder="Provinsi/Lokasi (Jawa Barat)"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className="border rounded px-3 py-2"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
              />
              <input
                placeholder="Tempat Lahir (Jakarta)"
                value={form.birthPlace}
                onChange={(e) => set("birthPlace", e.target.value)}
                className="border rounded px-3 py-2"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
              />
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => set("birthDate", e.target.value)}
                className="border rounded px-3 py-2"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
              />
            </div>
          </div>

          {/* Informasi Profesional */}
          <div>
            <h3 className="font-medium mb-2">Informasi Profesional</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Instansi (Pesantren X)"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className="border rounded px-3 py-2"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
              />
              <input
                placeholder="Bidang/Posisi (Fiqih)"
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                className="border rounded px-3 py-2"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
              />
              <input
                placeholder="Pendidikan (S1 Syariah)"
                value={form.education}
                onChange={(e) => set("education", e.target.value)}
                className="border rounded px-3 py-2 col-span-2"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
              />
              <input
                type="number"
                placeholder="Pengalaman (tahun)"
                value={form.experience}
                onChange={(e) => set("experience", Number(e.target.value))}
                className="border rounded px-3 py-2"
                style={{ borderColor: palette.silver1 }}
                disabled={loading}
                min="0"
              />
            </div>
          </div>

          {/* Informasi Kontak */}
          <div>
            <h3 className="font-medium mb-2">
              Informasi Kontak & Sosial Media
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <input
                  placeholder="URL WhatsApp (https://wa.me/6281234567890)"
                  value={form.whatsappUrl}
                  onChange={(e) => set("whatsappUrl", e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  style={{ borderColor: palette.silver1 }}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contoh: https://wa.me/6281234567890
                </p>
              </div>
              <div>
                <input
                  placeholder="URL Instagram (https://instagram.com/username)"
                  value={form.instagramUrl}
                  onChange={(e) => set("instagramUrl", e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  style={{ borderColor: palette.silver1 }}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contoh: https://instagram.com/ust_zidan
                </p>
              </div>
            </div>
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

export default ModalEditProfilLengkap;
