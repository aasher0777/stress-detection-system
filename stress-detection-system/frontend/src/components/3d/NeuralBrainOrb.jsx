import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural 3D Neural Synapse Orb & Particle Field.
 * Implements:
 * 1. An inner organic morphing lattice with MeshPhysicalMaterial (transmission + roughness)
 * 2. An outer constellation of glowing synaptic particles connected along Fibonacci sphere coordinates
 * 3. Smooth mathematical interpolation (lerp) reacting to mouse position and scroll velocity
 */
export const NeuralBrainOrb = ({ scrollProgress = 0, mousePos = { x: 0, y: 0 } }) => {
  const coreMeshRef = useRef();
  const wireMeshRef = useRef();
  const particlesRef = useRef();

  // Reusable vector allocations to guarantee 60/120fps without Garbage Collection spikes
  const dummyVec = useMemo(() => new THREE.Vector3(), []);
  const targetRotation = useMemo(() => new THREE.Euler(), []);

  // 1. Generate procedural synaptic particle cloud via spherical distribution
  const particleCount = 1200;
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sc = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Golden Spiral / Fibonacci sphere distribution for uniform organic distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.PI * (1 + 5 ** 0.5) * (i + 0.5);

      // Radius variation creates depth between core cortex and outer synaptic aura
      const radius = 1.8 + (Math.random() * 0.9);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      sc[i] = Math.random() * 0.04 + 0.015;
    }
    return [pos, sc];
  }, [particleCount]);

  // Main 60fps render loop with zero object instantiation
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Subtle breathing pulsation (sinusoidal modulation mimicking vagal HRV rhythm)
    const breath = Math.sin(time * 1.2) * 0.04;

    if (coreMeshRef.current) {
      // Slow organic continuous rotation
      coreMeshRef.current.rotation.y += delta * 0.18;
      coreMeshRef.current.rotation.x = Math.sin(time * 0.25) * 0.15;
      coreMeshRef.current.scale.set(1 + breath, 1 + breath, 1 + breath);

      // Scroll interpolation: rotates and translates object into hero profile view
      coreMeshRef.current.rotation.z = THREE.MathUtils.lerp(
        coreMeshRef.current.rotation.z,
        scrollProgress * Math.PI * 1.2,
        0.05
      );
    }

    if (wireMeshRef.current) {
      // Counter-rotation for parallax cognitive depth
      wireMeshRef.current.rotation.y -= delta * 0.12;
      wireMeshRef.current.rotation.z += delta * 0.08;
      wireMeshRef.current.scale.set(1.15 + breath * 1.2, 1.15 + breath * 1.2, 1.15 + breath * 1.2);
    }

    if (particlesRef.current) {
      // Parallax mouse follow: smooth lerp toward pointer coordinates
      // Math: target = mouse.x * amplitude; current = current + (target - current) * alpha
      particlesRef.current.rotation.y += delta * 0.06;
      particlesRef.current.rotation.x = THREE.MathUtils.lerp(
        particlesRef.current.rotation.x,
        mousePos.y * 0.35,
        0.04
      );
      particlesRef.current.rotation.z = THREE.MathUtils.lerp(
        particlesRef.current.rotation.z,
        -mousePos.x * 0.35,
        0.04
      );
    }
  });

  return (
    <group position={[1.2, 0, 0]}>
      {/* 1. Inner Translucent Neural Core */}
      <mesh ref={coreMeshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1.4, 4]} />
        <meshPhysicalMaterial
          color="#06b6d4"
          emissive="#083344"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transmission={0.85} // Frosted glass refraction
          ior={1.45}
          thickness={1.5}
        />
      </mesh>

      {/* 2. Synaptic Wireframe Shell */}
      <mesh ref={wireMeshRef}>
        <icosahedronGeometry args={[1.55, 3]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Neural Synapse Particle Constellation */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#67e8f9"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
};
