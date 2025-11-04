// src/pages/pendidikanku-dashboard/dashboard-school/class/SchoolClassDetail.tsx
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Layers, Loader2, BookOpen } from "lucide-react";
import axios from "@/lib/axios";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

type ApiClassDetail = {
  class_id: string;
  class_school_id: string;
  class_parent_id: string;
  class_slug: string;
  class_name: string;
  class_status: "active" | "inactive";
  class_parent_name_snapshot?: string | null;
  class_parent_slug_snapshot?: string | null;
  class_parent_level_snapshot?: number | null;
  class_term_name_snapshot?: string | null;
  class_term_academic_year_snapshot?: string | null;
  class_term_angkatan_snapshot?: string | null;
  class_created_at: string;
  class_updated_at: string;
};

async function fetchClassDetail(schoolId: string, id: string) {
  const res = await axios.get<{ data: ApiClassDetail[] }>(
    `/public/${schoolId}/classes/list`,
    { params: { id } }
  );
  return res.data.data?.[0];
}

export default function SchoolClasses() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const { schoolId, classId } = useParams<{
    schoolId: string;
    classId: string;
  }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["class-detail", schoolId, classId],
    enabled: !!schoolId && !!classId,
    queryFn: () => fetchClassDetail(schoolId!, classId!),
  });

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <div className="max-w-screen-md mx-auto">
        <div className="flex items-center mb-6">
          <Btn
            palette={palette}
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft size={20} />
          </Btn>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen size={20} /> Detail Kelas
          </h1>
        </div>

        <SectionCard palette={palette}>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-sm opacity-70">
              <Loader2 size={18} className="animate-spin" /> Memuat data...
            </div>
          ) : isError || !data ? (
            <div className="py-10 text-center text-sm text-red-500">
              Gagal memuat data kelas.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 p-5">
              <div>
                <div className="text-sm opacity-70">Nama Kelas</div>
                <div className="font-semibold">{data.class_name}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Slug</div>
                <div>{data.class_slug}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Status</div>
                <div>
                  {data.class_status === "active" ? "Aktif" : "Nonaktif"}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-70">Tingkat</div>
                <div>{data.class_parent_name_snapshot ?? "-"}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Level</div>
                <div>{data.class_parent_level_snapshot ?? "-"}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Angkatan / Tahun Ajar</div>
                <div>
                  {data.class_term_angkatan_snapshot ??
                    data.class_term_academic_year_snapshot ??
                    "-"}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-sm opacity-70">Tanggal Dibuat</div>
                <div>
                  {new Date(data.class_created_at).toLocaleDateString("id-ID")}
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
