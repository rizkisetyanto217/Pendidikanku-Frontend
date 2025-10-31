// src/pages/sekolahislamku/academic/AcademicSchool.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import axios from "@/lib/axios";
import {
  useNavigate,
  useParams,
  Link,
  useSearchParams,
} from "react-router-dom";

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
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTopBar } from "../../components/home/UseTopBar";

/* ===================== Types ===================== */
type AcademicTerm = {
  id: string;
  masjid_id: string;
  academic_year: string;
  name: string;
  start_date: string;
  end_date: string;
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
  class_rooms_location: string;
  class_rooms_is_virtual: boolean;
  class_rooms_floor?: number;
  class_rooms_capacity: number;
  class_rooms_description?: string;
  class_rooms_is_active?: boolean;
  class_rooms_features?: string[];
};

type SchoolAcademicProps = {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
};

/* ========== API types (server payload) ========= */
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

type AdminTermsResponse = {
  data: AcademicTermApi[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
};

/* ===================== Dummy Rooms (tetap) ===================== */
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

/* ===== Mobile-only horizontal scroll helpers (untuk md+ table) ===== */
function ScrollShadows() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white dark:from-neutral-900 to-transparent rounded-l-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white dark:from-neutral-900 to-transparent rounded-r-2xl"
      />
    </>
  );
}

function MobileScrollArea({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative" aria-label="Scrollable table region">
      <div
        className="overflow-x-auto overscroll-x-contain max-w-full rounded-2xl border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm"
        role="region"
        aria-roledescription="horizontal scroller"
        tabIndex={0}
      >
        <ScrollShadows />
        {children}
      </div>
      <p className="mt-2 text-[11px] text-gray-500">
        Geser tabel ke kiri/kanan untuk melihat semua kolom.
      </p>
    </div>
  );
}

/* ===================== React Query: ADMIN terms ===================== */
function useAdminAcademicTerms(params: {
  masjidId?: string;
  limit: number;
  offset: number;
  q?: string;
}) {
  const { masjidId, limit, offset, q } = params;
  return useQuery<AdminTermsResponse>({
    queryKey: ["admin-academic-terms", { masjidId, limit, offset, q }],
    enabled: !!masjidId,
    staleTime: 60_000,
    retry: 1,
    queryFn: async () => {
      // GET list by masjid_id (public listing untuk halaman ini)
      const res = await axios.get<AdminTermsResponse>(
        `/public/${encodeURIComponent(masjidId!)}/academic-terms/list`,
        {
          withCredentials: true,
          params: { limit, offset, q },
        }
      );
      return res.data;
    },
  });
}

type TermPayload = {
  academic_year: string;
  name: string;
  start_date: string; // yyyy-mm-dd
  end_date: string; // yyyy-mm-dd
  angkatan: number;
  is_active: boolean;
  slug?: string;
};

function useCreateTerm(masjidId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TermPayload) => {
      const r = await axios.post(
        `/a/${encodeURIComponent(masjidId!)}/academic-terms`,
        payload,
        { withCredentials: true }
      );
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-academic-terms"] });
    },
  });
}

function useUpdateTerm(masjidId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: TermPayload;
    }) => {
      const r = await axios.put(
        `/a/${encodeURIComponent(masjidId!)}/academic-terms/${id}`,
        payload,
        { withCredentials: true }
      );
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-academic-terms"] });
    },
  });
}

function useDeleteTerm(masjidId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const r = await axios.delete(
        `/a/${encodeURIComponent(masjidId!)}/academic-terms/${id}`,
        { withCredentials: true }
      );
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-academic-terms"] });
    },
  });
}

/* ===================== Small Form Modal ===================== */
function TermFormModal({
  open,
  onClose,
  palette,
  initial,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  palette: Palette;
  initial?: Partial<TermPayload>;
  onSubmit: (values: TermPayload) => void;
  loading?: boolean;
}) {
  const [values, setValues] = useState<TermPayload>(() => ({
    academic_year: initial?.academic_year ?? "",
    name: initial?.name ?? "",
    start_date: initial?.start_date ?? "",
    end_date: initial?.end_date ?? "",
    angkatan: initial?.angkatan ?? new Date().getFullYear(),
    is_active: initial?.is_active ?? false,
    slug: initial?.slug ?? "",
  }));

  if (!open) return null;

  const set = (k: keyof TermPayload, v: any) =>
    setValues((s) => ({ ...s, [k]: v }));

  const canSubmit =
    values.academic_year.trim() &&
    values.name.trim() &&
    values.start_date &&
    values.end_date &&
    values.angkatan >= 1900;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-2xl border p-5 space-y-4"
        style={{
          background: palette.white1,
          borderColor: palette.silver1,
          color: palette.black1,
        }}
      >
        <div className="text-lg font-semibold">Periode Akademik</div>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-sm opacity-80">Tahun Ajaran</label>
            <input
              value={values.academic_year}
              onChange={(e) => set("academic_year", e.target.value)}
              placeholder="2025/2026"
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent"
              style={{ borderColor: palette.silver1 }}
            />
          </div>
          <div>
            <label className="text-sm opacity-80">Nama Periode</label>
            <input
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ganjil / Genap"
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent"
              style={{ borderColor: palette.silver1 }}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm opacity-80">Mulai</label>
              <input
                type="date"
                value={values.start_date}
                onChange={(e) => set("start_date", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent"
                style={{ borderColor: palette.silver1 }}
              />
            </div>
            <div>
              <label className="text-sm opacity-80">Selesai</label>
              <input
                type="date"
                value={values.end_date}
                onChange={(e) => set("end_date", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent"
                style={{ borderColor: palette.silver1 }}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm opacity-80">Angkatan</label>
              <input
                type="number"
                value={values.angkatan}
                onChange={(e) => set("angkatan", Number(e.target.value || 0))}
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent"
                style={{ borderColor: palette.silver1 }}
              />
            </div>
            <div className="flex items-end gap-2">
              <input
                id="is_active"
                type="checkbox"
                checked={values.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
              />
              <label htmlFor="is_active" className="text-sm">
                Aktif
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm opacity-80">Slug (opsional)</label>
            <input
              value={values.slug ?? ""}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="ganjil-2025"
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent"
              style={{ borderColor: palette.silver1 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Btn
            palette={palette}
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Btn>
          <Btn
            palette={palette}
            onClick={() => onSubmit(values)}
            disabled={!canSubmit || loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Simpan"
            )}
          </Btn>
        </div>
      </div>
    </div>
  );
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
  const [sp, setSp] = useSearchParams();

  const { setTopBar, resetTopBar } = useTopBar();

  useEffect(() => {
    // Tampilkan menubar + judul halaman
    setTopBar({
      mode: "back",
      title: "Periode Akademik",
    });
    return resetTopBar; // bersihkan saat unmount
  }, [setTopBar, resetTopBar]);

  // filter rooms
  const [filter, setFilter] = useState<"all" | "physical" | "virtual">("all");

  // pagination + search untuk terms
  const limit = Math.min(Math.max(Number(sp.get("limit") || 20), 1), 200);
  const offset = Math.max(Number(sp.get("offset") || 0), 0);
  const [q, setQ] = useState(sp.get("q") || "");

  const termsQ = useAdminAcademicTerms({
    masjidId: masjid_id,
    limit,
    offset,
    q,
  });
  const terms: AcademicTerm[] = useMemo(
    () => (termsQ.data?.data ?? []).map(mapApiTermToUI),
    [termsQ.data]
  );

  const activeTerm: AcademicTerm | null = useMemo(() => {
    if (!terms.length) return null;
    const actives = terms.filter((t) => t.is_active);
    return actives[0] ?? terms[0] ?? null;
  }, [terms]);

  // CRUD hooks
  const createTerm = useCreateTerm(masjid_id);
  const updateTerm = useUpdateTerm(masjid_id);
  const deleteTerm = useDeleteTerm(masjid_id);

  const [modal, setModal] = useState<{
    mode: "create" | "edit";
    editing?: AcademicTerm | null;
  } | null>(null);

  const total = termsQ.data?.pagination?.total ?? terms.length;
  const onPage = (dir: -1 | 1) => {
    const nextOffset = Math.max(offset + dir * limit, 0);
    if (nextOffset === offset) return;
    setSp(
      (prev) => {
        const p = new URLSearchParams(prev);
        p.set("limit", String(limit));
        p.set("offset", String(nextOffset));
        if (q) p.set("q", q);
        return p;
      },
      { replace: true }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Rooms (dummy)
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
            {/* <div className="flex items-center justify-between ">
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
                <h1 className="items-center md:flex">Periode Akademik</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari (tahun ajaran/nama)…"
                    className="pl-3 pr-3 py-2 rounded-lg text-sm border w-64 bg-transparent"
                    style={{ borderColor: palette.silver1 }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSp(
                          (prev) => {
                            const p = new URLSearchParams(prev);
                            if (q) p.set("q", q);
                            else p.delete("q");
                            p.set("offset", "0");
                            p.set("limit", String(limit));
                            return p;
                          },
                          { replace: true }
                        );
                      }
                    }}
                  />
                </div>
                <Btn
                  palette={palette}
                  onClick={() => setModal({ mode: "create" })}
                  className="inline-flex items-center gap-2"
                >
                  <Plus size={18} /> Tambah
                </Btn>
              </div>
            </div> */}

            {/* ===== Ringkasan term aktif (opsional) ===== */}
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

            {/* ===== Daftar semua terms + aksi ===== */}
            <SectionCard palette={palette}>
              <div
                className="p-4 md:p-5 pb-3 border-b flex items-center justify-between gap-2"
                style={{ borderColor: palette.silver1 }}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Layers size={18} color={palette.quaternary} />
                  Daftar Periode
                </div>
                <div className="text-sm" style={{ color: palette.black2 }}>
                  {termsQ.isFetching ? "memuat…" : `${total} total`}
                </div>
              </div>

              <div className="p-4 md:p-5">
                {termsQ.isLoading ? (
                  <div className="flex items-center gap-2 text-sm opacity-70">
                    <Loader2 className="animate-spin" size={16} />
                    Memuat…
                  </div>
                ) : terms.length === 0 ? (
                  <div
                    className="rounded-xl border p-4 text-sm flex items-center gap-2"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.silver2,
                    }}
                  >
                    <Info size={16} />
                    Belum ada data.
                  </div>
                ) : (
                  <>
                    {/* Mobile: Cards */}
                    <div className="md:hidden grid grid-cols-1 gap-3">
                      {terms.map((t) => (
                        <TermCard
                          key={t.id}
                          term={t}
                          palette={palette}
                          onEdit={() => setModal({ mode: "edit", editing: t })}
                          onDelete={() => {
                            const ok = confirm(
                              `Hapus periode?\n${t.academic_year} — ${t.name}`
                            );
                            if (!ok) return;
                            deleteTerm.mutate(t.id);
                          }}
                        />
                      ))}
                    </div>

                    {/* Tablet/Desktop: Table */}
                    <div className="hidden md:block">
                      <MobileScrollArea>
                        <table className="min-w-[840px] w-full text-sm text-left">
                          <thead>
                            <tr className="bg-gray-50/80 dark:bg-neutral-800/60">
                              {[
                                "Tahun Ajaran",
                                "Nama",
                                "Tanggal",
                                "Angkatan",
                                "Status",
                                "Aksi",
                              ].map((h) => (
                                <th
                                  key={h}
                                  scope="col"
                                  className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300 backdrop-blur supports-[backdrop-filter]:bg-gray-50/70 dark:supports-[backdrop-filter]:bg-neutral-800/50"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                            {terms.map((t) => (
                              <tr key={t.id} className="hover:bg-black/5">
                                <td className="px-4 py-3 font-medium">
                                  {t.academic_year}
                                </td>
                                <td className="px-4 py-3">{t.name}</td>
                                <td className="px-4 py-3">
                                  {dateShort(t.start_date)} —{" "}
                                  {dateShort(t.end_date)}
                                </td>
                                <td className="px-4 py-3">{t.angkatan}</td>
                                <td className="px-4 py-3">
                                  <Badge
                                    palette={palette}
                                    variant={
                                      t.is_active ? "success" : "outline"
                                    }
                                  >
                                    {t.is_active ? "Aktif" : "Nonaktif"}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <Btn
                                      palette={palette}
                                      size="sm"
                                      variant="secondary"
                                      onClick={() =>
                                        setModal({ mode: "edit", editing: t })
                                      }
                                      className="inline-flex items-center gap-1"
                                    >
                                      <Pencil size={14} /> Edit
                                    </Btn>
                                    <Btn
                                      palette={palette}
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        const ok = confirm(
                                          `Hapus periode?\n${t.academic_year} — ${t.name}`
                                        );
                                        if (!ok) return;
                                        deleteTerm.mutate(t.id);
                                      }}
                                      className="inline-flex items-center gap-1"
                                    >
                                      <Trash2 size={14} /> Hapus
                                    </Btn>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </MobileScrollArea>
                    </div>
                  </>
                )}

                {/* Pagination di luar area scroll */}
                {total > limit && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm" style={{ color: palette.black2 }}>
                      Menampilkan {Math.min(limit, total - offset)} dari {total}
                    </div>
                    <div className="flex items-center gap-2">
                      <Btn
                        palette={palette}
                        onClick={() => onPage(-1)}
                        disabled={offset <= 0}
                      >
                        Prev
                      </Btn>
                      <Btn
                        palette={palette}
                        onClick={() => onPage(1)}
                        disabled={offset + limit >= total}
                      >
                        Next
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* ===== Daftar Rooms (dummy seperti sebelumnya) ===== */}
            <SectionCard palette={palette}>
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

      {/* ===== Modal Create/Edit ===== */}
      <TermFormModal
        open={!!modal}
        onClose={() => setModal(null)}
        palette={palette}
        initial={
          modal?.mode === "edit" && modal.editing
            ? {
                academic_year: modal.editing.academic_year,
                name: modal.editing.name,
                start_date: modal.editing.start_date?.slice(0, 10),
                end_date: modal.editing.end_date?.slice(0, 10),
                angkatan: modal.editing.angkatan,
                is_active: modal.editing.is_active,
                slug: modal.editing.slug,
              }
            : undefined
        }
        loading={createTerm.isPending || updateTerm.isPending}
        onSubmit={(v) => {
          if (modal?.mode === "edit" && modal.editing) {
            updateTerm.mutate(
              {
                id: modal.editing.id,
                payload: v,
              },
              {
                onSuccess: () => setModal(null),
                onError: (e: any) =>
                  alert(e?.response?.data?.message ?? "Gagal memperbarui term"),
              }
            );
          } else {
            createTerm.mutate(v, {
              onSuccess: () => setModal(null),
              onError: (e: any) =>
                alert(e?.response?.data?.message ?? "Gagal membuat term"),
            });
          }
        }}
      />
    </div>
  );
};

/* ===================== Small UI ===================== */
function TermCard({
  term,
  palette,
  onEdit,
  onDelete,
}: {
  term: AcademicTerm;
  palette: Palette;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-3"
      style={{ borderColor: palette.silver1, background: palette.white1 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold truncate">
            {term.academic_year} — {term.name}
          </div>
          <div className="text-sm mt-0.5" style={{ color: palette.black2 }}>
            {dateShort(term.start_date)} — {dateShort(term.end_date)}
          </div>
        </div>
        <Badge
          palette={palette}
          variant={term.is_active ? "success" : "outline"}
        >
          {term.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      </div>

      <div
        className="flex flex-wrap items-center gap-3 text-sm"
        style={{ color: palette.black2 }}
      >
        <span className="inline-flex items-center gap-1">
          <Users size={14} /> Angkatan {term.angkatan}
        </span>
        {term.slug && (
          <span className="inline-flex items-center gap-1 opacity-80">
            <LinkIcon size={14} /> {term.slug}
          </span>
        )}
      </div>

      <div className="pt-1 mt-1 flex items-center justify-end gap-2">
        <Btn
          palette={palette}
          size="sm"
          variant="secondary"
          onClick={onEdit}
          className="inline-flex items-center gap-1"
        >
          <Pencil size={14} /> Edit
        </Btn>
        <Btn
          palette={palette}
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="inline-flex items-center gap-1"
        >
          <Trash2 size={14} /> Hapus
        </Btn>
      </div>
    </div>
  );
}

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
