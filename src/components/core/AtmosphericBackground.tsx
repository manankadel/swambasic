// src/components/core/AtmosphericBackground.tsx

"use client";

// THE FIX: The package is "@react-three/fiber", not "@react-three-fiber"
// I am also importing `RootState` for correct typing in useFrame.
import { Canvas, useFrame, extend, useLoader, RootState } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { ShopifyProduct } from '@/types/shopify';

const MAX_PRODUCTS = 10; 

const AtmosphericMaterial = shaderMaterial(
  { 
    u_time: 0,
    u_mouse: new THREE.Vector2(0.5, 0.5),
    u_textures: [], 
    u_positions: [],
    u_scales: [],
    u_focused_index: -1,
  },
  ` varying vec2 vUv;
    void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); vUv = uv; }`,
  ` varying vec2 vUv;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform sampler2D u_textures[${MAX_PRODUCTS}];
    uniform vec2 u_positions[${MAX_PRODUCTS}];
    uniform vec2 u_scales[${MAX_PRODUCTS}];
    uniform int u_focused_index;

    vec3 render_product(int index, vec3 current_color, sampler2D tex) {
        if (u_positions[index] == vec2(-10.0, -10.0)) return current_color;
        vec2 pos = u_positions[index];
        vec2 scale = u_scales[index];
        vec2 productUv = (vUv - pos) / scale + 0.5;

        if (productUv.x > 0.0 && productUv.x < 1.0 && productUv.y > 0.0 && productUv.y < 1.0) {
            vec4 texColor = texture2D(tex, productUv);
            float dist = distance(productUv, vec2(0.5));
            float alpha = smoothstep(0.5, 0.45, dist);
            float focus_mult = (index == u_focused_index) ? 1.0 : 0.3;
            return mix(current_color, texColor.rgb, texColor.a * alpha * focus_mult);
        }
        return current_color;
    }

    float random(vec2 p) { return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
                   mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    
    void main() {
        vec2 p = vUv * 2.0 - u_mouse * 0.1;
        float value = noise(p + u_time * 0.03);
        vec3 color = vec3(smoothstep(0.4, 0.7, value)) * 0.1 + 0.05;

        color = render_product(0, color, u_textures[0]);
        color = render_product(1, color, u_textures[1]);
        color = render_product(2, color, u_textures[2]);
        color = render_product(3, color, u_textures[3]);
        color = render_product(4, color, u_textures[4]);
        color = render_product(5, color, u_textures[5]);
        color = render_product(6, color, u_textures[6]);
        color = render_product(7, color, u_textures[7]);
        color = render_product(8, color, u_textures[8]);
        color = render_product(9, color, u_textures[9]);
        
        gl_FragColor = vec4(color, 1.0);
    }`
);

extend({ AtmosphericMaterial });

const Scene = ({ products, focusedIndex }: { products: ShopifyProduct[], focusedIndex: number }) => {
    const materialRef = useRef<any>();
    
    const loadedTextures = useLoader(THREE.TextureLoader, products.map(p => p.featuredImage?.url || ''));

    useEffect(() => {
      if (!materialRef.current || !loadedTextures || loadedTextures.length === 0) return;

      const paddedTextures = new Array(MAX_PRODUCTS).fill(new THREE.Texture());
      const paddedPositions = new Array(MAX_PRODUCTS).fill(new THREE.Vector2(-10.0, -10.0));
      const paddedScales = new Array(MAX_PRODUCTS).fill(new THREE.Vector2(0, 0));

      products.forEach((_, i) => {
          if (loadedTextures[i]) {
              paddedTextures[i] = loadedTextures[i];
              paddedPositions[i] = new THREE.Vector2(0.15 + (i % 4) * 0.22, 0.2 + Math.floor(i / 4) * 0.3);
              paddedScales[i] = new THREE.Vector2(0.2, 0.3);
          }
      });

      materialRef.current.uniforms.u_textures.value = paddedTextures;
      materialRef.current.uniforms.u_positions.value = paddedPositions;
      materialRef.current.uniforms.u_scales.value = paddedScales;

    }, [loadedTextures, products]);

    // THE FIX: Added correct types for the useFrame callback parameters
    useFrame((state: RootState, delta: number) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value += delta * 0.1;
            materialRef.current.uniforms.u_mouse.value.lerp(state.pointer, 0.05);
            materialRef.current.uniforms.u_focused_index.value = focusedIndex;
        }
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            {/* @ts-ignore */}
            <atmosphericMaterial ref={materialRef} key={AtmosphericMaterial.key} />
        </mesh>
    );
};

export const AtmosphericBackground = ({ products, focusedIndex }: { products: ShopifyProduct[], focusedIndex: number }) => {
    if (!products || products.length === 0) return null;
    return (
        <div className="absolute inset-0 bg-[#111] z-[-1]">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Scene products={products} focusedIndex={focusedIndex} />
            </Canvas>
        </div>
    );
};