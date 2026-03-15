import { useState } from "react";
import type { AppId } from "@/types/apps";
import type { WindowState } from "@/types/windows";

type TaskbarIconProps = {
  id: AppId;
  title: string;
  icon: string;
  windowState: WindowState;
  onClick: (appId: AppId) => void;
};

export default function TaskbarIcon({
  id,
  title,
  icon,
  windowState,
  onClick,
}: TaskbarIconProps) {

const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      style={{
        position: "relative",
        width: "40px",
        height: "40px",
      }}
    >
      <button
        onClick={() => onClick(id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "40px",
          height: "40px",
          border: "none",
          background: windowState.isFocused
            ? isHovered
                ? "rgba(255,255,255,0.18)"
                : "rgba(255,255,255,0.14)"
            : isHovered
                ? "rgba(255,255,255,0.06)"
                : windowState.isOpen
                    ? "transparent"
                    : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          cursor: "default",
          transition: "background 0.15s ease, transform 0.1s ease",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        aria-label={title}
      >
        <img
          src={icon}
          alt={title}
          style={{ width: "27px", height: "27px" }}
        />
      </button>

      {windowState.isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "-2px",
            left: "50%",
            transform: "translateX(-50%)",
            width: windowState.isFocused ? "18px" : "10px",
            height: "3px",
            backgroundColor: "white",
            borderRadius: "999px",
            transition: "width 0.15s ease",
          }}
        />
      )}
    </div>
  );
}