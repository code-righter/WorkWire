import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MessageSquare, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            WorkWire
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional project management with interactive Gantt charts, team collaboration, and real-time progress tracking.
          </p>
          <Link to="/project">
            <Button size="lg" className="px-8 py-3 text-lg">
              Launch Project Dashboard
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="text-center p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Gantt Charts</h3>
            <p className="text-sm text-muted-foreground">
              Visualize project timelines with drag-and-drop Gantt charts and real-time progress tracking.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Team Management</h3>
            <p className="text-sm text-muted-foreground">
              Add team members, assign tasks, and track who's online with real-time status indicators.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-strategy/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-strategy" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Team Chat</h3>
            <p className="text-sm text-muted-foreground">
              Built-in chat system for seamless team communication and project updates.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-implementation/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-implementation" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Task Management</h3>
            <p className="text-sm text-muted-foreground">
              Create, edit, and track tasks with detailed information, deadlines, and progress indicators.
            </p>
          </div>
        </div>

        {/* Project Categories */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Project Categories</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-lg border-l-4 border-process-mapping bg-process-mapping/10">
              <h4 className="font-semibold text-process-mapping">Process Mapping</h4>
              <p className="text-xs text-muted-foreground mt-1">Identify and document workflows</p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-bottleneck bg-bottleneck/10">
              <h4 className="font-semibold text-bottleneck">Bottleneck Analysis</h4>
              <p className="text-xs text-muted-foreground mt-1">Find and resolve process constraints</p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-strategy bg-strategy/10">
              <h4 className="font-semibold text-strategy">Strategy Development</h4>
              <p className="text-xs text-muted-foreground mt-1">Plan and evaluate solutions</p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-implementation bg-implementation/10">
              <h4 className="font-semibold text-implementation">Implementation</h4>
              <p className="text-xs text-muted-foreground mt-1">Execute changes and train teams</p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-monitoring bg-monitoring/10">
              <h4 className="font-semibold text-monitoring">Monitoring & Review</h4>
              <p className="text-xs text-muted-foreground mt-1">Track results and optimize</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
