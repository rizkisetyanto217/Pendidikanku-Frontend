import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { X, UserPlus, Trash2 } from "lucide-react";
import { Btn, SectionCard, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
/* ================= Component ================ */
export default function AddTeacher({ open, palette, subjects, masjidId, onClose, onCreated, onDeleted, }) {
    const qc = useQueryClient();
    const [form, setForm] = useState({
        nip: "",
        name: "",
        gender: "", // "L" | "P"
        phone: "",
        email: "",
        subject: "",
        status: "aktif",
    });
    const [searchQ, setSearchQ] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    // debounce 400ms
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQ(searchQ.trim()), 400);
        return () => clearTimeout(t);
    }, [searchQ]);
    // reset isi ketika modal ditutup
    useEffect(() => {
        if (!open) {
            setSearchQ("");
            setDebouncedQ("");
            setSelectedUserId(null);
            setForm((f) => ({
                ...f,
                nip: "",
                name: "",
                phone: "",
                email: "",
                subject: "",
                gender: "",
                status: "aktif",
            }));
        }
    }, [open]);
    /* ===== Search Users (min 3 karakter) ===== */
    const enabledSearch = open && debouncedQ.length >= 3;
    const userSearchQ = useQuery({
        queryKey: ["search-users", debouncedQ],
        enabled: enabledSearch,
        staleTime: 60_000,
        queryFn: async () => {
            const res = await axios.get("/api/a/users/search", {
                params: { q: debouncedQ, limit: 10 },
            });
            const users = res.data?.data?.users ?? [];
            const items = users.map((u) => ({
                id: u.id,
                name: u.user_name || "Tanpa Nama",
                email: u.email ?? null,
                phone: u.phone ?? null,
            }));
            return items;
        },
    });
    const handleSelectUser = (u) => {
        setSelectedUserId(u.id);
        setForm((f) => ({
            ...f,
            name: u.name ?? f.name,
            email: u.email ?? f.email,
            phone: u.phone ?? f.phone,
        }));
    };
    const clearSelected = () => setSelectedUserId(null);
    /* ===== Mutations ===== */
    const addTeacher = useMutation({
        mutationFn: async () => {
            if (!selectedUserId)
                throw new Error("Pilih user terlebih dahulu");
            const payload = {
                masjid_teachers_masjid_id: masjidId,
                masjid_teachers_user_id: selectedUserId,
            };
            const res = await axios.post("/api/a/masjid-teachers", payload);
            return res.data;
        },
        onSuccess: (data) => {
            // invalidasi list guru per masjid
            qc.invalidateQueries({ queryKey: ["masjid-teachers", masjidId] });
            onCreated?.(data);
            onClose();
        },
    });
    // komponen kecil untuk hapus guru tertentu (pakai di tempat lain juga bisa)
    const removeTeacher = useMutation({
        mutationFn: async (masjidTeacherId) => {
            await axios.delete(`/api/a/masjid-teachers/${masjidTeacherId}`);
            return masjidTeacherId;
        },
        onSuccess: (deletedId) => {
            qc.invalidateQueries({ queryKey: ["masjid-teachers", masjidId] });
            onDeleted?.(deletedId);
        },
    });
    if (!open)
        return null;
    const canSave = !!selectedUserId && !!masjidId && !addTeacher.isPending;
    return (_jsx("div", { className: "fixed inset-0 z-[120] flex items-center justify-center p-4", style: { background: "rgba(0,0,0,0.35)" }, role: "dialog", "aria-modal": "true", children: _jsxs(SectionCard, { palette: palette, className: "w-full max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b", style: { borderColor: palette.white3, background: palette.white1 }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-9 w-9 rounded-xl flex items-center justify-center", style: { background: palette.white3, color: palette.black2 }, children: _jsx(UserPlus, { size: 18 }) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", style: { color: palette.black2 }, children: "Tambah Guru" }), _jsx("div", { className: "text-xs", style: { color: palette.black2 }, children: "Cari user terdaftar (min 3 karakter) lalu pilih." })] })] }), _jsx("button", { onClick: onClose, className: "p-2 rounded-lg", "aria-label": "Tutup", style: { color: palette.secondary }, children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "px-4 py-4 space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs", style: { color: palette.black2 }, children: "Cari User (min 3 karakter)" }), _jsx("input", { value: searchQ, onChange: (e) => setSearchQ(e.target.value), placeholder: "Contoh: rizki", className: "w-full rounded-xl px-3 py-2 outline-none border", style: {
                                        borderColor: palette.white3,
                                        background: palette.white1,
                                        color: palette.quaternary,
                                    } }), searchQ.trim().length > 0 && searchQ.trim().length < 3 && (_jsx("div", { className: "text-xs", style: { color: palette.secondary }, children: "Ketik minimal 3 karakter untuk mulai mencari." })), enabledSearch && (_jsx("div", { className: "rounded-xl border overflow-hidden", style: {
                                        borderColor: palette.white3,
                                        background: palette.white1,
                                    }, children: userSearchQ.isLoading ? (_jsx("div", { className: "px-3 py-2 text-sm", style: { color: palette.secondary }, children: "Mencari\u2026" })) : (userSearchQ.data?.length ?? 0) === 0 ? (_jsx("div", { className: "px-3 py-2 text-sm", style: { color: palette.secondary }, children: "Tidak ada hasil." })) : (_jsx("ul", { className: "max-h-56 overflow-auto", children: userSearchQ.data.map((u) => (_jsxs("li", { className: "px-3 py-2 cursor-pointer hover:opacity-80 flex items-center justify-between", onClick: () => handleSelectUser(u), style: { color: palette.black2 }, children: [_jsxs("div", { className: "truncate", children: [_jsx("div", { className: "text-sm font-medium truncate", children: u.name }), _jsxs("div", { className: "text-xs truncate", style: { color: palette.secondary }, children: [u.email || "-", " \u00B7 ", u.phone || "-"] })] }), _jsx("span", { className: "text-xs", style: { color: palette.black2 }, children: "Pilih" })] }, u.id))) })) })), selectedUserId && (_jsxs("div", { className: "flex items-center justify-between rounded-lg px-3 py-2 text-sm border", style: {
                                        borderColor: palette.white3,
                                        background: palette.white1,
                                        color: palette.quaternary,
                                    }, children: [_jsxs("span", { children: ["Terpilih: ", _jsx("b", { children: form.name })] }), _jsx("button", { className: "text-xs underline", style: { color: palette.secondary }, onClick: clearSelected, children: "ganti/hapus" })] }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", style: { color: palette.black2 }, children: [_jsx(Field, { label: "NIP", value: form.nip, onChange: (v) => setForm({ ...form, nip: v }), palette: palette }), _jsx(Field, { label: "Mapel Utama", type: "select", options: [
                                        { label: "Pilih Mapel", value: "" },
                                        ...subjects.map((s) => ({ label: s, value: s })),
                                    ], value: form.subject, onChange: (v) => setForm({ ...form, subject: v }), palette: palette })] }), (addTeacher.isError || removeTeacher.isError) && (_jsx("div", { className: "text-xs", style: { color: palette.error1 }, children: 
                            // @ts-ignore
                            addTeacher.error?.response?.data?.message ||
                                // @ts-ignore
                                removeTeacher.error?.response?.data?.message ||
                                "Terjadi kesalahan." }))] }), _jsxs("div", { className: "px-4 py-3 flex items-center justify-end gap-2 border-t", style: { borderColor: palette.white3, background: palette.white1 }, children: [_jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, size: "sm", disabled: !canSave, onClick: () => addTeacher.mutate(), children: addTeacher.isPending ? "Menyimpan..." : "Simpan" })] })] }) }));
}
/* ============= Field helper ============= */
function Field({ label, value, onChange, palette, type = "text", options, }) {
    return (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs", style: { color: palette.black2 }, children: label }), type === "select" ? (_jsx("select", { value: value, onChange: (e) => onChange(e.target.value), className: "w-full rounded-xl px-3 py-2 outline-none border bg-transparent", style: {
                    borderColor: palette.white3,
                    background: palette.white1,
                    color: palette.black2,
                }, children: (options ?? []).map((op) => (_jsx("option", { value: op.value, children: op.label }, op.value))) })) : (_jsx("input", { value: value, onChange: (e) => onChange(e.target.value), type: type, className: "w-full rounded-xl px-3 py-2 outline-none border", style: {
                    borderColor: palette.white3,
                    background: palette.white1,
                    color: palette.quaternary,
                } }))] }));
}
/* ================= Optional: tombol hapus terpisah =================
   Pakai di daftar guru: <RemoveMasjidTeacherButton id={row.id} masjidId={masjidId} />
*/
export function RemoveMasjidTeacherButton({ id, masjidId, palette, onDeleted, }) {
    const qc = useQueryClient();
    const removeTeacher = useMutation({
        mutationFn: async () => {
            await axios.delete(`/api/a/masjid-teachers/${id}`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["masjid-teachers", masjidId] });
            onDeleted?.(id);
        },
    });
    return (_jsxs("button", { className: "px-2 py-1 rounded-lg border flex items-center gap-1 text-xs", onClick: () => removeTeacher.mutate(), disabled: removeTeacher.isPending, style: { borderColor: palette.white3, color: palette.quaternary }, title: "Hapus dari daftar guru", children: [_jsx(Trash2, { size: 14 }), " ", removeTeacher.isPending ? "Menghapus..." : "Hapus"] }));
}
