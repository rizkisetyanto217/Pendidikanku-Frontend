// src/pages/pendidikanku-dashboard/dashboard-school/class/SchoolLevelDetail.tsx
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Layers, Loader2 } from "lucide-react";
import axios from "@/lib/axios";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

type ApiLevelDetail = {
  class_parent_id: string;
  class_parent_school_id: string;
  class_parent_name: string;
  class_parent_code?: string | null;
  class_parent_slug: string;
  class_parent_description?: string | null;
  class_parent_level?: number | null;
  class_parent_is_active: boolean;
  class_parent_total_classes?: number | null;
  class_parent_image_url?: string | null;
  class_parent_created_at: string;
  class_parent_updated_at: string;
};

async function fetchLevelDetail(schoolId: string, id: string) {
  const res = await axios.get<{ data: ApiLevelDetail[] }>(
    `/public/${schoolId}/class-parents/list`,
    { params: { id } }
  );
  return res.data.data?.[0];
}

export default function SchoolParent() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const { schoolId, levelId } = useParams<{
    schoolId: string;
    levelId: string;
  }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["level-detail", schoolId, levelId],
    enabled: !!schoolId && !!levelId,
    queryFn: () => fetchLevelDetail(schoolId!, levelId!),
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
            <Layers size={20} /> Detail Tingkat
          </h1>
        </div>

        <SectionCard palette={palette}>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-sm opacity-70">
              <Loader2 size={18} className="animate-spin" /> Memuat data...
            </div>
          ) : isError || !data ? (
            <div className="py-10 text-center text-sm text-red-500">
              Gagal memuat data tingkat.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 p-5">
              <div>
                <div className="text-sm opacity-70">Nama Tingkat</div>
                <div className="font-semibold">{data.class_parent_name}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Slug</div>
                <div>{data.class_parent_slug}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Kode</div>
                <div>{data.class_parent_code ?? "-"}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Level (angka)</div>
                <div>{data.class_parent_level ?? "-"}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Status</div>
                <div>{data.class_parent_is_active ? "Aktif" : "Nonaktif"}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Total Kelas</div>
                <div>{data.class_parent_total_classes ?? 0}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-sm opacity-70">Deskripsi</div>
                <div>
                  {data.class_parent_description?.trim() ||
                    "(tidak ada deskripsi)"}
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
