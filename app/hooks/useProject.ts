import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner";

export const useProject = (userId?: string) => {

  const router = useRouter();

  const getProjects = useQuery({
    queryKey: ["projects", userId],
    queryFn: async() => {
      const res = await axios.get("/api/project");
      return res.data.data;
    },
    enabled: !!userId
  });

  const createProjectMutation = useMutation({
    mutationFn: async(prompt: string) => {
      const { data } = await axios.post("/api/project", { prompt });
      return data;
    },
    onSuccess: (data) => {
      router.push(`/project/${data.data.id}`)
    },
    onError: (error) => {
      console.log("Project failed to create", error);
      toast.error("Failed to create project")
    },
  });

  return {
    createProject: createProjectMutation.mutate,
    createProjectLoading: createProjectMutation.isPending,
    projects: getProjects.data,
    projectsLoading: getProjects.isLoading,
    projectsError: getProjects.error,
  };
}