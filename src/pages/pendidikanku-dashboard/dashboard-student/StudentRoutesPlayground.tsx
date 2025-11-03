// src/pages/pendidikanku-dashboard/dashboard-student/StudentRoutesPlayground.tsx
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";
import {
  SectionCard,
  Btn,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import { Layers, ChevronRight } from "lucide-react";

/* Prefix rute yang termasuk “tenant scope” */
const TENANT_PREFIXES = [
  "/guru",
  "/sekolah",
  "/menu-utama",
  "/wali",
  "/siswa",
  "/murid",
  "/admin",
];

/* Klik <a> → inject /:sid jika perlu */
function TenantClickRewriter({
  sid,
  children,
}: {
  sid: string;
  children: React.ReactNode;
}) {
  const nav = useNavigate();

  const ensureTenant = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    if (p.startsWith(`/${sid}/`) || p === `/${sid}`) return p;
    const isTenantScope = TENANT_PREFIXES.some((pref) => p.startsWith(pref));
    return isTenantScope ? `/${sid}${p}` : p;
  };

  return (
    <div
      onClick={(e) => {
        const a = (e.target as HTMLElement).closest(
          "a"
        ) as HTMLAnchorElement | null;
        if (!a) return;

        const hrefAttr = a.getAttribute("href") || "";
        if (
          !hrefAttr ||
          hrefAttr.startsWith("http") ||
          hrefAttr.startsWith("mailto:") ||
          hrefAttr.startsWith("#")
        ) {
          return;
        }

        const url = new URL(hrefAttr, window.location.origin);
        const needsTenant =
          !url.pathname.startsWith(`/${sid}/`) &&
          TENANT_PREFIXES.some((p) => url.pathname.startsWith(p));

        if (needsTenant) {
          e.preventDefault();
          const next = ensureTenant(`${url.pathname}${url.search}${url.hash}`);
          nav(next);
        }
      }}
    >
      {children}
    </div>
  );
}

export default function StudentRoutesPlayground() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  // Ambil :schoolId / :school_id atau query ?school_id=..., fallback demo
  const { schoolId: p1, school_id: p2 } = useParams<{
    schoolId?: string;
    school_id?: string;
  }>();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const sid = p1 || p2 || sp.get("school_id") || "demo-school";

  // Helper prefix
  const ensureTenant = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    if (p.startsWith(`/${sid}/`) || p === `/${sid}`) return p;
    const isTenantScope = TENANT_PREFIXES.some((pref) => p.startsWith(pref));
    return isTenantScope ? `/${sid}${p}` : p;
  };

  // Link aman (auto prefix)
  const TenantLink = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => <Link to={ensureTenant(to)}>{children}</Link>;

  // Contoh ID untuk rute dinamis
  const sampleScheduleId = "sch-001";
  const sampleClassId = "class-001";

  const base = ensureTenant("/murid");

  const groups: {
    title: string;
    links: { to: string; label: string; note?: string }[];
  }[] = [
    {
      title: "Dashboard Utama",
      links: [{ to: `${base}`, label: "Dashboard Murid (index)" }],
    },
    {
      title: "Progress Akademik",
      links: [
        { to: `${base}/progress`, label: "Progress Detail" },
        { to: `${base}/progress/raport`, label: "Raport" },
        { to: `${base}/progress/absensi`, label: "Absensi" },
        {
          to: `${base}/progress/catatan-hasil`,
          label: "Catatan Hasil Belajar",
        },
      ],
    },
    {
      title: "Jadwal",
      links: [
        { to: `${base}/jadwal`, label: "Semua Jadwal" },
        {
          to: `${base}/semua-jadwal/${sampleScheduleId}`,
          label: "Detail Jadwal (dynamic)",
          note: `:id=${sampleScheduleId}`,
        },
        { to: `${base}/jadwal`, label: "Jadwal (tab Kelas Saya)" },
      ],
    },
    {
      title: "Profil",
      links: [{ to: `${base}/profil-murid`, label: "Profil Murid" }],
    },
    {
      title: "Tugas",
      links: [{ to: `${base}/tugas`, label: "Daftar Tugas" }],
    },
    {
      title: "Keuangan",
      links: [
        { to: `${base}/keuangan`, label: "Ringkasan Keuangan" },
        { to: `${base}/keuangan-list`, label: "Daftar Tagihan" },
      ],
    },
    {
      title: "Menu Utama (Kelas Saya)",
      links: [
        { to: `${base}/menu-utama`, label: "Menu Grid (index)" },
        { to: `${base}/menu-utama/kelas-saya`, label: "Kelas Saya" },
        { to: `${base}/menu-utama/keuangan`, label: "Keuangan (ringkas)" },
        { to: `${base}/menu-utama/jadwal`, label: "Jadwal (tab)" },
        {
          to: `${base}/menu-utama/kelas-saya/${sampleClassId}/materi`,
          label: "Detail Kelas • Materi (dynamic)",
          note: `:id=${sampleClassId}`,
        },
        {
          to: `${base}/menu-utama/kelas-saya/${sampleClassId}/tugas`,
          label: "Detail Kelas • Tugas (dynamic)",
          note: `:id=${sampleClassId}`,
        },
        {
          to: `${base}/menu-utama/kelas-saya/${sampleClassId}/quiz`,
          label: "Detail Kelas • Quiz (dynamic)",
          note: `:id=${sampleClassId}`,
        },
        {
          to: `${base}/menu-utama/kelas-saya/${sampleClassId}/kehadiran`,
          label: "Detail Kelas • Kehadiran (dynamic)",
          note: `:id=${sampleClassId}`,
        },
        { to: `${base}/menu-utama/profil-murid`, label: "Profil dari Menu" },
      ],
    },
  ];

  return (
    <div style={{ background: palette.white2, color: palette.black1 }}>
      <div className="max-w-screen-xl mx-auto p-4 md:p-6 space-y-4">
        <SectionCard palette={palette} className="p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <Layers size={18} color={palette.quaternary} />
              <div>
                <h1 className="text-xl font-semibold">Playground Rute Murid</h1>
                <p className="text-sm mt-1" style={{ color: palette.black2 }}>
                  Base tenant: <code>/{sid}</code> • Semua link di bawah
                  otomatis diprefix tenant.
                </p>
              </div>
            </div>
            <TenantLink to={base}>
              <Btn palette={palette} size="sm" variant="secondary">
                Ke Dashboard Murid
              </Btn>
            </TenantLink>
          </div>
        </SectionCard>

        <TenantClickRewriter sid={sid}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groups.map((g) => (
              <SectionCard key={g.title} palette={palette} className="p-4">
                <h2 className="font-medium mb-3">{g.title}</h2>
                <ul className="space-y-2">
                  {g.links.map((l) => (
                    <li
                      key={l.to}
                      className="flex items-center justify-between"
                    >
                      <TenantLink to={l.to}>
                        <span className="underline underline-offset-2 hover:opacity-80 truncate">
                          {l.label}
                        </span>
                      </TenantLink>
                      {l.note ? (
                        <span
                          className="ml-3 text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: palette.white1,
                            border: `1px solid ${palette.silver1}`,
                            color: palette.black2,
                          }}
                          title={l.note}
                        >
                          {l.note}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </SectionCard>
            ))}
          </div>
        </TenantClickRewriter>
      </div>
    </div>
  );
}
