
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { ChatService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare } from 'lucide-react';

interface ChatConsoleProps {
  className?: string;
}

const ChatConsole: React.FC<ChatConsoleProps> = ({ className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history
    const loadChatHistory = async () => {
      try {
        const history = await ChatService.getHistory();
        setMessages(history);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };
    
    loadChatHistory();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Send to API
    try {
      setIsLoading(true);
      const response = await ChatService.sendMessage(newMessage);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: 'system',
        message: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`cyber-panel flex flex-col ${className}`}>
      <div className="p-3 border-b border-cyber-border flex items-center">
        <MessageSquare className="h-4 w-4 text-cyber-primary mr-2" />
        <h2 className="text-lg font-semibold">OnGuard Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.sender === 'user' 
                  ? 'bg-cyber-primary/20 text-cyber-foreground' 
                  : 'bg-cyber-muted text-cyber-foreground'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <div className="text-[10px] text-cyber-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-cyber-muted text-cyber-foreground">
              <div className="flex space-x-1 items-center">
                <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse delay-300"></div>
                <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse delay-500"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t border-cyber-border">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask OnGuard a question..."
            className="bg-cyber-muted/50 border-cyber-border text-cyber-foreground"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="cyber-button"
            disabled={isLoading || !newMessage.trim()}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatConsole;
