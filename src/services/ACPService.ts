
import { ACPServiceRequest } from '../types';
import { generateMockACPRequests } from '../utils/mockData';

// API endpoints would be configured here in a real application
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.onguard.ai';

export const ACPService = {
  getRequests: async (): Promise<ACPServiceRequest[]> => {
    // In a real app, we would fetch from API
    return generateMockACPRequests();
  },
  
  createRequest: async (type: string, title: string, description: string): Promise<ACPServiceRequest> => {
    // Simulate API call
    console.log(`Creating ACP request: ${title}`);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newRequest: ACPServiceRequest = {
      id: `req-${Date.now()}`,
      type: type as any,
      title,
      description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          name: 'Request Creation',
          status: 'completed',
          timestamp: new Date(),
        },
        {
          name: 'Validation',
          status: 'pending',
        },
        {
          name: 'Processing',
          status: 'pending',
        },
        {
          name: 'Completion',
          status: 'pending',
        }
      ]
    };
    
    return newRequest;
  }
};
