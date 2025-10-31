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
  const { masjidId } = useParams();
  const loc = useLocation();
  const access = getAccessToken();

  if (!access) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  const { loading, roles } = useMasjidMembership(masidOrUndef(masjidId));
  if (loading) return null;

  if (!roles.length) {
    return <Navigate to={`/${masjidId}/forbidden`} replace />;
  }
  if (!roles.some((r) => allow.includes(r))) {
    return <Navigate to={`/${masjidId}/forbidden`} replace />;
  }

  // render nested routes
  return <Outlet />;
}

function masidOrUndef(v?: string) {
  return v && v.length ? v : undefined;
}