// src/pages/sekolahislamku/pages/classes/RoomSchool.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, type Palette } from "@/constants/thema";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  SectionCard,
  Badge,
  Btn,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

import {
  Building2,
  MapPin,
  Loader2,
  Eye,
  ArrowLeft,
  Edit3,
  Trash2,
  Plus,
  Info,
} from "lucide-react";

/* === 🔌 DataViewKit components === */
import {
  useSearchQuery,
  SearchBar,
  useOffsetLimit,
  PaginationBar,
  DataTable,
  type Column,
  CardGrid,
  PerPageSelect,
} from "@/pages/pendidikanku-dashboard/components/common/CDataViewKit";
import { useTopBar } from "@/pages/pendidikanku-dashboard/components/home/CUseTopBar";

/* ===================== CONFIG ===================== */
const USE_DUMMY = false;

/* ===================== TYPES (UI) ================= */
export type Room = {
  id: string;
  school_id?: string;
  name: string;
  capacity: number;
  location?: string | null;
  is_virtual?: boolean;
  is_active: boolean;
  platform?: string | null;
};

/* ================== API QUERY (public) ============ */
function usePublicRoomsQuery(
  schoolId: string,
  q: string,
  page: number,
  perPage: number
) {
  return useQuery({
    queryKey: ["public-rooms", schoolId, q, page, perPage],
    enabled: !!schoolId && !USE_DUMMY,
    staleTime: 60_000,
    retry: 1,
    queryFn: async () => {
      const res = await axios.get(`/public/${schoolId}/class-rooms/list`, {
        params: { q: q || undefined, page, per_page: perPage },
      });
      return res.data;
    },
  });
}

/* ===================== PAGE ======================= */
export default function RoomSchool() {
  const { schoolId } = useParams<{ schoolId?: string }>();
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as any, isDark);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { setTopBar, resetTopBar } = useTopBar();
  useEffect(() => {
    setTopBar({ mode: "back", title: "Daftar Ruangan" });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { q, setQ } = useSearchQuery("q");

  const roomsQ = usePublicRoomsQuery(schoolId ?? "", q, page, perPage);
  const data = roomsQ.data?.data ?? [];
  const total = roomsQ.data?.pagination?.total ?? 0;
  const totalPages = roomsQ.data?.pagination?.total_pages ?? 1;

  const rooms: Room[] = useMemo(
    () =>
      data.map((r: any) => ({
        id: r.class_room_id,
        school_id: r.class_room_school_id,
        name: r.class_room_name,
        capacity: r.class_room_capacity,
        location: r.class_room_location,
        is_virtual: r.class_room_is_virtual,
        is_active: r.class_room_is_active,
        platform: r.class_room_platform,
      })),
    [data]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Room | null>(null);
  const closeModal = () => {
    setModalOpen(false);
    setModalInitial(null);
  };

  const createOrUpdate = useMutation({
    mutationFn: async (form: {
      id?: string;
      name: string;
      capacity: number;
      location?: string;
      is_active: boolean;
    }) => {
      const payload = {
        room_name: form.name,
        room_capacity: form.capacity,
        room_location: form.location ?? null,
        room_is_active: form.is_active,
      };
      if (form.id) {
        await axios.put(`/a/${schoolId}/class-rooms/${form.id}`, payload);
      } else {
        await axios.post(`/a/${schoolId}/class-rooms`, payload);
      }
    },
    onSuccess: async () => {
      closeModal();
      await qc.invalidateQueries({
        queryKey: ["public-rooms", schoolId, q, page, perPage],
      });
    },
  });

  const delRoom = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/a/${schoolId}/class-rooms/${id}`);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ["public-rooms", schoolId, q, page, perPage],
      });
    },
  });

  const handleDeleteRoom = (room: Room) => {
    Swal.fire({
      title: "Hapus ruangan?",
      text: "Data ruangan akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    }).then((res) => {
      if (res.isConfirmed) delRoom.mutate(room.id);
    });
  };

  /* ====== Columns ====== */
  const columns: Column<Room>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Nama Ruangan",
        cell: (r) => (
          <div>
            <div className="font-medium">{r.name}</div>
            <div className="text-xs opacity-80 flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> {r.location ?? "-"}
            </div>
          </div>
        ),
      },
      { key: "capacity", header: "Kapasitas", cell: (r) => r.capacity },
      {
        key: "virtual",
        header: "Jenis",
        cell: (r) => (r.is_virtual ? "Virtual" : "Fisik"),
      },
      { key: "platform", header: "Platform", cell: (r) => r.platform ?? "-" },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <Badge palette={palette} variant={r.is_active ? "success" : "outline"}>
            {r.is_active ? "Aktif" : "Nonaktif"}
          </Badge>
        ),
      },
      {
        key: "actions",
        header: "Aksi",
        cell: (r) => (
          <div className="flex justify-end gap-1">
            <Btn
              palette={palette}
              variant="ghost"
              onClick={() => navigate(`./${r.id}`)}
            >
              <Eye size={16} />
            </Btn>
            <Btn
              palette={palette}
              variant="ghost"
              onClick={() => {
                setModalInitial(r);
                setModalOpen(true);
              }}
            >
              <Edit3 size={16} />
            </Btn>
            <Btn
              palette={palette}
              variant="ghost"
              onClick={() => handleDeleteRoom(r)}
            >
              <Trash2 size={16} />
            </Btn>
          </div>
        ),
      },
    ],
    [palette, navigate]
  );

  /* ====== Layout ====== */
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* ===== Header ===== */}
      <div
        className="p-4 md:p-5 pb-3 border-b flex flex-wrap items-center gap-3"
        style={{ borderColor: palette.silver1 }}
      >
        {/* Back + Title */}
        <div className="hidden md:flex items-center gap-2 font-semibold order-1">
          <Btn
            palette={palette}
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          >
            <ArrowLeft size={18} />
          </Btn>
          <h1>Daftar Ruangan</h1>
        </div>

        {/* Search */}
        <div className="order-3 sm:order-2 w-full sm:w-auto flex-1 min-w-0">
          <SearchBar
            palette={palette}
            value={q}
            onChange={setQ}
            placeholder="Cari nama atau lokasi ruangan…"
            rightExtra={
              <PerPageSelect
                palette={palette}
                value={perPage}
                onChange={setPerPage}
              />
            }
          />
        </div>

        {/* Tombol Tambah */}
        <div className="order-2 sm:order-3 ml-auto hidden md:flex items-center gap-2">
          <Btn palette={palette} size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} className="mr-1" /> Tambah
          </Btn>
        </div>

      </div>
 {/* Tombol Tambah */}
        <div className="order-2 sm:order-3 ml-auto flex md:none items-center gap-2">
          <Btn palette={palette} size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} className="mr-1" /> Tambah
          </Btn>
        </div>
      {/* ===== Content ===== */}
      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6 p-4">
          <SectionCard palette={palette}>
            <div
              className="p-4 md:p-5 pb-3 border-b flex items-center justify-between gap-2"
              style={{ borderColor: palette.silver1 }}
            >
              <div className="flex items-center gap-2 font-semibold">
                <Building2 size={18} /> Ruangan Sekolah
              </div>
              <div className="text-sm" style={{ color: palette.black2 }}>
                {roomsQ.isFetching ? "memuat…" : `${total} total`}
              </div>
            </div>

            <div className="p-4 md:p-5">
              {roomsQ.isLoading ? (
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Loader2 className="animate-spin" size={16} /> Memuat ruangan…
                </div>
              ) : rooms.length === 0 ? (
                <div
                  className="rounded-xl border p-4 text-sm flex items-center gap-2"
                  style={{
                    borderColor: palette.silver1,
                    color: palette.silver2,
                  }}
                >
                  <Info size={16} /> Belum ada ruangan.
                </div>
              ) : (
                <>
                  {/* Mobile Cards */}
                  <div className="md:hidden">
                    <CardGrid<Room>
                      items={rooms}
                      renderItem={(r) => (
                        <div
                          key={r.id}
                          className="rounded-xl border p-4 flex flex-col gap-2"
                          style={{
                            borderColor: palette.silver1,
                            background: palette.white1,
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{r.name}</div>
                              <div
                                className="text-sm mt-0.5 flex items-center gap-1 opacity-80"
                                style={{ color: palette.black2 }}
                              >
                                <MapPin size={14} /> {r.location ?? "-"}
                              </div>
                            </div>
                            <Badge
                              palette={palette}
                              variant={r.is_active ? "success" : "outline"}
                            >
                              {r.is_active ? "Aktif" : "Nonaktif"}
                            </Badge>
                          </div>
                          <div
                            className="text-sm opacity-80"
                            style={{ color: palette.black2 }}
                          >
                            Kapasitas: {r.capacity} |{" "}
                            {r.is_virtual ? "Virtual" : "Fisik"}
                          </div>
                          <div className="pt-1 flex justify-end gap-1">
                            <Btn
                              palette={palette}
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`./${r.id}`)}
                            >
                              <Eye size={14} />
                            </Btn>
                            <Btn
                              palette={palette}
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setModalInitial(r);
                                setModalOpen(true);
                              }}
                            >
                              <Edit3 size={14} />
                            </Btn>
                            <Btn
                              palette={palette}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRoom(r)}
                            >
                              <Trash2 size={14} />
                            </Btn>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <DataTable<Room>
                      palette={palette}
                      columns={columns}
                      rows={rooms}
                      minWidth={840}
                    />
                  </div>

                  {/* Pagination */}
                  <PaginationBar
                    palette={palette}
                    pageStart={(page - 1) * perPage + 1}
                    pageEnd={Math.min(page * perPage, total)}
                    total={total}
                    canPrev={page > 1}
                    canNext={page < totalPages}
                    onPrev={() => setPage((p) => Math.max(1, p - 1))}
                    onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                    rightExtra={
                      <span className="text-sm opacity-80">
                        {roomsQ.isFetching ? "memuat…" : `${total} total`}
                      </span>
                    }
                  />
                </>
              )}
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
