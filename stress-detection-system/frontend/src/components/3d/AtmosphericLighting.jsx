import React from 'react';

/**
 * Cinematic cyan-teal atmospheric lighting mimicking the Amaterasu.ai aesthetic.
 * Combines high-contrast directional rim lights, subtle ambient fill,
 * and colored point lights to sculpt the 3D neural geometry.
 */
export const AtmosphericLighting = () => {
  return (
    <>
      {/* Deep ambient fill to prevent pitch black shadow clipping */}
      <ambientLight intensity={0.35} color="#082026" />

      {/* Main cyan-teal volumetric key light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.2}
        color="#22d3ee"
        castShadow
      />

      {/* Deep aqua rim backlight for high-contrast silhouette sculpting */}
      <directionalLight
        position={[-6, 3, -6]}
        intensity={3.5}
        color="#06b6d4"
      />

      {/* Soft warm indigo accent light from below to enrich deep shadows */}
      <pointLight
        position={[0, -5, 2]}
        intensity={1.2}
        color="#6366f1"
        distance={15}
      />

      {/* Central pulsating core glow light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={1.8}
        color="#38bdf8"
        distance={8}
      />
    </>
  );
};
