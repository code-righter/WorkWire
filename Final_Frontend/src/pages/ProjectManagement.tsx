import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@/lib/api";
import { Project, Task, User } from "@/types"; // Correctly importing from the central file

// Components & Icons
import { Navbar } from "@/components/Navbar";
import { LeftSidebar } from "@/components/LeftSidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { GanttChart } from "@/components/GanttChart";
import { AiSidebar } from "@/components/AiSidebar";
import { WandSparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ProjectManagement() {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRightSidebar, setActiveRightSidebar] = useState<'chat' | 'ai' | null>(null);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true);

  const [viewStartDate, setViewStartDate] = useState<Date>(new Date());
  const [viewEndDate, setViewEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (projectId) {
      const fetchProjectData = async () => {
        setIsLoading(true);
        try {
          const PROJECT_DETAILS_URL = `http://localhost:3000/api/v1/projects/getProject/${projectId}`;
          const response = await apiClient.get(PROJECT_DETAILS_URL);
          const projectData: Project = response.data;
          setProject(projectData);

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
          toast({ title: "Error", description: "Could not load project data.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchProjectData();
    }
  }, [projectId, toast]);
  
  const handleAddTask = async (newTaskData: Omit<Task, '_id' | 'comments'>) => {
    if (!project) return;
    try {
      const ADD_TASK_URL = `http://localhost:3000/api/v1/projects/${project._id}/tasks`;
      const response = await apiClient.post(ADD_TASK_URL, newTaskData);
      
      setProject(prevProject => {
        if (!prevProject) return null;
        return { ...prevProject, tasks: [...prevProject.tasks, response.data] };
      });
      toast({ title: "Success", description: "New task has been added." });
    } catch (error) {
      console.error("Failed to add task:", error);
      toast({ title: "Error", description: "Could not add the new task.", variant: "destructive" });
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!project) return;
    try {
      const UPDATE_TASK_URL = `http://localhost:3000/api/v1/projects/${project._id}/tasks/${taskId}`;
      const response = await apiClient.put(UPDATE_TASK_URL, updates);

      setProject(prevProject => {
        if (!prevProject) return null;
        return {
          ...prevProject,
          tasks: prevProject.tasks.map(task => 
            task._id === taskId ? response.data : task
          ),
        };
      });
    } catch (error) {
      console.error("Failed to update task:", error);
      toast({ title: "Error", description: "Could not update the task.", variant: "destructive" });
    }
  };

  const handleAiTasksGenerated = (generatedTasks: Omit<Task, '_id' | 'comments'>[]) => {
    generatedTasks.forEach(task => handleAddTask(task));
    toast({ title: "AI Tasks Added", description: `${generatedTasks.length} new tasks have been added.` });
  };
  
  const toggleLeftSidebar = () => setLeftSidebarCollapsed(prev => !prev);
  const toggleRightSidebar = (sidebar: 'chat' | 'ai') => {
    setActiveRightSidebar(current => (current === sidebar ? null : sidebar));
  };
  
  if (isLoading || !project) {
    return <div className="h-screen flex items-center justify-center">Loading Project...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar 
        projectName={project.name}
        teamMembers={project.members}
        onToggleLeftSidebar={toggleLeftSidebar}
        customActions={
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => toggleRightSidebar('ai')} title="AI Assistant">
              <WandSparkles className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => toggleRightSidebar('chat')} title="Team Chat">
              <MessageSquare className="h-5 w-5" />
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
            members={project.members}
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
          currentUser={project.manager}
          onSendMessage={() => {}}
          isVisible={activeRightSidebar === 'chat'}
        />
        <AiSidebar
          isVisible={activeRightSidebar === 'ai'}
          onTasksGenerated={handleAiTasksGenerated}
          projectMembers={project.members}
        />
      </div>
    </div>
  );
};