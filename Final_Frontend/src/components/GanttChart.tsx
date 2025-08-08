import { useState, useEffect } from "react";
import { TaskDetailModal } from "./TaskDetailModal";

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

interface GanttChartProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function GanttChart({ tasks, onUpdateTask }: GanttChartProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [timelineStart, setTimelineStart] = useState<Date>();
  const [timelineEnd, setTimelineEnd] = useState<Date>();

  // Calculate timeline bounds
  useEffect(() => {
    if (tasks.length === 0) return;

    const allDates = tasks.flatMap(task => [task.startDate, task.endDate]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    // Add some padding
    minDate.setDate(minDate.getDate() - 1);
    maxDate.setDate(maxDate.getDate() + 1);
    
    setTimelineStart(minDate);
    setTimelineEnd(maxDate);
  }, [tasks]);

  if (!timelineStart || !timelineEnd) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Add tasks to see the Gantt chart</p>
      </div>
    );
  }

  const totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
  const dayWidth = Math.max(40, Math.min(80, 800 / totalDays)); // Responsive day width

  // Generate date headers
  const generateDateHeaders = () => {
    const headers = [];
    const current = new Date(timelineStart);
    
    while (current <= timelineEnd) {
      headers.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return headers;
  };

  const dateHeaders = generateDateHeaders();

  // Calculate task position and width
  const getTaskStyle = (task: Task) => {
    const taskStart = Math.max(task.startDate.getTime(), timelineStart.getTime());
    const taskEnd = Math.min(task.endDate.getTime(), timelineEnd.getTime());
    const startOffset = Math.floor((taskStart - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((taskEnd - taskStart) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      left: `${startOffset * dayWidth}px`,
      width: `${duration * dayWidth}px`,
    };
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      'process-mapping': 'hsl(var(--process-mapping))',
      'bottleneck': 'hsl(var(--bottleneck))',
      'strategy': 'hsl(var(--strategy))',
      'implementation': 'hsl(var(--implementation))',
      'monitoring': 'hsl(var(--monitoring))',
    };
    return colorMap[category as keyof typeof colorMap] || 'hsl(var(--primary))';
  };

  const getStatusOpacity = (status: string) => {
    switch (status) {
      case 'done': return '1';
      case 'ongoing': return '0.8';
      case 'upcoming': return '0.6';
      default: return '0.8';
    }
  };

  const categories = [
    { value: 'process-mapping', label: 'Process Mapping' },
    { value: 'bottleneck', label: 'Bottleneck Identification' },
    { value: 'strategy', label: 'Strategy Development' },
    { value: 'implementation', label: 'Implementation of Changes' },
    { value: 'monitoring', label: 'Monitoring and Review' }
  ];

  return (
    <div className="flex-1 bg-background overflow-auto">
      <div className="min-w-max">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border z-10">
          {/* Timeline header */}
          <div className="flex">
            <div className="w-64 p-4 border-r border-border bg-muted/30">
              <h3 className="font-semibold">Timeline</h3>
            </div>
            <div className="flex">
              {dateHeaders.map((date, index) => (
                <div
                  key={index}
                  className="border-r border-border bg-muted/10 flex flex-col items-center justify-center p-2"
                  style={{ width: `${dayWidth}px` }}
                >
                  <span className="text-xs font-medium">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category sections */}
        <div className="space-y-0">
          {categories.map((category) => {
            const categoryTasks = tasks.filter(task => task.category === category.value);
            
            if (categoryTasks.length === 0) return null;

            return (
              <div key={category.value} className="border-b border-border">
                {/* Category header */}
                <div className="flex">
                  <div 
                    className="w-64 p-4 border-r border-border font-medium text-sm"
                    style={{ 
                      backgroundColor: `${getCategoryColor(category.value)}20`,
                      borderLeft: `4px solid ${getCategoryColor(category.value)}`
                    }}
                  >
                    {category.label}
                  </div>
                  <div className="flex-1 relative" style={{ height: `${categoryTasks.length * 60 + 20}px` }}>
                    {/* Grid lines */}
                    {dateHeaders.map((_, index) => (
                      <div
                        key={index}
                        className="absolute top-0 bottom-0 border-r border-border/30"
                        style={{ left: `${index * dayWidth}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div className="relative">
                  {categoryTasks.map((task, taskIndex) => (
                    <div key={task.id} className="flex">
                      <div className="w-64 p-3 border-r border-border bg-card/50">
                        <div className="text-sm font-medium truncate">{task.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {task.assignee && `Assigned to: ${task.assignee}`}
                        </div>
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
                      
                      <div className="flex-1 relative h-14 border-r border-border/30">
                        {/* Grid lines */}
                        {dateHeaders.map((_, index) => (
                          <div
                            key={index}
                            className="absolute top-0 bottom-0 border-r border-border/30"
                            style={{ left: `${index * dayWidth}px` }}
                          />
                        ))}
                        
                        {/* Task bar */}
                        <div
                          className="absolute top-2 h-10 rounded-md cursor-pointer transition-all hover:shadow-md hover:scale-105 flex items-center px-3"
                          style={{
                            ...getTaskStyle(task),
                            backgroundColor: getCategoryColor(task.category),
                            opacity: getStatusOpacity(task.status),
                          }}
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-medium text-white truncate">
                              {task.title}
                            </span>
                            {task.status === 'ongoing' && (
                              <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                            )}
                          </div>
                          
                          {/* Progress bar for ongoing tasks */}
                          {task.status === 'ongoing' && (
                            <div className="absolute bottom-1 left-1 right-1 h-1 bg-white/30 rounded">
                              <div
                                className="h-full bg-white rounded"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={(updates) => {
            onUpdateTask(selectedTask.id, updates);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}