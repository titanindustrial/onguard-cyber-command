
import { ThreejsGraph } from '../types';
import { generateMock3DData } from '../utils/mockData';

// API endpoints would be configured here in a real application
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.onguard.ai';

export const ThreatMapService = {
  getGraphData: async (): Promise<ThreejsGraph> => {
    // In a real app, we would fetch from API
    return generateMock3DData();
  },
  
  subscribeToUpdates: (callback: (data: Partial<ThreejsGraph>) => void) => {
    // Simulate WebSocket updates
    console.log('Subscribing to threat map updates');
    
    // Simulate occasional updates
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const mock3DData = generateMock3DData();
        callback({
          nodes: [mock3DData.nodes[0]], // Send just one new node
          edges: [mock3DData.edges[0]], // And one new edge
        });
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }
};
