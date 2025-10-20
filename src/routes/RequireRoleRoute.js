import { jsx as _jsx } from "react/jsx-runtime";
// src/routes/RequireRoleRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import api from "@/lib/axios";
function hasAccess(ctx, allowedRoles, masjidSlug) {
    if (!ctx?.user_id)
        return false;
    if (!allowedRoles?.length)
        return true; // kalau tidak diisi, cukup login
    const scope = masjidSlug
        ? (ctx.memberships || []).filter((m) => m.masjid_slug === masjidSlug)
        : ctx.memberships || [];
    return scope.some((m) => m.roles?.some((r) => allowedRoles.includes(r)));
}
export default function RequireRoleRoute({ allowedRoles }) {
    const [loading, setLoading] = useState(true);
    const [ctx, setCtx] = useState(null);
    const location = useLocation();
    const { masjidSlug } = useParams();
    useEffect(() => {
        let mounted = true;
        api
            .get("/api/auth/me/simple-context", { withCredentials: true })
            .then((res) => {
            const data = (res?.data?.data ?? null);
            if (mounted)
                setCtx(data);
        })
            .catch(() => {
            if (mounted)
                setCtx(null);
        })
            .finally(() => {
            if (mounted)
                setLoading(false);
        });
        return () => {
            mounted = false;
        };
    }, []);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300", children: "Memuat akses..." }));
    }
    if (!hasAccess(ctx, allowedRoles, masjidSlug)) {
        // kirim lokasi sekarang agar bisa redirect balik setelah login
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location } });
    }
    return _jsx(Outlet, {});
}
