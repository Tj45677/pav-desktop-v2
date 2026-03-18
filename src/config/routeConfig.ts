export type StartupConfig = {
  openApps: ("terminal" | "music" | "chrome")[];
  focusedApp?: "terminal" | "music" | "chrome";
  chromeTab?: "merch" | "about";
};

export function getStartupConfig(pathname: string): StartupConfig {
  // normalize
  const path = pathname.toLowerCase();

  // terminal (portfolio)
  if (path.startsWith("/portfolio")) {
    return {
      openApps: ["terminal"],
      focusedApp: "terminal",
    };
  }

  // music
  if (path.startsWith("/music")) {
    return {
      openApps: ["music"],
      focusedApp: "music",
    };
  }

  // merch / about via chrome
  if (path.startsWith("/merch")) {
    return {
      openApps: ["chrome"],
      focusedApp: "chrome",
      chromeTab: "merch",
    };
  }

  if (path.startsWith("/about")) {
    return {
      openApps: ["chrome"],
      focusedApp: "chrome",
      chromeTab: "about",
    };
  }

  // default desktop
  return {
    openApps: [],
  };
}