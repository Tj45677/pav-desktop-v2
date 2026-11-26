"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import type { MusicRelease } from "@/components/apps/MusicApp";
import MobileMusicView, {
  ActivePlaybackState,
  MobileTrack,
  NextTrackIcon,
  PauseBarsIcon,
  PlayTriangleIcon,
  PrevTrackIcon,
  useAverageCoverColor,
} from "@/components/mobile/MobileMusicView";

interface MobileHomeShellProps {
  initialRoute?: MobileRouteId;
  baseMode: BaseMode;
  altThemeIndex: number | null;
  onToggleBaseMode: () => void;
  onEasterEggTap: () => void;
  onNavigateRoute?: (route: MobileRouteId) => void;
  renderPageContent?: (route: MobileRouteId) => React.ReactNode;
}

const SLIDE_MS = 550;
const DRAWER_MS = 420;
const SLIDE = `transform ${SLIDE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
const DRAWER_TRANSITION = `transform ${DRAWER_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;

// BLEED: how far the background extends above the screen (Claude's fix).
// SHIFT: how far the window is scrolled on load. A small window scroll is what
// Safari appears to need for a translucent top bar. Every layer is offset by
// BLEED + SHIFT, so after the scroll everything sits exactly on screen.
const BLEED = 200;
const SHIFT = 24;
const OFFSET = BLEED + SHIFT;

// Temporary: shows window.scrollY in the bottom-left. Set to false once tested.
const DEBUG_SCROLL = false;

const ROOT = {
  position: "absolute",
  top: `-${BLEED}px`,
  left: 0,
  width: "100%",
  height: `calc(100lvh + ${OFFSET}px)`,
  overflow: "hidden",
} as const;
// Full-height layers: they cover the strip behind Safari's top bar too.
// Anything with content inside adds OFFSET to its top padding, so the
// content still lands exactly where it did before.
const FILL = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
} as const;
const FONT = (d: typeof designerFont) =>
  `${d.style.fontFamily}, var(--font-designer), sans-serif`;
const MUSIC_FONT = `"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif`;

function formatSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const total = Math.floor(sec);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function ScrollReadout() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setY(Math.round(window.scrollY)), 250);
    return () => clearInterval(t);
  }, []);
  return <>scrollY: {y}</>;
}

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
  showOutline = true,
}: {
  fill?: string;
  outline?: string;
  showOutline?: boolean;
}) {
  const barHeight = showOutline ? 6.5 : 4.8;
  const barRadius = showOutline ? 3.25 : 2.4;
  const ys = showOutline ? [2, 10.75, 19.5] : [3.2, 11.6, 20];

  return (
    <svg width="32" height="28" viewBox="0 0 36 28" aria-hidden="true">
      {ys.map((y) => (
        <rect
          key={y}
          x="3"
          y={y}
          width="30"
          height={barHeight}
          rx={barRadius}
          fill={fill}
          stroke={showOutline ? outline : "none"}
          strokeWidth={showOutline ? 1.6 : 0}
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
  const [insideAlbum, setInsideAlbum] = useState(false);
  const [albumRgb, setAlbumRgb] = useState<string | null>(null);

  const [currentRelease, setCurrentRelease] = useState<MusicRelease | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playerDrawerMounted, setPlayerDrawerMounted] = useState<boolean>(false);
  const [playerDrawerActive, setPlayerDrawerActive] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const drawerCloseTimerRef = useRef<number | null>(null);

  // Follow the device's light/dark setting until the visitor taps the
  // sun/moon button themselves.
  const [deviceMode, setDeviceMode] = useState<BaseMode | null>(null);
  const userPickedModeRef = useRef(false);
  const requestedModeRef = useRef<BaseMode | null>(null);

  const activeTrack: MobileTrack | null = useMemo(() => {
    if (!currentRelease || !currentRelease.tracks.length) return null;
    return (currentRelease.tracks[currentTrackIndex] ??
      currentRelease.tracks[0] ??
      null) as MobileTrack | null;
  }, [currentRelease, currentTrackIndex]);

  const activeTrackId = activeTrack?.id ?? "";
  const activeTrackAudioSrc = activeTrack?.audioSrc ?? "";
  const playerAvgRgb = useAverageCoverColor(
    currentRelease?.cover ?? "/inauguration_cover.png"
  );
  const displayRgb = albumRgb ?? playerAvgRgb;

  const theme = resolveActiveTheme(baseMode, altThemeIndex);
  
  const modeKey = `${theme.id}-${theme.buttonText}-${theme.outlineColor}`;
  const isSubpageActive =
    activeRoute !== "home" && !pullingRoute && !returningHome;
  const isDarkTheme = theme.outlineColor === "#000000";
  const edgeColor = isSubpageActive
    ? insideAlbum && albumRgb
      ? `rgb(${albumRgb})`
      : theme.pageBg
    : theme.surfaceBg;
  const homeBackground = `${theme.surfaceBg} url(${theme.backgroundImage}) center top / cover no-repeat`;

  const subpageIconColor = insideAlbum
    ? "#ffffff"
    : isDarkTheme || baseMode === "dark"
      ? "#ffffff"
      : "#535353";

  // Scroll the window by SHIFT once, before the first paint, so the layout
  // never visibly jumps. No scroll listener (that caused the jitter before).
  // Turn off Safari's own scroll restoration so reloads behave the same every time.
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const apply = () => {
      window.scrollTo(0, SHIFT);
      if (window.scrollY !== SHIFT) {
        document.documentElement.scrollTop = SHIFT;
      }
    };
    apply();
    const t = window.setTimeout(apply, 300);
    window.addEventListener("orientationchange", apply);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const read = () => setDeviceMode(mq.matches ? "dark" : "light");
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  useLayoutEffect(() => {
    // Skip if we don't know the device mode yet, the visitor chose a mode,
    // or an easter-egg theme is active.
    if (deviceMode === null || userPickedModeRef.current || altThemeIndex !== null) {
      return;
    }
    if (baseMode === deviceMode) {
      requestedModeRef.current = null;
      return;
    }
    // Guard so a double-run (React dev mode) can't toggle twice and cancel out.
    if (requestedModeRef.current === deviceMode) return;
    requestedModeRef.current = deviceMode;
    onToggleBaseMode();
  }, [deviceMode, baseMode, altThemeIndex, onToggleBaseMode]);

  const handleUserToggleMode = () => {
    userPickedModeRef.current = true;
    onToggleBaseMode();
  };

  const openPlayerDrawer = () => {
    if (drawerCloseTimerRef.current) {
      window.clearTimeout(drawerCloseTimerRef.current);
      drawerCloseTimerRef.current = null;
    }
    setPlayerDrawerMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPlayerDrawerActive(true);
      });
    });
  };

  const closePlayerDrawer = () => {
    setPlayerDrawerActive(false);
    if (drawerCloseTimerRef.current) {
      window.clearTimeout(drawerCloseTimerRef.current);
    }
    drawerCloseTimerRef.current = window.setTimeout(() => {
      setPlayerDrawerMounted(false);
      drawerCloseTimerRef.current = null;
    }, DRAWER_MS);
  };

  useEffect(() => {
    return () => {
      if (drawerCloseTimerRef.current) {
        window.clearTimeout(drawerCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeRoute !== "music") {
      setInsideAlbum(false);
      setAlbumRgb(null);
    }
  }, [activeRoute]);

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrackAudioSrc) return;

    audio.src = encodeURI(activeTrackAudioSrc);
    audio.load();
    setCurrentTime(0);

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [activeTrackId, activeTrackAudioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrackAudioSrc) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, activeTrackAudioSrc]);

  const handlePlayTrack = (release: MusicRelease, index: number) => {
    if (!release.tracks[index]) return;
    const sameTrack =
      currentRelease?.id === release.id && currentTrackIndex === index;

    setCurrentRelease(release);
    setCurrentTrackIndex(index);

    if (sameTrack) {
      setIsPlaying((prev) => !prev);
    } else {
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (!currentRelease || !currentRelease.tracks.length) return;
    const nextIdx = (currentTrackIndex + 1) % currentRelease.tracks.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (!currentRelease || !currentRelease.tracks.length) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prevIdx =
      (currentTrackIndex - 1 + currentRelease.tracks.length) %
      currentRelease.tracks.length;
    setCurrentTrackIndex(prevIdx);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(e.target.value);
    setCurrentTime(nextTime);
    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }
  };

  const playbackState: ActivePlaybackState | null =
    activeTrack && currentRelease
      ? {
          release: currentRelease,
          track: activeTrack,
          trackIndex: currentTrackIndex,
          isPlaying,
          currentTime,
          duration,
          avgRgb: playerAvgRgb,
        }
      : null;

  const handleSelectRoute = (route: MobileRouteId) => {
    setDrawerOpen(false);
    closePlayerDrawer();

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
      }, SLIDE_MS + 10);
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
    }, SLIDE_MS + 10);
  };

  useEffect(() => {
    const preventGesture = (e: Event) => e.preventDefault();
    const preventPinch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    window.addEventListener("gesturestart", preventGesture, { passive: false });
    window.addEventListener("gesturechange", preventGesture, { passive: false });
    document.addEventListener("touchmove", preventPinch, { passive: false });

    return () => {
      window.removeEventListener("gesturestart", preventGesture);
      window.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("touchmove", preventPinch);
    };
  }, []);

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
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          overscroll-behavior: none;
          background: ${edgeColor} !important;
          color-scheme: ${isDarkTheme ? "dark" : "light"};
        }
      `}</style>

      {DEBUG_SCROLL && (
        <div
          style={{
            position: "fixed",
            bottom: 140,
            left: 8,
            zIndex: 99,
            background: "#000",
            color: "#fff",
            fontSize: 11,
            padding: "2px 5px",
          }}
        >
          <ScrollReadout />
        </div>
      )}

      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={handleNextTrack}
      />

      {/* Top-right options button aligned with subpage back chevron */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setDrawerOpen((prev) => !prev)}
        style={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top, 0px) + 14px)",
          right: "18px",
          zIndex: 65,
          width: "40px",
          height: "40px",
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
          fill={isSubpageActive ? subpageIconColor : theme.buttonText}
          outline={theme.outlineColor}
          showOutline={!isSubpageActive}
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
            paddingTop: `${OFFSET}px`,
            paddingBottom: "110px",
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
            bottom: playbackState
              ? "calc(env(safe-area-inset-bottom, 0px) + 128px)"
              : "calc(env(safe-area-inset-bottom, 0px) + 74px)",
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
            overflowY: insideAlbum ? "hidden" : "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            background: theme.pageBg,
            color: theme.pageTextColor,
            padding:
              `calc(env(safe-area-inset-top, 0px) + ${OFFSET + 80}px) 18px calc(env(safe-area-inset-bottom, 0px) + 180px)`,
            transform: returningHome
              ? transitionStarted
                ? "translate3d(100%, 0, 0)"
                : "translate3d(0, 0, 0)"
              : undefined,
            transition: returningHome ? SLIDE : "none",
          }}
        >
          {/* Subpage back button pinned to the same top row as the options button */}
          {!insideAlbum && (
            <button
              key={`back-${modeKey}`}
              type="button"
              aria-label="Back to home"
              onClick={() => handleSelectRoute("home")}
              style={{
                position: "fixed",
                top: "calc(env(safe-area-inset-top, 0px) + 14px)",
                left: "18px",
                zIndex: 64,
                width: "40px",
                height: "40px",
                padding: 0,
                backgroundColor: "transparent",
                color: subpageIconColor,
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "flex-start",
                cursor: "pointer",
              }}
            >
              <svg width="13" height="22" viewBox="0 0 13 22" fill="none">
                <path
                  d="M11 2L2 11L11 20"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {activeRoute === "music" ? (
            <MobileMusicView
              baseMode={baseMode}
              isDarkTheme={isDarkTheme}
              playback={playbackState}
              onPlayTrack={handlePlayTrack}
              onAlbumOpenChange={setInsideAlbum}
              onAlbumRgbChange={setAlbumRgb}
            />
          ) : renderPageContent ? (
            renderPageContent(activeRoute)
          ) : (
            <div>{activeRoute.toUpperCase()}</div>
          )}
        </section>
      )}

      {playbackState && !playerDrawerMounted && (
        <div
          onClick={openPlayerDrawer}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openPlayerDrawer();
          }}
          style={{
            position: "fixed",
            left: "12px",
            right: "12px",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
            zIndex: 60,
            padding: "9px 14px",
            borderRadius: "14px",
            background: `rgba(${displayRgb}, 0.72)`,
            border: "1px solid rgba(255, 255, 255, 0.22)",
            boxShadow: "0 1px 6px rgba(0, 0, 0, 0.28)",
            color: "#ffffff",
            fontFamily: MUSIC_FONT,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: 0,
              flex: 1,
            }}
          >
            <img
              src={playbackState.release.cover}
              alt={playbackState.track.title}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "6px",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {playbackState.track.title}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.82,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {playbackState.release.title}
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label={playbackState.isPlaying ? "Pause" : "Play"}
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying((prev) => !prev);
            }}
            style={{
              width: "36px",
              height: "36px",
              border: "none",
              background: "transparent",
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {playbackState.isPlaying ? (
              <PauseBarsIcon size={15} />
            ) : (
              <PlayTriangleIcon size={16} />
            )}
          </button>
        </div>
      )}

      {playerDrawerMounted && playbackState && (
        <div
          onClick={closePlayerDrawer}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 52,
            background: "rgba(0, 0, 0, 0.48)",
            opacity: playerDrawerActive ? 1 : 0,
            transition: `opacity ${DRAWER_MS}ms ease`,
          }}
        />
      )}

      {playerDrawerMounted && playbackState && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: "calc(env(safe-area-inset-top, 0px) + 72px)",
            bottom: 0,
            zIndex: 55,
            background: `rgba(${displayRgb}, 0.58)`,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            color: "#ffffff",
            fontFamily: MUSIC_FONT,
            padding: "16px 22px calc(env(safe-area-inset-bottom, 0px) + 74px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            transform: playerDrawerActive
              ? "translate3d(0, 0, 0)"
              : "translate3d(0, 100%, 0)",
            transition: DRAWER_TRANSITION,
            willChange: "transform",
          }}
        >
          <button
            type="button"
            aria-label="Collapse player"
            onClick={closePlayerDrawer}
            style={{
              width: "42px",
              height: "5px",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.55)",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          />

          <div
            style={{
              width: playerDrawerActive ? "min(76vw, 292px)" : "42px",
              aspectRatio: "1 / 1",
              borderRadius: playerDrawerActive ? "12px" : "6px",
              overflow: "hidden",
              boxShadow: "0 18px 40px rgba(0, 0, 0, 0.36)",
              transform: playerDrawerActive
                ? "translate3d(0, 0, 0)"
                : "translate3d(-34vw, 24vh, 0)",
              transition: `width ${DRAWER_MS}ms cubic-bezier(0.16, 1, 0.3, 1), border-radius ${DRAWER_MS}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${DRAWER_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              willChange: "transform, width",
            }}
          >
            <img
              src={playbackState.release.cover}
              alt={playbackState.release.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "340px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              opacity: playerDrawerActive ? 1 : 0,
              transition: `opacity ${Math.round(DRAWER_MS * 0.75)}ms ease`,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "21px",
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {playbackState.track.title}
              </div>
              <div style={{ fontSize: "14px", opacity: 0.82, marginTop: "3px" }}>
                {playbackState.release.title} · {playbackState.release.artist}
              </div>
            </div>

            <div>
              <input
                type="range"
                min={0}
                max={playbackState.duration || 100}
                value={Math.min(
                  playbackState.currentTime,
                  playbackState.duration || 100
                )}
                onChange={handleSeek}
                aria-label="Seek track"
                style={{
                  width: "100%",
                  accentColor: "#ffffff",
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  opacity: 0.82,
                  marginTop: "2px",
                }}
              >
                <span>{formatSeconds(playbackState.currentTime)}</span>
                <span>
                  -
                  {formatSeconds(
                    Math.max(
                      (playbackState.duration || 0) - playbackState.currentTime,
                      0
                    )
                  )}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                paddingTop: "4px",
              }}
            >
              <button
                type="button"
                aria-label="Previous track"
                onClick={handlePrevTrack}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: "8px 14px",
                }}
              >
                <PrevTrackIcon size={22} />
              </button>

              <button
                type="button"
                aria-label={playbackState.isPlaying ? "Pause" : "Play"}
                onClick={() => setIsPlaying((prev) => !prev)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: "8px 18px",
                }}
              >
                {playbackState.isPlaying ? (
                  <PauseBarsIcon size={24} />
                ) : (
                  <PlayTriangleIcon size={26} />
                )}
              </button>

              <button
                type="button"
                aria-label="Next track"
                onClick={handleNextTrack}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: "8px 14px",
                }}
              >
                <NextTrackIcon size={22} />
              </button>
            </div>
          </div>
        </div>
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
          height: `calc(120dvh + ${OFFSET}px)`,
          width: "52%",
          minWidth: "190px",
          zIndex: 50,
          background: theme.drawerBg,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: theme.drawerText,
          padding:
            `calc(env(safe-area-inset-top, 0px) + ${OFFSET + 75}px) 18px calc(env(safe-area-inset-bottom, 0px) + 140px)`,
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
            onClick={handleUserToggleMode}
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