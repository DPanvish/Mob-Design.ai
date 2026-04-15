"use client"

import { useProject } from "@/app/hooks/useProject";
import { useParams } from "next/navigation"
import Header from "./_common/header";
import Canvas from "@/components/canvas";
import { CanvasProvider } from "@/app/context/canvas-context";
import { FrameTypes } from "@/types";

const EMPTY_FRAMES: FrameTypes[] = [];

const Page = () => {
  const param = useParams();
  const projectId = param.id as string;

  const {getProjectById: project, getProjectByIdLoading: isLoading, getProjectByIdError} = useProject({projectId});
  const frames: FrameTypes[] = project?.frames || EMPTY_FRAMES;
  const themeId = project?.theme || "";
  const canvasStateKey = `${project?.id || projectId}:${themeId}:${frames.map((frame) => frame.id).join(",")}`;

  if (getProjectByIdError) {
    return <div>Failed to load project.</div>;
  }

  if(!isLoading && !project){
    return(
      <div>
        Project not found
      </div>
    )
  }

  return (
    <div className="relative h-screen  w-full flex flex-col">
      <Header projectName={project?.name} />

      <CanvasProvider
        key={canvasStateKey}
        initialFrames={frames}
        initialThemeId={themeId}
        projectId={project?.id ?? projectId}
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="relative flex-1">
            <Canvas 
              projectId={project?.id ?? projectId}
              isLoading={isLoading}
            />
          </div>
        </div>
      </CanvasProvider>
    </div>
  )
}

export default Page
