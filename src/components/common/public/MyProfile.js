import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import { X } from "lucide-react";
// utils: gabungkan base + patch tapi abaikan undefined/null/""
function mergeDefined(base, patch) {
    const out = { ...base };
    if (!patch)
        return out;
    for (const [k, v] of Object.entries(patch)) {
        if (v !== undefined && v !== null && v !== "") {
            out[k] = v;
        }
    }
    return out;
}
/* ========= Dummy fallback ========= */
const DEFAULT_DATA = {
    user: { full_name: "Muhammad Rizki Apriansyah" },
    profile: {
        donation_name: "Muhammad Rizki",
        photo_url: "https://picsum.photos/seed/sekolahislamku-profile/256",
        date_of_birth: "1998-08-21",
        gender: "male",
        location: "Bekasi, Jawa Barat",
        occupation: "Software Engineer",
        phone_number: "+6281234567890",
        bio: "DKM Masjid, suka ngoprek Go & Postgres.",
    },
};
/* ========= Utils ========= */
const fmtDate = (iso) => {
    if (!iso)
        return "-";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime()))
        return "-";
    return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};
const calcAge = (iso) => {
    if (!iso)
        return undefined;
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime()))
        return undefined;
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate()))
        age--;
    return age;
};
const genderLabel = (g) => g?.toLowerCase() === "male"
    ? "Laki-laki"
    : g?.toLowerCase() === "female"
        ? "Perempuan"
        : "-";
const initials = (name) => (name || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "U";
const Row = ({ label, value, muted, }) => (_jsxs("div", { className: "grid grid-cols-3 gap-2 text-sm", children: [_jsx("div", { className: "col-span-1", style: { color: muted }, children: label }), _jsx("div", { className: "col-span-2 font-medium break-words", children: value })] }));
/* ========= Component ========= */
const MyProfile = ({ open, onClose, data, onEdit, }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const closeBtnRef = useRef(null);
    // base yang pasti terdefinisi (hindari non-null assertion "!"):
    const DEFAULT_USER = {
        full_name: DEFAULT_DATA.user?.full_name ?? "Pengguna",
        email: DEFAULT_DATA.user?.email, // boleh undefined; mergeDefined akan handle
    };
    const DEFAULT_PROFILE = {
        donation_name: DEFAULT_DATA.profile?.donation_name,
        photo_url: DEFAULT_DATA.profile?.photo_url,
        date_of_birth: DEFAULT_DATA.profile?.date_of_birth,
        gender: DEFAULT_DATA.profile?.gender,
        location: DEFAULT_DATA.profile?.location,
        occupation: DEFAULT_DATA.profile?.occupation,
        phone_number: DEFAULT_DATA.profile?.phone_number,
        bio: DEFAULT_DATA.profile?.bio,
    };
    const merged = useMemo(() => {
        return {
            user: mergeDefined(DEFAULT_USER, data?.user),
            profile: mergeDefined(DEFAULT_PROFILE, data?.profile),
        };
    }, [data]);
    // ESC close + lock body scroll + autofocus
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        setTimeout(() => closeBtnRef.current?.focus(), 0);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);
    if (!open)
        return null;
    const p = merged.profile;
    const displayName = merged.user?.full_name || p.donation_name || "Pengguna";
    const dob = fmtDate(p.date_of_birth);
    const age = calcAge(p.date_of_birth);
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[2000]", children: [_jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-[1px]", onClick: onClose }), _jsx("div", { className: "absolute inset-0 grid place-items-center p-4", children: _jsxs("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": "myprofile-title", className: "w-full max-w-[520px] rounded-2xl border shadow-xl animate-[fadeIn_.18s_ease-out]\n                     max-h-[90dvh] overflow-auto", style: {
                        background: theme.white1,
                        color: theme.black1,
                        borderColor: theme.silver1,
                    }, children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b", style: { borderColor: theme.silver1 }, children: [_jsx("h3", { id: "myprofile-title", className: "text-sm md:text-base font-semibold", children: "Profil Saya" }), _jsx("button", { ref: closeBtnRef, "aria-label": "Tutup", onClick: onClose, className: "h-8 w-8 grid place-items-center rounded-lg", style: { background: theme.white2 }, children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "p-5", children: [_jsxs("div", { className: "flex items-center gap-3", children: [p.photo_url ? (_jsx("img", { src: p.photo_url, alt: displayName, className: "h-14 w-14 md:h-16 md:w-16 rounded-full object-cover border", style: { borderColor: theme.silver1 } })) : (_jsx("div", { className: "h-14 w-14 md:h-16 md:w-16 rounded-full grid place-items-center text-base md:text-xl font-semibold border", style: {
                                                background: theme.white2,
                                                borderColor: theme.silver1,
                                            }, children: initials(displayName) })), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-base md:text-lg font-semibold truncate", children: displayName }), _jsxs("div", { className: "text-xs mt-0.5", style: { color: theme.silver2 }, children: [p.occupation || "—", p.location ? ` • ${p.location}` : ""] })] })] }), _jsxs("div", { className: "mt-4 grid gap-3", children: [_jsx(Row, { label: "Tanggal Lahir", value: dob === "-" ? "-" : age ? `${dob} • ${age} th` : dob, muted: theme.silver2 }), _jsx(Row, { label: "Jenis Kelamin", value: genderLabel(p.gender), muted: theme.silver2 }), _jsx(Row, { label: "Email", value: merged.user?.email ?? "-", muted: theme.silver2 }), _jsx(Row, { label: "Telepon", value: p.phone_number || "-", muted: theme.silver2 }), _jsx(Row, { label: "Bio", value: p.bio || "-", muted: theme.silver2 })] })] }), _jsxs("div", { className: "px-5 py-3 flex items-center justify-end gap-2 border-t", style: { borderColor: theme.silver1 }, children: [onEdit && (_jsx("button", { onClick: () => {
                                        onEdit(merged); // ⬅️ kirim snapshot
                                        onClose();
                                    }, className: "px-3 py-2 rounded-lg text-sm font-medium", style: {
                                        background: theme.white2,
                                        color: theme.black1,
                                        border: `1px solid ${theme.silver1}`,
                                    }, children: "Edit Profil" })), _jsx("button", { onClick: onClose, className: "px-3 py-2 rounded-lg text-sm font-medium", style: { background: theme.quaternary, color: theme.white1 }, children: "Tutup" })] })] }) }), _jsx("style", { children: `
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      ` })] }), document.body);
};
export default MyProfile;
