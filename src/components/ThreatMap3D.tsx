
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThreejsGraph } from '../types';
import { ThreatMapService } from '../services';
import { useIsMobile } from '../hooks/use-mobile';
import { ThreejsScene, createNodeMesh, createEdgeLine } from './threejs';

interface ThreatMap3DProps {
  className?: string;
}

const ThreatMap3D: React.FC<ThreatMap3DProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [graphData, setGraphData] = useState<ThreejsGraph | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const nodesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const edgesRef = useRef<Map<string, THREE.Line>>(new Map());
  const isMobile = useIsMobile();

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      const data = await ThreatMapService.getGraphData();
      setGraphData(data);
    };
    fetchData();
  }, []);

  // Add nodes and edges when data changes
  useEffect(() => {
    if (!graphData || !sceneRef.current) return;

    // Add nodes
    graphData.nodes.forEach((node) => {
      if (!nodesRef.current.has(node.id)) {
        const mesh = createNodeMesh(node, isMobile);
        sceneRef.current?.add(mesh);
        nodesRef.current.set(node.id, mesh);
      }
    });

    // Add edges
    graphData.edges.forEach((edge) => {
      if (!edgesRef.current.has(edge.id)) {
        const sourceNode = graphData.nodes.find((n) => n.id === edge.source);
        const targetNode = graphData.nodes.find((n) => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          const line = createEdgeLine(edge, sourceNode, targetNode, isMobile);
          sceneRef.current?.add(line);
          edgesRef.current.set(edge.id, line);
        }
      }
    });
  }, [graphData, isMobile]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = ThreatMapService.subscribeToUpdates((update) => {
      // Add new nodes and edges to the existing graph
      setGraphData((prev) => {
        if (!prev) return prev;
        
        return {
          nodes: [...prev.nodes, ...(update.nodes || [])],
          edges: [...prev.edges, ...(update.edges || [])],
        };
      });
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full relative overflow-hidden cyber-panel ${className}`}
      style={{ minHeight: isMobile ? '300px' : '400px' }}
    >
      {/* Initialize ThreejsScene when container ref is available */}
      {containerRef.current && (
        <ThreejsScene
          containerRef={containerRef}
          nodesRef={nodesRef}
          sceneRef={sceneRef}
          cameraRef={cameraRef}
          rendererRef={rendererRef}
          controlsRef={controlsRef}
          isMobile={isMobile}
        />
      )}
      
      {!graphData && (
        <div className="absolute inset-0 flex items-center justify-center text-cyber-secondary">
          Loading threat map...
        </div>
      )}
    </div>
  );
};

export default ThreatMap3D;
