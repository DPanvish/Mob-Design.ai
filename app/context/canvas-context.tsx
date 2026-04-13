import { useRealtime } from "inngest/react";
import { fetchRealtimeSubscriptionToken } from "../action/realtime";
import { THEME_LIST } from "../../lib/themes";
import { CanvasContextType, FrameTypes, LoadingStatusType, ScreenPlan } from "@/types";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

const  CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({children, initialFrames, initialThemeId, projectId}: {
  children: ReactNode;
  initialFrames: FrameTypes[];
  initialThemeId: string;
  projectId: string | null;
}) => {
  const [themeId, setThemeId] = useState<string>(initialThemeId || THEME_LIST[0].id);
  const [frames, setFrames] = useState<FrameTypes[]>(initialFrames);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>("idle")

  const theme = THEME_LIST.find((theme) => theme.id === themeId) || THEME_LIST[0];
  const selectedFrame = selectedFrameId && frames.length !== 0
    ? frames.find((frame) => frame.id === selectedFrameId) || null
    : null;

  const fetchToken = useCallback(async () => {
    const token = await fetchRealtimeSubscriptionToken();

    if (!token) {
      throw new Error("Unauthorized");
    }

    return token;
  }, []);

  const { messages } = useRealtime({
    token: fetchToken,
    key: projectId ?? "no-project",
    enabled: Boolean(projectId),
  });
  const freshData = messages.delta;

  useEffect(() => {
    if(!freshData || freshData.length === 0){
      return;
    }

    freshData.forEach((message) => {
      const {data, topic} = message;

      if(data.projectId !== projectId){
        return;
      }

      switch(topic){
        case "generation.start":
          setLoadingStatus("running");
          break;
        case "analysis.start":
          setLoadingStatus("analyzing");
          break;
        case "analysis.complete":
          setLoadingStatus("generating");
          if(data.theme){
            setThemeId(data.theme);
          }

          if(data.screens && data.screens.length > 0){
            const skeletonFrames: FrameTypes[] = data.screens.map((screen: ScreenPlan) => ({
              id: screen.id,
              title: screen.name,
              htmlContent: "",
              isLoading: true,
            }));
            setFrames((prev) => [...prev, ...skeletonFrames]);
          }
          break;
        case "frame.created":
          if(data.frame) {
            setFrames((prev) => {
              const newFrames = [...prev];
              const idx = newFrames.findIndex((f) => f.id === data.screenId);
              if(idx !== -1){
                newFrames[idx] = data.frame;
              }else{
                newFrames.push(data.frame);
              }

              return newFrames;
            });
          }
          break;
        case "generation.complete":
          setLoadingStatus("completed");
          setTimeout(() => {
            setLoadingStatus("idle");
          }, 1000);
          break;
        default:
          break;
      }
    })
  }, [projectId, freshData])

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
