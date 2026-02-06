import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  disabled?: boolean;
}

export const mockProjects: Project[] = [
  {
    id: '04ebfa43',
    name: 'Project-01',
    description: "Development environment for the 'service' backend services.",
    createdAt: 'Oct 22, 2025',
  },
  {
    id: '14ebfa44',
    name: 'Project-02',
    description: "Development environment for the 'service' backend services.",
    createdAt: 'Oct 22, 2025',
  },
  {
    id: '24ebfa45',
    name: 'Project-03',
    description: "Development environment for the 'service' backend services.",
    createdAt: 'Oct 22, 2025',
  },
  {
    id: '34ebfa46',
    name: 'Project-04',
    description: "Development environment for the 'service' backend services.",
    createdAt: 'Oct 22, 2025',
    disabled: true,
  },
];

interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string;
  selectedProject: Project | undefined;
  setSelectedProjectId: (projectId: string) => void;
}

/* ----------------------------------------
   Context
   ---------------------------------------- */

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

/* ----------------------------------------
   Provider
   ---------------------------------------- */

interface ProjectProviderProps {
  children: ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [selectedProjectId, setSelectedProjectIdState] = useState<string>(mockProjects[0].id);

  const setSelectedProjectId = useCallback((projectId: string) => {
    setSelectedProjectIdState(projectId);
  }, []);

  const selectedProject = mockProjects.find((p) => p.id === selectedProjectId);

  const value: ProjectContextType = {
    projects: mockProjects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

/* ----------------------------------------
   Hook
   ---------------------------------------- */

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
