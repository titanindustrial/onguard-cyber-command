
import { Alert, ChatMessage, ContractScanResult, ACPServiceRequest, ThreejsGraph } from '../types';
import { 
  generateMockAlerts, 
  generateMockChatHistory,
  generateMockScanResult,
  generateMockACPRequests,
  generateMock3DData
} from '../utils/mockData';

// API endpoints would be configured here in a real application
const API_BASE_URL = '{{ApiBaseUrl}}' || 'https://api.onguard.ai';
const WEBSOCKET_ENDPOINT = '{{WebSocketEndpoint}}' || 'wss://ws.onguard.ai';
const CONTRACT_SCANNER_ENDPOINT = '{{ContractScannerEndpoint}}' || `${API_BASE_URL}/scanner`;

// AlertsService
export const AlertsService = {
  getAlerts: async (): Promise<Alert[]> => {
    // In a real app, we would fetch from an API
    // return await fetch(`${API_BASE_URL}/alerts`).then(res => res.json());
    return generateMockAlerts();
  },
  
  markAsRead: async (alertId: string): Promise<boolean> => {
    // Simulate API call
    console.log(`Marking alert ${alertId} as read`);
    return true;
  },
  
  subscribeToAlerts: (callback: (alert: Alert) => void) => {
    // In a real app, we would use WebSockets
    console.log('Subscribing to real-time alerts');
    
    // Simulate incoming alerts for demo
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const alerts = generateMockAlerts();
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        randomAlert.id = `dynamic-${Date.now()}`;
        randomAlert.timestamp = new Date();
        randomAlert.isRead = false;
        callback(randomAlert);
      }
    }, 10000);
    
    // Return unsubscribe function
    return () => clearInterval(interval);
  }
};

// ChatService
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

// ScannerService
export const ScannerService = {
  scanContract: async (address: string): Promise<ContractScanResult> => {
    // Simulate API call
    console.log(`Scanning contract: ${address}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const result = generateMockScanResult();
    result.address = address;
    return result;
  }
};

// ACPService
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

// ThreatMapService
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

// WalletService
export const WalletService = {
  connectWallet: async (): Promise<{ address: string; chainId: number }> => {
    // Simulate wallet connection
    console.log('Connecting wallet');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      address: '0x' + Math.random().toString(16).substring(2, 42),
      chainId: 8453, // Base Goerli L2
    };
  },
  
  switchNetwork: async (chainId: number): Promise<boolean> => {
    // Simulate network switch
    console.log(`Switching to network: ${chainId}`);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return true;
  },
  
  signMessage: async (message: string): Promise<string> => {
    // Simulate signature
    console.log(`Signing message: ${message}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return `0x${Math.random().toString(16).substring(2, 130)}`;
  }
};
