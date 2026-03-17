import type { MusicRelease } from "@/components/apps/MusicApp";


export const releasedTracks: MusicRelease[] = [
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
    tracks: [
      { id: "release-2-track-1", title: "Track One" },
    ],
  },
];