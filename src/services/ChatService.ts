
import { ChatMessage } from '../types';
import { generateMockChatHistory } from '../utils/mockData';

// API endpoints would be configured here in a real application
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.onguard.ai';

export const ChatService = {
  getHistory: async (): Promise<ChatMessage[]> => {
    // In a real app, we would fetch chat history
    return generateMockChatHistory();
  },
  
  sendMessage: async (message: string): Promise<ChatMessage> => {
    // Simulate API call to OnGuard agent
    console.log(`Sending message to OnGuard: ${message}`);
    
    // Simple response logic - in a real app this would connect to a backend
    let response = "I'm analyzing your request...";
    
    if (message.toLowerCase().includes('alert')) {
      response = "I've found 5 recent alerts. 2 of them are critical severity.";
    } else if (message.toLowerCase().includes('scan') || message.toLowerCase().includes('contract')) {
      response = "Please provide a contract address for scanning. You can use the scanner module on the right.";
    } else if (message.toLowerCase().includes('help')) {
      response = "I can help you with security alerts, contract scanning, threat analysis, and securing your transactions.";
    } else if (message.toLowerCase().includes('wallet')) {
      response = "You can connect your wallet using the button in the top-right corner.";
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `msg-${Date.now()}`,
      sender: 'system',
      message: response,
      timestamp: new Date()
    };
  }
};
