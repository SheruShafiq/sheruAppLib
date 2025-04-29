import { Button, Stack } from "@mui/material";
import React from "react";
import Logo from "../Components/Logo";
import { useNavigate } from "react-router-dom";
import ModelViewer from "../Components/ModelViewer";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Stack
        minHeight={"100vh"}
        minWidth={"100vw"}
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
      >
        <Logo logoName={"Sheru"} URL={"/"} />
        <ModelViewer url={"../../3dModels/table.glb"} />

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
