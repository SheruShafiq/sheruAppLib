import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Stack, Divider, Avatar, Button, Chip } from "@mui/material";
import { fetchUserById } from "../APICalls";
import { GIFs } from "../assets/GIFs";
import { TextGlitchEffect } from "../Components/TextGlitchEffect";
import { errorProps, Comment, User } from "../../dataTypeDefinitions";
import { enqueueSnackbar } from "notistack";

import { formatDateRedditStyle } from "../globalFunctions";
import UserStats from "../Components/UserStats";

function UserProfilePage({
  isLoggedIn,
  loggedInUserData,
  setOpen,
  setIsLoggedIn,
  categories,
}) {
  const { id } = useParams();
  const [userData, setUserData] = useState<User>(
    isLoggedIn ? {} : loggedInUserData
  );
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchUserById(
      id,
      (userData) => {
        setUserData(userData);
      },
      (error: any) => {
        const err: errorProps = {
          id: "fetching user data Error",
          userFreindlyMessage: "An error occurred while fetching user data.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
      }
    );
  }, []);
  const randomGIFIndex = useMemo(
    () => Math.floor(Math.random() * Math.min(GIFs.length, 200)),
    []
  );

  // New: useMemo to consolidate stats data

  return (
    <Stack height={"100%"} minHeight={"100vh"} gap={2} pb={2}>
      <Stack>
        <Header
          callerIdentifier={"homePage"}
          isLoggedIn={isLoggedIn}
          userData={userData}
          setIsLoggedIn={setIsLoggedIn}
          categories={categories}
          setOpen={setOpen}
          onPostCreated={() => {
            window.history.pushState(null, "", `/`);
          }}
        />
        <Divider
          sx={{
            borderColor: "white",
          }}
        />
      </Stack>
      <Stack px={2}>
        <UserStats
          userData={userData}
          isLoggedIn={isLoggedIn}
          randomGIFIndex={randomGIFIndex}
          pageVariant={false}
        />
      </Stack>
      <Footer />
    </Stack>
  );
}

export default UserProfilePage;
