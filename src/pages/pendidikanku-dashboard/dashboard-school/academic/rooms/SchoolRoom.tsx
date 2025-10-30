// src/pages/.../RoomSchool.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName } from "@/constants/thema";
import { useNavigate, useParams } from "react-router-dom";
import {
  SectionCard,
  Badge,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/Primitives";
import {
  Building2,
  MapPin,
  Loader2,
  Eye,
  ArrowLeft,
  Edit3,
  Trash2,
  Plus,
} from "lucide-react";

/* ===================== CONFIG ===================== */
const USE_DUMMY = false;

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

  notes?: any[];
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
  class_room_schedule?: any[] | null; // bisa {from,to,day} atau {start,end,weekday}
  class_room_notes?: any[] | null;

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

/* ========== Admin payload (create/update) ========= */
type ApiRoomPayload = {
  room_name: string;
  room_capacity: number;
  room_location: string | null;
  room_is_active: boolean;
};

/* ===================== QK ========================= */
const QK = {
  ROOMS_PUBLIC: (masjidId: string, q: string, page: number, perPage: number) =>
    ["public-rooms", masjidId, q, page, perPage] as const,
};

/* ===================== HELPERS ==================== */
function normalizeSchedule(s: any[] | null | undefined): Room["schedule"] {
  if (!s || !Array.isArray(s)) return [];
  return s.map((it: any) => {
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
    return {
      label: it.label ?? "",
      day: it.weekday?.toLowerCase?.(),
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

/* ================== API QUERY (public) ============ */
function usePublicRoomsQuery(
  masjidId: string,
  q: string,
  page: number,
  perPage: number
) {
  return useQuery<PublicRoomsResponse>({
    queryKey: QK.ROOMS_PUBLIC(masjidId, q, page, perPage),
    enabled: !!masjidId && !USE_DUMMY,
    staleTime: 60_000,
    retry: 1,
    queryFn: async () => {
      const res = await axios.get<PublicRoomsResponse>(
        `/public/${masjidId}/class-rooms/list`,
        { params: { q: q || undefined, page, per_page: perPage } }
      );
      return res.data;
    },
  });
}

/* ================= Modal Upsert Room =============== */
function RoomModal({
  open,
  onClose,
  initial,
  onSubmit,
  saving,
  palette,
  error,
}: {
  open: boolean;
  onClose: () => void;
  initial: Room | null;
  onSubmit: (v: {
    id?: string;
    name: string;
    capacity: number;
    location?: string;
    is_active: boolean;
  }) => void;
  saving?: boolean;
  error?: string | null;
  palette: Palette;
}) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [capacity, setCapacity] = useState<number>(initial?.capacity ?? 30);
  const [location, setLocation] = useState<string>(initial?.location ?? "");
  const [active, setActive] = useState<boolean>(initial?.is_active ?? true);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTouched(false);
    setName(initial?.name ?? "");
    setCapacity(initial?.capacity ?? 30);
    setLocation(initial?.location ?? "");
    setActive(initial?.is_active ?? true);
  }, [open, initial]);

  if (!open) return null;

  const nameErr = touched && !name.trim() ? "Nama wajib diisi." : "";
  const capErr = touched && capacity <= 0 ? "Kapasitas harus > 0." : "";
  const disabled = saving || !name.trim() || capacity <= 0;

  const submit = () =>
    !disabled &&
    onSubmit({
      id: initial?.id,
      name: name.trim(),
      capacity,
      location: location.trim() || undefined,
      is_active: active,
    });

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center"
      style={{ background: "rgba(0,0,0,.35)" }}
    >
      <SectionCard
        palette={palette}
        className="w-[min(720px,94vw)] p-4 md:p-5 rounded-2xl shadow-xl"
        style={{ background: palette.white1, color: palette.black1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Ruangan" : "Tambah Ruangan"}
          </h3>
        </div>

        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="opacity-80">Nama Ruangan</span>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{
                borderColor: palette.black2,
                background: palette.white2,
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Mis. 'Ruang Kelas 3B'"
            />
            {nameErr && (
              <span className="text-xs" style={{ color: palette.error1 }}>
                {nameErr}
              </span>
            )}
          </label>

          <label className="grid gap-1 text-sm">
            <span className="opacity-80">Kapasitas</span>
            <input
              type="number"
              min={1}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{
                borderColor: palette.black2,
                background: palette.white2,
              }}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              onBlur={() => setTouched(true)}
              placeholder="30"
            />
            {capErr && (
              <span className="text-xs" style={{ color: palette.error1 }}>
                {capErr}
              </span>
            )}
          </label>

          <label className="grid gap-1 text-sm">
            <span className="opacity-80">Lokasi (opsional)</span>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{
                borderColor: palette.black2,
                background: palette.white2,
              }}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Gedung A, Lt. 2"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span>Aktif digunakan</span>
          </label>

          {error && (
            <div className="text-sm" style={{ color: palette.error1 }}>
              {error}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Btn
            palette={palette}
            variant="ghost"
            onClick={onClose}
            disabled={saving}
          >
            Batal
          </Btn>
          <Btn palette={palette} onClick={submit} disabled={disabled}>
            {saving ? "Menyimpan…" : isEdit ? "Simpan" : "Tambah"}
          </Btn>
        </div>
      </SectionCard>
    </div>
  );
}

/* ===================== PAGE ======================= */
type RoomSchoolProps = {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
};

export default function RoomSchool({
  showBack = false,
  backTo,
  backLabel = "Kembali",
}: RoomSchoolProps) {
  const { masjid_id } = useParams<{ masjid_id?: string }>();
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const roomsQ = usePublicRoomsQuery(masjid_id ?? "", q, page, perPage);

  // Data ter-normalisasi untuk UI
  const rooms: Room[] = useMemo(
    () => (roomsQ.data?.data ?? []).map(mapApiRoomToRoom),
    [roomsQ.data]
  );
  const total = roomsQ.data?.pagination.total ?? 0;
  const totalPages = roomsQ.data?.pagination.total_pages ?? 1;

  // ======= Upsert/Delete state =======
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Room | null>(null);

  const closeModal = () => {
    setModalOpen(false);
    setModalInitial(null);
  };

  // ======= Mutations (admin endpoints) =======
  const createOrUpdate = useMutation({
    mutationFn: async (form: {
      id?: string;
      name: string;
      capacity: number;
      location?: string;
      is_active: boolean;
    }) => {
      const payload: ApiRoomPayload = {
        room_name: form.name,
        room_capacity: form.capacity,
        room_location: form.location ?? null,
        room_is_active: form.is_active,
      };

      if (form.id) {
        await axios.put(`/api/a/rooms/${form.id}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.post(`/api/a/rooms`, payload, {
          withCredentials: true,
        });
      }
    },
    onSuccess: async () => {
      closeModal();
      await qc.invalidateQueries({
        queryKey: QK.ROOMS_PUBLIC(masjid_id ?? "", q, page, perPage),
      });
    },
  });

  const delRoom = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/a/rooms/${id}`, { withCredentials: true });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: QK.ROOMS_PUBLIC(masjid_id ?? "", q, page, perPage),
      });
    },
  });

  // Guard path
  if (!masjid_id) {
    return (
      <div className="p-4 text-sm">
        <b>masjid_id</b> tidak ada di path. Contoh:
        <code className="ml-1">/MASJID_ID/sekolah/menu-utama/ruangan</code>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6">
          <section className="flex-1 min-w-0 space-y-6">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-lg flex items-center">
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
                <h1>Ruangan</h1>
              </div>

              {/* Tambah */}
              <Btn
                palette={palette}
                onClick={() => {
                  setModalInitial(null);
                  setModalOpen(true);
                }}
              >
                <Plus size={16} className="mr-2" />
                Tambah
              </Btn>
            </div>

            {/* Filter & page size */}
            <SectionCard palette={palette}>
              <div className="p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 flex gap-2">
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: palette.black2,
                      background: palette.white2,
                      color: palette.black1,
                    }}
                    placeholder="Cari ruangan… (nama/lokasi)"
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setPage(1);
                    }}
                  />
                  <select
                    className="rounded-lg border px-2 py-2 text-sm"
                    style={{
                      borderColor: palette.black2,
                      background: palette.white2,
                    }}
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    {[10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}/hal
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </SectionCard>

            {/* List */}
            <SectionCard palette={palette}>
              <div className="p-4 pb-1 font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: palette.white3,
                      color: palette.primary,
                    }}
                  >
                    <Building2 size={18} />
                  </div>
                  <h2 className="text-base font-semibold">Daftar Ruangan</h2>
                </div>
              </div>

              <div className="px-4 pb-4 space-y-3">
                {roomsQ.isLoading && (
                  <div className="text-sm opacity-70 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} /> Memuat
                    ruangan…
                  </div>
                )}

                {roomsQ.isError && (
                  <div className="text-sm opacity-70">
                    Gagal memuat ruangan.
                  </div>
                )}

                {!roomsQ.isLoading && rooms.length > 0
                  ? rooms.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow transition-all duration-200"
                        style={{
                          borderColor: palette.silver1,
                          background: palette.white1,
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {r.name}
                          </span>
                          <div
                            className="flex items-center gap-2 text-sm mt-1"
                            style={{ color: palette.black2 }}
                          >
                            <MapPin size={14} />
                            {r.location ?? "Lokasi tidak tersedia"}
                          </div>
                          <div
                            className="text-sm opacity-80 mt-1"
                            style={{ color: palette.black2 }}
                          >
                            Kapasitas: {r.capacity} orang
                            {r.is_virtual ? " • Virtual" : ""}
                            {r.platform ? ` • ${r.platform}` : ""}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 sm:mt-0">
                          <Badge
                            palette={palette}
                            variant={r.is_active ? "success" : "outline"}
                          >
                            {r.is_active ? "Aktif" : "Nonaktif"}
                          </Badge>

                          <Btn
                            palette={palette}
                            variant="ghost"
                            title="Detail"
                            onClick={() => navigate(`./${r.id}`)}
                          >
                            <Eye size={16} />
                          </Btn>

                          <Btn
                            palette={palette}
                            variant="ghost"
                            title="Edit"
                            onClick={() => {
                              setModalInitial(r);
                              setModalOpen(true);
                            }}
                            disabled={createOrUpdate.isPending}
                          >
                            <Edit3 size={16} />
                          </Btn>

                          <Btn
                            palette={palette}
                            variant="ghost"
                            title="Hapus"
                            onClick={() => {
                              if (
                                confirm(
                                  `Hapus ruangan "${r.name}"? Tindakan ini tidak dapat dibatalkan.`
                                )
                              ) {
                                delRoom.mutate(r.id);
                              }
                            }}
                            disabled={delRoom.isPending}
                          >
                            <Trash2 size={16} />
                          </Btn>
                        </div>
                      </div>
                    ))
                  : !roomsQ.isLoading && (
                      <div
                        className="text-sm text-center py-6"
                        style={{ color: palette.black2 }}
                      >
                        Belum ada ruangan yang cocok.
                      </div>
                    )}

                {/* Pagination (pakai dari server) */}
                {total > 0 && (
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="opacity-90">
                      Total: {total} • Halaman {page}/{totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Btn
                        palette={palette}
                        variant="default"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1 || roomsQ.isFetching}
                      >
                        ‹ Prev
                      </Btn>
                      <Btn
                        palette={palette}
                        variant="default"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page >= totalPages || roomsQ.isFetching}
                      >
                        Next ›
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          </section>
        </div>
      </main>

      {/* Modal Upsert */}
      <RoomModal
        open={modalOpen}
        onClose={closeModal}
        initial={modalInitial}
        onSubmit={(form) => createOrUpdate.mutate(form)}
        saving={createOrUpdate.isPending}
        error={
          (createOrUpdate.error as any)?.response?.data?.message ??
          (createOrUpdate.error as any)?.message ??
          null
        }
        palette={palette}
      />
    </div>
  );
}