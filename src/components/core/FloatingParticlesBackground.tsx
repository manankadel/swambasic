// src/components/core/FloatingParticlesBackground.tsx

"use client";

// ADDED: useState and useEffect for the gyroscope
import React, { useMemo, useRef, useState, useEffect } from "react"; 
import { Canvas, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// ===================================================================
// ==                          CONTROLS                             ==
// ===================================================================
const PARTICLE_CONTROLS = {
    quantity: 1500,
    size: 0.04,
    glowPercentage: 0.8,
    blinkPercentage: 0.2,
    direction: -1, 
    speed: 0.1,
    // ONLY ADDITION: A control for gyroscope sensitivity
    gyroIntensity: 1,
};
// ===================================================================

// Your custom shader material. THIS IS UNCHANGED.
const CustomParticleMaterial = shaderMaterial(
  { u_time: 0.0 },
  // Vertex Shader
  ` uniform float u_time;
    attribute vec3 a_color;
    attribute float a_blinkSpeed;
    varying vec3 v_color;
    varying float v_blinkSpeed;

    void main() {
      v_color = a_color;
      v_blinkSpeed = a_blinkSpeed;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      gl_PointSize = ${PARTICLE_CONTROLS.size} * (300.0 / -viewPosition.z);
      gl_Position = projectionMatrix * viewPosition;
    }`,
  // Fragment Shader
  ` uniform float u_time;
    varying vec3 v_color;
    varying float v_blinkSpeed;

    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) { discard; }
      float alpha = 1.0;
      if (v_blinkSpeed > 0.0) { alpha = (sin(u_time * v_blinkSpeed) + 1.0) / 2.0; }
      gl_FragColor = vec4(v_color, alpha);
    }`
);
extend({ CustomParticleMaterial });

// The particle system.
// ONLY CHANGE: It now accepts `gyroData` as a prop.
const Particles = ({ mousePosition, gyroData }: { mousePosition: { x: number, y: number }, gyroData: { x: number, y: number } }) => {
  const meshRef = useRef<THREE.Points>(null!);
  
  // Your particle generation logic. THIS IS UNCHANGED.
  const particleData = useMemo(() => {
    const positions = new Float32Array(PARTICLE_CONTROLS.quantity * 3);
    const colors = new Float32Array(PARTICLE_CONTROLS.quantity * 3);
    const blinkSpeeds = new Float32Array(PARTICLE_CONTROLS.quantity);
    const distance = 10;
    for (let i = 0; i < PARTICLE_CONTROLS.quantity; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * distance;
      positions[i * 3 + 1] = (Math.random() - 0.5) * distance;
      positions[i * 3 + 2] = (Math.random() - 0.5) * distance;
      let particleColor = new THREE.Color();
      blinkSpeeds[i] = 0.0;
      if (Math.random() < PARTICLE_CONTROLS.blinkPercentage) {
        particleColor.setHSL(0, 0, 1.0);
        blinkSpeeds[i] = Math.random() * 3 + 1;
      } else if (Math.random() < PARTICLE_CONTROLS.glowPercentage) {
        particleColor.setHSL(0, 0, 1.0);
      } else {
        const shade = 0.4 + Math.random() * 0.2;
        particleColor.setHSL(0, 0, shade);
      }
      colors.set([particleColor.r, particleColor.g, particleColor.b], i * 3);
    }
    return { positions, colors, blinkSpeeds };
  }, []);

  useFrame((state, delta) => {
    // --- GYROSCOPE INTEGRATION LOGIC ---
    // 1. Check if gyroscope is active.
    const hasGyro = gyroData.x !== 0 || gyroData.y !== 0;
    
    // 2. Use gyro data if available, otherwise fall back to mouse data.
    const targetX = hasGyro ? gyroData.x * PARTICLE_CONTROLS.gyroIntensity : mousePosition.x * 0.5;
    const targetY = hasGyro ? gyroData.y * PARTICLE_CONTROLS.gyroIntensity : mousePosition.y * 0.5;

    // 3. Your original camera movement logic, now driven by either gyro or mouse.
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    
    // Your infinite loop animation. THIS IS UNCHANGED.
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += delta * PARTICLE_CONTROLS.speed * PARTICLE_CONTROLS.direction;
        if (PARTICLE_CONTROLS.direction === 1 && positions[i + 2] > 5) {
            positions[i + 2] = -5;
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
        } else if (PARTICLE_CONTROLS.direction === -1 && positions[i + 2] < -5) {
            positions[i + 2] = 5;
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
        }
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.u_time.value = state.clock.getElapsedTime();
    }
  });

  return (
    // Your JSX for the particles. THIS IS UNCHANGED.
    <points ref={meshRef}>
        <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={particleData.positions.length / 3} array={particleData.positions} itemSize={3} />
            <bufferAttribute attach="attributes-a_color" count={particleData.colors.length / 3} array={particleData.colors} itemSize={3} />
            <bufferAttribute attach="attributes-a_blinkSpeed" count={particleData.blinkSpeeds.length} array={particleData.blinkSpeeds} itemSize={1} />
        </bufferGeometry>
        {/* @ts-ignore */}
        <customParticleMaterial 
            attach="material"
            blending={THREE.AdditiveBlending}
            transparent={true}
            depthWrite={false}
            vertexColors={true}
        />
    </points>
  );
};

// --- GYROSCOPE LOGIC ADDED HERE ---
export const FloatingParticlesBackground = ({ mousePosition }: { mousePosition: { x: number, y: number } }) => {
  const [gyroData, setGyroData] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta !== null && gamma !== null) {
        const x = THREE.MathUtils.clamp(gamma / 90, -1, 1);
        const y = THREE.MathUtils.clamp(beta / 90, -1, 1);
        setGyroData({ x, y });
      }
    };
    
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {/* We now pass both mouse and gyro data down */}
        <Particles mousePosition={mousePosition} gyroData={gyroData} />
      </Canvas>
    </div>
  );
};