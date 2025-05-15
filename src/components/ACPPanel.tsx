
import React, { useState, useEffect } from 'react';
import { ACPService } from '../services';
import { ACPServiceRequest } from '../types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import RequestList from './acp/RequestList';
import RequestForm from './acp/RequestForm';

interface ACPPanelProps {
  className?: string;
  walletConnected: boolean;
}

const ACPPanel: React.FC<ACPPanelProps> = ({ className, walletConnected }) => {
  const [serviceRequests, setServiceRequests] = useState<ACPServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const requests = await ACPService.getRequests();
        setServiceRequests(requests);
      } catch (error) {
        console.error('Failed to load ACP requests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRequests();
  }, []);

  const handleCreateRequest = async (type: string, title: string, description: string) => {
    if (!walletConnected) {
      toast.error('Please connect your wallet to create a service request');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const newRequest = await ACPService.createRequest(
        type,
        title,
        description
      );
      
      setServiceRequests(prev => [newRequest, ...prev]);
      setShowNewRequestDialog(false);
      
      toast.success('Service request created successfully');
    } catch (error) {
      console.error('Failed to create service request:', error);
      toast.error('Failed to create service request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`cyber-panel flex flex-col ${className}`}>
      <div className="p-3 border-b border-cyber-border flex justify-between items-center">
        <h2 className="text-lg font-semibold">ACP Service Requests</h2>
        <Button 
          className="cyber-button text-sm"
          size="sm"
          onClick={() => setShowNewRequestDialog(true)}
          disabled={!walletConnected}
        >
          New Request
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <RequestList 
          serviceRequests={serviceRequests}
          loading={loading}
          onNewRequest={() => setShowNewRequestDialog(true)}
          walletConnected={walletConnected}
        />
      </div>
      
      <RequestForm
        open={showNewRequestDialog}
        onOpenChange={setShowNewRequestDialog}
        onSubmit={handleCreateRequest}
        walletConnected={walletConnected}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ACPPanel;
