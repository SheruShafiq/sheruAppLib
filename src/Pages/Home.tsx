import { Button, Fade, Stack } from "@mui/material";
import { lazy, Suspense, useState, useEffect } from "react";
import Logo from "../Components/Logo";
import { useNavigate } from "react-router-dom";
const CyberpunkStoreFront = lazy(
  () => import("../Components/3D Renderers/CyberpunkStoreFront")
);
import { Loader } from "@react-three/drei";
import IOSLoader from "../Components/IOSLoader";

function Home() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [shouldDisplay, setShouldDisplay] = useState(false);
  useEffect(() => {
    const handle = (window as any).requestIdleCallback
      ? (window as any).requestIdleCallback(() => setReady(true))
      : window.setTimeout(() => setReady(true), 200);
    const timer = setTimeout(() => {
      setShouldDisplay(true);
    }, 2000);
    return () => {
      if ((window as any).cancelIdleCallback) {
        (window as any).cancelIdleCallback(handle);
      } else {
        clearTimeout(handle as number);
        clearTimeout(timer as number);
      }
    };
  }, []);
  return (
    <>
      <div
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          top: "52%",
          left: "50%",
        }}
      >
        
        <Loader
          containerStyles={{
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          dataStyles={{
            color: "#000",
            visibility: "hidden",
          }}
          innerStyles={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          barStyles={{
            borderRadius: "12px",
            width: "20vw",
            boxShadow:
              " 0 0 0.1vw 1px #ffffff, 0 0 0.4rem 2px #da4983, 0 0 1rem 4px #ff0066",
          }}
          dataInterpolation={(p) => `Loading ${p.toFixed(2)}%`}
          initialState={(active) => active}
        />
      </div>
      <Suspense fallback={<IOSLoader />}>
        
        <Fade in={true} timeout={3000} mountOnEnter>
          <div
            style={{
              position: "absolute",
              transition: "opacity 2s ease-in-out",
              opacity: shouldDisplay ? 1 : 0,
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 0,
            }}
          >
            

            <CyberpunkStoreFront />
            
          </div>
        </Fade>
      </Suspense>
      
      <Stack
        minHeight={"100vh"}
        minWidth={"100vw"}
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
        zIndex={2} 
      >
        <Logo
          logoName={"Sheru"}
          URL={"/"}
          additionalClassName={"homePageTitleDrop"}
        />
        <Stack direction={"row"} gap={1}>
          <Button
            size="large"
            variant="outlined"
            onClick={() => navigate("/sheru/appLibrary/badgeMaker")}
          >
            Badge Maker{" "}
          </Button>
          
          <Button
            size="large"
            variant="outlined"
            onClick={() => navigate("/sauce")}
          >
            {" "}
            Sauce{" "}
          </Button>
          <Button
            size="large"
            variant="outlined"
            onClick={() => navigate("/cv")}
          >
            CV
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default Home;
