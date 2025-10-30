// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { getAccessToken } from "@/lib/axios";

// helper: parse masjidId dari params atau fallback dari pathname segmen-1
function useMasjidId() {
  const params = useParams();
  const fromParams =
    (params as any).masjidId ??
    (params as any).masjid_id ??
    (params as any).tenantId ??
    (params as any).mosqueId;

  if (fromParams) return String(fromParams);

  // fallback: /:id/xxx → ambil segmen pertama
  const first = location.pathname.split("/").filter(Boolean)[0];
  return first || undefined;
}

export default function ProtectedRoute() {
  const location = useLocation();
  const masjidId = useMasjidId();
  const accessToken = getAccessToken(); // in-memory

  // UUID v4 regex
  const uuidV4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // ⚠️ Kebijakan validasi:
  // - Jika route TIDAK punya param masjid → jangan blokir (biarkan lewat).
  // - Jika ADA param masjid → boleh UUID v4 ATAU slug (jangan paksa 404 di guard).
  const hasMasjidParam = typeof masjidId === "string" && masjidId.length > 0;
  const isUuid = hasMasjidParam ? uuidV4.test(masjidId!) : true;

  // Debug bila perlu
  // console.log("[ProtectedRoute]", { accessToken, masjidId, hasMasjidParam, isUuid, path: location.pathname });

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Kalau param ada tapi jelas-jelas bukan UUID/slug yang kamu kenal (mis input aneh),
  // barulah arahkan ke not-found. Jika kamu juga mendukung slug, guard TIDAK perlu menolak di sini.
  if (hasMasjidParam && masjidId!.length < 6 && !isUuid) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
}
