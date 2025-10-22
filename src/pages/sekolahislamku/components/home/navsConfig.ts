import {
  LayoutDashboard,
  Users,
  UserCog,
  BookOpen,
  Wallet,
  ClipboardCheck,
  FileSpreadsheet,
  CalendarDays,
  ChartBar,
  School,
} from "lucide-react";

/* ===================== Types ===================== */
export type NavItem = {
  path: "" | "." | string;
  label: string;
  icon: React.ComponentType<any>;
  end?: boolean;
  to: string; // ✅ wajib ada, agar TS tidak error
};

export type NavDict = {
  sekolah: NavItem[];
  murid: NavItem[];
  guru: NavItem[];
};

/* ===================== Default Navs ===================== */
export const NAVS: NavDict = {
  sekolah: [
    { path: "", label: "Dashboard", icon: LayoutDashboard, end: true, to: "" },
    { path: "menu-utama", label: "Menu Utama", icon: ChartBar, to: "" },
    { path: "guru", label: "Guru", icon: UserCog, to: "" },
    { path: "kelas", label: "Kelas", icon: BookOpen, to: "" },
    { path: "buku", label: "Buku", icon: BookOpen, to: "" },
    { path: "keuangan", label: "Keuangan", icon: Wallet, to: "" },
    { path: "academic", label: "Akademik", icon: FileSpreadsheet, to: "" },
    { path: "profil-sekolah", label: "Profil", icon: School, to: "" },
  ],
  murid: [
    { path: "", label: "Dashboard", icon: LayoutDashboard, end: true, to: "" },
    { path: "menu-utama", label: "Menu Utama", icon: ChartBar, to: "" },
    { path: "progress", label: "Progress Anak", icon: ClipboardCheck, to: "" },
    { path: "finance", label: "Pembayaran", icon: Wallet, to: "" },
    { path: "jadwal", label: "Jadwal", icon: CalendarDays, to: "" },
    { path: "tugas", label: "Tugas", icon: ClipboardCheck, to: "" },
    { path: "profil-murid", label: "Profil", icon: Users, to: "" },
  ],
  guru: [
    { path: "", label: "Dashboard", icon: LayoutDashboard, end: true, to: "" },
    { path: "menu-utama", label: "Menu Utama", icon: ChartBar, to: "" },
    { path: "kelas", label: "Kelas Saya", icon: Users, to: "" },
    { path: "guru-mapel", label: "Guru Mapel", icon: UserCog, to: "" },
    { path: "jadwal", label: "Jadwal", icon: CalendarDays, to: "" },
    { path: "profil-guru", label: "Profil", icon: Users, to: "" },
  ],
};
