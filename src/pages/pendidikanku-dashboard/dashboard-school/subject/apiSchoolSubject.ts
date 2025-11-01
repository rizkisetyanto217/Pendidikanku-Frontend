// src/pages/sekolahislamku/pages/academic/apiSchoolSubject.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import axios from "@/lib/axios";
import type { AxiosError } from "axios";
/* ========= Types ========= */
export type SubjectStatus = "active" | "inactive";

export type ClassSubjectItem = {
  class_subject_id: string;
  class_subject_masjid_id: string;
  class_subject_parent_id: string;
  class_subject_subject_id: string;
  class_subject_slug: string;
  class_subject_order_index: number | null;
  class_subject_hours_per_week: number | null;
  class_subject_min_passing_score: number | null;
  class_subject_weight_on_report: number | null;
  class_subject_is_core: boolean | null;
  class_subject_subject_name_snapshot: string;
  class_subject_subject_code_snapshot: string | null;
  class_subject_subject_slug_snapshot: string | null;
  class_subject_subject_url_snapshot: string | null;
  class_subject_is_active: boolean;
  class_subject_created_at: string;
  class_subject_updated_at: string;
};

export type SubjectRow = {
  id: string;
  code: string;
  name: string;
  status: SubjectStatus;
  class_count: number;
  total_hours_per_week: number | null;
  assignments: ClassSubjectItem[];
};

export type SubjectsAPIItem = {
  subject_id: string;
  subject_masjid_id: string;
  subject_code: string | null;
  subject_name: string;
  subject_desc?: string | null;
  subject_slug?: string | null;
  subject_image_url?: string | null;
  subject_is_active: boolean;
  subject_created_at: string;
  subject_updated_at: string;
};
export type SubjectsAPIResp = {
  data: SubjectsAPIItem[];
  pagination: { limit: number; offset: number; total: number };
};

export type ClassSubjectsAPIResp = {
  data: ClassSubjectItem[];
  pagination: { limit: number; offset: number; total: number };
};

export const sumHours = (arr: ClassSubjectItem[]) => {
  const hrs = arr
    .map((x) => x.class_subject_hours_per_week ?? 0)
    .filter((n) => Number.isFinite(n));
  if (hrs.length === 0) return null;
  return hrs.reduce((a, b) => a + b, 0);
};

/* ========= Keys ========= */
export const subjectKeys = {
  merged: (masjidId: string) => ["subjects-merged", masjidId] as const,
};

/* ========= Fetchers ========= */
async function fetchSubjects(masjidId: string, limit = 500, offset = 0) {
  const { data } = await axios.get<SubjectsAPIResp>(
    `${API_PREFIX}/${masjidId}/subjects/list`,
    { params: { limit, offset } }
  );
  return data;
}
async function fetchClassSubjects(masjidId: string, limit = 1000, offset = 0) {
  const { data } = await axios.get<ClassSubjectsAPIResp>(
    `${API_PREFIX}/${masjidId}/class-subjects/list`,
    { params: { limit, offset } }
  );
  return data;
}

/* ========= Query (gabungan) ========= */
export function useSubjectsMergedQuery(
  masjidId?: string,
  options?: Omit<
    UseQueryOptions<
      SubjectRow[],
      AxiosError,
      SubjectRow[],
      ReturnType<typeof subjectKeys.merged>
    >,
    "queryKey" | "queryFn"
  >
) {
  const key = subjectKeys.merged(masjidId ?? "__NO_ID__");
  return useQuery<SubjectRow[], AxiosError, SubjectRow[], typeof key>({
    queryKey: key,
    enabled: !!masjidId,
    queryFn: async () => {
      const [subjectsResp, classSubjectsResp] = await Promise.all([
        fetchSubjects(masjidId!),
        fetchClassSubjects(masjidId!),
      ]);

      const classBySubject = new Map<string, ClassSubjectItem[]>();
      for (const cs of classSubjectsResp.data) {
        const k = cs.class_subject_subject_id;
        if (!classBySubject.has(k)) classBySubject.set(k, []);
        classBySubject.get(k)!.push(cs);
      }

      return subjectsResp.data.map<SubjectRow>((s) => {
        const assignments = classBySubject.get(s.subject_id) ?? [];
        return {
          id: s.subject_id,
          code: s.subject_code ?? "",
          name: s.subject_name,
          status: s.subject_is_active ? "active" : "inactive",
          class_count: assignments.length,
          total_hours_per_week: sumHours(assignments),
          assignments,
        };
      });
    },
    ...options,
  });
}

/* ========= Mutations ========= */
export function useCreateSubjectMutation(masjidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: FormData) => {
      const { data } = await axios.post(
        `${ADMIN_PREFIX}/${masjidId}/subjects`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: subjectKeys.merged(masjidId) }),
  });
}
export function useUpdateSubjectMutation(masjidId: string, subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: FormData) => {
      const { data } = await axios.patch(
        `${ADMIN_PREFIX}/${masjidId}/subjects/${subjectId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: subjectKeys.merged(masjidId) }),
  });
}
export function useDeleteSubjectMutation(masjidId: string, subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `${ADMIN_PREFIX}/${masjidId}/subjects/${subjectId}`
      );
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: subjectKeys.merged(masjidId) }),
  });
}
