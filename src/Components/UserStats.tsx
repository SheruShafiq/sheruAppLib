import { Stack, Avatar, Chip, Button, Link } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { GIFs } from "../assets/GIFs";
import { formatDateRedditStyle } from "../globalFunctions";
import { TextGlitchEffect } from "./TextGlitchEffect";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import ErrorIcon from "@mui/icons-material/Error";
import { getRandomGIFBasedOffof } from "../APICalls";
function UserStats({ userData, isLoggedIn, randomGIFIndex, pageVariant }) {
  const [profilePicture, setProfilePicture] = React.useState(
    GIFs[randomGIFIndex]
  );
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
  useEffect(() => {
    (async () => {
      const randomPostGIF = await getRandomGIFBasedOffof({
        keyword: userData?.displayName,
      });
      if (randomPostGIF && randomPostGIF !== "") {
        setProfilePicture(randomPostGIF);
      } else {
        setProfilePicture(GIFs[randomGIFIndex]);
      }
    })();
  }, [userData?.displayName]);
  return (
    <Stack
      direction={pageVariant ? "column" : "row"}
      gap={pageVariant ? 0 : 6}
      alignItems={"center"}
      width={pageVariant ? "fit-content" : "100%"}
    >
      {pageVariant ? (
        <Link underline="always" href={`/user/${userData?.id}`}>
          <Avatar
            className="userProfileAvatarGIF"
            alt={userData?.displayName}
            src={profilePicture}
            sx={{ width: 200, height: 200 }}
          />
        </Link>
      ) : (
        <Avatar
          className="userProfileAvatarGIF"
          alt={userData?.displayName}
          src={profilePicture}
          sx={{ width: 200, height: 200 }}
        />
      )}

      <Stack gap={pageVariant ? 2 : 0}>
        <Stack
          direction={pageVariant ? "column" : "row"}
          alignItems={"center"}
          gap={pageVariant ? 0 : 2}
        >
          {pageVariant ? (
            <Link underline="always" href={`/user/${userData?.id}`}>
              <TextGlitchEffect
                text={userData?.displayName}
                speed={40}
                letterCase="lowercase"
                className="userProfilePageUserName"
                type="alphanumeric"
              />
            </Link>
          ) : (
            <TextGlitchEffect
              text={userData?.displayName}
              speed={40}
              letterCase="lowercase"
              className="userProfilePageUserName"
              type="alphanumeric"
            />
          )}
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
        <Stack
          direction={pageVariant ? "column" : "row"}
          flexWrap={"wrap"}
          gap={2}
        >
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
  );
}

export default UserStats;
