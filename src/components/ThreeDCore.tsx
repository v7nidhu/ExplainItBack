import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDCoreProps {
  className?: string;
  themeColor?: string;
}

function getHarmoniousColor(colorStr?: string): { wireframe: THREE.Color; inner: THREE.Color; nodes: THREE.Color } {
  const fallback = new THREE.Color(0xb8b6af); // Light, delicate grayish
  if (!colorStr) {
    return {
      wireframe: fallback,
      inner: fallback.clone().lerp(new THREE.Color(0xffffff), 0.3),
      nodes: fallback.clone().lerp(new THREE.Color(0x707070), 0.2),
    };
  }

  try {
    const base = new THREE.Color(colorStr);
    // Lighten to ensure high contrast with dark text in foreground
    const lightened = base.clone().lerp(new THREE.Color(0xffffff), 0.4);
    const lighterInner = base.clone().lerp(new THREE.Color(0xffffff), 0.6);
    return {
      wireframe: lightened,
      inner: lighterInner,
      nodes: base,
    };
  } catch {
    return {
      wireframe: fallback,
      inner: fallback.clone().lerp(new THREE.Color(0xffffff), 0.3),
      nodes: fallback,
    };
  }
}

export const ThreeDCore: React.FC<ThreeDCoreProps> = ({ className = '', themeColor }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const materialsRef = useRef<{
    wireframe?: THREE.LineBasicMaterial;
    inner?: THREE.MeshBasicMaterial;
    nodes?: THREE.PointsMaterial;
    ring?: THREE.MeshBasicMaterial;
  }>({});

  // Dynamic theme color update
  useEffect(() => {
    const colors = getHarmoniousColor(themeColor);
    const mats = materialsRef.current;
    if (mats.wireframe) mats.wireframe.color.set(colors.wireframe);
    if (mats.inner) mats.inner.color.set(colors.inner);
    if (mats.nodes) mats.nodes.color.set(colors.nodes);
    if (mats.ring) mats.ring.color.set(colors.wireframe);
  }, [themeColor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialColors = getHarmoniousColor();

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for mouse rotation
    const group = new THREE.Group();
    scene.add(group);

    // 1. Outer 3D Wireframe Icosahedron (Light, luminous, doesn't blur text)
    const icosaGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const wireframeGeometry = new THREE.WireframeGeometry(icosaGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: initialColors.wireframe,
      linewidth: 1,
      transparent: true,
      opacity: 0.22,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    group.add(wireframeMesh);
    materialsRef.current.wireframe = wireframeMaterial;

    // 2. Inner Floating Core (Light ethereal tint)
    const innerGeometry = new THREE.OctahedronGeometry(0.85, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: initialColors.inner,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    group.add(innerMesh);
    materialsRef.current.inner = innerMaterial;

    // 3. Orbiting Nodes (Delicate points)
    const nodesCount = 36;
    const nodeGeometry = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodesCount * 3);

    for (let i = 0; i < nodesCount; i++) {
      const radius = 1.9 + Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      nodePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      nodePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      nodePositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    const nodeMaterial = new THREE.PointsMaterial({
      color: initialColors.nodes,
      size: 0.04,
      transparent: true,
      opacity: 0.45,
    });
    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    group.add(nodes);
    materialsRef.current.nodes = nodeMaterial;

    // 4. Subtle Orbital Ring
    const ringGeometry = new THREE.RingGeometry(2.1, 2.12, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: initialColors.wireframe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.16,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2.5;
    group.add(ringMesh);
    materialsRef.current.ring = ringMaterial;

    // Mouse Tracking Physics
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);

      targetRotationY = x * 0.8;
      targetRotationX = y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth lerp mouse tracking
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      // Base auto-rotation
      wireframeMesh.rotation.y = elapsed * 0.15 + currentRotationY;
      wireframeMesh.rotation.x = elapsed * 0.08 + currentRotationX;

      innerMesh.rotation.y = -elapsed * 0.25 - currentRotationY;
      innerMesh.rotation.z = elapsed * 0.12;

      nodes.rotation.y = elapsed * 0.08 + currentRotationY * 0.5;
      nodes.rotation.x = elapsed * 0.04 + currentRotationX * 0.5;

      ringMesh.rotation.z = elapsed * 0.05;

      // Gentle vertical floating breathing motion
      group.position.y = Math.sin(elapsed * 1.2) * 0.08;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};
