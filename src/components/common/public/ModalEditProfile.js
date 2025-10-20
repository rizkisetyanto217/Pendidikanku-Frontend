import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import { X } from "lucide-react";
const Field = ({ label, children, muted, helper, }) => (_jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { style: { color: muted }, children: label }), children, helper ? (_jsx("span", { className: "text-[11px] mt-0.5", style: { color: muted }, children: helper })) : null] }));
const fmtDateId = (iso) => {
    if (!iso)
        return "";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime()))
        return "";
    return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};
export default function ModalEditProfile({ open, onClose, initial, onSave, loading, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const closeBtnRef = useRef(null);
    // nilai input (kosong biar placeholder terlihat)
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [donationName, setDonationName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [location, setLocation] = useState("");
    const [occupation, setOccupation] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [photoFile, setPhotoFile] = useState(null);
    // snapshot buat placeholder
    const prev = useMemo(() => ({
        fullName: initial?.user?.full_name ?? "",
        email: initial?.user?.email ?? "",
        donationName: initial?.profile?.donation_name ?? "",
        dateOfBirth: initial?.profile?.date_of_birth ?? "",
        gender: initial?.profile?.gender ?? "",
        phone: initial?.profile?.phone_number ?? "",
        occupation: initial?.profile?.occupation ?? "",
        location: initial?.profile?.location ?? "",
        bio: initial?.profile?.bio ?? "",
        photo_url: initial?.profile?.photo_url ??
            "https://picsum.photos/seed/sekolahislamku-profile/256",
    }), [initial]);
    useEffect(() => {
        if (!open)
            return;
        // kosongkan input; simpan foto snapshot agar preview muncul
        setFullName("");
        setEmail("");
        setDonationName("");
        setDateOfBirth("");
        setGender("");
        setLocation("");
        setOccupation("");
        setPhone("");
        setBio("");
        setPhotoFile(null);
        setPhotoUrl(prev.photo_url);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initial]);
    const avatarPreview = useMemo(() => {
        if (photoFile)
            return URL.createObjectURL(photoFile);
        return photoUrl || prev.photo_url;
    }, [photoFile, photoUrl, prev.photo_url]);
    useEffect(() => {
        return () => {
            if (photoFile)
                URL.revokeObjectURL(avatarPreview);
        };
    }, [photoFile, avatarPreview]);
    if (!open)
        return null;
    const eff = (val, fallback) => val && val.trim() !== "" ? val : fallback || undefined;
    const handleSave = () => {
        onSave({
            user: {
                full_name: eff(fullName, prev.fullName),
                email: eff(email, prev.email),
            },
            profile: {
                donation_name: eff(donationName, prev.donationName),
                photo_url: photoFile ? undefined : eff(photoUrl, prev.photo_url),
                date_of_birth: eff(dateOfBirth, prev.dateOfBirth),
                gender: eff(gender, String(prev.gender || "")),
                location: eff(location, prev.location),
                occupation: eff(occupation, prev.occupation),
                phone_number: eff(phone, prev.phone),
                bio: eff(bio, prev.bio),
            },
        }, { photoFile });
    };
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[2100]", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose }), _jsx("div", { className: "absolute inset-0 grid place-items-center p-4", children: _jsxs("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": "editprofile-title", className: "w-full max-w-[560px] rounded-2xl border shadow-xl max-h-[92dvh] overflow-auto", style: {
                        background: theme.white1,
                        color: theme.black1,
                        borderColor: theme.silver1,
                    }, children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b", style: { borderColor: theme.silver1 }, children: [_jsx("h3", { id: "editprofile-title", className: "text-sm md:text-base font-semibold", children: "Edit Profil" }), _jsx("button", { ref: closeBtnRef, "aria-label": "Tutup", onClick: onClose, className: "h-8 w-8 grid place-items-center rounded-lg", style: { background: theme.white2 }, children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "p-5 grid gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: avatarPreview, alt: "Avatar", className: "h-16 w-16 rounded-full object-cover border", style: { borderColor: theme.silver1 } }), _jsxs("div", { className: "grid gap-2", children: [_jsx("input", { type: "file", accept: "image/*", onChange: (e) => setPhotoFile(e.target.files?.[0] || null), className: "text-xs" }), _jsx("button", { type: "button", className: "px-2 py-1 rounded-md text-xs", style: {
                                                        background: theme.white2,
                                                        color: theme.black1,
                                                        border: `1px solid ${theme.silver1}`,
                                                    }, onClick: () => {
                                                        setPhotoFile(null);
                                                        setPhotoUrl("");
                                                    }, children: "Hapus Foto" })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(Field, { label: "Nama Lengkap", muted: theme.silver2, children: _jsx("input", { value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: prev.fullName || "Nama lengkap", className: "h-10 rounded-xl px-3 text-sm w-full", style: {
                                                    background: theme.white2,
                                                    color: theme.black1,
                                                    border: `1px solid ${theme.silver1}`,
                                                } }) }), _jsx(Field, { label: "Email", muted: theme.silver2, children: _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: prev.email || "email@contoh.com", className: "h-10 rounded-xl px-3 text-sm w-full", style: {
                                                    background: theme.white2,
                                                    color: theme.black1,
                                                    border: `1px solid ${theme.silver1}`,
                                                } }) }), _jsx(Field, { label: "Nama Donasi", muted: theme.silver2, children: _jsx("input", { value: donationName, onChange: (e) => setDonationName(e.target.value), placeholder: prev.donationName || "Nama donatur di struk", className: "h-10 rounded-xl px-3 text-sm w-full", style: {
                                                    background: theme.white2,
                                                    color: theme.black1,
                                                    border: `1px solid ${theme.silver1}`,
                                                } }) }), _jsx(Field, { label: "Tanggal Lahir", muted: theme.silver2, helper: prev.dateOfBirth
                                                ? `Sebelumnya: ${fmtDateId(prev.dateOfBirth)}`
                                                : undefined, children: _jsx("input", { type: "date", value: dateOfBirth, onChange: (e) => setDateOfBirth(e.target.value), className: "h-10 rounded-xl px-3 text-sm w-full", style: {
                                                    background: theme.white2,
                                                    color: theme.black1,
                                                    border: `1px solid ${theme.silver1}`,
                                                } }) }), _jsx(Field, { label: "Jenis Kelamin", muted: theme.silver2, helper: prev.gender
                                                ? `Sebelumnya: ${String(prev.gender).toLowerCase() === "male"
                                                    ? "Laki-laki"
                                                    : String(prev.gender).toLowerCase() === "female"
                                                        ? "Perempuan"
                                                        : prev.gender}`
                                                : undefined, children: _jsxs("select", { value: gender, onChange: (e) => setGender(e.target.value), className: "h-10 rounded-xl px-3 text-sm w-full", style: {
                                                    background: theme.white2,
                                                    color: theme.black1,
                                                    border: `1px solid ${theme.silver1}`,
                                                }, children: [_jsx("option", { value: "", children: "Pilih\u2026" }), _jsx("option", { value: "male", children: "Laki-laki" }), _jsx("option", { value: "female", children: "Perempuan" })] }) }), _jsx(Field, { label: "Telepon", muted: theme.silver2, children: _jsx("input", { value: phone, onChange: (e) => setPhone(e.target.value), placeholder: prev.phone || "+62…", className: "h-10 rounded-xl px-3 text-sm w-full", style: {
                                                    background: theme.white2,
                                                    color: theme.black1,
                                                    border: `1px solid ${theme.silver1}`,
                                                } }) }), _jsx(Field, { label: "Pekerjaan", muted: theme.silver2, children: _jsx("input", { value: occupation, onChange: (e) => setOccupation(e.target.value), placeholder: prev.occupation || "Pekerjaan", className: "h-10 rounded-xl px-3 text-sm w-full", style: {
                                                    background: theme.white2,
                                                    color: theme.black1,
                                                    border: `1px solid ${theme.silver1}`,
                                                } }) }), _jsx(Field, { label: "Lokasi", muted: theme.silver2, children: _jsx("input", { value: location, onChange: (e) => setLocation(e.target.value), placeholder: prev.location || "Kota, Provinsi", className: "h-10 rounded-xl px-3 text-sm w-full", style: {
                                                    background: theme.white2,
                                                    color: theme.black1,
                                                    border: `1px solid ${theme.silver1}`,
                                                } }) }), _jsx("div", { className: "md:col-span-2", children: _jsx(Field, { label: "Bio", muted: theme.silver2, children: _jsx("textarea", { value: bio, onChange: (e) => setBio(e.target.value), rows: 3, placeholder: prev.bio || "Ceritakan sedikit tentang Anda", className: "rounded-xl px-3 py-2 text-sm w-full", style: {
                                                        background: theme.white2,
                                                        color: theme.black1,
                                                        border: `1px solid ${theme.silver1}`,
                                                    } }) }) })] })] }), _jsxs("div", { className: "px-5 py-3 flex items-center justify-end gap-2 border-t", style: { borderColor: theme.silver1 }, children: [_jsx("button", { onClick: onClose, className: "px-3 py-2 rounded-lg text-sm font-medium", style: {
                                        background: theme.white2,
                                        color: theme.black1,
                                        border: `1px solid ${theme.silver1}`,
                                    }, disabled: !!loading, children: "Batal" }), _jsx("button", { onClick: handleSave, disabled: !!loading, className: "px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed", style: { background: theme.quaternary, color: theme.white1 }, children: loading ? "Menyimpan..." : "Simpan" })] })] }) })] }), document.body);
}
