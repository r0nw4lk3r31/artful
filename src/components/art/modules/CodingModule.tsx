
import React, { useState, useEffect } from 'react';
import { Code, Copy, Save, Trash, FileCode, Edit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import BaseModule from './BaseModule';
import { useToast } from '@/hooks/use-toast';

interface CodingModuleProps {
  frameId: string;
  isTargeted: boolean;
}

interface CodeSnippet {
  id: string;
  content: string;
  language: string;
  title: string;
  timestamp: Date;
}

const CodingModule = ({ frameId, isTargeted }: CodingModuleProps) => {
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const { toast } = useToast();

  // Listen for code blocks in chat messages from localStorage
  useEffect(() => {
    const checkForCodeInChat = () => {
      // This is a simplified example - in a real app you'd have a more robust way to
      // detect and extract code from chat messages
      const chatMessages = localStorage.getItem('chatMessages');
      if (chatMessages) {
        try {
          const messages = JSON.parse(chatMessages);
          const codeRegex = /```([a-z]*)\n([\s\S]*?)```/g;
          let match;
          
          // Process the most recent message that contains code
          const latestMessage = messages[messages.length - 1]?.content;
          if (latestMessage) {
            // Reset match state
            codeRegex.lastIndex = 0;
            const matches = [];
            
            // Find all code blocks in the message
            while ((match = codeRegex.exec(latestMessage)) !== null) {
              const language = match[1] || 'text';
              const code = match[2].trim();
              
              matches.push({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                content: code,
                language: language,
                title: `Snippet from Chat (${language})`,
                timestamp: new Date()
              });
            }
            
            // If we found new code, add it to our snippets
            if (matches.length > 0) {
              setCodeSnippets(prev => [...matches, ...prev]);
              toast({
                title: "Code Detected",
                description: `${matches.length} code snippets found in chat`,
              });
            }
          }
        } catch (e) {
          console.error("Error parsing chat messages:", e);
        }
      }
    };

    // Check when the module mounts
    checkForCodeInChat();
    
    // Set up interval to check periodically
    const interval = setInterval(checkForCodeInChat, 3000);
    return () => clearInterval(interval);
  }, [toast]);

  const handleCreateNewSnippet = () => {
    const newSnippet: CodeSnippet = {
      id: Date.now().toString(),
      content: '',
      language: 'javascript',
      title: 'New Snippet',
      timestamp: new Date()
    };
    
    setCodeSnippets(prev => [newSnippet, ...prev]);
    setCurrentSnippet(newSnippet);
    setIsEditing(true);
    setEditContent('');
    setEditTitle('New Snippet');
    
    toast({
      title: "New Snippet Created",
      description: "Start coding in the editor",
    });
  };

  const handleEditSnippet = (snippet: CodeSnippet) => {
    setCurrentSnippet(snippet);
    setEditContent(snippet.content);
    setEditTitle(snippet.title);
    setIsEditing(true);
  };

  const handleSaveSnippet = () => {
    if (!currentSnippet) return;
    
    const updatedSnippet: CodeSnippet = {
      ...currentSnippet,
      content: editContent,
      title: editTitle,
      timestamp: new Date()
    };
    
    setCodeSnippets(prev => 
      prev.map(s => s.id === currentSnippet.id ? updatedSnippet : s)
    );
    setCurrentSnippet(updatedSnippet);
    setIsEditing(false);
    
    toast({
      title: "Snippet Saved",
      description: `"${editTitle}" has been saved`,
    });
  };

  const handleDeleteSnippet = (id: string) => {
    setCodeSnippets(prev => prev.filter(s => s.id !== id));
    
    if (currentSnippet?.id === id) {
      setCurrentSnippet(null);
      setIsEditing(false);
    }
    
    toast({
      title: "Snippet Deleted",
      description: "The code snippet has been removed",
    });
  };

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: "Code has been copied to clipboard",
        });
      })
      .catch(err => {
        toast({
          title: "Failed to Copy",
          description: "Could not copy to clipboard",
          variant: "destructive"
        });
      });
  };

  const processCommand = (command: string) => {
    if (!command.trim()) return;
    
    // Simple command handling
    if (command.startsWith('/new')) {
      handleCreateNewSnippet();
    } else if (command.startsWith('/save') && currentSnippet) {
      handleSaveSnippet();
    } else if (command.startsWith('/edit') && currentSnippet) {
      setIsEditing(true);
    } else if (command.startsWith('/copy') && currentSnippet) {
      handleCopyToClipboard(currentSnippet.content);
    } else if (command.startsWith('/delete') && currentSnippet) {
      handleDeleteSnippet(currentSnippet.id);
    } else {
      // If it's not a command, assume it's code to add/update
      if (currentSnippet && isEditing) {
        setEditContent(prev => prev + "\n" + command);
      } else if (currentSnippet) {
        handleEditSnippet(currentSnippet);
        setEditContent(prev => prev + "\n" + command);
      } else {
        // Create a new snippet with the command as content
        const newSnippet: CodeSnippet = {
          id: Date.now().toString(),
          content: command,
          language: 'text',
          title: 'Console Input',
          timestamp: new Date()
        };
        setCodeSnippets(prev => [newSnippet, ...prev]);
        setCurrentSnippet(newSnippet);
      }
    }
  };

  return (
    <BaseModule
      frameId={frameId}
      isTargeted={isTargeted}
      title="Code Editor"
      icon={<Code className="h-4 w-4" />}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between mb-3">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={handleCreateNewSnippet}
              variant="outline"
            >
              <FileCode className="h-4 w-4 mr-1" />
              New
            </Button>
            
            {currentSnippet && (
              <>
                {isEditing ? (
                  <Button size="sm" onClick={handleSaveSnippet} variant="outline">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleEditSnippet(currentSnippet)} variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  onClick={() => handleCopyToClipboard(currentSnippet.content)}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={() => handleDeleteSnippet(currentSnippet.id)}
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 flex-1">
          {/* Snippets List */}
          <div className="col-span-1 bg-muted rounded-md p-2 overflow-hidden">
            <h3 className="font-medium text-sm mb-2">Snippets</h3>
            <ScrollArea className="h-[calc(100%-2rem)]">
              <div className="space-y-2">
                {codeSnippets.length > 0 ? (
                  codeSnippets.map(snippet => (
                    <div 
                      key={snippet.id}
                      className={`p-2 rounded-md cursor-pointer hover:bg-accent text-sm ${
                        currentSnippet?.id === snippet.id ? 'bg-accent' : 'bg-background'
                      }`}
                      onClick={() => {
                        setCurrentSnippet(snippet);
                        setIsEditing(false);
                      }}
                    >
                      <div className="font-medium truncate">{snippet.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {snippet.language} • {snippet.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground p-2">
                    No snippets yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Code Editor/Viewer */}
          <div className="col-span-3 bg-muted rounded-md p-2 overflow-hidden flex flex-col">
            {currentSnippet ? (
              <>
                <div className="mb-2 flex justify-between items-center">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-background border border-input px-2 py-1 rounded-md text-sm flex-1 mr-2"
                    />
                  ) : (
                    <h3 className="font-medium text-sm">{currentSnippet.title}</h3>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {currentSnippet.language}
                  </span>
                </div>
                
                <ScrollArea className="flex-1">
                  {isEditing ? (
                    <Textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[300px] font-mono text-sm bg-background"
                    />
                  ) : (
                    <pre className="text-sm font-mono bg-background p-3 rounded-md whitespace-pre-wrap">
                      {currentSnippet.content}
                    </pre>
                  )}
                </ScrollArea>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Select a snippet or create a new one to start coding
              </div>
            )}
          </div>
        </div>

        {!isTargeted && (
          <div className="py-3 mt-3 text-center text-sm text-muted-foreground border border-dashed rounded-md">
            Click to target this coding frame and use the console command bar below
          </div>
        )}
      </div>
    </BaseModule>
  );
};

export default CodingModule;
