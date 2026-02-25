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
}