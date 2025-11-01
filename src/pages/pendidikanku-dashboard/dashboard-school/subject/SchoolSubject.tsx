// src/pages/sekolahislamku/pages/academic/SchoolSubject.tsx
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

// Theme & utils
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import axios from "@/lib/axios";

// UI
import {
  SectionCard,
  Badge,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/Primitives";

// Icons
import {
  ArrowLeft,
  Eye,
  Pencil,
  Plus,
  Trash2,
  X,
  BookOpen,
} from "lucide-react";
import { DeleteConfirmModal } from "../../components/common/DeleteConfirmModal";

/* ================= Types ================= */
export type SubjectStatus = "active" | "inactive";

export type SubjectRow = {
  id: string; // subject_id
  code: string;
  name: string;
  status: SubjectStatus;
  class_count: number;
  total_hours_per_week: number | null;
  assignments: ClassSubjectItem[];
};

type SubjectsAPIItem = {
  subject_id: string;
  subject_masjid_id: string;
  subject_code: string | null;
  subject_name: string;
  subject_desc?: string | null;
  subject_slug?: string | null;
  subject_image_url?: string | null;
  subject_is_active: boolean;
  subject_created_at: string;
  subject_updated_at: string;
};
type SubjectsAPIResp = {
  data: SubjectsAPIItem[];
  pagination: { limit: number; offset: number; total: number };
};

type ClassSubjectItem = {
  class_subject_id: string;
  class_subject_masjid_id: string;
  class_subject_parent_id: string;
  class_subject_subject_id: string;
  class_subject_slug: string;
  class_subject_order_index: number | null;
  class_subject_hours_per_week: number | null;
  class_subject_min_passing_score: number | null;
  class_subject_weight_on_report: number | null;
  class_subject_is_core: boolean | null;
  class_subject_subject_name_snapshot: string;
  class_subject_subject_code_snapshot: string | null;
  class_subject_subject_slug_snapshot: string | null;
  class_subject_subject_url_snapshot: string | null;
  class_subject_is_active: boolean;
  class_subject_created_at: string;
  class_subject_updated_at: string;
};
type ClassSubjectsAPIResp = {
  data: ClassSubjectItem[];
  pagination: { limit: number; offset: number; total: number };
};

/* ================= Helpers ================= */
const API_PREFIX = "/public"; // GET list
const ADMIN_PREFIX = "/a"; // POST/PUT/DELETE (admin)

const sumHours = (arr: ClassSubjectItem[]) => {
  const hrs = arr
    .map((x) => x.class_subject_hours_per_week ?? 0)
    .filter((n) => Number.isFinite(n));
  if (hrs.length === 0) return null;
  return hrs.reduce((a, b) => a + b, 0);
};

/* ================= Reusable Mutations ================= */
function useCreateSubjectMutation(masjid_id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: FormData) => {
      const { data } = await axios.post(
        `${ADMIN_PREFIX}/${masjid_id}/subjects`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects-merged", masjid_id] });
    },
  });
}

function useUpdateSubjectMutation(masjid_id: string, subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: FormData) => {
      const { data } = await axios.patch(
        `${ADMIN_PREFIX}/${masjid_id}/subjects/${subjectId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects-merged", masjid_id] });
    },
  });
}

function useDeleteSubjectMutation(masjid_id: string, subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `${ADMIN_PREFIX}/${masjid_id}/subjects/${subjectId}`
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects-merged", masjid_id] });
    },
  });
}

/* ================= Modal Detail ================= */
function SubjectDetailModal({
  open,
  palette,
  subject,
  onClose,
}: {
  open: boolean;
  palette: Palette;
  subject: SubjectRow | null;
  onClose: () => void;
}) {
  if (!open || !subject) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.35)" }}
    >
      <SectionCard
        palette={palette}
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Detail Mapel — {subject.name}</h3>
          <button onClick={onClose} className="p-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <InfoRow label="Kode" value={subject.code || "-"} />
            <InfoRow
              label="Status"
              value={subject.status === "active" ? "Aktif" : "Nonaktif"}
            />
            <InfoRow label="Jumlah Kelas" value={subject.class_count} />
            <InfoRow
              label="Total Jam/Minggu"
              value={
                subject.total_hours_per_week != null
                  ? `${subject.total_hours_per_week}`
                  : "-"
              }
            />
          </div>

          <div className="mt-2">
            <div className="font-semibold mb-2">Penugasan per Kelas</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 pr-3">Slug Kelas</th>
                    <th className="text-left py-2 pr-3">Jam/Minggu</th>
                    <th className="text-left py-2 pr-3">Passing</th>
                    <th className="text-left py-2 pr-3">Bobot Rapor</th>
                    <th className="text-left py-2 pr-3">Core</th>
                    <th className="text-left py-2 pr-3">Aktif</th>
                  </tr>
                </thead>
                <tbody>
                  {subject.assignments.map((cs) => (
                    <tr key={cs.class_subject_id} className="border-b">
                      <td className="py-2 pr-3">
                        {cs.class_subject_slug || "-"}
                      </td>
                      <td className="py-2 pr-3">
                        {cs.class_subject_hours_per_week ?? "-"}
                      </td>
                      <td className="py-2 pr-3">
                        {cs.class_subject_min_passing_score ?? "-"}
                      </td>
                      <td className="py-2 pr-3">
                        {cs.class_subject_weight_on_report ?? "-"}
                      </td>
                      <td className="py-2 pr-3">
                        {cs.class_subject_is_core ? "Ya" : "Tidak"}
                      </td>
                      <td className="py-2 pr-3">
                        {cs.class_subject_is_active ? "Aktif" : "Nonaktif"}
                      </td>
                    </tr>
                  ))}
                  {subject.assignments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center opacity-70">
                        Belum ditugaskan ke kelas manapun.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b py-1 text-sm">
      <span className="opacity-90">{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* =============== Subject Card =============== */
function SubjectCard({
  palette,
  row,
  onDetail,
  onEdit,
  onDelete,
}: {
  palette: Palette;
  row: SubjectRow;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <SectionCard
      palette={palette}
      className="rounded-2xl shadow-md overflow-hidden flex flex-col"
    >
      <div className="p-4 flex items-start gap-3">
        <div className="shrink-0 rounded-xl p-2 border">
          <BookOpen size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold leading-snug">{row.name}</div>
              <div className="text-xs opacity-80">Kode: {row.code || "-"}</div>
            </div>
            <Badge
              palette={palette}
              variant={row.status === "active" ? "success" : "outline"}
            >
              {row.status === "active" ? "Aktif" : "Nonaktif"}
            </Badge>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border p-2">
              <div className="opacity-70 text-xs">Jumlah Kelas</div>
              <div className="font-medium">{row.class_count}</div>
            </div>
            <div className="rounded-lg border p-2">
              <div className="opacity-70 text-xs">Total Jam/Minggu</div>
              <div className="font-medium">
                {row.total_hours_per_week ?? "-"}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <Btn
              palette={palette}
              size="sm"
              variant="outline"
              onClick={onDetail}
            >
              <Eye size={14} /> Detail
            </Btn>
            <Btn
              palette={palette}
              size="sm"
              variant="outline"
              onClick={onEdit}
              title="Edit Subject"
            >
              <Pencil size={14} /> Edit
            </Btn>
            <Btn
              palette={palette}
              size="sm"
              variant="quaternary"
              onClick={onDelete}
              title="Hapus Subject"
            >
              <Trash2 size={14} /> Hapus
            </Btn>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* =============== Create Modal =============== */
function CreateSubjectModal({
  open,
  palette,
  masjidId,
  onClose,
}: {
  open: boolean;
  palette: Palette;
  masjidId: string;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const createMutation = useCreateSubjectMutation(masjidId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    if (code.trim()) fd.append("subject_code", code.trim());
    fd.append("subject_name", name.trim());
    if (desc.trim()) fd.append("subject_desc", desc.trim());
    if (file) fd.append("file", file);
    await createMutation.mutateAsync(fd);
    onClose();
    // Fields reset
    setCode("");
    setName("");
    setDesc("");
    setFile(null);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.35)" }}
    >
      <SectionCard
        palette={palette}
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Tambah Mapel</h3>
          <button onClick={onClose} className="p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="opacity-80">Kode (opsional)</span>
              <input
                className="border rounded-lg px-3 py-2"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="B-Ing-1"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="opacity-80">Nama *</span>
              <input
                required
                className="border rounded-lg px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bahasa Inggris"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="opacity-80">Deskripsi (opsional)</span>
            <textarea
              className="border rounded-lg px-3 py-2"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Pelajaran membaca dan menghafal kosakata"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="opacity-80">Gambar (opsional)</span>
            <input
              type="file"
              accept="image/*"
              className="border rounded-lg px-3 py-2"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {createMutation.isError && (
            <div className="text-red-600">
              {(createMutation.error as any)?.message ??
                "Gagal membuat subject."}
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <Btn
              type="button"
              palette={palette}
              variant="outline"
              onClick={onClose}
            >
              Batal
            </Btn>
            <Btn
              type="submit"
              palette={palette}
              disabled={createMutation.isPending}
              className="gap-1"
            >
              {createMutation.isPending ? "Menyimpan…" : "Simpan"}
            </Btn>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

function EditSubjectModal({
  open,
  palette,
  masjidId,
  subject,
  onClose,
}: {
  open: boolean;
  palette: Palette;
  masjidId: string;
  subject: SubjectRow | null;
  onClose: () => void;
}) {
  const [code, setCode] = useState(subject?.code ?? "");
  const [name, setName] = useState(subject?.name ?? "");
  const [desc, setDesc] = useState<string>("");
  const [isActive, setIsActive] = useState(subject?.status === "active");
  const [file, setFile] = useState<File | null>(null);

  // Sync when subject changes
  React.useEffect(() => {
    setCode(subject?.code ?? "");
    setName(subject?.name ?? "");
    setIsActive(subject?.status === "active");
    setDesc("");
    setFile(null);
  }, [subject?.id]);

  const updateMutation = useUpdateSubjectMutation(masjidId, subject?.id ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;

    const fd = new FormData();
    fd.append("subject_name", name.trim());
    fd.append("subject_is_active", isActive ? "true" : "false");
    if (code.trim()) fd.append("subject_code", code.trim());
    if (desc.trim()) fd.append("subject_desc", desc.trim());
    if (file) fd.append("file", file);

    await updateMutation.mutateAsync(fd);
    onClose();
  };

  if (!open || !subject) return null;

  const labelStyle: React.CSSProperties = { color: palette.black2 };
  const fieldStyle: React.CSSProperties = {
    borderColor: palette.silver1,
    background: "transparent",
    color: palette.black1,
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.35)" }}
    >
      <SectionCard
        palette={palette}
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: palette.white1,
          borderColor: palette.silver1,
          color: palette.black1,
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: palette.silver1 }}
        >
          <h3 className="font-semibold">Edit Mapel — {subject.name}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg"
            style={{ color: palette.black2 }}
            title="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="opacity-80" style={labelStyle}>
                Kode
              </span>
              <input
                className="rounded-lg px-3 py-2 border outline-none"
                style={fieldStyle}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="opacity-80" style={labelStyle}>
                Nama *
              </span>
              <input
                required
                className="rounded-lg px-3 py-2 border outline-none"
                style={fieldStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              // warna centang ikut primary
              style={{ accentColor: palette.primary }}
            />
            <span style={{ color: palette.black1 }}>Aktif</span>
          </label>

          <label className="flex flex-col gap-1">
            <span className="opacity-80" style={labelStyle}>
              Deskripsi (opsional)
            </span>
            <textarea
              className="rounded-lg px-3 py-2 border outline-none"
              rows={3}
              style={fieldStyle}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Update deskripsi jika perlu"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="opacity-80" style={labelStyle}>
              Gambar (opsional — menimpa yang lama)
            </span>
            <input
              type="file"
              accept="image/*"
              className="rounded-lg px-3 py-2 border file:mr-3 file:py-1 file:px-2 file:rounded-md"
              style={fieldStyle}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {updateMutation.isError && (
            <div style={{ color: palette.error1 }}>
              {(updateMutation.error as any)?.message ??
                "Gagal mengubah subject."}
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <Btn
              type="button"
              palette={palette}
              variant="outline"
              onClick={onClose}
            >
              Batal
            </Btn>
            <Btn
              type="submit"
              palette={palette}
              disabled={updateMutation.isPending}
              className="gap-1"
            >
              {updateMutation.isPending ? "Menyimpan…" : "Simpan Perubahan"}
            </Btn>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

/* =============== Delete Confirm =============== */

/* ================== Page ================== */
const SchoolSubject: React.FC = () => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const { masjid_id } = useParams<{ masjid_id: string }>();
  // const masjidId = masjid_id; // pakai alias lokal biar konsisten di bawah

  const [detailData, setDetailData] = useState<SubjectRow | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editData, setEditData] = useState<SubjectRow | null>(null);
  const [deleteData, setDeleteData] = useState<SubjectRow | null>(null);

  // panggil hook dengan argumen terkini (aman, hook tetap dipanggil setiap render)
  const delMut = useDeleteSubjectMutation(
    masjid_id ?? "",
    deleteData?.id ?? ""
  );

  const mergedQ = useQuery({
    queryKey: ["subjects-merged", masjid_id],
    enabled: !!masjid_id,
    queryFn: async (): Promise<SubjectRow[]> => {
      const [subjectsResp, classSubjectsResp] = await Promise.all([
        axios
          .get<SubjectsAPIResp>(`${API_PREFIX}/${masjid_id}/subjects/list`, {
            params: { limit: 500, offset: 0 },
          })
          .then((r) => r.data),
        axios
          .get<ClassSubjectsAPIResp>(
            `${API_PREFIX}/${masjid_id}/class-subjects/list`,
            { params: { limit: 1000, offset: 0 } }
          )
          .then((r) => r.data),
      ]);

      const classBySubject = new Map<string, ClassSubjectItem[]>();
      for (const cs of classSubjectsResp.data) {
        const key = cs.class_subject_subject_id;
        if (!classBySubject.has(key)) classBySubject.set(key, []);
        classBySubject.get(key)!.push(cs);
      }

      const rows: SubjectRow[] = subjectsResp.data.map((s) => {
        const assignments = classBySubject.get(s.subject_id) ?? [];
        return {
          id: s.subject_id,
          code: s.subject_code ?? "",
          name: s.subject_name,
          status: s.subject_is_active ? "active" : "inactive",
          class_count: assignments.length,
          total_hours_per_week: sumHours(assignments),
          assignments,
        };
      });

      return rows;
    },
  });

  const rows = useMemo(() => mergedQ.data ?? [], [mergedQ.data]);

  return (
    <div className="min-h-screen w-full" style={{ background: palette.white2 }}>
      <main className="w-full px-4 md:px-6 py-4 md:py-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="md:flex hidden items-center gap-3">
              <Btn
                palette={palette}
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="cursor-pointer" size={20} />
              </Btn>
              <h1 className="font-semibold text-lg">Daftar Pelajaran</h1>
            </div>
            <Btn
              palette={palette}
              size="sm"
              className="gap-1"
              onClick={() => setOpenCreate(true)}
            >
              <Plus size={16} /> Tambah
            </Btn>
          </div>

          {/* State: loading / error / empty */}
          {mergedQ.isLoading && (
            <SectionCard palette={palette} className="p-6 text-center">
              Memuat…
            </SectionCard>
          )}
          {mergedQ.isError && (
            <SectionCard
              palette={palette}
              className="p-6 text-center text-red-600"
            >
              Gagal memuat data.
            </SectionCard>
          )}
          {!mergedQ.isLoading && !mergedQ.isError && rows.length === 0 && (
            <SectionCard
              palette={palette}
              className="p-6 text-center opacity-70"
            >
              Tidak ada data.
            </SectionCard>
          )}

          {/* Grid Cards */}
          {!mergedQ.isLoading && !mergedQ.isError && rows.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {rows.map((r) => (
                <SubjectCard
                  key={r.id}
                  palette={palette}
                  row={r}
                  onDetail={() => setDetailData(r)}
                  onEdit={() => setEditData(r)}
                  onDelete={() => setDeleteData(r)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Detail */}
      <SubjectDetailModal
        open={!!detailData}
        palette={palette}
        subject={detailData}
        onClose={() => setDetailData(null)}
      />

      {/* Modal Create */}
      {masjid_id && (
        <CreateSubjectModal
          open={openCreate}
          palette={palette}
          masjidId={masjid_id}
          onClose={() => setOpenCreate(false)}
        />
      )}

      {/* Modal Edit */}
      {masjid_id && (
        <EditSubjectModal
          open={!!editData}
          palette={palette}
          masjidId={masjid_id}
          subject={editData}
          onClose={() => setEditData(null)}
        />
      )}

      {/* Modal Delete */}
      {masjid_id && (
        <DeleteConfirmModal
          open={!!deleteData}
          palette={palette}
          onClose={() => setDeleteData(null)}
          onConfirm={async () => {
            if (!masjid_id || !deleteData) return;
            try {
              await delMut.mutateAsync(); // ← tidak perlu kirim variabel lagi
            } finally {
              setDeleteData(null);
            }
          }}
          title={`Hapus "${deleteData?.name}"?`}
          message="Yakin ingin menghapus pelajaran ini? Tindakan tidak dapat dibatalkan."
          confirmLabel={delMut.isPending ? "Menghapus…" : "Hapus"}
          loading={delMut.isPending}
        />
      )}
    </div>
  );
};

export default SchoolSubject;
