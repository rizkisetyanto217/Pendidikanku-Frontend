// src/hooks/useCurrentUser.ts
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export type Role = "dkm" | "teacher" | "student" | string;

export type Membership = {
  masjid_id: string;
  masjid_name: string;
  masjid_slug: string;
  masjid_icon_url?: string | null;
  roles: Role[];
};

export type CurrentUser = {
  id: string;
  user_name: string;
  email: string | null; // API simple-context tidak mengirim email
  role: Role | null; // effective/global role (prioritas: dkm > teacher > student)
  masjid_admin_ids: string[]; // berasal dari memberships dengan role 'dkm'
  masjid_teacher_ids: string[]; // berasal dari memberships dengan role 'teacher'
  masjid_student_ids: string[]; // berasal dari memberships dengan role 'student'
  memberships: Membership[]; // mentahan untuk kebutuhan UI (dropdown dsb.)
};

function normalizeIds(x?: string[] | null): string[] {
  return Array.isArray(x) ? x.filter(Boolean) : [];
}

function getEffectiveMasjidId(
  u: CurrentUser | null | undefined
): string | null {
  if (!u) return null;
  const admin = normalizeIds(u.masjid_admin_ids);
  const teacher = normalizeIds(u.masjid_teacher_ids);
  const student = normalizeIds(u.masjid_student_ids);
  return admin[0] ?? teacher[0] ?? student[0] ?? null;
}

function pickEffectiveRole(memberships: Membership[]): Role | null {
  const priority: Role[] = ["dkm", "teacher", "student"];
  for (const r of priority) {
    if (memberships.some((m) => Array.isArray(m.roles) && m.roles.includes(r)))
      return r;
  }
  // fallback: role pertama yang ada
  const any = memberships.find((m) => m.roles?.length)?.roles?.[0];
  return any ?? null;
}

export function useCurrentUser() {
  const query = useQuery<CurrentUser | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("/auth/me/simple-context", {
          withCredentials: true,
        });

        const ctx = res.data?.data as
          | {
              user_id?: string;
              user_name?: string;
              memberships?: Membership[];
            }
          | undefined;

        if (!ctx?.user_id) return null;

        const memberships: Membership[] = Array.isArray(ctx.memberships)
          ? ctx.memberships
          : [];

        const masjid_admin_ids = memberships
          .filter((m) => m.roles?.includes("dkm"))
          .map((m) => m.masjid_id);

        const masjid_teacher_ids = memberships
          .filter((m) => m.roles?.includes("teacher"))
          .map((m) => m.masjid_id);

        const masjid_student_ids = memberships
          .filter((m) => m.roles?.includes("student"))
          .map((m) => m.masjid_id);

        const role = pickEffectiveRole(memberships);

        const user: CurrentUser = {
          id: ctx.user_id,
          user_name: ctx.user_name ?? "",
          email: null, // tidak tersedia di simple-context
          role,
          masjid_admin_ids,
          masjid_teacher_ids,
          masjid_student_ids,
          memberships,
        };

        return user;
      } catch (err: any) {
        if (err?.response?.status === 401) return null;
        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const masjidId = getEffectiveMasjidId(query.data);

  return {
    user: query.data,
    masjidId, // tetap kompatibel dengan kode lama
    role: query.data?.role ?? null,
    isLoggedIn: !!query.data,
    ...query, // isLoading, refetch, dll.
  };
}
