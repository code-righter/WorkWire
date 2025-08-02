import React from 'react';
import {type Project} from '../../../api/projectApi'

const cardColors = ['bg-indigo-200', 'bg-pink-200', 'bg-green-200'];

export const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const colorClass = cardColors[index % cardColors.length];
  return (
    <div className={`p-6 rounded-xl shadow-sm ${colorClass}`}>
      <h3 className="font-bold text-lg text-gray-800">{project.name}</h3>
      <p className="text-gray-600 mt-2 text-sm">{project.description}</p>
      <div className="mt-4 text-xs text-gray-500">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};
