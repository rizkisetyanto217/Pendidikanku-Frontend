// --- di src/hooks/useActiveMasjidInfo.tsx --- //
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getActiveMasjidId,
  getActiveMasjidDisplay,
  fetchSimpleContext,
} from "@/lib/axios";

export function useActiveMasjidInfo() {
  const activeId = getActiveMasjidId();
  const display = getActiveMasjidDisplay(); // fallback instan {name, icon}

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["me", "simple-context", activeId], // ikat ke id
    queryFn: () => fetchSimpleContext(), // ⬅️ pakai cache 5 menit
    enabled: Boolean(activeId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const onMasjidChanged = () => refetch();
    const onAuth = () => refetch();
    const onLogout = () => refetch();

    window.addEventListener("masjid:changed", onMasjidChanged as any);
    window.addEventListener("auth:authorized", onAuth as any);
    window.addEventListener("auth:logout", onLogout as any);

    return () => {
      window.removeEventListener("masjid:changed", onMasjidChanged as any);
      window.removeEventListener("auth:authorized", onAuth as any);
      window.removeEventListener("auth:logout", onLogout as any);
    };
  }, [refetch]);

  const memberships = data?.memberships ?? [];
  const active = memberships.find((m) => m.masjid_id === activeId);

  const name = active?.masjid_name ?? display.name ?? null;
  const icon = active?.masjid_icon_url ?? display.icon ?? null;

  return useMemo(
    () => ({
      loading: isLoading,
      id: activeId || null,
      name,
      icon,
      roles: active?.roles ?? [],
    }),
    [isLoading, activeId, name, icon, active?.roles]
  );
}