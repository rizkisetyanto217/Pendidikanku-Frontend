// src/pages/pendidikanku-dashboard/dashboard-school/academic/SchoolAcademic.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pickTheme, type Palette } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import axios from "@/lib/axios";
import { useNavigate, useParams } from "react-router-dom";

import {
  CalendarDays,
  CheckCircle2,
  Users,
  Link as LinkIcon,
  Layers,
  Info,
  Loader2,
  Pencil,
  Trash2,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { Badge, Btn, SectionCard } from "../../components/ui/CPrimitives";
import { useTopBar } from "../../components/home/CUseTopBar";

/* === 🔌 DataViewKit components */
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

/* ===================== Types ===================== */
type AcademicTerm = {
  id: string;
  school_id: string;
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

type AcademicTermApi = {
  academic_term_id: string;
  academic_term_school_id: string;
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
  pagination?: { limit: number; offset: number; total: number };
};

/* ===================== Const & Helpers ===================== */
const API_PREFIX = "/public";
const ADMIN_PREFIX = "/a";
const TERMS_QKEY = (schoolId?: string) =>
  ["academic-terms-merged", schoolId] as const;

const dateShort = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

function normalizeAcademicYear(input: string) {
  const s = (input || "").trim();
  const m = s.match(/^(\d{4})\s*\/\s*(\d{2})$/);
  if (m) {
    const start = Number(m[1]);
    return `${start}/${start + 1}`;
  }
  const mFull = s.match(/^(\d{4})\s*\/\s*(\d{4})$/);
  if (mFull) return `${mFull[1]}/${mFull[2]}`;
  return s;
}

function extractErrorMessage(err: any) {
  const d = err?.response?.data;
  if (!d) return err?.message || "Request error";
  if (typeof d === "string") return d;
  if (d.message) return d.message;
  if (Array.isArray(d.errors)) {
    return d.errors
      .map((e: any) => [e.field, e.message].filter(Boolean).join(": "))
      .join("\n");
  }
  try {
    return JSON.stringify(d);
  } catch {
    return String(d);
  }
}

function toZDate(d: string) {
  if (!d) return "";
  if (d.includes("T")) return d;
  return `${d}T00:00:00Z`;
}

/* ========== Payload & mapping ========= */
type TermPayload = {
  academic_year: string;
  name: string;
  start_date: string; // yyyy-mm-dd
  end_date: string; // yyyy-mm-dd
  angkatan: number;
  is_active: boolean;
  slug?: string;
};

function mapApiToTerm(x: AcademicTermApi): AcademicTerm {
  return {
    id: x.academic_term_id,
    school_id: x.academic_term_school_id,
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

function mapPayloadToApi(p: TermPayload) {
  return {
    academic_term_academic_year: normalizeAcademicYear(p.academic_year),
    academic_term_name: p.name,
    academic_term_angkatan: Number(p.angkatan),
    academic_term_start_date: toZDate(p.start_date),
    academic_term_end_date: toZDate(p.end_date),
    academic_term_is_active: Boolean(p.is_active),
    ...(p.slug ? { academic_term_slug: p.slug } : {}),
  };
}

/* ===================== Mutations (CRUD) ===================== */
function useCreateTerm(schoolId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TermPayload) => {
      const { data } = await axios.post(
        `${ADMIN_PREFIX}/${encodeURIComponent(schoolId!)}/academic-terms`,
        mapPayloadToApi(payload)
      );
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: TERMS_QKEY(schoolId) });
      await qc.refetchQueries({
        queryKey: TERMS_QKEY(schoolId),
        type: "active",
      });
    },
  });
}

function useUpdateTerm(schoolId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: TermPayload;
    }) => {
      const { data } = await axios.patch(
        `${ADMIN_PREFIX}/${encodeURIComponent(schoolId!)}/academic-terms/${id}`,
        mapPayloadToApi(payload)
      );
      return data;
    },
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: TERMS_QKEY(schoolId) });
      const previous = qc.getQueryData<AcademicTerm[]>(TERMS_QKEY(schoolId));
      if (previous) {
        qc.setQueryData<AcademicTerm[]>(
          TERMS_QKEY(schoolId),
          previous.map((t) =>
            t.id === id
              ? {
                  ...t,
                  academic_year: normalizeAcademicYear(payload.academic_year),
                  name: payload.name,
                  start_date: toZDate(payload.start_date),
                  end_date: toZDate(payload.end_date),
                  angkatan: Number(payload.angkatan),
                  is_active: Boolean(payload.is_active),
                  slug: payload.slug ?? t.slug,
                }
              : t
          )
        );
      }
      return { previous };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(TERMS_QKEY(schoolId), ctx.previous);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: TERMS_QKEY(schoolId) });
      await qc.refetchQueries({
        queryKey: TERMS_QKEY(schoolId),
        type: "active",
      });
    },
  });
}

function useDeleteTerm(schoolId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(
        `${ADMIN_PREFIX}/${encodeURIComponent(schoolId!)}/academic-terms/${id}`
      );
      return data ?? { ok: true };
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: TERMS_QKEY(schoolId) });
      const previous = qc.getQueryData<AcademicTerm[]>(TERMS_QKEY(schoolId));
      if (previous) {
        qc.setQueryData<AcademicTerm[]>(
          TERMS_QKEY(schoolId),
          previous.filter((t) => t.id !== id)
        );
      }
      return { previous };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(TERMS_QKEY(schoolId), ctx.previous);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: TERMS_QKEY(schoolId) });
      await qc.refetchQueries({
        queryKey: TERMS_QKEY(schoolId),
        type: "active",
      });
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
    angkatan: Number(initial?.angkatan ?? new Date().getFullYear()),
    is_active: Boolean(initial?.is_active ?? false),
    slug: initial?.slug ?? "",
  }));

  useEffect(() => {
    if (!open) return;
    setValues({
      academic_year: initial?.academic_year ?? "",
      name: initial?.name ?? "",
      start_date: initial?.start_date ?? "",
      end_date: initial?.end_date ?? "",
      angkatan: Number(initial?.angkatan ?? new Date().getFullYear()),
      is_active: Boolean(initial?.is_active ?? false),
      slug: initial?.slug ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const set = <K extends keyof TermPayload>(k: K, v: TermPayload[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  const canSubmit =
    values.academic_year.trim() &&
    values.name.trim() &&
    values.start_date &&
    values.end_date &&
    new Date(values.end_date) > new Date(values.start_date) &&
    Number.isFinite(values.angkatan) &&
    values.angkatan > 0;

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
              value={values.slug || ""}
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
const SchoolAcademic: React.FC<{
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
}> = () => {
  const { schoolId } = useParams<{ schoolId: string }>();

  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as any, isDark);
  const navigate = useNavigate();

  const { setTopBar, resetTopBar } = useTopBar();
  useEffect(() => {
    setTopBar({ mode: "back", title: "Periode Akademik" });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  useEffect(() => {
    if (!schoolId) console.warn("[SchoolAcademic] Missing :schoolId in params");
  }, [schoolId]);

  const termsQ = useQuery<AcademicTerm[], Error>({
    queryKey: TERMS_QKEY(schoolId),
    enabled: !!schoolId,
    staleTime: 60_000,
    retry: 1,
    // v5 pengganti keepPreviousData
    placeholderData: (prev) => prev ?? [],
    queryFn: async () => {
      const res = await axios.get<AdminTermsResponse>(
        `${API_PREFIX}/${encodeURIComponent(schoolId!)}/academic-terms/list`,
        { params: { limit: 999, offset: 0, _: Date.now() } }
      );
      const raw = res.data?.data ?? [];
      return raw.map(mapApiToTerm);
    },
  });

  const terms: AcademicTerm[] = termsQ.data ?? [];

  /* ==== 🔎 Search (sinkron ?q=) */
  const { q, setQ } = useSearchQuery("q") as {
    q: string;
    setQ: (v: string) => void;
  };

  const filtered: AcademicTerm[] = useMemo(() => {
    const s = (q || "").toLowerCase().trim();
    if (!s) return terms;
    return terms.filter(
      (t) =>
        t.academic_year.toLowerCase().includes(s) ||
        t.name.toLowerCase().includes(s) ||
        String(t.angkatan).includes(s)
    );
  }, [terms, q]);

  /* ==== ⏭ Pagination */
  const total = filtered.length;
  const {
    offset,
    limit,
    setLimit,
    pageStart,
    pageEnd,
    canPrev,
    canNext,
    handlePrev,
    handleNext,
  } = useOffsetLimit(total, 20, 200);

  const pageTerms: AcademicTerm[] = useMemo(
    () => filtered.slice(offset, Math.min(offset + limit, total)),
    [filtered, offset, limit, total]
  );

  const activeTerm: AcademicTerm | null = useMemo(() => {
    if (!terms.length) return null;
    const actives = terms.filter((t) => t.is_active);
    return actives[0] ?? terms[0] ?? null;
  }, [terms]);

  const createTerm = useCreateTerm(schoolId);
  const updateTerm = useUpdateTerm(schoolId);
  const deleteTerm = useDeleteTerm(schoolId);

  const [modal, setModal] = useState<{
    mode: "create" | "edit";
    editing?: AcademicTerm | null;
  } | null>(null);

  const modalInitial = useMemo(() => {
    if (!(modal?.mode === "edit" && modal.editing)) return undefined;
    const e = modal.editing;
    return {
      academic_year: e.academic_year,
      name: e.name,
      start_date: e.start_date?.slice(0, 10) ?? "",
      end_date: e.end_date?.slice(0, 10) ?? "",
      angkatan: e.angkatan,
      is_active: e.is_active,
      slug: e.slug ?? "",
    } as Partial<TermPayload>;
  }, [modal?.mode, modal?.editing?.id]);

  /* ==== Kolom DataTable (desktop) */
  const columns: Column<AcademicTerm>[] = useMemo(
    () => [
      {
        key: "year",
        header: "Tahun Ajaran",
        cell: (t) => <span className="font-medium">{t.academic_year}</span>,
      },
      { key: "name", header: "Nama", cell: (t) => t.name },
      {
        key: "date",
        header: "Tanggal",
        cell: (t) => `${dateShort(t.start_date)} — ${dateShort(t.end_date)}`,
      },
      { key: "angkatan", header: "Angkatan", cell: (t) => t.angkatan },
      {
        key: "status",
        header: "Status",
        cell: (t) => (
          <Badge
            palette={palette}
            variant={t.is_active ? "success" : "outline"}
          >
            {t.is_active ? "Aktif" : "Nonaktif"}
          </Badge>
        ),
      },
      {
        key: "aksi",
        header: "Aksi",
        cell: (t) => (
          <div className="flex items-center gap-2">
            <Btn
              palette={palette}
              size="sm"
              variant="secondary"
              onClick={() => setModal({ mode: "edit", editing: t })}
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
        ),
      },
    ],
    [palette, deleteTerm]
  );

  const handleSubmit = useCallback(
    (v: TermPayload) => {
      if (modal?.mode === "edit" && modal.editing) {
        updateTerm.mutate(
          { id: modal.editing.id, payload: v },
          {
            onSuccess: () => setModal(null),
            onError: (e: any) =>
              alert(extractErrorMessage(e) || "Gagal memperbarui term"),
          }
        );
      } else {
        createTerm.mutate(v, {
          onSuccess: () => setModal(null),
          onError: (e: any) =>
            alert(extractErrorMessage(e) || "Gagal membuat term"),
        });
      }
    },
    [modal, updateTerm, createTerm]
  );

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
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
    <h1>Periode Akademik</h1>
  </div>

  {/* Search + per-page */}
  <div className="order-3 sm:order-2 w-full sm:w-auto flex-1 min-w-0">
    <SearchBar
      palette={palette}
      value={q}
      onChange={setQ}
      placeholder="Cari tahun, nama, atau angkatan…"
      debounceMs={500}
      className="w-full"
      rightExtra={
        <PerPageSelect
          palette={palette}
          value={limit}
          onChange={(n) => setLimit(n)}
        />
      }
    />
  </div>

  {/* Tombol Tambah */}
  <div className="order-2 sm:order-3 ml-auto flex items-center gap-2">
    <Btn
      palette={palette}
      size="sm"
      className="gap-1"
      onClick={() => setModal({ mode: "create" })}
    >
       <Plus size={16} className="mr-1" />Tambah
    </Btn>
  </div>
  
</div>


      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main */}
          <section className="flex-1 flex flex-col space-y-6 min-w-0">
            {/* ===== Ringkasan term aktif ===== */}
            <SectionCard palette={palette} className="overflow-hidden ">
              <div className="p-5">
                {termsQ.isLoading ? (
                  <div className="flex items-center gap-2 text-sm opacity-70">
                    <Loader2 className="animate-spin" size={16} /> Memuat
                    periode akademik…
                  </div>
                ) : termsQ.isError ? (
                  <div
                    className="rounded-xl border p-4 text-sm space-y-2"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.black2,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Info size={16} /> Gagal memuat periode akademik.
                    </div>
                    <pre className="text-xs opacity-70 overflow-auto">
                      {extractErrorMessage(termsQ.error)}
                    </pre>
                    <Btn
                      palette={palette}
                      size="sm"
                      onClick={() => termsQ.refetch()}
                    >
                      Coba lagi
                    </Btn>
                  </div>
                ) : !activeTerm ? (
                  <div
                    className="rounded-xl border p-4 text-sm flex items-center gap-2"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.silver2,
                    }}
                  >
                    <Info size={16} /> Belum ada periode akademik.
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
                        <CalendarDays size={16} />{" "}
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
                        <CheckCircle2 size={16} /> Status:{" "}
                        {activeTerm.is_active ? "Aktif" : "Nonaktif"}
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
                  <Layers size={18} color={palette.quaternary} /> Daftar Periode
                </div>
                <div className="text-sm" style={{ color: palette.black2 }}>
                  {termsQ.isFetching ? "memuat…" : `${total} total`}
                </div>
              </div>

              <div className="p-4 md:p-5">
                {termsQ.isLoading ? (
                  <div className="flex items-center gap-2 text-sm opacity-70">
                    <Loader2 className="animate-spin" size={16} /> Memuat…
                  </div>
                ) : total === 0 ? (
                  <div
                    className="rounded-xl border p-4 text-sm flex items-center gap-2"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.silver2,
                    }}
                  >
                    <Info size={16} /> Belum ada data.
                  </div>
                ) : (
                  <>
                    {/* Mobile: Cards */}
                    <div className="md:hidden">
                      <CardGrid<AcademicTerm>
                        items={pageTerms}
                        renderItem={(t: AcademicTerm) => (
                          <TermCard
                            key={t.id}
                            term={t}
                            palette={palette}
                            onEdit={() =>
                              setModal({ mode: "edit", editing: t })
                            }
                            onDelete={() => {
                              const ok = confirm(
                                `Hapus periode?\n${t.academic_year} — ${t.name}`
                              );
                              if (!ok) return;
                              deleteTerm.mutate(t.id);
                            }}
                          />
                        )}
                      />
                    </div>

                    {/* Tablet/Desktop: Table */}
                    <div className="hidden md:block">
                      <DataTable<AcademicTerm>
                        palette={palette}
                        columns={columns}
                        rows={pageTerms}
                        minWidth={840}
                      />
                    </div>

                    {/* ===== Pagination Footer ===== */}
                    <PaginationBar
                      palette={palette}
                      pageStart={pageStart}
                      pageEnd={pageEnd}
                      total={total}
                      canPrev={canPrev}
                      canNext={canNext}
                      onPrev={handlePrev}
                      onNext={handleNext}
                      rightExtra={
                        <span
                          className="text-sm"
                          style={{ color: palette.black2 }}
                        >
                          {termsQ.isFetching ? "memuat…" : `${total} total`}
                        </span>
                      }
                    />
                  </>
                )}
              </div>
            </SectionCard>
          </section>
        </div>
      </main>

      {/* ===== Modal Create/Edit ===== */}
      <TermFormModal
        key={modal?.editing?.id ?? modal?.mode ?? "closed"}
        open={!!modal}
        onClose={() => setModal(null)}
        palette={palette}
        initial={modalInitial}
        loading={createTerm.isPending || updateTerm.isPending}
        onSubmit={handleSubmit}
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

export default SchoolAcademic;