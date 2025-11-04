import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName } from "@/constants/thema";
import {
  SectionCard,
  Badge,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  MapPin,
  Link as LinkIcon,
  Users,
  Calendar,
  Clock4,
  Hash,
  Check,
  X,
} from "lucide-react";

/* ================= Types (tanpa csst include) ================= */
type ApiSchedule = {
  start?: string;
  end?: string;
  days?: string[]; // ["Senin","Rabu"]
  location?: string;
};

type RoomSnap = {
  code?: string | null;
  name?: string | null;
  slug?: string | null;
  capacity?: number | null;
  location?: string | null;
  is_virtual?: boolean | null;
};

type TermSnap = {
  name?: string | null;
  slug?: string | null;
  year_label?: string | null;
};

type ApiSection = {
  class_section_id: string;
  class_section_school_id: string;
  class_section_class_id: string;

  class_section_slug: string;
  class_section_name: string;
  class_section_code?: string | null;

  class_section_schedule?: ApiSchedule | null;

  class_section_capacity?: number | null;
  class_section_total_students?: number | null;

  class_section_group_url?: string | null;

  class_section_is_active: boolean;
  class_section_created_at: string;
  class_section_updated_at: string;

  // snapshots ringkas
  class_section_parent_name_snap?: string | null;
  class_section_parent_code_snap?: string | null;
  class_section_parent_slug_snap?: string | null;
  class_section_parent_level_snap?: string | number | null;

  class_section_room_name_snap?: string | null;
  class_section_room_location_snap?: string | null;

  class_section_term_name_snap?: string | null;
  class_section_term_slug_snap?: string | null;
  class_section_term_year_label_snap?: string | null;

  class_section_room_snapshot?: RoomSnap | null;
  class_section_term_snapshot?: TermSnap | null;
};

type ApiSectionList = {
  data: ApiSection[];
  pagination?: unknown;
};

/* ================= Helpers ================= */
const scheduleText = (s?: ApiSchedule | null) => {
  if (!s) return "-";
  const days = (s.days ?? []).join(", ");
  const time =
    s.start && s.end ? `${s.start}–${s.end}` : s.start || s.end || "";
  const loc = s.location ? ` @${s.location}` : "";
  const left = [days, time].filter(Boolean).join(" ");
  return left ? `${left}${loc}` : "-";
};

/* ================= Fetcher: hanya section (tanpa csst) ================= */
async function fetchSectionOnly(
  schoolId: string,
  id: string
): Promise<ApiSection | null> {
  const r = await axios.get<ApiSectionList>(
    `/public/${schoolId}/class-sections/list`,
    { params: { id } }
  );
  return r.data?.data?.[0] ?? null;
}

/* ================= Edit Modal (inline) ================= */
function EditSectionModal({
  open,
  onClose,
  palette,
  data,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  palette: Palette;
  data: ApiSection;
  onSubmit: (payload: any) => void;
  loading?: boolean;
}) {
  const [name, setName] = useState(data.class_section_name ?? "");
  const [code, setCode] = useState(data.class_section_code ?? "");
  const [capacity, setCapacity] = useState(
    data.class_section_capacity ?? undefined
  );
  const [groupUrl, setGroupUrl] = useState(data.class_section_group_url ?? "");
  const [start, setStart] = useState(data.class_section_schedule?.start ?? "");
  const [end, setEnd] = useState(data.class_section_schedule?.end ?? "");
  const [location, setLocation] = useState(
    data.class_section_schedule?.location ?? ""
  );
  const [days, setDays] = useState<string[]>(
    data.class_section_schedule?.days ?? []
  );
  const [active, setActive] = useState<boolean>(data.class_section_is_active);

  const toggleDay = (d: string) =>
    setDays((old) =>
      old.includes(d) ? old.filter((x) => x !== d) : [...old, d]
    );

  const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"];

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ background: palette.white1, color: palette.black1 }}
      >
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${palette.silver1}` }}
        >
          <div className="font-semibold">Edit Section</div>
          <button onClick={onClose} className="opacity-70 hover:opacity-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm opacity-70">Nama</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 rounded-lg px-3 py-2 border"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white2,
                }}
                placeholder="Nama section"
              />
            </div>
            <div>
              <label className="text-sm opacity-70">Kode</label>
              <input
                value={code ?? ""}
                onChange={(e) => setCode(e.target.value)}
                className="w-full mt-1 rounded-lg px-3 py-2 border"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white2,
                }}
                placeholder="Kode unik"
              />
            </div>
            <div>
              <label className="text-sm opacity-70">Kapasitas</label>
              <input
                type="number"
                value={capacity ?? ""}
                onChange={(e) =>
                  setCapacity(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                className="w-full mt-1 rounded-lg px-3 py-2 border"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white2,
                }}
                placeholder="cth: 35"
              />
            </div>
            <div>
              <label className="text-sm opacity-70">Link Grup (opsional)</label>
              <input
                value={groupUrl}
                onChange={(e) => setGroupUrl(e.target.value)}
                className="w-full mt-1 rounded-lg px-3 py-2 border"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white2,
                }}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <div className="text-sm opacity-70 mb-1">Jadwal</div>
            <div className="grid md:grid-cols-3 gap-3">
              <input
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="rounded-lg px-3 py-2 border"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white2,
                }}
                placeholder="Mulai (07:30)"
              />
              <input
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="rounded-lg px-3 py-2 border"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white2,
                }}
                placeholder="Selesai (09:00)"
              />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-lg px-3 py-2 border"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white2,
                }}
                placeholder="Lokasi (Gedung A, Lt.2)"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {DAYS.map((d) => {
                const active = days.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1.5 rounded-lg border text-sm ${
                      active ? "font-semibold" : ""
                    }`}
                    style={{
                      borderColor: palette.silver1,
                      background: active ? palette.primary2 : palette.white1,
                      color: active ? palette.primary : palette.quaternary,
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="inline-flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span className="text-sm">Aktif</span>
          </label>
        </div>

        <div
          className="px-5 py-3 flex items-center justify-end gap-2"
          style={{ borderTop: `1px solid ${palette.silver1}` }}
        >
          <Btn palette={palette} variant="ghost" onClick={onClose}>
            Batal
          </Btn>
          <Btn
            palette={palette}
            onClick={() =>
              onSubmit({
                class_section_name: name,
                class_section_code: code || null,
                class_section_capacity: capacity ?? null,
                class_section_group_url: groupUrl || null,
                class_section_is_active: active,
                class_section_schedule: {
                  start: start || undefined,
                  end: end || undefined,
                  location: location || undefined,
                  days: days.length ? days : undefined,
                },
              })
            }
            disabled={loading}
          >
            <Check className="mr-2" size={16} />
            {loading ? "Menyimpan..." : "Simpan"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ================= Page ================= */
export default function SchoolSectionDetail() {
  const { id = "", schoolId = "" } = useParams<{
    id: string;
    schoolId: string;
  }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  // GET detail (tanpa csst)
  const { data: section, isLoading } = useQuery({
    queryKey: ["section-only", schoolId, id],
    enabled: !!schoolId && !!id,
    queryFn: () => fetchSectionOnly(schoolId, id),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  // PATCH
  const patchMut = useMutation({
    mutationFn: async (payload: any) => {
      // Sesuaikan endpoint protected kalian:
      // umum: PATCH /schools/{schoolId}/class-sections/{id}
      const url = `/schools/${schoolId}/class-sections/${id}`;
      const r = await axios.patch(url, payload);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["section-only", schoolId, id] });
      setOpenEdit(false);
    },
  });

  // DELETE
  const deleteMut = useMutation({
    mutationFn: async () => {
      const url = `/schools/${schoolId}/class-sections/${id}`;
      const r = await axios.delete(url);
      return r.data;
    },
    onSuccess: () => {
      // balik ke daftar kelas
      navigate(`/sekolah/${schoolId}/kelas`, { replace: true });
    },
  });

  const [openEdit, setOpenEdit] = useState(false);

  if (isLoading) {
    return (
      <div
        className="p-6 text-center"
        style={{ color: palette.black2, background: palette.white2 }}
      >
        Memuat data...
      </div>
    );
  }

  if (!section) {
    return (
      <div
        className="p-6 text-center"
        style={{ color: palette.black2, background: palette.white2 }}
      >
        Data section tidak ditemukan.
      </div>
    );
  }

  return (
    <div
      className="w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6 p-4">
          {/* Header */}
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
              <h1 className="text-lg font-semibold">Detail Section</h1>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                palette={palette}
                variant={
                  section.class_section_is_active ? "success" : "outline"
                }
              >
                {section.class_section_is_active ? "Aktif" : "Nonaktif"}
              </Badge>
              <Btn
                palette={palette}
                variant="outline"
                onClick={() => setOpenEdit(true)}
              >
                <Pencil size={16} className="mr-2" />
                Edit
              </Btn>
              <Btn
                palette={palette}
                variant="destructive"
                onClick={() => {
                  if (
                    confirm(
                      "Yakin ingin menghapus section ini? Tindakan tidak dapat dibatalkan."
                    )
                  ) {
                    deleteMut.mutate();
                  }
                }}
                disabled={deleteMut.isPending}
              >
                <Trash2 size={16} className="mr-2" />
                {deleteMut.isPending ? "Menghapus..." : "Hapus"}
              </Btn>
            </div>
          </div>

          {/* Ringkasan */}
          <SectionCard palette={palette} className="p-5">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                }}
              >
                <div className="text-sm opacity-70">Nama</div>
                <div className="font-semibold">
                  {section.class_section_name}
                </div>
                <div className="text-xs opacity-70 break-all">
                  slug: {section.class_section_slug}
                </div>
              </div>

              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                }}
              >
                <div className="text-sm opacity-70">Kode</div>
                <div className="font-semibold">
                  {section.class_section_code ?? "-"}
                </div>
                <div className="text-xs opacity-70">
                  ID: {section.class_section_id}
                </div>
              </div>

              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                }}
              >
                <div className="text-sm opacity-70">Tingkat / Parent</div>
                <div className="font-semibold">
                  {section.class_section_parent_name_snap ?? "-"}
                </div>
                <div className="text-xs opacity-70">
                  {section.class_section_parent_code_snap
                    ? `${section.class_section_parent_code_snap} · ${section.class_section_parent_slug_snap}`
                    : (section.class_section_parent_slug_snap ?? "-")}
                </div>
              </div>

              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                }}
              >
                <div className="text-sm opacity-70">Ruang</div>
                <div className="font-semibold">
                  {section.class_section_room_snapshot?.name ??
                    section.class_section_room_name_snap ??
                    "-"}
                </div>
                <div className="text-xs flex items-center gap-1 opacity-70">
                  {section.class_section_room_snapshot?.is_virtual ? (
                    <LinkIcon size={12} />
                  ) : (
                    <MapPin size={12} />
                  )}
                  {section.class_section_room_snapshot?.location ??
                    section.class_section_room_location_snap ??
                    "-"}
                </div>
              </div>

              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                }}
              >
                <div className="text-sm opacity-70">Tahun Ajaran / Term</div>
                <div className="font-semibold">
                  {section.class_section_term_snapshot?.name ??
                    section.class_section_term_name_snap ??
                    "-"}
                </div>
                <div className="text-xs opacity-70">
                  {section.class_section_term_snapshot?.slug ??
                    section.class_section_term_slug_snap ??
                    "-"}{" "}
                  ·{" "}
                  {section.class_section_term_snapshot?.year_label ??
                    section.class_section_term_year_label_snap ??
                    "-"}
                </div>
              </div>

              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: palette.silver1,
                  background: palette.white1,
                }}
              >
                <div className="text-sm opacity-70">Siswa</div>
                <div className="font-semibold">
                  {section.class_section_total_students ?? 0}
                </div>
                <div className="text-xs opacity-70">
                  Kapasitas: {section.class_section_capacity ?? "-"}
                </div>
              </div>
            </div>

            <div
              className="mt-4 rounded-xl border p-4"
              style={{
                borderColor: palette.silver1,
                background: palette.white1,
              }}
            >
              <div className="text-sm opacity-70">Jadwal</div>
              <div className="font-medium">
                {scheduleText(section.class_section_schedule)}
              </div>
              {!!section.class_section_group_url && (
                <a
                  href={section.class_section_group_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline inline-flex items-center gap-1 mt-1"
                  style={{ color: palette.primary }}
                >
                  <LinkIcon size={12} />
                  Link Grup
                </a>
              )}
            </div>

            <div className="pt-3 text-xs opacity-70">
              Dibuat:{" "}
              {new Date(section.class_section_created_at).toLocaleString()} •
              Diperbarui:{" "}
              {new Date(section.class_section_updated_at).toLocaleString()}
            </div>
          </SectionCard>
        </div>
      </main>

      {/* Modal Edit */}
      {openEdit && (
        <EditSectionModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          palette={palette}
          data={section}
          loading={patchMut.isPending}
          onSubmit={(payload) => patchMut.mutate(payload)}
        />
      )}
    </div>
  );
}
