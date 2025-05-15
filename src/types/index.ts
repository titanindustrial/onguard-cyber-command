
// Alert Types
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Alert {
  id: string;
  timestamp: Date;
  title: string;
  message: string;
  severity: AlertSeverity;
  source: string;
  related?: {
    address?: string;
    contractId?: string;
    transactionId?: string;
  };
  isRead: boolean;
}

// Contract Scanner Types
export interface ContractScanResult {
  address: string;
  name?: string;
  riskScore: number; // 0-100
  vulnerabilities: Vulnerability[];
  analysis: {
    summary: string;
    details: string;
    recommendations: string[];
  };
  metadata: {
    scanDate: Date;
    scanDuration: number; // in seconds
    compiler?: string;
    blockchain: string;
  };
}

export interface Vulnerability {
  id: string;
  name: string;
  severity: AlertSeverity;
  description: string;
  location?: {
    line: number;
    file?: string;
  };
  recommendation: string;
}

// ACP Service Types
export type ACPServiceStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'failed';

export interface ACPServiceRequest {
  id: string;
  type: 'escrow' | 'proposal' | 'fulfillment' | 'other';
  title: string;
  description: string;
  status: ACPServiceStatus;
  createdAt: Date;
  updatedAt: Date;
  transactionHash?: string;
  steps: {
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    timestamp?: Date;
  }[];
}

// Three.js Map Types
export interface ThreejsNode {
  id: string;
  type: 'contract' | 'wallet' | 'exchange' | 'unknown';
  address: string;
  label?: string;
  riskScore?: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ThreejsEdge {
  id: string;
  source: string; // node id
  target: string; // node id
  type: 'transaction' | 'deployment' | 'interaction' | 'attack';
  value: number; // transaction value or importance
}

export interface ThreejsGraph {
  nodes: ThreejsNode[];
  edges: ThreejsEdge[];
}

// Chat Types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'system';
  message: string;
  timestamp: Date;
}

// Settings
export interface UserSettings {
  language: string;
  alertThreshold: AlertSeverity;
  theme: 'dark' | 'light';
  autoScan: boolean;
}

// Wallet
export interface WalletInfo {
  address: string;
  chainId: number;
  isConnected: boolean;
}
