"use client";

import { useEffect, useRef, useState } from "react";
import Taskbar from "@/components/desktop/Taskbar";
import Window from "@/components/desktop/Window"; 
import { initialWindowState } from "@/config/windowState";
import { desktopApps } from "@/config/apps";
import DesktopEasterEgg from "@/components/desktop/DesktopEasterEgg";

export default function DesktopManager() {
    const [windows, setWindows] = useState(initialWindowState);
    const taskbarIconElements = useRef<Partial<Record<keyof typeof windows, HTMLDivElement | null>>>({});
    const windowElements = useRef<Partial<Record<keyof typeof windows, HTMLDivElement | null>>>({});

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

const [minimizeTransforms, setMinimizeTransforms] = useState<
  Partial<Record<keyof typeof windows, string>>
>({});

const openApp = (appId: keyof typeof windows) => {
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
      updatedWindows[appId] = {
        ...targetWindow,
        isOpen: true,
        isMinimized: false,
        isFocused: true,
        isOpening: true,
        zIndex: highestZIndex + 1,
      };
    } else if (targetWindow.isMinimized) {
      updatedWindows[appId] = {
        ...targetWindow,
        isMinimized: false,
        isFocused: true,
        isOpening: true,
        zIndex: highestZIndex + 1,
      };
    } else if (targetWindow.isFocused) {
      updatedWindows[appId] = {
        ...targetWindow,
        isMinimized: true,
        isFocused: false,
        zIndex: highestZIndex + 1,
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
  } else {
  updatedWindows[appId] = {
    ...targetWindow,
    isFocused: true,
    zIndex: highestZIndex + 1,
  };
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
            .map((app) => (
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
                    width: windows[app.id].isMaximized ? "100vw" : "auto",
                    height: windows[app.id].isMaximized ? "calc(100vh - 48px)" : "auto",
                    zIndex: windows[app.id].zIndex,
                    userSelect: "none",
                    transform: windows[app.id].isMinimizing
                      ? minimizeTransforms[app.id] ?? "scale(1)"
                      : "translate(0px, 0px) scale(1)",
                    transition: windows[app.id].isMinimizing
                      ? "transform 0.18s ease"
                      : undefined,
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
              windowBackground="#ffffff"
              onTitleBarMouseDown={(event) => startDrag(event, app.id)}
              onTitleBarDoubleClick={() => maximizeApp(app.id)}
              onMinimize={() => minimizeApp(app.id)}
              onMaximize={() => maximizeApp(app.id)}
              onClose={() => closeApp(app.id)}
              >
              <div>{app.title} Window</div>
              </Window>
            </div>
            ))}

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