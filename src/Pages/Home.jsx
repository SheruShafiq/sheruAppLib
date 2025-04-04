import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { fetchPosts } from "../APICalls";
import { useSnackbar } from "notistack";
import PostPreview from "../Components/PostPreview";
function Home({ isLoggedIn }) {
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
    <Stack>
      {Object.keys(posts).map((key) => (
        <PostPreview
          isLoggedIn={isLoggedIn} // changed: pass isLoggedIn prop to PostPreview
          fetchPosts={fetchPostsHandeled} // changed: pass function reference instead of invoking it
          title={posts[key].title}
          resource={posts[key].resource}
          description={posts[key].description}
          upvotes={posts[key].upvotes}
          downvotes={posts[key].downvotes}
          offlineReports={posts[key].offlineReports}
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
