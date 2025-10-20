import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/dashboard-school/books/SchoolBooks.tsx
import { useMemo, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import axios from "@/lib/axios";
// import { useEffectiveMasjidId } from "@/hooks/useEffectiveMasjidId";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Search, ChevronLeft, ChevronRight, ImageOff, ArrowLeft, } from "lucide-react";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import SimpleTable from "@/components/common/main/SimpleTable";
import ActionEditDelete from "@/components/common/main/MainActionEditDelete";
import BookModal from "./components/BookModal";
import ParentSidebar from "../../components/home/ParentSideBar";
/* ============== Helpers ============== */
const yyyyMmDdLocal = (d = new Date()) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "";
const hijriWithWeekday = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
/* ============== Data Hook: /api/a/books ============== */
function useBooksList(params) {
    const { limit, offset } = params;
    return useQuery({
        queryKey: ["books-list", { limit, offset }],
        queryFn: async () => {
            const r = await axios.get("/api/a/books", {
                withCredentials: true,
                params: { limit, offset },
            });
            return r.data;
        },
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: "always",
        retry: 1,
    });
}
/* ============== Dummy Data ============== */
const DUMMY_BOOKS = [
    {
        books_id: "dummy-1",
        books_masjid_id: "masjid-1",
        books_title: "Matematika Dasar",
        books_author: "Ahmad Fauzi",
        books_desc: "Buku dasar untuk memahami konsep matematika SD.",
        books_url: "https://contoh.com/matematika-dasar",
        books_image_url: null,
        books_slug: "matematika-dasar",
        usages: [],
    },
    {
        books_id: "dummy-2",
        books_masjid_id: "masjid-1",
        books_title: "Bahasa Indonesia",
        books_author: "Siti Nurhaliza",
        books_desc: "Panduan belajar Bahasa Indonesia dengan mudah.",
        books_url: "https://contoh.com/bahasa-indonesia",
        books_image_url: null,
        books_slug: "bahasa-indonesia",
        usages: [],
    },
    {
        books_id: "dummy-3",
        books_masjid_id: "masjid-1",
        books_title: "IPA Terapan",
        books_author: "Budi Santoso",
        books_desc: "Eksperimen IPA untuk siswa SMP.",
        books_url: null,
        books_image_url: null,
        books_slug: "ipa-terapan",
        usages: [],
    },
];
/* ============== Skeletons ============== */
function CardSkeleton({ palette }) {
    return (_jsx("div", { className: "rounded-xl border p-4 animate-pulse", style: { borderColor: palette.silver1, background: palette.white1 }, children: _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-10 h-14 rounded-md", style: { background: palette.white2 } }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx("div", { className: "h-4 w-2/3 rounded", style: { background: palette.white2 } }), _jsx("div", { className: "h-3 w-1/2 rounded", style: { background: palette.white2 } }), _jsx("div", { className: "h-3 w-full rounded", style: { background: palette.white2 } })] })] }) }));
}
/* ============== Page ============== */
const SchoolBooks = ({ showBack = false, backTo, backLabel = "Kembali", }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    // useEffectiveMasjidId();
    const [sp, setSp] = useSearchParams();
    const nav = useNavigate();
    const [q, setQ] = useState(sp.get("q") || "");
    const limit = Math.min(Math.max(Number(sp.get("limit") || 20), 1), 200);
    const offset = Math.max(Number(sp.get("offset") || 0), 0);
    const booksQ = useBooksList({ limit, offset });
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    const [bookModal, setBookModal] = useState(null);
    const { slug = "" } = useParams();
    const base = slug ? `/${encodeURIComponent(slug)}` : "";
    const qc = useQueryClient();
    const deleteBook = useMutation({
        mutationFn: async (bookId) => {
            const r = await axios.delete(`/api/a/books/${bookId}`, {
                withCredentials: true,
            });
            return r.data;
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["books-list"] });
        },
        onError: (err) => {
            alert(err?.response?.data?.message ?? "Gagal menghapus buku.");
        },
    });
    const items = useMemo(() => {
        const src = booksQ.data?.data?.length ? booksQ.data.data : DUMMY_BOOKS;
        const text = q.trim().toLowerCase();
        if (!text)
            return src;
        return src.filter((b) => [b.books_title, b.books_author, b.books_slug]
            .filter(Boolean)
            .join("\n")
            .toLowerCase()
            .includes(text));
    }, [booksQ.data?.data, q]);
    const total = booksQ.data?.pagination?.total ?? 0;
    const showing = items.length;
    const onPage = (dir) => {
        const nextOffset = Math.max(offset + dir * limit, 0);
        setSp((prev) => {
            const p = new URLSearchParams(prev);
            p.set("limit", String(limit));
            p.set("offset", String(nextOffset));
            if (q)
                p.set("q", q);
            return p;
        }, { replace: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    /* ============== Rows ============== */
    const rows = useMemo(() => {
        return items.map((b, idx) => {
            const cover = b.books_image_url ? (_jsx("img", { src: b.books_image_url, alt: b.books_title, className: "w-10 h-14 object-cover rounded-md", style: { background: palette.white2 } })) : (_jsx("span", { className: "w-10 h-14 grid place-items-center rounded-md", style: { background: palette.white2 }, children: _jsx(ImageOff, { size: 16 }) }));
            const titleBlock = (_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: b.books_title || "(Tanpa judul)" }), _jsx("div", { className: "text-sm opacity-90 truncate", children: b.books_author || "-" }), !!b.books_desc && (_jsx("div", { className: "text-sm opacity-90 mt-1 line-clamp-2", children: b.books_desc })), b.books_url && (_jsxs("a", { href: b.books_url, target: "_blank", rel: "noreferrer noopener", className: "inline-flex items-center gap-1 text-sm underline mt-1", style: { color: palette.primary }, onClick: (e) => e.stopPropagation(), children: [_jsx(ExternalLink, { size: 14 }), " Kunjungi"] }))] }));
            const actions = (_jsx("div", { onClick: (e) => e.stopPropagation(), children: _jsx(ActionEditDelete, { onEdit: () => setBookModal({ mode: "edit", book: b }) }) }));
            return [
                String(offset + idx + 1),
                cover,
                titleBlock,
                "-",
                actions,
            ];
        });
    }, [items, palette, offset, deleteBook.isPending]);
    /* ============== MobileCards ============== */
    const MobileCards = () => (_jsx("div", { className: "grid grid-cols-1 gap-3", children: items.map((b) => (_jsxs("div", { className: "rounded-xl border p-3 flex gap-3 cursor-pointer transition hover:bg-gray-50", style: { borderColor: palette.silver1, background: palette.white1 }, onClick: () => {
                const qs = sp.toString();
                nav(`${base}/sekolah/buku/detail/${b.books_id}${qs ? `?${qs}` : ""}`);
            }, children: [_jsx("div", { className: "shrink-0", children: b.books_image_url ? (_jsx("img", { src: b.books_image_url, alt: b.books_title, className: "w-12 h-16 object-cover rounded-md", style: { background: palette.white2 } })) : (_jsx("span", { className: "w-12 h-16 grid place-items-center rounded-md", style: { background: palette.white2 }, children: _jsx(ImageOff, { size: 16 }) })) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "font-medium truncate", style: { color: palette.black2 }, children: b.books_title || "(Tanpa judul)" }), _jsx("div", { className: "text-sm opacity-90 truncate", style: { color: palette.black2 }, children: b.books_author || "-" }), !!b.books_desc && (_jsx("div", { className: "text-sm opacity-80 mt-1 line-clamp-2", style: { color: palette.black2 }, children: b.books_desc })), _jsxs("div", { className: "mt-3 flex items-center gap-2", children: [b.books_url && (_jsxs("a", { 
                                    // href={b.books_url}
                                    target: "_blank", rel: "noreferrer noopener", className: "inline-flex items-center gap-1 text-sm underline", style: { color: palette.primary }, onClick: (e) => e.stopPropagation(), children: [_jsx(ExternalLink, { size: 14 }), " Kunjungi"] })), _jsx("div", { className: "ml-auto", onClick: (e) => e.stopPropagation(), children: _jsx(ActionEditDelete, { onEdit: () => setBookModal({ mode: "edit", book: b }), onDelete: () => {
                                            if (deleteBook.isPending)
                                                return;
                                            const ok = confirm(`Hapus buku ini?\nJudul: ${b.books_title ?? "-"}`);
                                            if (!ok)
                                                return;
                                            deleteBook.mutate(b.books_id);
                                        } }) })] })] })] }, b.books_id))) }));
    /* ============== Render ============== */
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Buku Pelajaran", gregorianDate: new Date().toISOString(), hijriDate: hijriWithWeekday(new Date().toISOString()), showBack: isFromMenuUtama }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { className: "md:flex  hidden items-center gap-3", children: [showBack && (_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => (backTo ? navigate(backTo) : navigate(-1)), className: "inline-flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) })), _jsx("h1", { className: "text-lg font-semibold", children: "Buku Pelajaran" })] }), _jsx(Btn, { palette: palette, onClick: () => setBookModal({ mode: "create" }), children: "+ Buku" })] }), _jsxs(SectionCard, { palette: palette, children: [_jsx("div", { className: "p-4 md:p-5 pb-2 font-medium", children: "Filter" }), _jsx("div", { className: "px-4 md:px-5 pb-4", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2 top-1/2 -translate-y-1/2 opacity-60" }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari judul/penulis/slug\u2026", className: "pl-7 pr-3 py-2 rounded-lg text-sm border w-full bg-transparent", style: { borderColor: palette.silver1 } })] }) })] }), _jsxs("div", { className: "text-sm px-1", style: { color: palette.black2 }, children: [yyyyMmDdLocal(), " \u2022", " ", booksQ.isFetching ? "memuat…" : `${total} total`] }), _jsx("div", { className: "md:hidden", children: booksQ.isLoading ? (_jsx("div", { className: "grid grid-cols-1 gap-3", children: Array.from({ length: 4 }).map((_, i) => (_jsx(CardSkeleton, { palette: palette }, i))) })) : items.length === 0 ? (_jsx(SectionCard, { palette: palette, className: "p-10 text-center", children: _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: q
                                                ? "Tidak ada hasil untuk pencarianmu."
                                                : "Belum ada buku." }) })) : (_jsx(MobileCards, {})) }), _jsx("div", { className: "hidden md:block", style: { color: palette.black2 }, children: _jsx(SimpleTable, { columns: [
                                            "No",
                                            "Cover",
                                            "Judul & Penulis",
                                            "Dipakai di",
                                            "Aksi",
                                        ], rows: rows, onRowClick: (rowIndex) => {
                                            const book = items[rowIndex];
                                            if (!book)
                                                return;
                                            const qs = sp.toString();
                                            nav(`${base}/sekolah/buku/detail/${book.books_id}${qs ? `?${qs}` : ""}`);
                                        }, emptyText: booksQ.isLoading ? "Memuat…" : "Belum ada buku." }) }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("div", { children: ["Menampilkan ", showing, " dari ", total] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Btn, { palette: palette, onClick: () => onPage(-1), disabled: offset <= 0, children: [_jsx(ChevronLeft, { size: 16 }), " Prev"] }), _jsxs(Btn, { palette: palette, onClick: () => onPage(1), disabled: offset + limit >= total, children: ["Next ", _jsx(ChevronRight, { size: 16 })] })] })] })] })] }) }), _jsx(BookModal, { open: !!bookModal, mode: bookModal?.mode ?? "create", book: bookModal?.book ?? null, palette: palette, onClose: () => setBookModal(null), onSuccess: () => {
                    setBookModal(null);
                    booksQ.refetch();
                } })] }));
};
export default SchoolBooks;
