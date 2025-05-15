
import React from 'react';
import { ACPServiceRequest } from '../../types';
import RequestItem from './RequestItem';
import { Button } from '@/components/ui/button';

interface RequestListProps {
  serviceRequests: ACPServiceRequest[];
  loading: boolean;
  onNewRequest: () => void;
  walletConnected: boolean;
}

const RequestList: React.FC<RequestListProps> = ({ 
  serviceRequests, 
  loading, 
  onNewRequest,
  walletConnected 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-cyber-primary">Loading requests...</div>
      </div>
    );
  }

  if (serviceRequests.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-cyber-muted-foreground mb-4">
          No service requests found
        </p>
        <Button 
          className="cyber-button"
          onClick={onNewRequest}
          disabled={!walletConnected}
        >
          Create a new request
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      {serviceRequests.map((request) => (
        <RequestItem key={request.id} request={request} />
      ))}
    </div>
  );
};

export default RequestList;
