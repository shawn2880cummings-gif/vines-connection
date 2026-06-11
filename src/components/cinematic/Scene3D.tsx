"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { scrollState } from "./scrollStore";

const CORE = "#ffd9a0";
const MID = "#f0a830";
const ARM = "#5a3cb8";
const TEAL = "#20c9b0";
const VOID = "#000209";

// Camera flies from z = START toward z = START - TRAVEL as you scroll
const CAM_START = 14;
const CAM_TRAVEL = 106; // p=1 -> z = -92
const EARTH_Z = -98;

/* ------------------------------------------------------------------ *
 *  Galactic vortex — spiral arms forming a tunnel you fly down
 * ------------------------------------------------------------------ */
function GalaxyVortex() {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 26000;
    const zStart = 8;
    const zEnd = -90;
    const depth = zStart - zEnd;
    const branches = 5;

    const core = new THREE.Color(CORE);
    const mid = new THREE.Color(MID);
    const arm = new THREE.Color(ARM);
    const teal = new THREE.Color(TEAL);

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const t = Math.random(); // 0 (front) .. 1 (deep)
      const z = zStart - t * depth;

      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const twist = t * Math.PI * 6; // arms spiral as the tunnel deepens
      const armR = 5 + t * 12; // tunnel widens with depth

      const sign = () => (Math.random() < 0.5 ? 1 : -1);
      const jitter = Math.pow(Math.random(), 2.4) * sign() * armR * 0.35;
      const radius = armR * (0.55 + Math.random() * 0.45) + jitter;
      const angle = branchAngle + twist;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = z;

      // Inner stars warm, outer stars violet, occasional teal sparkle
      const rt = Math.min(1, radius / (armR + 6));
      const col = core.clone().lerp(mid, Math.min(1, rt * 1.6));
      col.lerp(arm, rt);
      if (Math.random() < 0.07) col.lerp(teal, 0.6);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return { positions, colors };
  }, []);

  useFrame((st, delta) => {
    if (!ref.current) return;
    // Arms swirl constantly + extra swirl as you scroll
    ref.current.rotation.z =
      st.clock.elapsedTime * 0.04 + scrollState.smooth * Math.PI * 1.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
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
 *  Sparse stars filling the whole flight path
 * ------------------------------------------------------------------ */
function DeepStars({ count = 3500 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 70;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 70;
      arr[i * 3 + 2] = 16 - Math.random() * 130; // along the travel axis
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#cdd6ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ *
 *  Planets passed along the way
 * ------------------------------------------------------------------ */
type PlanetData = {
  z: number;
  x: number;
  y: number;
  r: number;
  color: string;
  ring?: boolean;
};

const PLANETS: PlanetData[] = [
  { z: -22, x: -7, y: 3, r: 1.4, color: "#caa06a" },
  { z: -40, x: 8, y: -3.5, r: 2.1, color: "#d8b06a", ring: true },
  { z: -58, x: -8.5, y: 4, r: 1.7, color: "#c2553f" },
  { z: -76, x: 7.5, y: -2.5, r: 2.6, color: "#6f86d6" },
];

function Planet({ data }: { data: PlanetData }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });
  const color = new THREE.Color(data.color);
  return (
    <group ref={ref} position={[data.x, data.y, data.z]}>
      <mesh>
        <sphereGeometry args={[data.r, 48, 48]} />
        <meshStandardMaterial
          color={data.color}
          emissive={color.clone().multiplyScalar(0.25)}
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      {data.ring && (
        <mesh rotation={[-Math.PI / 2.3, 0, 0.2]}>
          <ringGeometry args={[data.r * 1.4, data.r * 2.2, 64]} />
          <meshBasicMaterial
            color="#e8d3a0"
            side={THREE.DoubleSide}
            transparent
            opacity={0.45}
          />
        </mesh>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 *  Earth — the destination at the bottom of the page
 * ------------------------------------------------------------------ */
function makeEarthTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  // Ocean
  const ocean = ctx.createLinearGradient(0, 0, 0, 512);
  ocean.addColorStop(0, "#0b2a5b");
  ocean.addColorStop(0.5, "#12498f");
  ocean.addColorStop(1, "#0b2a5b");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, 1024, 512);
  // Continents
  const greens = ["#2f7d3f", "#3c6b2f", "#4f8a3a", "#6b8f3a"];
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = greens[Math.floor(Math.random() * greens.length)];
    const cx = Math.random() * 1024;
    const cy = Math.random() * 512;
    ctx.beginPath();
    const blobs = 5 + Math.floor(Math.random() * 6);
    for (let b = 0; b < blobs; b++) {
      ctx.ellipse(
        cx + (Math.random() - 0.5) * 90,
        cy + (Math.random() - 0.5) * 60,
        10 + Math.random() * 45,
        8 + Math.random() * 30,
        Math.random() * Math.PI,
        0,
        Math.PI * 2
      );
    }
    ctx.fill();
  }
  // Clouds
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * 1024,
      Math.random() * 512,
      30 + Math.random() * 80,
      10 + Math.random() * 25,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Earth() {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => makeEarthTexture(), []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06;
  });
  return (
    <group position={[0, 0, EARTH_Z]}>
      <mesh ref={ref}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          map={tex}
          emissive={new THREE.Color("#10325f")}
          emissiveIntensity={0.25}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Atmosphere glow */}
      <mesh scale={1.12}>
        <sphereGeometry args={[3, 48, 48]} />
        <meshBasicMaterial
          color="#4aa3ff"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 *  Scroll-driven flight rig
 * ------------------------------------------------------------------ */
function FlightRig() {
  useFrame((st, delta) => {
    scrollState.smooth = THREE.MathUtils.damp(
      scrollState.smooth,
      scrollState.progress,
      3,
      delta
    );
    const p = scrollState.smooth;
    const cam = st.camera;

    // Fly forward into the galaxy
    const targetZ = CAM_START - p * CAM_TRAVEL;
    // Gentle spiral wobble that settles to center as you reach Earth
    const wobble = 1 - p;
    const targetX = Math.sin(p * Math.PI * 4) * 3 * wobble + st.pointer.x * 1.2;
    const targetY =
      Math.cos(p * Math.PI * 4) * 2 * wobble + st.pointer.y * 0.8;

    cam.position.x += (targetX - cam.position.x) * 0.06;
    cam.position.y += (targetY - cam.position.y) * 0.06;
    cam.position.z += (targetZ - cam.position.z) * 0.08;

    // Look ahead down the tunnel, easing onto Earth near the end
    const lookZ = THREE.MathUtils.lerp(cam.position.z - 20, EARTH_Z, p * p);
    cam.lookAt(0, 0, lookZ);
  });
  return null;
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, CAM_START], fov: 62 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
    >
      <color attach="background" args={[VOID]} />
      <fog attach="fog" args={[VOID, 14, 70]} />

      <ambientLight intensity={0.35} />
      {/* Sun near Earth */}
      <pointLight
        position={[18, 12, EARTH_Z + 8]}
        intensity={9}
        color="#fff3da"
        distance={120}
      />
      <pointLight position={[0, 0, 6]} intensity={4} color={CORE} distance={30} />

      <DeepStars />
      <GalaxyVortex />
      {PLANETS.map((p, i) => (
        <Planet key={i} data={p} />
      ))}
      <Earth />

      <FlightRig />

      <EffectComposer>
        <Bloom
          intensity={1.25}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.2} darkness={0.92} />
      </EffectComposer>
    </Canvas>
  );
}
