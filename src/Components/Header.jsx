import React from "react";
import { Box, Button, Fade, Stack } from "@mui/material";
import { TextGlitchEffect } from "./TextGlitchEffect";

function Header({ isLoggedIn, userData, setOpen, setIsLoggedIn }) {
  return (
    <Box sx={{ position: "relative", minHeight: "3rem" }}>
      <Fade in={isLoggedIn} timeout={1000}>
        <Box sx={{ position: "absolute", width: "100%" }}>
          <Stack flexDirection={"row"} alignItems={"center"}>
            <TextGlitchEffect
              text={userData?.displayName}
              speed={40}
              letterCase="lowercase"
              includeSpecialChars
            />
            <Button
              onClick={() => {
                document.cookie = "userID=; path=/;";
                console.log("Logged out");
                setIsLoggedIn(false);
              }}
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </Fade>
      <Fade in={!isLoggedIn} timeout={1000}>
        <Box sx={{ position: "absolute", width: "100%" }}>
          <Button
            onClick={() => {
              setOpen(true);
            }}
            sx={{
              width: "fit-content",
            }}
          >
            Log In
          </Button>
        </Box>
      </Fade>
    </Box>
  );
}

export default Header;
