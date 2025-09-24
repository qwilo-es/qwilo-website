import * as THREE from 'three';
import { ReactThreeFiber } from '@react-three/fiber';
import ThreeGlobe from 'three-globe';

// Extend the ThreeElements interface for better type safety
declare module '@react-three/fiber' {
  interface ThreeElements {
    threeGlobe: ReactThreeFiber.Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
    primitive: ReactThreeFiber.Object3DNode<THREE.Object3D, typeof THREE.Object3D> & {
      object: THREE.Object3D;
      attach?: string;
    };
  }
}

// Global JSX extensions for three-globe
declare global {
  namespace JSX {
    interface IntrinsicElements {
      threeGlobe: ReactThreeFiber.Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
      primitive: ReactThreeFiber.Object3DNode<THREE.Object3D, typeof THREE.Object3D> & {
        object: THREE.Object3D;
        attach?: string;
      };
    }
  }
}
