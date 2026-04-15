"use client"

import { memo } from 'react'
import { ProjectTypes } from '@/types'
import { useRouter } from 'next/navigation';
import { FolderOpenDotIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';


const ProjectCard = memo(({project}: {project: ProjectTypes}) => {
  const router = useRouter();
  const createdAtDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  const thumbnail = project.thumbnail || null;

  const onRoute = () => {
    router.push(`/project/${project.id}`);
  }

  return (
    <button
      type="button"
      className="w-full flex flex-col border rounded-xl cursor-pointer hover:shadow-md overflow-hidden"
      onClick={onRoute}
      aria-label={`Open project ${project.name}`}
    >
      <div className="h-40 bg-[#919191] relative overflow-hidden flex items-center justify-center">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={`${project.name} thumbnail`}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            unoptimized
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
    </button>
  )
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard
