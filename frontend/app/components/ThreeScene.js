"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float, PerspectiveCamera } from "@react-three/drei";
import { useState, useRef } from "react";
import * as random from "maath/random/dist/maath-random.esm";

function ParticleField(props) {
  const ref = useRef();
  // 5000 particles generate ho rahe hain ek sphere ke andar
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    // Particles dhere-dheere ghumenge
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
    
    // Mouse movement ka halka sa asar (Reaction)
    const mouseX = state.mouse.x * 0.2;
    const mouseY = state.mouse.y * 0.2;
    ref.current.rotation.x += mouseY * 0.05;
    ref.current.rotation.y += mouseX * 0.05;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#6366f1" // Indigo Color
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          blending={2} // Additive blending for glow
        />
      </Points>
    </group>
  );
}

export default function ThreeScene() {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <PerspectiveCamera makeDefault position={[0, 0, 1]} fov={75} />
        <ambientLight intensity={0.5} />
        
        {/* Particle System */}
        <ParticleField />
        
        {/* Ek aur Layer Pink Particles ki depth ke liye */}
        <group scale={1.5}>
          <ParticleField color="#ec4899" size={0.003} />
        </group>
      </Canvas>
    </div>
  );
}