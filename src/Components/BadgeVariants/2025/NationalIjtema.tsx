import { useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import useDynamicFont from "@hooks/useDynamicFontSize";
import { badgeProps } from "./index";

const ROLE_MIN = 12;
const ROLE_MAX = 75;
const NAME_MIN = 12;
const NAME_MAX = 50;
const preloadFlag = new Image();
preloadFlag.crossOrigin = "anonymous";
function NationalIjtema({ role, name, preview }: badgeProps) {
  const roleRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const roleFontSize = useDynamicFont(roleRef, [role], ROLE_MIN, ROLE_MAX);
  const nameFontSize = useDynamicFont(nameRef, [name], NAME_MIN, NAME_MAX);
  return (
    <Stack mx="auto" width="650px" height="440px" bgcolor="white">
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
            background: 'linear-gradient(90deg,rgba(215, 192, 93, 1) 0%, rgba(176, 113, 25, 1) 66%)',
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
            <Typography mt={1} fontWeight={400} color="#ffcc00ff" fontSize="14px">
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
          sx={{
            backgroundImage: `url(/ijtema/backdrop.webp)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "650px 350px",
          }}
        >
          <Box  width="100%" overflow="hidden">
            <Typography
              ref={roleRef}
              sx={{
                fontFamily: 'math !important',
                whiteSpace: "nowrap",
                fontWeight: 500,
                color: "white",
                fontSize: `${roleFontSize}px`,
                textAlign: "center",
                pt: '40px'
              }}
            >
              {role}
            </Typography>
          </Box>
          <Box width="100%" overflow="hidden">
            <Typography
              ref={nameRef}
              sx={{
                fontFamily: 'math !important',
                whiteSpace: "nowrap",
                fontWeight: 500,
                color: "#ffd500",
                fontSize: `${nameFontSize}px`,
                textAlign: "center",
              }}
            >
              {name}
            </Typography>
          </Box>
          <Stack
            boxSizing="border-box"
            pb={0.5}
            px={1}
            justifyContent="space-between"
            width="40%"
            alignItems="center"
           mt={'auto'}
           minHeight="40px"
           sx={{ background: 'linear-gradient(90deg,rgba(171, 116, 42, 1) 0%, rgba(171, 116, 42, 1) 0%, rgba(215, 192, 93, 1) 100%, rgba(237, 221, 83, 1) 100%)',
              borderTopRightRadius: '16px',
              borderTopLeftRadius: '16px',
            }}
          >
            <Typography sx={{
              fontFamily: 'math !important',
              fontWeight: 900,
              color: "white",
              fontSize: "2rem",
              textAlign: "center",
            }}>
              ہمارا عہد
            </Typography>
            <Typography sx={{
              fontFamily: 'serif !important',
              fontWeight: 1000,
              color: "black",
              fontSize: "1.5rem",
              textAlign: "center",
              letterSpacing: '4px',
            }}>
              ONZE GELOFTE
            </Typography>
           
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default NationalIjtema;
