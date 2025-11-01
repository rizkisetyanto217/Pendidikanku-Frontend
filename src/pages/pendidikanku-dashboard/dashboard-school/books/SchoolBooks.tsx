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
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  ArrowLeft,
  X,
} from "lucide-react";
import SimpleTable from "@/components/common/main/SimpleTable";
import ActionEditDelete from "@/components/common/main/MainActionEditDelete";

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

// Bentuk yang dipakai komponen-komponen lain (dipertahankan)
export type BookAPI = {
  books_id: string;
  books_masjid_id: string;
  books_title: string;
  books_author?: string | null;
  books_desc?: string | null;
  books_url?: string | null;
  books_image_url?: string | null;
  books_slug?: string | null;
  usages: UsageItem[];
};

// Response internal yang sudah dinormalisasi
export type BooksResponse = {
  data: BookAPI[];
  pagination?: { limit: number; offset: number; total: number }; // opsional (client-side paging)
};

// Bentuk response mentah dari endpoint publik
type PublicBook = {
  book_id: string;
  book_masjid_id: string;
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
  file?: File | null; // cover tunggal (opsional)
  files?: File[] | null; // lampiran multi (opsional)
  urls?: string[] | null; // daftar URL eksternal (opsional)
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
   Data Hook: /public/{masjid_id}/books/list  (read-only)
========================================================= */
function useBooksListPublic(params: {
  masjidId: string;
  limit: number;
  offset: number;
}) {
  const { masjidId, limit, offset } = params;
  return useQuery<BooksResponse>({
    queryKey: ["books-list-public", { masjidId, limit, offset }],
    queryFn: async () => {
      const r = await axios.get<PublicBooksResponse>(
        `/public/${encodeURIComponent(masjidId)}/books/list`,
        { withCredentials: false }
      );

      const mapped: BookAPI[] = (r.data?.data ?? []).map((b) => ({
        books_id: b.book_id,
        books_masjid_id: b.book_masjid_id,
        books_title: b.book_title,
        books_author: b.book_author ?? null,
        books_desc: b.book_desc ?? null,
        books_url: null, // tidak tersedia di endpoint publik
        books_image_url: b.book_image_url ?? null,
        books_slug: b.book_slug ?? null,
        usages: [], // tidak tersedia di endpoint publik
      }));

      // Client-side pagination agar UI konsisten
      const total = mapped.length;
      const sliced = mapped.slice(offset, Math.min(offset + limit, total));
      return { data: sliced, pagination: { limit, offset, total } };
    },
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: "always",
    retry: 1,
  });
}

/* =========================================================
   Admin Mutations (POST / PATCH / DELETE)
========================================================= */
function useCreateBook(masjidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BookFormInput) => {
      const fd = buildBookFormData(payload);
      const { data } = await axios.post(
        `/api/a/${encodeURIComponent(masjidId)}/books`,
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
    },
  });
}

function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: string) => {
      const { data } = await axios.delete(
        `/api/a/books/${encodeURIComponent(bookId)}`,
        {
          withCredentials: true,
        }
      );
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["books-list-public"] });
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
   Inline Modal (presentational, submit dikerjakan parent)
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
            <X size={18} />
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
                style={{ background: "rgba(0,0,0,.05)" }}
              >
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <span className="text-xs opacity-60">Preview cover</span>
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
                />
                {!!form.urls?.length && (
                  <div className="text-xs mt-1 opacity-80">
                    {form.urls.map((u, i) => (
                      <span key={i} className="inline-block mr-2">
                        • {u}
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
              variant="ghost"
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
type SchoolBooksProps = {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
};

const SchoolBooks: React.FC<SchoolBooksProps> = ({
  showBack = false,
  backTo,
  backLabel = "Kembali",
}) => {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const [q, setQ] = useState(sp.get("q") || "");

  // Ambil masjidId dari path param (dukung beberapa kemungkinan nama)
  const params = useParams<{
    masjidId?: string;
    masjid_id?: string;
    slug?: string;
  }>();
  const masjidId = params.masjidId || params.masjid_id || "";

  const limit = Math.min(Math.max(Number(sp.get("limit") || 20), 1), 200);
  const offset = Math.max(Number(sp.get("offset") || 0), 0);

  const booksQ = useBooksListPublic({ masjidId, limit, offset });

  const [bookModal, setBookModal] = useState<{
    mode: "create" | "edit";
    book?: BookAPI | null;
  } | null>(null);

  const base = params.slug ? `/${encodeURIComponent(params.slug)}` : "";

  // Admin mutations
  const createBook = useCreateBook(masjidId);
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const items = useMemo(() => {
    const src = booksQ.data?.data ?? [];
    const text = q.trim().toLowerCase();
    if (!text) return src;
    return src.filter((b) =>
      [b.books_title, b.books_author, b.books_slug]
        .filter(Boolean)
        .join("\n")
        .toLowerCase()
        .includes(text)
    );
  }, [booksQ.data?.data, q]);

  const total = booksQ.data?.pagination?.total ?? 0;
  const showing = items.length;

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

  /* ============== Rows (Desktop) ============== */
  const rows = useMemo(() => {
    return items.map((b, idx): React.ReactNode[] => {
      const cover = b.books_image_url ? (
        <img
          src={b.books_image_url}
          alt={b.books_title}
          className="w-10 h-14 object-cover rounded-md"
        />
      ) : (
        <span
          className="w-10 h-14 grid place-items-center rounded-md"
          style={{ background: palette.white2 }}
        >
          <ImageOff size={16} />
        </span>
      );

      const titleBlock = (
        <div className="min-w-0">
          <div className="font-medium truncate">
            {b.books_title || "(Tanpa judul)"}
          </div>
          <div className="text-sm opacity-90 truncate">
            {b.books_author || "-"}
          </div>
          {!!b.books_desc && (
            <div className="text-sm opacity-90 mt-1 line-clamp-2">
              {b.books_desc}
            </div>
          )}
          {b.books_url && (
            <a
              href={b.books_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-sm underline mt-1"
              style={{ color: palette.primary }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} /> Kunjungi
            </a>
          )}
        </div>
      );

      const actions = (
        <div onClick={(e) => e.stopPropagation()}>
          <ActionEditDelete
            onEdit={() => setBookModal({ mode: "edit", book: b })}
            onDelete={() => {
              if (deleteBook.isPending) return;
              const ok = confirm(
                `Hapus buku ini?\nJudul: ${b.books_title ?? "-"}`
              );
              if (!ok) return;
              deleteBook.mutate(b.books_id);
            }}
          />
        </div>
      );

      return [String(offset + idx + 1), cover, titleBlock, "-", actions];
    });
  }, [items, palette, offset, deleteBook.isPending]);

  /* ============== Cards (Mobile) ============== */
  const MobileCards = () => (
    <div className="grid grid-cols-1 gap-3">
      {items.map((b) => (
        <div
          key={b.books_id}
          className="rounded-xl border p-3 flex gap-3 cursor-pointer transition hover:bg-gray-50"
          style={{ borderColor: palette.silver1, background: palette.white1 }}
          onClick={() => {
            const qs = sp.toString();
            nav(
              `${base}/sekolah/buku/detail/${b.books_id}${qs ? `?${qs}` : ""}`
            );
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
            <div
              className="font-medium truncate"
              style={{ color: palette.black2 }}
            >
              {b.books_title || "(Tanpa judul)"}
            </div>
            <div
              className="text-sm opacity-90 truncate"
              style={{ color: palette.black2 }}
            >
              {b.books_author || "-"}
            </div>
            {!!b.books_desc && (
              <div
                className="text-sm opacity-80 mt-1 line-clamp-2"
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
              <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                <ActionEditDelete
                  onEdit={() => setBookModal({ mode: "edit", book: b })}
                  onDelete={() => {
                    if (deleteBook.isPending) return;
                    const ok = confirm(
                      `Hapus buku ini?\nJudul: ${b.books_title ?? "-"}`
                    );
                    if (!ok) return;
                    deleteBook.mutate(b.books_id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  /* ============== Render ============== */
  return (
    <div
      className="w-full"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main content */}
          <section className="flex-1 flex flex-col space-y-6 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="md:flex hidden items-center gap-3">
                {showBack && (
                  <Btn
                    palette={palette}
                    variant="ghost"
                    onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
                    className="inline-flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                  </Btn>
                )}
                <h1 className="text-lg font-semibold">Buku Pelajaran</h1>
              </div>
              <Btn
                palette={palette}
                onClick={() => setBookModal({ mode: "create" })}
              >
                + Buku
              </Btn>
            </div>

            {/* Filter */}
            <SectionCard palette={palette}>
              <div className="p-4 md:p-5 pb-2 font-medium">Filter</div>
              <div className="px-4 md:px-5 pb-4">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60"
                  />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari judul/penulis/slug…"
                    className="pl-7 pr-3 py-2 rounded-lg text-sm border w-full bg-transparent"
                    style={{ borderColor: palette.silver1 }}
                  />
                </div>
              </div>
            </SectionCard>

            {/* Summary */}
            <div className="text-sm px-1" style={{ color: palette.black2 }}>
              {yyyyMmDdLocal()} •{" "}
              {booksQ.isFetching ? "memuat…" : `${total} total`}
            </div>

            {/* List: Mobile / Desktop */}
            <div className="md:hidden">
              {booksQ.isLoading ? (
                <div className="grid grid-cols-1 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <CardSkeleton key={i} palette={palette} />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <SectionCard palette={palette} className="p-10 text-center">
                  <div className="text-sm" style={{ color: palette.black2 }}>
                    {q
                      ? "Tidak ada hasil untuk pencarianmu."
                      : "Belum ada buku."}
                  </div>
                </SectionCard>
              ) : (
                <MobileCards />
              )}
            </div>

            <div className="hidden md:block" style={{ color: palette.black2 }}>
              <SimpleTable
                columns={[
                  "No",
                  "Cover",
                  "Judul & Penulis",
                  "Dipakai di",
                  "Aksi",
                ]}
                rows={rows}
                onRowClick={(rowIndex) => {
                  const book = items[rowIndex];
                  if (!book) return;
                  const qs = sp.toString();
                  const url = `${base}/sekolah/buku/detail/${book.books_id}${qs ? `?${qs}` : ""}`;
                  nav(url);
                }}
                emptyText={booksQ.isLoading ? "Memuat…" : "Belum ada buku."}
              />
            </div>

            {/* Pagination (client-side agar UI konsisten) */}
            {total > limit && (
              <div className="flex items-center justify-between text-sm">
                <div>
                  Menampilkan {Math.min(limit, showing)} dari {total}
                </div>
                <div className="flex items-center gap-2">
                  <Btn
                    palette={palette}
                    onClick={() => onPage(-1)}
                    disabled={offset <= 0}
                  >
                    <ChevronLeft size={16} /> Prev
                  </Btn>
                  <Btn
                    palette={palette}
                    onClick={() => onPage(1)}
                    disabled={offset + limit >= total}
                  >
                    Next <ChevronRight size={16} />
                  </Btn>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal */}
      <BookModal
        open={!!bookModal}
        mode={bookModal?.mode ?? "create"}
        book={bookModal?.book ?? null}
        palette={palette}
        onClose={() => setBookModal(null)}
        onSubmit={async (form) => {
          if (bookModal?.mode === "edit" && bookModal.book) {
            await updateBook.mutateAsync({
              bookId: bookModal.book.books_id,
              payload: form,
            });
          } else {
            await createBook.mutateAsync(form);
          }
        }}
        submitting={createBook.isPending || updateBook.isPending}
        onSuccess={() => {
          setBookModal(null);
          booksQ.refetch();
        }}
      />
    </div>
  );
};

export default SchoolBooks;
