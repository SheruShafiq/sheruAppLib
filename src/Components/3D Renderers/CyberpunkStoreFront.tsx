// src/Components/ModelViewer.tsx
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Button3D from "../3D Objects/Button";
import {
  OrbitControls,
  Stage,
  useGLTF,
  Preload,
  Stars,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { Root } from "@react-three/uikit/dist/root";
import { Text } from "@react-three/uikit/dist/Text";
import { Content } from "@react-three/uikit/dist/content";
import { Container } from "@react-three/uikit/dist/container";

type CyberpunkStoreFrontProps = { url?: string };
function Model({ url = "/3dModels/neonBG.glb" }: CyberpunkStoreFrontProps) {
  const { scene } = useGLTF(url);
  scene.rotation.y = Math.PI; // Rotate the model 180 degrees
  scene.position.x = -0.5; // Adjust the horizontal position of the model
  scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2); // Rotate the model 90 degrees around the Y-axis

  return <primitive object={scene} scale={[10, 10, 10]} />;
}

export default function CyberpunkStoreFront({ url }: CyberpunkStoreFrontProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };
  const isDesktop = window.innerWidth > 768; // Check if the device is desktop
  const zoom = isDesktop ? 7 : 12; // Set zoom level based on device type
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{
          fov: 100,
          position: [101.98700844028129, 8.824833678051316, 124.91157525205487], // Default camera position
          zoom: zoom,
          near: 0.1,
          far: 1000,
          rotation: [
            -0.07053267623317762, 0.683492537059501, 0.04458617161965562,
          ], // Default camera rotation
        }}
        gl={{ antialias: true }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          camera.lookAt(0, 0, 0);
        }}
      >
        <Suspense fallback={null}>
          <Stage
            preset="soft"
            intensity={1}
            environment="night"
            shadows={false}
          >
            <Model url={url} />
          </Stage>
          {/* night skybox with stars */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        </Suspense>

        {/* <Root anchorY={"top"}>
          <Container backgroundColor="red">
            <Text fontSize={100} fontWeight="bold">
              Hello World!
            </Text>
            <Content width={100} height={100} position={[0, 0, 0]}>
              <Button3D position={[1.2, 8, 0]} />
            </Content>
          </Container>
        </Root> */}

        <OrbitControls
          enablePan={false}
          enableZoom={false} // Disable zoom
          autoRotate={true}
          target={[0, 0, 0]} // Default target
          autoRotateSpeed={0.1} // Adjust the speed of auto-rotation
          enableDamping={true} // Enable damping (inertia) for smoother movement
          rotateSpeed={0.5} // Adjust the rotation speed
          minAzimuthAngle={-Math.PI / 18} // Restrict horizontal movement to 10 degrees
          maxAzimuthAngle={Math.PI / 18 + 1}
          minPolarAngle={Math.PI / 2 - Math.PI / 18} // Restrict vertical movement to 10 degrees
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

        {/* ensure all assets (HDR, textures, GLTF) are registered with the default manager */}
        <Preload all />
      </Canvas>
    </div>
  );
}
