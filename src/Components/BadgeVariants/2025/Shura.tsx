import React, { useRef, useState, useLayoutEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Minara from "../../../assets/Minara.png";
import Flower from "../../../assets/bgFlower.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AhmadiyyaFlag from "../../../assets/ahmadiyyaFlag.png";
import useDynamicFont from "../../../hooks/useDynamicFontSize";
export type badgeProps = {
  role: string;
  name: string;
  preview?: boolean;
};


const ROLE_MIN = 12;
const ROLE_MAX = 70;
const NAME_MIN = 12;
const NAME_MAX = 30;

function Shura({ role, name, preview }: badgeProps) {
  const roleRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  const roleFontSize = useDynamicFont(roleRef, [role], ROLE_MIN, ROLE_MAX);
  const nameFontSize = useDynamicFont(nameRef, [name], NAME_MIN, NAME_MAX);

  return (
    <Stack mx="auto" width="660px" height="350px" bgcolor="white">
      <Stack
        sx={{
          backgroundSize: "560px 500px, 110px 200px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50% -50%, 105% 90px",
        }}
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
       
        <Stack
          direction="row"
          width="100%"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box sx={{ width: "150px", height: "75px", backgroundColor: "red" }}>
            <img
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              src={AhmadiyyaFlag}
              alt="Ahmadiyya flag"
            />
          </Box>
          <Stack px={2} mt={1} alignItems="center">
            <Typography color="#AF1623">
              Ahmadiyya Moslim Gemeenschap
            </Typography>
            <Typography
              sx={{
                borderBottom: "2px solid #AF1623",
                lineHeight: "40px",
                mt: "6px",
                pb: "4px",
              }}
              fontWeight={500}
              color="black"
              fontSize="3rem"
            >
              Majlis-e-Shura
            </Typography>
            <Typography
              sx={{
                textShadow: "0 0 8px rgb(0, 0, 0), 0 0 16px rgb(0, 0, 0)",
                fontWeight: 700,
              }}
              mt={1}
              fontWeight={200}
              color="white"
              fontSize="3em"
              lineHeight={1}
            >
              2025
            </Typography>
          </Stack>
          <Stack width={150} height={75}>
            <Box width="100%" height="100%" bgcolor="#AF1623" />
            <Box width="100%" height="100%" bgcolor="#FFFF" />
            <Box width="100%" height="100%" bgcolor="#1B448C" />
          </Stack>
        </Stack>

       
        <Stack
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            
            py={2}
            
            width="100%"
            overflow="hidden"
          >
            <Typography
              ref={roleRef}
              sx={{
                whiteSpace: "nowrap",
                fontWeight: 500,
                color: "black",
                fontSize: `${roleFontSize}px`,
                textAlign: "center",
              }}
            >
              {role}
            </Typography>
          </Box>
          <Box
            justifyContent="center"
            alignContent={"center"}
            height={"50%"}
            width="100%"
            overflow="hidden"
            
          >
            <Typography
              ref={nameRef}
              sx={{
                whiteSpace: "nowrap",
                fontWeight: 500,
                color: "black",
                fontSize: `${nameFontSize}px`,
                textAlign: "center",
              }}
            >
              {name}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Shura;
