// src/pages/sekolahislamku/academic/AcademicSchool.tsx
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import axios from "@/lib/axios";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
  SectionCard,
  Badge,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/Primitives";

import {
  CalendarDays,
  CheckCircle2,
  Users,
  MapPin,
  Link as LinkIcon,
  Building2,
  Layers,
  Info,
  ArrowLeft,
  Loader2,
} from "lucide-react";

/* ===================== Types ===================== */
// UI type (dipakai komponen)
type AcademicTerm = {
  id: string;
  masjid_id: string;
  academic_year: string; // "2029/2030" atau "2029/2030 Kuartal 1"
  name: string; // "Ganjil" / "Genap"
  start_date: string; // ISO
  end_date: string; // ISO
  is_active: boolean;
  angkatan: number;
  slug?: string;
  created_at?: string;
  updated_at?: string;
};

type ClassRoom = {
  class_rooms_masjid_id: string;
  class_rooms_name: string;
  class_rooms_code: string;
  class_rooms_location: string; // alamat fisik / URL meeting
  class_rooms_is_virtual: boolean;
  class_rooms_floor?: number;
  class_rooms_capacity: number;
  class_rooms_description?: string;
  class_rooms_is_active?: boolean;
  class_rooms_features?: string[];
};

type SchoolAcademicProps = {
  showBack?: boolean; // default: false
  backTo?: string;
  backLabel?: string;
};

/* ========== API types (sesuai payload server) ========= */
type AcademicTermApi = {
  academic_term_id: string;
  academic_term_masjid_id: string;
  academic_term_academic_year: string;
  academic_term_name: string;
  academic_term_start_date: string;
  academic_term_end_date: string;
  academic_term_is_active: boolean;
  academic_term_angkatan: number;
  academic_term_slug?: string;
  academic_term_period?: string;
  academic_term_created_at?: string;
  academic_term_updated_at?: string;
};

type PublicTermsResponse = {
  data: AcademicTermApi[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
};

/* ===================== Dummy Rooms ===================== */
const DUMMY_ROOMS: ClassRoom[] = [
  {
    class_rooms_masjid_id: "e9876a6e-ab91-4226-84f7-cda296ec747e",
    class_rooms_name: "Ruang Tahfidz A",
    class_rooms_code: "R-TFZ-A",
    class_rooms_location: "Gedung Utama Lt. 2",
    class_rooms_floor: 2,
    class_rooms_capacity: 40,
    class_rooms_description: "Ruang untuk setoran hafalan & halaqah kecil.",
    class_rooms_is_virtual: false,
    class_rooms_is_active: true,
    class_rooms_features: ["AC", "Proyektor", "Whiteboard", "Karpet"],
  },
  {
    class_rooms_masjid_id: "e9876a6e-ab91-4226-84f7-cda296ec747e",
    class_rooms_name: "Kelas Daring Malam",
    class_rooms_code: "VR-NIGHT-01",
    class_rooms_location: "https://meet.google.com/abc-defg-hij",
    class_rooms_is_virtual: true,
    class_rooms_capacity: 100,
    class_rooms_description: "Sesi online untuk murid pekanan.",
    class_rooms_is_active: true,
    class_rooms_features: ["Virtual", "Google Meet", "Rekaman Otomatis"],
  },
];

/* ===================== Helpers ===================== */
const dateShort = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

/* ===== Map API → UI ===== */
function mapApiTermToUI(x: AcademicTermApi): AcademicTerm {
  return {
    id: x.academic_term_id,
    masjid_id: x.academic_term_masjid_id,
    academic_year: x.academic_term_academic_year,
    name: x.academic_term_name,
    start_date: x.academic_term_start_date,
    end_date: x.academic_term_end_date,
    is_active: x.academic_term_is_active,
    angkatan: x.academic_term_angkatan,
    slug: x.academic_term_slug,
    created_at: x.academic_term_created_at,
    updated_at: x.academic_term_updated_at,
  };
}

/* ===== React Query: get public terms ===== */
function usePublicAcademicTerms(masjidId?: string) {
  return useQuery<PublicTermsResponse>({
    queryKey: ["public-academic-terms", masjidId],
    enabled: !!masjidId,
    staleTime: 60_000,
    retry: 1,
    queryFn: async () => {
      // NOTE: mengikuti pola endpoint public lain di project-mu (tanpa "/api" eksplisit)
      const res = await axios.get<PublicTermsResponse>(
        `/public/${masjidId}/academic-terms/list`,
        { params: { page: 1, per_page: 50 } }
      );
      return res.data;
    },
  });
}

/* ===================== Page ===================== */
const AcademicSchool: React.FC<SchoolAcademicProps> = ({
  showBack = false,
  backTo,
  backLabel = "Kembali",
}) => {
  const { masjid_id } = useParams<{ masjid_id?: string }>();
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  const [filter, setFilter] = useState<"all" | "physical" | "virtual">("all");

  // ====== Fetch academic terms (public) ======
  const termsQ = usePublicAcademicTerms(masjid_id);
  const terms: AcademicTerm[] = useMemo(
    () => (termsQ.data?.data ?? []).map(mapApiTermToUI),
    [termsQ.data]
  );
  // pilih term aktif; fallback ke term pertama
  const activeTerm: AcademicTerm | null = useMemo(() => {
    if (!terms.length) return null;
    const actives = terms.filter((t) => t.is_active);
    return actives[0] ?? terms[0] ?? null;
  }, [terms]);

  // Rooms masih dummy (belum ada endpoint rooms untuk halaman ini)
  const rooms = useMemo(() => {
    if (filter === "physical")
      return DUMMY_ROOMS.filter((r) => !r.class_rooms_is_virtual);
    if (filter === "virtual")
      return DUMMY_ROOMS.filter((r) => r.class_rooms_is_virtual);
    return DUMMY_ROOMS;
  }, [filter]);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main */}
          <section className="flex-1 flex flex-col space-y-6 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between ">
              <div className="font-semibold text-lg flex items-center ">
                {showBack && (
                  <Btn
                    palette={palette}
                    onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
                    variant="ghost"
                    className="cursor-pointer mr-3"
                  >
                    <ArrowLeft aria-label={backLabel} size={20} />
                  </Btn>
                )}
                <h1 className="items-center md:flex">Periode Akademik Aktif</h1>
              </div>
            </div>

            {/* ===== Periode Akademik (active term) ===== */}
            <SectionCard palette={palette} className="overflow-hidden ">
              <div className="p-5">
                {termsQ.isLoading ? (
                  <div className="flex items-center gap-2 text-sm opacity-70">
                    <Loader2 className="animate-spin" size={16} />
                    Memuat periode akademik…
                  </div>
                ) : termsQ.isError ? (
                  <div
                    className="rounded-xl border p-4 text-sm flex items-center gap-2"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.silver2,
                    }}
                  >
                    <Info size={16} />
                    Gagal memuat periode akademik.
                  </div>
                ) : !activeTerm ? (
                  <div
                    className="rounded-xl border p-4 text-sm flex items-center gap-2"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.silver2,
                    }}
                  >
                    <Info size={16} />
                    Belum ada periode akademik.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div
                        className="text-sm"
                        style={{ color: palette.black2 }}
                      >
                        Tahun Ajaran
                      </div>
                      <div className="text-xl font-semibold">
                        {activeTerm.academic_year} — {activeTerm.name}
                      </div>
                      <div
                        className="text-sm flex items-center gap-2"
                        style={{ color: palette.black2 }}
                      >
                        <CalendarDays size={16} />
                        {dateShort(activeTerm.start_date)} s/d{" "}
                        {dateShort(activeTerm.end_date)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div
                        className="text-sm"
                        style={{ color: palette.black2 }}
                      >
                        Angkatan
                      </div>
                      <div className="text-xl font-semibold">
                        {activeTerm.angkatan}
                      </div>
                      <div
                        className="text-sm flex items-center gap-2"
                        style={{ color: palette.black2 }}
                      >
                        <CheckCircle2 size={16} />
                        Status: {activeTerm.is_active ? "Aktif" : "Nonaktif"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* ===== Daftar Rooms (dummy) ===== */}
            <SectionCard palette={palette}>
              {/* Header + filters */}
              <div
                className="p-4 md:p-5 pb-3 border-b flex flex-wrap items-center justify-between gap-2"
                style={{ borderColor: palette.silver1 }}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Layers size={18} color={palette.quaternary} />
                  Daftar Ruang Kelas
                </div>

                <div className="flex items-center gap-2">
                  {(["all", "physical", "virtual"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="px-3 py-1.5 rounded-lg border text-sm"
                      style={{
                        background:
                          filter === f ? palette.primary2 : palette.white1,
                        color: filter === f ? palette.primary : palette.black1,
                        borderColor:
                          filter === f ? palette.primary : palette.silver1,
                      }}
                    >
                      {f === "all"
                        ? "Semua"
                        : f === "physical"
                          ? "Fisik"
                          : "Virtual"}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="p-4 md:p-5">
                {rooms.length === 0 ? (
                  <div
                    className="rounded-xl border p-4 text-sm flex items-center gap-2"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.silver2,
                    }}
                  >
                    <Info size={16} />
                    Tidak ada ruang untuk filter ini.
                  </div>
                ) : (
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {rooms.map((r) => (
                      <li key={r.class_rooms_code}>
                        <RoomCard palette={palette} room={r} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </SectionCard>
          </section>
        </div>
      </main>
    </div>
  );
};

/* ===================== Small UI ===================== */
function RoomCard({ room, palette }: { room: ClassRoom; palette: Palette }) {
  const isVirtual = room.class_rooms_is_virtual;

  return (
    <div
      className="rounded-2xl border p-4 h-full flex flex-col gap-3"
      style={{ borderColor: palette.silver1, background: palette.white1 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold truncate">{room.class_rooms_name}</div>
          <div className="text-sm mt-0.5" style={{ color: palette.black2 }}>
            Kode: {room.class_rooms_code}
          </div>
        </div>
        <Badge palette={palette} variant={isVirtual ? "info" : "black1"}>
          {isVirtual ? "Virtual" : "Fisik"}
        </Badge>
      </div>

      <div
        className="text-sm flex items-center gap-2"
        style={{ color: palette.black2 }}
      >
        {isVirtual ? <LinkIcon size={14} /> : <MapPin size={14} />}
        {room.class_rooms_location}
      </div>

      <div
        className="flex flex-wrap items-center gap-3 text-sm"
        style={{ color: palette.black2 }}
      >
        <span className="inline-flex items-center gap-1">
          <Users size={14} /> {room.class_rooms_capacity} kursi
        </span>
        {!isVirtual && room.class_rooms_floor != null && (
          <span className="inline-flex items-center gap-1">
            <Building2 size={14} /> Lantai {room.class_rooms_floor}
          </span>
        )}
      </div>

      {room.class_rooms_description && (
        <p className="text-sm" style={{ color: palette.black2 }}>
          {room.class_rooms_description}
        </p>
      )}

      {!!room.class_rooms_features?.length && (
        <div className="flex flex-wrap gap-1.5">
          {room.class_rooms_features.map((f, i) => (
            <Badge key={i} palette={palette} variant="outline">
              <span style={{ color: palette.black2 }}>{f}</span>
            </Badge>
          ))}
        </div>
      )}

      <div className="pt-1 mt-auto flex items-center justify-end gap-2">
        <Link to="detail" state={{ room }}>
          <Btn palette={palette} variant="secondary" size="sm">
            Detail
          </Btn>
        </Link>
        <Link to="manage" state={{ room }}>
          <Btn palette={palette} size="sm">
            Kelola
          </Btn>
        </Link>
      </div>
    </div>
  );
}

export default AcademicSchool;