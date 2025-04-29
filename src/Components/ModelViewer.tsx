import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={[5, 5, 5]} />;
}

export default function ModelViewer({ url }: { url: string }) {
  return (
    <Canvas style={{ width: "100%", height: 500 }}>
      <ambientLight />
      <pointLight position={[0, 6, -10]} intensity={200} />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
