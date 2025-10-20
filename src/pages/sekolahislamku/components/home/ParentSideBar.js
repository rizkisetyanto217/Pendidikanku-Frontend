import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/components/home/ParentSidebar.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useMatch, useParams, useResolvedPath, } from "react-router-dom";
import { SectionCard, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { NAVS } from "./navsConfig";
import api from "@/lib/axios";
const normalize = (s) => s.replace(/\/+$/, "");
const buildBase = (slug, kind) => slug ? `/${slug}/${kind}` : `/${kind}`;
const buildTo = (base, p) => {
    const raw = p === "" || p === "." ? base : `${base}/${p.replace(/^\/+/, "")}`;
    return normalize(raw);
};
function SidebarItem({ palette, to, end, icon: Icon, label, onClick, }) {
    const location = useLocation();
    const resolved = useResolvedPath(to);
    const current = normalize(location.pathname);
    const target = normalize(resolved.pathname);
    const isActive = end
        ? current === target
        : current === target || current.startsWith(target + "/");
    return (_jsx(Link, { to: to, onClick: onClick, className: "block focus:outline-none", children: _jsxs("div", { className: "flex items-center gap-3 rounded-xl px-3 py-2 border transition-all hover:translate-x-px", style: {
                background: isActive ? palette.primary2 : palette.white1,
                borderColor: isActive ? palette.tertiary : palette.silver1,
                boxShadow: isActive ? `0 0 0 1px ${palette.tertiary} inset` : "none",
                fontWeight: isActive ? 600 : 400,
            }, children: [_jsx("span", { className: "h-7 w-7 grid place-items-center rounded-lg border", style: {
                        background: isActive ? palette.tertiary : palette.white1,
                        borderColor: isActive ? palette.tertiary : palette.silver1,
                        color: isActive ? palette.white1 : palette.silver2,
                    }, children: _jsx(Icon, { size: 16 }) }), _jsx("span", { className: "truncate font-medium", children: label })] }) }));
}
export default function ParentSidebar({ palette, kind = "auto", className = "", desktopOnly = true, mode = "auto", openMobile = false, onCloseMobile, }) {
    const { pathname } = useLocation();
    const params = useParams();
    const match = useMatch("/:slug/*");
    const slug = params.slug ?? match?.params.slug ?? "";
    const [resolvedKind, setResolvedKind] = useState("sekolah");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function determineRole() {
            try {
                const savedRole = localStorage.getItem("active_role");
                if (savedRole) {
                    const r = savedRole.toLowerCase();
                    if (["teacher", "guru"].includes(r))
                        setResolvedKind("guru");
                    else if (["student", "murid"].includes(r))
                        setResolvedKind("murid");
                    else
                        setResolvedKind("sekolah");
                    setLoading(false);
                    return;
                }
                const res = await api.get("/auth/me/simple-context");
                const memberships = res.data?.data?.memberships ?? [];
                let role = "user";
                if (memberships.length > 0) {
                    const allRoles = memberships.flatMap((m) => m.roles ?? []);
                    if (allRoles.includes("dkm") || allRoles.includes("admin"))
                        role = "dkm";
                    else if (allRoles.includes("teacher"))
                        role = "teacher";
                    else if (allRoles.includes("student"))
                        role = "student";
                }
                localStorage.setItem("active_role", role);
                if (["teacher", "guru"].includes(role))
                    setResolvedKind("guru");
                else if (["student", "murid"].includes(role))
                    setResolvedKind("murid");
                else
                    setResolvedKind("sekolah");
            }
            catch (err) {
                console.error("Gagal menentukan role sidebar:", err);
                setResolvedKind("sekolah");
            }
            finally {
                setLoading(false);
            }
        }
        determineRole();
    }, []);
    const base = buildBase(slug, resolvedKind);
    const navs = useMemo(() => NAVS[resolvedKind].map((n) => ({ ...n, to: buildTo(base, n.path) })), [resolvedKind, base]);
    const SidebarContent = (_jsx(SectionCard, { palette: palette, className: "p-2", style: { border: `1px solid ${palette.silver1}` }, children: loading ? (_jsx("div", { className: "text-sm text-gray-500 text-center py-6", children: "Memuat menu..." })) : (_jsx("ul", { className: "space-y-2", children: navs.map(({ to, label, icon, end }) => (_jsx("li", { children: _jsx(SidebarItem, { palette: palette, to: to, end: end, icon: icon, label: label, onClick: mode !== "desktop" ? onCloseMobile : undefined }) }, to))) })) }));
    if (mode === "desktop") {
        return (_jsx("nav", { className: [
                desktopOnly ? "hidden lg:block" : "",
                "w-64 shrink-0 lg:sticky lg:top-20 lg:z-30 lg:max-h-[calc(100vh-5rem)] lg:overflow-auto overflow-y-auto",
                className,
            ].join(" "), children: SidebarContent }));
    }
    if (mode === "mobile" || (mode === "auto" && openMobile)) {
        return (_jsxs("div", { className: "fixed inset-0 z-50 flex lg:hidden", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onCloseMobile }), _jsx("div", { className: "relative w-64 bg-white shadow-xl", children: SidebarContent })] }));
    }
    return (_jsx("nav", { className: [
            desktopOnly ? "hidden lg:block" : "",
            "w-64 shrink-0 lg:sticky lg:top-20 lg:z-30 lg:max-h-[calc(100vh-5rem)] lg:overflow-auto overflow-y-auto",
            className,
        ].join(" "), children: SidebarContent }));
}
