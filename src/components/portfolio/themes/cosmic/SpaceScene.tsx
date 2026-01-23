import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Trail } from "@react-three/drei";
import * as THREE from "three";

// Planet component with realistic materials
function Planet({ 
  position, 
  size, 
  color, 
  speed = 1, 
  orbitRadius,
  hasRing = false,
  ringColor = "#fbbf24"
}: { 
  position: [number, number, number];
  size: number;
  color: string;
  speed?: number;
  orbitRadius: number;
  hasRing?: boolean;
  ringColor?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const angle = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
    if (groupRef.current) {
      angle.current += delta * speed * 0.1;
      groupRef.current.position.x = Math.cos(angle.current) * orbitRadius;
      groupRef.current.position.z = Math.sin(angle.current) * orbitRadius;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Trail
          width={1}
          length={8}
          color={color}
          attenuation={(t) => t * t}
        >
          <mesh ref={meshRef}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial
              color={color}
              roughness={0.4}
              metalness={0.3}
              emissive={color}
              emissiveIntensity={0.1}
            />
          </mesh>
        </Trail>
        {hasRing && (
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 2, 64]} />
            <meshStandardMaterial
              color={ringColor}
              side={THREE.DoubleSide}
              transparent
              opacity={0.6}
            />
          </mesh>
        )}
      </Float>
    </group>
  );
}

// Orbit ring visual
function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Animated sun with glow
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  return (
    <group>
      {/* Inner sun */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f97316"
          emissiveIntensity={2}
          roughness={0.2}
        />
      </mesh>
      {/* Outer glow */}
      <mesh ref={glowRef} scale={1.3}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.15} />
      </mesh>
      {/* Corona effect */}
      <pointLight color="#fbbf24" intensity={50} distance={30} decay={2} />
    </group>
  );
}

// Nebula clouds
function Nebula() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 15 + Math.random() * 20;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const colorOptions = [
      new THREE.Color("#a855f7"),
      new THREE.Color("#ec4899"),
      new THREE.Color("#06b6d4"),
      new THREE.Color("#f97316"),
    ];
    for (let i = 0; i < count; i++) {
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return cols;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Mouse parallax camera controller
function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    camera.position.x += (mouse.current.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (mouse.current.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  // Update mouse position
  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  return null;
}

// Shooting star component
function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  const startPos = useMemo(() => ({
    x: -20 + Math.random() * 10,
    y: 10 + Math.random() * 5,
    z: -5 + Math.random() * 10,
  }), []);
  
  useFrame((state) => {
    if (ref.current) {
      const t = (state.clock.elapsedTime % 8) / 2;
      if (t < 1) {
        ref.current.visible = true;
        ref.current.position.x = startPos.x + t * 40;
        ref.current.position.y = startPos.y - t * 15;
        ref.current.position.z = startPos.z;
      } else {
        ref.current.visible = false;
      }
    }
  });

  return (
    <Trail
      width={0.5}
      length={12}
      color="#ffffff"
      attenuation={(t) => t * t}
    >
      <mesh ref={ref}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </Trail>
  );
}

// Main scene content
function SceneContent() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Nebula effect */}
      <Nebula />

      {/* Central Sun */}
      <Sun />

      {/* Orbit rings */}
      <OrbitRing radius={3} />
      <OrbitRing radius={5} />
      <OrbitRing radius={7.5} />
      <OrbitRing radius={10} />

      {/* Planets */}
      <Planet
        position={[3, 0, 0]}
        size={0.3}
        color="#ef4444"
        speed={2}
        orbitRadius={3}
      />
      <Planet
        position={[5, 0, 0]}
        size={0.4}
        color="#3b82f6"
        speed={1.5}
        orbitRadius={5}
      />
      <Planet
        position={[7.5, 0, 0]}
        size={0.6}
        color="#fbbf24"
        speed={0.8}
        orbitRadius={7.5}
        hasRing
        ringColor="#fde68a"
      />
      <Planet
        position={[10, 0, 0]}
        size={0.35}
        color="#10b981"
        speed={0.5}
        orbitRadius={10}
      />

      {/* Shooting stars */}
      <ShootingStar />

      {/* Camera controller for mouse parallax */}
      <CameraController />
    </>
  );
}

// Main export component
export default function SpaceScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
