// src/pages/sekolahislamku/jadwal/DetailSchedule.tsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, Clock, MapPin, PencilLine, Trash2 } from "lucide-react";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  Badge,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/CParentTopBar";
import ModalEditSchedule from "@/pages/pendidikanku-dashboard/dashboard-school/dashboard/SchoolModalEditSchedule";
import ParentSidebar from "@/pages/pendidikanku-dashboard/components/home/CParentSideBar";

export type TodayScheduleItem = {
  title: string;
  time?: string;
  room?: string;
};

const decodeId = (id: string) => {
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
};

export default function DetailSchedule() {
  const { scheduleId = "" } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  // Ambil item dari state (jika datang dari list). Kalau tidak ada, kita
  // hanya tampilkan ID ter-decode. (Nanti bisa kamu sambungkan ke API by id.)
  const incoming = (state as any)?.item as TodayScheduleItem | undefined;

  const [item, setItem] = useState<TodayScheduleItem | null>(incoming ?? null);
  const [editOpen, setEditOpen] = useState(false);

  const readableId = useMemo(() => decodeId(scheduleId), [scheduleId]);

  const handleDelete = () => {
    if (!confirm(`Hapus jadwal ini?`)) return;
    // TODO: panggil API delete bila sudah ada
    navigate(-1); // kembali ke list
  };

  const handleSubmitEdit = (p: {
    title: string;
    time: string;
    room?: string;
  }) => {
    // TODO: sambungkan ke API update bila sudah ada
    setItem({ title: p.title, time: p.time, room: p.room });
    setEditOpen(false);
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
        onClose={() => setEditOpen(false)}
        palette={palette}
        defaultTitle={item?.title || ""}
        defaultTime={item?.time || ""}
        defaultRoom={item?.room || ""}
        onSubmit={handleSubmitEdit}
        onDelete={handleDelete}
      />

      <main className="px-4 md:px-6  md:py-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="md:flex hidden items-center gap-3 font-semibold text-lg">
                <Btn
                  palette={palette}
                  variant="ghost"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="cursor-pointer" size={20} />
                </Btn>
                <span>Detail Jadwal</span>
              </div>
            </div>

            {/* Card Detail */}
            <SectionCard palette={palette} className="p-4 md:p-5">
              {item ? (
                <>
                  <div className="font-bold text-xl">{item.title}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span className="inline-flex items-center gap-2">
                      <Clock size={16} />
                      <Badge palette={palette} variant="white1">
                        {item.time || "-"}
                      </Badge>
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={16} />
                      <Badge palette={palette} variant="outline">
                        {item.room || "-"}
                      </Badge>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* Fallback kalau tidak ada state: tampilkan ID ter-decode */}
                  <div className="font-bold text-xl break-words">
                    Jadwal: <span className="font-normal">{readableId}</span>
                  </div>
                  <div
                    className="mt-2 text-sm"
                    style={{ color: palette.silver2 }}
                  >
                    Data detail tidak dikirim via state. Sambungkan fetch by ID
                    di sini bila diperlukan.
                  </div>
                </>
              )}
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}
