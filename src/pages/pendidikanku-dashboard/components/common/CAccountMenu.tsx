// components/common/main/CAccountMenu.tsx
import React from "react";
import CBaseModal from "@/components/common/main/CBaseModal";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName } from "@/constants/thema";
import { LogOut, ShieldCheck, User2, Crown } from "lucide-react";

export type AccountMenuProps = {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    email?: string;
    avatar?: string;
  };
  plan?: {
    name: string; // e.g. "Free", "Starter", "Pro"
    subtitle?: string; // e.g. "Bulan ini • 5.000 request"
    onManage?: () => void; // klik kelola/upgrade
  };
  onProfile?: () => void; // buka halaman profil/pengaturan
  onLogout: () => void; // aksi logout
};

export default function CAccountMenu({
  open,
  onClose,
  user,
  plan,
  onProfile,
  onLogout,
}: AccountMenuProps) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);

  return (
    <CBaseModal
      open={open}
      onClose={onClose}
      ariaLabel="Menu akun"
      maxWidthClassName="max-w-sm"
      contentClassName="p-0 overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-4 flex items-center gap-3"
        style={{ borderBottom: `1px solid ${palette.silver1}` }}
      >
        <div
          className="h-10 w-10 rounded-full overflow-hidden grid place-items-center text-white font-semibold"
          style={{ background: palette.primary }}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            (user.name || "U")
              .split(/\s+/)
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate">{user.name}</div>
          {user.email && (
            <div
              className="text-xs truncate"
              style={{ color: palette.silver2 }}
            >
              {user.email}
            </div>
          )}
        </div>
      </div>

      {/* Plan */}
      <div className="p-4">
        <div
          className="rounded-2xl p-3 flex items-center gap-3"
          style={{
            background: palette.white2,
            boxShadow: `inset 0 0 0 1px ${palette.silver1}`,
          }}
        >
          <div
            className="h-9 w-9 rounded-xl grid place-items-center"
            style={{
              background: `linear-gradient(135deg, ${palette.primary}, ${palette.quaternary})`,
              color: palette.white1,
            }}
          >
            <Crown size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">
              {plan?.name ?? "Free Plan"}
            </div>
            <div className="text-[11px]" style={{ color: palette.silver2 }}>
              {plan?.subtitle ?? "Akses dasar untuk fitur inti"}
            </div>
          </div>
          {plan?.onManage && (
            <button
              onClick={plan.onManage}
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{
                background: palette.white1,
                boxShadow: `inset 0 0 0 1px ${palette.silver1}`,
                color: palette.black1,
              }}
            >
              Kelola
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 pb-2">
        <MenuItem
          icon={<User2 size={16} />}
          label="Profil & Pengaturan"
          desc="Edit profil, keamanan, preferensi"
          onClick={onProfile}
          palette={palette}
        />
        <MenuItem
          icon={<ShieldCheck size={16} />}
          label="Service Plan"
          desc="Paket & penagihan"
          onClick={plan?.onManage}
          palette={palette}
        />
        <MenuItem
          icon={<LogOut size={16} />}
          label="Keluar"
          danger
          onClick={onLogout}
          palette={palette}
        />
      </div>
    </CBaseModal>
  );
}

function MenuItem({
  icon,
  label,
  desc,
  danger,
  onClick,
  palette,
}: {
  icon: React.ReactNode;
  label: string;
  desc?: string;
  danger?: boolean;
  onClick?: () => void;
  palette: any;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors"
      style={{
        background: palette.white1,
        boxShadow: `inset 0 0 0 1px ${palette.silver1}`,
        color: danger ? "#DC2626" : palette.black1,
      }}
    >
      <div
        className="h-8 w-8 rounded-xl grid place-items-center"
        style={{
          background: palette.white2,
          boxShadow: `inset 0 0 0 1px ${palette.silver1}`,
        }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold truncate">{label}</div>
        {desc && (
          <div
            className="text-[11px] truncate"
            style={{ color: palette.silver2 }}
          >
            {desc}
          </div>
        )}
      </div>
    </button>
  );
}
