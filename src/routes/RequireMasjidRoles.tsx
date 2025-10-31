// src/routes/RequireMasjidRoles.tsx
import { type ReactElement } from "react";
import { Navigate, useLocation, useParams, Outlet } from "react-router-dom";
import {
  useMasjidMembership,
  type MasjidRole,
} from "@/hooks/useMasjidMembership";
import { getAccessToken } from "@/lib/axios";

export default function RequireMasjidRoles({
  allow,
}: {
  allow: MasjidRole[];
}): ReactElement | null {
  // ✅ samakan dengan router: :masjid_id
  const { masjid_id } = useParams<{ masjid_id?: string }>();
  const masjidId = masjid_id ?? ""; // alias lokal yang stabil
  const loc = useLocation();
  const access = getAccessToken();

  if (!access) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: loc.pathname + loc.search }}
      />
    );
  }

  // ✅ kirim id yang benar ke hook
  const { loading, roles } = useMasjidMembership(masjidOrUndef(masjidId));
  if (loading) return null;

  // ✅ redirect dengan id yang benar
  if (!roles.length) {
    return <Navigate to={`/${masjidId}/forbidden`} replace />;
  }
  if (!roles.some((r) => allow.includes(r))) {
    return <Navigate to={`/${masjidId}/forbidden`} replace />;
  }

  return <Outlet />;
}

// kecil tapi rapi
function masjidOrUndef(v?: string) {
  return v && v.length ? v : undefined;
}