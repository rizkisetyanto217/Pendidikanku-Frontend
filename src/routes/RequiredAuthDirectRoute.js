import { jsx as _jsx } from "react/jsx-runtime";
// src/routes/RequireAuthRedirect.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "@/lib/axios";
// mapping role ⇒ path
const ROLE_ROUTE = {
    owner: "/",
    admin: "/admin",
    dkm: "/dkm",
    author: "/author",
    teacher: "/teacher",
    student: "/student",
};
// ambil role efektif dari semua membership
function pickEffectiveRole(ctx) {
    if (!ctx?.user_id)
        return null;
    const have = new Set();
    for (const m of ctx.memberships ?? []) {
        for (const r of m.roles ?? [])
            have.add(r);
    }
    const priority = ["owner", "admin", "dkm", "author", "teacher", "student"];
    for (const r of priority)
        if (have.has(r))
            return r;
    return null;
}
export default function RequireAuthRedirect() {
    const [loading, setLoading] = useState(true);
    const [ctx, setCtx] = useState(null);
    const location = useLocation();
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
    if (loading)
        return null;
    if (!ctx)
        return _jsx(Navigate, { to: "/login", replace: true });
    // kalau sebelumnya ada state.from, hormati itu
    const from = location.state?.from?.pathname;
    if (from)
        return _jsx(Navigate, { to: from, replace: true });
    const role = pickEffectiveRole(ctx);
    const to = role ? (ROLE_ROUTE[role] ?? "/login") : "/login";
    return _jsx(Navigate, { to: to, replace: true });
}
