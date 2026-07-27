"use client";

import ParticleCube from "@/components/particle-cube";

export function CosmicBackground() {
  return (
    <div className="cosmic-background" aria-hidden="true">
      <div className="particle-cube-wrap">
        <ParticleCube
          color="#71A8F8"
          cubeGrid={3}
          dotsPerFace={4}
          dotSize={2}
          sizePercent={118}
        />
      </div>
      <div className="cosmic-grid" />
      <div className="noise-layer" />
    </div>
  );
}
