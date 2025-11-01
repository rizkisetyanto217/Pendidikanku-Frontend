// src/pages/sekolahislamku/dashboard-school/rooms/DetailRoomSchool.tsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName } from "@/constants/thema";
import {
  SectionCard,
  Badge,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import { ArrowLeft, Loader2, Building2, MapPin, Users } from "lucide-react";

/* ===================== TYPES (UI) ================= */
export type Room = {
  id: string;
  masjid_id?: string;
  name: string;
  code?: string;
  slug?: string;
  description?: string;
  capacity: number;
  location?: string | null;
  is_virtual?: boolean;
  is_active: boolean;

  image_url?: string | null;

  features?: string[];
  platform?: string | null;
  join_url?: string | null;
  meeting_id?: string | null;
  passcode?: string | null;

  schedule?: {
    label: string;
    day?: string;
    date?: string;
    from: string;
    to: string;
    group?: string;
  }[];

  notes?: Array<{ ts?: string; text?: string }>;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

/* ========== TYPES (payload dari API publik) ========= */
type ClassRoomApi = {
  class_room_id: string;
  class_room_masjid_id: string;
  class_room_name: string;
  class_room_code?: string | null;
  class_room_slug?: string | null;
  class_room_location?: string | null;
  class_room_capacity: number;
  class_room_description?: string | null;
  class_room_is_virtual: boolean;
  class_room_is_active: boolean;

  class_room_image_url?: string | null;

  class_room_platform?: string | null;
  class_room_join_url?: string | null;
  class_room_meeting_id?: string | null;
  class_room_passcode?: string | null;

  class_room_features?: string[] | null;
  class_room_schedule?: any[] | null; // variasi bentuk
  class_room_notes?: Array<{ ts?: string; text?: string }> | null;

  class_room_created_at?: string;
  class_room_updated_at?: string;
  class_room_deleted_at?: string | null;
};

type PublicRoomsResponse = {
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  data: ClassRoomApi[];
};

/* ===================== QK ========================= */
const QK = {
  ROOM_PUBLIC: (masjidId: string, id: string) =>
    ["public-room", masjidId, id] as const,
};

/* ===================== HELPERS ==================== */
function atLocalNoonISO(d: Date) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x.toISOString();
}

function normalizeSchedule(s: any[] | null | undefined): Room["schedule"] {
  if (!s || !Array.isArray(s)) return [];
  return s.map((it: any) => {
    // Bentuk 1: {label, day,date, from,to, group}
    if (it.from || it.to) {
      return {
        label: it.label ?? "",
        day: it.day,
        date: it.date,
        from: it.from ?? it.start ?? "",
        to: it.to ?? it.end ?? "",
        group: it.group,
      };
    }
    // Bentuk 2: {start,end, weekday, timezone}
    return {
      label: it.label ?? "",
      day:
        it.weekday && typeof it.weekday === "string"
          ? it.weekday.toLowerCase()
          : undefined,
      from: it.start ?? "",
      to: it.end ?? "",
    };
  });
}

function mapApiRoomToRoom(x: ClassRoomApi): Room {
  return {
    id: x.class_room_id,
    masjid_id: x.class_room_masjid_id,
    name: x.class_room_name,
    code: x.class_room_code ?? undefined,
    slug: x.class_room_slug ?? undefined,
    description: x.class_room_description ?? undefined,
    capacity: x.class_room_capacity,
    location: x.class_room_location ?? null,
    is_virtual: x.class_room_is_virtual,
    is_active: x.class_room_is_active,

    image_url: x.class_room_image_url ?? null,

    features: x.class_room_features ?? undefined,
    platform: x.class_room_platform ?? null,
    join_url: x.class_room_join_url ?? null,
    meeting_id: x.class_room_meeting_id ?? null,
    passcode: x.class_room_passcode ?? null,

    schedule: normalizeSchedule(x.class_room_schedule),
    notes: x.class_room_notes ?? [],

    created_at: x.class_room_created_at,
    updated_at: x.class_room_updated_at,
    deleted_at: x.class_room_deleted_at ?? null,
  };
}

/* =============== API QUERY (public) =============== */
/** Asumsi: endpoint list mendukung filter `ids=<uuid>` dan return 1 item */
function usePublicRoomQuery(masjidId: string, id: string) {
  return useQuery<Room | null>({
    queryKey: QK.ROOM_PUBLIC(masjidId, id),
    enabled: !!masjidId && !!id,
    staleTime: 60_000,
    retry: 1,
    queryFn: async () => {
      const res = await axios.get<PublicRoomsResponse>(
        `/public/${masjidId}/class-rooms/list`,
        { params: { ids: id, page: 1, per_page: 1 } }
      );
      const item = res.data.data?.[0];
      return item ? mapApiRoomToRoom(item) : null;
    },
  });
}

/* ============== REUSABLE COMPONENTS ============== */
interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  palette: Palette;
}
function InfoRow({ label, value, palette }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm opacity-90" style={{ color: palette.black1 }}>
        {label}
      </span>
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
  palette: Palette;
}
function InfoSection({ title, children, palette }: InfoSectionProps) {
  return (
    <div className="space-y-3">
      <h3
        className="font-semibold text-base pb-2 border-b"
        style={{ borderColor: palette.silver1 }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ===================== PAGE ======================= */
export default function DetailRoomSchool() {
  const { masjid_id, id } = useParams<{ masjid_id?: string; id?: string }>();
  const navigate = useNavigate();
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  const topbarGregorianISO = useMemo(() => atLocalNoonISO(new Date()), []);

  // Guard param
  const masjidId = masjid_id ?? "";
  const roomId = id ?? "";

  const roomQuery = usePublicRoomQuery(masjidId, roomId);

  // Loading state
  if (roomQuery.isLoading) {
    return (
      <div
        className="w-full grid place-items-center"
        style={{ background: palette.white2 }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="animate-spin"
            size={32}
            style={{ color: palette.primary }}
          />
          <p className="text-sm opacity-70">Memuat data ruangan...</p>
        </div>
      </div>
    );
  }

  // Error or not found
  const room = roomQuery.data;
  if (!room) {
    return (
      <div
        className="w-full"
        style={{ background: palette.white2, color: palette.black1 }}
      >
        <main className="px-4 md:px-6 md:py-8">
          <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6">
            <section className="flex-1">
              <SectionCard palette={palette} className="p-8 text-center">
                <Building2 size={48} className="mx-auto mb-4 opacity-30" />
                <h2 className="text-lg font-semibold mb-2">
                  Ruangan tidak ditemukan
                </h2>
                <p className="text-sm opacity-70 mb-4">
                  Data ruangan dengan ID tersebut tidak tersedia.
                </p>
                <Btn palette={palette} onClick={() => navigate(-1)}>
                  Kembali
                </Btn>
              </SectionCard>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* lihat keseluruhan ruangan */}
          <section className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Btn
                palette={palette}
                variant="ghost"
                onClick={() => navigate(-1)}
                title="Kembali"
                className="md:flex"
              >
                <ArrowLeft size={20} />
              </Btn>

              <div className="flex-1">
                <h1 className="font-semibold text-base">{room.name}</h1>
                {room.code && (
                  <p className="text-sm opacity-70 mt-1">Kode: {room.code}</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SectionCard palette={palette}>
                <div className="p-4 flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg grid place-items-center"
                    style={{
                      background: palette.primary2,
                      color: palette.primary,
                    }}
                  >
                    <Users size={20} />
                  </div>
                  <div>
                    <div
                      className="text-sm opacity-90"
                      style={{ color: palette.black1 }}
                    >
                      Kapasitas
                    </div>
                    <div className="text-lg font-semibold">{room.capacity}</div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard palette={palette}>
                <div className="p-4 flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg grid place-items-center"
                    style={{
                      background: palette.primary2,
                      color: palette.primary,
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div
                      className="text-sm opacity-90"
                      style={{ color: palette.black1 }}
                    >
                      Lokasi
                    </div>
                    <div className="text-sm font-medium">
                      {room.location || "—"}
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Wrapper grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Informasi Dasar */}
              <SectionCard palette={palette}>
                <div className="p-5 space-y-4">
                  <InfoSection title="Informasi Dasar" palette={palette}>
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      style={{ color: palette.black1 }}
                    >
                      <InfoRow
                        label="Nama Ruangan"
                        value={room.name}
                        palette={palette}
                      />
                      <InfoRow
                        label="Kode"
                        value={room.code ?? "—"}
                        palette={palette}
                      />
                      <InfoRow
                        label="Kapasitas"
                        value={`${room.capacity} siswa`}
                        palette={palette}
                      />
                      <InfoRow
                        label="Lokasi"
                        value={room.location ?? "—"}
                        palette={palette}
                      />
                      <InfoRow
                        label="Status"
                        value={
                          <Badge
                            palette={palette}
                            variant={room.is_active ? "success" : "outline"}
                          >
                            {room.is_active ? "Aktif" : "Nonaktif"}
                          </Badge>
                        }
                        palette={palette}
                      />
                    </div>
                    {room.description && (
                      <div className="pt-2">
                        <InfoRow
                          label="Deskripsi"
                          value={room.description}
                          palette={palette}
                        />
                      </div>
                    )}
                  </InfoSection>
                </div>
              </SectionCard>

              {/* Virtual Room Info */}
              {room.is_virtual && (
                <SectionCard palette={palette}>
                  <div className="p-5 space-y-4">
                    <InfoSection
                      title="Informasi Virtual Room"
                      palette={palette}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow
                          label="Platform"
                          value={room.platform ?? "—"}
                          palette={palette}
                        />
                        <InfoRow
                          label="Meeting ID"
                          value={room.meeting_id ?? "—"}
                          palette={palette}
                        />
                        <InfoRow
                          label="Passcode"
                          value={room.passcode ?? "—"}
                          palette={palette}
                        />
                        <InfoRow
                          label="Join URL"
                          value={
                            room.join_url ? (
                              <a
                                href={room.join_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all"
                              >
                                {room.join_url}
                              </a>
                            ) : (
                              "—"
                            )
                          }
                          palette={palette}
                        />
                      </div>
                    </InfoSection>
                  </div>
                </SectionCard>
              )}
            </div>

            {/* Features */}
            {room.features && room.features.length > 0 && (
              <SectionCard palette={palette}>
                <div className="p-5 space-y-3">
                  <h3
                    className="font-semibold text-base pb-2 border-b"
                    style={{ borderColor: palette.silver1 }}
                  >
                    Fasilitas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature: string, idx: number) => (
                      <Badge key={idx} palette={palette} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Schedule */}
            {room.schedule && room.schedule.length > 0 && (
              <SectionCard palette={palette}>
                <div className="p-5 space-y-3">
                  <h3
                    className="font-semibold text-base pb-2 border-b"
                    style={{ borderColor: palette.silver1 }}
                  >
                    Jadwal
                  </h3>
                  <div className="space-y-2">
                    {room.schedule.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border"
                        style={{
                          borderColor: palette.silver1,
                          background: palette.white1,
                        }}
                      >
                        <div className="font-medium text-sm mb-1">
                          {s.label || "—"}
                        </div>
                        <div className="text-sm opacity-90">
                          {s.day ?? s.date ?? "—"} • {s.from} – {s.to}
                          {s.group ? ` • Grup ${s.group}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Notes */}
            {room.notes && room.notes.length > 0 && (
              <SectionCard palette={palette}>
                <div className="p-5 space-y-3">
                  <h3
                    className="font-semibold text-base pb-2 border-b"
                    style={{ borderColor: palette.silver1 }}
                  >
                    Catatan
                  </h3>
                  <div className="space-y-2">
                    {room.notes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border"
                        style={{
                          borderColor: palette.silver1,
                          background: palette.white1,
                        }}
                      >
                        <div className="text-sm opacity-90 mb-1">
                          {note.ts
                            ? new Date(note.ts).toLocaleString("id-ID", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </div>
                        <div className="text-sm">{note.text ?? "—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Metadata */}
            <SectionCard palette={palette}>
              <div className="p-5 space-y-3">
                <h3
                  className="font-semibold text-base pb-2 border-b"
                  style={{ borderColor: palette.silver1 }}
                >
                  Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow
                    label="Dibuat pada"
                    value={
                      room.created_at
                        ? new Date(room.created_at).toLocaleString("id-ID")
                        : "—"
                    }
                    palette={palette}
                  />
                  <InfoRow
                    label="Diperbarui pada"
                    value={
                      room.updated_at
                        ? new Date(room.updated_at).toLocaleString("id-ID")
                        : "—"
                    }
                    palette={palette}
                  />
                </div>
              </div>
            </SectionCard>
          </section>
        </div>
      </main>
    </div>
  );
}
