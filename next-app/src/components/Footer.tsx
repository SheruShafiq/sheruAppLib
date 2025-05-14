'use client';

import { Avatar, Stack, Typography, Box } from "@mui/material";
import React from "react";
import Link from "next/link";
import { useGlitch } from "react-powerglitch";
import { TextGlitchEffect } from "./TextGlitchEffect";

function Footer() {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      py={2}
      px={2}
      mt="auto"
      borderTop={"1px solid rgba(211, 211, 211, 0.46)"}
    >
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <Typography fontSize={12} color={"gray"}>
          © {new Date().getFullYear()} Sheru
        </Typography>
      </Stack>
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <Typography fontSize={12} color={"gray"}>
          Built with Next.js
        </Typography>
      </Stack>
    </Stack>
  );
}

export default Footer;
