import React, { useRef, useState, useLayoutEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Minara from "../assets/Minara.png";
import Flower from "../assets/bgFlower.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AhmadiyyaFlag from "../assets/ahmadiyyaFlag.png";

export type badgeProps = {
  role: string;
  name: string;
  preview?: boolean;
};

function TwentyFive({ role, name, preview }: badgeProps) {
  const roleRef = useRef<HTMLDivElement>(null);
  const [roleFontSize, setRoleFontSize] = useState(40);
  const nameRef = useRef<HTMLDivElement>(null);
  const [nameFontSize, setNameFontSize] = useState(24);

  // define bounds
  const ROLE_MIN = 12,
    ROLE_MAX = 40;
  const NAME_MIN = 12,
    NAME_MAX = 24;

  // adjust role size to fit container (shrink + grow)
  useLayoutEffect(() => {
    if (!roleRef.current) return;
    const parentW = roleRef.current.parentElement?.clientWidth || 0;
    let size = Math.min(Math.max(roleFontSize, ROLE_MIN), ROLE_MAX);
    roleRef.current.style.fontSize = `${size}px`;
    let w = roleRef.current.scrollWidth;

    // shrink if overflow
    while (w > parentW && size > ROLE_MIN) {
      size--;
      roleRef.current.style.fontSize = `${size}px`;
      w = roleRef.current.scrollWidth;
    }
    // grow if space available
    while (w < parentW && size < ROLE_MAX) {
      const next = size + 1;
      roleRef.current.style.fontSize = `${next}px`;
      const nextW = roleRef.current.scrollWidth;
      if (nextW <= parentW) {
        size = next;
        w = nextW;
      } else break;
    }
    setRoleFontSize(size);
  }, [role, roleFontSize]);

  // adjust name size to fit container (shrink + grow)
  useLayoutEffect(() => {
    if (!nameRef.current) return;
    const parentW = nameRef.current.parentElement?.clientWidth || 0;
    let size = Math.min(Math.max(nameFontSize, NAME_MIN), NAME_MAX);
    nameRef.current.style.fontSize = `${size}px`;
    let w = nameRef.current.scrollWidth;

    while (w > parentW && size > NAME_MIN) {
      size--;
      nameRef.current.style.fontSize = `${size}px`;
      w = nameRef.current.scrollWidth;
    }
    while (w < parentW && size < NAME_MAX) {
      const next = size + 1;
      nameRef.current.style.fontSize = `${next}px`;
      const nextW = nameRef.current.scrollWidth;
      if (nextW <= parentW) {
        size = next;
        w = nextW;
      } else break;
    }
    setNameFontSize(size);
  }, [name, nameFontSize]);

  return (
    <Stack
      // maxWidth={"660px"}
      mx={"auto"}
      width={"660px"}
      height={"350px"}
      bgcolor={"white"}
    >
      <Stack
        sx={{
          background: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${Minara}), url(${Flower})`,
          backgroundSize: "560px 500px ,110px 200px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50% -50%, 105% 90px",
        }}
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Stack
          direction={"row"}
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          <Box sx={{ width: "150px", height: "75px", backgroundColor: "red" }}>
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              src={AhmadiyyaFlag}
            />
          </Box>
          <Stack px={2} mt={1} alignItems={"center"}>
            <Typography color={"#AF1623"}>
              Ahmadiyya Moslim Gemeenschap
            </Typography>
            <Typography
              sx={{
                borderBottom: "2px solid #AF1623",
                lineHeight: "40px",
                mt: "6px",
              }}
              fontWeight={500}
              color="black"
              fontSize={"3rem"}
            >
              JALSA SALANA
            </Typography>
            <Typography mt={1} fontWeight={200} color="black" fontSize={"1em"}>
              43
              <sup style={{ fontSize: "9px", verticalAlign: "super" }}>
                ste
              </sup>{" "}
              JAARLIJKSE BIJEENKOMST
            </Typography>
          </Stack>

          <Stack width={150} height={75}>
            <Box width={"100%"} height={"100%"} bgcolor={"#AF1623"}></Box>
            <Box bgcolor={"#FFFF"} width={"100%"} height={"100%"}></Box>
            <Box bgcolor={"#1B448C"} width={"100%"} height={"100%"}></Box>
          </Stack>
        </Stack>
        <Stack
          gap={2}
          width={"100%"}
          height={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box py={2} bgcolor={"#fddfe094"} width={"100%"} overflow={"hidden"}>
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
          <Box width="100%" overflow="hidden">
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
        <Stack
          boxSizing={"border-box"}
          pb={0.5}
          px={1}
          direction={"row"}
          justifyContent={"space-between"}
          width={"100%"}
          alignItems={"center"}
        >
          <Typography
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            color="black"
          >
            <CalendarMonthIcon
              sx={{
                pb: 0.2,
              }}
              fontSize="small"
            />
            2,3,4 Mei 2025
          </Typography>
          <Typography
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            color="black"
          >
            <LocationOnIcon
              sx={{
                pb: 0.2,
              }}
              fontSize="small"
            />{" "}
            't Frusselt 30, 8076 RE Vierhouten, Nederland
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default TwentyFive;
