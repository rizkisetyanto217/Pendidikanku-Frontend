import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
export default function BookModal({ open, mode, palette, book, onClose, onSuccess, }) {
    const qc = useQueryClient();
    const isEdit = mode === "edit";
    // form
    const [title, setTitle] = useState(book?.books_title ?? "");
    const [author, setAuthor] = useState(book?.books_author ?? "");
    const [desc, setDesc] = useState(book?.books_desc ?? "");
    const [url, setUrl] = useState(book?.books_url ?? "");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(book?.books_image_url ?? null);
    useEffect(() => {
        if (!open)
            return;
        setTitle(book?.books_title ?? "");
        setAuthor(book?.books_author ?? "");
        setDesc(book?.books_desc ?? "");
        setUrl(book?.books_url ?? "");
        setPreview(book?.books_image_url ?? null);
        setFile(null);
    }, [book?.books_id, open]);
    useEffect(() => {
        if (!file)
            return;
        const u = URL.createObjectURL(file);
        setPreview(u);
        return () => URL.revokeObjectURL(u);
    }, [file]);
    // ===== Fake API (pakai localStorage) =====
    function fakeSaveBook(newBook) {
        const raw = localStorage.getItem("dummy_books") || "[]";
        const arr = JSON.parse(raw);
        if (isEdit) {
            const idx = arr.findIndex((b) => b.books_id === newBook.books_id);
            if (idx >= 0)
                arr[idx] = newBook;
        }
        else {
            arr.push(newBook);
        }
        localStorage.setItem("dummy_books", JSON.stringify(arr));
        return newBook;
    }
    const mutation = useMutation({
        mutationFn: async () => {
            const newBook = {
                books_id: isEdit ? book.books_id : `dummy-${Date.now()}`,
                books_title: title,
                books_author: author,
                books_desc: desc,
                books_url: url,
                books_image_url: preview, // simpan preview base64/URL
            };
            // simpan ke fake storage
            return fakeSaveBook(newBook);
        },
        onSuccess: async (res) => {
            await qc.invalidateQueries({ queryKey: ["books-list"] });
            onSuccess(res?.books_id);
        },
        onError: (err) => {
            alert(err?.message || "Gagal menyimpan buku (fake).");
        },
    });
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[70] flex items-center justify-center p-3", style: { background: "rgba(0,0,0,.45)" }, onClick: () => !mutation.isPending && onClose(), children: _jsxs(SectionCard, { palette: palette, className: "w-[min(760px,96vw)] rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-4 md:p-6 border-b", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "text-base md:text-lg font-semibold", children: isEdit ? "Edit Buku (Fake)" : "Tambah Buku (Fake)" }), _jsx("button", { className: "opacity-70 hover:opacity-100", onClick: () => !mutation.isPending && onClose(), children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 md:p-6", children: _jsxs("div", { className: "grid md:grid-cols-12 gap-4", children: [_jsxs("div", { className: "md:col-span-4", children: [_jsx("div", { className: "w-full aspect-[3/4] rounded-xl overflow-hidden grid place-items-center bg-gray-100", children: preview ? (_jsx("img", { src: preview, className: "w-full h-full object-cover", alt: "Preview" })) : (_jsx("span", { className: "text-xs opacity-60", children: "Preview cover" })) }), _jsx("input", { type: "file", accept: "image/*", className: "mt-3 block w-full text-sm", onChange: (e) => setFile(e.target.files?.[0] ?? null) })] }), _jsxs("div", { className: "md:col-span-8 grid gap-3", children: [_jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { children: "Judul *" }), _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), className: "px-3 py-2 rounded-lg border bg-transparent", placeholder: "cth. Matematika Kelas 7" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [_jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { children: "Penulis" }), _jsx("input", { value: author, onChange: (e) => setAuthor(e.target.value), className: "px-3 py-2 rounded-lg border bg-transparent" })] }), _jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { children: "URL" }), _jsx("input", { value: url, onChange: (e) => setUrl(e.target.value), className: "px-3 py-2 rounded-lg border bg-transparent" })] })] }), _jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { children: "Deskripsi" }), _jsx("textarea", { value: desc, onChange: (e) => setDesc(e.target.value), className: "px-3 py-2 rounded-lg border bg-transparent min-h-[84px]" })] })] })] }) }), _jsxs("div", { className: "p-4 md:p-6 border-t flex justify-end gap-2", style: { borderColor: palette.silver1 }, children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, disabled: mutation.isPending, children: "Batal" }), _jsx(Btn, { palette: palette, loading: mutation.isPending, onClick: () => {
                                if (!title.trim())
                                    return alert("Judul wajib diisi.");
                                mutation.mutate();
                            }, children: "Simpan" })] })] }) }));
}
