// src/routes/RequireRoleRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import api from "@/lib/axios";

type Props = {
  /** Role yang diizinkan di route ini. Contoh: ["dkm","teacher"] */
  allowedRoles: string[];
};

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

function hasAccess(
  ctx: SimpleContext | null,
  allowedRoles: string[],
  masjidSlug?: string
) {
  if (!ctx?.user_id) return false;
  if (!allowedRoles?.length) return true; // kalau tidak diisi, cukup login

  const scope = masjidSlug
    ? (ctx.memberships || []).filter((m) => m.masjid_slug === masjidSlug)
    : ctx.memberships || [];

  return scope.some((m) => m.roles?.some((r) => allowedRoles.includes(r)));
}

export default function RequireRoleRoute({ allowedRoles }: Props) {
  const [loading, setLoading] = useState(true);
  const [ctx, setCtx] = useState<SimpleContext | null>(null);
  const location = useLocation();
  const { masjidSlug } = useParams<{ masjidSlug?: string }>();

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Memuat akses...
      </div>
    );
  }

  if (!hasAccess(ctx, allowedRoles, masjidSlug)) {
    // kirim lokasi sekarang agar bisa redirect balik setelah login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
