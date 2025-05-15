
import React, { useEffect, useState } from 'react';
import { AlertsService } from '../services';
import { Alert, AlertSeverity } from '../types';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

interface AlertsFeedProps {
  className?: string;
}

const AlertsFeed: React.FC<AlertsFeedProps> = ({ className }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await AlertsService.getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Subscribe to real-time alerts
    const unsubscribe = AlertsService.subscribeToAlerts((newAlert) => {
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await AlertsService.markAsRead(alertId);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ));
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  const getSeverityColor = (severity: AlertSeverity): string => {
    switch (severity) {
      case 'critical':
        return 'bg-cyber-danger text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      case 'info':
      default:
        return 'bg-cyber-secondary text-white';
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className={`cyber-panel flex flex-col h-full ${className}`}>
      <div className="p-3 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-cyber-primary" />
          <h2 className="text-lg font-semibold text-cyber-foreground">Security Alerts</h2>
        </div>
        <Badge variant="outline" className="bg-cyber-muted text-cyan-400 text-xs">
          LIVE
        </Badge>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-cyber-primary">Loading alerts...</div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-4 text-center text-cyber-muted-foreground">
            No alerts to display
          </div>
        ) : (
          <ul className="divide-y divide-cyber-border">
            {alerts.map((alert) => (
              <li 
                key={alert.id}
                className={`p-3 hover:bg-cyber-muted/30 transition-colors cursor-pointer ${
                  !alert.isRead ? 'bg-cyber-muted/10' : ''
                }`}
                onClick={() => handleMarkAsRead(alert.id)}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getSeverityColor(alert.severity)} uppercase text-[10px]`}>
                      {alert.severity}
                    </Badge>
                    <span className={`font-semibold ${!alert.isRead ? 'text-cyber-foreground' : 'text-cyber-foreground/80'}`}>
                      {alert.title}
                    </span>
                  </div>
                  <span className="text-xs text-cyber-muted-foreground">
                    {formatTimestamp(new Date(alert.timestamp))}
                  </span>
                </div>
                <p className={`text-sm ${!alert.isRead ? 'text-cyber-foreground/90' : 'text-cyber-muted-foreground'}`}>
                  {alert.message}
                </p>
                {alert.related?.address && (
                  <div className="mt-1">
                    <code className="text-xs bg-cyber-muted/20 px-1 py-0.5 rounded text-cyber-secondary">
                      {alert.related.address.substring(0, 10)}...
                    </code>
                  </div>
                )}
                <div className="mt-2 text-xs text-cyber-muted-foreground flex items-center">
                  <span className="bg-cyber-muted/30 px-1.5 py-0.5 rounded text-[10px]">
                    {alert.source}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlertsFeed;
