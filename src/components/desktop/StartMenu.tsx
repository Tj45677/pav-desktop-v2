import { useEffect, useRef } from "react";

type StartMenuProps = {
  onClose: () => void;
};

const links = [
  { label: "Spotify", href: "https://open.spotify.com", icon: "/spotify.png" },
  { label: "Apple Music", href: "https://music.apple.com", icon: "/applemusic.webp" },
  { label: "YouTube", href: "https://youtube.com", icon: "/youtube.png" },
  { label: "Instagram", href: "https://instagram.com", icon: "/instagram.png" },
];

export default function StartMenu({ onClose }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [onClose]);

const animationStyle = `
@keyframes startMenuIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}
`;

  return (
    <>
  <style>{animationStyle}</style>
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        bottom: "56px",
        left: "10px",
        width: "320px",
        background: "rgba(25, 25, 25, 0.42)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        padding: "14px",
        zIndex: 2000,
        color: "white",
        fontFamily: '"Segoe UI Variable", "Segoe UI", Arial, sans-serif',
        opacity: 1,
        transform: "translateY(0px) scale(1)",
        animation: "startMenuIn 160ms ease-out",
        userSelect: "none"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <img
          src="/logo1.png"
          alt="President"
          style={{
            height: "28px",
            width: "auto",
            display: "block",
            opacity: 0.62,
            filter: "brightness(0.82)",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: "none",
              color: "white",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px",
              padding: "10px 12px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              src={link.icon}
              alt={link.label}
              style={{
                width: "18px",
                height: "18px",
                objectFit: "contain",
                display: "block",
              }}
            />
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
    </>
  );
}