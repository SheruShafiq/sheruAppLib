'use client';

import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Fade, IconButton, Stack, Menu, MenuItem } from "@mui/material";
import { TextGlitchEffect } from "./TextGlitchEffect";
import AddIcon from "@mui/icons-material/Add";
import Logo from "./Logo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import { usePWAInstallPrompt } from "../hooks/usePWAInstallPrompt";
import Link from 'next/link';
import { useAuth } from "./AuthProvider";

interface HeaderProps {
  isLoggedIn: boolean;
  userData: any;
  setOpen: (open: boolean) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  categories: any[];
  onPostCreated?: (id?: string) => void;
  callerIdentifier?: string;
}

function Header({
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  categories,
  onPostCreated,
  callerIdentifier,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const { deferredPrompt, promptInstall } = usePWAInstallPrompt();
  
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Here we would fetch profile pictures and handle other effects
  useEffect(() => {
    // Placeholder - would normally fetch profile pics
    setProfilePicture("/placeholder.jpg");
  }, [userData?.displayName]);

  return (
    <Box px={2} sx={{ position: "relative", minHeight: "3rem" }} mt={0.5}>
      {/* Create Post Dialog would go here */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiMenu-list": {
            backgroundColor: "black",
            borderRadius: "6px",
            border: "1px solid rgba(211, 211, 211, 0.46)",
          },
        }}
      >
        {isLoggedIn ? (
          <Stack px={1} width={"200px"} gap={2}>
            <MenuItem
              sx={{
                borderRadius: "4px",
              }}
              onClick={() => {
                setAnchorEl(null);
                // We'll use Link for navigation in Next.js
              }}
            >
              <Stack direction={"row"} gap={1} alignItems={"center"}>
                <Avatar
                  className="userProfileAvatarGIF"
                  alt={userData?.displayName}
                  src={isLoggedIn ? profilePicture : ""}
                  sx={{ width: 40, height: 40 }}
                />
                <Stack>
                  <TextGlitchEffect
                    text={userData?.displayName || "User"}
                    speed={40}
                    letterCase="lowercase"
                    className="loggedInUserName"
                    type="ALPHA_NUMERIC"
                  />
                  View profile
                </Stack>
              </Stack>
            </MenuItem>
            <MenuItem
              sx={{
                borderRadius: "4px",
              }}
              onClick={() => {
                document.cookie =
                  "userID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                setIsLoggedIn(false);
                setAnchorEl(null);
              }}
            >
              <LogoutIcon />
              Logout
            </MenuItem>
          </Stack>
        ) : (
          <Stack px={1} width={"200px"} gap={2}>
            <MenuItem
              sx={{
                borderRadius: "4px",
              }}
              onClick={() => {
                setOpen(true);
                setAnchorEl(null);
              }}
            >
              Login
            </MenuItem>
          </Stack>
        )}
      </Menu>
      <Stack flexDirection="row" alignItems="center" width="100%">
        <Box display={"flex"} flex={1}>
          <Stack flexDirection="row" alignItems="center" gap={2}>
            <Stack direction={"row"} gap={1} alignItems={"center"}>
              <Avatar
                className="userProfileAvatarGIF"
                alt={userData?.displayName}
                src={isLoggedIn ? profilePicture : ""}
                sx={{ width: 40, height: 40 }}
              />
              <IconButton
                onClick={handleClick}
                className="userProfileAvatar"
                sx={{
                  position: "relative",
                  right: "28px",
                  top: "12px",
                }}
              >
                <KeyboardArrowDownIcon
                  sx={{
                    backgroundColor: "black",
                    borderRadius: "100%",
                  }}
                />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        <Box flex={1} display="flex" justifyContent="center">
          <Logo logoName={"Sauce"} URL={"/sauce"} />
        </Box>

        {deferredPrompt ? (
          <Button
            sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
            variant="contained"
            onClick={promptInstall}
          >
            Install App
          </Button>
        ) : null}
        
        <Box flex={1} display="flex" justifyContent="flex-end">
          <Fade in={isLoggedIn}>
            <Stack direction={"row"}>
              <IconButton
                onClick={() => {
                  setIsCreatePostModalOpen(true);
                }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          </Fade>
        </Box>
      </Stack>
    </Box>
  );
}

export default Header;
