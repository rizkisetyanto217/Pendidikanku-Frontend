// src/pages/pendidikanku-dashboard/dashboard-school/academic/SchoolDetailAcademic.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ArrowLeft,
  School,
  Flag,
  Pencil,
  Trash2,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { useTopBar } from "../../components/home/CUseTopBar";

/* ===== Type ===== */
type AcademicTerm = {
  academic_terms_school_id: string;
  academic_terms_academic_year: string;
  academic_terms_name: string;
  academic_terms_start_date: string;
  academic_terms_end_date: string;
  academic_terms_is_active: boolean;
  academic_terms_angkatan: number;
  academic_terms_id?: string;
};

/* ===== Dummy fallback ===== */
const DUMMY_TERM: AcademicTerm = {
  academic_terms_school_id: "dummy-school",
  academic_terms_academic_year: "2025/2026",
  academic_terms_name: "Ganjil",
  academic_terms_start_date: "2025-07-15T00:00:00+07:00",
  academic_terms_end_date: "2026-01-10T23:59:59+07:00",
  academic_terms_is_active: true,
  academic_terms_angkatan: 2025,
};

/* ===== Helpers ===== */
const dateLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

const dateShort = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const toLocalNoonISO = (d: Date) => {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x.toISOString();
};

/* ===================== ✏️ Modal Edit ===================== */
function EditTermModal({
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
  data: AcademicTerm;
  onSubmit: (payload: any) => void;
  loading?: boolean;
}) {
  const [values, setValues] = useState({
    academic_year: data.academic_terms_academic_year,
    name: data.academic_terms_name,
    start_date: data.academic_terms_start_date.slice(0, 10),
    end_date: data.academic_terms_end_date.slice(0, 10),
    angkatan: data.academic_terms_angkatan,
    is_active: data.academic_terms_is_active,
  });

  if (!open) return null;
  const set = (k: string, v: any) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: palette.white1, color: palette.black1 }}
      >
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${palette.silver1}` }}
        >
          <div className="font-semibold">Edit Periode Akademik</div>
          <button onClick={onClose} className="opacity-70 hover:opacity-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <label className="text-sm opacity-70">Tahun Ajaran</label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              style={{ borderColor: palette.silver1, background: palette.white2 }}
              value={values.academic_year}
              onChange={(e) => set("academic_year", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm opacity-70">Nama Periode</label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              style={{ borderColor: palette.silver1, background: palette.white2 }}
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm opacity-70">Tanggal Mulai</label>
              <input
                type="date"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                style={{ borderColor: palette.silver1 }}
                value={values.start_date}
                onChange={(e) => set("start_date", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm opacity-70">Tanggal Selesai</label>
              <input
                type="date"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                style={{ borderColor: palette.silver1 }}
                value={values.end_date}
                onChange={(e) => set("end_date", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm opacity-70">Angkatan</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              style={{ borderColor: palette.silver1 }}
              value={values.angkatan}
              onChange={(e) => set("angkatan", Number(e.target.value))}
            />
          </div>
          <label className="inline-flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={values.is_active}
              onChange={(e) => set("is_active", e.target.checked)}
            />
            <span className="text-sm">Aktif</span>
          </label>
        </div>

        <div
          className="px-5 py-3 flex items-center justify-end gap-2"
          style={{ borderTop: `1px solid ${palette.silver1}` }}
        >
          <Btn palette={palette} variant="destructive" onClick={onClose}>
            Batal
          </Btn>
          <Btn palette={palette} onClick={() => onSubmit(values)} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} className="mr-1" />}
            Simpan
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ===================== Page ===================== */
export default function SchoolDetailAcademic() {
  const { id: termId, schoolId } = useParams<{ id: string; schoolId: string }>();
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { setTopBar, resetTopBar } = useTopBar();
  useEffect(() => {
    setTopBar({ mode: "back", title: "Detail Akademik" });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  const { state } = useLocation() as { state?: { term?: AcademicTerm } };
  const term = useMemo<AcademicTerm>(() => state?.term ?? DUMMY_TERM, [state?.term]);

  /* === PATCH (edit) === */
  const patchMut = useMutation({
    mutationFn: async (payload: any) => {
      const url = `/schools/${term.academic_terms_school_id}/academic-terms/${termId}`;
      const res = await axios.patch(url, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries();
      setOpenEdit(false);
    },
  });

  /* === DELETE === */
  const deleteMut = useMutation({
    mutationFn: async () => {
      const url = `/schools/${term.academic_terms_school_id}/academic-terms/${termId}`;
      const res = await axios.delete(url);
      return res.data;
    },
    onSuccess: () => {
      navigate(`/dashboard-school/${term.academic_terms_school_id}/academic`, { replace: true });
    },
  });

  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div className="w-full" style={{ background: palette.white2, color: palette.black1 }}>
      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6 ">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-2">
              <Btn palette={palette} variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} className="mr-1" />
              </Btn>
              <h1 className="text-lg font-semibold">Detail Akademik</h1>
            </div>

            <div className="flex items-center gap-2">
              <Btn palette={palette} variant="outline" onClick={() => setOpenEdit(true)}>
                <Pencil size={16} className="mr-2" />
                Edit
              </Btn>
              <Btn
                palette={palette}
                variant="destructive"
                onClick={() => {
                  if (confirm("Yakin ingin menghapus periode ini?")) deleteMut.mutate();
                }}
                disabled={deleteMut.isPending}
              >
                <Trash2 size={16} className="mr-2" />
                {deleteMut.isPending ? "Menghapus..." : "Hapus"}
              </Btn>
            </div>
          </div>

          {/* Info utama */}
          <SectionCard palette={palette} className="overflow-hidden">
            <div
              className="px-5 py-4 border-b flex items-center gap-3"
              style={{ borderColor: palette.silver1 }}
            >
              <School size={20} color={palette.quaternary} />
              <div className="font-semibold">Periode Akademik</div>
              {term.academic_terms_is_active && (
                <span
                  className="ml-auto text-sm px-2.5 py-1 rounded-full"
                  style={{
                    background: palette.success2,
                    color: palette.success1,
                  }}
                >
                  Aktif
                </span>
              )}
            </div>

            <div className="p-5 grid md:grid-cols-2 gap-4">
              <InfoRow
                palette={palette}
                icon={<CalendarDays size={18} />}
                label="Tahun Ajaran / Semester"
                value={`${term.academic_terms_academic_year} — ${term.academic_terms_name}`}
              />
              <InfoRow
                palette={palette}
                icon={<CheckCircle2 size={18} />}
                label="Status"
                value={term.academic_terms_is_active ? "Aktif" : "Nonaktif"}
              />
              <InfoRow
                palette={palette}
                icon={<Flag size={18} />}
                label="Angkatan"
                value={term.academic_terms_angkatan}
              />
              <InfoRow
                palette={palette}
                icon={<Clock size={18} />}
                label="Durasi"
                value={`${dateShort(term.academic_terms_start_date)} s/d ${dateShort(
                  term.academic_terms_end_date
                )}`}
              />
            </div>
          </SectionCard>
        </div>
      </main>

      {/* Modal Edit */}
      {openEdit && (
        <EditTermModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          palette={palette}
          data={term}
          loading={patchMut.isPending}
          onSubmit={(payload) => patchMut.mutate(payload)}
        />
      )}
    </div>
  );
}

/* ===== Small UI ===== */
function InfoRow({
  palette,
  icon,
  label,
  value,
}: {
  palette: Palette;
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 rounded-lg grid place-items-center shrink-0"
        style={{ background: palette.primary2, color: palette.primary }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm" style={{ color: palette.black2 }}>
          {label}
        </div>
        <div className="text-sm font-medium break-words">{value}</div>
      </div>
    </div>
  );
}
