"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Taskbar from "@/components/desktop/Taskbar";
import Window from "@/components/desktop/Window"; 
import { initialWindowState } from "@/config/windowState";
import { desktopApps } from "@/config/apps";
import DesktopEasterEgg from "@/components/desktop/DesktopEasterEgg";
import { ChromeApp, ChromeTitleBar } from "@/components/apps/ChromeApp";
import { MusicApp, MusicTitleBar } from "@/components/apps/MusicApp";
import type { MusicRelease } from "@/components/apps/MusicApp";
import { releasedTracks } from "@/components/apps/musicLibrary";


export default function DesktopManager() {
    const [windows, setWindows] = useState(initialWindowState);
    const taskbarIconElements = useRef<Partial<Record<keyof typeof windows, HTMLDivElement | null>>>({});
    const windowElements = useRef<Partial<Record<keyof typeof windows, HTMLDivElement | null>>>({});
    const [restoringAppId, setRestoringAppId] = useState<keyof typeof windows | null>(null);
    const [maximizingAppId, setMaximizingAppId] = useState<keyof typeof windows | null>(null);
    const maximizeAnimationCleanup = useRef<(() => void) | null>(null);
    const [chromeTab, setChromeTab] = useState<"merch" | "about">("merch");
    const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
    const [musicView, setMusicView] = useState<"recently-added" | "albums" | "songs" | "artists">("recently-added");
    const [musicSearch, setMusicSearch] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(70);
    const [sessionTracks, setSessionTracks] = useState<MusicRelease[]>([]);

    const musicLibrary = [...releasedTracks, ...sessionTracks];


const activeTrack =
  musicLibrary.flatMap((release) =>
    release.tracks.map((track) => ({
      ...track,
      artist: release.artist,
      cover: release.cover,
      source: release.source,
    }))
  ).find((track) => track.id === activeTrackId) ?? null;

const [minimizeTransforms, setMinimizeTransforms] = useState<
  Partial<Record<keyof typeof windows, string>>
>({});

const [restoreFrom, setRestoreFrom] = useState<
  Partial<Record<keyof typeof windows, { x: number; y: number } | null>>
>({});

const [isResizingWindow, setIsResizingWindow] = useState<
  Partial<Record<keyof typeof windows, boolean>>
>({});

const taskbarIconRefs: Partial<Record<keyof typeof windows, (element: HTMLDivElement | null) => void>> = {
  terminal: (element) => {
    taskbarIconElements.current.terminal = element;
  },
  chrome: (element) => {
    taskbarIconElements.current.chrome = element;
  },
  music: (element) => {
    taskbarIconElements.current.music = element;
  },
};


useLayoutEffect(() => {
  if (!restoringAppId) return;

  const restorePoint = restoreFrom[restoringAppId];
  const windowElement = windowElements.current[restoringAppId];

  if (!restorePoint || !windowElement || windows[restoringAppId].isMinimized) return;

  const windowRect = windowElement.getBoundingClientRect();
  const windowCenterX = windowRect.left + windowRect.width / 2;
  const windowCenterY = windowRect.top + windowRect.height / 2;

  const deltaX = restorePoint.x - windowCenterX;
  const deltaY = restorePoint.y - windowCenterY;

  windowElement.style.transition = "none";
  windowElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
  windowElement.style.transformOrigin = "center center";

  void windowElement.getBoundingClientRect();

  const frame = requestAnimationFrame(() => {
    windowElement.style.transition = "transform 0.22s ease-in-out";
    windowElement.style.transform = "translate(0px, 0px) scale(1)";
  });

  const timeout = setTimeout(() => {
    setRestoreFrom((prev) => ({
      ...prev,
      [restoringAppId]: null,
    }));
    setRestoringAppId(null);

    windowElement.style.transition = "";
    windowElement.style.transform = "";
    windowElement.style.transformOrigin = "";
  }, 240);


  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(timeout);
  };
}, [restoringAppId, restoreFrom, windows]);

const renderAppContent = (appId: keyof typeof windows) => {
  switch (appId) {
    case "chrome":
      return <ChromeApp activeTab={chromeTab} />;

    case "music":
      return (
        <MusicApp
          tracks={musicLibrary}
          activeTrackId={activeTrackId}
          activeView={musicView}
          searchQuery={musicSearch}
          onSelectTrack={(id) => {
            setActiveTrackId(id);
            setIsPlaying(true);
          }}
          onViewChange={setMusicView}
        />
      );

    default:
      return <div>{appId} Window</div>;
  }
};

                                                                                        //openapp
                                                                                    
const openApp = (appId: keyof typeof windows) => {

  const appConfig = desktopApps.find((app) => app.id === appId);
  const defaultWidth = appConfig?.defaultWidth ?? 900;
  const defaultHeight = appConfig?.defaultHeight ?? 600;

  const targetBefore = windows[appId];
  if (targetBefore.isFocused && targetBefore.isOpen && !targetBefore.isMinimized) {
    minimizeApp(appId);
    return;
  }

  if (targetBefore.isMinimized) {
    const taskbarIconElement = taskbarIconElements.current[appId];

    if (taskbarIconElement) {
      const iconRect = taskbarIconElement.getBoundingClientRect();
      const iconCenterX = iconRect.left + iconRect.width / 2;
      const iconCenterY = iconRect.top + iconRect.height / 2;

      setRestoreFrom((prev) => ({
        ...prev,
        [appId]: { x: iconCenterX, y: iconCenterY },
      }));

      setRestoringAppId(appId);
    }
  }

  setWindows((prev) => {
    const updatedWindows = { ...prev };
    const targetWindow = updatedWindows[appId];
    const highestZIndex = Math.max(
    
      0,
      ...Object.values(updatedWindows).map((window) => window.zIndex ?? 0)
    );

    (Object.keys(updatedWindows) as (keyof typeof updatedWindows)[]).forEach((id) => {
      updatedWindows[id] = {
        ...updatedWindows[id],
        isFocused: false,
      };
    });

    if (!targetWindow.isOpen) {
      const centeredX = Math.max(0, (window.innerWidth - defaultWidth) / 2);
      const centeredY = Math.max(0, (window.innerHeight - 48 - defaultHeight) / 2);
    
      updatedWindows[appId] = {
        ...targetWindow,
        isOpen: true,
        isMinimized: false,
        isFocused: true,
        isOpening: true,
        x: centeredX,
        y: centeredY,
        zIndex: highestZIndex + 1,
  };
    } else if (targetWindow.isMinimized) {
      updatedWindows[appId] = {
        ...targetWindow,
        isMinimized: false,
        isFocused: true,
        isOpening: false,
        zIndex: highestZIndex + 1,
      };
    } else if (targetWindow.isFocused) {
      minimizeApp(appId);
      return prev;
    }

    return updatedWindows;
  });
};
                                                            // focusapp


const focusApp = (appId: keyof typeof windows) => {
  setWindows((prev) => {
    const updated = { ...prev };

    const highestZIndex = Math.max(
      0,
      ...Object.values(updated).map((window) => window.zIndex)
    );

    (Object.keys(updated) as (keyof typeof updated)[]).forEach((id) => {
      updated[id] = {
        ...updated[id],
        isFocused: id === appId,
      };
    });

    updated[appId] = {
      ...updated[appId],
      isFocused: true,
      zIndex: highestZIndex + 1,
    };

    return updated;
  });
};


                                                                                            //dragging

const startDrag = (
  event: React.MouseEvent<HTMLDivElement>,
  appId: keyof typeof windows
) => {
  focusApp(appId);

  if (windows[appId].isMaximized) return;

  const windowElement = event.currentTarget.parentElement;

  if (!windowElement) return;

  const rect = windowElement.getBoundingClientRect();

  setDragState({
    appId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
  });
};
type DragState = {
  appId: keyof typeof windows;
  offsetX: number;
  offsetY: number;
} | null;

const [dragState, setDragState] = useState<DragState>(null);

useEffect(() => {
  if (!dragState) return;

  const handleMouseMove = (event: MouseEvent) => {
    setWindows((prev) => ({
      ...prev,
      [dragState.appId]: {
        ...prev[dragState.appId],
        x: event.clientX - dragState.offsetX,
        y: event.clientY - dragState.offsetY,
      },
    }));
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
}, [dragState]);

useEffect(() => {
  const openingApps = (Object.keys(windows) as (keyof typeof windows)[]).filter(
    (id) => windows[id].isOpening
  );

  if (openingApps.length === 0) return;

  const timeout = setTimeout(() => {
    setWindows((prev) => {
      const updated = { ...prev };

      openingApps.forEach((id) => {
        updated[id] = {
          ...updated[id],
          isOpening: false,
        };
      });

      return updated;
    });
  }, 180);

  return () => clearTimeout(timeout);
}, [windows]);

                                                                              //closeapp
const closeApp = (appId: keyof typeof windows) => {
  setWindows((prev) => ({
    ...prev,
    [appId]: {
      ...prev[appId],
      isClosing: true,
      isFocused: false,
    },
  }));

  setTimeout(() => {
    setWindows((prev) => {
      const updatedWindows = {
        ...prev,
        [appId]: {
          ...prev[appId],
          isOpen: false,
          isMinimized: false,
          isFocused: false,
          isMaximized: false,
          isClosing: false,
        },
      };

      const fallbackApp = (Object.keys(updatedWindows) as (keyof typeof updatedWindows)[]).find(
        (id) => id !== appId && updatedWindows[id].isOpen && !updatedWindows[id].isMinimized
      );

      if (fallbackApp) {
        updatedWindows[fallbackApp] = {
          ...updatedWindows[fallbackApp],
          isFocused: true,
        };
      }

      return updatedWindows;
    });
  }, 180);
};

                                                                                    //minimizeapp


const minimizeApp = (appId: keyof typeof windows) => {
  const windowElement = windowElements.current[appId];
  const taskbarIconElement = taskbarIconElements.current[appId];

  if (!windowElement || !taskbarIconElement) return;

  const windowRect = windowElement.getBoundingClientRect();
  const iconRect = taskbarIconElement.getBoundingClientRect();

  const windowCenterX = windowRect.left + windowRect.width / 2;
  const windowCenterY = windowRect.top + windowRect.height / 2;

  const iconCenterX = iconRect.left + iconRect.width / 2;
  const iconCenterY = iconRect.top + iconRect.height / 2;

  const deltaX = iconCenterX - windowCenterX;
  const deltaY = iconCenterY - windowCenterY;

  const minimizeTransform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
  
  setMinimizeTransforms((prev) => ({
    ...prev,
    [appId]: minimizeTransform,
  }));

  setWindows((prev) => {
    const updatedWindows = {
      ...prev,
      [appId]: {
        ...prev[appId],
        isMinimizing: true,
        isFocused: false,
      },
    };

    const fallbackApp = (Object.keys(updatedWindows) as (keyof typeof updatedWindows)[]).find(
      (id) =>
        id !== appId &&
        updatedWindows[id].isOpen &&
        !updatedWindows[id].isMinimized
    );

    if (fallbackApp) {
      updatedWindows[fallbackApp] = {
        ...updatedWindows[fallbackApp],
        isFocused: true,
      };
    }

    return updatedWindows;
  });

  setTimeout(() => {
    setWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isMinimized: true,
        isMinimizing: false,
      },
    }));

    setMinimizeTransforms((prev) => ({
      ...prev,
      [appId]: undefined,
    }));
  }, 180);
};


                                                                                    //maximize app

const maximizeApp = (appId: keyof typeof windows) => {
  const windowElement = windowElements.current[appId];
  if (!windowElement) return;

  maximizeAnimationCleanup.current?.();

  const firstRect = windowElement.getBoundingClientRect();

  setMaximizingAppId(appId);

  setWindows((prev) => {
    const updatedWindows = { ...prev };
    const highestZIndex = Math.max(
      0,
      ...Object.values(updatedWindows).map((window) => window.zIndex ?? 0)
    );

    (Object.keys(updatedWindows) as (keyof typeof updatedWindows)[]).forEach((id) => {
      updatedWindows[id] = {
        ...updatedWindows[id],
        isFocused: false,
      };
    });

    updatedWindows[appId] = {
      ...updatedWindows[appId],
      isMaximized: !updatedWindows[appId].isMaximized,
      isFocused: true,
      isMinimized: false,
      zIndex: highestZIndex + 1,
    };

    return updatedWindows;
  });

  requestAnimationFrame(() => {
    const element = windowElements.current[appId];
    if (!element) return;

    const lastRect = element.getBoundingClientRect();

    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.top - lastRect.top;
    const scaleX = firstRect.width / lastRect.width;
    const scaleY = firstRect.height / lastRect.height;

    element.style.transition = "none";
    element.style.transformOrigin = "top left";
    element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
    element.style.filter = "blur(2px)";

    void element.getBoundingClientRect();

    const frame = requestAnimationFrame(() => {
      element.style.transition =
        "transform 0.18s ease, filter 0.12s ease";
      element.style.transform = "translate(0px, 0px) scale(1, 1)";
      element.style.filter = "blur(5px)";
    });

    const timeout = setTimeout(() => {
      element.style.transition = "";
      element.style.transform = "";
      element.style.transformOrigin = "";
      element.style.filter = "";
      setMaximizingAppId(null);
    }, 220);

    maximizeAnimationCleanup.current = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      element.style.transition = "";
      element.style.transform = "";
      element.style.transformOrigin = "";
      element.style.filter = "";
      setMaximizingAppId(null);
    };
  });
};


return (
  <>
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        paddingBottom: "48px",
      }}
    >
      <div 
        style={{ 
          position: "relative",
          width: "100%",
          height: "100%",
        }} 
      > 
          {desktopApps
            .filter((app) => windows[app.id].isOpen && !windows[app.id].isMinimized) 
            .map((app) => {
                const defaultWidth = app.defaultWidth ?? 900;
                const defaultHeight = app.defaultHeight ?? 600;

                return (
              <div
                key={app.id}
                ref={(element) => {
                    windowElements.current[app.id] = element;
                }}
                onMouseDown={() => focusApp(app.id)}
                style={{
                  position: windows[app.id].isMaximized ? "fixed" : "absolute",
                  top: windows[app.id].isMaximized ? "0px" : `${windows[app.id].y}px`,
                  left: windows[app.id].isMaximized ? "0px" : `${windows[app.id].x}px`,
                  width: windows[app.id].isMaximized ? "100vw" : `${defaultWidth}px`,
                  height: windows[app.id].isMaximized ? "calc(100vh - 48px)" : `${defaultHeight}px`,
                  zIndex: windows[app.id].zIndex,
                  userSelect: "none",
                  transform: windows[app.id].isMinimizing
                    ? minimizeTransforms[app.id] ?? "translate(0px, 0px) scale(1)"
                    : "translate(0px, 0px) scale(1)",
                  transition: dragState?.appId === app.id
                    ? "none"
                    : windows[app.id].isMinimizing
                      ? "transform 0.18s ease"
                      : "top 0.18s ease, left 0.18s ease, width 0.18s ease, height 0.18s ease, filter 0.12s ease",
                  filter: isResizingWindow[app.id] ? "blur(2px)" : "blur(0px)",
                  transformOrigin: "center center",
}}
                >
                <Window
                  title={app.title}
                  icon={app.icon}
                  isFocused={windows[app.id].isFocused}
                  isMaximized={windows[app.id].isMaximized}
                  isClosing={windows[app.id].isClosing}
                  isOpening={windows[app.id].isOpening}
                  isMinimizing={windows[app.id].isMinimizing}
                  borderRadius="10px"
                  titleBarBackground="#f3f3f3"
                  titleBarContent={
                    app.id === "chrome" ? (
                      <ChromeTitleBar
                        activeTab={chromeTab}
                        onTabChange={setChromeTab}
                      />
                    ) : app.id === "music" ? (
                      <MusicTitleBar
                        activeTrack={activeTrack}
                        isPlaying={isPlaying}
                        volume={volume}
                        searchQuery={musicSearch}
                        onPrev={() => {}}
                        onPlayPause={() => setIsPlaying((p) => !p)}
                        onNext={() => {}}
                        onVolumeChange={setVolume}
                        onSearchChange={setMusicSearch}
                      />
                    ) : undefined
                  }
                  windowBackground="#ffffff"
                  onTitleBarMouseDown={(event) => startDrag(event, app.id)}
                  onTitleBarDoubleClick={() => maximizeApp(app.id)}
                  onMinimize={() => minimizeApp(app.id)}
                  onMaximize={() => maximizeApp(app.id)}
                  onClose={() => closeApp(app.id)}
                >
                  {renderAppContent(app.id)}
                </Window>
              </div>
          );
        })}

        {!windows.chrome.isOpen && !windows.music.isOpen && !windows.terminal.isOpen && ( 
          <div
            style={{
              fontSize: "32px",
              fontFamily: "Segoe UI, Arial, sans-serif",
              color: "white",
            }}
          >
          </div>
        )}

      </div> 
    </div>

<DesktopEasterEgg />

    <Taskbar openApp={openApp} windows={windows} iconRefs={taskbarIconRefs} />
    </>
  );
}