import React from "react";
import { Box, Button, Fade, IconButton, Stack } from "@mui/material";
import { TextGlitchEffect } from "./TextGlitchEffect";
import AddIcon from "@mui/icons-material/Add";

import SauceLogo from "./SauceLogo";

function Header({
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  setIsCreatePostModalOpen,
}) {
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
            <SauceLogo />
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
          <SauceLogo />
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
