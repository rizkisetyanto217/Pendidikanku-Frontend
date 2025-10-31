// src/pages/sekolahislamku/dashboard-school/books/SchoolBooks.tsx
import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import axios from "@/lib/axios";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/Primitives";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  ArrowLeft,
} from "lucide-react";

import ParentTopBar from "@/pages/pendidikanku-dashboard/components/home/ParentTopBar";
import SimpleTable from "@/components/common/main/SimpleTable";
import ActionEditDelete from "@/components/common/main/MainActionEditDelete";
import BookModal from "./components/SchoolBookModal";
import ParentSidebar from "../../components/home/ParentSideBar";

/* ============== Types API (PUBLIC) ============== */
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
  // NOTE: endpoint publik belum expose pagination; properti ini opsional
  pagination?: { limit: number; offset: number; total: number };
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

/* ============== Props ============== */
type SchoolBooksProps = {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
};

/* ============== Helpers ============== */
const yyyyMmDdLocal = (d = new Date()) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/* ============== Data Hook: /api/public/{masjid_id}/books/list ============== */
function useBooksListPublic(params: { masjidId: string; limit: number; offset: number }) {
  const { masjidId, limit, offset } = params;
  return useQuery<BooksResponse>({
    queryKey: ["books-list-public", { masjidId, limit, offset }],
    queryFn: async () => {
      // Endpoint publik saat ini tidak mendukung pagination di server;
      // kita ambil semua lalu filter/paginate di client jika perlu.
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

      // Pagination client-side (opsional—untuk menjaga UI sekarang)
      const total = mapped.length;
      const sliced = mapped.slice(offset, Math.min(offset + limit, total));

      return {
        data: sliced,
        pagination: { limit, offset, total },
      };
    },
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: "always",
    retry: 1,
  });
}

/* ============== Skeletons ============== */
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

/* ============== Page ============== */
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
    slug?: string; // tetap dukung base slug untuk detail route
  }>();
  const masjidId =
    params.masjidId || params.masjid_id || ""; // wajib ada untuk endpoint publik

  const limit = Math.min(Math.max(Number(sp.get("limit") || 20), 1), 200);
  const offset = Math.max(Number(sp.get("offset") || 0), 0);

  const booksQ = useBooksListPublic({ masjidId, limit, offset });

  const [bookModal, setBookModal] = useState<{
    mode: "create" | "edit";
    book?: BookAPI | null;
  } | null>(null);

  const base = params.slug ? `/${encodeURIComponent(params.slug)}` : "";

  const qc = useQueryClient();
  const deleteBook = useMutation({
    mutationFn: async (bookId: string) => {
      // NOTE: hapus tetap via admin route. Jika halaman publik tidak boleh hapus,
      // cukup sembunyikan tombol delete dari UI publik.
      const r = await axios.delete(`/api/a/books/${bookId}`, {
        withCredentials: true,
      });
      return r.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["books-list-public"] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message ?? "Gagal menghapus buku.");
    },
  });

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

  /* ============== Rows ============== */
  const rows = useMemo(() => {
    return items.map((b, idx): React.ReactNode[] => {
      const cover = b.books_image_url ? (
        <img
          src={b.books_image_url}
          alt={b.books_title}
          className="w-10 h-14 object-cover rounded-md"
          style={{ background: palette.white2 }}
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
          />
        </div>
      );

      return [String(offset + idx + 1), cover, titleBlock, "-", actions];
    });
  }, [items, palette, offset, deleteBook.isPending]);

  /* ============== MobileCards ============== */
  const MobileCards = () => (
    <div className="grid grid-cols-1 gap-3">
      {items.map((b) => (
        <div
          key={b.books_id}
          className="rounded-xl border p-3 flex gap-3 cursor-pointer transition hover:bg-gray-50"
          style={{ borderColor: palette.silver1, background: palette.white1 }}
          onClick={() => {
            const qs = sp.toString();
            nav(`${base}/sekolah/buku/detail/${b.books_id}${qs ? `?${qs}` : ""}`);
          }}
        >
          <div className="shrink-0">
            {b.books_image_url ? (
              <img
                src={b.books_image_url}
                alt={b.books_title}
                className="w-12 h-16 object-cover rounded-md"
                style={{ background: palette.white2 }}
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
            <div className="font-medium truncate" style={{ color: palette.black2 }}>
              {b.books_title || "(Tanpa judul)"}
            </div>
            <div className="text-sm opacity-90 truncate" style={{ color: palette.black2 }}>
              {b.books_author || "-"}
            </div>
            {!!b.books_desc && (
              <div className="text-sm opacity-80 mt-1 line-clamp-2" style={{ color: palette.black2 }}>
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
                    const ok = confirm(`Hapus buku ini?\nJudul: ${b.books_title ?? "-"}`);
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
    <div className="min-h-screen w-full" style={{ background: palette.white2, color: palette.black1 }}>
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
              <Btn palette={palette} onClick={() => setBookModal({ mode: "create" })}>
                + Buku
              </Btn>
            </div>

            {/* Filter */}
            <SectionCard palette={palette}>
              <div className="p-4 md:p-5 pb-2 font-medium">Filter</div>
              <div className="px-4 md:px-5 pb-4">
                <div className="relative">
                  <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
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
              {yyyyMmDdLocal()} • {booksQ.isFetching ? "memuat…" : `${total} total`}
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
                    {q ? "Tidak ada hasil untuk pencarianmu." : "Belum ada buku."}
                  </div>
                </SectionCard>
              ) : (
                <MobileCards />
              )}
            </div>

            <div className="hidden md:block" style={{ color: palette.black2 }}>
              <SimpleTable
                columns={["No", "Cover", "Judul & Penulis", "Dipakai di", "Aksi"]}
                rows={rows}
                onRowClick={(rowIndex) => {
                  const book = items[rowIndex];
                  if (!book) return;
                  const qs = sp.toString();
                  nav(`${base}/sekolah/buku/detail/${book.books_id}${qs ? `?${qs}` : ""}`);
                }}
                emptyText={booksQ.isLoading ? "Memuat…" : "Belum ada buku."}
              />
            </div>

            {/* Pagination (client-side agar UI konsisten) */}
            {total > limit && (
              <div className="flex items-center justify-between text-sm">
                <div>Menampilkan {Math.min(limit, showing)} dari {total}</div>
                <div className="flex items-center gap-2">
                  <Btn palette={palette} onClick={() => onPage(-1)} disabled={offset <= 0}>
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
        onSuccess={() => {
          setBookModal(null);
          booksQ.refetch();
        }}
      />
    </div>
  );
};

export default SchoolBooks;
