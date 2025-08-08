import { useState } from "react";
import { Plus, Users, Calendar, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Task {
  id: string;
  title: string;
  category: string;
  status: 'done' | 'ongoing' | 'upcoming';
}

interface LeftSidebarProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onAddMember: (member: { name: string; email: string; role: string }) => void;
  isCollapsed: boolean;
}

export function LeftSidebar({ tasks, onAddTask, onAddMember, isCollapsed }: LeftSidebarProps) {
  const [taskFormData, setTaskFormData] = useState<{
    title: string;
    category: string;
    status: 'done' | 'ongoing' | 'upcoming';
    description: string;
    assignee: string;
    deadline: string;
  }>({
    title: '',
    category: '',
    status: 'upcoming',
    description: '',
    assignee: '',
    deadline: ''
  });

  const [memberFormData, setMemberFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    { value: 'process-mapping', label: 'Process Mapping', color: 'process-mapping' },
    { value: 'bottleneck', label: 'Bottleneck Identification', color: 'bottleneck' },
    { value: 'strategy', label: 'Strategy Development', color: 'strategy' },
    { value: 'implementation', label: 'Implementation', color: 'implementation' },
    { value: 'monitoring', label: 'Monitoring & Review', color: 'monitoring' }
  ];

  const handleAddTask = () => {
    if (taskFormData.title && taskFormData.category) {
      onAddTask({
        title: taskFormData.title,
        category: taskFormData.category,
        status: taskFormData.status
      });
      setTaskFormData({
        title: '',
        category: '',
        status: 'upcoming',
        description: '',
        assignee: '',
        deadline: ''
      });
    }
  };

  const handleAddMember = () => {
    if (memberFormData.name && memberFormData.email) {
      onAddMember(memberFormData);
      setMemberFormData({ name: '', email: '', role: '' });
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (isCollapsed) {
    return (
      <div className="w-16 border-r border-border bg-background h-full flex flex-col items-center py-4 space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="default" className="h-10 w-10">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={taskFormData.category}
                  onValueChange={(value) => setTaskFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={taskFormData.status}
                  onValueChange={(value: 'done' | 'ongoing' | 'upcoming') => 
                    setTaskFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">On-Going</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline" className="h-10 w-10">
              <Users className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={memberFormData.name}
                  onChange={(e) => setMemberFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={memberFormData.email}
                  onChange={(e) => setMemberFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>

              <Button onClick={handleAddMember} className="w-full">
                Add Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button size="icon" variant="ghost" className="h-10 w-10">
          <Calendar className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" className="h-10 w-10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-background h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">Project Controls</h2>
        
        <div className="space-y-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full justify-start" variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={taskFormData.category}
                    onValueChange={(value) => setTaskFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={taskFormData.status}
                    onValueChange={(value: 'done' | 'ongoing' | 'upcoming') => 
                      setTaskFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">On-Going</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Task description"
                  />
                </div>

                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={taskFormData.assignee}
                    onChange={(e) => setTaskFormData(prev => ({ ...prev, assignee: e.target.value }))}
                    placeholder="Assign to team member"
                  />
                </div>

                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={taskFormData.deadline}
                    onChange={(e) => setTaskFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>

                <Button onClick={handleAddTask} className="w-full">
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={memberFormData.name}
                    onChange={(e) => setMemberFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={memberFormData.email}
                    onChange={(e) => setMemberFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={memberFormData.role}
                    onValueChange={(value) => setMemberFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-manager">Project Manager</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="stakeholder">Stakeholder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAddMember} className="w-full">
                  Add Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search Tasks</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                className="pl-9"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="filter">Filter by Category</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Tasks ({filteredTasks.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTasks.map((task) => {
                const category = categories.find(c => c.value === task.category);
                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{task.title}</h4>
                      <div 
                        className={`h-2 w-2 rounded-full`}
                        style={{ backgroundColor: `hsl(var(--${category?.color}))` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{category?.label}</p>
                    <div className="mt-2">
                      <span 
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          task.status === 'done' 
                            ? 'bg-status-done/20 text-status-done' 
                            : task.status === 'ongoing'
                            ? 'bg-status-ongoing/20 text-status-ongoing'
                            : 'bg-status-upcoming/20 text-status-upcoming'
                        }`}
                      >
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}