
import { memo } from 'react'
import { ProjectTypes } from '@/types'
import { useRouter } from 'next/navigation';
import { FolderOpenDotIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';


const ProjectCard = memo(({project}: {project: ProjectTypes}) => {
  const router = useRouter();
  const createdAtDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  const thumbnail = project.thumbnail || null;

  const onRoute = () => {
    router.push(`/projects/${project.id}`);
  }

  return (
    <div
      role="button"
      className="w-full flex flex-col border rounded-xl cursor-pointer hover:shadow-md overflow-hidden"
      onClick={onRoute}
    >
      <div className="h-40 bg-[#919191] relative overflow-hidden flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            className="w-full h-full object-cover object-left scale-110"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <FolderOpenDotIcon />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-sm truncate w-full mb-1 line-clamp-1">{project.name}</h3>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </div>
  )
});

export default ProjectCard
