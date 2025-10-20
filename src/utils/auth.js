// utils/auth.ts
import { jwtDecode } from "jwt-decode";
export function getMasjidIdFromSession() {
    try {
        const token = sessionStorage.getItem("token");
        if (!token)
            return null;
        const decoded = jwtDecode(token);
        return decoded.masjid_admin_ids?.[0] ?? null;
    }
    catch (err) {
        return null;
    }
}
