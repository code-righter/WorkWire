import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LeftSidebar } from "@/components/LeftSidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { GanttChart } from "@/components/GanttChart";

interface Task {
  id: string;
  title: string;
  category: string;
  status: 'done' | 'ongoing' | 'upcoming';
  startDate: Date;
  endDate: Date;
  progress: number;
  assignee?: string;
  description?: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  email: string;
  role: string;
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

const ProjectManagement = () => {
  // Sidebar states
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

  // Sample data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Identify Key Processes',
      category: 'process-mapping',
      status: 'done',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-04'),
      progress: 100,
      assignee: 'John Smith',
      description: 'Map out all critical business processes and identify key stakeholders.'
    },
    {
      id: '2',
      title: 'Interview Process Owners',
      category: 'process-mapping',
      status: 'done',
      startDate: new Date('2024-03-02'),
      endDate: new Date('2024-03-08'),
      progress: 100,
      assignee: 'Sarah Johnson',
      description: 'Conduct interviews with process owners to understand current workflows.'
    },
    {
      id: '3',
      title: 'Map Current Workflows',
      category: 'process-mapping',
      status: 'done',
      startDate: new Date('2024-03-05'),
      endDate: new Date('2024-03-12'),
      progress: 100,
      assignee: 'Mike Chen',
      description: 'Create detailed workflow maps for all identified processes.'
    },
    {
      id: '4',
      title: 'Analyze Workflow Data',
      category: 'bottleneck',
      status: 'done',
      startDate: new Date('2024-03-08'),
      endDate: new Date('2024-03-15'),
      progress: 100,
      assignee: 'Lisa Wang',
      description: 'Analyze collected data to identify patterns and inefficiencies.'
    },
    {
      id: '5',
      title: 'Identify Process Bottlenecks',
      category: 'bottleneck',
      status: 'ongoing',
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-03-20'),
      progress: 65,
      assignee: 'David Brown',
      description: 'Pinpoint specific bottlenecks causing process delays.'
    },
    {
      id: '6',
      title: 'Brainstorm Improvement Ideas',
      category: 'strategy',
      status: 'ongoing',
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-25'),
      progress: 40,
      assignee: 'Emily Davis',
      description: 'Generate innovative solutions to address identified bottlenecks.'
    },
    {
      id: '7',
      title: 'Evaluate Potential Solutions',
      category: 'strategy',
      status: 'ongoing',
      startDate: new Date('2024-03-18'),
      endDate: new Date('2024-03-28'),
      progress: 20,
      assignee: 'Robert Wilson',
      description: 'Assess feasibility and impact of proposed solutions.'
    },
    {
      id: '8',
      title: 'Select Best Solutions',
      category: 'strategy',
      status: 'upcoming',
      startDate: new Date('2024-03-22'),
      endDate: new Date('2024-03-30'),
      progress: 0,
      assignee: 'Amanda Taylor',
      description: 'Choose optimal solutions based on evaluation criteria.'
    },
    {
      id: '9',
      title: 'Update Workflow Processes',
      category: 'implementation',
      status: 'upcoming',
      startDate: new Date('2024-03-25'),
      endDate: new Date('2024-04-05'),
      progress: 0,
      assignee: 'Chris Anderson',
      description: 'Implement changes to existing workflow processes.'
    },
    {
      id: '10',
      title: 'Train Employees on New Processes',
      category: 'implementation',
      status: 'upcoming',
      startDate: new Date('2024-03-28'),
      endDate: new Date('2024-04-08'),
      progress: 0,
      assignee: 'Jessica Martinez',
      description: 'Provide comprehensive training on updated processes.'
    },
    {
      id: '11',
      title: 'Monitor New Processes',
      category: 'monitoring',
      status: 'upcoming',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-15'),
      progress: 0,
      assignee: 'Kevin Lee',
      description: 'Monitor implementation and track performance metrics.'
    },
    {
      id: '12',
      title: 'Review Results and Adjustments',
      category: 'monitoring',
      status: 'upcoming',
      startDate: new Date('2024-04-10'),
      endDate: new Date('2024-04-20'),
      progress: 0,
      assignee: 'Nicole Garcia',
      description: 'Review results and make necessary adjustments.'
    }
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'John Smith', isOnline: true, email: 'john@company.com', role: 'Project Manager' },
    { id: '2', name: 'Sarah Johnson', isOnline: true, email: 'sarah@company.com', role: 'Business Analyst' },
    { id: '3', name: 'Mike Chen', isOnline: false, email: 'mike@company.com', role: 'Process Specialist' },
    { id: '4', name: 'Lisa Wang', isOnline: true, email: 'lisa@company.com', role: 'Data Analyst' },
    { id: '5', name: 'David Brown', isOnline: true, email: 'david@company.com', role: 'Operations Lead' },
    { id: '6', name: 'Emily Davis', isOnline: false, email: 'emily@company.com', role: 'Strategy Consultant' },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Team, we\'ve completed the first phase of process mapping. Great work everyone!',
      sender: { id: '1', name: 'John Smith' },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: '2',
      content: 'Thanks John! The interviews revealed some interesting insights about our current workflows.',
      sender: { id: '2', name: 'Sarah Johnson' },
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: '3',
      content: 'I\'ve uploaded the workflow diagrams to the shared drive. Please review when you have a chance.',
      sender: { id: '3', name: 'Mike Chen' },
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: '4',
      content: 'The data analysis is showing some clear bottlenecks in our approval process. Will share detailed findings tomorrow.',
      sender: { id: '4', name: 'Lisa Wang' },
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text'
    }
  ]);

  const currentUser = {
    id: '1',
    name: 'John Smith',
    avatar: undefined
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      progress: newTask.status === 'done' ? 100 : newTask.status === 'ongoing' ? 50 : 0,
    };
    setTasks(prev => [...prev, task]);
  };

  const handleAddMember = (newMember: { name: string; email: string; role: string }) => {
    const member: TeamMember = {
      ...newMember,
      id: Date.now().toString(),
      isOnline: false,
    };
    setTeamMembers(prev => [...prev, member]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleSendMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: currentUser,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar 
        projectName="Operational Efficiency Project" 
        teamMembers={teamMembers}
        onToggleLeftSidebar={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
        onToggleRightSidebar={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar 
          tasks={tasks}
          onAddTask={handleAddTask}
          onAddMember={handleAddMember}
          isCollapsed={leftSidebarCollapsed}
        />
        
        <GanttChart 
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
        />
        
        <ChatSidebar 
          messages={messages}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
          isCollapsed={rightSidebarCollapsed}
        />
      </div>
    </div>
  );
};

export default ProjectManagement;