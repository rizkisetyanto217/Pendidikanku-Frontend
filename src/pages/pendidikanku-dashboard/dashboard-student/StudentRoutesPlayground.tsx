import { Link } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName } from "@/constants/thema";
import {
  SectionCard,
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

/**
 * Halaman khusus untuk menguji semua tautan StudentRoutes.
 * Gunakan path: /murid/_dev-links
 */
export default function StudentRoutesPlayground() {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);

  // Contoh ID untuk rute dinamis
  const sampleScheduleId = "sch-001";
  const sampleClassId = "class-001";

  const base = "/murid";

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
        // Sertifikat sementara nonaktif di routing utama
        // { to: `${base}/menu-utama/sertifikat-murid`, label: "Sertifikat" },
      ],
    },
    // Pengumuman sementara dinonaktifkan di definisi routes
    // {
    //   title: "Pengumuman",
    //   links: [
    //     { to: `${base}/announcements`, label: "Pengumuman (lama)" },
    //     { to: `${base}/pengumuman`, label: "Pengumuman (baru)" },
    //   ],
    // },
  ];

  return (
    <div
      className="min-h-[60vh] w-full px-4 md:px-6 py-6"
      style={{ background: palette.white2, color: palette.black1 }}
    >
      <div className="max-w-screen-xl mx-auto space-y-4">
        <SectionCard palette={palette} className="p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl font-semibold">Dev • Student Routes</h1>
              <p className="text-sm mt-1" style={{ color: palette.black2 }}>
                Halaman ini berisi tautan ujicoba untuk semua rute murid. Rute
                dinamis menggunakan contoh <code>{sampleScheduleId}</code> dan{" "}
                <code>{sampleClassId}</code>.
              </p>
            </div>
            <Link to={base}>
              <Btn palette={palette} size="sm" variant="secondary">
                Ke Dashboard Murid
              </Btn>
            </Link>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groups.map((g) => (
            <SectionCard key={g.title} palette={palette} className="p-4">
              <h2 className="font-medium mb-3">{g.title}</h2>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.to} className="flex items-center justify-between">
                    <Link
                      to={l.to}
                      className="underline underline-offset-2 hover:opacity-80 truncate"
                    >
                      {l.label}
                    </Link>
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
      </div>
    </div>
  );
}
