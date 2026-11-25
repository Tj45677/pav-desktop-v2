export type MobileRouteId = "home" | "music" | "merch" | "about" | "contact";

export interface NavItem {
  id: MobileRouteId;
  label: string;
  href?: string;
}

export interface SocialLinkItem {
  id: "youtube" | "tiktok" | "instagram" | "appleMusic" | "spotify";
  label: string;
  iconSrc: string;
  url: string;
}

export const HOME_PRIMARY_ITEMS: NavItem[] = [
  { id: "music", label: "MUSIC", href: "/music" },
  { id: "merch", label: "MERCH" },
  { id: "about", label: "ABOUT" },
];

export const DRAWER_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "HOME" },
  { id: "music", label: "MUSIC", href: "/music" },
  { id: "merch", label: "MERCH" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
];

export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: "youtube",
    label: "YouTube",
    iconSrc: "/MobileIcon_youtube.png",
    url: "https://youtube.com/@presidentaudiovisual",
  },
  {
    id: "tiktok",
    label: "TikTok",
    iconSrc: "/MobileIcon_tiktok.png",
    url: "https://www.tiktok.com/@presidentaudiovisual",
  },
  {
    id: "instagram",
    label: "Instagram",
    iconSrc: "/MobileIcon_instagram.png",
    url: "https://www.instagram.com/presidentaudiovisual/",
  },
  {
    id: "appleMusic",
    label: "Apple Music",
    iconSrc: "/MobileIcon_applemusic.png",
    url: "https://music.apple.com/us/artist/president/1707480820",
  },
  {
    id: "spotify",
    label: "Spotify",
    iconSrc: "/MobileIcon_Spotify.png",
    url: "https://open.spotify.com/artist/46RfPAEPoKXJUdQKqVbjyA",
  },
];