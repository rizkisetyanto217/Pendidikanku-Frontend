// src/pages/sekolahislamku/academic/ManagementAcademic.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  Badge,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/Primitives";
import {
  ArrowLeft,
  MapPin,
  Link as LinkIcon,
  Users,
  Building2,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

/* ==================== TYPES ==================== */
type ClassRoom = {
  class_rooms_masjid_id: string;
  class_rooms_name: string;
  class_rooms_code: string;
  class_rooms_location: string;
  class_rooms_is_virtual: boolean;
  class_rooms_floor?: number;
  class_rooms_capacity: number;
  class_rooms_description?: string;
  class_rooms_is_active?: boolean;
  class_rooms_features?: string[];
};

/* ==================== DUMMY DATA ==================== */
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

/* ==================== MODAL TAMBAH/EDIT ==================== */
type RoomModalProps = {
  open: boolean;
  onClose: () => void;
  palette: Palette;
  defaultValue?: Partial<ClassRoom>;
  onSubmit: (payload: ClassRoom) => void;
  title: string;
};

const RoomModal: React.FC<RoomModalProps> = ({
  open,
  onClose,
  palette,
  defaultValue,
  onSubmit,
  title,
}) => {
  const [nama, setNama] = useState(defaultValue?.class_rooms_name ?? "");
  const [kode, setKode] = useState(defaultValue?.class_rooms_code ?? "");
  const [lokasi, setLokasi] = useState(defaultValue?.class_rooms_location ?? "");
  const [kapasitas, setKapasitas] = useState(
    defaultValue?.class_rooms_capacity ?? 0
  );
  const [lantai, setLantai] = useState(defaultValue?.class_rooms_floor ?? 1);
  const [deskripsi, setDeskripsi] = useState(
    defaultValue?.class_rooms_description ?? ""
  );
  const [isVirtual, setIsVirtual] = useState(
    defaultValue?.class_rooms_is_virtual ?? false
  );

  useEffect(() => {
    setNama(defaultValue?.class_rooms_name ?? "");
    setKode(defaultValue?.class_rooms_code ?? "");
    setLokasi(defaultValue?.class_rooms_location ?? "");
    setKapasitas(defaultValue?.class_rooms_capacity ?? 0);
    setLantai(defaultValue?.class_rooms_floor ?? 1);
    setDeskripsi(defaultValue?.class_rooms_description ?? "");
    setIsVirtual(defaultValue?.class_rooms_is_virtual ?? false);
  }, [defaultValue, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !kode) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi data",
        text: "Nama dan kode ruangan wajib diisi.",
      });
      return;
    }

    const payload: ClassRoom = {
      class_rooms_masjid_id:
        defaultValue?.class_rooms_masjid_id ??
        "e9876a6e-ab91-4226-84f7-cda296ec747e",
      class_rooms_name: nama,
      class_rooms_code: kode,
      class_rooms_location: lokasi,
      class_rooms_capacity: kapasitas,
      class_rooms_floor: lantai,
      class_rooms_description: deskripsi,
      class_rooms_is_virtual: isVirtual,
      class_rooms_is_active: true,
      class_rooms_features: defaultValue?.class_rooms_features ?? [],
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.35)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-5"
        style={{
          background: palette.white2,
          border: `1px solid ${palette.silver1}`,
          color: palette.black1,
        }}
      >
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm">Nama Ruangan</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-xl text-sm"
              style={{
                background: palette.white1,
                border: `1px solid ${palette.silver1}`,
              }}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Ruang Tahfidz A"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Kode</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-xl text-sm"
                style={{
                  background: palette.white1,
                  border: `1px solid ${palette.silver1}`,
                }}
                value={kode}
                onChange={(e) => setKode(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">Kapasitas</label>
              <input
                type="number"
                className="w-full mt-1 px-3 py-2 rounded-xl text-sm"
                style={{
                  background: palette.white1,
                  border: `1px solid ${palette.silver1}`,
                }}
                value={kapasitas}
                onChange={(e) => setKapasitas(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Lokasi</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-xl text-sm"
              style={{
                background: palette.white1,
                border: `1px solid ${palette.silver1}`,
              }}
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Contoh: Gedung Utama Lt. 2"
            />
          </div>

          <div>
            <label className="text-sm">Lantai</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 rounded-xl text-sm"
              style={{
                background: palette.white1,
                border: `1px solid ${palette.silver1}`,
              }}
              value={lantai}
              onChange={(e) => setLantai(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm">Deskripsi</label>
            <textarea
              className="w-full mt-1 px-3 py-2 rounded-xl text-sm"
              style={{
                background: palette.white1,
                border: `1px solid ${palette.silver1}`,
              }}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isVirtual}
              onChange={(e) => setIsVirtual(e.target.checked)}
            />
            <span className="text-sm">Ruang Virtual</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Btn type="button" palette={palette} variant="white1" onClick={onClose}>
              Batal
            </Btn>
            <Btn type="submit" palette={palette}>
              Simpan
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ==================== PAGE ==================== */
export default function ManagementAcademic() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  const { state } = useLocation() as { state?: { room?: ClassRoom } };
  const [rooms, setRooms] = useState<ClassRoom[]>(
    state?.room ? [state.room] : DUMMY_ROOMS
  );

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ClassRoom | null>(null);

  const handleAdd = (payload: ClassRoom) => {
    setRooms((prev) => [...prev, { ...payload }]);
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Ruangan berhasil ditambahkan.",
      timer: 1400,
      showConfirmButton: false,
    });
  };

  const handleEdit = (payload: ClassRoom) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.class_rooms_code === payload.class_rooms_code ? payload : r
      )
    );
    Swal.fire({
      icon: "success",
      title: "Tersimpan",
      text: "Perubahan ruangan berhasil disimpan.",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleEditClick = (room: ClassRoom) => {
    setSelectedRoom(room);
    setOpenEdit(true);
  };

  const handleDelete = (code: string) => {
    Swal.fire({
      title: "Hapus ruangan?",
      text: "Data ruangan akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    }).then((res) => {
      if (res.isConfirmed) {
        setRooms((prev) => prev.filter((r) => r.class_rooms_code !== code));
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Ruangan berhasil dihapus.",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* ==== Modal ==== */}
      <RoomModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        palette={palette}
        title="Tambah Ruangan"
        onSubmit={handleAdd}
      />
      <RoomModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        palette={palette}
        title="Edit Ruangan"
        defaultValue={selectedRoom ?? undefined}
        onSubmit={handleEdit}
      />

      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Btn
                palette={palette}
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={20} className="mr-1" />
              </Btn>
              <h1 className="text-lg font-semibold">Kelola Akademik</h1>
            </div>

            <Btn palette={palette} size="sm" onClick={() => setOpenAdd(true)}>
              <Plus size={16} className="mr-1" /> Tambah
            </Btn>
          </div>

          <SectionCard palette={palette} className="p-5">
            <div className="space-y-4">
              {rooms.length === 0 ? (
                <div
                  className="rounded-xl border p-4 text-sm text-center"
                  style={{
                    borderColor: palette.silver1,
                    color: palette.black2,
                  }}
                >
                  Belum ada ruang terdaftar.
                </div>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room.class_rooms_code}
                    className="rounded-xl border p-4 flex flex-col gap-3"
                    style={{
                      borderColor: palette.silver1,
                      background: palette.white1,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">
                          {room.class_rooms_name}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: palette.black2 }}
                        >
                          {room.class_rooms_code}
                        </div>
                      </div>
                      <Badge
                        palette={palette}
                        variant={
                          room.class_rooms_is_virtual ? "info" : "black1"
                        }
                      >
                        {room.class_rooms_is_virtual ? "Virtual" : "Fisik"}
                      </Badge>
                    </div>

                    <div
                      className="text-sm flex items-center gap-2"
                      style={{ color: palette.black2 }}
                    >
                      {room.class_rooms_is_virtual ? (
                        <LinkIcon size={14} />
                      ) : (
                        <MapPin size={14} />
                      )}
                      {room.class_rooms_location}
                    </div>

                    <div
                      className="flex flex-wrap gap-4 text-sm"
                      style={{ color: palette.black2 }}
                    >
                      <span className="inline-flex items-center gap-1">
                        <Users size={14} /> {room.class_rooms_capacity} kursi
                      </span>
                      {!room.class_rooms_is_virtual && room.class_rooms_floor && (
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

                    <div className="flex items-center justify-end gap-2">
                      <Btn
                        palette={palette}
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditClick(room)}
                      >
                        <Pencil size={14} className="mr-1" /> Edit
                      </Btn>
                      <Btn
                        palette={palette}
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDelete(room.class_rooms_code)
                        }
                      >
                        <Trash2 size={14} className="mr-1" /> Hapus
                      </Btn>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
