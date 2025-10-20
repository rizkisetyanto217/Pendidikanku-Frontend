import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/linktree/activity/my-activity/MasjidMyProfile.tsx
import { useEffect, useMemo, useState } from "react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function MasjidMyProfile() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const qc = useQueryClient();
    // ===== Auth (pakai simple-context baru)
    const { data: ctx } = useQuery({
        queryKey: ["auth", "simple-context"],
        queryFn: async () => (await axios.get("/api/auth/me/simple-context", {
            withCredentials: true,
        })).data.data,
        staleTime: 5 * 60 * 1000,
    });
    const userName = ctx?.user_name ?? "";
    const email = "-"; // simple-context tidak mengirim email
    // ===== Profile
    const { data: profileData, isLoading, isFetching, } = useQuery({
        queryKey: ["user-profile", "me"],
        queryFn: async () => (await axios.get("/api/u/users-profiles/me", { withCredentials: true }))
            .data.data,
        staleTime: 5 * 60 * 1000,
    });
    // ===== State form
    const [form, setForm] = useState({
        donation_name: "",
        full_name: "",
        date_of_birth: "",
        phone_number: "",
        bio: "",
        location: "",
        occupation: "",
    });
    useEffect(() => {
        if (!profileData)
            return;
        setForm({
            donation_name: profileData.donation_name ?? "Hamba Allah",
            full_name: profileData.full_name ?? userName ?? "",
            date_of_birth: profileData.date_of_birth ?? "",
            phone_number: profileData.phone_number ?? "",
            bio: profileData.bio ?? "",
            location: profileData.location ?? "",
            occupation: profileData.occupation ?? "",
        });
    }, [profileData, userName]);
    const updateField = (k, v) => setForm((p) => ({ ...p, [k]: v }));
    const initial = useMemo(() => ({
        donation_name: profileData?.donation_name ?? "Hamba Allah",
        full_name: profileData?.full_name ?? userName ?? "",
        date_of_birth: profileData?.date_of_birth ?? "",
        phone_number: profileData?.phone_number ?? "",
        bio: profileData?.bio ?? "",
        location: profileData?.location ?? "",
        occupation: profileData?.occupation ?? "",
    }), [profileData, userName]);
    const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);
    const [saved, setSaved] = useState(null);
    const { mutate: saveProfile, isPending } = useMutation({
        mutationFn: async (payload) => {
            const body = {
                donation_name: payload.donation_name?.trim(),
                full_name: payload.full_name?.trim(),
                // kosong -> null (sesuai contoh respons)
                date_of_birth: payload.date_of_birth ? payload.date_of_birth : null,
                phone_number: payload.phone_number?.trim(),
                bio: payload.bio,
                location: payload.location?.trim(),
                occupation: payload.occupation?.trim(),
            };
            const res = await axios.put("/api/u/users-profiles", body, {
                withCredentials: true,
            });
            return res.data;
        },
        onSuccess: async () => {
            setSaved("ok");
            await qc.invalidateQueries({ queryKey: ["user-profile", "me"] });
        },
        onError: () => setSaved("err"),
        onSettled: () => setTimeout(() => setSaved(null), 2000),
    });
    if (isLoading) {
        return (_jsx("div", { className: "p-4", style: { color: theme.silver2 }, children: "Memuat profil..." }));
    }
    return (_jsxs("div", { className: "pb-24 space-y-4", style: { color: theme.black1 }, children: [_jsx("h1", { className: "text-lg font-semibold md:hidden", style: { color: theme.black1 }, children: "Profil" }), _jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Harap lengkapi profil pengguna untuk kemajuan aplikasi." }), saved === "ok" && (_jsx("div", { className: "rounded-lg px-3 py-2 text-sm", style: { backgroundColor: theme.success1, color: theme.white1 }, children: "\u2705 Profil berhasil disimpan." })), saved === "err" && (_jsx("div", { className: "rounded-lg px-3 py-2 text-sm", style: { backgroundColor: theme.error1, color: theme.white1 }, children: "\u274C Gagal menyimpan profil. Coba lagi." })), _jsxs("div", { className: "space-y-3", children: [_jsx(FieldCard, { theme: theme, label: "Nama", children: _jsx(Input, { theme: theme, value: form.full_name ?? "", onChange: (e) => updateField("full_name", e.target.value), placeholder: "Nama lengkap" }) }), _jsx(FieldCard, { theme: theme, label: "Nama Donatur", children: _jsx(Input, { theme: theme, value: form.donation_name ?? "", onChange: (e) => updateField("donation_name", e.target.value), placeholder: "Hamba Allah" }) }), _jsx(FieldCard, { theme: theme, label: "Email", children: _jsx(Input, { theme: theme, value: email, disabled: true }) }), _jsx(FieldCard, { theme: theme, label: "Nomor Telp", children: _jsx(Input, { theme: theme, value: form.phone_number ?? "", onChange: (e) => updateField("phone_number", e.target.value), placeholder: "08xxxxxxxxxx", inputMode: "tel" }) }), _jsx(FieldCard, { theme: theme, label: "Domisili (Kecamatan, Kota/Kabupaten)", children: _jsx(Input, { theme: theme, value: form.location ?? "", onChange: (e) => updateField("location", e.target.value), placeholder: "Kramat Jati, Jakarta Timur" }) }), _jsx(FieldCard, { theme: theme, label: "Tanggal Lahir", children: _jsx(Input, { theme: theme, type: "date", value: (form.date_of_birth ?? ""), onChange: (e) => updateField("date_of_birth", e.target.value) }) }), _jsx(FieldCard, { theme: theme, label: "Pekerjaan", children: _jsx(Input, { theme: theme, value: form.occupation ?? "", onChange: (e) => updateField("occupation", e.target.value), placeholder: "Karyawan, Wiraswasta, ..." }) }), _jsx(FieldCard, { theme: theme, label: "Bio", children: _jsx(Textarea, { theme: theme, value: form.bio ?? "", onChange: (e) => updateField("bio", e.target.value), placeholder: "Ceritakan sedikit tentang Anda" }) })] }), _jsx(Button, { className: "w-full mt-4 hover:opacity-90 transition", style: {
                    backgroundColor: isDirty ? theme.primary : theme.silver1,
                    color: isDirty ? theme.white1 : theme.black2,
                    cursor: isPending || !isDirty ? "not-allowed" : "pointer",
                    opacity: isPending || !isDirty ? 0.8 : 1,
                }, disabled: isPending || !isDirty, onClick: () => saveProfile(form), children: isPending ? "Menyimpan..." : "Simpan" }), isFetching && (_jsx("div", { className: "text-xs", style: { color: theme.silver2 }, children: "Menyinkronkan data..." }))] }));
}
/* ==== UI kecil ==== */
function FieldCard({ children, label, theme, }) {
    return (_jsx("div", { className: "rounded-xl border px-4 py-3", style: { backgroundColor: theme.white2, borderColor: theme.silver1 }, children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-xs font-medium mb-1", style: { color: theme.silver2 }, children: label }), children] }), _jsx(PencilIcon, { size: 18, style: { color: theme.silver4 } })] }) }));
}
function Input(props) {
    const { theme, style, ...rest } = props;
    return (_jsx("input", { ...rest, className: "w-full rounded-md px-3 py-2 text-sm outline-none", style: {
            backgroundColor: theme.white1,
            border: `1px solid ${theme.silver1}`,
            color: theme.black1,
            ...style,
        } }));
}
function Textarea(props) {
    const { theme, style, ...rest } = props;
    return (_jsx("textarea", { ...rest, rows: 4, className: "w-full rounded-md px-3 py-2 text-sm outline-none resize-y", style: {
            backgroundColor: theme.white1,
            border: `1px solid ${theme.silver1}`,
            color: theme.black1,
            ...style,
        } }));
}
