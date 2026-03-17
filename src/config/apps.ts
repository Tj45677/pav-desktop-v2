import type { DesktopApp } from "@/types/apps";

                                                                                         //apps
export const desktopApps: DesktopApp[] = [
    {
        id: "terminal",
        title: "SuperShell",
        icon: "/powershell.png",
        showInTaskbar: false,
    },
    {
        id: "chrome",
        title: "Google Chrome",
        icon: '/chrome.png',
        showInTaskbar: true,
        defaultWidth: 1000,
        defaultHeight: 650,
    },
    {
        id: "music",
        title: "iTunes",
        icon: "itunes.png",
        showInTaskbar: true,
        defaultWidth: 980,
        defaultHeight: 640,
    },
];
