import React from "react";
import { Box, Button, Fade, IconButton, Stack } from "@mui/material";
import { TextGlitchEffect } from "./TextGlitchEffect";
import AddIcon from "@mui/icons-material/Add";
import { useGlitch } from "react-powerglitch";

function Header({
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  setIsCreatePostModalOpen,
}) {
  const glitch = useGlitch({
    timing: {
      iterations: 1,
      easing: "ease-in-out",
      duration: 1000,
    },
    glitchTimeSpan: {
      start: 0,
      end: 0.5,
    },
    playMode: "hover",
  });
  return (
    <Box sx={{ position: "relative", minHeight: "3rem" }} mt={0.5}>
      <Fade in={isLoggedIn} timeout={1000}>
        <Box
          sx={{
            display: isLoggedIn ? "block" : "none",
          }}
          width={"100%"}
        >
          <Stack
            flexDirection={"row"}
            alignItems={"center"}
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
              {userData?.displayName && (
                <TextGlitchEffect
                  text={userData?.displayName}
                  speed={40}
                  letterCase="lowercase"
                  className="loggedInUserName"
                  type="alphanumeric"
                />
              )}
              <Button
                variant="outlined"
                onClick={() => {
                  document.cookie = "userID=; path=/;";
                  setIsLoggedIn(false);
                }}
              >
                Logout
              </Button>
            </Stack>
            <Box
              sx={{
                minWidth: "90px",
                justifyItems: "center",
              }}
              ref={glitch?.ref}
            >
              <TextGlitchEffect
                text={"Sauce"}
                speed={100}
                letterCase="lowercase"
                className="neonText HeaderLogo"
                type="alphanumeric"
              />
            </Box>
            <IconButton
              variant="outlined"
              onClick={() => {
                setIsCreatePostModalOpen(true);
              }}
            >
              <AddIcon />
            </IconButton>
          </Stack>
        </Box>
      </Fade>

      <Fade in={!isLoggedIn} timeout={1000}>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
          sx={{
            display: isLoggedIn ? "none" : "flex",
          }}
        >
          <Box
            sx={{
              minWidth: "90px",
            }}
          >
            <Button
              onClick={() => {
                setOpen(true);
              }}
              sx={{
                width: "fit-content",
              }}
            >
              Login
            </Button>
          </Box>
          <Box
            sx={{
              minWidth: "90px",
              justifyItems: "center",
            }}
            ref={glitch?.ref}
          >
            <TextGlitchEffect
              text={"Sauce"}
              speed={100}
              letterCase="lowercase"
              className="neonText HeaderLogo"
              type="alphanumeric"
            />
          </Box>

          <Box
            sx={{
              visibility: "hidden",
              minWidth: "90px",
            }}
          >
            LogOut
          </Box>
        </Stack>
      </Fade>
    </Box>
  );
}

export default Header;
