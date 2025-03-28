
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BaseModule from './BaseModule';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatModuleProps {
  frameId: string;
  isTargeted: boolean;
}

const ChatModule = ({ frameId, isTargeted }: ChatModuleProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I am ART, your personal assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate assistant response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've processed your request: "${inputValue}"`,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <BaseModule
      frameId={frameId}
      isTargeted={isTargeted}
      title="Chat"
      icon={<MessageSquare className="h-4 w-4" />}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-secondary text-secondary-foreground max-w-[80%] rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-current rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-current rounded-full animate-pulse delay-150"></div>
                  <div className="h-2 w-2 bg-current rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={!isTargeted}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !isTargeted}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </BaseModule>
  );
};

export default ChatModule;
