import { useGlitch } from "react-powerglitch";
import { TextGlitchEffect } from "./TextGlitchEffect";
import { Box } from "@mui/material";

const Logo = ({ logoName, URL }) => {
  const glitch = useGlitch({
    timing: {
      iterations: 1,
      easing: "ease-in-out",
      duration: 500,
    },
    glitchTimeSpan: {
      start: 0,
      end: 0.3,
    },
    playMode: "hover",
  });

  return (
    <Box
      sx={{
        minWidth: "90px",
        justifyItems: "center",
        cursor: "pointer",
      }}
      onClick={() => {
        window.location.href = URL;
      }}
      ref={glitch.ref}
    >
      <TextGlitchEffect
        text={logoName}
        speed={100}
        letterCase="lowercase"
        className="neonText HeaderLogo"
        type="alphanumeric"
      />
    </Box>
  );
};

export default Logo;
