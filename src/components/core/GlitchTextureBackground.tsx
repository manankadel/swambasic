// src/components/core/GlitchTextureBackground.tsx

"use client";
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

const GlitchMaterial = shaderMaterial(
  // Uniforms
  {
    u_time: 0,
    u_intensity: 0.0,
  },
  // Vertex Shader
  ` varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  // Fragment Shader
  ` varying vec2 vUv;
    uniform float u_time;
    uniform float u_intensity;

    float random (vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      float time = u_time * 0.1;

      // 1. Base Grain (always present)
      float grain = random(uv * (1.0 + u_intensity * 2.0) + time) * 0.10;
      vec3 color = vec3(grain * 0.5);

      // 2. Scan Lines (driven by intensity)
      float scanline = sin(uv.y * 800.0 - time * 500.0) * u_intensity * 0.05;
      color += scanline;

      // 3. Blocky Glitch (driven by intensity)
      if (random(vec2(time, 2.0)) < u_intensity * 0.1) {
        float block_y = floor(uv.y * (10.0 + u_intensity * 20.0)) / (10.0 + u_intensity * 20.0);
        float displacement = random(vec2(block_y, time)) * u_intensity * 0.2;
        if (displacement > 0.05) {
           color += vec3(displacement * 0.1);
        }
      }

      gl_FragColor = vec4(color, 1.0);
    }`
);

extend({ GlitchMaterial });

const Scene = ({ glitchIntensity }: { glitchIntensity: number }) => {
    const materialRef = useRef<any>();
    
    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value += delta;
            materialRef.current.uniforms.u_intensity.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.u_intensity.value,
                glitchIntensity,
                0.1 
            );
        }
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            {/* @ts-ignore */}
            <glitchMaterial ref={materialRef} key={GlitchMaterial.key} />
        </mesh>
    );
}

export const GlitchTextureBackground = ({ intensity }: { intensity: number }) => {
    return (
        <div className="fixed inset-0 z-[-1] bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Scene glitchIntensity={intensity} />
            </Canvas>
        </div>
    );
};