// src/components/core/FloatingParticlesBackground.tsx

"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({ count = 3000 }) => {
  const meshRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const { pointer } = state;

    if (meshRef.current) {
      const ambientRotationY = elapsedTime * 0.03;
      const mouseRotationX = -pointer.y * 0.3;
      const mouseRotationY = -pointer.x * 0.3;
      meshRef.current.rotation.x = mouseRotationX;
      meshRef.current.rotation.y = mouseRotationY + ambientRotationY;
    }
  });

  const positions = useMemo(() => {
    const particles = new Float32Array(count * 3);
    const distance = 8;
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 
      particles[i * 3 + 0] = distance * Math.sin(theta) * Math.cos(phi);
      particles[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      particles[i * 3 + 2] = distance * Math.cos(theta);
    }
    return particles;
  }, [count]);

  return (
    <points ref={meshRef}>
        <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="white" sizeAttenuation={true} />
    </points>
  );
};

export const FloatingParticlesBackground = () => {
  return (
    <div className="fixed inset-0 z-0 opacity-70">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Particles />
      </Canvas>
    </div>
  );
};