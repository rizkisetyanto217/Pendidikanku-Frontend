import { pickTheme, ThemeName, type Palette } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { Building2, GraduationCap, Sparkles, Users2 } from "lucide-react";
import CBaseModal from "@/components/common/main/CBaseModal";

export default function ModalChooseRole({
  open,
  onClose,
  onPilih,
}: {
  open: boolean;
  onClose: () => void;
  onPilih: (tujuan: "dkm" | "teacher" | "student") => void;
}) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);

  return (
    <CBaseModal open={open} onClose={onClose} ariaLabel="Pilih Peran">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{
          background: `linear-gradient(to bottom right, ${palette.primary}, ${palette.quaternary})`,
          boxShadow: `0 8px 20px ${palette.primary2}`,
        }}
      >
        <Sparkles className="w-8 h-8" style={{ color: palette.white1 }} />
      </div>

      <h2
        className="text-2xl font-bold text-center"
        style={{ color: palette.black1 }}
      >
        Apa peran Anda?
      </h2>
      <p
        className="text-sm text-center mb-4"
        style={{ color: palette.silver2 }}
      >
        Pilih tujuan Anda bergabung di SekolahIslamKu
      </p>

      <div className="space-y-3">
        <ModalButton
          onClick={() => onPilih("dkm")}
          bg={`linear-gradient(to bottom right, ${palette.primary}, ${palette.secondary})`}
          icon={
            <Building2 className="w-5 h-5" style={{ color: palette.white1 }} />
          }
          text="Jadi DKM / Admin school"
          palette={palette}
        />
        <ModalButton
          onClick={() => onPilih("teacher")}
          bg={`linear-gradient(to bottom right, ${palette.success1}, ${palette.secondary})`}
          icon={
            <Users2 className="w-5 h-5" style={{ color: palette.white1 }} />
          }
          text="Gabung Sebagai Guru"
          palette={palette}
        />
        <ModalButton
          onClick={() => onPilih("student")}
          bg={`linear-gradient(to bottom right, ${palette.quaternary}, ${palette.secondary})`}
          icon={
            <GraduationCap
              className="w-5 h-5"
              style={{ color: palette.white1 }}
            />
          }
          text="Gabung Sebagai Murid"
          palette={palette}
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="block mx-auto mt-6 text-sm font-medium"
        style={{ color: palette.silver2 }}
      >
        Nanti Saja
      </button>
    </CBaseModal>
  );
}

function ModalButton({
  onClick,
  bg,
  icon,
  text,
  palette,
}: {
  onClick: () => void;
  bg: string;
  icon: React.ReactNode;
  text: string;
  palette: Palette;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all group focus:outline-none"
      style={{
        borderColor: palette.silver1,
        background: palette.white2,
        color: palette.black1,
        boxShadow: `0 2px 0 0 ${palette.primary2}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget.style.background as any) = palette.white3;
        (e.currentTarget.style.borderColor as any) = palette.quaternary;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget.style.background as any) = palette.white2;
        (e.currentTarget.style.borderColor as any) = palette.silver1;
      }}
      onFocus={(e) => {
        (e.currentTarget.style.boxShadow as any) =
          `0 0 0 3px ${palette.primary2}`;
        (e.currentTarget.style.borderColor as any) = palette.quaternary;
      }}
      onBlur={(e) => {
        (e.currentTarget.style.boxShadow as any) =
          `0 2px 0 0 ${palette.primary2}`;
        (e.currentTarget.style.borderColor as any) = palette.silver1;
      }}
    >
      <div
        className="w-10 h-10 rounded-xl grid place-items-center transition-transform"
        style={{
          background: bg,
          boxShadow: `0 6px 14px ${palette.primary2}`,
        }}
      >
        {icon}
      </div>
      <span className="font-semibold" style={{ color: palette.black1 }}>
        {text}
      </span>
    </button>
  );
}
