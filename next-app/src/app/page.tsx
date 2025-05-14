import { Stack, Button } from "@mui/material";
import Link from "next/link";
import Logo from "@/components/Logo";
import HomeBackgroundScene from "@/components/HomeBackgroundScene";

export default function Home() {
  return (
    <>
      <HomeBackgroundScene />
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
            <Button size="large" variant="outlined">
              Badge Maker
            </Button>
          </Link>

          <Link href="/sauce" passHref>
            <Button size="large" variant="outlined">
              Sauce
            </Button>
          </Link>

          <Link href="/cv" passHref>
            <Button size="large" variant="outlined">
              CV
            </Button>
          </Link>
        </Stack>
      </Stack>
    </>
  );
}
