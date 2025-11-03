// src/pages/pendidikanku-dashboard/dashboard-school/SchoolRoutesPlayground.tsx
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import { Layers, ChevronRight } from "lucide-react";
import api, { getActiveschoolId, setActiveschoolContext } from "@/lib/axios";

/* Prefix rute yang termasuk “tenant scope” */
const TENANT_PREFIXES = [
  "/guru",
  "/sekolah",
  "/menu-utama",
  "/wali",
  "/siswa",
  "/admin",
];

/* Rewriter klik <a> → inject /:sid untuk path tenant yang lupa diprefix */
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

export default function SchoolRoutesPlayground() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  // tenant id dari URL atau query
  const { schoolId: schoolIdParam } = useParams<{ schoolId: string }>();
  const { search } = useLocation();
  const sp = useMemo(() => new URLSearchParams(search), [search]);
  const sid =
    schoolIdParam ||
    sp.get("school_id") ||
    sp.get("masjid_id") ||
    "demo-school";

  // ⛳️ SINKRONKAN COOKIE TENANT DENGAN :sid DI URL
  useEffect(() => {
    const current = getActiveschoolId();
    if (sid && current !== sid) {
      // Ini yang bikin 403 kalau tidak sama
      setActiveschoolContext(sid);
    }
  }, [sid]);

  // helper prefix
  const ensureTenant = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    if (p.startsWith(`/${sid}/`) || p === `/${sid}`) return p;
    const isTenantScope = TENANT_PREFIXES.some((pref) => p.startsWith(pref));
    return isTenantScope ? `/${sid}${p}` : p;
  };

  // Link yang aman (auto prefix)
  function TenantLink({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) {
    return <Link to={ensureTenant(to)}>{children}</Link>;
  }

  const baseSekolah = ensureTenant("/sekolah");
  const baseGuru = ensureTenant("/guru");

  const demo = {
    scheduleId: "sch-001",
    billId: "bill-001",
    teacherId: "tch-001",
    classId: "cls-10a-2025",
    studentId: "stu-10a-001",
    roomId: "room-01",
    bookId: "book-001",
  };

  // mini axios check
  const [ctxLoading, setCtxLoading] = useState(false);
  const [ctxError, setCtxError] = useState<string | null>(null);
  const [ctxInfo, setCtxInfo] = useState<{
    user_name?: string;
    email?: string;
    memberships?: { school_id: string; roles?: string[] }[];
  } | null>(null);

  const checkContext = async () => {
    setCtxLoading(true);
    setCtxError(null);
    setCtxInfo(null);
    try {
      // penting: path scoped + cookie sudah diset lewat setActiveschoolContext(sid)
      const res = await api.get(ensureTenant("/auth/me/simple-context"), {
        withCredentials: true,
      });
      const raw = res?.data?.data ?? res?.data ?? {};
      setCtxInfo({
        user_name: raw?.user_name ?? raw?.name,
        email: raw?.email,
        memberships: raw?.memberships ?? [],
      });
    } catch (e: any) {
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Gagal memuat simple-context";
      setCtxError(status ? `${status} • ${msg}` : msg);
    } finally {
      setCtxLoading(false);
    }
  };

  const groups: { title: string; links: { label: string; to: string }[] }[] = [
    {
      title: "Dashboard",
      links: [{ label: "Dashboard Sekolah (index)", to: baseSekolah }],
    },
    {
      title: "Murid",
      links: [{ label: "Murid (coming soon)", to: `${baseSekolah}/murid` }],
    },
    {
      title: "Jadwal",
      links: [
        { label: "Jadwal (all)", to: `${baseSekolah}/jadwal` },
        {
          label: "Jadwal • Detail (:scheduleId)",
          to: `${baseSekolah}/jadwal/detail/${demo.scheduleId}`,
        },
      ],
    },
    {
      title: "Profil & Keuangan",
      links: [
        { label: "Profil Sekolah", to: `${baseSekolah}/profil-sekolah` },
        { label: "Keuangan (overview)", to: `${baseSekolah}/keuangan` },
        {
          label: "Keuangan • Detail Tagihan (:id)",
          to: `${baseSekolah}/keuangan/detail/${demo.billId}`,
        },
      ],
    },
    {
      title: "Guru",
      links: [
        { label: "Guru (index)", to: `${baseSekolah}/guru` },
        {
          label: "Guru • Detail (:id)",
          to: `${baseSekolah}/guru/${demo.teacherId}`,
        },
        {
          label: "Kehadiran Guru (/:sid/guru/kehadiran)",
          to: `${baseGuru}/kehadiran`,
        },
        {
          label: "Menu Utama • Tugas (/:sid/guru/menu-utama/tugas)",
          to: `${baseGuru}/menu-utama/tugas`,
        },
      ],
    },
    {
      title: "Akademik",
      links: [
        { label: "Akademik (index)", to: `${baseSekolah}/akademik` },
        { label: "Akademik • Detail", to: `${baseSekolah}/akademik/detail` },
        { label: "Akademik • Kelola", to: `${baseSekolah}/akademik/kelola` },
      ],
    },
    {
      title: "Pengumuman & Kehadiran (coming soon)",
      links: [
        { label: "Semua Pengumuman", to: `${baseSekolah}/all-announcement` },
        { label: "Kehadiran", to: `${baseSekolah}/kehadiran` },
        { label: "Pengumuman", to: `${baseSekolah}/pengumuman` },
      ],
    },
    {
      title: "Kelas",
      links: [
        { label: "Kelas (index)", to: `${baseSekolah}/kelas` },
        {
          label: "Kelas • Detail (:id)",
          to: `${baseSekolah}/kelas/detail/${demo.classId}`,
        },
      ],
    },
    {
      title: "Buku",
      links: [
        { label: "Buku (index)", to: `${baseSekolah}/buku` },
        {
          label: "Buku • Detail (:id)",
          to: `${baseSekolah}/buku/detail/${demo.bookId}`,
        },
      ],
    },
    {
      title: "Menu Utama — Profil & Keuangan",
      links: [
        { label: "Menu Utama (index)", to: `${baseSekolah}/menu-utama` },
        {
          label: "Menu • Profil Sekolah",
          to: `${baseSekolah}/menu-utama/profil-sekolah`,
        },
        { label: "Menu • Keuangan", to: `${baseSekolah}/menu-utama/keuangan` },
        {
          label: "Menu • Keuangan • Detail (:id)",
          to: `${baseSekolah}/menu-utama/keuangan/detail/${demo.billId}`,
        },
        {
          label: "Menu • Sekolah (dashboard)",
          to: `${baseSekolah}/menu-utama/sekolah`,
        },
      ],
    },
    {
      title: "Menu Utama — Ruangan & SPP",
      links: [
        { label: "Menu • Ruangan", to: `${baseSekolah}/menu-utama/ruangan` },
        {
          label: "Menu • Ruangan • Detail (:id)",
          to: `${baseSekolah}/menu-utama/ruangan/${demo.roomId}`,
        },
        { label: "Menu • SPP", to: `${baseSekolah}/menu-utama/spp` },
      ],
    },
    {
      title: "Menu Utama — Pelajaran, Sertifikat, Kalender",
      links: [
        {
          label: "Menu • Pelajaran",
          to: `${baseSekolah}/menu-utama/pelajaran`,
        },
        {
          label: "Menu • Sertifikat",
          to: `${baseSekolah}/menu-utama/sertifikat`,
        },
        {
          label: "Menu • Kalender Akademik",
          to: `${baseSekolah}/menu-utama/kalender`,
        },
      ],
    },
    {
      title: "Menu Utama — Pengaturan, Kelas Aktif, Murid, Buku",
      links: [
        {
          label: "Menu • Pengaturan",
          to: `${baseSekolah}/menu-utama/pengaturan`,
        },
        {
          label: "Menu • Kelas Aktif",
          to: `${baseSekolah}/menu-utama/kelas-aktif`,
        },
        { label: "Menu • Murid", to: `${baseSekolah}/menu-utama/murid` },
        { label: "Menu • Buku (index)", to: `${baseSekolah}/menu-utama/buku` },
        {
          label: "Menu • Buku • Detail (:id)",
          to: `${baseSekolah}/menu-utama/buku/detail/${demo.bookId}`,
        },
      ],
    },
    {
      title: "Menu Utama — Kelas & Akademik",
      links: [
        {
          label: "Menu • Kelas (index)",
          to: `${baseSekolah}/menu-utama/kelas`,
        },
        {
          label: "Menu • Kelas • Kelola",
          to: `${baseSekolah}/menu-utama/kelas/kelola`,
        },
        {
          label: "Menu • Akademik (index)",
          to: `${baseSekolah}/menu-utama/academic`,
        },
        {
          label: "Menu • Akademik • Detail",
          to: `${baseSekolah}/menu-utama/academic/detail`,
        },
        {
          label: "Menu • Akademik • Kelola",
          to: `${baseSekolah}/menu-utama/academic/kelola`,
        },
      ],
    },
    {
      title: "Menu Utama — Sertifikat (Detail Dinamis)",
      links: [
        {
          label: "Menu • Sertifikat • Detail (:classId/:studentId)",
          to: `${baseSekolah}/menu-utama/sertifikat/detail/${demo.classId}/${demo.studentId}`,
        },
      ],
    },
  ];

  return (
    <div style={{ background: palette.white2, color: palette.black1 }}>
      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">
        <SectionCard palette={palette}>
          <div className="p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Layers size={18} color={palette.quaternary} />
              <div>
                <div className="font-semibold">Playground Rute Sekolah</div>
                <div className="text-sm" style={{ color: palette.black2 }}>
                  Base path tenant: <code>/{sid}</code>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Btn
                palette={palette}
                variant="outline"
                size="sm"
                onClick={checkContext}
                disabled={ctxLoading}
              >
                {ctxLoading ? "Cek konteks..." : "Cek Context (axios)"}
              </Btn>
            </div>
          </div>

          {(ctxError || ctxInfo) && (
            <div
              className="mx-5 mb-5 rounded-xl border p-3 text-sm"
              style={{
                borderColor: palette.silver1,
                background: palette.white1,
                color: ctxError ? palette.error1 : palette.black1,
              }}
            >
              {ctxError ? (
                <div>{ctxError}</div>
              ) : (
                <div>
                  <div>
                    <b>User:</b> {ctxInfo?.user_name || "-"}{" "}
                    <span style={{ color: palette.silver2 }}>
                      ({ctxInfo?.email || "tanpa email"})
                    </span>
                  </div>
                  <div>
                    <b>Memberships:</b> {ctxInfo?.memberships?.length ?? 0} org
                  </div>
                </div>
              )}
            </div>
          )}
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
                Demo: klik “Kehadiran Guru” / “Menu Utama • Tugas” ⇒ akan menuju{" "}
                <code>/{sid}/guru/…</code>
              </div>
              <TenantLink to={baseSekolah}>
                <Btn palette={palette} variant="outline" size="sm">
                  Ke Dashboard Sekolah
                </Btn>
              </TenantLink>
            </div>
          </SectionCard>
        </TenantClickRewriter>
      </div>
    </div>
  );
}
