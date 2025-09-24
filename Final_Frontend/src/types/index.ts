// This interface will be used everywhere to represent a user or team member.
// It's the "single source of truth" for what a User object looks like.
export interface User {
  _id: string; // The ID from MongoDB
  name: string;
  email: string;
  isOnline?: boolean; // Optional, as the backend doesn't provide it
  role?: string;      // Optional
}

// This is the definitive Task interface, matching your backend schema.
export interface Task {
  _id: string;
  title: string;
  description: string;
  component: string;
  assignee: User; // Note: assignee is a full User object
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  startDate: string; // Kept as string to easily pass JSON data
  endDate: string;
  comments: any[]; // Define a proper Comment type later if needed
}

// This is the definitive Project interface.
export interface Project {
  _id: string;
  name: string;
  manager: User;
  description: string;
  timeline: string;
  members: User[];
  tasks: Task[];
  createdAt: string;
}