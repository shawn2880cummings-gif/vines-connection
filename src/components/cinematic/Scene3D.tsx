"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { scrollState } from "./scrollStore";

// Brand-tinted galaxy palette
const CORE = "#ffd9a0"; // warm golden core
const MID = "#f0a830"; // gold
const ARM = "#5a3cb8"; // celestial violet arms
const TEAL = "#20c9b0";
const VOID = "#000209"; // abyssal background

/* ------------------------------------------------------------------ *
 *  Spiral galaxy — thousands of stars in rotating arms
 * ------------------------------------------------------------------ */
function Galaxy() {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 24000;
    const radius = 11;
    const branches = 4;
    const spin = 1.15;
    const randomness = 0.3;
    const randomnessPower = 2.6;

    const core = new THREE.Color(CORE);
    const mid = new THREE.Color(MID);
    const arm = new THREE.Color(ARM);
    const teal = new THREE.Color(TEAL);

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.4) * radius; // denser toward center
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;

      const sign = () => (Math.random() < 0.5 ? 1 : -1);
      const rx = Math.pow(Math.random(), randomnessPower) * sign() * randomness * r;
      const ry =
        Math.pow(Math.random(), randomnessPower) * sign() * randomness * r * 0.4;
      const rz = Math.pow(Math.random(), randomnessPower) * sign() * randomness * r;

      const a = branchAngle + spinAngle;
      positions[i * 3] = Math.cos(a) * r + rx;
      positions[i * 3 + 1] = ry; // thin disk
      positions[i * 3 + 2] = Math.sin(a) * r + rz;

      // Color: warm core -> gold -> violet arms, with teal sparkle outside
      const t = r / radius;
      const col = core.clone().lerp(mid, Math.min(1, t * 1.6));
      col.lerp(arm, t);
      if (Math.random() < 0.08) col.lerp(teal, 0.6); // occasional teal stars
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return { positions, colors };
  }, []);

  useFrame((st, delta) => {
    if (!ref.current) return;
    // Smooth the scroll progress
    scrollState.smooth = THREE.MathUtils.damp(
      scrollState.smooth,
      scrollState.progress,
      3,
      delta
    );
    const p = scrollState.smooth;
    const t = st.clock.elapsedTime;

    // Constant slow spin + extra spin driven by scroll
    ref.current.rotation.y = t * 0.06 + p * Math.PI * 1.6;
    // Tilt the disk from near face-on to edge-on as you scroll (the 3D spin)
    ref.current.rotation.x = 0.35 + p * 1.05;
    ref.current.rotation.z = p * 0.35;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ *
 *  Distant starfield for depth
 * ------------------------------------------------------------------ */
function Starfield({ count = 1800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distant shell around the scene
      const r = 35 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        color="#cdd6ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ *
 *  Camera: gentle pointer parallax
 * ------------------------------------------------------------------ */
function CameraRig() {
  useFrame((st) => {
    const cam = st.camera;
    cam.position.x += (st.pointer.x * 1.4 - cam.position.x) * 0.03;
    cam.position.y += (2 + st.pointer.y * 0.8 - cam.position.y) * 0.03;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 2, 13], fov: 60 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
    >
      <color attach="background" args={[VOID]} />
      <fog attach="fog" args={[VOID, 22, 60]} />

      {/* Glowing galactic core light */}
      <pointLight position={[0, 0, 0]} intensity={6} color={CORE} distance={20} />

      <Starfield />
      <Galaxy />

      <CameraRig />

      <EffectComposer>
        <Bloom
          intensity={1.3}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.2} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}
