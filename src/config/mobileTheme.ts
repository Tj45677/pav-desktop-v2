export type BaseMode = "light" | "dark";

export interface MobileThemeScheme {
  id: string;
  name: string;
  backgroundImage: string;
  logoImage: string;
  surfaceBg: string;
  pageBg: string;
  pageTextColor: string;
  textColor: string;
  buttonBg: string;
  buttonText: string;
  outlineColor: string;
  textOutline: string;
  drawerBg: string;
  drawerText: string;
  backdropColor: string;
}

function makeLetterStroke(outlineHex: string): string {
  return `-1.5px -1.5px 0 ${outlineHex}, 1.5px -1.5px 0 ${outlineHex}, -1.5px 1.5px 0 ${outlineHex}, 1.5px 1.5px 0 ${outlineHex}, 0 -1.5px 0 ${outlineHex}, 0 1.5px 0 ${outlineHex}, -1.5px 0 0 ${outlineHex}, 1.5px 0 0 ${outlineHex}`;
}

const LIGHT_OUTLINE = "#ffffff";
const DARK_OUTLINE = "#000000";

export const DEFAULT_LIGHT_THEME: MobileThemeScheme = {
  id: "light",
  name: "Light",
  backgroundImage: "/mobileBG.png",
  logoImage: "/logoMobile.png",
  surfaceBg: "#ebe8e1",
  pageBg: "#ffffff",
  pageTextColor: "#535353",
  textColor: "#535353",
  buttonBg: "transparent",
  buttonText: "#535353",
  outlineColor: LIGHT_OUTLINE,
  textOutline: makeLetterStroke(LIGHT_OUTLINE),
  drawerBg: "rgba(255, 255, 255, 0.06)",
  drawerText: "#535353",
  backdropColor: "transparent",
};

export const DEFAULT_DARK_THEME: MobileThemeScheme = {
  id: "dark",
  name: "Dark",
  backgroundImage: "/mobileBG_dark.png",
  logoImage: "/logoMobile_dark.png",
  surfaceBg: "#121212",
  pageBg: "#141414",
  pageTextColor: "#e6e6e6",
  textColor: "#e6e6e6",
  buttonBg: "transparent",
  buttonText: "#ffffff",
  outlineColor: DARK_OUTLINE,
  textOutline: makeLetterStroke(DARK_OUTLINE),
  drawerBg: "rgba(20, 20, 20, 0.14)",
  drawerText: "#ffffff",
  backdropColor: "transparent",
};

export const ALT_COLOR_SCHEMES: MobileThemeScheme[] = [
  {
    id: "alt-1",
    name: "Alt 1",
    backgroundImage: "/mobileBG_dark.png",
    logoImage: "/logoMobile.png",
    surfaceBg: "#241114",
    pageBg: "#141414",
    pageTextColor: "#f5e6e8",
    textColor: "#f5e6e8",
    buttonBg: "transparent",
    buttonText: "#ffffff",
    outlineColor: DARK_OUTLINE,
    textOutline: makeLetterStroke(DARK_OUTLINE),
    drawerBg: "rgba(20, 20, 20, 0.14)",
    drawerText: "#ffffff",
    backdropColor: "transparent",
  },
  {
    id: "alt-2",
    name: "Alt 2",
    backgroundImage: "/mobileBG.png",
    logoImage: "/logoMobile.png",
    surfaceBg: "#121d2b",
    pageBg: "#ffffff",
    pageTextColor: "#535353",
    textColor: "#e6eef8",
    buttonBg: "transparent",
    buttonText: "#535353",
    outlineColor: LIGHT_OUTLINE,
    textOutline: makeLetterStroke(LIGHT_OUTLINE),
    drawerBg: "rgba(255, 255, 255, 0.06)",
    drawerText: "#535353",
    backdropColor: "transparent",
  },
  {
    id: "alt-3",
    name: "Alt 3",
    backgroundImage: "/mobileBG_dark.png",
    logoImage: "/logoMobile_dark.png",
    surfaceBg: "#152217",
    pageBg: "#141414",
    pageTextColor: "#e7f3e8",
    textColor: "#e7f3e8",
    buttonBg: "transparent",
    buttonText: "#ffffff",
    outlineColor: DARK_OUTLINE,
    textOutline: makeLetterStroke(DARK_OUTLINE),
    drawerBg: "rgba(20, 20, 20, 0.14)",
    drawerText: "#ffffff",
    backdropColor: "transparent",
  },
  {
    id: "alt-4",
    name: "Alt 4",
    backgroundImage: "/mobileBG.png",
    logoImage: "/logoMobile.png",
    surfaceBg: "#291c0e",
    pageBg: "#ffffff",
    pageTextColor: "#535353",
    textColor: "#f8ede0",
    buttonBg: "transparent",
    buttonText: "#535353",
    outlineColor: LIGHT_OUTLINE,
    textOutline: makeLetterStroke(LIGHT_OUTLINE),
    drawerBg: "rgba(255, 255, 255, 0.06)",
    drawerText: "#535353",
    backdropColor: "transparent",
  },
  {
    id: "alt-5",
    name: "Alt 5",
    backgroundImage: "/mobileBG_dark.png",
    logoImage: "/logoMobile_dark.png",
    surfaceBg: "#1d1229",
    pageBg: "#141414",
    pageTextColor: "#efe6f8",
    textColor: "#efe6f8",
    buttonBg: "transparent",
    buttonText: "#ffffff",
    outlineColor: DARK_OUTLINE,
    textOutline: makeLetterStroke(DARK_OUTLINE),
    drawerBg: "rgba(20, 20, 20, 0.14)",
    drawerText: "#ffffff",
    backdropColor: "transparent",
  },
];

export function resolveActiveTheme(
  baseMode: BaseMode,
  altIndex: number | null
): MobileThemeScheme {
  if (altIndex !== null && ALT_COLOR_SCHEMES.length > 0) {
    return ALT_COLOR_SCHEMES[altIndex % ALT_COLOR_SCHEMES.length];
  }
  return baseMode === "dark" ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
}