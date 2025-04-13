import { Avatar, Stack, Typography, Box } from "@mui/material"; // added Box import
import React from "react";
import giphyCredits from "../assets/giphyCredits.gif";
import MUIicon from "../assets/muiIcon.svg";
import SheruPFP from "../assets/sheruPFP.jpeg";
import { Link } from "react-router-dom";
import { useGlitch } from "react-powerglitch";
import { TextGlitchEffect } from "./TextGlitchEffect";

function Footer() {
  const isDesktop = window.innerWidth > 768;
  const glitch = useGlitch({
    timing: {
      iterations: 1,
      easing: "ease-in-out",
      duration: 2000,
    },
    glitchTimeSpan: {
      start: 0,
      end: 0.4,
    },
    playMode: "hover",
  });
  return (
    <Stack px={2} mt={"auto"} direction={"row"} alignItems="center">
      <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
        <img
          style={{ width: "200px" }}
          src={giphyCredits}
          alt="Giphy Credits"
        />
      </Box>
      <Stack
        direction={"row"}
        alignContent={"center"}
        sx={{
          position: "static",
          left: "auto",
          transform: "none",
        }}
        ref={glitch.ref}
      >
        <Avatar
          alt="Giphy Credits"
          src={SheruPFP}
          sx={{ width: 30, height: 30, marginRight: 1 }}
        />
        <Stack>
          <Link
            to="https://github.com/SheruShafiq"
            target="_blank"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <TextGlitchEffect
              text="Sheru Shafiq"
              speed={40}
              letterCase="lowercase"
              className={"footerDevName"}
            />
          </Link>

          <TextGlitchEffect
            text="A passion project"
            speed={40}
            letterCase="lowercase"
            className={"footerDevDesc"}
          />
        </Stack>
      </Stack>
      {isDesktop && (
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <img style={{ width: "100px" }} src={MUIicon} alt="MUI Icon" />
        </Box>
      )}
    </Stack>
  );
}

export default Footer;
