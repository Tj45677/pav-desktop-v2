"use client";

import { useIsMobile } from "@/hooks/useIsMobile";

type DesktopShellProps = {
  children: React.ReactNode;
};

export default function DesktopShell({ children }: DesktopShellProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#ebe8e1",
        backgroundImage: "url('/LAWallpaper.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        fontFamily: "Consolas, monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </main>
  );
}