
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { WalletInfo } from '../types';

interface AppContextType {
  walletInfo: WalletInfo | null;
  setWalletInfo: React.Dispatch<React.SetStateAction<WalletInfo | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);

  return (
    <AppContext.Provider value={{ walletInfo, setWalletInfo }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
