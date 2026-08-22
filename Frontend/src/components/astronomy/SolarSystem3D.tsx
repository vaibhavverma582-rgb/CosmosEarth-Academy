"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Html,
  Float,
  Trail,
  useTexture,
} from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { planets } from "@/data/planets";

// ─── Sun Component ─────────────────────────────
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group>
      {/* Sun core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Sun glow */}
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial color="#FDB813" transparent opacity={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.05} />
      </mesh>
      <pointLight
        ref={glowRef}
        color="#FDB813"
        intensity={3}
        distance={100}
        decay={2}
      />
    </group>
  );
}

// ─── Planet Component ──────────────────────────
interface PlanetProps {
  planet: (typeof planets)[number];
  onClick: () => void;
}

function Planet({ planet, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const scaledSize = planet.size * 0.4;
  const scaledOrbit = planet.orbitRadius * 1.2;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        clock.getElapsedTime() * planet.orbitSpeed * 0.3;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed * 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[scaledOrbit - 0.02, scaledOrbit + 0.02, 128]} />
        <meshBasicMaterial color={planet.color} transparent opacity={0.15} />
      </mesh>

      {/* Planet */}
      <Trail
        width={0.5}
        length={6}
        color={planet.color}
        attenuation={(t) => t * t}
      >
        <group>
          <mesh
            ref={meshRef}
            position={[
              Math.cos(0) * scaledOrbit,
              0,
              Math.sin(0) * scaledOrbit,
            ]}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(true);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHovered(false);
              document.body.style.cursor = "auto";
            }}
          >
            <sphereGeometry args={[scaledSize, 32, 32]} />
            <meshStandardMaterial
              color={planet.color}
              emissive={planet.emissive || planet.color}
              emissiveIntensity={hovered ? 0.5 : 0.2}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>

          {/* Hover glow */}
          {hovered && (
            <mesh
              position={[
                Math.cos(0) * scaledOrbit,
                0,
                Math.sin(0) * scaledOrbit,
              ]}
            >
              <sphereGeometry args={[scaledSize + 0.15, 32, 32]} />
              <meshBasicMaterial
                color={planet.color}
                transparent
                opacity={0.2}
              />
            </mesh>
          )}

          {/* Rings for Saturn */}
          {planet.rings && (
            <mesh
              position={[
                Math.cos(0) * scaledOrbit,
                0,
                Math.sin(0) * scaledOrbit,
              ]}
              rotation={[Math.PI / 2.5, 0, 0]}
            >
              <ringGeometry args={[scaledSize * 1.3, scaledSize * 2.0, 64]} />
              <meshBasicMaterial
                color={planet.ringColor || "#e8c36a"}
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Label */}
          {hovered && (
            <Html
              position={[
                Math.cos(0) * scaledOrbit,
                scaledSize + 0.5,
                Math.sin(0) * scaledOrbit,
              ]}
              center
              distanceFactor={15}
            >
              <div className="glass-card rounded-lg px-3 py-1.5 text-center whitespace-nowrap">
                <p className="text-sm font-bold text-white">{planet.name}</p>
                <p className="text-[10px] text-white/50">
                  {planet.distanceFromSun} AU
                </p>
              </div>
            </Html>
          )}
        </group>
      </Trail>
    </group>
  );
}

// ─── Scene ─────────────────────────────────────
function Scene() {
  const router = useRouter();

  return (
    <>
      <ambientLight intensity={0.1} />
      <Sun />

      {planets.map((planet) => (
        <Planet
          key={planet.slug}
          planet={planet}
          onClick={() => router.push(`/astronomy/planets/${planet.slug}`)}
        />
      ))}

      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={5}
        maxDistance={60}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  );
}

// ─── Loading fallback ──────────────────────────
function LoadingFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cosmos-cyan border-t-transparent" />
        <p className="mt-3 text-sm text-white/50">Loading solar system...</p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────
export function SolarSystem3D() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl border border-white/10 bg-cosmos-navy sm:h-[600px] lg:h-[700px]">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 15, 30], fov: 50 }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      {/* Overlay instructions */}
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <div className="glass-card rounded-lg px-3 py-2 text-xs text-white/50">
          🖱️ Drag to rotate · Scroll to zoom · Click planet to explore
        </div>
        <div className="glass-card rounded-lg px-3 py-2 text-xs text-white/50">
          🌌 {planets.length} planets
        </div>
      </div>
    </div>
  );
}
