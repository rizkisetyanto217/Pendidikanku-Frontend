import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogOut, Settings, HelpCircle, MoreVertical, Moon, Sun, User, } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useQueryClient } from "@tanstack/react-query";
import SharePopover from "./SharePopover";
import { useResponsive } from "@/hooks/isResponsive";
import { apiLogout } from "@/lib/axios";
import MyProfile from "./MyProfile";
import ModalEditProfile from "./ModalEditProfile";
/* ================= Helpers ================= */
const buildMyProfileData = (u) => {
    if (!u)
        return undefined;
    const p = u.profile || {};
    return {
        user: {
            full_name: u.full_name ?? u.name ?? "",
            email: u.email ?? "",
        },
        profile: {
            donation_name: p.donation_name ?? u.donation_name,
            photo_url: p.photo_url ?? u.avatar_url ?? u.avatarUrl,
            date_of_birth: p.date_of_birth,
            gender: p.gender,
            location: p.location,
            occupation: p.occupation,
            phone_number: p.phone_number,
            bio: p.bio,
        },
    };
};
const buildInitialEdit = (u) => {
    if (!u)
        return undefined;
    const p = u.profile || {};
    return {
        user: {
            full_name: u.full_name ?? u.name ?? "",
            email: u.email ?? "",
        },
        profile: {
            donation_name: p.donation_name,
            photo_url: p.photo_url,
            date_of_birth: p.date_of_birth,
            gender: p.gender,
            location: p.location,
            occupation: p.occupation,
            phone_number: p.phone_number,
            bio: p.bio,
        },
    };
};
/* ================= Component ================= */
export default function PublicUserDropdown({ variant = "default", withBg = true, }) {
    const { isDark, setDarkMode, themeName, setThemeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data: user } = useCurrentUser();
    const isLoggedIn = !!user;
    const profileData = useMemo(() => buildMyProfileData(user), [user]);
    const navigate = useNavigate();
    const { slug } = useParams();
    const { isMobile } = useResponsive();
    const queryClient = useQueryClient();
    const base = `/masjid/${slug}`;
    const dropdownRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    // Modal states
    const [profileOpen, setProfileOpen] = useState(false);
    // state
    const [editOpen, setEditOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editInitial, setEditInitial] = useState();
    // converter dari MyProfileData -> EditProfileData
    const fromMyProfileToEdit = (d) => ({
        user: { full_name: d.user?.full_name, email: d.user?.email },
        profile: d.profile ? { ...d.profile } : undefined, // ⬅️ aman bila undefined
    });
    const handleLogout = async () => {
        setIsLoggingOut(true);
        setOpen(false);
        try {
            await apiLogout();
            queryClient.removeQueries({ queryKey: ["currentUser"], exact: true });
            navigate(slug ? `${base}/login` : "/login", { replace: true });
        }
        catch {
            navigate(slug ? `${base}/login` : "/login", { replace: true });
        }
        finally {
            setIsLoggingOut(false);
        }
    };
    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const menuItemClass = "w-full flex items-center gap-2 px-4 py-2 text-left transition";
    const hoverStyle = (e) => (e.currentTarget.style.backgroundColor = theme.white2);
    const outStyle = (e) => (e.currentTarget.style.backgroundColor = "transparent");
    return (_jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsx("button", { onClick: () => setOpen((v) => !v), className: `h-9 w-9 grid place-items-center rounded-xl transition ${variant === "default" ? "px-2" : ""}`, "aria-haspopup": "menu", "aria-expanded": open, style: {
                    backgroundColor: withBg ? theme.white3 : "transparent",
                    color: theme.black1,
                }, children: _jsx(MoreVertical, { className: "w-5 h-5" }) }), open && (_jsx("div", { className: "absolute right-0 mt-2 w-56 rounded-lg border z-50", role: "menu", style: {
                    backgroundColor: theme.white1,
                    borderColor: theme.silver1,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }, children: _jsxs("ul", { className: "py-2 text-sm", style: { color: theme.black1 }, children: [!isLoggedIn && (_jsx("li", { children: _jsxs("button", { onClick: () => {
                                    setOpen(false);
                                    navigate("/login");
                                }, className: menuItemClass, onMouseOver: hoverStyle, onMouseOut: outStyle, children: [_jsx(LogOut, { className: "w-4 h-4" }), " Login"] }) })), isLoggedIn && (_jsx("li", { children: _jsxs("button", { onClick: () => {
                                    setOpen(false);
                                    const url = isMobile
                                        ? `${base}/aktivitas/pengaturan/menu`
                                        : `${base}/aktivitas/pengaturan/profil-saya`;
                                    navigate(url);
                                }, className: menuItemClass, onMouseOver: hoverStyle, onMouseOut: outStyle, children: [_jsx(Settings, { className: "w-4 h-4" }), " Pengaturan"] }) })), _jsx("li", { children: _jsxs("button", { onClick: () => {
                                    setOpen(false);
                                    navigate(`${base}/bantuan`);
                                }, className: menuItemClass, onMouseOver: hoverStyle, onMouseOut: outStyle, children: [_jsx(HelpCircle, { className: "w-4 h-4" }), " Bantuan"] }) }), _jsx("li", { children: _jsxs("button", { onClick: () => {
                                    setOpen(false);
                                    setProfileOpen(true);
                                }, className: menuItemClass, onMouseOver: hoverStyle, onMouseOut: outStyle, children: [_jsx(User, { className: "w-4 h-4" }), " Profil Saya"] }) }), _jsx("li", { children: _jsx("button", { onClick: () => {
                                    setDarkMode(!isDark);
                                    setOpen(false);
                                }, className: menuItemClass, onMouseOver: hoverStyle, onMouseOut: outStyle, children: isDark ? (_jsxs(_Fragment, { children: [_jsx(Sun, { className: "w-4 h-4" }), " Mode Terang"] })) : (_jsxs(_Fragment, { children: [_jsx(Moon, { className: "w-4 h-4" }), " Mode Gelap"] })) }) }), _jsx("li", { children: _jsxs("div", { className: "px-4 py-2", children: [_jsx("p", { className: "text-xs mb-1", style: { color: theme.silver2 }, children: "Pilih Tema" }), _jsxs("select", { value: themeName, onChange: (e) => {
                                            setThemeName(e.target.value);
                                            setOpen(false);
                                        }, className: "w-full border rounded px-2 py-1 text-sm", style: {
                                            backgroundColor: theme.white2,
                                            color: theme.black1,
                                            borderColor: theme.silver1,
                                        }, children: [_jsx("option", { value: "default", children: "Default" }), _jsx("option", { value: "sunrise", children: "Sunrise" }), _jsx("option", { value: "midnight", children: "Midnight" })] })] }) }), _jsx("li", { children: _jsx("div", { className: "px-4 py-2", children: _jsx(SharePopover, { title: document.title, url: window.location.href, forceCustom: true }) }) }), isLoggedIn && (_jsx("li", { children: _jsx("button", { onClick: handleLogout, disabled: isLoggingOut, className: `${menuItemClass} disabled:opacity-60 disabled:cursor-not-allowed`, style: { color: theme.error1 }, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = theme.error2), onMouseOut: outStyle, children: isLoggingOut ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", fill: "none", style: { color: theme.error1 }, children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 11-8 8z" })] }), _jsx("span", { children: "Keluar..." })] })) : (_jsxs(_Fragment, { children: [_jsx(LogOut, { className: "w-4 h-4" }), " Keluar"] })) }) }))] }) })), _jsx(MyProfile, { open: profileOpen, onClose: () => setProfileOpen(false), data: profileData, onEdit: (mp) => {
                    // ⬅️ sekarang MyProfile mengirim snapshot
                    setProfileOpen(false);
                    setEditInitial(fromMyProfileToEdit(mp)); // placeholder dari snapshot
                    setEditOpen(true);
                } }), editInitial && (_jsx(ModalEditProfile, { open: editOpen, onClose: () => setEditOpen(false), initial: editInitial, loading: isSaving, onSave: async (payload, opts = {}) => {
                    // ⬅️ default {}
                    const { photoFile } = opts; // aman walau tidak dikirim
                    try {
                        setIsSaving(true);
                        // TODO: kirim ke API…
                    }
                    finally {
                        setIsSaving(false);
                        setEditOpen(false);
                    }
                } }))] }));
}
