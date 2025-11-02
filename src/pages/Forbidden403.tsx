// src/pages/common/Forbidden403.tsx
import { Link, useParams } from "react-router-dom";

export default function Forbidden403() {
  const { schoolId } = useParams();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">403 — Akses Ditolak</h1>
      <p>Kamu tidak memiliki izin untuk membuka halaman ini.</p>
      <div className="flex gap-3">
        <Link className="btn" to={`/${schoolId}/sekolah`}>
          Kembali ke Dashboard
        </Link>
        <Link className="btn btn-outline" to="/login">
          Ganti Akun
        </Link>
      </div>
    </div>
  );
}
