import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the project ID from the URL
import { apiClient } from "@/lib/api"; // To fetch project data

// Components
import { Navbar } from "@/components/Navbar";
import { LeftSidebar } from "@/components/LeftSidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { GanttChart } from "@/components/GanttChart";
import { WandSparkles } from "lucide-react"; // Icon for the new AI button
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  name: string;
  email: string;
}

// Task type, where 'assignee' is a full User object
interface Task {
  _id: string;
  title: string;
  description: string;
  component: string;
  assignee: User;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  startDate: string; // Keep as string to match JSON
  endDate: string;   // Keep as string to match JSON
  comments: any[];
}

// Project type, where 'manager' and 'members' are populated
interface Project {
  _id: string;
  name: string;
  manager: User;
  description: string;
  timeline: string;
  members: User[]; // This fixes the prop error
  tasks: Task[];
  createdAt: string;
}

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

const AiSidebar = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;
  return (
    <div className="w-80 border-l border-border bg-card p-4 transition-all duration-300">
      <h3 className="text-lg font-semibold">AI Assistant</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Break down your project goals into actionable tasks with AI.
      </p>
      {/* AI form and functionality will go here */}
    </div>
  );
};

export function ProjectManagement() {
  const { projectId } = useParams<{ projectId: string }>();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRightSidebar, setActiveRightSidebar] = useState<'chat' | 'ai' | null>(null);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true);

  // Gantt chart view range state
  const [viewStartDate, setViewStartDate] = useState<Date>(new Date());
  const [viewEndDate, setViewEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (projectId) {
      const fetchProjectData = async () => {
        setIsLoading(true);
        try {
          // Use the correct API endpoint for fetching a single project
          const PROJECT_DETAILS_URL = `http://localhost:3000/api/v1/projects/getProject/${projectId}`;
          const response = await apiClient.get(PROJECT_DETAILS_URL);
          const projectData: Project = response.data;
          setProject(projectData);

          // Calculate timeline scale based on project data
          const startDate = new Date(projectData.createdAt);
          const timeline = projectData.timeline;
          const endDate = new Date(startDate);
          
          const value = parseInt(timeline.slice(0, -1));
          const unit = timeline.slice(-1).toUpperCase();

          if (unit === 'M') endDate.setMonth(endDate.getMonth() + value);
          else if (unit === 'D') endDate.setDate(endDate.getDate() + value);
          else if (unit === 'YR') endDate.setFullYear(endDate.getFullYear() + value);

          setViewStartDate(startDate);
          setViewEndDate(endDate);

        } catch (error) {
          console.error("Failed to fetch project details:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProjectData();
    }
  }, [projectId]);
  
  const toggleLeftSidebar = () => setLeftSidebarCollapsed(prev => !prev);
  const toggleRightSidebar = (sidebar: 'chat' | 'ai') => {
    setActiveRightSidebar(current => (current === sidebar ? null : sidebar));
  };
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading Project...</div>;
  }
  
  if (!project) {
    return <div className="h-screen flex items-center justify-center">Project not found.</div>;
  }

  // Dummy handlers - to be implemented
  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {};
  const handleAddTask = (newTask: any) => {};
  const handleSendMessage = (content: string) => {};

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar 
        projectName={project.name}
        teamMembers={project.members} // The prop error is now fixed
        onToggleLeftSidebar={toggleLeftSidebar}
        customActions={
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => toggleRightSidebar('ai')}><WandSparkles className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => toggleRightSidebar('chat')}>
              {/* Add your chat icon here */}
            </Button>
          </div>
        }
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className={`transition-all duration-300 ${leftSidebarCollapsed ? 'w-0' : 'w-80'}`}>
          <LeftSidebar 
            tasks={project.tasks}
            onAddTask={handleAddTask}
            className="bg-white"
            isCollapsed={leftSidebarCollapsed}
          />
        </div>
        
        <main className="flex-1 flex flex-col overflow-auto">
          <div className="h-16 border-b border-border bg-stone-100 flex-shrink-0">
             {/* Calendar Header UI */}
          </div>
          <div className="flex-1 overflow-auto bg-sky-100 text-black">
            <GanttChart 
              tasks={project.tasks}
              onUpdateTask={handleUpdateTask}
              viewStartDate={viewStartDate}
              viewEndDate={viewEndDate}
            />
          </div>
        </main>
        
        <ChatSidebar 
          messages={[]}
          currentUser={project.manager} // Pass the manager as the current user
          onSendMessage={handleSendMessage}
          isVisible={activeRightSidebar === 'chat'}
        />
        <AiSidebar
          isVisible={activeRightSidebar === 'ai'}
        />
      </div>
    </div>
  );
};

export default ProjectManagement;