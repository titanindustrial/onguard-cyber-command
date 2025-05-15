
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThreejsGraph, ThreejsNode, ThreejsEdge } from '../types';
import { ThreatMapService } from '../services/api';

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

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      const data = await ThreatMapService.getGraphData();
      setGraphData(data);
    };
    fetchData();
  }, []);

  // Initialize and setup Three.js scene
  useEffect(() => {
    if (!containerRef.current || !graphData) return;

    // Initialize scene if not already done
    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#0a0e17');
      
      // Add fog for depth effect
      scene.fog = new THREE.Fog('#0a0e17', 20, 100);
      
      // Setup camera
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 30;
      
      // Setup renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      containerRef.current.appendChild(renderer.domElement);
      
      // Setup controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      
      // Add grid for reference
      const gridHelper = new THREE.GridHelper(100, 20, 0x444444, 0x222222);
      gridHelper.position.y = -10;
      scene.add(gridHelper);
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Add hemisphere light for better ambient lighting
      const hemisphereLight = new THREE.HemisphereLight(0xB3E5FC, 0x444444, 0.8);
      scene.add(hemisphereLight);
      
      // Store references
      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      controlsRef.current = controls;
      
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Update controls
        controls.update();
        
        // Animate nodes with a gentle hover
        nodesRef.current.forEach((mesh) => {
          mesh.position.y += Math.sin(Date.now() * 0.001 + mesh.position.x) * 0.005;
        });
        
        // Render scene
        renderer.render(scene, camera);
      };
      
      animate();
      
      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        containerRef.current?.removeChild(renderer.domElement);
      };
    }
  }, [graphData]);

  // Add nodes and edges when data changes
  useEffect(() => {
    if (!graphData || !sceneRef.current) return;

    // Add nodes
    graphData.nodes.forEach((node) => {
      if (!nodesRef.current.has(node.id)) {
        const mesh = createNodeMesh(node);
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
          const line = createEdgeLine(edge, sourceNode, targetNode);
          sceneRef.current?.add(line);
          edgesRef.current.set(edge.id, line);
        }
      }
    });
  }, [graphData]);

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

  // Helper function to create a node mesh
  const createNodeMesh = (node: ThreejsNode): THREE.Mesh => {
    // Different geometries based on node type
    let geometry;
    switch (node.type) {
      case 'contract':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'wallet':
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        break;
      case 'exchange':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      default:
        geometry = new THREE.TetrahedronGeometry(0.5);
    }
    
    // Color based on risk score
    const riskScore = node.riskScore || 0;
    let color;
    
    if (riskScore > 75) {
      color = new THREE.Color('#ff3d00'); // Red for high risk
    } else if (riskScore > 50) {
      color = new THREE.Color('#ff9100'); // Orange for medium risk
    } else if (riskScore > 25) {
      color = new THREE.Color('#ffea00'); // Yellow for low risk
    } else {
      color = new THREE.Color('#76ff03'); // Green for safe
    }
    
    // Add some glow effect
    const material = new THREE.MeshPhongMaterial({
      color,
      emissive: color.clone().multiplyScalar(0.3),
      shininess: 100,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      node.position.x,
      node.position.y,
      node.position.z
    );
    
    return mesh;
  };

  // Helper function to create edge line
  const createEdgeLine = (edge: ThreejsEdge, source: ThreejsNode, target: ThreejsNode): THREE.Line => {
    // Create line geometry between nodes
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(source.position.x, source.position.y, source.position.z),
      new THREE.Vector3(target.position.x, target.position.y, target.position.z),
    ]);
    
    // Different colors based on edge type
    let color;
    switch (edge.type) {
      case 'transaction':
        color = 0x4fc3f7; // Light blue
        break;
      case 'deployment':
        color = 0x7986cb; // Purple blue
        break;
      case 'attack':
        color = 0xff5252; // Red
        break;
      default:
        color = 0xb0bec5; // Grey blue
    }
    
    const material = new THREE.LineBasicMaterial({ 
      color,
      transparent: true,
      opacity: 0.6,
      linewidth: 1, // Note: linewidth > 1 only works in some browsers
    });
    
    return new THREE.Line(geometry, material);
  };

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full relative overflow-hidden cyber-panel ${className}`}
      style={{ minHeight: '400px' }}
    >
      {!graphData && (
        <div className="absolute inset-0 flex items-center justify-center text-cyber-secondary">
          Loading threat map...
        </div>
      )}
    </div>
  );
};

export default ThreatMap3D;
