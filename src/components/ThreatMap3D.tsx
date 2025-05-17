
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThreejsGraph, ThreejsNode, ThreejsEdge } from '../types';
import { ThreatMapService } from '../services';
import { useIsMobile } from '../hooks/use-mobile';

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

  // Initialize and setup Three.js scene
  useEffect(() => {
    if (!containerRef.current || !graphData) return;

    // Initialize scene if not already done
    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#0a0e17');
      
      // Add fog for depth effect - reduce fog on mobile for better visibility
      scene.fog = new THREE.Fog('#0a0e17', isMobile ? 25 : 20, isMobile ? 80 : 100);
      
      // Setup camera
      const camera = new THREE.PerspectiveCamera(
        isMobile ? 85 : 75, // Wider FOV on mobile
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      // Adjust initial camera position for mobile
      camera.position.z = isMobile ? 40 : 30;
      
      // Setup renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile, // Disable antialiasing on mobile for performance
        powerPreference: 'high-performance'
      });
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio); // Limit pixel ratio for performance
      containerRef.current.appendChild(renderer.domElement);
      
      // Setup controls - adjust for touch on mobile
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = isMobile ? 0.2 : 0.25;
      controls.rotateSpeed = isMobile ? 0.6 : 1; // Slower rotation on mobile for better control
      controls.touchRotateSpeed = 0.4; // Specifically for touch
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
      
      // Add grid for reference - smaller grid on mobile
      const gridHelper = new THREE.GridHelper(isMobile ? 70 : 100, 20, 0x444444, 0x222222);
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
        
        // Animate nodes with a gentle hover - less motion on mobile
        nodesRef.current.forEach((mesh) => {
          mesh.position.y += Math.sin(Date.now() * 0.001 + mesh.position.x) * (isMobile ? 0.003 : 0.005);
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
  }, [graphData, isMobile]);

  // Add nodes and edges when data changes
  useEffect(() => {
    if (!graphData || !sceneRef.current) return;

    // Add nodes - scale sizes differently on mobile
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

  // Helper function to create a node mesh
  const createNodeMesh = (node: ThreejsNode, isMobile: boolean): THREE.Mesh => {
    // Scale factor for mobile
    const scale = isMobile ? 1.2 : 1; // Slightly larger on mobile for better visibility
    
    // Different geometries based on node type
    let geometry;
    switch (node.type) {
      case 'contract':
        geometry = new THREE.BoxGeometry(1 * scale, 1 * scale, 1 * scale);
        break;
      case 'wallet':
        geometry = new THREE.SphereGeometry(0.5 * scale, isMobile ? 16 : 32, isMobile ? 16 : 32);
        break;
      case 'exchange':
        geometry = new THREE.CylinderGeometry(0.5 * scale, 0.5 * scale, 1 * scale, isMobile ? 16 : 32);
        break;
      default:
        geometry = new THREE.TetrahedronGeometry(0.5 * scale);
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
      shininess: isMobile ? 80 : 100, // Reduce shininess on mobile
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
  const createEdgeLine = (
    edge: ThreejsEdge, 
    source: ThreejsNode, 
    target: ThreejsNode,
    isMobile: boolean
  ): THREE.Line => {
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
      opacity: isMobile ? 0.7 : 0.6, // Slightly more visible on mobile
      linewidth: 1, // Note: linewidth > 1 only works in some browsers
    });
    
    return new THREE.Line(geometry, material);
  };

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full relative overflow-hidden cyber-panel ${className}`}
      style={{ minHeight: isMobile ? '300px' : '400px' }}
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
