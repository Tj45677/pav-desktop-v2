import type { AppId } from "@/types/apps";

export type WindowState = {
    appId: AppId;
    isOpen: boolean;
    isMinimized: boolean;
    isFocused: boolean;
    isMaximized: boolean;
    x: number;
    y: number;
    zIndex: number;
};

export type WindowStateMap = Record<AppId, WindowState>;


