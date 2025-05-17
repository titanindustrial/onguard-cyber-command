
import React, { useState } from 'react';
import { ACPServiceRequest } from '../../types';
import RequestItem from './RequestItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const isMobile = useIsMobile();

  // Filter and sort requests
  const filteredAndSortedRequests = serviceRequests
    .filter(request => {
      // Apply search filter
      const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            request.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply type filter
      const matchesType = typeFilter === 'all' || request.type === typeFilter;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-cyber-primary">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-4">
      {/* Filtering and sorting controls */}
      <div className="p-1 sm:p-2 space-y-2">
        {/* Search and filter row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-cyber-muted/50 border-cyber-border text-cyber-foreground text-xs sm:text-sm h-8 sm:h-10"
          />
          <div className="flex gap-1 sm:gap-2">
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className={`${isMobile ? 'w-20 text-xs h-8 px-2' : 'w-[130px]'} bg-cyber-muted/50 border-cyber-border text-cyber-foreground`}>
                {!isMobile && <Filter className="mr-2 h-4 w-4" />}
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="cyber-panel border-cyber-border">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="escrow">Escrow</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="fulfillment">Fulfillment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`bg-cyber-muted/50 border-cyber-border text-cyber-foreground ${isMobile ? 'h-8 px-2 text-xs' : ''}`}
                >
                  {sortOrder === 'newest' ? (
                    <SortDesc className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  ) : (
                    <SortAsc className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  )}
                  {!isMobile && "Sort"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="cyber-panel border-cyber-border">
                <DropdownMenuItem 
                  className={sortOrder === 'newest' ? "bg-muted" : ""}
                  onClick={() => setSortOrder('newest')}
                >
                  <SortDesc className="mr-2 h-4 w-4" />
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={sortOrder === 'oldest' ? "bg-muted" : ""}
                  onClick={() => setSortOrder('oldest')}
                >
                  <SortAsc className="mr-2 h-4 w-4" />
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Requests list */}
      {filteredAndSortedRequests.length === 0 ? (
        <div className="p-2 sm:p-6 text-center text-xs sm:text-sm">
          <p className="text-cyber-muted-foreground mb-2 sm:mb-4">
            {serviceRequests.length === 0 
              ? "No service requests found" 
              : "No matching requests found"}
          </p>
          <Button 
            className="cyber-button text-xs sm:text-sm py-1 px-2 sm:px-4 sm:py-2"
            onClick={onNewRequest}
            disabled={!walletConnected}
          >
            Create a new request
          </Button>
        </div>
      ) : (
        <div className="p-1 sm:p-2 space-y-1 sm:space-y-2 overflow-y-auto max-h-[calc(100%-80px)]">
          {filteredAndSortedRequests.map((request) => (
            <RequestItem key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestList;
