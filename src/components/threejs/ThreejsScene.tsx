
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThreejsNode } from '../../types';

interface ThreejsSceneProps {
  containerRef: React.RefObject<HTMLDivElement>;
  nodesRef: React.RefObject<Map<string, THREE.Mesh>>;
  sceneRef: React.MutableRefObject<THREE.Scene | null>;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
  controlsRef: React.MutableRefObject<OrbitControls | null>;
  isMobile: boolean;
}

const ThreejsScene: React.FC<ThreejsSceneProps> = ({
  containerRef,
  nodesRef,
  sceneRef,
  cameraRef,
  rendererRef,
  controlsRef,
  isMobile,
}) => {
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
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
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [containerRef, isMobile, nodesRef]);

  return null; // This component doesn't render anything directly
};

export default ThreejsScene;
