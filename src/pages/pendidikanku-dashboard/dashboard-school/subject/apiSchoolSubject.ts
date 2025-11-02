// // src/pages/sekolahislamku/pages/academic/SchoolSubject.tsx
// import React, { useMemo, useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate, useParams } from "react-router-dom";

// // Theme & utils
// import { pickTheme, ThemeName } from "@/constants/thema";
// import useHtmlDarkMode from "@/hooks/useHTMLThema";
// import axios from "@/lib/axios";

// /* ================= Types ================= */
// export type SubjectStatus = "active" | "inactive";

// export type SubjectRow = {
//   id: string; // subject_id
//   code: string;
//   name: string;
//   status: SubjectStatus;
//   class_count: number;
//   total_hours_per_week: number | null;
//   assignments: ClassSubjectItem[];
// };

// export type SubjectsAPIItem = {
//   subject_id: string;
//   subject_school_id: string;
//   subject_code: string | null;
//   subject_name: string;
//   subject_desc?: string | null;
//   subject_slug?: string | null;
//   subject_image_url?: string | null;
//   subject_is_active: boolean;
//   subject_created_at: string;
//   subject_updated_at: string;
// };
// export type SubjectsAPIResp = {
//   data: SubjectsAPIItem[];
//   pagination: { limit: number; offset: number; total: number };
// };

// export type ClassSubjectItem = {
//   class_subject_id: string;
//   class_subject_school_id: string;
//   class_subject_parent_id: string;
//   class_subject_subject_id: string;
//   class_subject_slug: string;
//   class_subject_order_index: number | null;
//   class_subject_hours_per_week: number | null;
//   class_subject_min_passing_score: number | null;
//   class_subject_weight_on_report: number | null;
//   class_subject_is_core: boolean | null;
//   class_subject_subject_name_snapshot: string;
//   class_subject_subject_code_snapshot: string | null;
//   class_subject_subject_slug_snapshot: string | null;
//   class_subject_subject_url_snapshot: string | null;
//   class_subject_is_active: boolean;
//   class_subject_created_at: string;
//   class_subject_updated_at: string;
// };
// export type ClassSubjectsAPIResp = {
//   data: ClassSubjectItem[];
//   pagination: { limit: number; offset: number; total: number };
// };

// /* ================= Helpers ================= */
// const API_PREFIX = "/public"; // GET list
// const ADMIN_PREFIX = "/a"; // POST/PUT/DELETE (admin)

//  export const sumHours = (arr: ClassSubjectItem[]) => {
//   const hrs = arr
//     .map((x) => x.class_subject_hours_per_week ?? 0)
//     .filter((n) => Number.isFinite(n));
//   if (hrs.length === 0) return null;
//   return hrs.reduce((a, b) => a + b, 0);
// };

// /* ================= Reusable Mutations ================= */
// export function useCreateSubjectMutation(school_id: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async (form: FormData) => {
//       const { data } = await axios.post(
//         `${ADMIN_PREFIX}/${school_id}/subjects`,
//         form,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       return data;
//     },
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["subjects-merged", school_id] });
//     },
//   });
// }

// export function useUpdateSubjectMutation(school_id: string, subjectId: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async (form: FormData) => {
//       const { data } = await axios.patch(
//         `${ADMIN_PREFIX}/${school_id}/subjects/${subjectId}`,
//         form,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       return data;
//     },
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["subjects-merged", school_id] });
//     },
//   });
// }

// export function useDeleteSubjectMutation(school_id: string, subjectId: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async () => {
//       const { data } = await axios.delete(
//         `${ADMIN_PREFIX}/${school_id}/subjects/${subjectId}`
//       );
//       return data;
//     },
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["subjects-merged", school_id] });
//     },
//   });
// }
