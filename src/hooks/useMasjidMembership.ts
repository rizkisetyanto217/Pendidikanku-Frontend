// src/hooks/useMasjidMembership.ts
import { useQuery } from "@tanstack/react-query";
import { fetchSimpleContext } from "@/lib/axios";

export type MasjidRole = "dkm" | "admin" | "teacher" | "student" | "user";

export function useMasjidMembership(masjidId?: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["me", "simple-context"], // ⬅️ SENGAJA: tidak tergantung activeId
    queryFn: () => fetchSimpleContext(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const memberships = data?.memberships ?? [];
  const membership = masjidId
    ? memberships.find((m: any) => m.masjid_id === masjidId)
    : undefined;

  return {
    loading: isLoading,
    membership,
    roles: (membership?.roles ?? []) as MasjidRole[],
  };
}