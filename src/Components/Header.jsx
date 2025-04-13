import React from "react";
import { Box, Button, Fade, IconButton, Stack } from "@mui/material";
import { TextGlitchEffect } from "./TextGlitchEffect";
import AddIcon from "@mui/icons-material/Add";
import CreatePostDialogue from "../Components/CreatePostDialogue";
import Logo from "./Logo";

function Header({
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  setIsCreatePostModalOpen,
  categories,
  isOpen,
  onPostCreated,
  callerIdentifier,
}) {
  return (
    <Box px={2} sx={{ position: "relative", minHeight: "3rem" }} mt={0.5}>
      <CreatePostDialogue
        categories={categories}
        isOpen={isOpen}
        setOpen={setIsCreatePostModalOpen}
        onPostCreated={onPostCreated}
        userData={userData}
        callerIdentifier={callerIdentifier}
      />
      <Fade in={isLoggedIn} timeout={1000}>
        <Box sx={{ display: isLoggedIn ? "block" : "none", width: "100%" }}>
          <Stack flexDirection="row" alignItems="center" width="100%">
            <Box flex={1}>
              <Stack flexDirection="row" alignItems="center" gap={2}>
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
                  onClick={() => {
                    document.cookie =
                      "userID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                    setIsLoggedIn(false);
                  }}
                >
                  Logout
                </Button>
              </Stack>
            </Box>
            <Box flex={1} display="flex" justifyContent="center">
              <Logo logoName={"Sauce"} URL={"/"} />
            </Box>
            <Box flex={1} display="flex" justifyContent="flex-end">
              <IconButton
                variant="outlined"
                onClick={() => {
                  setIsCreatePostModalOpen(true);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Stack>
        </Box>
      </Fade>

      <Fade in={!isLoggedIn} timeout={1000}>
        <Box sx={{ width: "100%", display: isLoggedIn ? "none" : "block" }}>
          <Stack flexDirection="row" alignItems="center" width="100%">
            <Box flex={1} display="flex" justifyContent="flex-start">
              <Button
                onClick={() => {
                  setOpen(true);
                }}
                sx={{ width: "fit-content" }}
              >
                Login
              </Button>
            </Box>
            <Box flex={1} display="flex" justifyContent="center">
              <Logo logoName={"Sauce"} URL={"/"} />
            </Box>
            <Box flex={1} display="flex" justifyContent="flex-end">
              <Box
                sx={{
                  minWidth: "90px",
                  display: "none",
                }}
              >
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                  sx={{ width: "fit-content" }}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Fade>
    </Box>
  );
}

export default Header;
