export type AppId = "terminal" | "chrome" | "music";

export type DesktopApp = {
    id: AppId;
    title: string;
    icon: string;
    showInTaskbar: boolean;
};
