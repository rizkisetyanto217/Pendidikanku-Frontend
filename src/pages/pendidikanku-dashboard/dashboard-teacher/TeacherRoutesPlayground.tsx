// src/pages/pendidikanku-dashboard/dashboard-teacher/TeacherRoutesPlayground.tsx
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";
import {
  SectionCard,
  Btn,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import { Layers, ChevronRight } from "lucide-react";

/* Prefix rute yang termasuk “tenant scope” (tanpa slash depan utk cek segmen) */
const TENANT_SEGMENTS = new Set([
  "guru",
  "sekolah",
  "menu-utama",
  "wali",
  "siswa",
  "admin",
]);

/** Sisipkan /:sid jika path menuju tenant scope tetapi belum ada sid.
 *  Menjaga basename (contoh: /app) kalau deployment memakai subpath.
 */
function ensureTenantInPath(path: string, sid: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const segs = p.replace(/^\/+/, "").split("/"); // ["app","guru","..."] atau ["guru","..."]

  if (segs.length === 0) return `/${sid}`;
  // Sudah ada sid?
  if (segs[0] === sid) return p;

  // CASE A: tanpa basename, seg0 adalah tenant segment (guru/sekolah/...)
  if (TENANT_SEGMENTS.has(segs[0])) {
    return `/${sid}/${segs.join("/")}`;
  }

  // CASE B: dengan basename, cek seg1
  if (segs.length >= 2 && TENANT_SEGMENTS.has(segs[1])) {
    const base = segs[0];
    const rest = segs.slice(1).join("/"); // "guru/..."
    return `/${base}/${sid}/${rest}`;
  }

  // Bukan tenant scope → biarkan apa adanya
  return p;
}

/** Komponen wrapper: intercept klik <a> internal dan injeksi /:sid untuk tenant scope */
function TenantClickRewriter({
  sid,
  children,
}: {
  sid: string;
  children: React.ReactNode;
}) {
  const nav = useNavigate();

  return (
    <div
      onClick={(e) => {
        const a = (e.target as HTMLElement).closest(
          "a"
        ) as HTMLAnchorElement | null;
        if (!a) return;

        const hrefAttr = a.getAttribute("href") || "";
        if (!hrefAttr) return;

        // Abaikan link eksternal / anchor spesial
        const isExternal =
          /^https?:\/\//i.test(hrefAttr) ||
          hrefAttr.startsWith("mailto:") ||
          hrefAttr.startsWith("tel:");
        if (isExternal || hrefAttr === "#" || hrefAttr.startsWith("#")) return;

        // Dapatkan bagian path/search/hash dari anchor DOM (stabil di browser & tak butuh window.origin)
        const path = a.pathname || "/";
        const nextPath = ensureTenantInPath(path, sid);
        const finalUrl = `${nextPath}${a.search || ""}${a.hash || ""}`;

        // Jika berubah, tahan default dan navigate
        if (finalUrl !== `${path}${a.search || ""}${a.hash || ""}`) {
          e.preventDefault();
          nav(finalUrl);
        }
      }}
    >
      {children}
    </div>
  );
}

export default function TeacherRoutesPlayground() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  // Ambil :schoolId atau :school_id; fallback ke query `school_id` atau default demo
  const { schoolId: p1, school_id: p2 } = useParams<{
    schoolId?: string;
    school_id?: string;
  }>();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const sid = p1 || p2 || sp.get("school_id") || "demo-school";

  // Helper Link yang aman
  const TenantLink = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => {
    const safe = ensureTenantInPath(to, sid);
    return <Link to={safe}>{children}</Link>;
  };

  // Demo IDs
  const demo = {
    classId: "cls-10a-2025",
    scheduleId: "sch-001",
    materialId: "mat-001",
    studentId: "stu-10a-001",
  };

  const base = ensureTenantInPath("/guru", sid);

  const groups: { title: string; links: { label: string; to: string }[] }[] = [
    {
      title: "Dashboard",
      links: [{ label: "Dashboard Guru (index)", to: `${base}` }],
    },
    {
      title: "Kehadiran",
      links: [
        { label: "Kehadiran (index)", to: `${base}/kehadiran` },
        { label: "Kehadiran • Detail", to: `${base}/kehadiran/detail` },
        {
          label: "Kelas • Absensi (pakai :id)",
          to: `${base}/kelas/${demo.classId}/absensi`,
        },
      ],
    },
    {
      title: "Profil & Penilaian",
      links: [
        { label: "Profil Guru", to: `${base}/profil-guru` },
        { label: "Penilaian (index)", to: `${base}/penilaian` },
        { label: "Penilaian • Detail", to: `${base}/penilaian/detail` },
      ],
    },
    {
      title: "Jadwal",
      links: [
        { label: "Jadwal (index)", to: `${base}/jadwal` },
        { label: "Schedule 3 Hari (index)", to: `${base}/schedule-3-hari` },
        {
          label: "Schedule 3 Hari • Detail (:scheduleId)",
          to: `${base}/schedule-3-hari/${demo.scheduleId}`,
        },
        { label: "Schedule 7 Hari (index)", to: `${base}/schedule-seven-days` },
        {
          label: "Schedule 7 Hari • Detail (:scheduleId)",
          to: `${base}/schedule-seven-days/${demo.scheduleId}`,
        },
      ],
    },
    {
      title: "Kelas",
      links: [
        { label: "Kelas (index)", to: `${base}/kelas` },
        { label: "Kelas • Detail (:id)", to: `${base}/kelas/${demo.classId}` },
        {
          label: "Kelas • Materi (index)",
          to: `${base}/kelas/${demo.classId}/materi`,
        },
        {
          label: "Kelas • Materi • Detail (:materialId)",
          to: `${base}/kelas/${demo.classId}/material/${demo.materialId}`,
        },
        { label: "Kelas • Tugas", to: `${base}/kelas/${demo.classId}/tugas` },
        {
          label: "Kelas • Student • Score",
          to: `${base}/kelas/${demo.classId}/student/${demo.studentId}/score`,
        },
      ],
    },
    {
      title: "Tugas & Manajemen",
      links: [
        { label: "Tugas (index)", to: `${base}/tugas` },
        { label: "Tugas • Detail Student", to: `${base}/tugas/detail` },
        { label: "Kelas • Detail • Score", to: `${base}/kelas/detail/score` },
        { label: "Kelas • Homeroom", to: `${base}/kelas/homeroom` },
        {
          label: "Kelola Kelas (:name)",
          to: `${base}/kelola-kelas/kelas-demo`,
        },
        { label: "Quiz Class • Detail", to: `${base}/quizClass/detail` },
      ],
    },
    {
      title: "Menu Utama Guru",
      links: [
        { label: "Menu Utama (index)", to: `${base}/menu-utama` },
        { label: "Menu • Kelas (index)", to: `${base}/menu-utama/kelas` },
        {
          label: "Menu • Kelas • Detail (:id)",
          to: `${base}/menu-utama/kelas/${demo.classId}`,
        },
        {
          label: "Menu • Guru Mapel (index)",
          to: `${base}/menu-utama/guru-mapel`,
        },
        { label: "Menu • Jadwal", to: `${base}/menu-utama/jadwal` },
        { label: "Menu • Profil Guru", to: `${base}/menu-utama/profil-guru` },
        { label: "Menu • Pengaturan", to: `${base}/menu-utama/pengaturan` },
        { label: "Menu • Tugas", to: `${base}/menu-utama/tugas` },
      ],
    },
    {
      title: "Guru Mapel",
      links: [{ label: "Guru Mapel (index)", to: `${base}/guru-mapel` }],
    },
  ];

  return (
    <div style={{ background: palette.white2, color: palette.black1 }}>
      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">
        <SectionCard palette={palette}>
          <div className="p-5 flex items-center gap-3">
            <Layers size={18} color={palette.quaternary} />
            <div>
              <div className="font-semibold">Playground Rute Guru</div>
              <div className="text-sm" style={{ color: palette.black2 }}>
                Base tenant: <code>/{sid}</code> • Semua link memakai prefix
                tenant otomatis.
              </div>
            </div>
          </div>
        </SectionCard>

        <TenantClickRewriter sid={sid}>
          {groups.map((g) => (
            <SectionCard key={g.title} palette={palette}>
              <div className="p-5 space-y-3">
                <div className="font-semibold">{g.title}</div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {g.links.map((lk) => (
                    <TenantLink key={lk.to} to={lk.to}>
                      <div
                        className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:opacity-90 transition"
                        style={{
                          borderColor: palette.silver1,
                          background: palette.white1,
                          color: palette.black1,
                        }}
                      >
                        <span className="truncate">{lk.label}</span>
                        <ChevronRight size={16} />
                      </div>
                    </TenantLink>
                  ))}
                </div>
              </div>
            </SectionCard>
          ))}

          <SectionCard palette={palette}>
            <div className="p-5 flex items-center justify-between">
              <div className="text-sm" style={{ color: palette.black2 }}>
                Base: <code>/{sid}/guru</code> • Demo: classId=
                <code>{demo.classId}</code>, scheduleId=
                <code>{demo.scheduleId}</code>
              </div>
              <TenantLink to={base}>
                <Btn palette={palette} variant="outline" size="sm">
                  Ke Dashboard Guru
                </Btn>
              </TenantLink>
            </div>
          </SectionCard>
        </TenantClickRewriter>
      </div>
    </div>
  );
}
