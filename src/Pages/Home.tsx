import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import Logo from "../Components/Logo";
import { useNavigate } from "react-router-dom";
import ModelViewer from "../Components/ModelViewer";
import { Loader } from "@react-three/drei";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* Background ModelViewer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      >
        <ModelViewer url={"/3dModels/neonBG.glb"} />
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

      {/* Drei’s global loader */}
      <Loader />
    </>
  );
}

export default Home;
