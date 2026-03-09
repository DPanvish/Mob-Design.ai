import { THEME_LIST } from "../../lib/themes";
import { CanvasContextType, FrameTypes, LoadingStatusType } from "@/types";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

const  CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({children, initialFrames, initialThemeId, hasInitialData, projectId}: {
  children: ReactNode;
  initialFrames: FrameTypes[];
  initialThemeId: string;
  hasInitialData: boolean;
  projectId: string | null;
}) => {
  const [themeId, setThemeId] = useState<string>(initialThemeId || THEME_LIST[0].id);
  const [frames, setFrames] = useState<FrameTypes[]>(initialFrames);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>("running");

  const theme = THEME_LIST.find((theme) => theme.id === themeId) || THEME_LIST[0];
  const selectedFrame = selectedFrameId && frames.length !== 0
    ? frames.find((frame) => frame.id === selectedFrameId) || null
    : null;

  useEffect(() => {
    if(hasInitialData){
      setLoadingStatus("idle");
    }
  }, [hasInitialData]);

  useEffect(() => {
    if(initialThemeId){
      setThemeId(initialThemeId);
    }
  }, [initialThemeId]);

  const addFrame = useCallback((frame: FrameTypes) => {
    setFrames((prevFrames) => [...prevFrames, frame]);
  }, []);

  const updateFrame = useCallback((id: string, data: Partial<FrameTypes>) => {
    setFrames((prevFrames) => {
      return prevFrames.map((frame) => frame.id === id ? {...frame, ...data} : frame);
    });
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        theme,
        setTheme: setThemeId,
        themes: THEME_LIST,
        frames,
        setFrames,
        selectedFrameId,
        setSelectedFrameId,
        selectedFrame,
        updateFrame,
        addFrame,
        loadingStatus
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};