// src/components/core/ElementalGradient.tsx

"use client";
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

const ElementalGradientMaterial = shaderMaterial(
  // Uniforms
  { u_time: 0 },
  // Vertex Shader
  ` varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  // Fragment Shader
  ` varying vec2 vUv;
    uniform float u_time;

    float random(vec2 p) { return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
                   mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
        vec2 p = vUv * 3.0 + u_time * 0.05;
        float value = noise(p);
        // Create a dark, subtle gradient effect from the noise
        vec3 color = vec3(smoothstep(0.4, 0.7, value)) * 0.15;
        gl_FragColor = vec4(color, 1.0);
    }`
);

extend({ ElementalGradientMaterial });

const Scene = () => {
    const materialRef = useRef<any>();
    useFrame((state, delta) => {
        if (materialRef.current) materialRef.current.uniforms.u_time.value += delta * 0.2;
    });
    return (
        <mesh scale={[2, 2, 2]}>
            <planeGeometry args={[1, 1]} />
            {/* @ts-ignore */}
            <elementalGradientMaterial ref={materialRef} />
        </mesh>
    );
};

export const ElementalGradient = () => (
    <div className="w-full h-full">
        <Canvas camera={{ position: [0, 0, 1] }}>
            <Scene />
        </Canvas>
    </div>
);