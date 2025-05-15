
import React, { useState, useEffect } from 'react';
import { ACPService } from '../services';
import { ACPServiceRequest, ACPServiceStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Check, CircleX, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface ACPPanelProps {
  className?: string;
  walletConnected: boolean;
}

const ACPPanel: React.FC<ACPPanelProps> = ({ className, walletConnected }) => {
  const [serviceRequests, setServiceRequests] = useState<ACPServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [requestType, setRequestType] = useState<string>('escrow');
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
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

  const handleCreateRequest = async () => {
    if (!walletConnected) {
      toast.error('Please connect your wallet to create a service request');
      return;
    }
    
    if (!requestTitle.trim() || !requestDescription.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const newRequest = await ACPService.createRequest(
        requestType,
        requestTitle,
        requestDescription
      );
      
      setServiceRequests(prev => [newRequest, ...prev]);
      setShowNewRequestDialog(false);
      resetForm();
      
      toast.success('Service request created successfully');
    } catch (error) {
      console.error('Failed to create service request:', error);
      toast.error('Failed to create service request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRequestType('escrow');
    setRequestTitle('');
    setRequestDescription('');
  };

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
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-cyber-primary">Loading requests...</div>
          </div>
        ) : serviceRequests.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-cyber-muted-foreground mb-4">
              No service requests found
            </p>
            <Button 
              className="cyber-button"
              onClick={() => setShowNewRequestDialog(true)}
              disabled={!walletConnected}
            >
              Create a new request
            </Button>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {serviceRequests.map((request) => (
              <div 
                key={request.id}
                className="cyber-card hover:bg-cyber-muted/30 transition-colors cursor-pointer"
              >
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
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="cyber-panel max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyber-foreground">
              Create New Service Request
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-cyber-foreground">Request Type</label>
              <Select
                value={requestType}
                onValueChange={(value) => setRequestType(value)}
              >
                <SelectTrigger className="bg-cyber-muted/50 border-cyber-border text-cyber-foreground">
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent className="cyber-panel border-cyber-border">
                  <SelectItem value="escrow">Escrow</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="fulfillment">Fulfillment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-cyber-foreground">Title</label>
              <Input
                value={requestTitle}
                onChange={(e) => setRequestTitle(e.target.value)}
                placeholder="Enter a title for your request"
                className="bg-cyber-muted/50 border-cyber-border text-cyber-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-cyber-foreground">Description</label>
              <Textarea
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="Describe your request in detail"
                className="bg-cyber-muted/50 border-cyber-border text-cyber-foreground resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                className="border-cyber-border text-cyber-foreground hover:bg-cyber-muted"
                onClick={() => setShowNewRequestDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRequest}
                className="cyber-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ACPPanel;
