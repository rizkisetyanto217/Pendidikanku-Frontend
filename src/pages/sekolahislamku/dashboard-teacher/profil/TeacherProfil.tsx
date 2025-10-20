import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import {
  SectionCard,
  Btn,
  Badge,
  type Palette,
} from "@/pages/sekolahislamku/components/ui/Primitives";
import {
  MessageCircle,
  Camera,
  BookOpen,
  MapPin,
  GraduationCap,
  Calendar,
} from "lucide-react";

/* ================= Date/Time Utils ================ */
const atLocalNoon = (d: Date) => {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x;
};

const toLocalNoonISO = (d: Date) => atLocalNoon(d).toISOString();

const normalizeISOToLocalNoon = (iso?: string) =>
  iso ? toLocalNoonISO(new Date(iso)) : undefined;

const fmtLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

const hijriLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

/* ==========================================
   MAIN COMPONENT
========================================== */
export default function TeacherProfil() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState<any>(null);
  const [form, setForm] = useState<any>({
    user_teacher_name: "",
    user_teacher_field: "",
    user_teacher_short_bio: "",
    user_teacher_long_bio: "",
    user_teacher_greeting: "",
    user_teacher_education: "",
    user_teacher_activity: "",
    user_teacher_experience_years: 0,
    user_teacher_gender: "male",
    user_teacher_location: "",
    user_teacher_city: "",
    user_teacher_specialties: [],
    user_teacher_certificates: [],
    user_teacher_instagram_url: "",
    user_teacher_whatsapp_url: "",
    user_teacher_youtube_url: "",
    user_teacher_linkedin_url: "",
    user_teacher_github_url: "",
    user_teacher_telegram_username: "",
    user_teacher_title_prefix: "",
    user_teacher_title_suffix: "",
    user_teacher_is_verified: false,
    user_teacher_is_active: true,
  });

  const TODAY_ISO =
    normalizeISOToLocalNoon(new Date().toISOString()) ??
    toLocalNoonISO(new Date());

  const getInitials = (name: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "U";

  /* ======================================================
     FETCH DATA
  ====================================================== */
  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/u/user-teachers/list");
      const items = res.data?.data?.items || [];
      setTeacher(items.length > 0 ? items[0] : null);
    } catch (err) {
      console.error("❌ Gagal ambil data guru:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  /* ======================================================
     CREATE TEACHER PROFILE
  ====================================================== */
  const handleCreateTeacher = async () => {
    try {
      setLoading(true);
      await api.post("/api/u/user-teachers", form);
      await fetchTeacherData();
    } catch (err) {
      console.error("❌ Gagal membuat profil guru:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     UI - FORM CREATE
  ====================================================== */
  const renderCreateForm = () => (
    <div className="flex-1 flex flex-col space-y-6 min-w-0">
      <SectionCard palette={palette}>
        <div className="p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-6">Buat Profil Guru</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={form.user_teacher_name}
                onChange={(e) =>
                  setForm({ ...form, user_teacher_name: e.target.value })
                }
                className="w-full border rounded-lg p-3"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                  color: palette.black1,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bidang</label>
              <input
                type="text"
                placeholder="Contoh: Fiqih, Tahfiz"
                value={form.user_teacher_field}
                onChange={(e) =>
                  setForm({ ...form, user_teacher_field: e.target.value })
                }
                className="w-full border rounded-lg p-3"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                  color: palette.black1,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Bio Singkat
              </label>
              <textarea
                placeholder="Deskripsi singkat tentang Anda"
                value={form.user_teacher_short_bio}
                onChange={(e) =>
                  setForm({ ...form, user_teacher_short_bio: e.target.value })
                }
                rows={3}
                className="w-full border rounded-lg p-3"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                  color: palette.black1,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Bio Lengkap
              </label>
              <textarea
                placeholder="Ceritakan lebih detail tentang pengalaman dan keahlian Anda"
                value={form.user_teacher_long_bio}
                onChange={(e) =>
                  setForm({ ...form, user_teacher_long_bio: e.target.value })
                }
                rows={5}
                className="w-full border rounded-lg p-3"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                  color: palette.black1,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Salam Pembuka
              </label>
              <input
                type="text"
                placeholder="Assalamualaikum..."
                value={form.user_teacher_greeting}
                onChange={(e) =>
                  setForm({ ...form, user_teacher_greeting: e.target.value })
                }
                className="w-full border rounded-lg p-3"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                  color: palette.black1,
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pendidikan
                </label>
                <input
                  type="text"
                  placeholder="LIPIA 2018; Pesantren X"
                  value={form.user_teacher_education}
                  onChange={(e) =>
                    setForm({ ...form, user_teacher_education: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                  style={{
                    borderColor: palette.silver1,
                    background: palette.white1,
                    color: palette.black1,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Kegiatan Mengajar
                </label>
                <input
                  type="text"
                  placeholder="Mengajar di..."
                  value={form.user_teacher_activity}
                  onChange={(e) =>
                    setForm({ ...form, user_teacher_activity: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                  style={{
                    borderColor: palette.silver1,
                    background: palette.white1,
                    color: palette.black1,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tahun Pengalaman
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.user_teacher_experience_years}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      user_teacher_experience_years: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg p-3"
                  style={{
                    borderColor: palette.silver1,
                    background: palette.white1,
                    color: palette.black1,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kota</label>
                <input
                  type="text"
                  placeholder="Jakarta"
                  value={form.user_teacher_city}
                  onChange={(e) =>
                    setForm({ ...form, user_teacher_city: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                  style={{
                    borderColor: palette.silver1,
                    background: palette.white1,
                    color: palette.black1,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Provinsi
                </label>
                <input
                  type="text"
                  placeholder="DKI Jakarta"
                  value={form.user_teacher_location}
                  onChange={(e) =>
                    setForm({ ...form, user_teacher_location: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                  style={{
                    borderColor: palette.silver1,
                    background: palette.white1,
                    color: palette.black1,
                  }}
                />
              </div>
            </div>

            <div
              className="flex justify-end gap-3 mt-6 pt-4 border-t"
              style={{ borderColor: palette.silver1 }}
            >
              <Btn
                palette={palette}
                variant="outline"
                onClick={() =>
                  setForm({
                    user_teacher_name: "",
                    user_teacher_field: "",
                    user_teacher_short_bio: "",
                    user_teacher_long_bio: "",
                    user_teacher_greeting: "",
                    user_teacher_education: "",
                    user_teacher_activity: "",
                    user_teacher_experience_years: 0,
                    user_teacher_gender: "male",
                    user_teacher_location: "",
                    user_teacher_city: "",
                    user_teacher_specialties: [],
                    user_teacher_certificates: [],
                    user_teacher_instagram_url: "",
                    user_teacher_whatsapp_url: "",
                    user_teacher_youtube_url: "",
                    user_teacher_linkedin_url: "",
                    user_teacher_github_url: "",
                    user_teacher_telegram_username: "",
                    user_teacher_title_prefix: "",
                    user_teacher_title_suffix: "",
                    user_teacher_is_verified: false,
                    user_teacher_is_active: true,
                  })
                }
              >
                Reset
              </Btn>
              <Btn
                palette={palette}
                onClick={handleCreateTeacher}
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Profil Guru"}
              </Btn>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  /* ======================================================
     UI - TAMPIL DATA
  ====================================================== */
  const renderProfileView = () => (
    <div className="flex-1 flex flex-col space-y-6 min-w-0">
      {/* Header Card dengan Avatar */}
      <SectionCard palette={palette}>
        <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-white text-2xl font-semibold overflow-hidden"
              style={{ backgroundColor: palette.primary }}
            >
              {teacher.user_teacher_avatar_url ? (
                <img
                  src={teacher.user_teacher_avatar_url}
                  alt={teacher.user_teacher_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(teacher.user_teacher_name)
              )}
            </div>
            <button
              className="absolute -bottom-1 -right-1 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              style={{ backgroundColor: palette.primary }}
            >
              <Camera size={18} />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-semibold text-xl md:text-2xl">
                  {teacher.user_teacher_title_prefix}{" "}
                  {teacher.user_teacher_name}{" "}
                  {teacher.user_teacher_title_suffix}
                </h2>
                <p className="text-base mt-1" style={{ color: palette.black2 }}>
                  {teacher.user_teacher_field}
                </p>
              </div>
              <Badge
                palette={palette}
                // variant={teacher.user_teacher_is_active ? "success" : "neutral"}
              >
                {teacher.user_teacher_is_active ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>

            <div
              className="mt-4 flex flex-wrap gap-4 text-sm"
              style={{ color: palette.black2 }}
            >
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>
                  {teacher.user_teacher_city}, {teacher.user_teacher_location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>
                  {teacher.user_teacher_experience_years} tahun pengalaman
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Grid 2 Kolom: Salam & Info */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Salam Pembuka */}
        <SectionCard palette={palette}>
          <div className="p-4 md:p-5 h-full">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{
                  background: palette.white3,
                  color: palette.quaternary,
                }}
              >
                <MessageCircle size={18} />
              </div>
              <h3 className="font-semibold text-base">Salam Pembuka</h3>
            </div>
            <p
              className="italic leading-relaxed"
              style={{ color: palette.black2 }}
            >
              "{teacher.user_teacher_greeting}"
            </p>
          </div>
        </SectionCard>

        {/* Informasi Singkat */}
        <SectionCard palette={palette}>
          <div className="p-4 md:p-5 h-full">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{
                  background: palette.white3,
                  color: palette.secondary,
                }}
              >
                <BookOpen size={18} />
              </div>
              <h3 className="font-semibold text-base">Informasi</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <GraduationCap
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: palette.primary }}
                />
                <div>
                  <span className="font-medium">Pendidikan: </span>
                  <span style={{ color: palette.black2 }}>
                    {teacher.user_teacher_education}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: palette.primary }}
                />
                <div>
                  <span className="font-medium">Kegiatan: </span>
                  <span style={{ color: palette.black2 }}>
                    {teacher.user_teacher_activity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </section>

      {/* Tentang (Full Width) */}
      <section>
        <SectionCard palette={palette}>
          <div className="p-4 md:p-5">
            <h3 className="font-semibold text-lg mb-4">Tentang</h3>
            <p
              className="leading-relaxed whitespace-pre-line"
              style={{ color: palette.black2 }}
            >
              {teacher.user_teacher_long_bio}
            </p>
          </div>
        </SectionCard>
      </section>
    </div>
  );

  /* ======================================================
     RENDER FINAL
  ====================================================== */
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* Topbar */}
      <ParentTopBar
        palette={palette}
        title="Profil Guru"
        gregorianDate={TODAY_ISO}
        hijriDate={hijriLong(TODAY_ISO)}
      />

      {/* Content + Sidebar */}
      <main className="w-full px-4 md:px-6 py-4 md:py-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
            <ParentSidebar palette={palette} />
          </aside>

          {/* Main Content */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="text-center" style={{ color: palette.silver2 }}>
                Memuat data guru...
              </div>
            </div>
          ) : teacher ? (
            renderProfileView()
          ) : (
            renderCreateForm()
          )}
        </div>
      </main>
    </div>
  );
}
