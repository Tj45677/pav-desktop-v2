import { useState } from "react";
import { desktopApps } from "@/config/apps";
import TaskbarIcon from "./TaskbarIcon";
import type { AppId } from "@/types/apps";
import type { WindowStateMap } from "@/types/windows";


type TaskbarProps = {
  openApp: (appId: AppId) => void;
  windows: WindowStateMap;
};

export default function Taskbar({ openApp, windows }: TaskbarProps) {
    const taskbarApps = desktopApps.filter((app) => app.showInTaskbar);
    const [isStartHovered, setIsStartHovered] = useState(false);

    return (
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
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            style={{
                width: "40px",
                height: "40px",
                border: "none",
                background: isStartHovered ? "rgba(255, 255, 255, 0.06)" : "transparent",
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
            />
        ))}

      </div>

      <div
        style={{
          color: "white",
          fontSize: "12px",
          fontFamily: '"Segoe UI Variable", "Segoe UI", Arial, sans-serif',
        }}
      >
        System Tray
      </div>
    </div>
  );
}