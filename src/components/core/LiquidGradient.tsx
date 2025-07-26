"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const LiquidShaderMaterial = shaderMaterial(
  { u_time: 0 },
  ` varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  ` varying vec2 vUv;
    uniform float u_time;
    float random(vec2 p) { return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
                   mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
        float value = 0.0; float amplitude = 0.5;
        for (int i = 0; i < 2; i++) { value += amplitude * noise(p); p *= 2.0; amplitude *= 0.5; }
        return value;
    }
    void main() {
        vec2 p = vUv * 5.0;
        float time_offset = u_time * 0.1;
        vec2 q = vec2(fbm(p + time_offset), fbm(p + time_offset + 1.0));
        float liquid = fbm(p + q);
        vec3 color = vec3(smoothstep(0.4, 0.6, liquid)) * 0.1; // Soft, dark light effect
        gl_FragColor = vec4(color, 1.0);
    }`
);
extend({ LiquidShaderMaterial });

function Scene() {
    const materialRef = useRef<any>();
    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value += delta * 2;
        }
    });
    return (
        <mesh scale={2}>
            <planeGeometry args={[1, 1]} />
            <liquidShaderMaterial ref={materialRef} />
        </mesh>
    );
}

export const LiquidGradient = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{position: [0, 0, 1]}}>
                <Scene/>
            </Canvas>
        </div>
    )
}