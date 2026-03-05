"use client"

import { useProject } from "@/app/hooks/useProject";
import { useParams } from "next/navigation"
import Header from "./_common/header";

const Page = () => {
  const param = useParams();
  const projectId = param.id as string;

  const {getProjectById: project, getProjectByIdLoading: isLoading, getProjectByIdError} = useProject({projectId});
  const frames = project?.frames || [];
  const theme = project?.theme || "";

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
    </div>
  )
}

export default Page
