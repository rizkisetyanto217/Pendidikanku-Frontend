import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import api from "@/lib/axios";

import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import {
  SectionCard,
  Badge,
  Btn,
  type Palette,
} from "@/pages/sekolahislamku/components/ui/Primitives";

import {
  ArrowLeft,
  Camera,
  Edit,
  MessageCircle,
  User,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Award,
  Star,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

import ModalEditRingkasan from "./ModalEditRingkasan";
import ModalEditProfilLengkap from "./ModalEditProfil";
import ModalEditInformasiMengajar from "./ModalEditRingkasMengajar";

/* ===== Helpers ===== */
const dateLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

const hijriWithWeekday = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

const TODAY_ISO = new Date().toISOString();

/* ===== Types ===== */
type TeacherProfilProps = {
  showBack?: boolean;
  backLabel?: string;
};

const TeacherProfil: React.FC<TeacherProfilProps> = ({
  showBack = false,
  backLabel = "Kembali",
}) => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userTeacher, setUserTeacher] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Modal States
  const [openRingkasanEdit, setOpenRingkasanEdit] = useState(false);
  const [openProfilEdit, setOpenProfilEdit] = useState(false);
  const [openMengajarEdit, setOpenMengajarEdit] = useState(false);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  /* ======================================================
     FETCH DATA GURU
  ====================================================== */
  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/u/user-teachers/list");
      const items = res.data?.data?.items || [];
      if (items.length > 0) {
        const teacher = items[0];
        setUserTeacher(teacher);
        setAvatarPreview(teacher.user_teacher_avatar_url || "");
      } else {
        setUserTeacher(null);
      }
    } catch (err) {
      console.error("❌ Gagal ambil data guru:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     CREATE DATA GURU (MANUAL TRIGGER)
  ====================================================== */
  const handleCreateTeacher = async () => {
    try {
      setLoading(true);
      const payload = {
        user_teacher_name: "Ust. Ahmad Zidan",
        user_teacher_field: "Fiqih",
        user_teacher_short_bio: "Pengajar fiqih dasar",
        user_teacher_long_bio: "Aktif mengajar kajian rutin dan fiqih harian.",
        user_teacher_greeting: "Assalamu'alaikum warahmatullahi wabarakatuh",
        user_teacher_education: "Lulusan Pesantren Al-Mubarok",
        user_teacher_activity: "Kajian rutin setiap Ahad pagi",
        user_teacher_experience_years: 5,
        user_teacher_gender: "male",
        user_teacher_location: "Jawa Barat",
        user_teacher_city: "Bandung",
        user_teacher_specialties: ["fiqih", "adab"],
        user_teacher_certificates: [{ title: "Sertifikat Dakwah", year: 2020 }],
        user_teacher_instagram_url: "https://instagram.com/ust_zidan",
        user_teacher_whatsapp_url: "https://wa.me/6281234567890",
      };

      await api.post("/api/u/user-teachers", payload);
      console.log("✅ Profil guru berhasil dibuat!");
      await fetchTeacherData();
    } catch (err) {
      console.error("❌ Gagal buat data guru:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <ParentTopBar
        palette={palette}
        title="Profil Guru"
        gregorianDate={TODAY_ISO}
        hijriDate={hijriWithWeekday(TODAY_ISO)}
        // dateFmt={dateLong(TODAY_ISO)}
        showBack
      />

      <main className="w-full px-4 md:px-6 md:py-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-7">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
            <ParentSidebar palette={palette} />
          </aside>

          {/* === Main Content === */}
          <div className="flex-1 flex flex-col space-y-8 min-w-0">
            <div className="md:flex hidden items-center gap-3">
              {showBack && (
                <Btn
                  palette={palette}
                  onClick={() => navigate(-1)}
                  variant="ghost"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft size={20} aria-label={backLabel} />
                </Btn>
              )}
              <h1 className="text-lg font-semibold">Profil Guru</h1>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-500">
                ⏳ Memuat data guru...
              </div>
            ) : !userTeacher ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <p className="text-gray-600 text-sm">
                  Kamu belum memiliki profil guru.
                </p>
                <Btn
                  palette={palette}
                  onClick={handleCreateTeacher}
                  disabled={loading}
                >
                  {loading ? "Membuat..." : "Buat Profil Guru"}
                </Btn>
              </div>
            ) : (
              <>
                {/* === Header Card === */}
                <SectionCard palette={palette}>
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      {/* Avatar */}
                      <div className="relative">
                        <div
                          className="w-24 h-24 rounded-full flex items-center justify-center text-lg font-semibold text-white overflow-hidden"
                          style={{ backgroundColor: palette.primary }}
                        >
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt={userTeacher.user_teacher_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitials(userTeacher.user_teacher_name || "U")
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("avatarInput")?.click()
                          }
                          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                          style={{ backgroundColor: palette.primary }}
                        >
                          <Camera size={16} />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-center md:text-left space-y-3">
                        <div>
                          <h1 className="text-xl font-bold">
                            {userTeacher.user_teacher_name}
                          </h1>
                          <p
                            className="text-sm font-medium mt-1"
                            style={{ color: palette.primary }}
                          >
                            {userTeacher.user_teacher_field}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          <Badge palette={palette} variant="success">
                            <CheckCircle size={14} className="mr-1" />
                            {userTeacher.user_teacher_is_active
                              ? "Aktif Mengajar"
                              : "Nonaktif"}
                          </Badge>
                          {userTeacher.user_teacher_experience_years > 0 && (
                            <Badge palette={palette} variant="default">
                              <Clock size={14} className="mr-1" />
                              {userTeacher.user_teacher_experience_years} Tahun
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* === Ringkasan & Salam === */}
                <SectionCard palette={palette}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <MessageCircle
                          size={20}
                          style={{ color: palette.primary }}
                        />
                        <h3 className="font-semibold text-lg">
                          Ringkasan Profil
                        </h3>
                      </div>
                      <Btn
                        palette={palette}
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpenRingkasanEdit(true)}
                      >
                        <Edit size={16} />
                      </Btn>
                    </div>

                    {/* Salam */}
                    <div
                      className="p-4 rounded-lg italic text-sm leading-relaxed mb-4"
                      style={{ backgroundColor: palette.silver1 + "40" }}
                    >
                      "{userTeacher.user_teacher_greeting}"
                    </div>

                    {/* Bio Singkat */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">
                        Bio Singkat
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {userTeacher.user_teacher_short_bio}
                      </p>
                    </div>

                    {/* Mata Pelajaran */}
                    {userTeacher.user_teacher_specialties?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Mata Pelajaran
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {userTeacher.user_teacher_specialties.map(
                            (subject: string, idx: number) => (
                              <Badge
                                key={idx}
                                palette={palette}
                                variant="default"
                              >
                                {subject}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>

                {/* === Profil Lengkap === */}
                <SectionCard palette={palette}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <User size={20} style={{ color: palette.primary }} />
                        <h3 className="font-semibold text-lg">
                          Profil Lengkap
                        </h3>
                      </div>
                      <Btn
                        palette={palette}
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpenProfilEdit(true)}
                      >
                        <Edit size={16} />
                      </Btn>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {/* Email */}
                      {userTeacher.user_teacher_email && (
                        <div className="flex items-start gap-3">
                          <Mail size={16} className="mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">Email</p>
                            <p className="font-medium">
                              {userTeacher.user_teacher_email}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Phone */}
                      {userTeacher.user_teacher_phone && (
                        <div className="flex items-start gap-3">
                          <Phone size={16} className="mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">Telepon</p>
                            <p className="font-medium">
                              {userTeacher.user_teacher_phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Lokasi */}
                      {userTeacher.user_teacher_city && (
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">Lokasi</p>
                            <p className="font-medium">
                              {userTeacher.user_teacher_city}
                              {userTeacher.user_teacher_location &&
                                `, ${userTeacher.user_teacher_location}`}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Pendidikan */}
                      {userTeacher.user_teacher_education && (
                        <div className="flex items-start gap-3">
                          <GraduationCap
                            size={16}
                            className="mt-1 flex-shrink-0"
                          />
                          <div>
                            <p className="text-gray-500 text-xs">Pendidikan</p>
                            <p className="font-medium">
                              {userTeacher.user_teacher_education}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Instansi */}
                      {userTeacher.user_teacher_company && (
                        <div className="flex items-start gap-3">
                          <Briefcase size={16} className="mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">Instansi</p>
                            <p className="font-medium">
                              {userTeacher.user_teacher_company}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Tempat/Tanggal Lahir */}
                      {(userTeacher.user_teacher_birth_place ||
                        userTeacher.user_teacher_birth_date) && (
                        <div className="flex items-start gap-3">
                          <Calendar size={16} className="mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">
                              Tempat, Tanggal Lahir
                            </p>
                            <p className="font-medium">
                              {userTeacher.user_teacher_birth_place}
                              {userTeacher.user_teacher_birth_date &&
                                `, ${dateLong(
                                  userTeacher.user_teacher_birth_date
                                )}`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SectionCard>

                {/* === Informasi Mengajar === */}
                <SectionCard palette={palette}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Award size={20} style={{ color: palette.primary }} />
                        <h3 className="font-semibold text-lg">
                          Informasi Mengajar
                        </h3>
                      </div>
                      <Btn
                        palette={palette}
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpenMengajarEdit(true)}
                      >
                        <Edit size={16} />
                      </Btn>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Rating */}
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: palette.silver1 + "20" }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Star
                            size={16}
                            style={{ color: palette.primary }}
                            fill={palette.primary}
                          />
                          <span className="text-xs text-gray-500">Rating</span>
                        </div>
                        <p className="text-xl font-bold">
                          {userTeacher.user_teacher_rating || 0}/5
                        </p>
                      </div>

                      {/* Total Siswa */}
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: palette.silver1 + "20" }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Users size={16} style={{ color: palette.primary }} />
                          <span className="text-xs text-gray-500">
                            Total Siswa
                          </span>
                        </div>
                        <p className="text-xl font-bold">
                          {userTeacher.user_teacher_total_students || 0}
                        </p>
                      </div>

                      {/* Pengalaman */}
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: palette.silver1 + "20" }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={16} style={{ color: palette.primary }} />
                          <span className="text-xs text-gray-500">
                            Pengalaman
                          </span>
                        </div>
                        <p className="text-xl font-bold">
                          {userTeacher.user_teacher_experience_years || 0} Tahun
                        </p>
                      </div>
                    </div>

                    {/* Kegiatan Mengajar */}
                    {userTeacher.user_teacher_activity && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-2">
                          Kegiatan Mengajar
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {userTeacher.user_teacher_activity}
                        </p>
                      </div>
                    )}
                  </div>
                </SectionCard>

                {/* === Bio Lengkap === */}
                {userTeacher.user_teacher_long_bio && (
                  <SectionCard palette={palette}>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <GraduationCap
                          size={20}
                          style={{ color: palette.primary }}
                        />
                        <h3 className="font-semibold text-lg">Bio Lengkap</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {userTeacher.user_teacher_long_bio}
                      </p>
                    </div>
                  </SectionCard>
                )}

                {/* === Sertifikat === */}
                {userTeacher.user_teacher_certificates?.length > 0 && (
                  <SectionCard palette={palette}>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Award size={20} style={{ color: palette.primary }} />
                        <h3 className="font-semibold text-lg">
                          Sertifikat & Penghargaan
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {userTeacher.user_teacher_certificates.map(
                          (cert: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 rounded-lg"
                              style={{
                                backgroundColor: palette.silver1 + "20",
                              }}
                            >
                              <Award
                                size={16}
                                className="mt-1 flex-shrink-0"
                                style={{ color: palette.primary }}
                              />
                              <div>
                                <p className="font-medium text-sm">
                                  {cert.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {cert.year}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </SectionCard>
                )}

                {/* === Kontak Sosial === */}
                {(userTeacher.user_teacher_whatsapp_url ||
                  userTeacher.user_teacher_instagram_url) && (
                  <SectionCard palette={palette}>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Phone size={20} style={{ color: palette.primary }} />
                        <h3 className="font-semibold text-lg">
                          Kontak & Media Sosial
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {userTeacher.user_teacher_whatsapp_url && (
                          <a
                            href={userTeacher.user_teacher_whatsapp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:opacity-80 transition-opacity"
                            style={{
                              borderColor: palette.silver1,
                              color: palette.primary,
                            }}
                          >
                            <Phone size={16} />
                            <span className="text-sm font-medium">
                              WhatsApp
                            </span>
                          </a>
                        )}
                        {userTeacher.user_teacher_instagram_url && (
                          <a
                            href={userTeacher.user_teacher_instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:opacity-80 transition-opacity"
                            style={{
                              borderColor: palette.silver1,
                              color: palette.primary,
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="2"
                                y="2"
                                width="20"
                                height="20"
                                rx="5"
                                ry="5"
                              />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                            <span className="text-sm font-medium">
                              Instagram
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </SectionCard>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* === MODALS === */}
      <ModalEditRingkasan
        open={openRingkasanEdit}
        onClose={() => setOpenRingkasanEdit(false)}
        initial={{
          greeting: userTeacher?.user_teacher_greeting || "",
          shortBio: userTeacher?.user_teacher_short_bio || "",
          subjects: userTeacher?.user_teacher_specialties || [],
        }}
        palette={palette}
        teacherId={userTeacher?.user_teacher_id}
        onSubmit={() => fetchTeacherData()}
      />

      <ModalEditProfilLengkap
        open={openProfilEdit}
        onClose={() => setOpenProfilEdit(false)}
        initial={{
          fullname: userTeacher?.user_teacher_name || "",
          phone: userTeacher?.user_teacher_phone || "",
          email: userTeacher?.user_teacher_email || "",
          city: userTeacher?.user_teacher_city || "",
          location: userTeacher?.user_teacher_location || "",
          birthPlace: userTeacher?.user_teacher_birth_place || "",
          birthDate: userTeacher?.user_teacher_birth_date || "",
          company: userTeacher?.user_teacher_company || "",
          position: userTeacher?.user_teacher_field || "",
          education: userTeacher?.user_teacher_education || "",
          experience: userTeacher?.user_teacher_experience_years || 0,
          gender: userTeacher?.user_teacher_gender || "male",
          whatsappUrl: userTeacher?.user_teacher_whatsapp_url || "",
          instagramUrl: userTeacher?.user_teacher_instagram_url || "",
        }}
        palette={palette}
        teacherId={userTeacher?.user_teacher_id}
        onSubmit={() => fetchTeacherData()}
      />

      <ModalEditInformasiMengajar
        open={openMengajarEdit}
        onClose={() => setOpenMengajarEdit(false)}
        initial={{
          activity: userTeacher?.user_teacher_activity || "",
          rating: userTeacher?.user_teacher_rating || 0,
          totalStudents: userTeacher?.user_teacher_total_students || 0,
          experience: userTeacher?.user_teacher_experience_years || 0,
          isActive: userTeacher?.user_teacher_is_active ?? true,
        }}
        palette={palette}
        teacherId={userTeacher?.user_teacher_id}
        onSubmit={() => fetchTeacherData()}
      />
    </div>
  );
};

export default TeacherProfil;
