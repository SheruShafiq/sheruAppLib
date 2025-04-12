import React from "react";
import { Box, Button, Fade, IconButton, Stack } from "@mui/material";
import { TextGlitchEffect } from "./TextGlitchEffect";
import AddIcon from "@mui/icons-material/Add";
import CreatePostDialogue from "../Components/CreatePostDialogue";
import SauceLogo from "./SauceLogo";

function Header({
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  setIsCreatePostModalOpen,
  categories,
  isOpen,
  onPostCreated,
}) {
  return (
    <Box sx={{ position: "relative", minHeight: "3rem" }} mt={0.5}>
      <CreatePostDialogue
        categories={categories}
        isOpen={isOpen}
        setOpen={setIsCreatePostModalOpen}
        onPostCreated={onPostCreated}
        userData={userData}
      />
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
                  document.cookie =
                    "userID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
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
