
import React, { useState } from 'react';
import { ScannerService } from '../services/api';
import { ContractScanResult, AlertSeverity } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContractScannerProps {
  className?: string;
}

const ContractScanner: React.FC<ContractScannerProps> = ({ className }) => {
  const [address, setAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ContractScanResult | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleScan = async () => {
    if (!address.trim()) return;
    
    try {
      setIsScanning(true);
      const result = await ScannerService.scanContract(address.trim());
      setScanResult(result);
    } catch (error) {
      console.error('Failed to scan contract:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getRiskColor = (riskScore: number): string => {
    if (riskScore > 75) return 'text-red-500';
    if (riskScore > 50) return 'text-orange-500';
    if (riskScore > 25) return 'text-amber-500';
    return 'text-green-500';
  };

  const getSeverityColor = (severity: AlertSeverity): string => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className={`cyber-panel p-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Search className="h-5 w-5 text-cyber-primary mr-2" />
        Contract Scanner
      </h2>
      
      <div className="flex space-x-2 mb-4">
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter contract address or source code"
          className="bg-cyber-muted/50 border-cyber-border text-cyber-foreground"
          disabled={isScanning}
        />
        <Button
          onClick={handleScan}
          className="cyber-button"
          disabled={isScanning || !address.trim()}
        >
          Scan
        </Button>
      </div>
      
      {isScanning && (
        <div className="p-6 text-center">
          <Progress value={45} className="mb-2" />
          <p className="text-sm text-cyber-muted-foreground">Analyzing contract security...</p>
        </div>
      )}
      
      {scanResult && !isScanning && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <div className="cyber-card p-4 cursor-pointer hover:bg-cyber-muted/70 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-cyber-foreground">
                    {scanResult.name || 'Unknown Contract'}
                  </h3>
                  <p className="text-xs text-cyber-muted-foreground truncate">
                    {scanResult.address}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getRiskColor(scanResult.riskScore)}`}>
                    {scanResult.riskScore}/100
                  </div>
                  <div className="text-xs text-cyber-muted-foreground">
                    Risk Score
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="text-xs text-cyber-muted-foreground mb-1">
                  Vulnerabilities detected: {scanResult.vulnerabilities.length}
                </div>
                <Progress 
                  value={scanResult.riskScore} 
                  className="h-1.5" 
                  indicatorClassName={getRiskColor(scanResult.riskScore).replace('text-', 'bg-')}
                />
              </div>
              
              <div className="mt-3 flex justify-center">
                <span className="text-sm text-cyber-secondary">Click for detailed report</span>
              </div>
            </div>
          </DialogTrigger>
          
          <DialogContent className="cyber-panel max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center text-cyber-foreground">
                <Search className="h-5 w-5 text-cyber-primary mr-2" />
                Contract Security Report
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="cyber-card">
                  <h4 className="text-sm text-cyber-muted-foreground mb-1">Contract</h4>
                  <p className="font-mono text-xs break-all">{scanResult.address}</p>
                </div>
                <div className="cyber-card">
                  <h4 className="text-sm text-cyber-muted-foreground mb-1">Risk Score</h4>
                  <p className={`text-xl font-bold ${getRiskColor(scanResult.riskScore)}`}>
                    {scanResult.riskScore}/100
                  </p>
                </div>
              </div>
              
              <Tabs defaultValue="vulnerabilities">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>
                
                <TabsContent value="vulnerabilities" className="mt-0">
                  <div className="space-y-3">
                    {scanResult.vulnerabilities.map((vuln) => (
                      <div key={vuln.id} className="cyber-card">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium flex items-center">
                            <span 
                              className={`inline-block w-2 h-2 rounded-full mr-2 ${getSeverityColor(vuln.severity)}`}
                            />
                            {vuln.name}
                          </h4>
                          <span 
                            className={`text-xs uppercase px-1.5 py-0.5 rounded ${
                              getSeverityColor(vuln.severity).replace('bg-', 'bg-opacity-20 text-')
                            }`}
                          >
                            {vuln.severity}
                          </span>
                        </div>
                        
                        <p className="text-sm text-cyber-foreground/80 mb-2">
                          {vuln.description}
                        </p>
                        
                        {vuln.location && (
                          <div className="text-xs text-cyber-muted-foreground mb-2">
                            Location: {vuln.location.file ? `${vuln.location.file}:` : ''}
                            {vuln.location.line}
                          </div>
                        )}
                        
                        <div className="text-xs text-cyber-secondary">
                          <span className="font-semibold">Recommendation:</span> {vuln.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="analysis" className="mt-0">
                  <div className="cyber-card mb-4">
                    <h4 className="font-medium mb-2">Summary</h4>
                    <p className="text-sm text-cyber-foreground/80">
                      {scanResult.analysis.summary}
                    </p>
                  </div>
                  
                  <div className="cyber-card mb-4">
                    <h4 className="font-medium mb-2">Details</h4>
                    <p className="text-sm text-cyber-foreground/80">
                      {scanResult.analysis.details}
                    </p>
                  </div>
                  
                  <div className="cyber-card">
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside text-sm text-cyber-foreground/80 space-y-1">
                      {scanResult.analysis.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="metadata" className="mt-0">
                  <div className="cyber-card">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <h4 className="text-xs text-cyber-muted-foreground">Scan Date</h4>
                        <p className="text-sm">
                          {new Date(scanResult.metadata.scanDate).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs text-cyber-muted-foreground">Scan Duration</h4>
                        <p className="text-sm">{scanResult.metadata.scanDuration}s</p>
                      </div>
                      {scanResult.metadata.compiler && (
                        <div>
                          <h4 className="text-xs text-cyber-muted-foreground">Compiler</h4>
                          <p className="text-sm">{scanResult.metadata.compiler}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs text-cyber-muted-foreground">Blockchain</h4>
                        <p className="text-sm">{scanResult.metadata.blockchain}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContractScanner;
