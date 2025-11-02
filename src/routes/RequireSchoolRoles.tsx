// src/routes/RequireschoolRoles.tsx
import { type ReactElement } from "react";
import { Navigate, useLocation, useParams, Outlet } from "react-router-dom";
import {
  useschoolMembership,
  type schoolRole,
} from "@/hooks/useSchoolMembership";
import { getAccessToken } from "@/lib/axios";

export default function RequireschoolRoles({
  allow,
}: {
  allow: schoolRole[];
}): ReactElement | null {
  // ✅ samakan dengan router: :school_id
  const { school_id } = useParams<{ school_id?: string }>();
  const schoolId = school_id ?? ""; // alias lokal yang stabil
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
  const { loading, roles } = useschoolMembership(schoolOrUndef(schoolId));
  if (loading) return null;

  // ✅ redirect dengan id yang benar
  if (!roles.length) {
    return <Navigate to={`/${schoolId}/forbidden`} replace />;
  }
  if (!roles.some((r) => allow.includes(r))) {
    return <Navigate to={`/${schoolId}/forbidden`} replace />;
  }

  return <Outlet />;
}

// kecil tapi rapi
function schoolOrUndef(v?: string) {
  return v && v.length ? v : undefined;
}
