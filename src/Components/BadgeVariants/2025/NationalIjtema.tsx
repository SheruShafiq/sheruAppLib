import  { useRef} from "react";
import { Box, Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import useDynamicFont from "@hooks/useDynamicFontSize";
import { badgeProps } from "./index";

const ROLE_MIN = 12;
const ROLE_MAX = 70;
const NAME_MIN = 12;
const NAME_MAX = 30;
const preloadFlag = new Image();
preloadFlag.crossOrigin = "anonymous";
function NationalIjtema({ role, name, preview }: badgeProps) {
  const roleRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const roleFontSize = useDynamicFont(roleRef, [role], ROLE_MIN, ROLE_MAX);
  const nameFontSize = useDynamicFont(nameRef, [name], NAME_MIN, NAME_MAX);
  return (
    <Stack mx="auto" width="660px" height="350px" bgcolor="white">
      <Stack
        sx={{
          background: `linear-gradient( rgba(255,255,255,0.8)), url(/ijtema/width_2400.webp})`,
          backgroundSize: "560px 500px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: " 100% 90px",
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
          sx={{
            backgroundColor: "#aa8b0e",
            alignItems: "center",
            py: 1,
          }}
        >
          <Box sx={{ width: "150px", height: "75px", }}>
            <img
              crossOrigin="anonymous"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              src={'/ijtema/ahmadiyyaNLlogo.webp'}
              alt="Ahmadiyya flag"
              loading="eager"
              decoding="sync"
            />
          </Box>
          <Stack px={1} mt={1} alignItems="center">
           
            <Typography
              sx={{
                lineHeight: "40px",
                mt: "6px",
              }}
              fontStyle={"italic"}
              fontWeight={800}
              color="black"
              fontSize="3rem"
            >
              40e Nationale Ijtema
            </Typography>
            <Typography mt={1} fontWeight={400} color="#D8B00C" fontSize="14px">
             11, 12, 13 July 2025 Paasheuvel, Vierhouten
            </Typography>
          </Stack>
          <Box sx={{ width: "150px", height: "65px", mt: 1 }}>
            <img
              crossOrigin="anonymous"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              src={'/ijtema/IjtemaLogo.png'}
              alt="Ijtema logo"
              loading="eager"
              decoding="sync"
            />
          </Box>
        </Stack>
        <Stack
          gap={2}
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Box py={2} bgcolor="#fddfe094" width="100%" overflow="hidden">
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
          boxSizing="border-box"
          pb={0.5}
          px={1}
          direction="row"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        >
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="black"
          >
            <CalendarMonthIcon sx={{ pb: 0.2 }} fontSize="small" /> 2,3,4 Mei
            2025
          </Typography>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="black"
          >
            <LocationOnIcon sx={{ pb: 0.2 }} fontSize="small" /> 't Frusselt 30,
            8076 RE Vierhouten, Nederland
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default NationalIjtema;
