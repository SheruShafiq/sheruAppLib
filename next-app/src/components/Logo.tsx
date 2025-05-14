'use client';

import { Box } from '@mui/material';
import { useGlitch } from 'react-powerglitch';
import { TextGlitchEffect } from './TextGlitchEffect';
import Link from 'next/link';

interface LogoProps {
  logoName: string;
  URL: string;
  additionalClassName?: string;
}

const Logo = ({ logoName, URL, additionalClassName = "" }: LogoProps) => {
  const glitch = useGlitch({
    timing: {
      iterations: 1,
      easing: "ease-in-out",
      duration: 500,
    },
    glitchTimeSpan: {
      start: 0.1,
      end: 0.9,
    },
    playMode: "hover",
  });

  return (
    <Link href={URL} passHref>
      <Box
        sx={{
          minWidth: "90px",
          justifyItems: "center",
          cursor: "pointer",
          width: "fit-content",
          zIndex: 100,
        }}
        ref={glitch.ref}
      >
        <TextGlitchEffect
          text={logoName}
          speed={100}
          letterCase="lowercase"
          className={`neonText HeaderLogo ${additionalClassName}`}
          type="ALPHA_NUMERIC"
        />
      </Box>
    </Link>
  );
};

export default Logo;
