
import { Alert } from '../types';
import { generateMockAlerts } from '../utils/mockData';

// API endpoints would be configured here in a real application
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.onguard.ai';

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
