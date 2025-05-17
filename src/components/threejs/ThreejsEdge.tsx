
import * as THREE from 'three';
import { ThreejsNode, ThreejsEdge as ThreejsEdgeType } from '../../types';

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

export default { createEdgeLine };
