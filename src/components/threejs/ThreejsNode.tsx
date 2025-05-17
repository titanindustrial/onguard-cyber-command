import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ThreejsNode as ThreejsNodeType } from '../../types';

interface NodeProps {
  node: ThreejsNodeType;
  isMobile: boolean;
  scene: THREE.Scene;
}

// React component for nodes in the 3D scene
const ThreejsNode: React.FC<NodeProps> = ({ node, isMobile, scene }) => {
  // Create mesh using useMemo to optimize performance
  useMemo(() => {
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
    
    scene.add(mesh);
    
    // Return a cleanup function to remove the mesh when component is unmounted
    return () => {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [node, isMobile, scene]);

  // This component doesn't render anything in the DOM
  return null;
};

// Keep the utility function for backward compatibility
export const createNodeMesh = (node: ThreejsNodeType, isMobile: boolean): THREE.Mesh => {
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

export default ThreejsNode;
