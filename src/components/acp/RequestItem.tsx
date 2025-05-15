
import React from 'react';
import { ACPServiceRequest, ACPServiceStatus } from '../../types';
import { ArrowRight, Check, CircleX } from 'lucide-react';

interface RequestItemProps {
  request: ACPServiceRequest;
}

const RequestItem: React.FC<RequestItemProps> = ({ request }) => {
  const getStatusColor = (status: ACPServiceStatus): string => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in_progress':
        return 'text-amber-500';
      case 'rejected':
        return 'text-red-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-cyber-muted-foreground';
    }
  };

  const getStepStatusIcon = (status: 'pending' | 'in_progress' | 'completed' | 'failed') => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <CircleX className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <div className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />;
      default:
        return <div className="h-3 w-3 rounded-full border border-cyber-muted-foreground" />;
    }
  };

  return (
    <div className="cyber-card hover:bg-cyber-muted/30 transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-cyber-foreground">{request.title}</h3>
          <p className="text-xs text-cyber-muted-foreground capitalize">
            {request.type} Request
          </p>
        </div>
        <span className={`text-xs font-semibold ${getStatusColor(request.status)}`}>
          {request.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      
      <p className="text-sm text-cyber-foreground/70 line-clamp-2 mb-3">
        {request.description}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-cyber-muted-foreground">
          {new Date(request.createdAt).toLocaleDateString()}
        </span>
        
        <div className="flex items-center space-x-1">
          {request.steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center" title={step.name}>
                {getStepStatusIcon(step.status)}
              </div>
              {index < request.steps.length - 1 && (
                <ArrowRight className="h-3 w-3 text-cyber-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestItem;
