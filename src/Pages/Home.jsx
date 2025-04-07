import React, { useEffect, useState } from "react";
import { Stack, Divider } from "@mui/material";
import { fetchPosts } from "../APICalls";
import { useSnackbar } from "notistack";
import PostPreview from "../Components/PostPreview";
import Header from "../Components/Header";

function Home({ isLoggedIn, userData, setOpen, setIsLoggedIn }) {
  const [posts, setPosts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchPostsHandeled = () => {
    fetchPosts(
      (posts) => {
        setPosts(posts);
      },
      (error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    );
  };
  useEffect(() => {
    fetchPostsHandeled();
  }, []);

  return (
    <Stack gap={2}>
      <Stack>
        <Header
          isLoggedIn={isLoggedIn}
          userData={userData}
          setOpen={setOpen}
          setIsLoggedIn={setIsLoggedIn}
        />
        <Divider />
      </Stack>
      <Stack gap={2}>
        {Object.keys(posts).map((key) => (
          <PostPreview
            isLoggedIn={isLoggedIn}
            fetchPosts={fetchPostsHandeled}
            title={posts[key].title}
            resource={posts[key].resource}
            description={posts[key].description}
            upvotes={posts[key].upvotes}
            downvotes={posts[key].downvotes}
            reports={posts[key].reports}
            category={posts[key].category}
            commentsCount={posts[key].comments.length}
            key={key}
            id={posts[key].id}
            deteCreated={posts[key].dateCreated}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default Home;
