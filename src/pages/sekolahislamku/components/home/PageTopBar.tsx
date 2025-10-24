import { MoreVertical, Menu } from "lucide-react";
import type { Palette } from "@/pages/sekolahislamku/components/ui/Primitives";

type ParentTopBarProps = {
  palette: Palette;
  title?: string;
  gregorianDate?: string; // ISO
  hijriDate?: string; // siap tampil
  rightSlot?: React.ReactNode;
  onMenuClick?: () => void; // ⬅️ NEW
};

const fmtID = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

export default function ParentTopBar({
  palette,
  title = "Dashboard",
  gregorianDate,
  hijriDate,
  rightSlot,
  onMenuClick, // ⬅️ NEW
}: ParentTopBarProps) {
  return (
    <header
      className="w-full sticky top-0 z-30"
      style={{ background: palette.white1, color: palette.black1 }}
    >
      <div
        className="border-b"
        style={{ borderColor: palette.silver1, background: palette.white1 }}
      >
        <div className="mx-auto max-w-screen-2xl px-4 md:px-6 py-3 flex items-center gap-3">
          {/* Hamburger mobile */}
          <button
            className="lg:hidden p-2 rounded-lg"
            style={{ background: palette.white3 }}
            aria-label="Buka menu"
            onClick={onMenuClick} // ⬅️ WIRE!
          >
            <Menu size={18} />
          </button>

          {/* Title */}
          <div className="flex-1">
            <h1 className="text-base md:text-lg font-semibold leading-tight">
              {title}
            </h1>
          </div>

          {/* Hijri pill */}
          <div
            className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: palette.white3 }}
            title={fmtID(gregorianDate)}
          >
            <span>{hijriDate ?? "-"}</span>
          </div>

          {/* Right actions */}
          {rightSlot ?? (
            <button
              className="ml-2 p-2 rounded-lg"
              style={{ background: palette.white3 }}
              aria-label="More"
            >
              <MoreVertical size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
