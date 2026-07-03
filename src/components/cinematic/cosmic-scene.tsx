"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Deterministic pseudo-random so SSR/CSR stay consistent */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function GoldDust({
  count,
  radius,
  size,
  color,
  opacity,
  speed,
  seed,
}: {
  count: number;
  radius: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
  seed: number;
}) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const rand = mulberry32(seed);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a thick spherical shell around the camera
      const r = radius * (0.35 + 0.65 * Math.cbrt(rand()));
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius, seed]);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    points.current.rotation.y = t * 0.015 * speed;
    points.current.rotation.x = Math.sin(t * 0.05 * speed) * 0.04;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Slowly-breathing sacred geometry: nested golden rings + icosahedron */
function SacredGeometry() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.z = t * 0.02;
      group.current.rotation.x = Math.sin(t * 0.06) * 0.15 + 0.35;
      const breathe = 1 + Math.sin(t * 0.25) * 0.03;
      group.current.scale.setScalar(breathe);
    }
    if (inner.current) {
      inner.current.rotation.y = t * 0.06;
      inner.current.rotation.x = t * 0.03;
    }
  });

  return (
    <group ref={group} position={[0, 0, -26]}>
      {[10, 13.5, 17].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2.4, i * 0.5, 0]}>
          <torusGeometry args={[r, 0.015, 8, 128]} />
          <meshBasicMaterial
            color="#C5972C"
            transparent
            opacity={0.16 - i * 0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh ref={inner}>
        <icosahedronGeometry args={[6.5, 1]} />
        <meshBasicMaterial
          color="#D4AD4E"
          wireframe
          transparent
          opacity={0.055}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* Camera rig: eases toward pointer + drifts with scroll */
function Rig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    target.current.x = state.pointer.x * 1.4;
    target.current.y = state.pointer.y * 0.9 - scrollY * 0.0012;
    camera.position.x += (target.current.x - camera.position.x) * 0.03;
    camera.position.y += (target.current.y - camera.position.y) * 0.03;
    camera.lookAt(0, 0, -12);
  });
  return null;
}

export default function CosmicScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 16], fov: 60 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      {/* Fine golden dust — near field */}
      <GoldDust
        count={2400}
        radius={34}
        size={0.055}
        color="#D4AD4E"
        opacity={0.85}
        speed={1}
        seed={7}
      />
      {/* Warm ember layer — mid field */}
      <GoldDust
        count={1200}
        radius={46}
        size={0.09}
        color="#C5972C"
        opacity={0.5}
        speed={0.6}
        seed={21}
      />
      {/* Deep emerald layer — far field */}
      <GoldDust
        count={900}
        radius={60}
        size={0.12}
        color="#2D5A3F"
        opacity={0.4}
        speed={0.35}
        seed={42}
      />
      <SacredGeometry />
      <Rig />
    </Canvas>
  );
}
