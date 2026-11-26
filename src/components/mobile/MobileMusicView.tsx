"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { BaseMode } from "@/config/mobileTheme";
import type { MusicRelease } from "@/components/apps/MusicApp";
import { releasedTracks } from "@/components/apps/musicLibrary";

export interface MobileTrack {
  id: string;
  title: string;
  duration?: string;
  audioSrc?: string;
}

export interface ActivePlaybackState {
  release: MusicRelease;
  track: MobileTrack;
  trackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  avgRgb: string;
}

interface MobileMusicViewProps {
  releases?: MusicRelease[];
  baseMode?: BaseMode;
  isDarkTheme?: boolean;
  playback?: ActivePlaybackState | null;
  onPlayTrack?: (release: MusicRelease, index: number) => void;
  onAlbumOpenChange?: (isOpen: boolean) => void;
  onAlbumRgbChange?: (rgb: string | null) => void;
}

const SLIDE_MS = 420;
const MUSIC_FONT = `"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif`;

export function PlayTriangleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3.5 2.5L13.5 8L3.5 13.5V2.5Z" />
    </svg>
  );
}

export function PauseBarsIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="3" y="2.5" width="3.5" height="11" rx="1" />
      <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" />
    </svg>
  );
}

export function PrevTrackIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="3" y="3.5" width="2.4" height="13" rx="1" />
      <path d="M17 4L7.5 10L17 16V4Z" />
    </svg>
  );
}

export function NextTrackIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 4L12.5 10L3 16V4Z" />
      <rect x="14.6" y="3.5" width="2.4" height="13" rx="1" />
    </svg>
  );
}

function BackChevronIcon() {
  return (
    <svg
      width="13"
      height="22"
      viewBox="0 0 13 22"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11 2L2 11L11 20"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function useAverageCoverColor(
  coverSrc: string,
  fallbackRgb = "58, 74, 86"
) {
  const [rgb, setRgb] = useState(fallbackRgb);

  useEffect(() => {
    const safeSrc = String(coverSrc || "");
    if (!safeSrc) {
      setRgb(fallbackRgb);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = safeSrc;

    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        const size = 24;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count += 1;
        }

        if (count > 0) {
          setRgb(
            `${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)}`
          );
        }
      } catch {
        setRgb(fallbackRgb);
      }
    };

    img.onerror = () => {
      if (!cancelled) setRgb(fallbackRgb);
    };

    return () => {
      cancelled = true;
    };
  }, [coverSrc, fallbackRgb]);

  return rgb;
}

export default function MobileMusicView({
  releases = releasedTracks,
  baseMode = "light",
  isDarkTheme = false,
  playback = null,
  onPlayTrack,
  onAlbumOpenChange,
  onAlbumRgbChange,
}: MobileMusicViewProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<MusicRelease | null>(null);
  const [albumVisible, setAlbumVisible] = useState(false);
  const [canScrollAlbum, setCanScrollAlbum] = useState(false);
  const [mounted, setMounted] = useState(false);
  const albumScrollRef = useRef<HTMLDivElement | null>(null);

  const albumAvgRgb = useAverageCoverColor(
    selectedAlbum?.cover ?? "/inauguration_cover.png"
  );

  const useDarkControls = isDarkTheme || baseMode === "dark";
  const themePlayBtnBg = useDarkControls ? "#000000" : "#ffffff";
  const themePlayBtnFg = useDarkControls ? "#ffffff" : "#000000";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    onAlbumOpenChange?.(Boolean(selectedAlbum));
    onAlbumRgbChange?.(selectedAlbum ? albumAvgRgb : null);
  }, [selectedAlbum, albumAvgRgb, onAlbumOpenChange, onAlbumRgbChange]);

  useEffect(() => {
    if (!selectedAlbum) return;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [selectedAlbum]);

  const measureOverflow = useCallback(() => {
    const el = albumScrollRef.current;
    if (!el) {
      setCanScrollAlbum(false);
      return;
    }
    setCanScrollAlbum(el.scrollHeight > el.clientHeight + 2);
  }, []);

  useEffect(() => {
    if (!selectedAlbum) {
      setAlbumVisible(false);
      setCanScrollAlbum(false);
      return;
    }

    if (albumScrollRef.current) {
      albumScrollRef.current.scrollTop = 0;
    }

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      if (albumScrollRef.current) {
        albumScrollRef.current.scrollTop = 0;
      }
      measureOverflow();
      inner = requestAnimationFrame(() => setAlbumVisible(true));
    });

    window.addEventListener("resize", measureOverflow);
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.removeEventListener("resize", measureOverflow);
    };
  }, [selectedAlbum, measureOverflow]);

  const handleCloseAlbum = () => {
    setAlbumVisible(false);
    window.setTimeout(() => {
      setSelectedAlbum(null);
    }, SLIDE_MS);
  };

  const triggerPlay = (release: MusicRelease, index: number) => {
    onPlayTrack?.(release, index);
  };

  const albumOverlay =
    mounted && selectedAlbum
      ? createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: albumVisible ? "0%" : "100%",
              width: "100%",
              height: "100dvh",
              zIndex: 35,
              background: `rgb(${albumAvgRgb})`,
              color: "#ffffff",
              fontFamily: MUSIC_FONT,
              overscrollBehavior: "none",
              transition: `left ${SLIDE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            {/* Album back chevron aligned on the exact same top row as the options icon */}
            <button
              type="button"
              aria-label="Back to library"
              onClick={handleCloseAlbum}
              style={{
                position: "absolute",
                top: "calc(env(safe-area-inset-top, 0px) + 14px)",
                left: "18px",
                zIndex: 40,
                width: "40px",
                height: "40px",
                background: "transparent",
                border: "none",
                padding: 0,
                color: "#ffffff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <BackChevronIcon />
            </button>

            <div
              ref={albumScrollRef}
              style={{
                width: "100%",
                height: "100%",
                overflowY: canScrollAlbum ? "auto" : "hidden",
                overflowX: "hidden",
                overscrollBehavior: "none",
                WebkitOverflowScrolling: canScrollAlbum ? "touch" : "auto",
                padding: canScrollAlbum
                  ? "calc(env(safe-area-inset-top, 0px) + 68px) 18px calc(env(safe-area-inset-bottom, 0px) + 240px)"
                  : "calc(env(safe-area-inset-top, 0px) + 68px) 18px calc(env(safe-area-inset-bottom, 0px) + 96px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  marginBottom: "22px",
                }}
              >
                <div
                  style={{
                    width: "224px",
                    maxWidth: "66vw",
                    aspectRatio: "1 / 1",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 14px 32px rgba(0, 0, 0, 0.34)",
                    marginBottom: "16px",
                  }}
                >
                  <img
                    src={selectedAlbum.cover}
                    alt={selectedAlbum.title}
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
                    fontSize: "22px",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {selectedAlbum.title}
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    opacity: 0.85,
                    marginTop: "4px",
                  }}
                >
                  {selectedAlbum.artist}
                </div>

                <button
                  type="button"
                  onClick={() => triggerPlay(selectedAlbum, 0)}
                  style={{
                    marginTop: "16px",
                    width: "100%",
                    maxWidth: "320px",
                    height: "44px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: themePlayBtnBg,
                    color: themePlayBtnFg,
                    fontFamily: MUSIC_FONT,
                    fontSize: "16px",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.16)",
                  }}
                >
                  <PlayTriangleIcon size={13} />
                  <span>Play</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {selectedAlbum.tracks.map((track, idx) => {
                  const isCurrent =
                    playback?.release.id === selectedAlbum.id &&
                    playback?.trackIndex === idx;

                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => triggerPlay(selectedAlbum, idx)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        padding: "13px 4px",
                        background: "transparent",
                        border: "none",
                        borderTop: "1px solid rgba(255, 255, 255, 0.16)",
                        color: "#ffffff",
                        fontFamily: MUSIC_FONT,
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            width: "22px",
                            fontSize: "14px",
                            opacity: 0.78,
                            textAlign: "right",
                            flexShrink: 0,
                            display: "inline-flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          {isCurrent && playback?.isPlaying ? (
                            <PlayTriangleIcon size={11} />
                          ) : (
                            idx + 1
                          )}
                        </span>
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: isCurrent ? 600 : 400,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {track.title}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: "13px",
                          opacity: 0.78,
                          flexShrink: 0,
                        }}
                      >
                        {track.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        fontFamily: MUSIC_FONT,
      }}
    >
      <style>{`
        @font-face {
          font-family: "SF Pro Display";
          src: url("/SF-Pro-Display-Regular.otf") format("opentype");
          font-weight: 400 500;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: "SF Pro Display";
          src: url("/SF-Pro-Display-Semibold.otf") format("opentype");
          font-weight: 600 900;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      {/* Library: Recently Added */}
      <div style={{ paddingBottom: "180px" }}>
        <h1
          style={{
            margin: "0 0 18px 0",
            fontSize: "30px",
            lineHeight: 1.1,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            fontFamily: MUSIC_FONT,
          }}
        >
          Recently Added
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "20px 14px",
          }}
        >
          {releases.map((release) => (
            <button
              key={release.id}
              type="button"
              onClick={() => setSelectedAlbum(release)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "inherit",
                fontFamily: MUSIC_FONT,
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.12)",
                  marginBottom: "8px",
                }}
              >
                <img
                  src={release.cover}
                  alt={release.title}
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
                  fontSize: "15px",
                  fontWeight: 600,
                  lineHeight: 1.25,
                  color: "inherit",
                }}
              >
                {release.title}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  lineHeight: 1.25,
                  opacity: 0.65,
                  marginTop: "2px",
                }}
              >
                {release.artist}
              </div>
            </button>
          ))}
        </div>
      </div>

      {albumOverlay}
    </div>
  );
}