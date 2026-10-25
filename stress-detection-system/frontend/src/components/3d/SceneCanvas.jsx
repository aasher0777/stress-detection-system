import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Ambient Atmospheric WebGL Canvas
 * - Solid circular sphere and wireframe ball removed per user design instruction.
 * - Leaves the face clean and unobstructed as the hero centerpiece (matching Amaterasu).
 * - Implements subtle floating stardust particles and cinematic teal/cyan volumetric lighting.
 * - Hardware DPR capped to [1, 2] for 60fps/120fps performance.
 */
export const SceneCanvas = ({ scrollProgress = 0, mousePos = { x: 0, y: 0 } }) => {
  const canvasRef = useRef(null);
  const stateRef = useRef({ scrollProgress: 0, mouseX: 0, mouseY: 0 });

  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress;
    stateRef.current.mouseX = mousePos.x;
    stateRef.current.mouseY = mousePos.y;
  }, [scrollProgress, mousePos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Cinematic Atmospheric Lighting (Amaterasu Teal / Cyan Palette)
    const ambientLight = new THREE.AmbientLight(0x041820, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x22d3ee, 2.5);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x0891b2, 3.8);
    rimLight.position.set(-6, 3, -5);
    scene.add(rimLight);

    // 4. Subtle, Non-Obtrusive Ambient Atmospheric Particles
    // Spaced across wide 3D space to gently float without obscuring face or text
    const particleCount = 450;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 14;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 10;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.024,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Render Loop with Smooth Lerp Parallax
    let animationFrameId;
    let clock = new THREE.Clock();

    const render = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Gentle continuous drift
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = Math.sin(elapsed * 0.05) * 0.05;

      // Parallax mouse follow: smooth lerp
      const targetX = stateRef.current.mouseX * 0.2;
      const targetY = stateRef.current.mouseY * 0.2;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);

      // Scroll response
      camera.position.z = 5 + stateRef.current.scrollProgress * 1.5;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // 6. Responsive Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 block"
    />
  );
};
