
import { Alert, ChatMessage, ContractScanResult, ACPServiceRequest, ThreejsGraph } from '../types';

export const generateMockAlerts = (): Alert[] => {
  const alerts: Alert[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60000),
      title: 'Suspicious Contract Interaction',
      message: 'Potential reentrancy attack detected on contract 0x123...456',
      severity: 'critical',
      source: 'ContractMonitor',
      related: {
        contractId: '0x123456789abcdef',
        address: '0x123456789abcdef',
      },
      isRead: false,
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 10 * 60000),
      title: 'Large Token Transfer',
      message: '1000+ ETH transferred from known exchange',
      severity: 'medium',
      source: 'TransactionMonitor',
      related: {
        transactionId: '0xabcdef1234567890',
      },
      isRead: true,
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 25 * 60000),
      title: 'New Contract Deployment',
      message: 'Unverified contract deployed by tracked address',
      severity: 'high',
      source: 'DeploymentMonitor',
      related: {
        address: '0xfedcba9876543210',
        contractId: '0xfedcba9876543210',
      },
      isRead: false,
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 45 * 60000),
      title: 'Flash Loan Detected',
      message: 'Flash loan transaction with high value detected',
      severity: 'info',
      source: 'LiquidityMonitor',
      isRead: true,
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 60 * 60000),
      title: 'Price Manipulation Attempt',
      message: 'Potential price manipulation detected on DEX pair',
      severity: 'high',
      source: 'MarketMonitor',
      isRead: false,
    },
  ];
  
  return alerts;
};

export const generateMockChatHistory = (): ChatMessage[] => {
  return [
    {
      id: '1',
      sender: 'system',
      message: 'Welcome to OnGuard Security Dashboard. How can I help you today?',
      timestamp: new Date(Date.now() - 60 * 60000),
    },
    {
      id: '2',
      sender: 'user',
      message: 'Show me recent alerts',
      timestamp: new Date(Date.now() - 59 * 60000),
    },
    {
      id: '3',
      sender: 'system',
      message: 'Displaying 5 recent alerts. 2 critical alerts detected in the last hour.',
      timestamp: new Date(Date.now() - 58 * 60000),
    },
  ];
};

export const generateMockScanResult = (): ContractScanResult => {
  return {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'TokenSwap',
    riskScore: 65,
    vulnerabilities: [
      {
        id: 'V1',
        name: 'Reentrancy',
        severity: 'high',
        description: 'Potential reentrancy vulnerability in withdraw() function',
        location: {
          line: 42,
          file: 'TokenSwap.sol',
        },
        recommendation: 'Implement checks-effects-interactions pattern',
      },
      {
        id: 'V2',
        name: 'Unchecked Return Values',
        severity: 'medium',
        description: 'Transfer return value not checked',
        location: {
          line: 78,
          file: 'TokenSwap.sol',
        },
        recommendation: 'Check return values of external calls',
      },
    ],
    analysis: {
      summary: 'Moderate risk contract with potential security issues',
      details: 'Contract implements token swap functionality but has vulnerabilities including potential reentrancy and unchecked return values.',
      recommendations: [
        'Fix reentrancy in withdraw() function',
        'Add return value checks for all transfers',
        'Consider implementing rate limiting',
      ],
    },
    metadata: {
      scanDate: new Date(),
      scanDuration: 12.4,
      compiler: 'solc 0.8.17',
      blockchain: 'Base L2',
    },
  };
};

export const generateMockACPRequests = (): ACPServiceRequest[] => {
  return [
    {
      id: '1',
      type: 'escrow',
      title: 'Secure Escrow for NFT Purchase',
      description: 'Escrow service for NFT transaction between 0x1234... and 0x5678...',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      transactionHash: '0xabcd1234',
      steps: [
        {
          name: 'Contract Creation',
          status: 'completed',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          name: 'Seller Deposit',
          status: 'completed',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          name: 'Buyer Payment',
          status: 'in_progress',
        },
        {
          name: 'Asset Release',
          status: 'pending',
        },
      ],
    },
    {
      id: '2',
      type: 'proposal',
      title: 'Protocol Upgrade Proposal',
      description: 'Proposal for upgrading contract security features',
      status: 'pending',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      steps: [
        {
          name: 'Proposal Submission',
          status: 'completed',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          name: 'Community Review',
          status: 'in_progress',
        },
        {
          name: 'Voting Period',
          status: 'pending',
        },
        {
          name: 'Implementation',
          status: 'pending',
        },
      ],
    },
  ];
};

export const generateMock3DData = (): ThreejsGraph => {
  // Create a set of nodes and edges for visualization
  const nodes = Array.from({ length: 30 }).map((_, i) => ({
    id: `node${i}`,
    type: ['contract', 'wallet', 'exchange', 'unknown'][Math.floor(Math.random() * 4)] as 'contract' | 'wallet' | 'exchange' | 'unknown',
    address: `0x${Math.random().toString(16).substring(2, 14)}`,
    label: i < 5 ? `Node ${i}` : undefined,
    riskScore: Math.random() * 100,
    position: {
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 20,
    },
  }));

  // Create some connections between nodes
  const edges = [];
  for (let i = 0; i < 40; i++) {
    const source = Math.floor(Math.random() * nodes.length);
    let target = Math.floor(Math.random() * nodes.length);
    // Ensure no self connections
    while (source === target) {
      target = Math.floor(Math.random() * nodes.length);
    }
    
    edges.push({
      id: `edge${i}`,
      source: nodes[source].id,
      target: nodes[target].id,
      type: ['transaction', 'deployment', 'interaction', 'attack'][Math.floor(Math.random() * 4)] as 'transaction' | 'deployment' | 'interaction' | 'attack',
      value: Math.random() * 10,
    });
  }

  return { nodes, edges };
};
