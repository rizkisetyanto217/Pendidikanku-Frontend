import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/masjid/RegisterLembaga.tsx (refactor pakai InputField + Success Lock Modal)
import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import axios, { apiLogout } from "@/lib/axios"; // ⬅️ pastikan export-nya ada
import { MapPin, Image as ImageIcon, Link as LinkIcon, Globe, Landmark, Loader2, CheckCircle2, AlertTriangle, Compass, Info, LogOut, } from "lucide-react";
// ⬇️ sesuaikan path InputField
import InputField from "@/components/common/main/InputField";
/* =======================
   Utils
======================= */
const CREATE_ENDPOINT = "api/u/masjids/user"; // ← ganti jika perlu
function extractLatLngFromGmaps(url) {
    try {
        const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/i);
        if (qMatch) {
            return { lat: parseFloat(qMatch[1]), lon: parseFloat(qMatch[2]) };
        }
        const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        if (atMatch) {
            return { lat: parseFloat(atMatch[1]), lon: parseFloat(atMatch[2]) };
        }
    }
    catch { }
    return null;
}
const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
/* =======================
   Component
======================= */
export default function RegisterDetailAdminMasjid() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        masjid_name: "",
        masjid_bio_short: "",
        masjid_location: "",
        masjid_latitude: "",
        masjid_longitude: "",
        masjid_image_url: "",
        masjid_image_file: null,
        masjid_google_maps_url: "",
        masjid_domain: "",
        masjid_instagram_url: "",
        masjid_whatsapp_url: "",
        masjid_youtube_url: "",
        masjid_facebook_url: "",
        masjid_tiktok_url: "",
        masjid_whatsapp_group_ikhwan_url: "",
        masjid_whatsapp_group_akhwat_url: "",
    });
    const [loading, setLoading] = useState(false);
    const [uploadPct, setUploadPct] = useState(0);
    const abortRef = useRef(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const styles = useMemo(() => ({
        pageBg: {
            background: `linear-gradient(135deg, ${theme.white1}, ${theme.white2})`,
        },
        card: {
            backgroundColor: theme.white1,
            borderColor: theme.white3,
            color: theme.black1,
        },
        muted: { color: theme.silver2 },
        primaryBtn: {
            backgroundColor: theme.primary,
            color: theme.white1,
        },
        ghostBtn: {
            backgroundColor: isDark ? theme.white2 : theme.white1,
            borderColor: theme.white3,
            color: theme.black1,
        },
        chip: {
            backgroundColor: theme.white2,
            border: `1px solid ${theme.white3}`,
            color: theme.black1,
        },
        errorBg: isDark ? `${theme.error1}10` : `${theme.error1}0D`,
        errorBorder: `${theme.error1}33`,
        successBg: isDark ? `${theme.success1}10` : `${theme.success1}0D`,
        successBorder: `${theme.success1}33`,
        // Modal
        modalBackdrop: `rgba(0,0,0,${isDark ? 0.65 : 0.5})`,
    }), [theme, isDark]);
    // Lock scroll saat modal open
    useEffect(() => {
        if (showSuccessModal) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prev;
            };
        }
    }, [showSuccessModal]);
    /* =======================
       Validation
    ======================= */
    const nameValid = form.masjid_name.trim().length >= 3;
    const lat = Number(form.masjid_latitude);
    const lon = Number(form.masjid_longitude);
    const latValid = form.masjid_latitude === "" || (lat >= -90 && lat <= 90 && !isNaN(lat));
    const lonValid = form.masjid_longitude === "" || (lon >= -180 && lon <= 180 && !isNaN(lon));
    const domainValid = form.masjid_domain === "" || domainRegex.test(form.masjid_domain);
    const canSubmit = nameValid && latValid && lonValid && !loading;
    /* =======================
       Handlers
    ======================= */
    const onChange = (key) => (e) => {
        setForm((s) => ({ ...s, [key]: e.target.value }));
        setError("");
        setSuccess("");
    };
    const onFile = (e) => {
        const f = e.target.files?.[0] ?? null;
        setForm((s) => ({ ...s, masjid_image_file: f }));
        setError("");
        setSuccess("");
    };
    const applyGmaps = () => {
        const parsed = extractLatLngFromGmaps(form.masjid_google_maps_url.trim());
        if (parsed) {
            setForm((s) => ({
                ...s,
                masjid_latitude: String(parsed.lat),
                masjid_longitude: String(parsed.lon),
            }));
        }
        else {
            setError("Tidak dapat membaca koordinat dari link Google Maps. Pastikan format URL benar.");
        }
    };
    const useMyLocation = () => {
        if (!navigator.geolocation) {
            setError("Browser tidak mendukung Geolocation.");
            return;
        }
        navigator.geolocation.getCurrentPosition((pos) => {
            setForm((s) => ({
                ...s,
                masjid_latitude: String(pos.coords.latitude.toFixed(6)),
                masjid_longitude: String(pos.coords.longitude.toFixed(6)),
            }));
        }, () => setError("Gagal mengambil lokasi perangkat."));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!canSubmit) {
            setError("Mohon periksa kembali isian wajib dan format data.");
            return;
        }
        setLoading(true);
        setUploadPct(0);
        // siapkan abort untuk request lama bila ada
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        try {
            const fd = new FormData();
            // Wajib/utama
            fd.append("masjid_name", form.masjid_name.trim());
            // Opsional / teks
            if (form.masjid_bio_short.trim())
                fd.append("masjid_bio_short", form.masjid_bio_short.trim());
            if (form.masjid_location.trim())
                fd.append("masjid_location", form.masjid_location.trim());
            if (form.masjid_google_maps_url.trim())
                fd.append("masjid_google_maps_url", form.masjid_google_maps_url.trim());
            if (form.masjid_domain.trim())
                fd.append("masjid_domain", form.masjid_domain.trim());
            // Koordinat (opsional)
            if (form.masjid_latitude.trim())
                fd.append("masjid_latitude", form.masjid_latitude.trim());
            if (form.masjid_longitude.trim())
                fd.append("masjid_longitude", form.masjid_longitude.trim());
            // Gambar (pilih salah satu: file atau url)
            if (form.masjid_image_file) {
                fd.append("masjid_image_file", form.masjid_image_file);
            }
            else if (form.masjid_image_url.trim()) {
                fd.append("masjid_image_url", form.masjid_image_url.trim());
            }
            // Sosial
            const socials = [
                "masjid_instagram_url",
                "masjid_whatsapp_url",
                "masjid_youtube_url",
                "masjid_facebook_url",
                "masjid_tiktok_url",
                "masjid_whatsapp_group_ikhwan_url",
                "masjid_whatsapp_group_akhwat_url",
            ];
            socials.forEach((k) => {
                const v = form[k]?.toString().trim();
                if (v)
                    fd.append(k, v);
            });
            const res = await axios.post(CREATE_ENDPOINT, fd, {
                headers: { "Content-Type": "multipart/form-data" },
                signal: abortRef.current.signal,
                onUploadProgress: (evt) => {
                    if (!evt.total)
                        return;
                    setUploadPct(Math.round((evt.loaded * 100) / evt.total));
                },
            });
            // Ambil masjid_id dari response (disimpan kalau nanti mau dipakai)
            const masjidId = res.data?.data?.masjid_id ??
                res.data?.masjid_id ??
                res.data?.data?.id ??
                res.data?.id ??
                null;
            setSuccess("Masjid berhasil didaftarkan.");
            // ⬇️ tampilkan modal kunci; jangan navigate otomatis
            setShowSuccessModal(true);
        }
        catch (err) {
            if (err?.name === "CanceledError") {
                // dibatalkan user; jangan tampilkan error merah
            }
            else {
                const msg = err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Gagal mendaftarkan masjid.";
                setError(msg);
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogoutAndGoLogin = async () => {
        if (isLoggingOut)
            return;
        try {
            setIsLoggingOut(true);
            await apiLogout(); // ⬅️ clear session/token server & client
        }
        catch (e) {
            // abaikan error, tetap paksa redirect
            console.error("apiLogout error (ignored):", e);
        }
        finally {
            setIsLoggingOut(false);
            navigate("/login", { replace: true });
        }
    };
    /* =======================
       UI
    ======================= */
    return (_jsxs("div", { className: "min-h-screen py-10 px-4 md:px-6", style: styles.pageBg, children: [_jsxs("div", { className: "max-w-3xl mx-auto", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold", style: { color: theme.black1 }, children: "Registrasi Masjid" }), _jsx("p", { className: "mt-1 text-sm", style: styles.muted, children: "Isi data di bawah ini untuk mengaktifkan lembaga Anda. Anda dapat melengkapinya lagi nanti dari dashboard." })] }), _jsxs("div", { className: "rounded-2xl border p-6 md:p-8", style: styles.card, children: [_jsxs("div", { className: "mb-6 rounded-xl px-3 py-2 text-xs flex items-center gap-2", style: styles.chip, children: [_jsx(Info, { className: "h-4 w-4" }), "Beberapa kolom opsional. Minimal isi ", _jsx("b", { children: "Nama Masjid" }), "."] }), !!error && (_jsxs("div", { className: "mb-5 rounded-xl px-3 py-2 text-sm border flex items-center gap-2", style: {
                                    backgroundColor: styles.errorBg,
                                    borderColor: styles.errorBorder,
                                    color: theme.error1,
                                }, children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), " ", error] })), !!success && !showSuccessModal && (_jsxs("div", { className: "mb-5 rounded-xl px-3 py-2 text-sm border flex items-center gap-2", style: {
                                    backgroundColor: styles.successBg,
                                    borderColor: styles.successBorder,
                                    color: theme.success1,
                                }, children: [_jsx(CheckCircle2, { className: "h-4 w-4" }), " ", success] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid md:grid-cols-1 gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Landmark, { className: "h-5 w-5", style: styles.muted }), _jsx("span", { className: "text-sm", style: { color: theme.black1 }, children: "Data Utama" })] }), _jsx(InputField, { label: "Nama Masjid", name: "masjid_name", value: form.masjid_name, onChange: onChange("masjid_name"), placeholder: "Masukkan nama masjid", type: "text" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(InputField, { label: "Deskripsi Singkat", name: "masjid_bio_short", value: form.masjid_bio_short, onChange: onChange("masjid_bio_short"), as: "textarea", rows: 3, placeholder: "Tulis deskripsi singkat masjid" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(MapPin, { className: "h-5 w-5", style: styles.muted }), _jsx("span", { className: "text-sm", style: { color: theme.black1 }, children: "Alamat/Lokasi (teks)" })] }), _jsx(InputField, { label: "", name: "masjid_location", value: form.masjid_location, onChange: onChange("masjid_location"), placeholder: "Jl. Contoh No. 1, Kota" })] })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Compass, { className: "h-5 w-5", style: styles.muted }), _jsx("span", { className: "text-sm", style: { color: theme.black1 }, children: "Koordinat" })] }), _jsx(InputField, { label: "Latitude", name: "masjid_latitude", type: "number", value: form.masjid_latitude, onChange: onChange("masjid_latitude"), placeholder: "-7.123456" }), !latValid && (_jsx(SmallError, { children: "Rentang latitude \u221290 .. 90." }))] }), _jsxs("div", { className: "pt-6 md:pt-0", children: [_jsx(InputField, { label: "Longitude", name: "masjid_longitude", type: "number", value: form.masjid_longitude, onChange: onChange("masjid_longitude"), placeholder: "112.654321" }), !lonValid && (_jsx(SmallError, { children: "Rentang longitude \u2212180 .. 180." }))] }), _jsx("div", { className: "flex gap-2 items-end", children: _jsx("button", { type: "button", onClick: useMyLocation, className: "w-full rounded-xl border px-4 py-3 text-sm", style: styles.ghostBtn, children: "Gunakan Lokasi Saya" }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(LinkIcon, { className: "h-5 w-5", style: styles.muted }), _jsx("span", { className: "text-sm", style: { color: theme.black1 }, children: "Google Maps" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "flex-1", children: _jsx(InputField, { label: "Google Maps URL", name: "masjid_google_maps_url", type: "url", value: form.masjid_google_maps_url, onChange: onChange("masjid_google_maps_url"), placeholder: "Tempelkan link Google Maps" }) }), _jsx("button", { type: "button", onClick: applyGmaps, className: "px-4 rounded-xl border text-sm whitespace-nowrap h-[42px] md:h-auto mt-[22px]", style: styles.ghostBtn, children: "Ambil Koordinat" })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Globe, { className: "h-5 w-5", style: styles.muted }), _jsx("span", { className: "text-sm", style: { color: theme.black1 }, children: "Custom Domain (opsional)" })] }), _jsx(InputField, { label: "", name: "masjid_domain", value: form.masjid_domain, onChange: onChange("masjid_domain"), placeholder: "contoh: alikhlas.sch.id" }), !domainValid && form.masjid_domain && (_jsx(SmallError, { children: "Format domain tidak valid." }))] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(ImageIcon, { className: "h-5 w-5", style: styles.muted }), _jsx("span", { className: "text-sm", style: { color: theme.black1 }, children: "URL Gambar (opsional)" })] }), _jsx(InputField, { label: "", name: "masjid_image_url", type: "url", value: form.masjid_image_url, onChange: onChange("masjid_image_url"), placeholder: "https://..." })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(ImageIcon, { className: "h-5 w-5", style: styles.muted }), _jsx("span", { className: "text-sm", style: { color: theme.black1 }, children: "Upload Gambar (opsional)" })] }), _jsx(InputField, { label: "Upload Gambar", name: "masjid_image_file", type: "file", accept: "image/*", onFileChange: onFile })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-2", style: { color: theme.black1 }, children: "Sosial Media (opsional)" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(InputField, { label: "Instagram", name: "masjid_instagram_url", type: "url", value: form.masjid_instagram_url, onChange: onChange("masjid_instagram_url"), placeholder: "https://instagram.com/..." }), _jsx(InputField, { label: "WhatsApp", name: "masjid_whatsapp_url", type: "url", value: form.masjid_whatsapp_url, onChange: onChange("masjid_whatsapp_url"), placeholder: "https://wa.me/..." }), _jsx(InputField, { label: "YouTube", name: "masjid_youtube_url", type: "url", value: form.masjid_youtube_url, onChange: onChange("masjid_youtube_url"), placeholder: "https://youtube.com/@..." }), _jsx(InputField, { label: "Facebook", name: "masjid_facebook_url", type: "url", value: form.masjid_facebook_url, onChange: onChange("masjid_facebook_url"), placeholder: "https://facebook.com/..." }), _jsx(InputField, { label: "TikTok", name: "masjid_tiktok_url", type: "url", value: form.masjid_tiktok_url, onChange: onChange("masjid_tiktok_url"), placeholder: "https://tiktok.com/@..." }), _jsx(InputField, { label: "WA Group Ikhwan", name: "masjid_whatsapp_group_ikhwan_url", type: "url", value: form.masjid_whatsapp_group_ikhwan_url, onChange: onChange("masjid_whatsapp_group_ikhwan_url"), placeholder: "https://chat.whatsapp.com/..." }), _jsx(InputField, { label: "WA Group Akhwat", name: "masjid_whatsapp_group_akhwat_url", type: "url", value: form.masjid_whatsapp_group_akhwat_url, onChange: onChange("masjid_whatsapp_group_akhwat_url"), placeholder: "https://chat.whatsapp.com/..." })] })] }), _jsxs("div", { className: "pt-2 flex items-center justify-end gap-3", children: [loading && uploadPct > 0 && (_jsxs("span", { className: "text-xs", style: styles.muted, children: ["Mengunggah\u2026 ", uploadPct, "%"] })), loading && (_jsx("button", { type: "button", onClick: () => abortRef.current?.abort(), className: "rounded-xl px-4 py-3 border", style: styles.ghostBtn, children: "Batalkan" })), _jsx("button", { type: "button", onClick: () => navigate(-1), className: "rounded-xl px-5 py-3 border", style: styles.ghostBtn, disabled: loading, children: "Batal" }), _jsx("button", { type: "submit", disabled: !canSubmit || loading, className: "inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium disabled:opacity-60 disabled:cursor-not-allowed", style: styles.primaryBtn, children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Menyimpan\u2026"] })) : (_jsxs(_Fragment, { children: ["Simpan & Lanjutkan ", _jsx(CheckCircle2, { className: "h-4 w-4" })] })) })] })] })] }), _jsx("p", { className: "mt-4 text-xs text-center", style: styles.muted, children: "Dengan mengirim data ini, Anda menyetujui ketentuan & kebijakan yang berlaku." })] }), showSuccessModal && (_jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center", "aria-modal": "true", role: "dialog", "aria-labelledby": "success-title", "aria-describedby": "success-desc", 
                // tanpa onClick: tidak bisa close lewat backdrop
                style: { backgroundColor: styles.modalBackdrop }, children: _jsxs("div", { className: "mx-4 w-full max-w-md rounded-2xl border p-6 shadow-xl", style: {
                        backgroundColor: theme.white1,
                        borderColor: theme.white3,
                        color: theme.black1,
                    }, 
                    // cegah bubbling ke backdrop
                    onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "h-10 w-10 rounded-full flex items-center justify-center", style: {
                                        backgroundColor: isDark
                                            ? `${theme.success1}15`
                                            : `${theme.success1}12`,
                                    }, children: _jsx(CheckCircle2, { className: "h-6 w-6", color: theme.success1 }) }), _jsx("h2", { id: "success-title", className: "text-lg font-semibold", children: "Registrasi Berhasil" })] }), _jsx("p", { id: "success-desc", className: "text-sm", style: styles.muted, children: "Akun lembaga Anda telah aktif. Demi sinkron sesi, silakan login kembali untuk mulai mengelola profil masjid." }), _jsx("div", { className: "mt-6", children: _jsx("button", { type: "button", onClick: handleLogoutAndGoLogin, disabled: isLoggingOut, className: "w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium disabled:opacity-60 disabled:cursor-not-allowed", style: {
                                    backgroundColor: theme.primary,
                                    color: theme.white1,
                                }, children: isLoggingOut ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Mengarahkan ke Login\u2026"] })) : (_jsxs(_Fragment, { children: [_jsx(LogOut, { className: "h-4 w-4" }), "Login kembali"] })) }) })] }) }))] }));
}
function SmallError({ children }) {
    return _jsx("p", { className: "mt-1 text-xs text-red-500", children: children });
}
