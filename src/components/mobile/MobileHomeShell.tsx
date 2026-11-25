"use client";

import React, { useEffect, useState } from "react";
import {
  ALT_COLOR_SCHEMES,
  BaseMode,
  resolveActiveTheme,
} from "@/config/mobileTheme";
import {
  DRAWER_NAV_ITEMS,
  HOME_PRIMARY_ITEMS,
  MobileRouteId,
  SOCIAL_LINKS,
} from "@/config/mobileNav";
import { designerFont } from "@/config/fonts";

interface MobileHomeShellProps {
  initialRoute?: MobileRouteId;
  baseMode: BaseMode;
  altThemeIndex: number | null;
  onToggleBaseMode: () => void;
  onEasterEggTap: () => void;
  onNavigateRoute?: (route: MobileRouteId) => void;
  renderPageContent?: (route: MobileRouteId) => React.ReactNode;
}

const SLIDE = "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)";
const ROOT = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100lvh",
  overflow: "hidden",
} as const;
const FILL = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
} as const;
const FONT = (d: typeof designerFont) =>
  `${d.style.fontFamily}, var(--font-designer), sans-serif`;

function SunWithLinesIcon({
  color = "#535353",
  outlineColor = "#ffffff",
}: {
  color?: string;
  outlineColor?: string;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      style={{ filter: `drop-shadow(0 0 1px ${outlineColor})` }}
    >
      <circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="2.2" />
      <line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth="2.2" />
      <line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth="2.2" />
      <line x1="2" y1="12" x2="5" y2="12" stroke={color} strokeWidth="2.2" />
      <line x1="19" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2.2" />
      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" stroke={color} strokeWidth="2.2" />
      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" stroke={color} strokeWidth="2.2" />
      <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" stroke={color} strokeWidth="2.2" />
      <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" stroke={color} strokeWidth="2.2" />
    </svg>
  );
}

function MoonCircleIcon({
  color = "#ffffff",
  outlineColor = "#000000",
}: {
  color?: string;
  outlineColor?: string;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      style={{ filter: `drop-shadow(0 0 1px ${outlineColor})` }}
    >
      <circle cx="12" cy="12" r="7.5" fill={color} />
    </svg>
  );
}

function RoundedOptionsIcon({
  fill = "#535353",
  outline = "#ffffff",
}: {
  fill?: string;
  outline?: string;
}) {
  return (
    <svg width="34" height="28" viewBox="0 0 36 28" aria-hidden="true">
      {[2, 10.75, 19.5].map((y) => (
        <rect
          key={y}
          x="2"
          y={y}
          width="32"
          height="6.5"
          rx="3.25"
          fill={fill}
          stroke={outline}
          strokeWidth="1.6"
        />
      ))}
    </svg>
  );
}

function ThemedSocialIcon({
  src,
  alt,
  fillHex,
  outlineHex,
}: {
  src: string;
  alt: string;
  fillHex: string;
  outlineHex: string;
}) {
  const isWhiteFill = fillHex.toLowerCase() === "#ffffff";
  const glow = `drop-shadow(0 0 1.2px ${outlineHex}) drop-shadow(0 0 1.2px ${outlineHex})`;

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: "24px",
        height: "24px",
        objectFit: "contain",
        filter: isWhiteFill
          ? `brightness(0) invert(1) ${glow}`
          : `brightness(0) saturate(100%) invert(33%) sepia(2%) saturate(245%) hue-rotate(314deg) brightness(96%) contrast(88%) ${glow}`,
      }}
    />
  );
}

export default function MobileHomeShell({
  initialRoute = "home",
  baseMode,
  altThemeIndex,
  onToggleBaseMode,
  onEasterEggTap,
  onNavigateRoute,
  renderPageContent,
}: MobileHomeShellProps) {
  const [activeRoute, setActiveRoute] = useState<MobileRouteId>(initialRoute);
  const [pullingRoute, setPullingRoute] = useState<MobileRouteId | null>(null);
  const [returningHome, setReturningHome] = useState(false);
  const [transitionStarted, setTransitionStarted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = resolveActiveTheme(baseMode, altThemeIndex);
  const modeKey = `${theme.id}-${theme.buttonText}-${theme.outlineColor}`;
  const isSubpageActive =
    activeRoute !== "home" && !pullingRoute && !returningHome;
  const edgeColor = isSubpageActive ? theme.pageBg : theme.surfaceBg;
  const isDarkTheme = theme.outlineColor === "#000000";
  const homeBackground = `${theme.surfaceBg} url(${theme.backgroundImage}) center / cover no-repeat`;

  useEffect(() => {
    if (!pullingRoute && !returningHome) {
      setTransitionStarted(false);
      return;
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setTransitionStarted(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [pullingRoute, returningHome]);

  const handleSelectRoute = (route: MobileRouteId) => {
    setDrawerOpen(false);

    if (route === activeRoute && !returningHome) return;

    if (route === "home") {
      if (activeRoute === "home") return;
      setPullingRoute(null);
      setTransitionStarted(false);
      setReturningHome(true);
      setTimeout(() => {
        setActiveRoute("home");
        setReturningHome(false);
        setTransitionStarted(false);
        onNavigateRoute?.("home");
      }, 560);
      return;
    }

    setReturningHome(false);
    setTransitionStarted(false);
    setPullingRoute(route);
    setTimeout(() => {
      setActiveRoute(route);
      setPullingRoute(null);
      setTransitionStarted(false);
      onNavigateRoute?.(route);
    }, 560);
  };

  return (
    <div
      className={designerFont.className}
      style={{
        ...ROOT,
        fontFamily: FONT(designerFont),
        background: isSubpageActive ? theme.pageBg : homeBackground,
        color: theme.textColor,
      }}
    >
      <style>{`
        html, body {
          margin: 0;
          height: 100%;
          overflow: hidden !important;
          overscroll-behavior: none;
          background: ${edgeColor} !important;
          color-scheme: ${isDarkTheme ? "dark" : "light"};
        }
      `}</style>

      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setDrawerOpen((prev) => !prev)}
        style={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top, 0px) + 18px)",
          right: "18px",
          zIndex: 40,
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <RoundedOptionsIcon
          fill={theme.buttonText}
          outline={theme.outlineColor}
        />
      </button>

      {(activeRoute === "home" || returningHome) && (
        <main
          style={{
            ...FILL,
            overflow: "hidden",
            zIndex: returningHome ? 22 : 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "20px",
            gap: "44px",
            background: returningHome ? homeBackground : "transparent",
            willChange: "transform",
            transform: returningHome
              ? transitionStarted
                ? "translate3d(0, 0, 0)"
                : "translate3d(-100%, 0, 0)"
              : "translate3d(0, 0, 0)",
            transition: returningHome ? SLIDE : "none",
          }}
        >
          {HOME_PRIMARY_ITEMS.map((item) => {
            const isPulling = pullingRoute === item.id;
            return (
              <button
                key={`${item.id}-${modeKey}`}
                type="button"
                onClick={() => handleSelectRoute(item.id)}
                style={{
                  alignSelf: "flex-start",
                  fontFamily: FONT(designerFont),
                  backgroundColor: theme.buttonBg,
                  color: theme.buttonText,
                  textShadow: theme.textOutline,
                  WebkitTextStroke: `1.2px ${theme.outlineColor}`,
                  paintOrder: "stroke fill",
                  border: "none",
                  padding: "4px 6px",
                  fontSize: "46px",
                  lineHeight: 0.95,
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  willChange: "transform",
                  transform:
                    isPulling && transitionStarted
                      ? "translate3d(115vw, 0, 0)"
                      : "translate3d(0, 0, 0)",
                  transition: isPulling ? SLIDE : "none",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </main>
      )}

      {(activeRoute === "home" || returningHome) && !pullingRoute && (
        <button
          type="button"
          onClick={onEasterEggTap}
          aria-label="President logo"
          style={{
            position: "fixed",
            right: "18px",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
            zIndex: 30,
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <img
            src={theme.logoImage}
            alt="president"
            style={{ height: "38px", width: "auto", objectFit: "contain" }}
          />
        </button>
      )}

      {pullingRoute && (
        <section
          aria-hidden="true"
          style={{
            ...FILL,
            zIndex: 25,
            background: theme.pageBg,
            color: theme.pageTextColor,
            willChange: "transform",
            transform: transitionStarted
              ? "translate3d(0, 0, 0)"
              : "translate3d(-100%, 0, 0)",
            transition: SLIDE,
          }}
        />
      )}

      {activeRoute !== "home" && !pullingRoute && (
        <section
          style={{
            ...FILL,
            zIndex: 20,
            overflowY: "auto",
            overflowX: "hidden",
            background: theme.pageBg,
            color: theme.pageTextColor,
            padding:
              "calc(env(safe-area-inset-top, 0px) + 72px) 18px calc(env(safe-area-inset-bottom, 0px) + 84px)",
            willChange: "transform",
            transform: returningHome
              ? transitionStarted
                ? "translate3d(100%, 0, 0)"
                : "translate3d(0, 0, 0)"
              : "translate3d(0, 0, 0)",
            transition: returningHome ? SLIDE : "none",
          }}
        >
          <button
            key={`back-${modeKey}`}
            type="button"
            onClick={() => handleSelectRoute("home")}
            style={{
              marginBottom: "16px",
              padding: "4px 10px",
              fontFamily: FONT(designerFont),
              backgroundColor: "transparent",
              color: theme.buttonText,
              textShadow: theme.textOutline,
              WebkitTextStroke: `1px ${theme.outlineColor}`,
              paintOrder: "stroke fill",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ← HOME
          </button>

          {renderPageContent ? (
            renderPageContent(activeRoute)
          ) : (
            <div>{activeRoute.toUpperCase()}</div>
          )}
        </section>
      )}

      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ ...FILL, zIndex: 45, background: theme.backdropColor }}
        />
      )}

      <aside
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: "52%",
          minWidth: "190px",
          zIndex: 50,
          background: theme.drawerBg,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: theme.drawerText,
          padding:
            "calc(env(safe-area-inset-top, 0px) + 115px) 18px calc(env(safe-area-inset-bottom, 0px) + 138px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transform: drawerOpen ? "translateX(0%)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "16px",
          }}
        >
          <button
            type="button"
            onClick={onToggleBaseMode}
            aria-label={
              baseMode === "light" ? "Turn on dark mode" : "Turn on light mode"
            }
            style={{
              background: "transparent",
              border: "none",
              color: theme.drawerText,
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {baseMode === "light" ? (
              <SunWithLinesIcon
                color={theme.drawerText}
                outlineColor={theme.outlineColor}
              />
            ) : (
              <MoonCircleIcon
                color={theme.drawerText}
                outlineColor={theme.outlineColor}
              />
            )}
          </button>

          {altThemeIndex !== null && ALT_COLOR_SCHEMES.length > 0 && (
            <div
              style={{
                fontSize: "11px",
                color: theme.drawerText,
                opacity: 0.85,
              }}
            >
              {ALT_COLOR_SCHEMES[altThemeIndex % ALT_COLOR_SCHEMES.length].name}
            </div>
          )}

          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "14px",
              marginTop: "6px",
            }}
          >
            {DRAWER_NAV_ITEMS.map((item) => (
              <button
                key={`${item.id}-${modeKey}`}
                type="button"
                onClick={() => handleSelectRoute(item.id)}
                style={{
                  textAlign: "right",
                  fontFamily: FONT(designerFont),
                  background: "transparent",
                  border: "none",
                  color: theme.drawerText,
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  padding: "2px 0",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: "6px",
          }}
        >
          {SOCIAL_LINKS.map((social) => (
            <a
              key={`${social.id}-${modeKey}`}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                flexShrink: 0,
              }}
            >
              <ThemedSocialIcon
                src={social.iconSrc}
                alt={social.label}
                fillHex={theme.buttonText}
                outlineHex={theme.outlineColor}
              />
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}