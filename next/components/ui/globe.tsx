'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Fog,
  PerspectiveCamera,
  PointLight,
  Scene,
} from 'three';
import ThreeGlobe from 'three-globe';

import countries from './data/globe.json';

/* eslint-disable react-hooks/exhaustive-deps */

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

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

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings = [0];

function GlobeInner({ globeConfig, data }: WorldProps) {
  const { scene } = useThree();
  const [globeData, setGlobeData] = useState<
    | {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
      }[]
    | null
  >(null);

  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const globeRef = useRef<ThreeGlobe | null>(null);
  const meshRef = useRef<any>(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: '#ffffff',
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: 'rgba(255,255,255,0.7)',
    globeColor: '#1d072e',
    emissive: '#000000',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    if (!globeRef.current && scene) {
      try {
        const globe = new ThreeGlobe();
        globeRef.current = globe;

        if (meshRef.current) {
          meshRef.current.add(globe);
        }

        _buildData();
        _buildMaterial();
      } catch (error) {
        console.error('Error initializing globe:', error);
      }
    }
  }, [scene]);

  const _buildMaterial = () => {
    if (!globeRef.current) return;

    try {
      const globeMaterial = globeRef.current.globeMaterial() as unknown as {
        color: Color;
        emissive: Color;
        emissiveIntensity: number;
        shininess: number;
      };
      globeMaterial.color = new Color(defaultProps.globeColor);
      globeMaterial.emissive = new Color(defaultProps.emissive);
      globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
      globeMaterial.shininess = defaultProps.shininess;
    } catch (error) {
      console.warn('Error setting globe material:', error);
    }
  };

  const _buildData = () => {
    const arcs = data;
    let points = [];

    if (!arcs || arcs.length === 0) {
      setGlobeData([]);
      return;
    }

    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];

      if (!arc) continue;

      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };

      // Validate start coordinates
      if (
        typeof arc.startLat === 'number' &&
        typeof arc.startLng === 'number' &&
        Number.isFinite(arc.startLat) &&
        Number.isFinite(arc.startLng)
      ) {
        points.push({
          size: defaultProps.pointSize,
          order: arc.order,
          color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
          lat: arc.startLat,
          lng: arc.startLng,
        });
      }

      // Validate end coordinates
      if (
        typeof arc.endLat === 'number' &&
        typeof arc.endLng === 'number' &&
        Number.isFinite(arc.endLat) &&
        Number.isFinite(arc.endLng)
      ) {
        points.push({
          size: defaultProps.pointSize,
          order: arc.order,
          color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
          lat: arc.endLat,
          lng: arc.endLng,
        });
      }
    }

    // remove duplicates for same lat and lng, and ensure valid coordinates
    const filteredPoints = points.filter(
      (v, i, a) =>
        // Ensure valid coordinates
        typeof v.lat === 'number' &&
        typeof v.lng === 'number' &&
        !isNaN(v.lat) &&
        !isNaN(v.lng) &&
        // Remove duplicates
        a.findIndex((v2) =>
          ['lat', 'lng'].every(
            (k) => v2[k as 'lat' | 'lng'] === v[k as 'lat' | 'lng']
          )
        ) === i
    );

    setGlobeData(filteredPoints);
  };

  useEffect(() => {
    if (
      globeRef.current &&
      globeData &&
      globeData.length > 0 &&
      !isAnimationStarted
    ) {
      // Validate countries data
      const validCountries = countries.features.filter((feature) => {
        if (!feature.geometry || !feature.geometry.coordinates) return false;
        return true;
      });

      // Initialize globe with empty data first to prevent NaN issues
      globeRef.current
        .hexPolygonsData([])
        .arcsData([])
        .pointsData([])
        .ringsData([]);

      // Then set the actual data
      globeRef.current
        .hexPolygonsData(validCountries)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor((e) => {
          return defaultProps.polygonColor;
        });

      setIsAnimationStarted(true);
      // Small delay to ensure initialization is complete
      setTimeout(() => {
        startAnimation();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeData, isAnimationStarted]);

  const startAnimation = () => {
    if (!globeRef.current || !globeData) {
      return;
    }

    try {
      // Filter arcs data to remove any with invalid coordinates
      const validArcsData = data.filter((arc) => {
        return (
          typeof arc.startLat === 'number' &&
          Number.isFinite(arc.startLat) &&
          typeof arc.startLng === 'number' &&
          Number.isFinite(arc.startLng) &&
          typeof arc.endLat === 'number' &&
          Number.isFinite(arc.endLat) &&
          typeof arc.endLng === 'number' &&
          Number.isFinite(arc.endLng)
        );
      });

      // Only proceed if we have valid data
      if (validArcsData.length === 0) {
        console.warn('No valid arc data available');
        return;
      }

      // Set arcs data with safe accessor functions
      globeRef.current
        .arcsData(validArcsData)
        .arcStartLat((d) => {
          const lat = (d as { startLat: number }).startLat;
          return Number.isFinite(lat) ? lat : 0;
        })
        .arcStartLng((d) => {
          const lng = (d as { startLng: number }).startLng;
          return Number.isFinite(lng) ? lng : 0;
        })
        .arcEndLat((d) => {
          const lat = (d as { endLat: number }).endLat;
          return Number.isFinite(lat) ? lat : 0;
        })
        .arcEndLng((d) => {
          const lng = (d as { endLng: number }).endLng;
          return Number.isFinite(lng) ? lng : 0;
        })
        .arcColor((e: any) => (e as { color: string }).color || '#ffffff')
        .arcAltitude((e) => {
          const alt = (e as { arcAlt: number }).arcAlt;
          return Number.isFinite(alt) ? alt : 0.1;
        })
        .arcStroke(() => 0.3) // Use fixed value instead of random
        .arcDashLength(defaultProps.arcLength)
        .arcDashInitialGap((e) => {
          const order = (e as { order: number }).order;
          return Number.isFinite(order) ? order : 1;
        })
        .arcDashGap(15)
        .arcDashAnimateTime(() => defaultProps.arcTime);

      // Set points data safely
      globeRef.current
        .pointsData([]) // Start with empty points to avoid conflicts
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(2);

      // Set rings data safely
      globeRef.current
        .ringsData([])
        .ringMaxRadius(defaultProps.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod(
          (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
        );
    } catch (error) {
      console.error('Error in startAnimation:', error);
    }
  };

  useEffect(() => {
    if (!globeRef.current || !globeData) return;

    intervalRef.current = setInterval(() => {
      try {
        if (!globeRef.current || !globeData) return;

        numbersOfRings = genRandomNumbers(
          0,
          data.length,
          Math.floor((data.length * 4) / 5)
        );

        // Filter globeData to ensure valid coordinates for rings
        const validRingPoints = globeData.filter(
          (d, i) =>
            numbersOfRings.includes(i) &&
            typeof d.lat === 'number' &&
            Number.isFinite(d.lat) &&
            typeof d.lng === 'number' &&
            Number.isFinite(d.lng)
        );

        if (validRingPoints.length > 0) {
          globeRef.current.ringsData(validRingPoints);
        }
      } catch (error) {
        console.error('Error updating rings:', error);
      }
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeRef.current, globeData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (globeRef.current && meshRef.current) {
        try {
          globeRef.current.arcsData([]);
          globeRef.current.pointsData([]);
          globeRef.current.ringsData([]);
          globeRef.current.hexPolygonsData([]);
          meshRef.current.remove(globeRef.current);
        } catch (error) {
          console.warn('Error cleaning up globe resources:', error);
        }
      }
    };
  }, []);

  return <group ref={meshRef} />;
}

export function Globe({ globeConfig, data }: WorldProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <GlobeInner globeConfig={globeConfig} data={data} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    try {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      gl.setSize(size.width, size.height);
      gl.setClearColor(0x000000, 0);
    } catch (error) {
      console.warn('Error configuring WebGL renderer:', error);
    }
  }, [gl, size]);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;

  return (
    <Canvas
      camera={{ position: [0, 0, cameraZ], fov: 50, near: 180, far: 1800 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onError={(error) => console.error('Canvas error:', error)}
    >
      <WebGLRendererConfig />
      <fog attach="fog" args={[0x000000, 400, 2000]} />

      <ambientLight
        color={globeConfig.ambientLight || '#38bdf8'}
        intensity={0.6}
      />
      <directionalLight
        color={globeConfig.directionalLeftLight || '#ffffff'}
        position={[-400, 100, 400]}
        intensity={0.8}
      />
      <directionalLight
        color={globeConfig.directionalTopLight || '#ffffff'}
        position={[-200, 500, 200]}
        intensity={0.5}
      />
      <pointLight
        color={globeConfig.pointLight || '#ffffff'}
        position={[-200, 500, 200]}
        intensity={0.8}
      />

      <Globe {...props} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={globeConfig.autoRotateSpeed || 0.5}
        autoRotate={globeConfig.autoRotate ?? true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
