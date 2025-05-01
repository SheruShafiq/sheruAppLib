import { Button, Fade, Stack } from "@mui/material";
import React from "react";
import Logo from "../Components/Logo";
import { useNavigate } from "react-router-dom";
import ModelViewer from "../Components/ModelViewer";
import { Loader } from "@react-three/drei";

function Home() {
  const navigate = useNavigate();
  const [shouldDisplay, setShouldDisplay] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShouldDisplay(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {/* Background ModelViewer */}
      <Fade in={true} timeout={3000} mountOnEnter>
        <div
          style={{
            position: "absolute",
            transition: "opacity 0.5s ease-in-out",
            opacity: shouldDisplay ? 1 : 0,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 0,
          }}
        >
          {/* Drei’s global loader */}

          <ModelViewer url={"/3dModels/neonBG.glb"} />
        </div>
      </Fade>
      <div
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
          // zIndex: -1,
        }}
      >
        {/* Drei’s global loader */}
        <Loader
          containerStyles={{
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          dataStyles={{
            color: "#000",
          }}
          innerStyles={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          barStyles={{
            borderRadius: "6px",
            width: "20vw",
            boxShadow:
              " 0 0 0.1vw 1px #ffffff, 0 0 0.4rem 2px #da4983, 0 0 1rem 4px #ff0066",
          }}
          dataInterpolation={(p) => `Loading ${p.toFixed(2)}%`}
          initialState={(active) => active}
        />
      </div>
      {/* Foreground content */}
      <Stack
        minHeight={"100vh"}
        minWidth={"100vw"}
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
        zIndex={2} // Ensure content is above the background
      >
        <Logo logoName={"Sheru"} URL={"/"} />
        <Stack direction={"row"} gap={1}>
          <Button
            variant="outlined"
            onClick={() => navigate("/sheru/appLibrary/badgeMaker")}
          >
            Badge Maker{" "}
          </Button>
          <Button variant="outlined" onClick={() => navigate("/sauce")}>
            {" "}
            Sauce{" "}
          </Button>
          <Button variant="outlined" onClick={() => navigate("/cv")}>
            CV
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default Home;
