import React from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import Cookies from "js-cookie";

/**
 * 🔒 ProtectedRoute — Guard berbasis cookie dan validasi masjidId
 *
 * 1. Mengecek token dari cookie ("access_token")
 * 2. Mengecek format masjidId (harus UUID atau ObjectId)
 * 3. Jika valid → render nested route lewat <Outlet />
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const { masjidId } = useParams(); // ✅ gunakan nama param yang sesuai
  const accessToken = Cookies.get("access_token");

  // ✅ Validasi masjidId (24 hex char atau UUID v4)
  const isValidMasjidId =
    !masjidId ||
    /^[a-f0-9]{24}$/i.test(masjidId) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      masjidId
    );

  // 🧩 Debug log
  console.log("[ProtectedRoute]", {
    accessToken,
    masjidId,
    isValidMasjidId,
    pathname: location.pathname,
  });

  // 🚫 Tidak ada token → redirect ke login
  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🚫 ID masjid tidak valid
  if (!isValidMasjidId) {
    return <Navigate to="/not-found" replace />;
  }

  // ✅ Semua OK → render nested routes (guru/murid/sekolah)
  return <Outlet />;
}
