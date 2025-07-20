import { Object3DNode } from '@react-three/fiber';
import { ShaderMaterial } from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    liquidGradientMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial>;
     glitchTrailMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial>;
  }
}