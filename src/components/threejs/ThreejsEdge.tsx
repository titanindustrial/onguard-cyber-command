import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ThreejsNode, ThreejsEdge as ThreejsEdgeType } from '../../types';

interface EdgeProps {
  edge: ThreejsEdgeType;
  source: ThreejsNode;
  target: ThreejsNode;
  isMobile: boolean;
  scene: THREE.Scene;
}

// React component for edges in the 3D scene
const ThreejsEdge: React.FC<EdgeProps> = ({ edge, source, target, isMobile, scene }) => {
  // Create line using useMemo to optimize performance
  useMemo(() => {
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
    
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    
    // Return a cleanup function to remove the line when component is unmounted
    return () => {
      scene.remove(line);
      geometry.dispose();
      material.dispose();
    };
  }, [edge, source, target, isMobile, scene]);

  // This component doesn't render anything in the DOM
  return null;
};

// Keep the utility function for backward compatibility
export const createEdgeLine = (
  edge: ThreejsEdgeType, 
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

export default ThreejsEdge;
