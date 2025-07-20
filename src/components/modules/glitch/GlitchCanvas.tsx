"use client";
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';

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
  uniform sampler2D u_last_frame;

  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  void main() {
    vec4 lastFrameColor = texture2D(u_last_frame, vUv) * 0.95;
    float dist = distance(vUv, u_mouse);
    float brush = smoothstep(0.1, 0.0, dist);
    float r = rand(vUv + u_time);
    vec2 offset = vec2(r * 0.05, 0.0) * brush;
    vec4 glitchColor = texture2D(u_last_frame, vUv + offset);
    gl_FragColor = max(lastFrameColor, glitchColor * brush);
  }
`;

function Scene() {
  const { size, viewport, gl, camera, clock, pointer } = useThree();
  
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_last_frame: { value: new THREE.Texture() },
    },
    vertexShader,
    fragmentShader,
  }), []);

  const fbo1 = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height), [size]);
  const fbo2 = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height), [size]);
  const quad = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(viewport.width, viewport.height), material), [viewport, material]);

  useFrame(() => {
    material.uniforms.u_time.value = clock.getElapsedTime();
    
    // THIS IS THE CORRECT MOUSE TRACKING LOGIC
    material.uniforms.u_mouse.value.lerp(new THREE.Vector2(
      (pointer.x + 1) / 2,
      1.0 - (pointer.y + 1) / 2 // The Y-axis is now correctly inverted
    ), 0.1);

    material.uniforms.u_last_frame.value = fbo1.texture;
    
    gl.setRenderTarget(fbo2);
    gl.render(quad, camera);
    
    gl.setRenderTarget(null);
    gl.render(quad, camera);

    const temp = fbo1;
    fbo1.copy(fbo2);
  });
  
  return <primitive object={quad} />;
}

export const GlitchCanvas = () => {
  return (
    <div className="absolute inset-0 z-20 mix-blend-screen pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Scene />
      </Canvas>
    </div>
  );
};