import React from 'react';
import { useProjects } from '../../../hooks/useProjects';
import { ProjectCard } from './ProjectCard';

export const ProjectList = () => {
  const { projects, isLoading, error } = useProjects();

  if (isLoading) {
    return <div className="text-center p-10">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet. Click "New Project" to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
