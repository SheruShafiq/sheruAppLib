import { useGlitch } from "react-powerglitch";
import { TextGlitchEffect } from "./TextGlitchEffect";
import { Box } from "@mui/material";

const SauceLogo = () => {
  const glitch = useGlitch({
    timing: {
      iterations: 1,
      easing: "ease-in-out",
      duration: 1000,
    },
    glitchTimeSpan: {
      start: 0,
      end: 0.5,
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
        window.location.href = "/";
      }}
      ref={glitch.ref}
    >
      <TextGlitchEffect
        text={"Sauce"}
        speed={100}
        letterCase="lowercase"
        className="neonText HeaderLogo"
        type="alphanumeric"
      />
    </Box>
  );
};

export default SauceLogo;
