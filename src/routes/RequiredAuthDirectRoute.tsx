// src/routes/RequireAuthRedirect.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "@/lib/axios";

type Membership = {
  masjid_id: string;
  masjid_name: string;
  masjid_slug: string;
  masjid_icon_url?: string | null;
  roles: string[];
};

type SimpleContext = {
  user_id: string;
  user_name: string;
  memberships: Membership[];
};

// mapping role ⇒ path
const ROLE_ROUTE: Record<string, string> = {
  owner: "/",
  admin: "/admin",
  dkm: "/dkm",
  author: "/author",
  teacher: "/teacher",
  student: "/student",
};

// ambil role efektif dari semua membership
function pickEffectiveRole(ctx: SimpleContext | null): string | null {
  if (!ctx?.user_id) return null;
  const have = new Set<string>();
  for (const m of ctx.memberships ?? []) {
    for (const r of m.roles ?? []) have.add(r);
  }
  const priority = ["owner", "admin", "dkm", "author", "teacher", "student"];
  for (const r of priority) if (have.has(r)) return r;
  return null;
}

export default function RequireAuthRedirect() {
  const [loading, setLoading] = useState(true);
  const [ctx, setCtx] = useState<SimpleContext | null>(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    api
      .get("/api/auth/me/simple-context", { withCredentials: true })
      .then((res) => {
        const data = (res?.data?.data ?? null) as SimpleContext | null;
        if (mounted) setCtx(data);
      })
      .catch(() => {
        if (mounted) setCtx(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;

  if (!ctx) return <Navigate to="/login" replace />;

  // kalau sebelumnya ada state.from, hormati itu
  const from = (location.state as any)?.from?.pathname as string | undefined;
  if (from) return <Navigate to={from} replace />;

  const role = pickEffectiveRole(ctx);
  const to = role ? (ROLE_ROUTE[role] ?? "/login") : "/login";

  return <Navigate to={to} replace />;
}
