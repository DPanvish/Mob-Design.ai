"use client"

import { useProject } from "@/app/hooks/useProject";
import { useParams } from "next/navigation"
import Header from "./_common/header";
import Canvas from "@/components/canvas";
import { CanvasProvider } from "@/app/context/canvas-context";

const Page = () => {
  const param = useParams();
  const projectId = param.id as string;

  const {getProjectById: project, getProjectByIdLoading: isLoading, getProjectByIdError} = useProject({projectId});
  const frames = project?.frames || [];
  const themeId = project?.theme || "";
  const hasInitialData = frames.length > 0;

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
        initialFrames={frames}
        initialThemeId={themeId}
        hasInitialData={hasInitialData}
        projectId={project?.id}
      >
        <div className="flex w-full overflow-hidden">
          <div className="relative">
            <Canvas />
          </div>
        </div>
      </CanvasProvider>
    </div>
  )
}

export default Page
