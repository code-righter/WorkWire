import { useState } from 'react';
import { Task, User } from '@/types'; // Import the unified types

// UI Components
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

// Define the component's props using the unified types
interface LeftSidebarProps {
  tasks: Task[];
  members: User[];
  isCollapsed: boolean;
  className?: string;
  onAddTask: (taskData: Omit<Task, '_id' | 'comments'>) => void;
}

// Define the shape for a new task form
const initialNewTaskState = {
  title: '',
  description: '',
  assigneeId: '',
  component: 'frontend',
  status: 'todo' as Task['status'],
  startDate: '',
  endDate: '',
};

export function LeftSidebar({ tasks, members, isCollapsed, className, onAddTask }: LeftSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState(initialNewTaskState);

  const handleSubmit = () => {
    // Validate required fields
    if (!newTask.title || !newTask.assigneeId || !newTask.startDate || !newTask.endDate) {
      // You can add a toast notification here for the user
      console.error("Missing required task fields");
      return;
    }

    const assignee = members.find(m => m._id === newTask.assigneeId);
    if (!assignee) return;

    // Call the onAddTask function passed from the parent component
    onAddTask({
      title: newTask.title,
      description: newTask.description,
      assignee: assignee, // Pass the full assignee object
      component: newTask.component,
      status: newTask.status,
      startDate: new Date(newTask.startDate).toISOString(),
      endDate: new Date(newTask.endDate).toISOString(),
    });

    // Reset form and close dialog
    setNewTask(initialNewTaskState);
    setIsDialogOpen(false);
  };

  if (isCollapsed) {
    return null; // Don't render anything if collapsed
  }

  return (
    <aside className={`w-80 border-r border-border p-4 flex flex-col ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Project Controls</h2>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mt-4 gap-2">
            <Plus className="h-4 w-4" /> Add New Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Create a New Task</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1"><Label htmlFor="task-title">Title</Label><Input id="task-title" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-1"><Label htmlFor="task-desc">Description</Label><Textarea id="task-desc" value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Assign To</Label><Select onValueChange={value => setNewTask(p => ({ ...p, assigneeId: value }))}><SelectTrigger><SelectValue placeholder="Select a member" /></SelectTrigger><SelectContent>{members.map(member => (<SelectItem key={member._id} value={member._id}>{member.name}</SelectItem>))}</SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label htmlFor="start-date">Start Date</Label><Input id="start-date" type="date" value={newTask.startDate} onChange={e => setNewTask(p => ({ ...p, startDate: e.target.value }))} /></div>
              <div className="space-y-1"><Label htmlFor="end-date">End Date</Label><Input id="end-date" type="date" value={newTask.endDate} onChange={e => setNewTask(p => ({ ...p, endDate: e.target.value }))} /></div>
            </div>
            <Button onClick={handleSubmit} className="w-full">Create Task</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Tasks ({tasks.length})</h3>
        <div className="space-y-2 overflow-y-auto">
          {tasks.map((task) => (
            <div key={task._id} className="p-2 border rounded-md">
              <p className="font-medium text-sm">{task.title}</p>
              <p className="text-xs text-muted-foreground">Assignee: {task.assignee.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Members ({members.length})</h3>
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member._id} className="text-sm">{member.name}</div>
          ))}
        </div>
      </div>
    </aside>
  );
}