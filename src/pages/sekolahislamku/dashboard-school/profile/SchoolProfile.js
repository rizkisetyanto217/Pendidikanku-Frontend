import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/school/SchoolProfile.tsx
import { useEffect, useMemo, useState } from "react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useNavigate } from "react-router-dom";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { Building2, Award, MapPin, Phone, Mail, Globe, UserCog, ExternalLink, Navigation, Image as ImageIcon, X, ArrowLeft, } from "lucide-react";
/* ================= Helpers ================= */
const topbarDateFmt = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    : "";
const toLocalNoonISO = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x.toISOString();
};
const fullAddress = (p) => {
    if (!p)
        return "-";
    const parts = [
        p.line,
        p.village,
        p.district,
        p.city,
        p.province,
        p.postal,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "-";
};
const isoToYmd = (iso) => (iso ? iso.slice(0, 10) : "");
const ymdToIsoUTC = (ymd) => ymd ? new Date(`${ymd}T00:00:00.000Z`).toISOString() : null;
/* ================= Page ================= */
const SchoolProfile = ({ showBack = false, backTo, backLabel = "Kembali", }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const handleBack = () => {
        if (backTo)
            navigate(backTo);
        else
            navigate(-1);
    };
    // ------ DATA DUMMY disimpan di state ------
    const [data, setData] = useState({
        name: "Sekolah Islamku",
        npsn: "20251234",
        accreditation: "A",
        foundedAt: "2010-07-01T00:00:00.000Z",
        address: {
            line: "Jl. Cendekia No. 10",
            village: "Mekarjaya",
            district: "Cibeunying",
            city: "Bandung",
            province: "Jawa Barat",
            postal: "40111",
        },
        contact: {
            phone: "0812-3456-7890",
            email: "info@sekolahislamku.sch.id",
            website: "https://sekolahislamku.sch.id",
        },
        headmaster: {
            name: "Ust. Ahmad Fulan, S.Pd",
            phone: "0812-1111-2222",
            email: "ahmad@sekolahislamku.sch.id",
        },
        vision: "Mewujudkan generasi berakhlak mulia, berilmu, dan berdaya saing global.",
        mission: [
            "Pendidikan berlandaskan Al-Qur'an dan Sunnah.",
            "Mengembangkan karakter berakhlak mulia.",
        ],
        logoUrl: null,
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.1804!2d110.370!3d-7.867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNTInMDAuMCJTIDExMMKwMjInMTIuMCJF!5e0!3m2!1sen!2sid!4v1690000000000",
        gallery: [
            {
                id: "g1",
                url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
                caption: "Perpustakaan",
            },
            {
                id: "g2",
                url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop",
                caption: "Lapangan",
            },
            {
                id: "g3",
                url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop",
                caption: "Kelas",
            },
        ],
    });
    const [editOpen, setEditOpen] = useState(false);
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    const nowISO = toLocalNoonISO(new Date());
    const foundedYear = useMemo(() => {
        if (!data?.foundedAt)
            return "-";
        const d = new Date(data.foundedAt);
        return Number.isNaN(d.getTime()) ? "-" : d.getFullYear();
    }, [data?.foundedAt]);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Profil Sekolah", gregorianDate: nowISO, showBack: isFromMenuUtama }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [showBack && (_jsx(Btn, { palette: palette, onClick: handleBack, className: "cursor-pointer self-start", variant: "ghost", children: _jsx(ArrowLeft, { size: 20 }) })), _jsx("h1", { className: "font-semibold text-lg md:text-xl", children: "Identitas Sekolah" })] }), _jsx(SectionCard, { palette: palette, className: "overflow-hidden ", children: _jsx("div", { className: "p-4 md:p-6", children: _jsxs("div", { className: "flex flex-col sm:flex-row items-start gap-4", children: [_jsx("div", { className: "h-16 w-16 sm:h-20 sm:w-20 rounded-xl grid place-items-center overflow-hidden border shrink-0 mx-auto sm:mx-0", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                    }, children: data?.logoUrl ? (_jsx("img", { src: data.logoUrl, alt: "Logo Sekolah", className: "h-full w-full object-cover" })) : (_jsx(Building2, { size: 28, style: { color: palette.black1 } })) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-3 text-center sm:text-left", children: [_jsx("h1", { className: "text-xl md:text-2xl lg:text-3xl font-semibold leading-tight", children: data?.name ?? "Sekolah" }), _jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center sm:justify-start", children: [data?.accreditation && (_jsxs(Badge, { palette: palette, variant: "success", children: ["Akreditasi ", data.accreditation] })), _jsxs(Badge, { palette: palette, variant: "outline", children: ["Berdiri ", foundedYear] })] }), _jsxs("div", { className: "space-y-2", children: [data?.npsn && (_jsx("div", { className: "flex justify-center sm:justify-start", children: _jsx(Badge, { palette: palette, variant: "outline", children: _jsxs("span", { style: { color: palette.black2 }, children: ["NPSN: ", data.npsn] }) }) })), _jsxs("div", { className: "text-sm flex items-start justify-center sm:justify-start gap-1", style: { color: palette.black2 }, children: [_jsx(MapPin, { size: 14, className: "mt-0.5 shrink-0" }), _jsx("span", { className: "text-center sm:text-left leading-relaxed", children: fullAddress(data?.address) })] })] })] })] }) }) }), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6", children: [_jsxs(SectionCard, { palette: palette, className: "p-4 md:p-6", children: [_jsxs("div", { className: "font-semibold mb-4 flex items-center gap-2", children: [_jsx(Phone, { size: 18 }), "Kontak Sekolah"] }), _jsxs("div", { className: "space-y-3 text-sm", style: { color: palette.black2 }, children: [_jsx(InfoRow, { palette: palette, icon: _jsx(Phone, { size: 16 }), label: "Telepon", value: data?.contact?.phone ?? "-" }), _jsx(InfoRow, { palette: palette, icon: _jsx(Mail, { size: 16 }), label: "Email", value: data?.contact?.email ?? "-" }), _jsx(InfoRow, { palette: palette, icon: _jsx(Globe, { size: 16 }), label: "Website", value: data?.contact?.website ? (_jsxs("a", { href: data.contact.website, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 underline break-all", style: { color: palette.primary }, children: [data.contact.website, " ", _jsx(ExternalLink, { size: 12, className: "shrink-0" })] })) : ("-") })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-6", children: [_jsxs("div", { className: "font-semibold mb-4 flex items-center gap-2", children: [_jsx(Award, { size: 18 }), "Kepala Sekolah"] }), _jsxs("div", { className: "space-y-3 text-sm", style: { color: palette.black2 }, children: [_jsx(InfoRow, { icon: _jsx(UserCog, { size: 16 }), label: "Nama", palette: palette, value: data?.headmaster?.name ?? "-" }), _jsx(InfoRow, { palette: palette, icon: _jsx(Phone, { size: 16 }), label: "Kontak", value: data?.headmaster?.phone ?? "-" }), _jsx(InfoRow, { palette: palette, icon: _jsx(Mail, { size: 16 }), label: "Email", value: data?.headmaster?.email ?? "-" })] })] })] }), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6", children: [_jsxs(SectionCard, { palette: palette, className: "p-4 md:p-6", children: [_jsx("div", { className: "font-semibold mb-4", children: "Visi" }), _jsx("p", { className: "text-sm leading-relaxed", style: { color: palette.black2 }, children: data?.vision ?? "-" })] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-6", children: [_jsx("div", { className: "font-semibold mb-4", children: "Misi" }), data?.mission?.length ? (_jsx("ul", { className: "list-disc pl-5 space-y-2 text-sm leading-relaxed", style: { color: palette.black2 }, children: data.mission.map((m, i) => (_jsx("li", { children: m }, i))) })) : (_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "-" }))] })] }), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6", children: [_jsxs(SectionCard, { palette: palette, className: "p-4 md:p-6", children: [_jsxs("div", { className: "font-semibold mb-4 flex items-center gap-2", children: [_jsx(Navigation, { size: 18 }), "Lokasi"] }), data?.mapEmbedUrl ? (_jsx("div", { className: "rounded-xl overflow-hidden border", style: { borderColor: palette.silver1 }, children: _jsx("iframe", { src: data.mapEmbedUrl, title: "Peta Sekolah", width: "100%", height: "220", className: "md:h-64", loading: "lazy", referrerPolicy: "no-referrer-when-downgrade", allowFullScreen: true }) })) : (_jsx(EmptyBlock, { palette: palette, icon: _jsx(Navigation, {}), text: "Belum ada peta." }))] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-6", children: [_jsxs("div", { className: "font-semibold mb-4 flex items-center gap-2", children: [_jsx(ImageIcon, { size: 18 }), "Galeri"] }), data?.gallery && data.gallery.length > 0 ? (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 md:gap-3", children: data.gallery.slice(0, 6).map((g) => (_jsxs("figure", { className: "rounded-lg overflow-hidden border", style: { borderColor: palette.black2 }, children: [_jsx("img", { src: g.url, alt: g.caption ?? "Foto", className: "w-full h-24 sm:h-32 lg:h-28 object-cover", loading: "lazy" }), g.caption && (_jsx("figcaption", { className: "px-2 py-1 text-sm truncate", style: { color: palette.black2 }, title: g.caption, children: g.caption }))] }, g.id))) })) : (_jsx(EmptyBlock, { palette: palette, icon: _jsx(ImageIcon, {}), text: "Belum ada foto." }))] })] }), _jsx("div", { className: "flex items-center justify-center sm:justify-end", children: _jsx(Btn, { palette: palette, variant: "outline", onClick: () => setEditOpen(true), className: "w-full sm:w-auto", children: "Edit Profil" }) })] })] }) }), _jsx(ModalEditProfilSchool, { open: editOpen, onClose: () => setEditOpen(false), palette: palette, initial: data, onSubmit: (v) => {
                    // di sini nanti ganti ke PUT API; untuk sekarang update state lokal
                    setData(v);
                    setEditOpen(false);
                } })] }));
};
export default SchoolProfile;
/* =============== Small UI =============== */
function InfoRow({ icon, label, palette, value, }) {
    return (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "mt-1 shrink-0", children: icon }), _jsxs("div", { className: "min-w-0 flex-1", style: { color: palette.black2 }, children: [_jsx("div", { className: "text-sm opacity-90 mb-1", children: _jsx("p", { style: { color: palette.black2 }, children: label }) }), _jsx("div", { className: "text-sm break-words leading-relaxed", children: value })] })] }));
}
function EmptyBlock({ palette, icon, text, }) {
    return (_jsxs("div", { className: "rounded-xl border p-6 text-sm flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left", style: { borderColor: palette.silver1, color: palette.black2 }, children: [icon, _jsx("span", { children: text })] }));
}
/* =========================================================
   ModalEditProfilSchool - REFACTORED with better mobile responsiveness
   ========================================================= */
function ModalEditProfilSchool({ open, onClose, palette, initial, onSubmit, saving = false, error = null, }) {
    const [form, setForm] = useState(initial);
    const [missionText, setMissionText] = useState((initial.mission ?? []).join("\n"));
    useEffect(() => {
        if (!open)
            return;
        setForm(initial);
        setMissionText((initial.mission ?? []).join("\n"));
        // lock scroll
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open, initial]);
    // ESC close
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    if (!open)
        return null;
    const canSubmit = !!form.name && !saving;
    const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));
    const setAddr = (k, v) => setForm((s) => ({ ...s, address: { ...(s.address ?? {}), [k]: v } }));
    const setContact = (k, v) => setForm((s) => ({ ...s, contact: { ...(s.contact ?? {}), [k]: v } }));
    const setHead = (k, v) => setForm((s) => ({ ...s, headmaster: { ...(s.headmaster ?? {}), [k]: v } }));
    const missionsFromText = (s) => s
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
    return (_jsx("div", { className: "fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4", style: { background: "rgba(0,0,0,.4)" }, onClick: (e) => {
            if (e.target === e.currentTarget)
                onClose();
        }, role: "dialog", "aria-modal": "true", children: _jsxs(SectionCard, { palette: palette, className: "w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] rounded-2xl shadow-2xl flex flex-col mx-2 sm:mx-4", style: { background: palette.white1, color: palette.black1 }, children: [_jsxs("div", { className: "px-4 sm:px-6 py-4 flex items-center justify-between border-b shrink-0", style: { borderColor: palette.silver1 }, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Building2, { size: 20, color: palette.quaternary }), _jsx("h2", { className: "text-lg sm:text-xl font-semibold", children: "Edit Profil Sekolah" })] }), _jsx("button", { "aria-label": "Tutup", onClick: onClose, className: "h-10 w-10 grid place-items-center rounded-full hover:bg-black hover:bg-opacity-5 transition-colors", style: {
                                border: `1px solid ${palette.silver1}`,
                                background: palette.white2,
                            }, children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6", children: _jsxs("div", { className: "space-y-6 sm:space-y-8", children: [!!error && (_jsx("div", { className: "rounded-lg px-4 py-3 text-sm", style: { background: palette.error2, color: palette.error1 }, children: error })), _jsxs("section", { children: [_jsx(BlockTitle, { title: "Identitas Sekolah" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(FieldText, { label: "Nama Sekolah", value: form.name, onChange: (v) => set("name", v), palette: palette, required: true }), _jsx(FieldText, { label: "NPSN", value: form.npsn ?? "", onChange: (v) => set("npsn", v), palette: palette }), _jsxs("div", { className: "grid gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Akreditasi" }), _jsxs("select", { value: form.accreditation ?? "", onChange: (e) => set("accreditation", (e.target.value || null)), className: "w-full rounded-xl px-3 py-2.5 border outline-none focus:ring-2 focus:ring-opacity-20 transition-all", style: {
                                                            borderColor: palette.silver1,
                                                            background: palette.white2,
                                                        }, children: [_jsx("option", { value: "", children: "\u2014" }), _jsx("option", { value: "A", children: "A" }), _jsx("option", { value: "B", children: "B" }), _jsx("option", { value: "C", children: "C" }), _jsx("option", { value: "-", children: "-" })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Tanggal Berdiri" }), _jsx("input", { type: "date", value: isoToYmd(form.foundedAt), onChange: (e) => set("foundedAt", ymdToIsoUTC(e.target.value)), className: "w-full rounded-xl px-3 py-2.5 border outline-none focus:ring-2 focus:ring-opacity-20 transition-all", style: {
                                                            borderColor: palette.silver1,
                                                            background: palette.white2,
                                                        } })] })] })] }), _jsxs("section", { children: [_jsx(BlockTitle, { title: "Alamat" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx("div", { className: "sm:col-span-2", children: _jsx(FieldText, { label: "Alamat", value: form.address?.line ?? "", onChange: (v) => setAddr("line", v), palette: palette }) }), _jsx(FieldText, { label: "Kelurahan / Desa", value: form.address?.village ?? "", onChange: (v) => setAddr("village", v), palette: palette }), _jsx(FieldText, { label: "Kecamatan", value: form.address?.district ?? "", onChange: (v) => setAddr("district", v), palette: palette }), _jsx(FieldText, { label: "Kota / Kabupaten", value: form.address?.city ?? "", onChange: (v) => setAddr("city", v), palette: palette }), _jsx(FieldText, { label: "Provinsi", value: form.address?.province ?? "", onChange: (v) => setAddr("province", v), palette: palette }), _jsx(FieldText, { label: "Kode Pos", value: form.address?.postal ?? "", onChange: (v) => setAddr("postal", v), palette: palette })] })] }), _jsxs("section", { children: [_jsx(BlockTitle, { title: "Kontak" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(FieldText, { label: "Telepon", value: form.contact?.phone ?? "", onChange: (v) => setContact("phone", v), palette: palette }), _jsx(FieldText, { label: "Email", value: form.contact?.email ?? "", onChange: (v) => setContact("email", v), palette: palette }), _jsx("div", { className: "sm:col-span-2", children: _jsx(FieldText, { label: "Website", value: form.contact?.website ?? "", onChange: (v) => setContact("website", v), palette: palette, placeholder: "https://\u2026" }) }), _jsx("div", { className: "sm:col-span-2", children: _jsx(FieldText, { label: "URL Logo (opsional)", value: form.logoUrl ?? "", onChange: (v) => set("logoUrl", v), palette: palette }) })] })] }), _jsxs("section", { children: [_jsx(BlockTitle, { title: "Kepala Sekolah" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx("div", { className: "sm:col-span-2", children: _jsx(FieldText, { label: "Nama", value: form.headmaster?.name ?? "", onChange: (v) => setHead("name", v), palette: palette }) }), _jsx(FieldText, { label: "Telepon", value: form.headmaster?.phone ?? "", onChange: (v) => setHead("phone", v), palette: palette }), _jsx(FieldText, { label: "Email", value: form.headmaster?.email ?? "", onChange: (v) => setHead("email", v), palette: palette })] })] }), _jsxs("section", { children: [_jsx(BlockTitle, { title: "Visi & Misi" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Visi" }), _jsx("textarea", { rows: 5, value: form.vision ?? "", onChange: (e) => set("vision", e.target.value), className: "w-full rounded-xl px-3 py-2.5 border outline-none focus:ring-2 focus:ring-opacity-20 transition-all resize-none", style: {
                                                            borderColor: palette.silver1,
                                                            background: palette.white2,
                                                        }, placeholder: "Tulis visi sekolah\u2026" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Misi (satu baris satu poin)" }), _jsx("textarea", { rows: 5, value: missionText, onChange: (e) => setMissionText(e.target.value), className: "w-full rounded-xl px-3 py-2.5 border outline-none focus:ring-2 focus:ring-opacity-20 transition-all resize-none", style: {
                                                            borderColor: palette.silver1,
                                                            background: palette.white2,
                                                        }, placeholder: "Tulis misi 1\nTulis misi 2\n…" })] })] })] }), _jsx("div", { className: "h-4" })] }) }), _jsxs("div", { className: "px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t shrink-0", style: { borderColor: palette.silver1 }, children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, disabled: saving, className: "w-full sm:w-auto order-2 sm:order-1", children: "Batal" }), _jsx(Btn, { palette: palette, disabled: !canSubmit, onClick: () => onSubmit({
                                ...form,
                                // normalisasi nilai kosong agar konsisten
                                npsn: form.npsn?.trim() || null,
                                vision: (form.vision?.trim() || null),
                                mission: missionsFromText(missionText),
                            }), className: "w-full sm:w-auto order-1 sm:order-2", children: saving ? "Menyimpan…" : "Simpan" })] })] }) }));
}
/* ---- sub-komponen kecil untuk modal ---- */
function FieldText({ label, value, onChange, palette, placeholder, required, }) {
    return (_jsxs("div", { className: "grid gap-2", children: [_jsxs("label", { className: "text-sm font-medium", children: [label, " ", required ? _jsx("span", { className: "text-red-500", children: "*" }) : null] }), _jsx("input", { value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: "w-full rounded-xl px-3 py-2.5 border outline-none focus:ring-2 focus:ring-opacity-20 transition-all", style: { borderColor: palette.silver1, background: palette.white2 } })] }));
}
function BlockTitle({ title }) {
    return _jsx("div", { className: "font-semibold text-base opacity-90 mb-4", children: title });
}
