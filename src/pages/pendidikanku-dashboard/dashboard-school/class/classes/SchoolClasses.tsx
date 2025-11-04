// src/pages/pendidikanku-dashboard/dashboard-school/class/classes/SchoolClasses.tsx
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Pencil,
  Save,
  X,
  Trash2,
} from "lucide-react";
import axios from "@/lib/axios";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

/* ============== Types ============== */
type ApiClassDetail = {
  class_id: string;
  class_school_id: string;
  class_parent_id: string;
  class_slug: string;
  class_name: string;
  class_status: "active" | "inactive";
  class_parent_name_snapshot?: string | null;
  class_parent_slug_snapshot?: string | null;
  class_parent_level_snapshot?: number | null;
  class_term_name_snapshot?: string | null;
  class_term_academic_year_snapshot?: string | null;
  class_term_angkatan_snapshot?: string | null;
  class_created_at: string;
  class_updated_at: string;
  class_image_url?: string | null;
};

/* ============== Fetcher ============== */
async function fetchClassDetail(schoolId: string, id: string) {
  const res = await axios.get<{ data: ApiClassDetail[] }>(
    `/public/${schoolId}/classes/list`,
    { params: { id } }
  );
  return res.data.data?.[0];
}

/* ============== Page ============== */
export default function SchoolClassDetail() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { schoolId, classId } = useParams<{
    schoolId: string;
    classId: string;
  }>();

  const PATCH_URL = `/api/schools/${schoolId}/classes/${classId}`;
  const DELETE_URL = PATCH_URL;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["class-detail", schoolId, classId],
    enabled: !!schoolId && !!classId,
    queryFn: () => fetchClassDetail(schoolId!, classId!),
  });

  const [isEdit, setIsEdit] = React.useState(false);
  const [form, setForm] = React.useState<Partial<ApiClassDetail>>({});

  React.useEffect(() => {
    if (data) {
      setForm({
        class_name: data.class_name,
        class_slug: data.class_slug,
        class_status: data.class_status,
        class_image_url: data.class_image_url ?? "",
      });
    }
  }, [data]);

  const patchMutation = useMutation({
    mutationFn: async (payload: Partial<ApiClassDetail>) => {
      const body = {
        name: payload.class_name,
        slug: payload.class_slug,
        status: payload.class_status, // "active" | "inactive"
        image_url: payload.class_image_url || null,
      };
      const res = await axios.patch(PATCH_URL, body);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["class-detail", schoolId, classId] });
      qc.invalidateQueries({ queryKey: ["classes-public", schoolId] });
      setIsEdit(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(DELETE_URL);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes-public", schoolId] });
      navigate(-1);
    },
  });

  const onSave = () => patchMutation.mutate(form);
  const onDelete = () => {
    if (
      window.confirm("Hapus kelas ini? Tindakan ini tidak bisa dibatalkan.")
    ) {
      deleteMutation.mutate();
    }
  };

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <div className="max-w-screen-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Btn
              palette={palette}
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mr-3"
            >
              <ArrowLeft size={20} />
            </Btn>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen size={20} /> Detail Kelas
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {!isEdit ? (
              <>
                <Btn
                  palette={palette}
                  onClick={() => setIsEdit(true)}
                  disabled={isLoading || isError || !data}
                >
                  <Pencil size={16} className="mr-2" /> Edit
                </Btn>
                <Btn
                  palette={palette}
                  variant="ghost"
                  onClick={onDelete}
                  disabled={deleteMutation.isPending || isLoading || !data}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Menghapus…
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" />
                      Hapus
                    </>
                  )}
                </Btn>
              </>
            ) : (
              <>
                <Btn
                  palette={palette}
                  onClick={onSave}
                  disabled={patchMutation.isPending}
                >
                  {patchMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Menyimpan…
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Simpan
                    </>
                  )}
                </Btn>
                <Btn
                  palette={palette}
                  variant="ghost"
                  onClick={() => {
                    setIsEdit(false);
                    if (data) {
                      setForm({
                        class_name: data.class_name,
                        class_slug: data.class_slug,
                        class_status: data.class_status,
                        class_image_url: data.class_image_url ?? "",
                      });
                    }
                  }}
                >
                  <X size={16} className="mr-2" /> Batal
                </Btn>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <SectionCard palette={palette}>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-sm opacity-70">
              <Loader2 size={18} className="animate-spin" /> Memuat data...
            </div>
          ) : isError || !data ? (
            <div
              className="py-10 text-center text-sm"
              style={{ color: palette.error1 }}
            >
              Gagal memuat data kelas.
            </div>
          ) : (
            <div className="p-5 space-y-6">
              {!isEdit ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="ID" value={data.class_id} mono />
                  <Field label="School ID" value={data.class_school_id} mono />
                  <Field label="Nama Kelas" value={data.class_name} />
                  <Field label="Slug" value={data.class_slug} />
                  <Field
                    label="Status"
                    value={
                      data.class_status === "active" ? "Aktif" : "Nonaktif"
                    }
                  />
                  <Field
                    label="Tingkat"
                    value={data.class_parent_name_snapshot ?? "-"}
                  />
                  <Field
                    label="Level (angka)"
                    value={
                      data.class_parent_level_snapshot !== null &&
                      data.class_parent_level_snapshot !== undefined
                        ? String(data.class_parent_level_snapshot)
                        : "-"
                    }
                  />
                  <Field
                    label="Term"
                    value={
                      [
                        data.class_term_name_snapshot,
                        data.class_term_academic_year_snapshot,
                        data.class_term_angkatan_snapshot,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "-"
                    }
                  />
                  <Field
                    label="Image URL"
                    value={data.class_image_url ?? "-"}
                  />
                  <Field
                    label="Dibuat"
                    value={new Date(data.class_created_at).toLocaleString(
                      "id-ID"
                    )}
                  />
                  <Field
                    label="Diubah"
                    value={new Date(data.class_updated_at).toLocaleString(
                      "id-ID"
                    )}
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    palette={palette}
                    label="Nama Kelas"
                    value={form.class_name ?? ""}
                    onChange={(v) => setForm((s) => ({ ...s, class_name: v }))}
                  />
                  <InputField
                    palette={palette}
                    label="Slug"
                    value={form.class_slug ?? ""}
                    onChange={(v) => setForm((s) => ({ ...s, class_slug: v }))}
                    hint="huruf kecil-dash, unik"
                  />
                  <SelectField
                    palette={palette}
                    label="Status"
                    value={form.class_status ?? "active"}
                    onChange={(v) =>
                      setForm((s) => ({
                        ...s,
                        class_status: v as "active" | "inactive",
                      }))
                    }
                    options={[
                      { label: "Aktif", value: "active" },
                      { label: "Nonaktif", value: "inactive" },
                    ]}
                  />
                  <InputField
                    palette={palette}
                    label="Image URL"
                    value={form.class_image_url ?? ""}
                    onChange={(v) =>
                      setForm((s) => ({ ...s, class_image_url: v }))
                    }
                  />
                </div>
              )}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

/* ============== Small UI Helpers ============== */
function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs opacity-70 mb-1">{label}</div>
      <div className={mono ? "font-mono text-sm break-all" : "font-medium"}>
        {value ?? "-"}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  palette,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  palette: Palette;
  type?: string;
  hint?: string;
}) {
  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: palette.silver1 }}
    >
      <div className="text-xs opacity-70 mb-1">{label}</div>
      <input
        type={type}
        className="w-full bg-transparent outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <div className="text-xs opacity-60 mt-1">{hint}</div>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  palette,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  palette: Palette;
}) {
  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: palette.silver1 }}
    >
      <div className="text-xs opacity-70 mb-1">{label}</div>
      <select
        className="w-full bg-transparent outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}