import React, { useEffect, useState } from "react";
import { Stack, Box, Divider } from "@mui/material";
import { fetchPosts } from "../APICalls";
import { useSnackbar } from "notistack";
import PostPreview from "../Components/PostPreview";
import Button from "@mui/material/Button";
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
      {isLoggedIn ? (
        <Stack flexDirection={"row"} alignItems={"center"}>
          <Box>{userData?.displayName}</Box>
          <Button
            onClick={() => {
              document.cookie = "userID=; path=/;";
              console.log("Logged out");
              setIsLoggedIn(false);
            }}
          >
            Logout
          </Button>
        </Stack>
      ) : (
        <Button
          onClick={() => {
            setOpen(true);
          }}
          sx={{
            width: "fit-content",
          }}
        >
          Log In
        </Button>
      )}
      <Divider />
      {Object.keys(posts).map((key) => (
        <PostPreview
          isLoggedIn={isLoggedIn} // changed: pass isLoggedIn prop to PostPreview
          fetchPosts={fetchPostsHandeled} // changed: pass function reference instead of invoking it
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
        />
      ))}
    </Stack>
  );
}

export default Home;
