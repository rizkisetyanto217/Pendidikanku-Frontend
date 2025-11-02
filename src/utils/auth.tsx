// utils/auth.ts
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  school_admin_ids?: string[];
}

export function getschoolIdFromSession(): string | null {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.school_admin_ids?.[0] ?? null;
  } catch (err) {
    return null;
  }
}
