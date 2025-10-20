// src/hooks/useCurrentUser.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
export function useCurrentUser() {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            try {
                const res = await api.get("/auth/me/simple-context");
                return res.data?.data || null;
            }
            catch (err) {
                if (err?.response?.status === 401)
                    return null;
                console.error("[useCurrentUser] gagal ambil user:", err);
                return null;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}
