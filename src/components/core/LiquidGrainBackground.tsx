// src/components/core/LiquidGrainBackground.tsx

"use client";

import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

const LiquidGrainMaterial = shaderMaterial(
  { u_time: 0 },
  ` varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  ` varying vec2 vUv; uniform float u_time;
    float random(vec2 p) { return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) { vec2 i = floor(p); vec2 f = fract(p); vec2 u = f*f*(3.0-2.0*f); return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x), mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y); }
    float fbm(vec2 p) { float value = 0.0; float amplitude = 0.5; for (int i = 0; i < 3; i++) { value += amplitude * noise(p); p *= 2.0; amplitude *= 0.5; } return value; }
    void main() { 
      vec2 p = vUv * 2.5; 
      p.x += u_time * 0.05; 
      float noiseValue = fbm(p); 
      float grain = random(vUv * 1000.0) * 0.04; 
      float intensity = smoothstep(0.3, 0.6, noiseValue); 
      float glow = pow(intensity, 0.5) * 0.3;
      vec3 color = vec3(intensity * 0.1 + 0.05 + grain + glow); 
      gl_FragColor = vec4(color, 1); 
    }`
);

extend({ LiquidGrainMaterial });

const Scene = () => {
    const materialRef = useRef<any>();
    const { viewport } = useThree();
    
    useFrame((state, delta) => { if (materialRef.current) materialRef.current.uniforms.u_time.value += delta; });
    
    return (
        <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            {/* @ts-ignore */}
            <liquidGrainMaterial ref={materialRef} />
        </mesh>
    );
};

export const LiquidGrainBackground = () => (
    <div className="fixed inset-0 z-[-1]" style={{ filter: 'blur(8px)' }}>
        <Canvas camera={{ position: [0, 0, 1] }}>
            <Scene />
        </Canvas>
    </div>
);