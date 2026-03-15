import { useState } from "react";

type WindowProps = {
  title: string;
  icon: string;
  isFocused: boolean;
  isMaximized?: boolean;
  borderRadius?: string;
  titleBarBackground?: string;
  windowBackground?: string;
  onMinimize?: () => void;  
  onMaximize?: () => void;  
  onClose?: () => void;
  onTitleBarMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onTitleBarDoubleClick?: () => void;
  children: React.ReactNode;
};

function MaximizeIcon() {
  return (
    <svg viewBox="0 0 10 10" width="15" height="15" aria-hidden="true">
      <rect
        x="1.5"
        y="1.5"
        width="7"
        height="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg viewBox="0 0 12 12" width="15" height="15" aria-hidden="true">
      {/* back window */}
      <path
        d="M3 1.5h6v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* front window */}
      <rect
        x="1.5"
        y="3"
        width="6"
        height="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function Window({
  title,
  icon,
  isFocused,
  isMaximized = false,
  borderRadius = "8px",
  titleBarBackground = "#f3f3f3",
  windowBackground = "#ffffff",
  onMinimize,
  onMaximize,
  onClose,
  onTitleBarMouseDown,
  onTitleBarDoubleClick,
  children,
}: WindowProps) {

    const [isMinHovered, setIsMinHovered] = useState(false);
    const [isMaxHovered, setIsMaxHovered] = useState(false);
    const [isCloseHovered, setIsCloseHovered] = useState(false);

  return (
    <div
      style={{
        width: isMaximized ? "100%" : "900px",
        height: isMaximized ? "100%" : "auto",
        maxWidth: isMaximized ? "100%" : "90vw",
        color: "black",
        border: isFocused ? "1px solid #cfcfcf" : "1px solid #888",
        boxShadow: isFocused
          ? "0 10px 30px rgba(0,0,0,0.35)"
          : "0 6px 18px rgba(0,0,0,0.22)",
        borderRadius: isMaximized ? "0px" : borderRadius,
        overflow: "hidden",
        backgroundColor: windowBackground,
      }}
    >
      <div
        onMouseDown={onTitleBarMouseDown}
        onDoubleClick={onTitleBarDoubleClick}
        style={{
          height: "42px",
          backgroundColor: titleBarBackground,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 0 0 12px",
          gap: "8px",
          fontFamily: '"Segoe UI Variable", "Segoe UI", Arial, sans-serif',
          fontSize: "13px",
        }}
    >
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
            }}
        >
        <img
          src={icon}
          alt={title}
          style={{ width: "16px", height: "16px" }}
        />
        <span>{title}</span>
      </div>
              <div
            style={{
                display: "flex",
                alignItems: "center"
            }}
            >

            
            <button
                onMouseDown={(event) => event.stopPropagation()}
                onClick={onMinimize}
                onMouseEnter={() => setIsMinHovered(true)}
                onMouseLeave={() => setIsMinHovered(false)}
                style={{
                width: "40px",
                height: "40px",
                border: "none",
                background: isMinHovered ? "#e5e5e5" : "transparent",
                color: "black",
                fontSize: "16px",
                cursor: "default",
                borderRadius: "null",
                top: "-3px",
                position: "relative",
                transition: "background 0.15s ease, color 0.15s ease",
            }}
            aria-label={`Minimize ${title}`}
          >
            —
          </button>



          <button
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMaximize}
            onMouseEnter={() => setIsMaxHovered(true)}
            onMouseLeave={() => setIsMaxHovered(false)}
            style={{
              width: "40px",
              height: "40px",
              border: "none",
              background: isMaxHovered ? "#e5e5e5" : "transparent",
              color: "black",
              fontSize: "17px",
              cursor: "default",
              borderRadius: "0px",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
            aria-label={`Maximize ${title}`}
          >
            {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
          </button>



          <button
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
            style={{
              width: "40px",
              height: "40px",
              border: "none",
              background: isCloseHovered ? "#e81123" : "transparent",
              color: isCloseHovered ? "white" : "black",
              fontSize: "16px",
              cursor: "default",
              borderRadius: "0px",
              position: "relative",
              top: "-3px",
              transition: "background 0.15s ease, color 0.15s ease",
              
            }}
            aria-label={`Close ${title}`}
          >
            ✕
          </button>
        </div>
      </div>

      <div
        style={{
          padding: "18px",
          fontFamily: '"Segoe UI Variable", "Segoe UI", Arial, sans-serif',
          fontSize: "16px",
          backgroundColor: windowBackground,
        }}
      >
        {children}
      </div>
    </div>

  );
}