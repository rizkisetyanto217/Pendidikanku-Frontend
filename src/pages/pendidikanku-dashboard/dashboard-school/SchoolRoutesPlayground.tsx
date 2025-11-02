import { Link } from "react-router-dom";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import {
  SectionCard,
  Btn,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import { Layers, ChevronRight } from "lucide-react";

export default function SchoolRoutesPlayground() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  // Demo params — sesuaikan dgn data dummy kamu
  const demo = {
    scheduleId: "sch-001",
    billId: "bill-001",
    teacherId: "tch-001",
    classId: "cls-10a-2025",
    studentId: "stu-10a-001",
    roomId: "room-01",
    bookId: "book-001",
  };

  const base = "/sekolah";

  const groups: { title: string; links: { label: string; to: string }[] }[] = [
    {
      title: "Dashboard",
      links: [{ label: "Dashboard Sekolah (index)", to: `${base}` }],
    },
    {
      title: "Murid",
      links: [{ label: "Murid (coming soon)", to: `${base}/murid` }],
    },
    {
      title: "Jadwal",
      links: [
        { label: "Jadwal (all)", to: `${base}/jadwal` },
        {
          label: "Jadwal • Detail (:scheduleId)",
          to: `${base}/jadwal/detail/${demo.scheduleId}`,
        },
      ],
    },
    {
      title: "Profil & Keuangan",
      links: [
        { label: "Profil Sekolah", to: `${base}/profil-sekolah` },
        { label: "Keuangan (overview)", to: `${base}/keuangan` },
        {
          label: "Keuangan • Detail Tagihan (:id)",
          to: `${base}/keuangan/detail/${demo.billId}`,
        },
      ],
    },
    {
      title: "Guru",
      links: [
        { label: "Guru (index)", to: `${base}/guru` },
        { label: "Guru • Detail (:id)", to: `${base}/guru/${demo.teacherId}` },
      ],
    },
    {
      title: "Akademik",
      links: [
        { label: "Akademik (index)", to: `${base}/akademik` },
        { label: "Akademik • Detail", to: `${base}/akademik/detail` },
        { label: "Akademik • Kelola", to: `${base}/akademik/kelola` },
      ],
    },
    {
      title: "Pengumuman & Kehadiran (coming soon)",
      links: [
        { label: "Semua Pengumuman", to: `${base}/all-announcement` },
        { label: "Kehadiran", to: `${base}/kehadiran` },
        { label: "Pengumuman", to: `${base}/pengumuman` },
      ],
    },
    {
      title: "Kelas",
      links: [
        { label: "Kelas (index)", to: `${base}/kelas` },
        {
          label: "Kelas • Detail (:id)",
          to: `${base}/kelas/detail/${demo.classId}`,
        },
      ],
    },
    {
      title: "Buku",
      links: [
        { label: "Buku (index)", to: `${base}/buku` },
        {
          label: "Buku • Detail (:id)",
          to: `${base}/buku/detail/${demo.bookId}`,
        },
      ],
    },
    // ========================= MENU UTAMA =========================
    {
      title: "Menu Utama — Profil & Keuangan",
      links: [
        { label: "Menu Utama (index)", to: `${base}/menu-utama` },
        {
          label: "Menu • Profil Sekolah",
          to: `${base}/menu-utama/profil-sekolah`,
        },
        { label: "Menu • Keuangan", to: `${base}/menu-utama/keuangan` },
        {
          label: "Menu • Keuangan • Detail (:id)",
          to: `${base}/menu-utama/keuangan/detail/${demo.billId}`,
        },
        {
          label: "Menu • Sekolah (dashboard)",
          to: `${base}/menu-utama/sekolah`,
        },
      ],
    },
    {
      title: "Menu Utama — Ruangan & SPP",
      links: [
        { label: "Menu • Ruangan", to: `${base}/menu-utama/ruangan` },
        {
          label: "Menu • Ruangan • Detail (:id)",
          to: `${base}/menu-utama/ruangan/${demo.roomId}`,
        },
        { label: "Menu • SPP", to: `${base}/menu-utama/spp` },
      ],
    },
    {
      title: "Menu Utama — Pelajaran, Sertifikat, Kalender",
      links: [
        { label: "Menu • Pelajaran", to: `${base}/menu-utama/pelajaran` },
        { label: "Menu • Sertifikat", to: `${base}/menu-utama/sertifikat` },
        {
          label: "Menu • Kalender Akademik",
          to: `${base}/menu-utama/kalender`,
        },
      ],
    },
    {
      title: "Menu Utama — Pengaturan, Kelas Aktif, Murid, Buku",
      links: [
        { label: "Menu • Pengaturan", to: `${base}/menu-utama/pengaturan` },
        { label: "Menu • Kelas Aktif", to: `${base}/menu-utama/kelas-aktif` },
        { label: "Menu • Murid", to: `${base}/menu-utama/murid` },
        { label: "Menu • Buku (index)", to: `${base}/menu-utama/buku` },
        {
          label: "Menu • Buku • Detail (:id)",
          to: `${base}/menu-utama/buku/detail/${demo.bookId}`,
        },
      ],
    },
    {
      title: "Menu Utama — Kelas & Akademik",
      links: [
        { label: "Menu • Kelas (index)", to: `${base}/menu-utama/kelas` },
        {
          label: "Menu • Kelas • Kelola",
          to: `${base}/menu-utama/kelas/kelola`,
        },
        { label: "Menu • Akademik (index)", to: `${base}/menu-utama/academic` },
        {
          label: "Menu • Akademik • Detail",
          to: `${base}/menu-utama/academic/detail`,
        },
        {
          label: "Menu • Akademik • Kelola",
          to: `${base}/menu-utama/academic/kelola`,
        },
      ],
    },
    {
      title: "Menu Utama — Sertifikat (Detail Dinamis)",
      links: [
        {
          label: "Menu • Sertifikat • Detail (:classId/:studentId)",
          to: `${base}/menu-utama/sertifikat/detail/${demo.classId}/${demo.studentId}`,
        },
      ],
    },
  ];

  return (
    <div style={{ background: palette.white2, color: palette.black1 }}>
      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">
        <SectionCard palette={palette}>
          <div className="p-5 flex items-center gap-3">
            <Layers size={18} color={palette.quaternary} />
            <div>
              <div className="font-semibold">Playground Rute Sekolah</div>
              <div className="text-sm" style={{ color: palette.black2 }}>
                Uji cepat semua link di bawah. Base path: <code>/sekolah</code>.
              </div>
            </div>
          </div>
        </SectionCard>

        {groups.map((g) => (
          <SectionCard key={g.title} palette={palette}>
            <div className="p-5 space-y-3">
              <div className="font-semibold">{g.title}</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {g.links.map((lk) => (
                  <Link key={lk.to} to={lk.to}>
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
                  </Link>
                ))}
              </div>
            </div>
          </SectionCard>
        ))}

        <SectionCard palette={palette}>
          <div className="p-5 flex items-center justify-between">
            <div className="text-sm" style={{ color: palette.black2 }}>
              Demo params — scheduleId=<code>{demo.scheduleId}</code>, billId=
              <code>{demo.billId}</code>, classId=<code>{demo.classId}</code>
            </div>
            <Link to="/sekolah">
              <Btn palette={palette} variant="outline" size="sm">
                Ke Dashboard Sekolah
              </Btn>
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
