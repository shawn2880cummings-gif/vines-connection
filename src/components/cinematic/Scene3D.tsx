"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { scrollState } from "./scrollStore";

// Brand palette (mirrors globals.css @theme tokens)
const GOLD = "#f0a830";
const TEAL = "#20c9b0";
const MAGENTA = "#e83e8c";
const VIOLET = "#7b5cd4";
const INDIGO = "#0d0628";

/* ------------------------------------------------------------------ *
 *  Double golden vine helix — the brand's "Vines Connection" centrepiece
 * ------------------------------------------------------------------ */
function makeHelixCurve(offset: number, turns = 5, height = 14, radius = 1.6) {
  const pts: THREE.Vector3[] = [];
  const steps = 240;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns + offset;
    // Vine tapers and breathes outward toward the middle
    const r = radius * (0.55 + 0.45 * Math.sin(t * Math.PI));
    pts.push(
      new THREE.Vector3(
        Math.cos(angle) * r,
        (t - 0.5) * height,
        Math.sin(angle) * r
      )
    );
  }
  return new THREE.CatmullRomCurve3(pts);
}

function VineHelix() {
  const group = useRef<THREE.Group>(null);

  const { tubeA, tubeB, nodes } = useMemo(() => {
    const curveA = makeHelixCurve(0);
    const curveB = makeHelixCurve(Math.PI);
    const tubeA = new THREE.TubeGeometry(curveA, 240, 0.05, 12, false);
    const tubeB = new THREE.TubeGeometry(curveB, 240, 0.05, 12, false);

    // Leaf / light nodes scattered along both strands
    const nodes: { pos: THREE.Vector3; scale: number; color: string }[] = [];
    const palette = [GOLD, TEAL, MAGENTA];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      [curveA, curveB].forEach((c, idx) => {
        const p = c.getPoint(t);
        nodes.push({
          pos: p,
          scale: 0.05 + Math.random() * 0.07,
          color: palette[(i + idx) % palette.length],
        });
      });
    }
    return { tubeA, tubeB, nodes };
  }, []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={group}>
      <mesh geometry={tubeA}>
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.6}
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>
      <mesh geometry={tubeB}>
        <meshStandardMaterial
          color={"#ffd27a"}
          emissive={GOLD}
          emissiveIntensity={1.2}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos} scale={n.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={n.color}
            emissive={n.color}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 *  Sacred geometry — nested wireframe polyhedra
 * ------------------------------------------------------------------ */
function SacredGeometry() {
  const ico = useRef<THREE.LineSegments>(null);
  const dodec = useRef<THREE.LineSegments>(null);

  const icoGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(3.4, 0)),
    []
  );
  const dodecGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(4.6, 0)),
    []
  );

  useFrame((_, delta) => {
    if (ico.current) {
      ico.current.rotation.x += delta * 0.05;
      ico.current.rotation.y -= delta * 0.07;
    }
    if (dodec.current) {
      dodec.current.rotation.y += delta * 0.04;
      dodec.current.rotation.z += delta * 0.03;
    }
  });

  return (
    <group>
      <lineSegments ref={ico} geometry={icoGeo}>
        <lineBasicMaterial color={VIOLET} transparent opacity={0.5} />
      </lineSegments>
      <lineSegments ref={dodec} geometry={dodecGeo}>
        <lineBasicMaterial color={TEAL} transparent opacity={0.28} />
      </lineSegments>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 *  Particle nebula
 * ------------------------------------------------------------------ */
function Nebula({ count = 2600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(GOLD),
      new THREE.Color(TEAL),
      new THREE.Color(MAGENTA),
      new THREE.Color(VIOLET),
      new THREE.Color("#ffffff"),
    ];
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ *
 *  Scroll-driven cinematic camera rig
 * ------------------------------------------------------------------ */
function CameraRig() {
  useFrame((state, delta) => {
    // Damp the raw scroll progress for buttery motion
    scrollState.smooth = THREE.MathUtils.damp(
      scrollState.smooth,
      scrollState.progress,
      3,
      delta
    );
    const p = scrollState.smooth;
    const cam = state.camera;

    // Dolly down the helix and orbit gently as the user scrolls
    const angle = p * Math.PI * 1.4;
    const radius = 8 - p * 2.5;
    cam.position.x = Math.sin(angle) * radius;
    cam.position.z = Math.cos(angle) * radius;
    cam.position.y = 6 - p * 12; // travel from top of helix to bottom

    // Subtle parallax from pointer
    cam.position.x += state.pointer.x * 0.6;
    cam.position.y += state.pointer.y * 0.4;

    cam.lookAt(0, 2 - p * 10, 0);
  });
  return null;
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 6, 8], fov: 60 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
    >
      <color attach="background" args={[INDIGO]} />
      <fog attach="fog" args={[INDIGO, 10, 30]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 6, 4]} intensity={40} color={GOLD} distance={30} />
      <pointLight position={[-6, -4, 2]} intensity={30} color={TEAL} distance={30} />
      <pointLight position={[6, 0, -4]} intensity={25} color={MAGENTA} distance={30} />

      <Nebula />
      <SacredGeometry />
      <VineHelix />

      <CameraRig />

      <EffectComposer>
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
