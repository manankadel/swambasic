// src/components/core/SubtleSmokeBackground.tsx

"use client";
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// This is a new shader material for our background
const NebulaMaterial = shaderMaterial(
  // Uniforms: values we can pass from React to the shader
  { u_time: 0 },
  // Vertex Shader: positions the vertices (standard stuff)
  ` varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  // Fragment Shader: colors each pixel to create the smoke effect
  ` varying vec2 vUv;
    uniform float u_time;

    // Procedural noise function to create randomness
    float random(vec2 p) { return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453); }

    float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
                   mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    // Fractional Brownian Motion: stacking layers of noise for detail
    float fbm(vec2 p) {
        float value = 0.0; float amplitude = 0.5;
        for (int i = 0; i < 3; i++) { // 3 layers of noise
            value += amplitude * noise(p);
            p *= 2.0; amplitude *= 0.5;
        }
        return value;
    }

    void main() {
        // Animate over time and scale the effect
        vec2 p = vUv * 4.0 + vec2(u_time * 0.05);
        
        // Calculate the noise value
        float smoke = fbm(p);
        
        // Make the effect soft and dark
        vec3 color = vec3(smoothstep(0.4, 0.6, smoke)) * 0.08;
        
        gl_FragColor = vec4(color, 1.0);
    }`
);

// Make the new material available to R3F
extend({ NebulaMaterial });

function Scene() {
    const materialRef = useRef<any>();
    // Animate the u_time uniform
    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value += delta * 0.3; // Control speed here
        }
    });
    return (
        <mesh scale={2}>
            <planeGeometry args={[1, 1]} />
            {/* @ts-ignore */}
            <nebulaMaterial ref={materialRef} />
        </mesh>
    );
}

// The final component that we will use
export const SubtleSmokeBackground = () => {
    return (
        <div className="absolute inset-0 z-[-1]">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Scene />
            </Canvas>
        </div>
    )
}