import React, { useEffect, useState } from "react";
import Post from "../Components/Post";
import { Stack } from "@mui/material";
import { fetchPosts } from "../APICalls";
import { SnackbarProvider, useSnackbar } from "notistack";
import PostPreview from "../Components/PostPreview";
function Home() {
  const [posts, setPosts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    fetchPosts(
      (posts) => {
        setPosts(posts);
      },
      (error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    );
  }, []);

  return (
    <Stack>
      {Object.keys(posts).map((key) => (
        <PostPreview
          title={posts[key].title}
          resource={posts[key].resource}
          description={posts[key].description}
          key={key}
        />
      ))}
    </Stack>
  );
}

export default Home;
