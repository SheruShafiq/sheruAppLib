import { Suspense } from 'react';
import { Stack, Button, Fade } from '@mui/material';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Logo from '@/components/Logo';

// Use dynamic import with SSR disabled for ThreeJS components
const CyberpunkStoreFront = dynamic(
  () => import('@/components/3D/CyberpunkStoreFront'),
  { ssr: false, loading: () => <div>Loading 3D scene...</div> }
);

export default function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {/* Background ModelViewer */}
        <Fade in={true} timeout={3000}>
          <div
            style={{
              position: "absolute",
              transition: "opacity 2s ease-in-out",
              opacity: 1,
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 0,
            }}
          >
            <CyberpunkStoreFront />
          </div>
        </Fade>
      </Suspense>
      {/* Foreground content */}
      <Stack
        minHeight={"100vh"}
        minWidth={"100vw"}
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
        zIndex={2} // Ensure content is above the background
      >
        <Logo
          logoName={"Sheru"}
          URL={"/"}
          additionalClassName={"homePageTitleDrop"}
        />
        <Stack direction={"row"} gap={1}>
          <Link href="/badgeMaker" passHref>
            <Button size="large" variant="outlined">Badge Maker</Button>
          </Link>
          
          <Link href="/sauce" passHref>
            <Button size="large" variant="outlined">Sauce</Button>
          </Link>
          
          <Link href="/cv" passHref>
            <Button size="large" variant="outlined">CV</Button>
          </Link>
        </Stack>
      </Stack>
    </>
  );
}
