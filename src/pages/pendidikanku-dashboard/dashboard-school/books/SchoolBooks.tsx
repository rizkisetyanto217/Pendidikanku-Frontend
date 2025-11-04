// src/pages/sekolahislamku/dashboard-school/books/SchoolBooks.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import axios from "@/lib/axios";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  type Palette,
  Badge,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  Search as SearchIcon,
  ImageOff,
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  Info,
  Loader2,
  BookOpen,
  Link as LinkIcon,
} from "lucide-react";
import { DeleteConfirmModal } from "@/pages/pendidikanku-dashboard/components/common/CDeleteConfirmModal";


/* 🔌 DataViewKit */
import {
  SearchBar,
  PerPageSelect,
  useSearchQuery,
  useOffsetLimit,
  PaginationBar,
  DataTable,
  CardGrid,
  type Column,
} from "@/pages/pendidikanku-dashboard/components/common/CDataViewKit";
import { useTopBar } from "../../components/home/CUseTopBar";

/* =========================================================
   Types API (PUBLIC)
========================================================= */
export type SectionLite = {
  class_sections_id: string;
  class_sections_name: string;
  class_sections_slug?: string | null;
  class_sections_code?: string | null;
  class_sections_capacity?: number | null;
  class_sections_is_active: boolean;
};

export type UsageItem = {
  class_subject_books_id: string;
  class_subjects_id: string;
  subjects_id: string;
  classes_id: string;
  sections: SectionLite[];
};

export type BookAPI = {
  books_id: string;
  books_school_id: string;
  books_title: string;
  books_author?: string | null;
  books_desc?: string | null;
  books_url?: string | null;
  books_image_url?: string | null;
  books_slug?: string | null;
  usages: UsageItem[];
};

export type BooksResponse = {
  data: BookAPI[];
  pagination?: { limit: number; offset: number; total: number };
};

type PublicBook = {
  book_id: string;
  book_school_id: string;
  book_title: string;
  book_author?: string | null;
  book_desc?: string | null;
  book_slug?: string | null;
  book_image_url?: string | null;
  book_image_object_key?: string | null;
  book_created_at?: string;
  book_updated_at?: string;
  book_is_deleted?: boolean;
};
type PublicBooksResponse = { data: PublicBook[] };

/* =========================================================
   Helpers & Form Types
========================================================= */
const yyyyMmDdLocal = (d = new Date()) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export type BookFormInput = {
  book_title: string;
  book_author?: string | null;
  book_desc?: string | null;
  books_url?: string | null;
  file?: File | null;
  files?: File[] | null;
  urls?: string[] | null;
};

function buildBookFormData(input: BookFormInput) {
  const fd = new FormData();
  fd.set("book_title", input.book_title);
  if (input.book_author != null) fd.set("book_author", input.book_author);
  if (input.book_desc != null) fd.set("book_desc", input.book_desc);
  if (input.books_url != null) fd.set("books_url", input.books_url);
  if (input.file) fd.set("file", input.file);
  if (input.files && input.files.length)
    input.files.forEach((f) => fd.append("files", f));
  if (input.urls && input.urls.length)
    fd.set("urls_json", JSON.stringify(input.urls));
  return fd;
}

/* =========================================================
   Data Hook: /public/{school_id}/books/list
========================================================= */
function useBooksListPublic(params: {
  schoolId: string;
  limit: number;
  offset: number;
}) {
  const { schoolId, limit, offset } = params;
  return useQuery<BooksResponse>({
    queryKey: ["books-list-public", { schoolId, limit, offset }],
    queryFn: async () => {
      const r = await axios.get<PublicBooksResponse>(
        `/public/${encodeURIComponent(schoolId)}/books/list`,
        { withCredentials: false, params: { _: Date.now() } }
      );

      const mapped: BookAPI[] = (r.data?.data ?? []).map((b) => ({
        books_id: b.book_id,
        books_school_id: b.book_school_id,
        books_title: b.book_title,
        books_author: b.book_author ?? null,
        books_desc: b.book_desc ?? null,
        books_url: null,
        books_image_url: b.book_image_url ?? null,
        books_slug: b.book_slug ?? null,
        usages: [],
      }));

      const total = mapped.length;
      const sliced = mapped.slice(offset, Math.min(offset + limit, total));
      return { data: sliced, pagination: { limit, offset, total } };
    },
    placeholderData: (prev) =>
      prev ?? { data: [], pagination: { limit, offset, total: 0 } },
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: "always",
    retry: 1,
  });
}

/* =========================================================
   Admin Mutations
========================================================= */
function useCreateBook(schoolId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BookFormInput) => {
      const fd = buildBookFormData(payload);
      const { data } = await axios.post(
        `/api/a/${encodeURIComponent(schoolId)}/books`,
        fd,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["books-list-public"] });
      await qc.refetchQueries({
        queryKey: ["books-list-public"],
        type: "active",
      });
    },
  });
}
function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { bookId: string; payload: BookFormInput }) => {
      const fd = buildBookFormData(args.payload);
      const { data } = await axios.patch(
        `/api/a/books/${encodeURIComponent(args.bookId)}`,
        fd,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["books-list-public"] });
      await qc.refetchQueries({
        queryKey: ["books-list-public"],
        type: "active",
      });
    },
  });
}
function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: string) => {
      const { data } = await axios.delete(
        `/api/a/books/${encodeURIComponent(bookId)}`,
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["books-list-public"] });
      await qc.refetchQueries({
        queryKey: ["books-list-public"],
        type: "active",
      });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message ?? "Gagal menghapus buku.");
    },
  });
}

/* =========================================================
   Skeleton
========================================================= */
function CardSkeleton({ palette }: { palette: Palette }) {
  return (
    <div
      className="rounded-xl border p-4 animate-pulse"
      style={{ borderColor: palette.silver1, background: palette.white1 }}
    >
      <div className="flex gap-3">
        <div
          className="w-10 h-14 rounded-md"
          style={{ background: palette.white2 }}
        />
        <div className="flex-1 space-y-2">
          <div
            className="h-4 w-2/3 rounded"
            style={{ background: palette.white2 }}
          />
          <div
            className="h-3 w-1/2 rounded"
            style={{ background: palette.white2 }}
          />
          <div
            className="h-3 w-full rounded"
            style={{ background: palette.white2 }}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Inline Modal (presentational)
========================================================= */
type BookLite = {
  books_id: string;
  books_title: string;
  books_author?: string | null;
  books_desc?: string | null;
  books_url?: string | null;
  books_image_url?: string | null;
};
type BookModalForm = BookFormInput;
type BookModalProps = {
  open: boolean;
  mode: "create" | "edit";
  book: BookLite | null;
  palette: Palette;
  onClose: () => void;
  onSubmit?: (data: BookModalForm) => Promise<void> | void;
  submitting?: boolean;
  onSuccess?: () => void;
};
function BookModal({
  open,
  mode,
  book,
  palette,
  onClose,
  onSubmit,
  submitting = false,
  onSuccess,
}: BookModalProps) {
  const isEdit = mode === "edit";
  const DEFAULT_FORM: BookModalForm = {
    book_title: "",
    book_author: "",
    book_desc: "",
    books_url: "",
    file: null,
    files: null,
    urls: [],
  };
  const [form, setForm] = useState<BookModalForm>(DEFAULT_FORM);
  const [preview, setPreview] = useState<string | null>(
    book?.books_image_url ?? null
  );

  useEffect(() => {
    if (!open) return;
    if (isEdit && book) {
      setForm({
        book_title: book.books_title ?? "",
        book_author: book.books_author ?? "",
        book_desc: book.books_desc ?? "",
        books_url: book.books_url ?? "",
        file: null,
        files: null,
        urls: [],
      });
      setPreview(book.books_image_url ?? null);
    } else {
      setForm(DEFAULT_FORM);
      setPreview(null);
    }
  }, [open, isEdit, book?.books_id]);

  useEffect(() => {
    if (!form.file) return;
    const u = URL.createObjectURL(form.file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [form.file]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await onSubmit?.(form);
    onSuccess?.();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3"
      style={{ background: "rgba(0,0,0,.45)" }}
      onClick={() => !submitting && onClose()}
    >
      <SectionCard
        palette={palette}
        className="w-[min(760px,96vw)] rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 md:p-6 border-b"
          style={{ borderColor: palette.silver1 }}
        >
          <div className="text-base md:text-lg font-semibold">
            {isEdit ? "Edit Buku" : "Tambah Buku"}
          </div>
          <button
            className="opacity-70 hover:opacity-100"
            onClick={() => !submitting && onClose()}
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 md:p-6"
        >
          <div className="grid md:grid-cols-12 gap-4">
            {/* Preview & File */}
            <div className="md:col-span-4">
              <div
                className="w-full aspect-[3/4] rounded-xl overflow-hidden grid place-items-center"
                style={{ background: palette.white2 }}
              >
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <span
                    className="text-xs"
                    style={{ color: palette.black2, opacity: 0.6 }}
                  >
                    Preview cover
                  </span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="mt-3 block w-full text-sm"
                onChange={(e) =>
                  setForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))
                }
              />
            </div>

            {/* Form */}
            <div className="md:col-span-8 grid gap-3">
              <label className="grid gap-1 text-sm">
                <span>Judul *</span>
                <input
                  required
                  value={form.book_title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, book_title: e.target.value }))
                  }
                  className="px-3 py-2 rounded-lg border bg-transparent"
                  style={{
                    borderColor: palette.silver1,
                    color: palette.black1,
                  }}
                  placeholder="cth. Matematika Kelas 7"
                />
              </label>

              <div className="grid md:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  <span>Penulis</span>
                  <input
                    value={form.book_author ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, book_author: e.target.value }))
                    }
                    className="px-3 py-2 rounded-lg border bg-transparent"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.black1,
                    }}
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span>URL</span>
                  <input
                    value={form.books_url ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, books_url: e.target.value }))
                    }
                    className="px-3 py-2 rounded-lg border bg-transparent"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.black1,
                    }}
                  />
                </label>
              </div>

              <label className="grid gap-1 text-sm">
                <span>Deskripsi</span>
                <textarea
                  value={form.book_desc ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, book_desc: e.target.value }))
                  }
                  className="px-3 py-2 rounded-lg border bg-transparent min-h-[84px]"
                  style={{
                    borderColor: palette.silver1,
                    color: palette.black1,
                  }}
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span>
                  URL gambar eksternal (opsional) — Enter untuk menambah
                </span>
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const v = (e.target as HTMLInputElement).value.trim();
                      if (!v) return;
                      setForm((f) => ({ ...f, urls: [...(f.urls ?? []), v] }));
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="px-3 py-2 rounded-lg border bg-transparent"
                  style={{
                    borderColor: palette.silver1,
                    color: palette.black1,
                  }}
                />
                {!!form.urls?.length && (
                  <div
                    className="text-xs mt-1"
                    style={{ color: palette.black2 }}
                  >
                    {form.urls.map((u, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 mr-2"
                      >
                        <LinkIcon size={12} /> {u}
                      </span>
                    ))}
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 md:pt-6 flex justify-end gap-2">
            <Btn
              palette={palette}
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Batal
            </Btn>
            <Btn palette={palette} type="submit" loading={submitting}>
              {submitting ? "Menyimpan…" : isEdit ? "Simpan" : "Tambah"}
            </Btn>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

/* =========================================================
   Page
========================================================= */
const SchoolBooks: React.FC<{
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
}> = ({ showBack = false, backTo, backLabel = "Kembali" }) => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const { setTopBar, resetTopBar } = useTopBar();
  useEffect(() => {
    setTopBar({ mode: "back", title: "Daftar Buku" });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  // Ambil schoolId dari path param
  const params = useParams<{
    schoolId?: string;
    school_id?: string;
    slug?: string;
  }>();
  const schoolId = params.schoolId || params.school_id || "";
  const base = params.slug ? `/${encodeURIComponent(params.slug)}` : "";

  /* 🔎 Search sinkron URL */
  const { q, setQ } = useSearchQuery("q");

  /* ⏭ Pagination sinkron URL (mengikuti pola lama, tapi UI-nya diseragamkan) */
  const totalDummy = Number(sp.get("total") ?? 0);
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
  } = useOffsetLimit(totalDummy, 20, 200);

  /* Fetch data */
  const booksQ = useBooksListPublic({ schoolId, limit, offset });
  const data = booksQ.data?.data ?? [];
  const total = booksQ.data?.pagination?.total ?? 0;

  /* Filter client-side dari q */
  const items = useMemo(() => {
    const text = (q || "").trim().toLowerCase();
    if (!text) return data;
    return data.filter((b) =>
      [b.books_title, b.books_author, b.books_slug]
        .filter(Boolean)
        .join("\n")
        .toLowerCase()
        .includes(text)
    );
  }, [data, q]);

  // *** Actions
  const createBook = useCreateBook(schoolId);
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const [bookModal, setBookModal] = useState<{
    mode: "create" | "edit";
    book?: BookAPI | null;
  } | null>(null);

  // state untuk modal hapus
  const [deleteBookData, setDeleteBookData] = useState<BookAPI | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteBook = async () => {
    if (deleteBookData) {
      await deleteBook.mutateAsync(deleteBookData.books_id);
      setDeleteModalOpen(false); // Menutup modal setelah berhasil menghapus
    }
  };

  /* ====== Columns (Desktop) */
  const columns: Column<BookAPI & { _index: number }>[] = [
    {
      key: "no",
      header: "No",
      cell: (r) => r._index + 1,
      className: "w-[60px]",
    },
    {
      key: "cover",
      header: "Cover",
      cell: (r) =>
        r.books_image_url ? (
          <img
            src={r.books_image_url}
            alt={r.books_title}
            className="w-10 h-14 object-cover rounded-md"
          />
        ) : (
          <span
            className="w-10 h-14 grid place-items-center rounded-md"
            style={{ background: palette.white2 }}
          >
            <ImageOff size={16} />
          </span>
        ),
      className: "w-[56px]",
    },
    {
      key: "title",
      header: "Judul & Penulis",
      cell: (r) => (
        <div className="min-w-0">
          <div
            className="font-medium truncate"
            style={{ color: palette.black1 }}
          >
            {r.books_title || "(Tanpa judul)"}
          </div>
          <div className="text-sm truncate" style={{ color: palette.black2 }}>
            {r.books_author || "-"}
          </div>
          {!!r.books_desc && (
            <div
              className="text-sm mt-1 line-clamp-2"
              style={{ color: palette.black2 }}
            >
              {r.books_desc}
            </div>
          )}
          {r.books_url && (
            <a
              href={r.books_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-sm underline mt-1"
              style={{ color: palette.primary }}
            >
              <ExternalLink size={14} /> Kunjungi
            </a>
          )}
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      className: "w-[180px]",
      cell: (r) => r.books_slug ?? "-",
    },
    {
      key: "usage",
      header: "Dipakai di",
      cell: () => "-",
      className: "w-[160px]",
    },
    {
      key: "aksi",
      header: "Aksi",
      className: "w-[210px]",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Btn
            palette={palette}
            size="sm"
            variant="secondary"
            className="inline-flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              setBookModal({ mode: "edit", book: r });
            }}
          >
            <Pencil size={14} /> Edit
          </Btn>
          <Btn
            palette={palette}
            size="sm"
            variant="ghost"
            className="inline-flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteBookData(r); // Menyimpan data buku yang akan dihapus
              setDeleteModalOpen(true); // Menampilkan modal konfirmasi
            }}
          >
            <Trash2 size={14} /> Hapus
          </Btn>

        </div>
      ),
    },
  ];

  /* ====== Mobile Card */
  const CardItem = (b: BookAPI) => (
    <div
      key={b.books_id}
      className="rounded-2xl border p-4 flex gap-3 cursor-pointer"
      style={{ borderColor: palette.silver1, background: palette.white1 }}
      onClick={() => {
        const qs = new URLSearchParams(sp).toString();
        const url = `${base}/sekolah/buku/detail/${b.books_id}${qs ? `?${qs}` : ""}`;
        navigate(url);
      }}
    >
      <div className="shrink-0">
        {b.books_image_url ? (
          <img
            src={b.books_image_url}
            alt={b.books_title}
            className="w-12 h-16 object-cover rounded-md"
          />
        ) : (
          <span
            className="w-12 h-16 grid place-items-center rounded-md"
            style={{ background: palette.white2 }}
          >
            <ImageOff size={16} />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium truncate" style={{ color: palette.black1 }}>
          {b.books_title || "(Tanpa judul)"}
        </div>
        <div className="text-sm truncate" style={{ color: palette.black2 }}>
          {b.books_author || "-"}
        </div>
        {!!b.books_desc && (
          <div
            className="text-sm mt-1 line-clamp-2"
            style={{ color: palette.black2 }}
          >
            {b.books_desc}
          </div>
        )}
        <div className="mt-3 flex items-center gap-2">
          {b.books_url && (
            <a
              href={b.books_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-sm underline"
              style={{ color: palette.primary }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} /> Kunjungi
            </a>
          )}
          <div
            className="ml-auto flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Btn
              palette={palette}
              size="sm"
              variant="secondary"
              className="inline-flex items-center gap-1"
              onClick={() => setBookModal({ mode: "edit", book: b })}
            >
              <Pencil size={14} /> Edit
            </Btn>
            <Btn
              palette={palette}
              size="sm"
              variant="ghost"
              className="inline-flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteBookData(b); // Menyimpan data buku yang akan dihapus
                setDeleteModalOpen(true); // Menampilkan modal konfirmasi
              }}
            >
              <Trash2 size={14} /> Hapus
            </Btn>

          </div>
        </div>
      </div>
    </div>
  );

  /* ====== Render ====== */
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      {/* ===== Header: wrap-friendly (seragam dgn Academic Terms) ===== */}
      <div
        className="p-4 md:p-5 pb-3 hidden md:flex flex-wrap items-center gap-2"
        style={{ borderColor: palette.silver1 }}
      >
        {/* Back (opsional) */}
        {showBack && (
          <Btn
            palette={palette}
            variant="ghost"
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="inline-flex items-center gap-2 order-1">
            <ArrowLeft size={20} />
          </Btn>
        )}

        {/* Title */}
        <div className="flex items-center gap-2 font-semibold order-2">
          <h1>Daftar Buku </h1>
        </div>
      </div>
      {/* Search + per-page */}
        <div className="order-4 sm:order-3 w-full sm:w-auto flex-1 min-w-0">
          <SearchBar
            palette={palette}
            value={q}
            onChange={setQ}
            placeholder="Cari judul, penulis, atau slug…"
            debounceMs={500}
            className="w-full"
            leftIcon={
              <SearchIcon
                size={18}
                style={{ color: palette.black2, opacity: 0.7 }}
              />
            }
            rightExtra={
              <PerPageSelect
                palette={palette}
                value={limit}
                onChange={(n) => setLimit(n)}
              />
            }
          />
        </div>

        {/* Add */}
        <div className="order-3 sm:order-4 ml-auto flex items-center gap-2 mt-2">
          <Btn
            palette={palette}
            size="sm"
            className="gap-1"
            onClick={() => setBookModal({ mode: "create" })}
          >
            <Plus size={18} /> Buku
          </Btn>
        </div>

      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6 mt-2">
          {/* ===== Section: List (seragam) ===== */}
          <SectionCard palette={palette}>
            <div
              className="p-4 md:p-5 pb-3 border-b flex items-center justify-between gap-2"
              style={{ borderColor: palette.silver1 }}
            >
              <div className="flex items-center gap-2 font-semibold">
                <BookOpen size={18} color={palette.quaternary} /> Daftar Buku
              </div>
              <div className="text-sm" style={{ color: palette.black2 }}>
                {booksQ.isFetching ? "memuat…" : `${total} total`}
              </div>
            </div>

            <div className="p-4 md:p-5">
              {booksQ.isLoading ? (
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
                  <Info size={16} /> Belum ada buku.
                </div>
              ) : items.length === 0 ? (
                <div
                  className="rounded-xl border p-4 text-sm flex items-center gap-2"
                  style={{
                    borderColor: palette.silver1,
                    color: palette.silver2,
                  }}
                >
                  <Info size={16} /> Tidak ada hasil untuk pencarianmu.
                </div>
              ) : (
                <>
                  {/* Mobile: Cards */}
                  <div className="md:hidden">
                    <CardGrid items={items} renderItem={CardItem} />
                  </div>

                  {/* Desktop: Table */}
                  <div className="hidden md:block">
                    <DataTable
                      palette={palette}
                      columns={columns}
                      rows={items.map((b, i) => ({ ...b, _index: offset + i }))}
                      minWidth={900}
                    />
                  </div>

                  {/* ===== Pagination Footer ===== */}
                  <PaginationBar
                    palette={palette}
                    pageStart={items.length ? offset + 1 : 0}
                    pageEnd={Math.min(offset + limit, total)}
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
                        {booksQ.isFetching ? "memuat…" : `${total} total`}
                      </span>
                    }
                  />
                </>
              )}
            </div>
          </SectionCard>

          {/* ===== Timestamp kecil (opsional, serupa lainnya) ===== */}
          <div className="text-sm px-1" style={{ color: palette.black2 }}>
            {yyyyMmDdLocal()}
          </div>
        </div>
      </main>

      {/* Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteBook}
        palette={palette}
        title="Hapus Buku?"
        message={`Yakin ingin menghapus buku "${deleteBookData?.books_title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        loading={deleteBook.isPending}/>
    </div>
  );
};

export default SchoolBooks;