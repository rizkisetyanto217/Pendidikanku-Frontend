import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/dashboard-school/books/SchoolBookDetail.tsx
import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { BookOpen, ArrowLeft, ExternalLink, ImageOff } from "lucide-react";
/* ============ Dummy Data ============ */
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
        usages: [
            {
                class_subject_books_id: "csb-1",
                class_subjects_id: "sub-1",
                subjects_id: "mat-1",
                classes_id: "cls-1",
                sections: [
                    {
                        class_sections_id: "sec-1",
                        class_sections_name: "Kelas 1A",
                        class_sections_slug: "kelas-1a",
                        class_sections_code: "1A",
                        class_sections_capacity: 30,
                        class_sections_is_active: true,
                    },
                ],
            },
        ],
    },
];
/* ============ Helpers ============ */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })
    : "";
/* ============ API ============ */
async function fetchBookDetail(id) {
    try {
        const r = await axios.get(`/api/a/books/${id}`);
        return r.data?.data ?? null;
    }
    catch {
        return null;
    }
}
/* ============ Page ============ */
export default function SchoolBookDetail() {
    const { slug = "", id = "" } = useParams();
    const base = slug ? `/${encodeURIComponent(slug)}` : "";
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const q = useQuery({
        queryKey: ["book-detail", id],
        enabled: !!id,
        queryFn: () => fetchBookDetail(id),
        staleTime: 60_000,
    });
    const book = q.data ?? DUMMY_BOOKS.find((b) => b.books_id === id || b.books_slug === id);
    const sectionsFlat = useMemo(() => (book?.usages ?? []).flatMap((u) => u.sections || []), [book?.usages]);
    return (_jsxs("div", { className: "min-h-screen", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Buku", gregorianDate: new Date().toISOString(), showBack: true }), _jsx("main", { className: "w-full px-4 py-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: " items-center gap-1.5 md:mt-0 hidden md:flex", children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-lg md:text-xl font-semibold", children: book?.books_title ??
                                                        (q.isLoading ? "Memuat…" : "Buku tidak ditemukan") }), _jsx("p", { className: "text-sm", style: { color: palette.black2 }, children: book?.books_author ?? "—" })] })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6", children: [_jsx("div", { className: "md:col-span-4", children: _jsx("div", { className: "w-full aspect-[3/4] rounded-xl overflow-hidden grid place-items-center border", style: { borderColor: palette.silver1 }, children: book?.books_image_url ? (_jsx("img", { src: book.books_image_url, alt: book.books_title, className: "w-full h-full object-cover" })) : (_jsxs("div", { className: "flex flex-col items-center text-sm opacity-70", children: [_jsx(ImageOff, { size: 18 }), _jsx("span", { children: "Tidak ada cover" })] })) }) }), _jsxs("div", { className: "md:col-span-8 space-y-4", children: [_jsx(InfoBlock, { label: "Judul", value: book?.books_title ?? "—", palette: palette }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: _jsx(InfoBlock, { label: "Penulis", value: book?.books_author ?? "—", palette: palette }) }), book?.books_url && (_jsxs("a", { href: book.books_url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 text-sm underline", style: { color: palette.primary }, children: [_jsx(ExternalLink, { size: 14 }), " Kunjungi URL Buku"] })), book?.books_desc && (_jsxs("div", { children: [_jsx("div", { className: "text-sm mb-1", style: { color: palette.black2 }, children: "Deskripsi" }), _jsx("p", { className: "text-sm leading-relaxed", children: book.books_desc })] }))] })] }) }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 border-b font-medium flex items-center gap-2", style: { borderColor: palette.silver1 }, children: [_jsx(BookOpen, { size: 18 }), " Dipakai di Kelas/Section"] }), _jsx("div", { className: "p-4 md:p-6", children: !book ? (_jsx("p", { className: "text-sm", style: { color: palette.black2 }, children: q.isLoading ? "Memuat…" : "Buku tidak ditemukan." })) : sectionsFlat.length === 0 ? (_jsx("p", { className: "text-sm", style: { color: palette.black2 }, children: "Belum terhubung ke kelas/section." })) : (_jsx("div", { className: "flex flex-wrap gap-2", children: sectionsFlat.map((s) => (_jsxs(Link, { to: `${base}/sekolah/classes/${s.class_sections_id}`, className: "px-3 py-1 rounded-full text-sm border", style: {
                                                        borderColor: palette.silver1,
                                                        color: palette.black2,
                                                    }, children: [s.class_sections_name, s.class_sections_code && ` (${s.class_sections_code})`] }, s.class_sections_id))) })) })] })] })] }) })] }));
}
/* ============ Small UI ============ */
function InfoBlock({ label, value, palette, }) {
    return (_jsxs("div", { children: [_jsx("div", { className: "text-sm mb-1", style: { color: palette.black2 }, children: label }), _jsx("div", { className: "font-medium text-sm", children: value })] }));
}
