// components/LegalModal.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import CBaseModal from "@/components/common/main/CBaseModal";

export type LegalModalProps = {
  open: boolean;
  onClose: () => void;
  /** Tab awal yang dibuka */
  initialTab?: "tos" | "privacy";
  /** Tanggal pembaruan */
  lastUpdated?: string;
  /** Tampilkan tombol “Saya Setuju” */
  showAccept?: boolean;
  /** Callback saat klik “Saya Setuju” */
  onAccept?: () => void;
  /** Override konten default (opsional) */
  termsContent?: React.ReactNode;
  privacyContent?: React.ReactNode;
};

export default function LegalModal({
  open,
  onClose,
  initialTab = "tos",
  lastUpdated = "25 Agustus 2025",
  showAccept = false,
  onAccept,
  termsContent,
  privacyContent,
}: LegalModalProps) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);

  const [tab, setTab] = useState<"tos" | "privacy">(initialTab);
  useEffect(() => setTab(initialTab), [initialTab, open]);

  // ESC untuk close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const panelRef = useRef<HTMLDivElement>(null);

  const styles = useMemo(
    () => ({
      panel: {
        background: palette.white1,
        color: palette.black1,
        border: `1px solid ${palette.white3}`,
      },
      headerBorder: { borderColor: palette.white3 },
      muted: { color: palette.silver2 },
      tabBase:
        "px-3 py-1.5 rounded-full text-sm font-medium transition border focus:outline-none",
      tabUnselected: {
        background: "transparent",
        color: palette.black1,
        borderColor: palette.white3,
      },
      tabSelected: {
        background: palette.primary,
        color: palette.white1,
        borderColor: "transparent",
        boxShadow: `0 0 0 3px ${palette.primary2}`,
      },
      bodyScroll: { scrollbarWidth: "thin" as any },
      btnCancel: {
        background: isDark ? palette.white2 : palette.white1,
        color: palette.black1,
        border: `1px solid ${palette.white3}`,
      },
      btnAccept: {
        background: palette.primary,
        color: palette.white1,
      },
    }),
    [palette, isDark]
  );

  if (!open) return null;

  const DefaultTerms = () => (
    <div
      className="space-y-3 text-sm leading-relaxed"
      style={{ color: palette.black1 }}
    >
      <p>
        Selamat datang di <strong>SekolahIslamku Suite</strong>. Dengan
        menggunakan layanan ini, Anda menyetujui Syarat & Ketentuan berikut.
      </p>
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong>Akun & Keamanan.</strong> Anda bertanggung jawab atas
          kerahasiaan kredensial dan seluruh aktivitas pada akun Anda.
        </li>
        <li>
          <strong>Penggunaan yang Wajar.</strong> Layanan digunakan sesuai
          ketentuan sekolah dan hukum yang berlaku. Larangan penyalahgunaan,
          spam, atau akses tidak sah.
        </li>
        <li>
          <strong>Konten & Data.</strong> Data milik institusi tetap menjadi
          milik institusi; kami mengelolanya sesuai kebijakan privasi.
        </li>
        <li>
          <strong>Layanan.</strong> Fitur dapat berubah/ditingkatkan dari waktu
          ke waktu untuk perbaikan layanan.
        </li>
        <li>
          <strong>Penutup.</strong> Pelanggaran berat dapat berakibat pembatasan
          atau penghentian akses.
        </li>
      </ol>
      <p className="pt-2" style={styles.muted}>
        Versi ringkas. Versi lengkap tersedia atas permintaan institusi Anda.
      </p>
    </div>
  );

  const DefaultPrivacy = () => (
    <div
      className="space-y-3 text-sm leading-relaxed"
      style={{ color: palette.black1 }}
    >
      <p>
        Kebijakan Privasi ini menjelaskan bagaimana kami menangani informasi
        pribadi pengguna platform.
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Pengumpulan Data:</strong> nama, email/username, peran,
          aktivitas pembelajaran/administrasi yang relevan.
        </li>
        <li>
          <strong>Penggunaan:</strong> operasional platform, dukungan, analitik
          agregat untuk peningkatan layanan.
        </li>
        <li>
          <strong>Berbagi:</strong> tidak dijual; dapat dibagikan dengan mitra
          pemroses data yang mematuhi perjanjian kerahasiaan.
        </li>
        <li>
          <strong>Keamanan:</strong> enkripsi, kontrol akses berbasis peran,
          audit log.
        </li>
        <li>
          <strong>Hak Anda:</strong> akses, koreksi, atau penghapusan sesuai
          kebijakan institusi dan peraturan yang berlaku.
        </li>
      </ul>
      <p className="pt-2" style={styles.muted}>
        Untuk permintaan data, hubungi admin sekolah atau tim dukungan kami.
      </p>
    </div>
  );

  return (
    <CBaseModal
      open={open}
      onClose={onClose}
      ariaLabel="Kebijakan Layanan"
      maxWidthClassName="max-w-3xl"
      contentClassName="p-0 overflow-hidden"
      contentStyle={styles.panel}
    >
      <div ref={panelRef} className="w-full">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={styles.headerBorder}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck
              className="h-5 w-5"
              style={{ color: palette.primary }}
            />
            <h2 id="legal-title" className="text-base font-semibold">
              Kebijakan Layanan
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-2 rounded-lg hover:opacity-80 focus:outline-none"
            style={{ color: palette.silver2 }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-4 flex items-center gap-2">
          <button
            className={styles.tabBase}
            onClick={() => setTab("tos")}
            style={tab === "tos" ? styles.tabSelected : styles.tabUnselected}
            onMouseEnter={(e) => {
              if (tab !== "tos") {
                (e.currentTarget.style.boxShadow as any) =
                  `0 0 0 3px ${palette.primary2}`;
                (e.currentTarget.style.borderColor as any) = palette.quaternary;
              }
            }}
            onMouseLeave={(e) => {
              if (tab !== "tos") {
                (e.currentTarget.style.boxShadow as any) = "none";
                (e.currentTarget.style.borderColor as any) = palette.white3;
              }
            }}
          >
            Syarat & Ketentuan
          </button>
          <button
            className={styles.tabBase}
            onClick={() => setTab("privacy")}
            style={
              tab === "privacy" ? styles.tabSelected : styles.tabUnselected
            }
            onMouseEnter={(e) => {
              if (tab !== "privacy") {
                (e.currentTarget.style.boxShadow as any) =
                  `0 0 0 3px ${palette.primary2}`;
                (e.currentTarget.style.borderColor as any) = palette.quaternary;
              }
            }}
            onMouseLeave={(e) => {
              if (tab !== "privacy") {
                (e.currentTarget.style.boxShadow as any) = "none";
                (e.currentTarget.style.borderColor as any) = palette.white3;
              }
            }}
          >
            Kebijakan Privasi
          </button>

          <span className="ml-auto text-xs" style={styles.muted}>
            Diperbarui: {lastUpdated}
          </span>
        </div>

        {/* Body */}
        <div
          className="px-5 pb-5 pt-4 max-h-[70vh] overflow-y-auto space-y-4"
          style={styles.bodyScroll}
        >
          {tab === "tos"
            ? (termsContent ?? <DefaultTerms />)
            : (privacyContent ?? <DefaultPrivacy />)}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 border-t flex items-center justify-end gap-2"
          style={styles.headerBorder}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border focus:outline-none"
            style={styles.btnCancel}
          >
            Tutup
          </button>
          {showAccept && (
            <button
              onClick={onAccept}
              className="px-4 py-2 rounded-xl font-medium focus:outline-none"
              style={styles.btnAccept}
            >
              Saya Setuju
            </button>
          )}
        </div>
      </div>
    </CBaseModal>
  );
}
