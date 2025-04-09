import React, { useEffect, useState } from "react";
import { Stack, Divider } from "@mui/material";
import { fetchPosts } from "../APICalls";
import { useSnackbar } from "notistack";
import PostPreview from "../Components/PostPreview";
import Header from "../Components/Header";
import CreatePostDialogue from "../Components/CreatePostDialogue";
import PostPreviewSkeletonLoader from "../SkeletonLoaders/PostPreviewSkeletonLoader";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";

function Home({ isLoggedIn, userData, setOpen, setIsLoggedIn }) {
  const [fetchingInitialPosts, setFetchingPosts] = useState(true);
  const [posts, setPosts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const fetchPostsHandeled = () => {
    fetchPosts(
      (posts) => {
        setPosts(posts);
        setFetchingPosts(false);
      },
      (error) => {
        enqueueSnackbar(error.message, { variant: "error" });
        setFetchingPosts(false);
      }
    );
  };
  useEffect(() => {
    fetchPostsHandeled();
  }, []);

  const currentDisplayHeight = window.innerHeight;
  const headerHeight = 65;
  const postPreviewHeight = 225;
  const safeExtraHeight = 50;
  const maxPostPreviews = Math.floor(
    (currentDisplayHeight - headerHeight - safeExtraHeight) / postPreviewHeight
  );
  const isNoPosts = posts.length === 0;
  return (
    <Stack gap={2} px={2} py={2}>
      <Stack mt={0.5}>
        <Header
          isLoggedIn={isLoggedIn}
          userData={userData}
          setOpen={setOpen}
          setIsLoggedIn={setIsLoggedIn}
          setIsCreatePostModalOpen={setIsCreatePostModalOpen}
        />
        <Divider
          sx={{
            borderColor: "white",
          }}
        />
      </Stack>
      <CreatePostDialogue
        isOpen={isCreatePostModalOpen}
        setOpen={setIsCreatePostModalOpen}
        onPostCreated={fetchPostsHandeled}
        userData={userData}
      />
      <Stack maxWidth={"600px"} alignSelf={"center"} width={"100%"}>
        <Fade in={fetchingInitialPosts} timeout={1000}>
          <Stack
            gap={2}
            width={"100%"}
            display={fetchingInitialPosts ? "flex" : "none"}
          >
            {[...Array(maxPostPreviews)].map((_, index) => (
              <PostPreviewSkeletonLoader key={index} />
            ))}
          </Stack>
        </Fade>
        <Fade in={!fetchingInitialPosts} timeout={1000}>
          <Stack
            gap={2}
            sx={{
              display: fetchingInitialPosts ? "none" : "flex",
            }}
          >
            {Object.keys(posts)
              .reverse()
              .map((key) => (
                <PostPreview
                  isPostAuthoredByCurrentUser={userData?.posts
                    ?.map(Number)
                    .includes(Number(posts[key].id))}
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
                  upvotedByCurrentUser={userData?.likedPosts
                    ?.map(Number)
                    .includes(Number(posts[key].id))}
                  downvotedByCurrentUser={userData?.dislikedPosts
                    ?.map(Number)
                    .includes(Number(posts[key].id))}
                  reportedByCurrentUser={userData?.reportedPosts
                    ?.map(Number)
                    .includes(Number(posts[key].id))}
                  userData={userData}
                />
              ))}
          </Stack>
        </Fade>
        {isNoPosts && !fetchingInitialPosts && (
          <Stack
            width={"100%"}
            height={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          >
            <h2>No posts available</h2>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default Home;
