// src/pages/pendidikanku-dashboard/dashboard-school/class/parent/SchoolParent.tsx
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Layers,
  Loader2,
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
type ApiLevelDetail = {
  class_parent_id: string;
  class_parent_school_id: string;
  class_parent_name: string;
  class_parent_code?: string | null;
  class_parent_slug: string;
  class_parent_description?: string | null;
  class_parent_level?: number | null;
  class_parent_is_active: boolean;
  class_parent_total_classes?: number | null;
  class_parent_image_url?: string | null;
  class_parent_created_at: string;
  class_parent_updated_at: string;
};

/* ============== Fetcher ============== */
async function fetchLevelDetail(schoolId: string, id: string) {
  const res = await axios.get<{ data: ApiLevelDetail[] }>(
    `/public/${schoolId}/class-parents/list`,
    { params: { id } }
  );
  return res.data.data?.[0];
}

/* ============== Component ============== */
export default function SchoolParent() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { schoolId, levelId } = useParams<{
    schoolId: string;
    levelId: string;
  }>();

  const PATCH_URL = useMemo(
    () => `/api/schools/${schoolId}/class-parents/${levelId}`,
    [schoolId, levelId]
  );
  const DELETE_URL = PATCH_URL;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["level-detail", schoolId, levelId],
    enabled: !!schoolId && !!levelId,
    queryFn: () => fetchLevelDetail(schoolId!, levelId!),
  });

  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<Partial<ApiLevelDetail>>({});

  // Sinkronkan form saat data datang / ganti
  React.useEffect(() => {
    if (data) {
      setForm({
        class_parent_name: data.class_parent_name,
        class_parent_code: data.class_parent_code ?? "",
        class_parent_slug: data.class_parent_slug,
        class_parent_description: data.class_parent_description ?? "",
        class_parent_level: data.class_parent_level ?? undefined,
        class_parent_is_active: data.class_parent_is_active,
        class_parent_image_url: data.class_parent_image_url ?? "",
      });
    }
  }, [data]);

  // ========= Mutations =========
  const patchMutation = useMutation({
    mutationFn: async (payload: Partial<ApiLevelDetail>) => {
      // Kirim hanya field yang boleh diubah
      const body = {
        name: payload.class_parent_name,
        code: payload.class_parent_code || null,
        slug: payload.class_parent_slug,
        description: payload.class_parent_description || null,
        level: payload.class_parent_level ?? null,
        is_active: payload.class_parent_is_active,
        image_url: payload.class_parent_image_url || null,
      };
      const res = await axios.patch(PATCH_URL, body);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["level-detail", schoolId, levelId] });
      qc.invalidateQueries({ queryKey: ["levels-public", schoolId] });
      setIsEdit(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(DELETE_URL);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["levels-public", schoolId] });
      navigate(-1);
    },
  });

  const onChange = (k: keyof ApiLevelDetail, v: any) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSave = () => {
    patchMutation.mutate(form as ApiLevelDetail);
  };

  const onDelete = () => {
    const ok = window.confirm(
      "Hapus tingkat ini? Tindakan ini tidak bisa dibatalkan."
    );
    if (!ok) return;
    deleteMutation.mutate();
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
              <Layers size={20} /> Detail Tingkat
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
                      <Loader2 size={16} className="mr-2 animate-spin" />{" "}
                      Menghapus…
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" /> Hapus
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
                      <Loader2 size={16} className="mr-2 animate-spin" />{" "}
                      Menyimpan…
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" /> Simpan
                    </>
                  )}
                </Btn>
                <Btn
                  palette={palette}
                  variant="ghost"
                  onClick={() => {
                    setIsEdit(false);
                    // reset form ke data server
                    if (data) {
                      setForm({
                        class_parent_name: data.class_parent_name,
                        class_parent_code: data.class_parent_code ?? "",
                        class_parent_slug: data.class_parent_slug,
                        class_parent_description:
                          data.class_parent_description ?? "",
                        class_parent_level:
                          data.class_parent_level ?? undefined,
                        class_parent_is_active: data.class_parent_is_active,
                        class_parent_image_url:
                          data.class_parent_image_url ?? "",
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
              Gagal memuat data tingkat.
            </div>
          ) : (
            <div className="p-5 space-y-6">
              {/* FORM / VIEW */}
              {!isEdit ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="ID" value={data.class_parent_id} mono />
                  <Field
                    label="School ID"
                    value={data.class_parent_school_id}
                    mono
                  />
                  <Field label="Nama Tingkat" value={data.class_parent_name} />
                  <Field label="Slug" value={data.class_parent_slug} />
                  <Field label="Kode" value={data.class_parent_code ?? "-"} />
                  <Field
                    label="Level (angka)"
                    value={
                      typeof data.class_parent_level === "number"
                        ? String(data.class_parent_level)
                        : "-"
                    }
                  />
                  <Field
                    label="Status"
                    value={data.class_parent_is_active ? "Aktif" : "Nonaktif"}
                  />
                  <Field
                    label="Total Kelas"
                    value={String(data.class_parent_total_classes ?? 0)}
                  />
                  <Field
                    label="Image URL"
                    value={data.class_parent_image_url ?? "-"}
                  />
                  <Field label="Dibuat" value={data.class_parent_created_at} />
                  <Field label="Diubah" value={data.class_parent_updated_at} />
                  <div className="md:col-span-2">
                    <div className="text-sm opacity-70 mb-1">Deskripsi</div>
                    <div>
                      {data.class_parent_description?.trim() ||
                        "(tidak ada deskripsi)"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    palette={palette}
                    label="Nama Tingkat"
                    value={form.class_parent_name ?? ""}
                    onChange={(v) => onChange("class_parent_name", v)}
                  />
                  <InputField
                    palette={palette}
                    label="Slug"
                    value={form.class_parent_slug ?? ""}
                    onChange={(v) => onChange("class_parent_slug", v)}
                    hint="huruf kecil-dash, unik"
                  />
                  <InputField
                    palette={palette}
                    label="Kode"
                    value={form.class_parent_code ?? ""}
                    onChange={(v) => onChange("class_parent_code", v)}
                  />
                  <InputField
                    palette={palette}
                    label="Level (angka)"
                    value={
                      form.class_parent_level !== undefined &&
                      form.class_parent_level !== null
                        ? String(form.class_parent_level)
                        : ""
                    }
                    onChange={(v) =>
                      onChange(
                        "class_parent_level",
                        v === "" ? null : Number(v)
                      )
                    }
                    type="number"
                  />
                  <ToggleField
                    palette={palette}
                    label="Status Aktif"
                    checked={!!form.class_parent_is_active}
                    onChange={(checked) =>
                      onChange("class_parent_is_active", checked)
                    }
                  />
                  <InputField
                    palette={palette}
                    label="Image URL"
                    value={form.class_parent_image_url ?? ""}
                    onChange={(v) => onChange("class_parent_image_url", v)}
                  />
                  <div className="md:col-span-2">
                    <TextareaField
                      palette={palette}
                      label="Deskripsi"
                      value={form.class_parent_description ?? ""}
                      onChange={(v) => onChange("class_parent_description", v)}
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

/* ============== Small UI helpers ============== */
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

function TextareaField({
  label,
  value,
  onChange,
  palette,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  palette: Palette;
  rows?: number;
}) {
  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: palette.silver1 }}
    >
      <div className="text-xs opacity-70 mb-1">{label}</div>
      <textarea
        className="w-full bg-transparent outline-none resize-y"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
  palette,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  palette: Palette;
}) {
  return (
    <div
      className="rounded-xl border p-3 flex items-center justify-between"
      style={{ borderColor: palette.silver1 }}
    >
      <div>
        <div className="text-xs opacity-70 mb-1">{label}</div>
        <div className="text-sm">{checked ? "Aktif" : "Nonaktif"}</div>
      </div>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-10 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full relative transition-all">
          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all peer-checked:translate-x-4" />
        </div>
      </label>
    </div>
  );
}