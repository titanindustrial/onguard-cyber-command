
import React from "react";
import { useAppContext } from "../context/AppContext";
import Header from "../components/Header";
import ThreatMap3D from "../components/ThreatMap3D";
import AlertsFeed from "../components/AlertsFeed";
import ChatConsole from "../components/ChatConsole";
import ContractScanner from "../components/ContractScanner";
import ACPPanel from "../components/ACPPanel";
import { useIsMobile } from "../hooks/use-mobile";

const Dashboard: React.FC = () => {
  const { walletInfo, setWalletInfo } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-screen bg-cyber-background">
      <Header walletInfo={walletInfo} setWalletInfo={setWalletInfo} />
      
      <div className={`flex-1 ${isMobile ? 'flex flex-col' : 'flex'} overflow-hidden`}>
        {/* Main content area */}
        <div className={`${isMobile ? 'order-1' : 'flex-1'} flex flex-col p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden`}>
          {/* Top row with 3D Threat Map */}
          <div className={`${isMobile ? 'h-[40vh]' : 'flex-1 min-h-[50%]'}`}>
            <ThreatMap3D className="h-full" />
          </div>
          
          {/* Bottom row with Chat Console and Contract Scanner */}
          <div className={`${isMobile ? 'h-[30vh]' : 'flex gap-4 h-[40%]'}`}>
            {isMobile ? (
              <ChatConsole className="h-full" />
            ) : (
              <>
                <div className="flex-1">
                  <ChatConsole className="h-full" />
                </div>
                <div className="w-[350px]">
                  <ContractScanner className="h-full" />
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Right sidebar / Bottom area on mobile */}
        <div className={`${isMobile ? 'order-2 h-[30vh] p-2' : 'w-80 flex flex-col gap-4 p-4'} overflow-hidden`}>
          {isMobile ? (
            <div className="h-full flex flex-row gap-2">
              <div className="flex-1 overflow-hidden">
                <ContractScanner className="h-full" />
              </div>
              <div className="flex-1 overflow-hidden">
                <ACPPanel 
                  className="h-full" 
                  walletConnected={!!walletInfo?.isConnected}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-hidden">
                <AlertsFeed className="h-full" />
              </div>
              <div className="h-[40%] overflow-hidden">
                <ACPPanel 
                  className="h-full" 
                  walletConnected={!!walletInfo?.isConnected}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
