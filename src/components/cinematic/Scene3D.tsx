"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { scrollState } from "./scrollStore";

// Planet/earth maps: three.js examples (MIT) + threex.planets
// (textures by James Hastings-Trew / planetpixelemporium, free with credit)
const TEX = "/textures/planets";

const CORE = "#ffd9a0";
const MID = "#f0a830";
const ARM = "#5a3cb8";
const TEAL = "#20c9b0";
const VOID = "#000209";

const CAM_START = 14;
const CAM_TRAVEL = 106; // p=1 -> z = -92
const EARTH_Z = -98;

/* ------------------------------------------------------------------ *
 *  HD Milky Way panorama wrapping the whole journey
 * ------------------------------------------------------------------ */
function MilkyWaySkybox() {
  const map = useLoader(THREE.TextureLoader, `${TEX}/galaxy_starfield.png`);
  map.colorSpace = THREE.SRGBColorSpace;
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.0035;
  });
  return (
    <mesh ref={ref} position={[0, 0, -40]} rotation={[0.4, 0, 0.15]}>
      <sphereGeometry args={[320, 48, 48]} />
      <meshBasicMaterial map={map} side={THREE.BackSide} fog={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ *
 *  Galactic vortex — spiral arms forming the tunnel you fly down
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
      const t = Math.random();
      const z = zStart - t * depth;

      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const twist = t * Math.PI * 6;
      const armR = 5 + t * 12;

      const sign = () => (Math.random() < 0.5 ? 1 : -1);
      const jitter = Math.pow(Math.random(), 2.4) * sign() * armR * 0.35;
      const radius = armR * (0.55 + Math.random() * 0.45) + jitter;
      const angle = branchAngle + twist;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = z;

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

  useFrame((st) => {
    if (!ref.current) return;
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
 *  Real-texture planets along the descent
 * ------------------------------------------------------------------ */
type PlanetSpec = {
  texture: string;
  z: number;
  x: number;
  y: number;
  r: number;
  ring?: boolean;
  spin: number;
};

const PLANETS: PlanetSpec[] = [
  // Flying inward toward Earth: outermost planet first, Mars last.
  { texture: "neptunemap.jpg", z: -20, x: -6, y: 3, r: 1.5, spin: 0.1 },
  { texture: "uranusmap.jpg", z: -36, x: 7, y: -3, r: 1.7, spin: 0.12 },
  { texture: "saturnmap.jpg", z: -52, x: -8.5, y: 3.5, r: 2.2, ring: true, spin: 0.16 },
  { texture: "jupitermap.jpg", z: -68, x: 8.5, y: -3, r: 2.9, spin: 0.18 },
  { texture: "marsmap1k.jpg", z: -85, x: -5.5, y: 2.5, r: 1.1, spin: 0.12 },
];

function SaturnRings({ radius }: { radius: number }) {
  const colorMap = useLoader(THREE.TextureLoader, `${TEX}/saturnringcolor.jpg`);
  const alphaMap = useLoader(THREE.TextureLoader, `${TEX}/saturnringpattern.gif`);
  colorMap.colorSpace = THREE.SRGBColorSpace;

  // Remap ring UVs radially so the band texture wraps correctly
  const geometry = useMemo(() => {
    const inner = radius * 1.35;
    const outer = radius * 2.35;
    const geo = new THREE.RingGeometry(inner, outer, 96);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const u = (v.length() - inner) / (outer - inner);
      geo.attributes.uv.setXY(i, u, 1);
    }
    return geo;
  }, [radius]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2.15, 0.18, 0]}>
      <meshBasicMaterial
        map={colorMap}
        alphaMap={alphaMap}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Planet({ spec }: { spec: PlanetSpec }) {
  const map = useLoader(THREE.TextureLoader, `${TEX}/${spec.texture}`);
  map.colorSpace = THREE.SRGBColorSpace;
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * spec.spin;
  });
  return (
    <group position={[spec.x, spec.y, spec.z]}>
      <mesh ref={ref} rotation={[0.1, 0, 0.05]}>
        <sphereGeometry args={[spec.r, 64, 64]} />
        <meshStandardMaterial map={map} roughness={0.9} metalness={0} />
      </mesh>
      {spec.ring && <SaturnRings radius={spec.r} />}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 *  Earth — real NASA-derived maps with clouds, terrain relief and
 *  ocean specular highlights, plus the Moon
 * ------------------------------------------------------------------ */
function Earth() {
  const [dayMap, normalMap, specularMap, cloudsMap, moonMap] = useLoader(
    THREE.TextureLoader,
    [
      `${TEX}/earth_atmos_2048.jpg`,
      `${TEX}/earth_normal_2048.jpg`,
      `${TEX}/earth_specular_2048.jpg`,
      `${TEX}/earth_clouds_1024.png`,
      `${TEX}/moon_1024.jpg`,
    ]
  );
  dayMap.colorSpace = THREE.SRGBColorSpace;
  moonMap.colorSpace = THREE.SRGBColorSpace;

  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Group>(null);

  useFrame((st, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.05;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.065;
    if (moonRef.current)
      moonRef.current.rotation.y = st.clock.elapsedTime * 0.12;
  });

  return (
    <group position={[0, 0, EARTH_Z]}>
      {/* Earth surface */}
      <mesh ref={earthRef} rotation={[0.41, 0, 0]}>
        <sphereGeometry args={[3, 96, 96]} />
        <meshPhongMaterial
          map={dayMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          specularMap={specularMap}
          specular={new THREE.Color("#334155")}
          shininess={18}
        />
      </mesh>
      {/* Cloud layer */}
      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshLambertMaterial
          map={cloudsMap}
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>
      {/* Atmosphere rim glow */}
      <mesh scale={1.1}>
        <sphereGeometry args={[3, 48, 48]} />
        <meshBasicMaterial
          color="#4aa3ff"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Moon */}
      <group ref={moonRef}>
        <mesh position={[7.5, 1.2, 0]}>
          <sphereGeometry args={[0.8, 48, 48]} />
          <meshStandardMaterial map={moonMap} roughness={1} metalness={0} />
        </mesh>
      </group>
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

    const targetZ = CAM_START - p * CAM_TRAVEL;
    const wobble = 1 - p;
    const targetX = Math.sin(p * Math.PI * 4) * 3 * wobble + st.pointer.x * 1.2;
    const targetY =
      Math.cos(p * Math.PI * 4) * 2 * wobble + st.pointer.y * 0.8;

    cam.position.x += (targetX - cam.position.x) * 0.06;
    cam.position.y += (targetY - cam.position.y) * 0.06;
    cam.position.z += (targetZ - cam.position.z) * 0.08;

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
      <fog attach="fog" args={[VOID, 14, 90]} />

      <ambientLight intensity={0.32} />
      {/* Sun lighting Earth and the deep planets */}
      <directionalLight
        position={[30, 18, EARTH_Z + 30]}
        intensity={2.6}
        color="#fff3da"
      />
      <pointLight position={[0, 0, 6]} intensity={4} color={CORE} distance={30} />

      <Suspense fallback={null}>
        <MilkyWaySkybox />
        <GalaxyVortex />
        {PLANETS.map((p) => (
          <Planet key={p.texture} spec={p} />
        ))}
        <Earth />
      </Suspense>

      <FlightRig />

      <EffectComposer>
        <Bloom
          intensity={1.0}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.2} darkness={0.92} />
      </EffectComposer>
    </Canvas>
  );
}
