import { useState } from "react";
import { Calendar, User, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
}

export function TaskDetailModal({ task, isOpen, onClose, onSave }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    assignee: task.assignee || '',
    status: task.status,
    startDate: task.startDate.toISOString().split('T')[0],
    endDate: task.endDate.toISOString().split('T')[0],
    progress: task.progress.toString(),
  });

  const categories = {
    'process-mapping': 'Process Mapping',
    'bottleneck': 'Bottleneck Identification',
    'strategy': 'Strategy Development',
    'implementation': 'Implementation of Changes',
    'monitoring': 'Monitoring and Review'
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      'process-mapping': 'process-mapping',
      'bottleneck': 'bottleneck',
      'strategy': 'strategy',
      'implementation': 'implementation',
      'monitoring': 'monitoring',
    };
    return colorMap[category as keyof typeof colorMap] || 'primary';
  };

  const handleSave = () => {
    const updates: Partial<Task> = {
      title: editData.title,
      description: editData.description,
      assignee: editData.assignee,
      status: editData.status,
      startDate: new Date(editData.startDate),
      endDate: new Date(editData.endDate),
      progress: parseInt(editData.progress, 10),
    };

    onSave(updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      assignee: task.assignee || '',
      status: task.status,
      startDate: task.startDate.toISOString().split('T')[0],
      endDate: task.endDate.toISOString().split('T')[0],
      progress: task.progress.toString(),
    });
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = () => {
    const diffTime = Math.abs(task.endDate.getTime() - task.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Task Details</DialogTitle>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Title */}
          <div>
            <Label htmlFor="title">Task Title</Label>
            {isEditing ? (
              <Input
                id="title"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-2"
              />
            ) : (
              <h2 className="text-2xl font-bold mt-2">{task.title}</h2>
            )}
          </div>

          {/* Category and Status */}
          <div className="flex items-center space-x-4">
            <div>
              <Label>Category</Label>
              <Badge 
                variant="secondary" 
                className="mt-2 block w-fit"
                style={{ 
                  backgroundColor: `hsl(var(--${getCategoryColor(task.category)})/0.2)`,
                  color: `hsl(var(--${getCategoryColor(task.category)}))`,
                  border: `1px solid hsl(var(--${getCategoryColor(task.category)})/0.3)`
                }}
              >
                {categories[task.category as keyof typeof categories]}
              </Badge>
            </div>
            
            <div>
              <Label>Status</Label>
              {isEditing ? (
                <Select
                  value={editData.status}
                  onValueChange={(value: 'done' | 'ongoing' | 'upcoming') => 
                    setEditData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="mt-2 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">On-Going</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge 
                  variant="secondary"
                  className={`mt-2 block w-fit ${
                    task.status === 'done' 
                      ? 'bg-status-done/20 text-status-done border-status-done/30' 
                      : task.status === 'ongoing'
                      ? 'bg-status-ongoing/20 text-status-ongoing border-status-ongoing/30'
                      : 'bg-status-upcoming/20 text-status-upcoming border-status-upcoming/30'
                  }`}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add task description..."
                className="mt-2"
                rows={4}
              />
            ) : (
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            )}
          </div>

          {/* Assignee */}
          <div>
            <Label htmlFor="assignee">Assignee</Label>
            {isEditing ? (
              <Input
                id="assignee"
                value={editData.assignee}
                onChange={(e) => setEditData(prev => ({ ...prev, assignee: e.target.value }))}
                placeholder="Assign to team member"
                className="mt-2"
              />
            ) : (
              <div className="flex items-center mt-2">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {task.assignee || 'Unassigned'}
                </span>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              {isEditing ? (
                <Input
                  id="startDate"
                  type="date"
                  value={editData.startDate}
                  onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="mt-2"
                />
              ) : (
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{formatDate(task.startDate)}</span>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="endDate">End Date</Label>
              {isEditing ? (
                <Input
                  id="endDate"
                  type="date"
                  value={editData.endDate}
                  onChange={(e) => setEditData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="mt-2"
                />
              ) : (
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{formatDate(task.endDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Duration and Progress */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Duration</Label>
              <p className="text-sm mt-2">{calculateDuration()} days</p>
            </div>
            
            <div>
              <Label htmlFor="progress">Progress</Label>
              {isEditing ? (
                <div className="mt-2">
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={editData.progress}
                    onChange={(e) => setEditData(prev => ({ ...prev, progress: e.target.value }))}
                    className="w-20"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">%</span>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12">{task.progress}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}