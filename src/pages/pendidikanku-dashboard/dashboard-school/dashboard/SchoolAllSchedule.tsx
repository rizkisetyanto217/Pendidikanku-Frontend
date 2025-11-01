// src/pages/sekolahislamku/jadwal/AllSchedule.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { ArrowLeft, Clock, MapPin, Plus } from "lucide-react";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import Swal from "sweetalert2";
import {
  SectionCard,
  Badge,
  type Palette,
  Btn,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/CParentTopBar";
import {
  mockTodaySchedule,
  type TodayScheduleItem,
} from "../calender/TodaySchedule";

// Edit (ubah item yang ada)
import ModalEditSchedule from "./SchoolModalEditSchedule";
import ParentSidebar from "@/pages/pendidikanku-dashboard/components/home/CParentSideBar";
import AddSchedule from "@/pages/pendidikanku-dashboard/dashboard-teacher/dashboard/TeacherAddSchedule";

/** State yang dikirim dari komponen lain via <Link state={...}> */
type LocationState = {
  items?: TodayScheduleItem[];
  heading?: string;
};

const isTime = (t?: string) => !!t && /^\d{2}:\d{2}$/.test(t);
const keyOf = (it: TodayScheduleItem) =>
  `${it.title}__${it.time || ""}__${it.room || ""}`;

// detailschedule
const makeScheduleId = (it: TodayScheduleItem) => encodeURIComponent(keyOf(it));

export default function AllSchedule() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  const { state } = useLocation();
  const { items: incoming, heading } = (state ?? {}) as LocationState;

  /* ===== sumber awal (state router atau mock) ===== */
  const initial: TodayScheduleItem[] = useMemo(() => {
    const base =
      Array.isArray(incoming) && incoming.length > 0
        ? incoming
        : mockTodaySchedule;

    return base.slice().sort((a, b) => {
      const ta = isTime(a.time) ? (a.time as string) : "99:99";
      const tb = isTime(b.time) ? (b.time as string) : "99:99";
      return ta.localeCompare(tb);
    });
  }, [incoming]);

  /* ===== state lokal untuk Add/Edit/Delete ===== */
  const [items, setItems] = useState<TodayScheduleItem[]>(initial);
  useEffect(() => setItems(initial), [initial]);

  /* ===== Search & Filter ===== */
  const [search, setSearch] = useState("");
  const [locFilter, setLocFilter] = useState<string | "semua">("semua");

  const lokasiOptions = useMemo(() => {
    const set = new Set(
      items.map((x) => (x.room ?? "").trim()).filter(Boolean)
    );
    return ["semua", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return items.filter((j) => {
      const matchSearch =
        j.title.toLowerCase().includes(s) ||
        (j.room ?? "").toLowerCase().includes(s) ||
        (j.time ?? "").toLowerCase().includes(s);
      const matchLoc = locFilter === "semua" || (j.room ?? "") === locFilter;
      return matchSearch && matchLoc;
    });
  }, [items, search, locFilter]);

  /* ===== Tambah Jadwal ===== */
  const [showTambahJadwal, setShowTambahJadwal] = useState(false);
  const openAdd = () => {
    setShowTambahJadwal(true);
  };
  const handleSubmitAdd = (payload: {
    time: string;
    title: string;
    room?: string;
  }) => {
    const newItem: TodayScheduleItem = {
      title: payload.title,
      time: payload.time,
      room: payload.room,
    };
    setItems((prev) =>
      [...prev, newItem].sort((a, b) => {
        const ta = isTime(a.time) ? (a.time as string) : "99:99";
        const tb = isTime(b.time) ? (b.time as string) : "99:99";
        return ta.localeCompare(tb);
      })
    );
    setShowTambahJadwal(false);
  };

  /* ===== Edit Jadwal (ModalEditSchedule) ===== */
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<TodayScheduleItem | null>(null);

  const openEdit = (it: TodayScheduleItem) => {
    setSelected(it);
    setEditOpen(true);
  };

  const handleSubmitEdit = (p: {
    title: string;
    time: string;
    room?: string;
  }) => {
    if (!selected) return;
    const k = keyOf(selected);
    setItems((prev) =>
      prev
        .map((x) =>
          keyOf(x) === k
            ? { ...x, title: p.title, time: p.time, room: p.room }
            : x
        )
        .sort((a, b) => {
          const ta = isTime(a.time) ? (a.time as string) : "99:99";
          const tb = isTime(b.time) ? (b.time as string) : "99:99";
          return ta.localeCompare(tb);
        })
    );
    setEditOpen(false);
    setSelected(null);
  };

  const handleDeleteFromEdit = () => {
    if (!selected) return;
    const k = keyOf(selected);
    setItems((prev) => prev.filter((x) => keyOf(x) !== k));
    setEditOpen(false);
    setSelected(null);
  };

  /* ===== Hapus & Detail (dari list) ===== */
  const handleDelete = (it: TodayScheduleItem) => {
    Swal.fire({
      title: "Yakin hapus?",
      text: `Jadwal "${it.title}" akan dihapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const k = keyOf(it);
        setItems((prev) => prev.filter((x) => keyOf(x) !== k));

        Swal.fire({
          title: "Terhapus!",
          text: `Jadwal "${it.title}" berhasil dihapus.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleDetail = (it: TodayScheduleItem) => {
    const id = makeScheduleId(it);
    navigate(`detail/${id}`, { state: { item: it } }); // relative ke /jadwal
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div
      className="w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* Modal Edit */}
      <ModalEditSchedule
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelected(null);
        }}
        palette={palette}
        defaultTitle={selected?.title || ""}
        defaultTime={selected?.time || ""}
        defaultRoom={selected?.room || ""}
        onSubmit={handleSubmitEdit}
        onDelete={handleDeleteFromEdit}
      />

      {/* Modal Tambah */}
      <AddSchedule
        open={showTambahJadwal}
        onClose={() => setShowTambahJadwal(false)}
        palette={palette}
        onSubmit={handleSubmitAdd}
      />

      <main className="w-full px-4 md:px-6 py-4 md:py-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="flex-1 flex flex-col space-y-6 min-w-0">
            {/* Header actions — selaras ScheduleThreeDays */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="md:flex hidden items-center gap-3 font-semibold text-lg">
                <Btn
                  palette={palette}
                  variant="ghost"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="cursor-pointer" size={20} />
                </Btn>
                <span>{heading || "Jadwal Hari Ini"}</span>
              </div>
              <div className="flex gap-2">
                <Btn palette={palette} size="sm" onClick={openAdd}>
                  <Plus size={16} className="mr-1" />
                </Btn>
              </div>
            </div>

            {/* Search & Filter */}
            <SectionCard palette={palette} className="p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Cari judul, waktu, atau lokasi…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 w-full rounded-2xl px-3 text-sm"
                    style={{
                      background: palette.white1,
                      color: palette.black1,
                      border: `1px solid ${palette.silver1}`,
                    }}
                  />
                </div>

                {lokasiOptions.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Badge palette={palette} variant="outline">
                      Lokasi
                    </Badge>
                    <select
                      value={locFilter}
                      onChange={(e) => setLocFilter(e.target.value as any)}
                      className="h-10 rounded-xl px-3 text-sm outline-none"
                      style={{
                        background: palette.white1,
                        color: palette.black1,
                        border: `1px solid ${palette.silver1}`,
                      }}
                    >
                      {lokasiOptions.map((o) => (
                        <option key={o} value={o}>
                          {o === "semua" ? "Semua" : o}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Jadwal List + actions */}
            <div className="grid gap-3">
              {filtered.length === 0 ? (
                <SectionCard palette={palette} className="p-6 text-center">
                  <div className="text-sm" style={{ color: palette.silver2 }}>
                    Tidak ada jadwal hari ini.
                  </div>
                </SectionCard>
              ) : (
                filtered.map((j) => (
                  <SectionCard
                    key={keyOf(j)}
                    palette={palette}
                    className="p-3 md:p-4"
                    style={{ background: palette.white1 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{j.title}</div>
                        <div
                          className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
                          style={{ color: palette.black2 }}
                        >
                          {j.room && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={16} /> {j.room}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Clock size={16} />{" "}
                            {isTime(j.time) ? "Terjadwal" : j.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="white1" palette={palette}>
                          {j.time}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Btn
                            palette={palette}
                            size="sm"
                            variant="white1"
                            onClick={() => handleDetail(j)}
                          >
                            Detail
                          </Btn>

                          <Btn
                            palette={palette}
                            size="sm"
                            variant="ghost"
                            onClick={() => openEdit(j)}
                          >
                            Edit
                          </Btn>
                          <Btn
                            palette={palette}
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(j)}
                          >
                            Hapus
                          </Btn>
                        </div>
                      </div>
                    </div>
                  </SectionCard>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
