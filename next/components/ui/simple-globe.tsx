'use client';

import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

import countries from './data/globe.json';

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface SimpleGlobeProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

export function SimpleGlobe({ globeConfig, data }: SimpleGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let globe: THREE.Mesh;
    let animationId: number;

    const initGlobe = async () => {
      try {
        // Scene setup
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 400, 2000);

        // Camera setup
        const container = containerRef.current!;
        const width = container.clientWidth || 600;
        const height = container.clientHeight || 600;

        camera = new THREE.PerspectiveCamera(50, width / height, 180, 1800);
        camera.position.z = 300;

        // Renderer setup
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // Clear container and add renderer
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(
          globeConfig.ambientLight || '#38bdf8',
          0.6
        );
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(
          globeConfig.directionalLeftLight || '#ffffff',
          0.8
        );
        directionalLight1.position.set(-400, 100, 400);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(
          globeConfig.directionalTopLight || '#ffffff',
          0.5
        );
        directionalLight2.position.set(-200, 500, 200);
        scene.add(directionalLight2);

        const pointLight = new THREE.PointLight(
          globeConfig.pointLight || '#ffffff',
          0.8
        );
        pointLight.position.set(-200, 500, 200);
        scene.add(pointLight);

        // Create a basic sphere globe
        const globeGeometry = new THREE.SphereGeometry(100, 64, 32);

        // Create wireframe material for globe
        const globeMaterial = new THREE.MeshPhongMaterial({
          color: globeConfig.globeColor || '#1d072e',
          emissive: globeConfig.emissive || '#000000',
          emissiveIntensity: globeConfig.emissiveIntensity || 0.1,
          shininess: globeConfig.shininess || 0.9,
          wireframe: true,
          wireframeLinewidth: 1,
          transparent: true,
          opacity: 0.8,
        });

        globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);

        // Add some random dots on the globe to simulate countries/points
        const dotGeometry = new THREE.SphereGeometry(1, 8, 8);
        const dotMaterial = new THREE.MeshBasicMaterial({
          color: globeConfig.polygonColor || '#ffffff',
        });

        for (let i = 0; i < 50; i++) {
          const dot = new THREE.Mesh(dotGeometry, dotMaterial);

          // Random position on sphere surface
          const phi = Math.random() * Math.PI * 2;
          const theta = Math.random() * Math.PI;
          const radius = 102;

          dot.position.x = radius * Math.sin(theta) * Math.cos(phi);
          dot.position.y = radius * Math.sin(theta) * Math.sin(phi);
          dot.position.z = radius * Math.cos(theta);

          scene.add(dot);
        }

        // Add arcs as simple curved lines
        if (data && data.length > 0) {
          const validArcs = data
            .filter(
              (arc) =>
                typeof arc.startLat === 'number' &&
                Number.isFinite(arc.startLat) &&
                typeof arc.startLng === 'number' &&
                Number.isFinite(arc.startLng) &&
                typeof arc.endLat === 'number' &&
                Number.isFinite(arc.endLat) &&
                typeof arc.endLng === 'number' &&
                Number.isFinite(arc.endLng)
            )
            .slice(0, 10); // Limit to 10 arcs for performance

          validArcs.forEach((arc) => {
            // Convert lat/lng to 3D coordinates
            const startVector = latLngToVector3(
              arc.startLat,
              arc.startLng,
              101
            );
            const endVector = latLngToVector3(arc.endLat, arc.endLng, 101);

            // Create curved line
            const curve = new THREE.QuadraticBezierCurve3(
              startVector,
              new THREE.Vector3()
                .lerpVectors(startVector, endVector, 0.5)
                .multiplyScalar(1.3),
              endVector
            );

            const points = curve.getPoints(20);
            const arcGeometry = new THREE.BufferGeometry().setFromPoints(
              points
            );
            const arcMaterial = new THREE.LineBasicMaterial({
              color: arc.color || '#d4d4d4',
              transparent: true,
              opacity: 0.6,
            });

            const arcLine = new THREE.Line(arcGeometry, arcMaterial);
            scene.add(arcLine);
          });
        }

        // Simple orbit controls (manual)
        let mouseX = 0,
          mouseY = 0;
        let isMouseDown = false;

        const onMouseDown = (event: MouseEvent) => {
          isMouseDown = true;
          mouseX = event.clientX;
          mouseY = event.clientY;
        };

        const onMouseUp = () => {
          isMouseDown = false;
        };

        const onMouseMove = (event: MouseEvent) => {
          if (!isMouseDown) return;

          const deltaX = event.clientX - mouseX;
          const deltaY = event.clientY - mouseY;

          scene.rotation.y += deltaX * 0.01;
          scene.rotation.x += deltaY * 0.01;

          mouseX = event.clientX;
          mouseY = event.clientY;
        };

        container.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);

          // Auto rotate
          if (globeConfig.autoRotate !== false) {
            scene.rotation.y += (globeConfig.autoRotateSpeed || 0.5) * 0.01;
          }

          renderer.render(scene, camera);
        };

        animate();
        setIsLoaded(true);
      } catch (err) {
        console.error('Error initializing basic globe:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to initialize globe'
        );
      }
    };

    // Helper function to convert lat/lng to 3D coordinates
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);

      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;

      const container = containerRef.current;
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 600;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    initGlobe();
    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        try {
          renderer.dispose();
        } catch (e) {
          console.warn('Error disposing renderer:', e);
        }
      }
      if (scene) {
        try {
          // Clean up scene
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry?.dispose();
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach((material) => material.dispose());
                } else {
                  object.material.dispose();
                }
              }
            }
          });
        } catch (e) {
          console.warn('Error cleaning scene:', e);
        }
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [globeConfig, data]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-red-500 text-sm">
        Globe Error: {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] flex items-center justify-center"
      style={{ touchAction: 'none' }}
    >
      {!isLoaded && (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
      )}
    </div>
  );
}
