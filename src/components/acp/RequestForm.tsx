
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface RequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (type: string, title: string, description: string) => Promise<void>;
  walletConnected: boolean;
  isSubmitting: boolean;
}

const RequestForm: React.FC<RequestFormProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  walletConnected,
  isSubmitting 
}) => {
  const [requestType, setRequestType] = useState<string>('escrow');
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDescription, setRequestDescription] = useState('');

  const handleCreateRequest = async () => {
    if (!walletConnected) {
      toast.error('Please connect your wallet to create a service request');
      return;
    }
    
    if (!requestTitle.trim() || !requestDescription.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    await onSubmit(requestType, requestTitle, requestDescription);
    resetForm();
  };

  const resetForm = () => {
    setRequestType('escrow');
    setRequestTitle('');
    setRequestDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onClick={() => onOpenChange(false)}
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
  );
};

export default RequestForm;
