import React from "react";
import { Box, Button, Fade, IconButton, Stack } from "@mui/material";
import { TextGlitchEffect } from "./TextGlitchEffect";
import AddIcon from "@mui/icons-material/Add";
function Header({
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  setIsCreatePostModalOpen,
}) {
  return (
    <Box sx={{ position: "relative", minHeight: "3rem" }}>
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
                  type="alphanumeric"
                />
              )}
              <Button
                variant="outlined"
                onClick={() => {
                  document.cookie = "userID=; path=/;";
                  console.log("Logged out");
                  setIsLoggedIn(false);
                }}
              >
                Logout
              </Button>
            </Stack>
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
        <Box
          width={"100%"}
          sx={{
            display: isLoggedIn ? "none" : "block",
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
      </Fade>
    </Box>
  );
}

export default Header;
