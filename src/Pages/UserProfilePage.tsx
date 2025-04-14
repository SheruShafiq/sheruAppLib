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
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import ErrorIcon from "@mui/icons-material/Error";
import { formatDateRedditStyle } from "../globalFunctions";

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
  const stats = useMemo(
    () => [
      {
        label: "Comments",
        count: userData?.comments?.length,
        icon: <MessageOutlinedIcon color="secondary" />,
      },
      {
        label: "Posts",
        count: userData?.posts?.length,
        icon: <BackupTableIcon color="secondary" />,
      },
      {
        label: "Downvoted Posts",
        count: userData?.downVotedPosts?.length,
        icon: <FavoriteIcon color="secondary" />,
      },
      {
        label: "Upvoted Posts",
        count: userData?.upvotedPosts?.length,
        icon: <HeartBrokenIcon color="secondary" />,
      },
      {
        label: "Liked Comments",
        count: userData?.likedComments?.length,
        icon: <FavoriteIcon color="secondary" />,
      },
      {
        label: "Disliked Comments",
        count: userData?.dislikedComments?.length,
        icon: <HeartBrokenIcon color="secondary" />,
      },
      {
        label: "Reports",
        count: userData?.reportedPosts?.length,
        icon: <ErrorIcon color="secondary" />,
      },
    ],
    [userData]
  );

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
        <Stack direction={"row"} gap={6} alignItems={"center"}>
          <Avatar
            className="userProfileAvatarGIF"
            alt={userData?.displayName}
            src={isLoggedIn ? GIFs[randomGIFIndex] : ""}
            sx={{ width: 200, height: 200 }}
          />

          <Stack>
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              <TextGlitchEffect
                text={userData?.displayName}
                speed={40}
                letterCase="lowercase"
                className="userProfilePageUserName"
                type="alphanumeric"
              />
              <Stack gap={1}>
                <Chip
                  size="small"
                  variant="outlined"
                  label={`Account created: ${formatDateRedditStyle(
                    new Date(userData?.dateCreated)
                  )}`}
                />
                <Chip
                  size="small"
                  variant="outlined"
                  label={`Last online: ${formatDateRedditStyle(
                    new Date(userData?.dateModified)
                  )}`}
                />
              </Stack>
            </Stack>
            <Stack direction={"row"} flexWrap={"wrap"} gap={2}>
              {stats.map((stat) => (
                <Button
                  key={stat.label}
                  variant="outlined"
                  sx={{ pointerEvents: "none" }}
                  startIcon={stat.icon}
                >
                  <TextGlitchEffect
                    text={stat.label}
                    speed={40}
                    letterCase="lowercase"
                    className="userProfilePageUserStats"
                    type="alphanumeric"
                  />
                  <strong> {stat.count}</strong>
                </Button>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
}

export default UserProfilePage;
