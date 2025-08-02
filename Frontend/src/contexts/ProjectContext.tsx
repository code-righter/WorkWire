import React, { createContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { type Project, getProjects, createProject,type  NewProjectData } from '../api/projectApi';
import { useAuth } from '../hooks/useAuth';

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => void;
  addProject: (projectData: NewProjectData) => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Could not load projects.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addProject = async (projectData: NewProjectData) => {
    try {
      const newProject = await createProject(projectData);
      setProjects((prevProjects) => [newProject, ...prevProjects]);
    } catch (err) {
      console.error("Failed to create project:", err);
      // Optionally, re-throw or set an error state to be shown in the UI
      throw new Error("Could not create project.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <ProjectContext.Provider value={{ projects, isLoading, error, fetchProjects, addProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
