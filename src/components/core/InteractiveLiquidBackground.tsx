"use client";
import * as THREE from 'three';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { shaderMaterial } from '@react-three/drei';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_mouse_velocity;
  uniform float u_mouse_strength;

  float random (vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise (vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    float dist = distance(vUv, u_mouse);
    
    // Create water-like disturbance around cursor
    float influence = smoothstep(0.5, 0.0, dist);
    
    // Mouse velocity creates flow direction - like water following object
    vec2 flow_direction = u_mouse_velocity * 10.0;
    vec2 mouse_flow = flow_direction * influence * u_mouse_strength;
    
    // Create ripple effect from mouse movement
    float ripple_intensity = u_mouse_strength * influence;
    vec2 ripple_offset = sin(vec2(dist * 20.0 - u_time * 5.0)) * ripple_intensity * 0.02;
    
    // Combine all distortions
    vec2 base_uv = vUv * vec2(2.0, 1.0) + vec2(u_time * 0.05);
    vec2 disturbed_uv = base_uv + mouse_flow + ripple_offset;
    
    float n1 = noise(disturbed_uv * 2.0 + u_time * 0.1);
    float n2 = noise(disturbed_uv * 4.0 - u_time * 0.2);
    
    // Add extra noise disturbance around mouse
    float extra_noise = noise((vUv + mouse_flow * 0.5) * 8.0) * influence * 0.3;
    
    float combined_noise = (n1 + n2) * 0.5 + extra_noise;
    
    // Glow effect
    float glow = influence * u_mouse_strength * 0.2;
    
    vec3 color1 = vec3(0.0, 0.0, 0.0);
    vec3 color2 = vec3(0.1, 0.1, 0.1);
    vec3 color3 = vec3(0.25, 0.25, 0.25);
    
    vec3 color = mix(color1, color2, smoothstep(0.3, 0.6, combined_noise));
    color = mix(color, color3, smoothstep(0.6, 0.8, combined_noise));
    
    // Add glow
    color += glow;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const LiquidGradientMaterial = shaderMaterial(
  // We initialize the mouse uniform at the center (0.5, 0.5 in UV space)
  { u_time: 0, u_mouse: new THREE.Vector2(0.5, 0.5) },
  vertexShader,
  fragmentShader
);

extend({ LiquidGradientMaterial });

function Scene() {
  const materialRef = useRef<any>();
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value += delta;

      // THE FIX IS HERE:
      // 1. We get the pointer position from the state (-1 to 1 range).
      // 2. We convert it to UV coordinates (0 to 1 range).
      // 3. We smoothly move the shader's mouse uniform to this correct coordinate.
      const targetMouse = new THREE.Vector2(
        (state.pointer.x + 1) / 2,
        (-state.pointer.y + 1) / 2
      );
      materialRef.current.uniforms.u_mouse.value.lerp(targetMouse, 0.5);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <liquidGradientMaterial ref={materialRef} />
    </mesh>
  );
}

export const InteractiveLiquidBackground = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        background: 'black',
      }}
    >
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Scene />
      </Canvas>
    </div>
  );
};
