
import React from 'react';
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
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define our validation schema
const formSchema = z.object({
  type: z.string().min(1, "Request type is required"),
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters")
});

type FormValues = z.infer<typeof formSchema>;

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
  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'escrow',
      title: '',
      description: ''
    }
  });
  
  const handleCreateRequest = async (values: FormValues) => {
    if (!walletConnected) {
      toast.error('Please connect your wallet to create a service request');
      return;
    }
    
    try {
      await onSubmit(values.type, values.title, values.description);
      form.reset();
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        form.reset();
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="cyber-panel max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cyber-foreground">
            Create New Service Request
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateRequest)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm text-cyber-foreground">Request Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-cyber-muted/50 border-cyber-border text-cyber-foreground">
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="cyber-panel border-cyber-border">
                      <SelectItem value="escrow">Escrow</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="fulfillment">Fulfillment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm text-cyber-foreground">Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter a title for your request"
                      className="bg-cyber-muted/50 border-cyber-border text-cyber-foreground"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm text-cyber-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your request in detail"
                      className="bg-cyber-muted/50 border-cyber-border text-cyber-foreground resize-none"
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="border-cyber-border text-cyber-foreground hover:bg-cyber-muted"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cyber-button"
                disabled={isSubmitting || !walletConnected}
              >
                {isSubmitting ? 'Creating...' : 'Create Request'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestForm;
