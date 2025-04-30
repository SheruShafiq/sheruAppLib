// src/Components/ModelViewer.tsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, Preload } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

type ModelProps = { url: string };

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  scene.rotation.y = Math.PI; // Rotate the model 180 degrees
  scene.position.x = -0.5; // Adjust the horizontal position of the model
  scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2); // Rotate the model 90 degrees around the Y-axis

  return <primitive object={scene} scale={[10, 10, 10]} />;
}

export default function ModelViewer({ url }: ModelProps) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{
        fov: 100,
        position: [101.98700844028129, 8.824833678051316, 124.91157525205487], // Default camera position
        zoom: 7, // Default zoom value
        near: 0.1,
        far: 1000,
        rotation: [
          -0.07053267623317762, 0.683492537059501, 0.04458617161965562,
        ], // Default camera rotation
      }}
      gl={{ antialias: true }}
      onCreated={({ gl, camera }) => {
        // enable physical light model
        gl.physicallyCorrectLights = true;
        // use ACES Filmic tone mapping
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        // output in sRGB color space — cast to any to dodge the missing‐types error
        (gl as any).outputEncoding = THREE.sRGBEncoding;

        // Set the default target for the camera
        camera.lookAt(0, 0, 0);
      }}
    >
      <Suspense fallback={null}>
        <Stage
          preset="rembrandt"
          intensity={1.2}
          environment="city"
          shadows={false}
        >
          <Model url={url} />
        </Stage>
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false} // Disable zoom
        autoRotate={false}
        target={[0, 0, 0]} // Default target
        minAzimuthAngle={-Math.PI / 18} // Restrict horizontal movement to 10 degrees
        maxAzimuthAngle={Math.PI / 18 + 1}
        minPolarAngle={Math.PI / 2 - Math.PI / 18} // Restrict vertical movement to 10 degrees
        maxPolarAngle={Math.PI / 2 + Math.PI / 200}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={0.3}
          intensity={0.8}
          mipmapBlur
        />
      </EffectComposer>

      {/* ensure all assets (HDR, textures, GLTF) are registered with the default manager */}
      <Preload all />
    </Canvas>
  );
}
