import { ToolModeType } from "@/lib/canvas";
import { CSSProperties } from "react";

export interface PromptTypes {
    promptText: string;
    setPromptText: (value: string) => void;
    isLoading?: boolean;
    className?: string;
    hideSubmitBtn?: boolean;
    onSubmit?: () => void;
}

export type ProjectTypes = {
    id: string;
    name: string;
    theme: string;
    thumbnail?: string;
    frames: FrameTypes[];
    createdAt: Date;
    updatedAt?: Date;
}

export type FrameTypes = {
    id: string;
    title: string;
    htmlContent: string;
    projectId?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isLoading: boolean;
}

export type PropsTypes = {
    zoomIn: () => void;
    zoomOut: () => void;
    zoomPercent: number;
    toolMode: ToolModeType;
    setToolMode: (toolMode: ToolModeType) => void;
}

export type LoadingStatusType = "idle" | "running" | "analyzing" | "generating" | "completed";

export type ScreenPlan = {
    id: string;
    name: string;
    purpose: string;
    visualDescription: string;
}

export interface ThemeType {
    id: string;
    name: string;
    style: string;
}

export interface CanvasContextType {
    theme?: ThemeType;
    setTheme: (id: string) => void;
    themes: ThemeType[];
    frames: FrameTypes[];
    setFrames: (frames: FrameTypes[]) => void;
    updateFrame: (id: string, data: Partial<FrameTypes>) => void;
    addFrame: (frame: FrameTypes) => void;
    selectedFrameId: string | null;
    selectedFrame: FrameTypes | null;
    setSelectedFrameId: (id: string | null) => void;
    loadingStatus: LoadingStatusType;
}

export type DeviceFramePropType = {
    html: string;
    title?: string;
    width?: number;
    minHeight?: number | string;
    initialPosition?: {x: number; y: number};
    frameId: string;
    scale?: number;
    toolMode: ToolModeType;
    theme_style?: string;
    onOpenHtmlDialog: () => void;
}

export type DeviceFrameSkeletonType = {
    style: CSSProperties;
}

export type DeviceFrameToolbarType = {
    title: string;
    isSelected?: boolean;
    disabled?: boolean;
    scale?: number;
    isDownloading: boolean;
    onOpenHtmlDialog: () => void;
    onDownloadPng?: () => void;
}

export type HtmlDialogType = {
    open: boolean;
    title?: string;
    theme_style?: string;
    html: string;
    onOpenChange: (v: boolean) => void;
}
