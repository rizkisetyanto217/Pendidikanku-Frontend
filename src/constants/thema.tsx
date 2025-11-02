// src/constants/colorsThema.ts
export type ThemeName =
  | "default"
  | "sunrise"
  | "midnight"
  | "emerald"
  | "ocean"
  | "forest"
  | "rose"
  | "sand";

export type Palette = {
  primary: string;
  primary2: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  success1: string;
  success2: string;
  white1: string;
  white2: string;
  white3: string;
  black1: string;
  black2: string;
  error1: string;
  error2: string;
  warning1: string;
  silver1: string;
  silver2: string;
  silver4: string;
  specialColor: string;
};

export type ThemeVariant = { light: Palette; dark: Palette };

// ===== DEFAULT =====
const defaultLight: Palette = {
  primary: "#007074",
  primary2: "#0070741F",
  secondary: "#769596",
  tertiary: "#A3DADB",
  quaternary: "#229CC8",
  success1: "#57B236",
  success2: "#E1FFF8",
  white1: "#FFFFFF",
  white2: "#FAFAFA",
  white3: "#EEEEEE",
  black1: "#222222",
  black2: "#333333",
  error1: "#D1403F",
  error2: "#FFEDE7",
  warning1: "#F59D09",
  silver1: "#DDDDDD",
  silver2: "#888888",
  silver4: "#4B4B4B",
  specialColor: "#FFCC00",
};
const defaultDark: Palette = {
  primary: "#007074",
  primary2: "#00707433",
  secondary: "#5A7070",
  tertiary: "#75C4C4",
  quaternary: "#1D7CA5",
  success1: "#3D8A2A",
  success2: "#143A37",
  white1: "#1C1C1C",
  white2: "#2A2A2A",
  white3: "#3A3A3A",
  black1: "#EAEAEA",
  black2: "#CCCCCC",
  error1: "#C53030",
  error2: "#331111",
  warning1: "#B86B00",
  silver1: "#555555",
  silver2: "#AAAAAA",
  silver4: "#B0B0B0",
  specialColor: "#FFD700",
};

// ===== SUNRISE =====
const sunriseLight: Palette = {
  primary: "#F97316",
  primary2: "#F9731633",
  secondary: "#F59E0B",
  tertiary: "#FDBA74",
  quaternary: "#FBBF24",
  success1: "#22C55E",
  success2: "#DCFCE7",
  white1: "#FFF7ED",
  white2: "#FFEEDD",
  white3: "#FDE68A",
  black1: "#2A2A2A",
  black2: "#3B3B3B",
  error1: "#DC2626",
  error2: "#FECACA",
  warning1: "#F59E0B",
  silver1: "#E8E2DA",
  silver2: "#938C84",
  silver4: "#6B635B",
  specialColor: "#FFD27A",
};
const sunriseDark: Palette = {
  primary: "#FDBA74",
  primary2: "#FDBA7433",
  secondary: "#F59E0B",
  tertiary: "#F97316",
  quaternary: "#FB923C",
  success1: "#34D399",
  success2: "#0B3A2A",
  white1: "#161311",
  white2: "#201A16",
  white3: "#2B221B",
  black1: "#F5F2EE",
  black2: "#E2D9D0",
  error1: "#F87171",
  error2: "#3A1414",
  warning1: "#F59E0B",
  silver1: "#5A4F46",
  silver2: "#B9A89A",
  silver4: "#CAB6A4",
  specialColor: "#FFD27A",
};

// ===== MIDNIGHT =====
const midnightLight: Palette = {
  primary: "#1E3A8A",
  primary2: "#1E3A8A33",
  secondary: "#3B82F6",
  tertiary: "#60A5FA",
  quaternary: "#7C3AED",
  success1: "#10B981",
  success2: "#E7FFF1",
  white1: "#F7FAFC",
  white2: "#EEF2F7",
  white3: "#E6EAF0",
  black1: "#1A2230",
  black2: "#2A3446",
  error1: "#DC2626",
  error2: "#FFE8E8",
  warning1: "#F59E0B",
  silver1: "#D6DFEA",
  silver2: "#91A0B6",
  silver4: "#5C6B83",
  specialColor: "#8AB4F8",
};
const midnightDark: Palette = {
  primary: "#0B1220",
  primary2: "#0B122033",
  secondary: "#1E40AF",
  tertiary: "#312E81",
  quaternary: "#6D28D9",
  success1: "#10B981",
  success2: "#06281E",
  white1: "#0C1018",
  white2: "#121926",
  white3: "#172132",
  black1: "#E6EDF7",
  black2: "#C6D1E4",
  error1: "#F87171",
  error2: "#31141A",
  warning1: "#D97706",
  silver1: "#2B3447",
  silver2: "#8A99B4",
  silver4: "#A8B4CC",
  specialColor: "#7AA2F7",
};

// ===== EMERALD (fresh green) =====
const emeraldLight: Palette = {
  primary: "#059669",
  primary2: "#05966933",
  secondary: "#34D399",
  tertiary: "#6EE7B7",
  quaternary: "#10B981",
  success1: "#16A34A",
  success2: "#D1FAE5",
  white1: "#FFFFFF",
  white2: "#F8FFFB",
  white3: "#ECFDF5",
  black1: "#1F2937",
  black2: "#374151",
  error1: "#DC2626",
  error2: "#FFE4E6",
  warning1: "#F59E0B",
  silver1: "#E5E7EB",
  silver2: "#9CA3AF",
  silver4: "#6B7280",
  specialColor: "#A7F3D0",
};
const emeraldDark: Palette = {
  primary: "#34D399",
  primary2: "#34D39933",
  secondary: "#10B981",
  tertiary: "#059669",
  quaternary: "#22C55E",
  success1: "#22C55E",
  success2: "#0B2E22",
  white1: "#0C1110",
  white2: "#111816",
  white3: "#14201B",
  black1: "#E6F4EE",
  black2: "#CFEADF",
  error1: "#F87171",
  error2: "#2B1718",
  warning1: "#D97706",
  silver1: "#20352E",
  silver2: "#93B1A4",
  silver4: "#A7C7BA",
  specialColor: "#7EEAD3",
};

// ===== OCEAN (aqua/teal-blue) =====
const oceanLight: Palette = {
  primary: "#0EA5E9",
  primary2: "#0EA5E933",
  secondary: "#06B6D4",
  tertiary: "#22D3EE",
  quaternary: "#14B8A6",
  success1: "#22C55E",
  success2: "#DFFAF5",
  white1: "#F8FEFF",
  white2: "#EFF9FF",
  white3: "#E6F6FE",
  black1: "#1F2A33",
  black2: "#2B3945",
  error1: "#DC2626",
  error2: "#FFE8E8",
  warning1: "#F59E0B",
  silver1: "#D4E7F0",
  silver2: "#7FA6B8",
  silver4: "#557587",
  specialColor: "#7DD3FC",
};
const oceanDark: Palette = {
  primary: "#06B6D4",
  primary2: "#06B6D433",
  secondary: "#0EA5E9",
  tertiary: "#0891B2",
  quaternary: "#0D9488",
  success1: "#22C55E",
  success2: "#0A2728",
  white1: "#081018",
  white2: "#0D1620",
  white3: "#112131",
  black1: "#DCEBFA",
  black2: "#BFD9F0",
  error1: "#F87171",
  error2: "#1E262F",
  warning1: "#D97706",
  silver1: "#203041",
  silver2: "#7FA6B8",
  silver4: "#9AB8C8",
  specialColor: "#67E8F9",
};

// ===== FOREST (deep earthy green) =====
const forestLight: Palette = {
  primary: "#166534",
  primary2: "#16653433",
  secondary: "#4D7C0F",
  tertiary: "#84CC16",
  quaternary: "#22C55E",
  success1: "#16A34A",
  success2: "#E8F7EA",
  white1: "#FFFFFF",
  white2: "#F7FBF7",
  white3: "#EDF6ED",
  black1: "#1F2A24",
  black2: "#2C3A31",
  error1: "#B91C1C",
  error2: "#FCE2E2",
  warning1: "#D97706",
  silver1: "#DDE6DD",
  silver2: "#8FA190",
  silver4: "#607061",
  specialColor: "#B7E4C7",
};
const forestDark: Palette = {
  primary: "#22C55E",
  primary2: "#22C55E33",
  secondary: "#84CC16",
  tertiary: "#166534",
  quaternary: "#4D7C0F",
  success1: "#16A34A",
  success2: "#0D2415",
  white1: "#0B130D",
  white2: "#111B12",
  white3: "#152116",
  black1: "#E6F2EA",
  black2: "#CBE4D1",
  error1: "#F87171",
  error2: "#2E1717",
  warning1: "#CA8A04",
  silver1: "#243226",
  silver2: "#8FB39A",
  silver4: "#A7C7B0",
  specialColor: "#94D3AC",
};

// ===== ROSE (pinkish accent) =====
const roseLight: Palette = {
  primary: "#E11D48",
  primary2: "#E11D4833",
  secondary: "#F43F5E",
  tertiary: "#FB7185",
  quaternary: "#F472B6",
  success1: "#16A34A",
  success2: "#EAF7EF",
  white1: "#FFF7FA",
  white2: "#FFEFF4",
  white3: "#FFE4ED",
  black1: "#2A1F25",
  black2: "#3A2A32",
  error1: "#DC2626",
  error2: "#FECACA",
  warning1: "#F59E0B",
  silver1: "#F1DFE5",
  silver2: "#A68A94",
  silver4: "#7B616B",
  specialColor: "#FDA4AF",
};
const roseDark: Palette = {
  primary: "#FB7185",
  primary2: "#FB718533",
  secondary: "#F43F5E",
  tertiary: "#E11D48",
  quaternary: "#F472B6",
  success1: "#22C55E",
  success2: "#2A0F16",
  white1: "#160D10",
  white2: "#1E1217",
  white3: "#271820",
  black1: "#F7E6EC",
  black2: "#EBCAD4",
  error1: "#F87171",
  error2: "#3A1414",
  warning1: "#D97706",
  silver1: "#3A2830",
  silver2: "#C7A6B2",
  silver4: "#E0C4CF",
  specialColor: "#FBCFE8",
};

// ===== SAND (warm neutral) =====
const sandLight: Palette = {
  primary: "#A16207",
  primary2: "#A1620733",
  secondary: "#D97706",
  tertiary: "#F59E0B",
  quaternary: "#EAB308",
  success1: "#16A34A",
  success2: "#F0FBEF",
  white1: "#FFFBF3",
  white2: "#FEF7E8",
  white3: "#F5EDDA",
  black1: "#2F2616",
  black2: "#463A21",
  error1: "#B91C1C",
  error2: "#FADAD6",
  warning1: "#D97706",
  silver1: "#E8E0D3",
  silver2: "#9B8E7B",
  silver4: "#6F6558",
  specialColor: "#FFE3A3",
};
const sandDark: Palette = {
  primary: "#D4A017",
  primary2: "#D4A01733",
  secondary: "#EAB308",
  tertiary: "#A16207",
  quaternary: "#D97706",
  success1: "#22C55E",
  success2: "#1C170C",
  white1: "#161208",
  white2: "#1E190E",
  white3: "#27200F",
  black1: "#F5EDDA",
  black2: "#E7D8B7",
  error1: "#F87171",
  error2: "#3A2B1D",
  warning1: "#F59E0B",
  silver1: "#3B3428",
  silver2: "#B9A98E",
  silver4: "#D4C6AA",
  specialColor: "#FFE3A3",
};

export const colors: Record<ThemeName, ThemeVariant> = {
  default: { light: defaultLight, dark: defaultDark },
  sunrise: { light: sunriseLight, dark: sunriseDark },
  midnight: { light: midnightLight, dark: midnightDark },
  emerald: { light: emeraldLight, dark: emeraldDark },
  ocean: { light: oceanLight, dark: oceanDark },
  forest: { light: forestLight, dark: forestDark },
  rose: { light: roseLight, dark: roseDark },
  sand: { light: sandLight, dark: sandDark },
};

// helper optional
export function pickTheme(themeName: ThemeName, isDark: boolean): Palette {
  const v = colors[themeName] ?? colors.default;
  return isDark ? v.dark : v.light;
}
