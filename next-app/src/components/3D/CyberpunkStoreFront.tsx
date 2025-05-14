'use client';

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useGLTF,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

type CyberpunkStoreFrontProps = { url?: string };

function Model({ url = "/3dModels/neonBG.glb" }: CyberpunkStoreFrontProps) {
  const { scene } = useGLTF(url);
  
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

export default function CyberpunkStoreFront({ url }: CyberpunkStoreFrontProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
      <Canvas
        shadows
        camera={{ position: [0, 1, 5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
        style={{ background: 'black' }}
      >
        <Suspense fallback={null}>
          <Model url={url} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={true}
          target={[0, 0, 0]}
          autoRotateSpeed={0.1}
          enableDamping={true}
          rotateSpeed={0.5}
          minAzimuthAngle={-Math.PI / 18}
          maxAzimuthAngle={Math.PI / 18 + 1}
          minPolarAngle={Math.PI / 2 - Math.PI / 18}
          maxPolarAngle={Math.PI / 2 + Math.PI / 200}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={0}
            intensity={1}
            mipmapBlur
          />
        </EffectComposer>

        <Preload all />
      </Canvas>
    </div>
  );
}
