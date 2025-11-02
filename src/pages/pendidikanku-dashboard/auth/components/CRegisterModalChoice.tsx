// src/pages/dashboard/auth/components/RegisterChoiceModal.tsx
import React, { useEffect, useState, useMemo } from "react";
import { User, Building2, CheckCircle2 } from "lucide-react";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import CBaseModal from "@/components/common/main/CBaseModal";

type Props = {
  open: boolean;
  onClose: () => void;
  /** hanya mengembalikan pilihan jenis pendaftaran (bukan role) */
  onSelect: (choice: "school" | "user") => void;
};

type Choice = "school" | "user" | null;

export default function RegisterChoiceModal({
  open,
  onClose,
  onSelect,
}: Props) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);
  const [selected, setSelected] = useState<Choice>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const styles = useMemo(
    () => ({
      cardBase: {
        backgroundColor: palette.white1,
        border: `1px solid ${palette.white3}`,
      },
      cardHover: {
        border: `1px solid ${palette.quaternary}`,
        boxShadow: `0 0 0 3px ${palette.primary2}`,
      },
      cardSelected: {
        border: `1px solid ${palette.primary}`,
        boxShadow: `0 0 0 3px ${palette.primary2}`,
      },
      iconWrap: {
        backgroundColor: palette.white2,
        border: `1px solid ${palette.white3}`,
      },
      muted: { color: palette.silver2 },
      headerBorder: { borderColor: palette.white3 },
      cancelBtn: {
        border: `1px solid ${palette.white3}`,
        color: palette.black1,
      },
      nextBtnEnabled: {
        backgroundColor: palette.primary,
        color: palette.white1,
      },
      nextBtnDisabled: {
        backgroundColor: palette.white3,
        color: palette.silver2,
      },
    }),
    [palette]
  );

  if (!open) return null;

  const Card = ({
    title,
    desc,
    icon,
    choice,
  }: {
    title: string;
    desc: string;
    icon: React.ReactNode;
    choice: Exclude<Choice, null>;
  }) => {
    const active = selected === choice;
    return (
      <button
        type="button"
        onClick={() => setSelected(choice)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelected(choice);
          }
        }}
        className="text-left rounded-2xl p-5 border transition w-full focus:outline-none"
        style={{
          ...(styles.cardBase as React.CSSProperties),
          ...(active ? (styles.cardSelected as React.CSSProperties) : {}),
          color: palette.black1,
        }}
        aria-pressed={active}
        aria-label={title}
        onMouseEnter={(e) => {
          if (!active) {
            (e.currentTarget.style.border as any) =
              `1px solid ${palette.quaternary}`;
            (e.currentTarget.style.boxShadow as any) =
              `0 0 0 3px ${palette.primary2}`;
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            (e.currentTarget.style.border as any) =
              `1px solid ${palette.white3}`;
            (e.currentTarget.style.boxShadow as any) = "none";
          }
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="h-10 w-10 grid place-items-center rounded-xl shrink-0"
            style={styles.iconWrap as React.CSSProperties}
          >
            {icon}
          </div>
          <div className="flex-1">
            <div className="font-semibold flex items-center gap-2">
              {title}
              {active && (
                <CheckCircle2
                  className="h-4 w-4"
                  style={{ color: palette.primary }}
                />
              )}
            </div>
            <p className="mt-2 text-sm" style={styles.muted}>
              {desc}
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <CBaseModal
      open={open}
      onClose={onClose}
      ariaLabel="Pilih Jenis Pendaftaran"
      maxWidthClassName="max-w-2xl"
      contentClassName="p-0 overflow-hidden"
      contentStyle={{ background: palette.white1, color: palette.black1 }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={styles.headerBorder}
      >
        <div className="font-semibold">Pilih Jenis Pendaftaran</div>
        {/* tombol close sengaja pakai onClose dari CBaseModal wrapper */}
        {/* Jika mau ikon X juga, tinggal aktifkan tombol ini dan panggil onClose */}
        {/* <button onClick={onClose} className="p-2 rounded-lg hover:opacity-80" style={{ color: palette.silver2 }}>
          <X className="h-5 w-5" />
        </button> */}
      </div>

      {/* body */}
      <div className="p-5">
        <p className="text-sm mb-5" style={styles.muted}>
          Pilih salah satu: <b>Daftar atas nama Sekolah</b> atau{" "}
          <b>Daftar sebagai Pengguna</b>.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card
            choice="school"
            title="Daftar atas nama Sekolah"
            desc="Buat akun institusi untuk mengelola data sekolah, pengguna, dan modul."
            icon={
              <Building2
                className="h-5 w-5"
                style={{ color: palette.primary }}
              />
            }
          />
          <Card
            choice="user"
            title="Daftar sebagai Pengguna"
            desc="Buat akun pribadi (orang tua/siswa/guru) untuk akses fitur dasar."
            icon={
              <User className="h-5 w-5" style={{ color: palette.primary }} />
            }
          />
        </div>

        {/* footer */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs" style={styles.muted}>
            Dengan melanjutkan, Anda menyetujui S&K dan Kebijakan Privasi.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm"
              style={styles.cancelBtn}
            >
              Batal
            </button>
            <button
              onClick={() => selected && onSelect(selected)}
              disabled={!selected}
              className="rounded-xl px-4 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              style={selected ? styles.nextBtnEnabled : styles.nextBtnDisabled}
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    </CBaseModal>
  );
}
