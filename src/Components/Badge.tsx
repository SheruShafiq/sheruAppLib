import { Box, Stack, Typography } from "@mui/material";
import Flower from "../assets/bgFlower.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AhmadiyyaFlag from "../assets/ahmadiyyaFlag.png";
import React from "react";

export type badgeProps = {
  role: string;
  name: string;
  preview?: boolean;
};

function TwentyFive({ role, name, preview }: badgeProps) {
  return (
    <Stack width={620} height={350} bgcolor={"white"}>
      <Stack
        sx={{
          background: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${Flower})`,
          backgroundSize: "600px 600px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0px 30px",
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
          <Stack mt={1} alignItems={"center"}>
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
          <Box
            py={2}
            bgcolor={"#fddfe094"}
            width={"100%"}
            justifyItems={"center"}
          >
            <Typography fontWeight={500} color="black" fontSize={"5rem"}>
              {role}
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight={500} color="black" fontSize={"3rem"}>
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
            />{" "}
            Mei 2,3,4 2025
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
