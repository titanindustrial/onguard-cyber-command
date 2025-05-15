
import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import Header from "../components/Header";
import ThreatMap3D from "../components/ThreatMap3D";
import AlertsFeed from "../components/AlertsFeed";
import ChatConsole from "../components/ChatConsole";
import ContractScanner from "../components/ContractScanner";
import ACPPanel from "../components/ACPPanel";

const Dashboard: React.FC = () => {
  const { walletInfo, setWalletInfo } = useAppContext();

  return (
    <div className="flex flex-col h-screen bg-cyber-background">
      <Header walletInfo={walletInfo} setWalletInfo={setWalletInfo} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main content area */}
        <div className="flex flex-col flex-1 p-4 gap-4 overflow-hidden">
          {/* Top row with 3D Threat Map */}
          <div className="flex-1 min-h-[50%]">
            <ThreatMap3D className="h-full" />
          </div>
          
          {/* Bottom row with Chat Console and Contract Scanner */}
          <div className="flex gap-4 h-[40%]">
            <div className="flex-1">
              <ChatConsole className="h-full" />
            </div>
            <div className="w-[350px]">
              <ContractScanner className="h-full" />
            </div>
          </div>
        </div>
        
        {/* Right sidebar */}
        <div className="w-80 flex flex-col gap-4 p-4 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <AlertsFeed className="h-full" />
          </div>
          <div className="h-[40%] overflow-hidden">
            <ACPPanel 
              className="h-full" 
              walletConnected={!!walletInfo?.isConnected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
