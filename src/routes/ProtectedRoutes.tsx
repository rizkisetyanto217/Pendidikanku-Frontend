import React from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import Cookies from "js-cookie";

/**
 * 🔒 ProtectedRoute — Guard berbasis cookie
 *
 * 1. Cek token dari cookie ("access_token")
 * 2. Pastikan route hanya bisa diakses jika token valid
 * 3. Jika ada parameter `id`, validasi supaya hanya ObjectId atau UUID
 *    → misalnya: /masjid/66f6b2acbdbcc63d84e9a112/sekolah ✅
 *    → tapi /masjid-ar-raudhah/sekolah 🚫 akan dianggap NotFound
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const params = useParams();
  const accessToken = Cookies.get("access_token");

  // 🔎 Ambil ID dari parameter jika ada
  const { id } = params;

  // ✅ Validasi format ID (24 hex char atau UUID v4)
  const isValidId =
    !id ||
    /^[a-f0-9]{24}$/i.test(id) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id
    );

  // 🧩 Debug log
  console.log("[ProtectedRoute]", {
    accessToken,
    id,
    isValidId,
    pathname: location.pathname,
  });

  // 🚫 Tidak ada token → redirect ke login
  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🚫 Ada token tapi ID route tidak valid (misalnya slug teks biasa)
  if (!isValidId) {
    return <Navigate to="/not-found" replace />;
  }

  // ✅ Jika semua valid → lanjut render child routes
  return <Outlet />;
}
