export interface PromptTypes {
    promptText: string;
    setPromptText: (value: string) => void;
    isLoading?: boolean;
    className?: string;
    hideSubmitBtn?: boolean;
    onSubmit?: () => void;
}