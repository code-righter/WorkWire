import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus, Users, Calendar, MoreVertical, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// --- Configuration Variables ---
const API_BASE_URL = "http://localhost:3000/api/v1";
const PROJECTS_LIST_URL = (userId: string) => `${API_BASE_URL}/projects/listProjects/${userId}`;
const PROJECT_CREATE_URL = (userId: string) => `${API_BASE_URL}/projects/createProject/${userId}`;
const PROJECT_UPDATE_URL = (projectId: string) => `${API_BASE_URL}/projects/updateProject/${projectId}`;
const PROJECT_DELETE_URL = (projectId: string) => `${API_BASE_URL}/projects/deleteProject/${projectId}`;

// --- Type Definitions ---
export interface Project {
  _id: string;
  name: string;
  description: string;
  timeline: string;
  members: string[];
  updatedAt: string;
}

interface NewProjectData {
  name: string;
  description: string;
  timeline: string;
  members: string[];
}

const initialNewProjectState: NewProjectData = {
  name: "",
  description: "",
  timeline: "",
  members: [],
};

// --- Helper Functions ---
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
}

// --- Main Component ---
export default function Lobby() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState<NewProjectData>(initialNewProjectState);
  const [memberEmail, setMemberEmail] = useState("");
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  useEffect(() => {
    if (user?._id) {
      const fetchProjects = async () => {
        setIsLoading(true);
        try {
          const responseData = await apiClient.get(PROJECTS_LIST_URL(user._id));
          setProjects(responseData.data || []);
        } catch (error) {
          toast({ title: "Error", description: "Could not load projects.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchProjects();
    }
  }, [user, toast]);

  useEffect(() => {
    if (isCreateDialogOpen && user?.email) {
      setNewProject({ ...initialNewProjectState, members: [user.email] });
    }
  }, [isCreateDialogOpen, user?.email]);

  const handleAddMember = () => {
    if (memberEmail && !newProject.members.includes(memberEmail)) {
      setNewProject(prev => ({ ...prev, members: [...prev.members, memberEmail] }));
      setMemberEmail("");
    }
  };

  
const handleCreateProject = async () => {
  if (!newProject.name || !newProject.timeline) {
    toast({ title: "Missing Fields", description: "Project Name and Timeline are required.", variant: "destructive" });
    return;
  }
  // Check for user and user._id
  if (!user?._id) {
    toast({ title: "Authentication Error", description: "Could not identify user.", variant: "destructive" });
    return;
  }
  
  setIsCreating(true);
  try {
    // The payload now correctly sends the user's ID as the manager
    const payload = {
      ...newProject,
      manager: user._id, // Send the user's ID, not email
    };
    
    // The API call now uses the URL with the user's ID
    const responseData = await apiClient.post(PROJECT_CREATE_URL(user._id), payload);
    
    setProjects(currentProjects => [responseData.data, ...currentProjects]);
    setIsCreateDialogOpen(false);
    toast({ title: "Project created!", description: `${responseData.data.name} is ready.` });
  } catch (error) {
    toast({ title: "Error", description: "Failed to create project.", variant: "destructive" });
  } finally {
    setIsCreating(false);
  }
};

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    try {
      const payload = { name: editingProject.name, description: editingProject.description, timeline: editingProject.timeline };
      const responseData = await apiClient.put(PROJECT_UPDATE_URL(editingProject._id), payload);
      setProjects(projects.map(p => p._id === editingProject._id ? responseData.data : p));
      setIsUpdateDialogOpen(false);
      setEditingProject(null);
      toast({ title: "Success", description: "Project has been updated." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update project.", variant: "destructive" });
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await apiClient.delete(PROJECT_DELETE_URL(projectToDelete._id));
      setProjects(projects.filter(p => p._id !== projectToDelete._id));
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
      toast({ title: "Success", description: "Project has been deleted." });
    } catch (error)
    {
      toast({ title: "Error", description: "Failed to delete project.", variant: "destructive" });
    }
  };

  const openUpdateDialog = (project: Project) => {
    setEditingProject({ ...project });
    setIsUpdateDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out successfully." });
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading Projects...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">WorkWire</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" />Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Projects</h2>
            <p className="text-muted-foreground mt-2">Manage and track your project timelines</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />New Project</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1"><Label htmlFor="project-name">Project Name</Label><Input id="project-name" value={newProject.name} onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))} /></div>
                <div className="space-y-1"><Label htmlFor="project-description">Description</Label><Textarea id="project-description" value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} /></div>
                <div className="space-y-1"><Label>Timeline</Label><Select onValueChange={value => setNewProject(p => ({ ...p, timeline: value }))}><SelectTrigger><SelectValue placeholder="Select a timeline" /></SelectTrigger><SelectContent><SelectItem value="1M">1 Month</SelectItem><SelectItem value="3M">3 Months</SelectItem><SelectItem value="6M">6 Months</SelectItem><SelectItem value="1YR">1 Year</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Invite Members</Label><div className="flex gap-2"><Input placeholder="Enter member email" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} /><Button type="button" variant="outline" onClick={handleAddMember}>Add</Button></div><div className="flex flex-wrap gap-2 pt-2">{newProject.members.map(email => (<div key={email} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">{email}</div>))}</div></div>
                <Button onClick={handleCreateProject} className="w-full" disabled={isCreating}>{isCreating ? "Creating..." : "Create Project"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id} className="flex flex-col justify-between">
              <div onClick={() => navigate(`/project/${project._id}`)} className="cursor-pointer">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex-grow pr-2">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2 h-10 pt-1">{project.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={(e) => e.stopPropagation()}><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem onClick={() => openUpdateDialog(project)}>Update Project</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteDialog(project)} className="text-red-600">Delete Project</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
              </div>
              <div onClick={() => navigate(`/project/${project._id}`)} className="cursor-pointer mt-auto">
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><Users className="h-4 w-4" /><span>{project.members.length} members</span></div>
                    <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><span>{formatTimeAgo(project.updatedAt)}</span></div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        {projects.length === 0 && !isLoading && (
          <div className="text-center py-16 col-span-full"><h3 className="text-lg font-medium text-muted-foreground">No projects found.</h3><p className="text-sm text-muted-foreground">Create your first project to get started.</p></div>
        )}
      </main>

      {/* Update Project Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Project: {editingProject?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1"><Label htmlFor="update-project-name">Project Name</Label><Input id="update-project-name" value={editingProject?.name || ''} onChange={e => setEditingProject(p => p ? { ...p, name: e.target.value } : null)} /></div>
            <div className="space-y-1"><Label htmlFor="update-project-description">Description</Label><Textarea id="update-project-description" value={editingProject?.description || ''} onChange={e => setEditingProject(p => p ? { ...p, description: e.target.value } : null)} /></div>
            <div className="space-y-1"><Label>Timeline</Label><Select value={editingProject?.timeline || ''} onValueChange={value => setEditingProject(p => p ? { ...p, timeline: value } : null)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1M">1 Month</SelectItem><SelectItem value="3M">3 Months</SelectItem><SelectItem value="6M">6 Months</SelectItem><SelectItem value="1YR">1 Year</SelectItem></SelectContent></Select></div>
            <Button onClick={handleUpdateProject} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the project "{projectToDelete?.name}" and all of its associated data.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}