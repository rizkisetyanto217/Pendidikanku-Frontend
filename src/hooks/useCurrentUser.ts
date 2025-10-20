// src/hooks/useCurrentUser.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export type CurrentUser = {
  id: string;
  email?: string;
  user_name?: string;
  memberships?: Array<{ masjid_id: string; role: string }>;
};

export function useCurrentUser() {
  return useQuery<CurrentUser | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me/simple-context");
        return res.data?.data || null;
      } catch (err: any) {
        if (err?.response?.status === 401) return null;
        console.error("[useCurrentUser] gagal ambil user:", err);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
