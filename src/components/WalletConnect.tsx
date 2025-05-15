
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { WalletService } from '../services';
import { WalletInfo } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface WalletConnectProps {
  className?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ className }) => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      
      const { address, chainId } = await WalletService.connectWallet();
      
      // If not on Base L2 (chainId 8453), prompt to switch
      if (chainId !== 8453) {
        toast.info('Switching to Base L2 network');
        await WalletService.switchNetwork(8453);
      }
      
      setWalletInfo({
        address,
        chainId: 8453,
        isConnected: true
      });
      
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = () => {
    setWalletInfo(null);
    toast.info('Wallet disconnected');
  };
  
  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={className}>
      {!walletInfo ? (
        <Button
          onClick={handleConnect}
          className="cyber-button flex items-center"
          disabled={isConnecting}
        >
          <Wallet className="h-4 w-4 mr-2" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="cyber-button flex items-center"
            >
              <Wallet className="h-4 w-4 mr-2" />
              <span className="font-mono">
                {shortenAddress(walletInfo.address)}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="cyber-panel border-cyber-border">
            <DropdownMenuLabel className="text-cyber-foreground">
              Connected Wallet
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-cyber-border" />
            <DropdownMenuItem className="text-cyber-foreground font-mono text-xs cursor-pointer">
              {walletInfo.address}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-cyber-foreground cursor-pointer">
              Network: Base L2
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-cyber-border" />
            <DropdownMenuItem 
              className="text-cyber-danger cursor-pointer focus:text-cyber-danger focus:bg-cyber-danger/10" 
              onClick={handleDisconnect}
            >
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default WalletConnect;
