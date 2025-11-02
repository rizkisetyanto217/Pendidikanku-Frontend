import { pickTheme } from "@/constants/thema";
import useHtmlThema, { ThemeName } from "@/hooks/useHTMLThema";
import { Building2, GraduationCap, Sparkles, Users2 } from "lucide-react";

/* =========================
   Modal: Pilih Tujuan
========================= */
export default function ModalChooseRole({
  open,
  onClose,
  onPilih,
}: {
  open: boolean;
  onClose: () => void;
  onPilih: (tujuan: "dkm" | "teacher" | "student") => void;
}) {
  const { isDark, themeName } = useHtmlThema();
  const palette = pickTheme(themeName as ThemeName, isDark);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Pilih Peran"
    >
      <div
        className="rounded-3xl p-8 w-full max-w-md text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ background: palette.white1, color: palette.black1 }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{
            background: `linear-gradient(to bottom right, ${palette.primary}, ${palette.quaternary})`,
          }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Apa peran Anda?</h2>
          <p className="text-sm" style={{ color: palette.silver2 }}>
            Pilih tujuan Anda bergabung di SekolahIslamKu
          </p>
        </div>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onPilih("dkm")}
            className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all group"
            style={{
              borderColor: palette.silver1,
              background: palette.white2,
              color: palette.black1,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(to bottom right, ${palette.primary}, ${palette.secondary})`,
              }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Jadi DKM / Admin school</span>
          </button>
          <button
            type="button"
            onClick={() => onPilih("teacher")}
            className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all group"
            style={{
              borderColor: palette.silver1,
              background: palette.white2,
              color: palette.black1,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(to bottom right, ${palette.success1}, ${palette.secondary})`,
              }}
            >
              <Users2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Gabung Sebagai Guru</span>
          </button>
          <button
            type="button"
            onClick={() => onPilih("student")}
            className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all group"
            style={{
              borderColor: palette.silver1,
              background: palette.white2,
              color: palette.black1,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(to bottom right, ${palette.quaternary}, ${palette.secondary})`,
              }}
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Gabung Sebagai Murid</span>
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium transition-colors"
          style={{ color: palette.silver2 }}
        >
          Nanti Saja
        </button>
      </div>
    </div>
  );
}
