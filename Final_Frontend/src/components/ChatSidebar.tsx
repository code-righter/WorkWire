import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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

interface ChatSidebarProps {
  messages: Message[];
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  onSendMessage: (content: string) => void;
  isCollapsed: boolean;
}

export function ChatSidebar({ messages, currentUser, onSendMessage, isCollapsed }: ChatSidebarProps) {
  const [messageInput, setMessageInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = message.timestamp.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  if (isCollapsed) {
    return (
      <div className="w-16 border-l border-border bg-background h-full flex flex-col items-center justify-center">
        <div className="relative">
          <Send className="h-6 w-6 text-muted-foreground" />
          {messages.length > 0 && (
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs text-primary-foreground font-bold">
                {messages.length > 9 ? '9+' : messages.length}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-chat-bg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-chat-border bg-background">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Team Chat</h2>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {messages.length} messages
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
            <div key={dateKey}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <div className="flex-1 border-t border-chat-border"></div>
                <span className="px-3 text-xs text-muted-foreground bg-chat-bg">
                  {formatDate(new Date(dateKey))}
                </span>
                <div className="flex-1 border-t border-chat-border"></div>
              </div>

              {/* Messages for this date */}
              {dayMessages.map((message, index) => {
                const isCurrentUser = message.sender.id === currentUser.id;
                const showAvatar = index === 0 || dayMessages[index - 1].sender.id !== message.sender.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                          <AvatarFallback className="text-xs">
                            {message.sender.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8" />
                      )}
                    </div>
                    
                    <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                      {showAvatar && (
                        <div className={`flex items-center space-x-2 mb-1 ${isCurrentUser ? 'justify-end' : ''}`}>
                          <span className="text-sm font-medium">{message.sender.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      )}
                      
                      <div
                        className={`inline-block max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-chat-message border border-chat-border'
                        }`}
                      >
                        {message.type === 'system' ? (
                          <p className="text-xs italic text-muted-foreground">{message.content}</p>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      
                      {!showAvatar && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatTime(message.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-chat-border bg-background">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Paperclip className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Smile className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            size="sm"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}