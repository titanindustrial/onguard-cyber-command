
import React from 'react';
import WalletConnect from './WalletConnect';
import SettingsPanel from './SettingsPanel';
import { WalletInfo } from '../types';

interface HeaderProps {
  walletInfo: WalletInfo | null;
  setWalletInfo: (walletInfo: WalletInfo | null) => void;
}

const Header: React.FC<HeaderProps> = ({ walletInfo, setWalletInfo }) => {
  return (
    <header className="cyber-panel h-16 flex items-center justify-between px-4 border-b border-cyber-border">
      <div className="flex items-center">
        <div className="relative mr-2">
          <div className="w-8 h-8 rounded-full bg-cyber-primary animate-glow flex items-center justify-center">
            <span className="font-bold text-white text-sm">OG</span>
          </div>
        </div>
        <h1 className="text-xl font-bold text-cyber-foreground">
          OnGuard <span className="text-cyber-primary">Command Center</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <WalletConnect className="h-fit" />
        <SettingsPanel />
      </div>
    </header>
  );
};

export default Header;
