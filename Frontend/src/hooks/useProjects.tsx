import { useContext } from 'react';
import { ProjectContext } from '../contexts/ProjectContext';

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

// =================================================================================
// 4. Common Modal: src/components/common/Modal.tsx (Create this new file)
// =================================================================================
