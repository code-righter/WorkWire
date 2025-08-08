import { Users, Settings, Bell, Menu, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
}

interface NavbarProps {
  projectName: string;
  teamMembers: TeamMember[];
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
}

export function Navbar({ projectName, teamMembers, onToggleLeftSidebar, onToggleRightSidebar }: NavbarProps) {
  const onlineMembers = teamMembers.filter(member => member.isOnline);

  return (
    <nav className="h-14 border-b border-border bg-background px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onToggleLeftSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{projectName}</h1>
        <Badge variant="secondary" className="text-xs">
          {teamMembers.length} members
        </Badge>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {onlineMembers.length} online
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {onlineMembers.slice(0, 4).map((member) => (
            <div key={member.id} className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-accent rounded-full border-2 border-background"></div>
            </div>
          ))}
          {onlineMembers.length > 4 && (
            <Badge variant="outline" className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-xs">
              +{onlineMembers.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleRightSidebar}>
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}