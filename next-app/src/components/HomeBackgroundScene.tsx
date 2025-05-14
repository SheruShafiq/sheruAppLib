"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Fade } from "@mui/material";
import { CSSProperties } from "react";

// Use dynamic import with SSR disabled for ThreeJS components
const CyberpunkStoreFront = dynamic(
  () => import("@/components/3D/CyberpunkStoreFront"),
  { ssr: false, loading: () => <div>Loading 3D scene...</div> }
);

export default function HomeBackgroundScene() {
  // Use client-side only rendering to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Define consistent styles to avoid hydration mismatch
  const containerStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 0,
  };

  // Return the exact same DOM structure whether mounted or not
  // This ensures hydration matches
  return (
    <div style={containerStyle}>
      {isMounted ? (
        <Fade in={true} timeout={3000}>
          <div style={{ width: "100%", height: "100%" }}>
            <CyberpunkStoreFront />
          </div>
        </Fade>
      ) : null}
    </div>
  );
}
