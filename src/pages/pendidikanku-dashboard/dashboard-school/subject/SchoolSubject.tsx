// src/pages/sekolahislamku/pages/academic/SchoolSubject.tsx
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import axios from "@/lib/axios";
import {
  SectionCard,
  Badge,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import {
  ArrowLeft,
  Eye,
  Pencil,
  Plus,
  Trash2,
  X,
  BookOpen,
  Search,
  Filter,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { DeleteConfirmModal } from "../../components/common/CDeleteConfirmModal";
import { useTopBar } from "../../components/home/CUseTopBar";

/* ================= Types ================= */
export type SubjectStatus = "active" | "inactive";

export type SubjectRow = {
  id: string; // subject_id
  code: string;
  name: string;
  status: SubjectStatus;
  class_count: number;
  total_hours_per_week: number | null;
  book_count: number;
  assignments: ClassSubjectItem[];
};

type SubjectsAPIItem = {
  subject_id: string;
  subject_school_id: string;
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
  pagination?: { limit: number; offset: number; total: number };
};

type ClassSubjectItem = {
  class_subject_id: string;
  class_subject_school_id: string;
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
  pagination?: { limit: number; offset: number; total: number };
};

type ClassSubjectBookItem = {
  class_subject_book_id: string;
  class_subject_book_school_id: string;
  class_subject_book_class_subject_id: string;
  class_subject_book_book_id: string;
  class_subject_book_slug: string;
  class_subject_book_is_active: boolean;
  class_subject_book_book_title_snapshot: string;
  class_subject_book_book_author_snapshot: string | null;
  class_subject_book_book_slug_snapshot: string;
  class_subject_book_book_image_url_snapshot: string | null;
  class_subject_book_subject_id_snapshot: string; // <-- mapping ke subject_id
  class_subject_book_subject_code_snapshot: string;
  class_subject_book_subject_name_snapshot: string;
  class_subject_book_subject_slug_snapshot: string;
  class_subject_book_created_at: string;
  class_subject_book_updated_at: string;
};
type CSBListResp = {
  data: ClassSubjectBookItem[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
};

/* ================= Const ================= */
const API_PREFIX = "/public"; // GET list
const ADMIN_PREFIX = "/a"; // POST/PUT/DELETE (admin)

/* ================= Helpers ================= */
const sumHours = (arr: ClassSubjectItem[]) => {
  const hrs = arr
    .map((x) => x.class_subject_hours_per_week ?? 0)
    .filter((n) => Number.isFinite(n));
  if (hrs.length === 0) return null;
  return hrs.reduce((a, b) => a + b, 0);
};

function useResolvedSchoolId() {
  const params = useParams<{ schoolId?: string; school_id?: string }>();
  const { search } = useLocation();
  const sp = useMemo(() => new URLSearchParams(search), [search]);
  return params.schoolId || params.school_id || sp.get("school_id") || "";
}

/* ================= Mutations ================= */
function useCreateSubjectMutation(school_id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: FormData) => {
      const { data } = await axios.post(
        `${ADMIN_PREFIX}/${school_id}/subjects`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects-merged", school_id] });
    },
  });
}

function useUpdateSubjectMutation(school_id: string, subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: FormData) => {
      const { data } = await axios.patch(
        `${ADMIN_PREFIX}/${school_id}/subjects/${subjectId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects-merged", school_id] });
    },
  });
}

function useDeleteSubjectMutation(school_id: string, subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `${ADMIN_PREFIX}/${school_id}/subjects/${subjectId}`
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects-merged", school_id] });
    },
  });
}

/* ================= Small UI ================= */
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b py-1 text-sm">
      <span className="opacity-90">{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* ================= Detail Modal ================= */
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
            <InfoRow label="Jumlah Buku" value={subject.book_count} />
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

/* ================= Card ================= */
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

          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border p-2">
              <div className="opacity-70 text-xs">Kelas</div>
              <div className="font-medium">{row.class_count}</div>
            </div>
            <div className="rounded-lg border p-2">
              <div className="opacity-70 text-xs">Jam/Minggu</div>
              <div className="font-medium">
                {row.total_hours_per_week ?? "-"}
              </div>
            </div>
            <div className="rounded-lg border p-2">
              <div className="opacity-70 text-xs">Buku</div>
              <div className="font-medium">{row.book_count}</div>
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

/* ================= Create Modal ================= */
function CreateSubjectModal({
  open,
  palette,
  schoolId,
  onClose,
}: {
  open: boolean;
  palette: Palette;
  schoolId: string;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const createMutation = useCreateSubjectMutation(schoolId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    if (code.trim()) fd.append("subject_code", code.trim());
    fd.append("subject_name", name.trim());
    if (desc.trim()) fd.append("subject_desc", desc.trim());
    if (file) fd.append("file", file);
    await createMutation.mutateAsync(fd);
    onClose();
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

/* ================= Edit Modal ================= */
function EditSubjectModal({
  open,
  palette,
  schoolId,
  subject,
  onClose,
}: {
  open: boolean;
  palette: Palette;
  schoolId: string;
  subject: SubjectRow | null;
  onClose: () => void;
}) {
  const [code, setCode] = useState(subject?.code ?? "");
  const [name, setName] = useState(subject?.name ?? "");
  const [desc, setDesc] = useState<string>("");
  const [isActive, setIsActive] = useState(subject?.status === "active");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setCode(subject?.code ?? "");
    setName(subject?.name ?? "");
    setIsActive(subject?.status === "active");
    setDesc("");
    setFile(null);
  }, [subject?.id]);

  const updateMutation = useUpdateSubjectMutation(schoolId, subject?.id ?? "");

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
          <h3 className="font-semibold">Edit Mapel — {subject.name}</h3>
          <button onClick={onClose} className="p-1" title="Tutup">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="opacity-80">Kode</span>
              <input
                className="rounded-lg px-3 py-2 border outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="opacity-80">Nama *</span>
              <input
                required
                className="rounded-lg px-3 py-2 border outline-none"
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
            />
            <span>Aktif</span>
          </label>

          <label className="flex flex-col gap-1">
            <span className="opacity-80">Deskripsi (opsional)</span>
            <textarea
              className="rounded-lg px-3 py-2 border outline-none"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Update deskripsi jika perlu"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="opacity-80">
              Gambar (opsional — menimpa yang lama)
            </span>
            <input
              type="file"
              accept="image/*"
              className="rounded-lg px-3 py-2 border file:mr-3 file:py-1 file:px-2 file:rounded-md"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {updateMutation.isError && (
            <div className="text-red-600">
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

/* ================= Page ================= */
const SchoolSubject: React.FC = () => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const schoolId = useResolvedSchoolId();

  const { setTopBar, resetTopBar } = useTopBar();
  useEffect(() => {
    setTopBar({ mode: "back", title: "Daftar pelajaran" });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  const [detailData, setDetailData] = useState<SubjectRow | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editData, setEditData] = useState<SubjectRow | null>(null);
  const [deleteData, setDeleteData] = useState<SubjectRow | null>(null);

  // controls
  const [q, setQ] = useState("");
  const [onlyActive, setOnlyActive] = useState<"1" | "0">("1");
  const [sortBy, setSortBy] = useState<
    "name-asc" | "name-desc" | "code-asc" | "code-desc"
  >("name-asc");

  const delMut = useDeleteSubjectMutation(schoolId ?? "", deleteData?.id ?? "");

  const mergedQ = useQuery({
    queryKey: ["subjects-merged", schoolId],
    enabled: !!schoolId,
    queryFn: async (): Promise<SubjectRow[]> => {
      const [subjectsResp, classSubjectsResp, booksResp] = await Promise.all([
        axios
          .get<SubjectsAPIResp>(`${API_PREFIX}/${schoolId}/subjects/list`, {
            params: { limit: 500, offset: 0 },
          })
          .then((r) => r.data),
        axios
          .get<ClassSubjectsAPIResp>(
            `${API_PREFIX}/${schoolId}/class-subjects/list`,
            {
              params: { limit: 1000, offset: 0 },
            }
          )
          .then((r) => r.data),
        axios
          .get<CSBListResp>(
            `${API_PREFIX}/${schoolId}/class-subject-books/list`,
            {
              params: { per_page: 1000, page: 1 },
            }
          )
          .then((r) => r.data),
      ]);

      // index class-subjects by subject_id
      const classBySubject = new Map<string, ClassSubjectItem[]>();
      for (const cs of classSubjectsResp.data) {
        const key = cs.class_subject_subject_id;
        if (!classBySubject.has(key)) classBySubject.set(key, []);
        classBySubject.get(key)!.push(cs);
      }

      // index books by subject snapshot id
      const bookCountBySubject = new Map<string, number>();
      for (const b of booksResp.data) {
        const sid = b.class_subject_book_subject_id_snapshot;
        bookCountBySubject.set(sid, (bookCountBySubject.get(sid) ?? 0) + 1);
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
          book_count: bookCountBySubject.get(s.subject_id) ?? 0,
          assignments,
        };
      });

      return rows;
    },
  });

  const filtered = useMemo(() => {
    let arr = (mergedQ.data ?? []).slice();

    if (onlyActive === "1") {
      arr = arr.filter((s) => s.status === "active");
    }
    if (q.trim()) {
      const k = q.trim().toLowerCase();
      arr = arr.filter(
        (s) =>
          s.name.toLowerCase().includes(k) || s.code.toLowerCase().includes(k)
      );
    }

    const [key, dir] = (sortBy || "name-asc").split("-") as [
      "name" | "code",
      "asc" | "desc",
    ];
    const asc = dir !== "desc";
    arr.sort((a, b) => {
      const A = (key === "code" ? a.code : a.name).toLowerCase();
      const B = (key === "code" ? b.code : b.name).toLowerCase();
      if (A < B) return asc ? -1 : 1;
      if (A > B) return asc ? 1 : -1;
      return 0;
    });

    return arr;
  }, [mergedQ.data, q, onlyActive, sortBy]);

  return (
    <div className="w-full">
      <main className="w-full">
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

          {/* Controls */}
          <SectionCard palette={palette} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 rounded-2xl border px-3 py-2">
                <Search size={16} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari nama/kode…"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={16} className="opacity-70" />
                <select
                  value={onlyActive}
                  onChange={(e) => setOnlyActive(e.target.value as "1" | "0")}
                  className="rounded-xl border px-3 py-2 bg-background text-sm w-full"
                >
                  <option value="1">Aktif saja</option>
                  <option value="0">Semua</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="opacity-70" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border px-3 py-2 bg-background text-sm w-full"
                >
                  <option value="name-asc">Nama A→Z</option>
                  <option value="name-desc">Nama Z→A</option>
                  <option value="code-asc">Kode A→Z</option>
                  <option value="code-desc">Kode Z→A</option>
                </select>
              </div>
            </div>
          </SectionCard>

          {/* State: loading / error / empty */}
          {mergedQ.isLoading && (
            <SectionCard
              palette={palette}
              className="p-6 text-center flex items-center justify-center gap-2"
            >
              <Loader2 className="animate-spin" /> Memuat…
            </SectionCard>
          )}
          {mergedQ.isError && (
            <SectionCard
              palette={palette}
              className="p-6 text-center text-red-600 flex items-center gap-2"
            >
              <AlertCircle /> Gagal memuat data.
            </SectionCard>
          )}
          {!mergedQ.isLoading && !mergedQ.isError && filtered.length === 0 && (
            <SectionCard
              palette={palette}
              className="p-6 text-center opacity-70"
            >
              Tidak ada data yang cocok.
            </SectionCard>
          )}

          {/* Grid Cards */}
          {!mergedQ.isLoading && !mergedQ.isError && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((r) => (
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
      {schoolId && (
        <CreateSubjectModal
          open={openCreate}
          palette={palette}
          schoolId={schoolId}
          onClose={() => setOpenCreate(false)}
        />
      )}

      {/* Modal Edit */}
      {schoolId && (
        <EditSubjectModal
          open={!!editData}
          palette={palette}
          schoolId={schoolId}
          subject={editData}
          onClose={() => setEditData(null)}
        />
      )}

      {/* Modal Delete */}
      {schoolId && (
        <DeleteConfirmModal
          open={!!deleteData}
          palette={palette}
          onClose={() => setDeleteData(null)}
          onConfirm={async () => {
            if (!schoolId || !deleteData) return;
            try {
              await delMut.mutateAsync();
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
