import { ToolModeType } from "@/lib/canvas";

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
    createdAt: Date;
    updatedAt?: Date;
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