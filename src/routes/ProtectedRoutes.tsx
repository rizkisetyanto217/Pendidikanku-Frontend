import React from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { getAccessToken } from "@/lib/axios"; // 👈 pakai ini, bukan js-cookie

export default function ProtectedRoute() {
  const location = useLocation();
  const { masjidId } = useParams();

  // Ambil token dari in-memory store
  const accessToken = getAccessToken();

  // Validasi masjidId (UUID v4). Kalau route ini memang butuh param, jangan terima undefined.
  const isValidMasjidId =
    typeof masjidId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      masjidId
    );

  // Debug (opsional)
  // console.log("[ProtectedRoute]", { accessToken, masjidId, isValidMasjidId, pathname: location.pathname });

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isValidMasjidId) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
}
