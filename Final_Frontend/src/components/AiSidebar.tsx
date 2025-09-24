import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Task, User } from '@/types'; // Assuming you have this central types file

interface AiSidebarProps {
  isVisible: boolean;
  onTasksGenerated: (tasks: Omit<Task, '_id' | 'comments'>[]) => void;
  projectMembers: User[]; // Pass members to assign tasks
}

export const AiSidebar = ({ isVisible, onTasksGenerated, projectMembers }: AiSidebarProps) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTasks = async () => {
    if (!prompt) return;
    setIsLoading(true);

    // This is the structured format we'll ask the AI to return
    const schema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          description: { type: "STRING" },
          component: { type: "STRING", enum: ['frontend', 'backend', 'database', 'devops', 'other'] },
          // The AI will pick an assignee from the list we provide
          assigneeEmail: { type: "STRING" }, 
          durationDays: { type: "NUMBER" },
        },
      }
    };

    // Provide the list of member emails as context for the AI
    const memberEmails = projectMembers.map(m => m.email).join(', ');
    const fullPrompt = `
      Based on the goal "${prompt}", break it down into actionable tasks for a software project.
      Assign each task to one of the following team members: ${memberEmails}.
      Estimate the duration of each task in days.
      Respond in the requested JSON format.
    `;

    try {
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: fullPrompt }] });
        const payload = {
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        };
        const apiKey = "" 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(payload)
               });
        const result = await response.json();
        
        if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
            const generatedTasksRaw = JSON.parse(result.candidates[0].content.parts[0].text);

            // Convert the raw AI response into the format our app uses
            const formattedTasks = generatedTasksRaw.map((task: any) => {
              const assignee = projectMembers.find(m => m.email === task.assigneeEmail);
              const startDate = new Date();
              const endDate = new Date();
              endDate.setDate(startDate.getDate() + (task.durationDays || 5)); // Default 5 days

              return {
                title: task.title,
                description: task.description,
                component: task.component || 'other',
                assignee: assignee, // Assign the full user object
                status: 'todo',
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              };
            });
            
            onTasksGenerated(formattedTasks); // Send the tasks back to the parent
        }

    } catch (error) {
      console.error("AI task generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-80 border-l border-border bg-card p-4 flex flex-col">
      <h3 className="text-lg font-semibold">AI Assistant</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Describe a goal, and the AI will break it down into tasks.
      </p>
      <div className="mt-4 space-y-2 flex-grow">
        <Label htmlFor="ai-prompt">Project Goal</Label>
        <Textarea
          id="ai-prompt"
          placeholder="e.g., 'Develop a user authentication feature'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="h-32"
        />
      </div>
      <Button onClick={handleGenerateTasks} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Tasks'}
      </Button>
    </div>
  );
};