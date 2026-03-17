import { useEffect, useState } from "react";
import { desktopApps } from "@/config/apps";
import TaskbarIcon from "./TaskbarIcon";
import type { AppId } from "@/types/apps";
import type { WindowStateMap } from "@/types/windows";
import StartMenu from "./StartMenu";


type TaskbarProps = {
  openApp: (appId: AppId) => void;
  windows: WindowStateMap;
  iconRefs?: Partial<Record<AppId, (element: HTMLDivElement | null) => void>>;
};

export default function Taskbar({ openApp, windows, iconRefs }: TaskbarProps) {
    const taskbarApps = desktopApps.filter((app) => app.showInTaskbar);
    const [isStartHovered, setIsStartHovered] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const formattedDate = currentTime.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
        <>
        {isStartMenuOpen && (
          <StartMenu onClose={() => setIsStartMenuOpen(false)} />
        )}
        <div
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "48px",
                background: "rgba(90, 90, 90, 0.15)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderTop: "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 10px",
                boxSizing: "border-box",
                userSelect: "none",
                zIndex: 9999,
            }}
        >
            <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <button

            onMouseEnter={() => setIsStartHovered(true)}
            onMouseLeave={(e) => {
                setIsStartHovered(false);
                e.currentTarget.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.currentTarget.style.transform = "scale(0.92)";
              setIsStartMenuOpen((prev) => !prev);
            }}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            style={{
                width: "40px",
                height: "40px",
                border: "none",
                background: isStartHovered ? "rgba(255, 255, 255, 0.10)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                cursor: "default",
                transition: "background 0.15s ease, transform 0.1s ease",
            }}
            aria-label="Start"
        >
          <img
            src="/windows.png"
            alt="Start"
            style={{ width: "27px", height: "27px" }}
          />
        </button>

        {taskbarApps.map((app) => (
          <TaskbarIcon
            key={app.id}
            id={app.id}
            title={app.title}
            icon={app.icon}
            windowState={windows[app.id]}
            onClick={openApp}
            iconRef={iconRefs?.[app.id]}
            />
        ))}

      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          color: "white",
          fontSize: "12px",
          fontFamily: '"Segoe UI Variable", "Segoe UI", Arial, sans-serif',
        }}
      >
        <span
          style={{
            cursor: "default",
            opacity: 0.8,
          }}
        >
          
        </span>
      
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            lineHeight: "1.2",
          }}
        >
          <span>{formattedTime}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
     </>
  );
}