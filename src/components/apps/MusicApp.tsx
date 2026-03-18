"use client";

import { useState, memo } from "react";

export type MusicView = "recently-added" | "albums" | "songs" | "artists";

export type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioSrc?: string;
  source: "released" | "unreleased";
};

export type MusicRelease = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  source: "released" | "unreleased";
  tracks: {
    id: string;
    title: string;
  }[];
};

type MusicTitleBarProps = {
  activeTrack?: MusicTrack | null;
  isPlaying?: boolean;
  volume?: number;
  searchQuery?: string;
  onPrev?: () => void;
  onPlayPause?: () => void;
  onNext?: () => void;
  onVolumeChange?: (value: number) => void;
  onSearchChange?: (value: string) => void;
};

type MusicAppProps = {
  tracks?: MusicRelease[];
  activeTrackId?: string | null;
  activeView?: MusicView;
  searchQuery?: string;
  onSelectTrack?: (trackId: string) => void;
  onViewChange?: (view: MusicView) => void;
};

const fallbackReleases: MusicRelease[] = [
  {
    id: "release-1",
    title: "Release One",
    artist: "President",
    cover: "/logo1.png",
    source: "released",
    tracks: [
      { id: "release-1-track-1", title: "Track One" },
      { id: "release-1-track-2", title: "Track Two" },
    ],
  },
  {
    id: "release-2",
    title: "Release Two",
    artist: "President",
    cover: "/logo1.png",
    source: "released",
    tracks: [{ id: "release-2-track-1", title: "Track One" }],
  },
  {
    id: "release-3",
    title: "Release Three",
    artist: "President",
    cover: "/logo1.png",
    source: "released",
    tracks: [
      { id: "release-3-track-1", title: "Track One" },
      { id: "release-3-track-2", title: "Track Two" },
      { id: "release-3-track-3", title: "Track Three" },
    ],
  },
];

const ReleaseCard = memo(function ReleaseCard({
  release,
  isSelected,
  onToggle,
}: {
  release: MusicRelease;
  isSelected: boolean;
  onToggle: (releaseId: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(release.id)}
      style={{
        border: "none",
        background: "transparent",
        padding: 0,
        textAlign: "left",
        cursor: "default",
        transform: "none",
        transition: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#e9e9e9",
          boxShadow: "none",
          marginBottom: "10px",
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
          fontSize: "14px",
          fontWeight: 600,
          color: "#111",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {release.title}
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#666",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {release.artist}
      </div>

      {release.source === "unreleased" && (
        <div
          style={{
            marginTop: "6px",
            fontSize: "11px",
            color: "#8a8a8a",
          }}
        >
          Session Import
        </div>
      )}
    </button>
  );
});

export function MusicTitleBar({
  activeTrack = null,
  isPlaying = false,
  volume = 70,
  searchQuery = "",
  onPrev,
  onPlayPause,
  onNext,
  onVolumeChange,
  onSearchChange,
}: MusicTitleBarProps) {
  const buttonStyle: React.CSSProperties = {
    width: "30px",
    height: "30px",
    border: "none",
    borderRadius: "8px",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#5f5f5f",
    padding: 0,
    cursor: "default",
    flexShrink: 0,
  };

  return (
    <>
      <style jsx>{`
        .music-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d7d7d7 #f7f7f7;
        }

        .music-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        .music-scroll::-webkit-scrollbar-track {
          background: #f7f7f7;
        }

        .music-scroll::-webkit-scrollbar-thumb {
          background: #d7d7d7;
          border-radius: 999px;
          border: 2px solid #f7f7f7;
        }

        .music-volume::-webkit-slider-runnable-track {
          height: 4px;
          background: transparent;
          border-radius: 999px;
        }

        .music-volume::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #f1f1f1;
          border: 1px solid #bdbdbd;
          box-shadow: none;
        }
        
        .music-volume::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #f1f1f1;
          border: 1px solid #bdbdbd;
          box-shadow: none;
        }

        .music-volume::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #efefef;
          border: 1px solid #bdbdbd;
        }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          width: "100%",
          height: "100%",
          paddingRight: "8px",
          gap: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            minWidth: "140px",
          }}
        >
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onPrev}
            style={buttonStyle}
          >
            <svg width="22" height="22" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="2.4" height="10" rx="1.2" fill="currentColor" />
              <path d="M13.5 4.8L7.2 9L13.5 13.2V4.8Z" fill="currentColor" />
            </svg>
          </button>

          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onPlayPause}
            style={buttonStyle}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="4.2" y="3.8" width="3" height="10.4" rx="1.3" fill="currentColor" />
                <rect x="10.8" y="3.8" width="3" height="10.4" rx="1.3" fill="currentColor" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M6 4.4L13.4 9L6 13.6V4.4Z" fill="currentColor" />
              </svg>
            )}
          </button>

          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onNext}
            style={buttonStyle}
          >
            <svg width="22" height="22" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="12.6" y="4" width="2.4" height="10" rx="1.2" fill="currentColor" />
              <path d="M4.5 4.8L10.8 9L4.5 13.2V4.8Z" fill="currentColor" />
            </svg>
          </button>

          <div
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "6px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.2 6.4V9.6H5.6L8.8 12V4L5.6 6.4H3.2Z" fill="#7a7a7a" />
              <path
                d="M11 6.1C11.6 6.55 12 7.22 12 8C12 8.78 11.6 9.45 11 9.9"
                stroke="#7a7a7a"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>

            <input
              className="music-volume"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange?.(Number(e.target.value))}
              style={{
                width: "78px",
                height: "4px",
                appearance: "none",
                WebkitAppearance: "none",
                background: `linear-gradient(to right, #555 ${volume}%, #dcdcdc ${volume}%)`,
                borderRadius: "999px",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div
          style={{
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {activeTrack ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1.15",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#111",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "260px",
                }}
              >
                {activeTrack.title}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#777",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "260px",
                }}
              >
                {activeTrack.artist}
              </span>
            </div>
          ) : (
            <img
              src="/logo1.png"
              alt="President"
              style={{
                height: "18px",
                width: "auto",
                opacity: 0.42,
                filter: "grayscale(1)",
              }}
            />
          )}
        </div>

        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            width: "190px",
            height: "28px",
            borderRadius: "999px",
            border: "1px solid #d8d8d8",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            flexShrink: 0,
          }}
        >
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "12px",
              color: "#444",
              fontFamily: '"Segoe UI Variable", "Segoe UI", Arial, sans-serif',
            }}
          />
        </div>
      </div>
    </>
  );
}

export function MusicApp({
  tracks = fallbackReleases,
  activeTrackId = null,
  activeView = "recently-added",
  searchQuery = "",
  onSelectTrack,
  onViewChange,
}: MusicAppProps) {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);

  const handleReleaseToggle = (releaseId: string) => {
    setSelectedReleaseId(releaseId);
  };

  const filteredReleases = tracks.filter((release) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      release.title.toLowerCase().includes(q) ||
      release.artist.toLowerCase().includes(q)
    );
  });

  const allSongs = tracks.flatMap((release) =>
    release.tracks.map((track) => ({
      ...track,
      releaseTitle: release.title,
      artist: release.artist,
      cover: release.cover,
      source: release.source,
    }))
  );

  const filteredSongs = allSongs.filter((song) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      song.releaseTitle.toLowerCase().includes(q)
    );
  });

  const selectedRelease =
    tracks.find((release) => release.id === selectedReleaseId) ?? null;

  return (
    <>
      <style jsx>{`
        .music-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d7d7d7 #f7f7f7;
        }

        .music-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        .music-scroll::-webkit-scrollbar-track {
          background: #f7f7f7;
        }

        .music-scroll::-webkit-scrollbar-thumb {
          background: #d7d7d7;
          border-radius: 999px;
          border: 2px solid #f7f7f7;
        }
      `}</style>

      <div
        style={{
          height: "100%",
          minHeight: "100%",
          display: "flex",
          fontFamily: '"Segoe UI Variable", "Segoe UI", Arial, sans-serif',
          backgroundColor: "#f7f7f7",
          color: "#111",
        }}
      >
        <div
          style={{
            width: "220px",
            minHeight: "100%",
            borderRight: "1px solid #dbdbdb",
            backgroundColor: "#f1f1f1",
            padding: "18px 14px",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#777",
              marginBottom: "14px",
            }}
          >
            Library
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { id: "recently-added", label: "Recently Added" },
              { id: "albums", label: "Albums" },
              { id: "songs", label: "Songs" },
              { id: "artists", label: "Artists" },
            ].map((item) => {
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedReleaseId(null);
                    onViewChange?.(item.id as MusicView);
                  }}
                  style={{
                    border: "none",
                    background: isActive ? "#e3e3e3" : "transparent",
                    color: "#222",
                    textAlign: "left",
                    padding: "9px 10px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    cursor: "default",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="music-scroll"
          style={{
            flex: 1,
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflow: "auto",
            backgroundColor: "#f7f7f7",
          }}
        >
          <div
            style={{
              padding: "24px",
              boxSizing: "border-box",
            }}
          >
            {!selectedReleaseId &&
              (activeView === "recently-added" || activeView === "albums") && (
                <>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 600,
                      marginBottom: "18px",
                    }}
                  >
                    {activeView === "recently-added" ? "Recently Added" : "Albums"}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {filteredReleases.map((release) => {
                      const isSelected = selectedReleaseId === release.id;

                      return (
                        <ReleaseCard
                          key={release.id}
                          release={release}
                          isSelected={isSelected}
                          onToggle={handleReleaseToggle}
                        />
                      );
                    })}
                  </div>
                </>
              )}

            {selectedRelease && (
              <div>
                <button
                  onClick={() => setSelectedReleaseId(null)}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: "0 0 18px 0",
                    fontSize: "14px",
                    color: "#444",
                    cursor: "default",
                  }}
                >
                  ← Back
                </button>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "260px 1fr",
                    gap: "28px",
                    alignItems: "start",
                    marginBottom: "28px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      borderRadius: "14px",
                      overflow: "hidden",
                      backgroundColor: "#e9e9e9",
                      boxShadow: "none",
                    }}
                  >
                    <img
                      src={selectedRelease.cover}
                      alt={selectedRelease.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        marginBottom: "6px",
                      }}
                    >
                      Album
                    </div>

                    <div
                      style={{
                        fontSize: "42px",
                        fontWeight: 700,
                        lineHeight: "1",
                        marginBottom: "12px",
                        color: "#111",
                      }}
                    >
                      {selectedRelease.title}
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                        color: "#555",
                        marginBottom: "24px",
                      }}
                    >
                      {selectedRelease.artist} • {selectedRelease.tracks.length} songs
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderTop: "1px solid #e2e2e2",
                  }}
                >
                  {selectedRelease.tracks.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => onSelectTrack?.(track.id)}
                      style={{
                        border: "none",
                        background: activeTrackId === track.id ? "#ececec" : "transparent",
                        borderBottom: "1px solid #e2e2e2",
                        padding: "12px 10px",
                        textAlign: "left",
                        cursor: "default",
                        display: "grid",
                        gridTemplateColumns: "40px 1fr",
                        alignItems: "center",
                        fontSize: "13px",
                        color: "#222",
                      }}
                    >
                      <span style={{ color: "#666" }}>{index + 1}</span>
                      <span>{track.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!selectedReleaseId && activeView === "songs" && (
              <>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 600,
                    marginBottom: "18px",
                  }}
                >
                  Songs
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "50px 1fr 1fr",
                    borderTop: "1px solid #e2e2e2",
                  }}
                >
                  <div style={{ padding: "10px", fontSize: "12px", color: "#666" }}>#</div>
                  <div style={{ padding: "10px", fontSize: "12px", color: "#666" }}>Title</div>
                  <div style={{ padding: "10px", fontSize: "12px", color: "#666" }}>Release</div>

                  {filteredSongs.map((song, index) => (
                    <div
                      key={song.id}
                      style={{
                        display: "contents",
                      }}
                    >
                      <button
                        onClick={() => onSelectTrack?.(song.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          borderTop: "1px solid #f0f0f0",
                          padding: "12px 10px",
                          textAlign: "left",
                          fontSize: "13px",
                          color: "#666",
                          cursor: "default",
                        }}
                      >
                        {index + 1}
                      </button>
                      <button
                        onClick={() => onSelectTrack?.(song.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          borderTop: "1px solid #f0f0f0",
                          padding: "12px 10px",
                          textAlign: "left",
                          fontSize: "13px",
                          color: "#222",
                          cursor: "default",
                        }}
                      >
                        {song.title}
                      </button>
                      <button
                        onClick={() => onSelectTrack?.(song.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          borderTop: "1px solid #f0f0f0",
                          padding: "12px 10px",
                          textAlign: "left",
                          fontSize: "13px",
                          color: "#666",
                          cursor: "default",
                        }}
                      >
                        {song.releaseTitle}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!selectedReleaseId && activeView === "artists" && (
              <>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 600,
                    marginBottom: "18px",
                  }}
                >
                  Artists
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 0",
                    }}
                  >
                    <img
                      src="/logo1.png"
                      alt="President"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "999px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#111",
                        fontWeight: 500,
                      }}
                    >
                      President
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}