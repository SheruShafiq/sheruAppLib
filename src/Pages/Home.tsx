import React, { useEffect, useMemo, useState } from "react";
import { Stack, Divider, IconButton, Button } from "@mui/material";
import { fetchPostsPaginated, getPostByID } from "../APICalls";
import { useSnackbar } from "notistack";
import PostPreview from "../Components/PostPreview";
import Header from "../Components/Header";
import PostPreviewSkeletonLoader from "../SkeletonLoaders/PostPreviewSkeletonLoader";
import Fade from "@mui/material/Fade";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { useParams } from "react-router-dom";
import {
  fetchPostsPaginatedProps,
  Post,
  paginatedPostsMetaDataType,
  Category,
} from "../../dataTypeDefinitions";
import { errorProps } from "../../dataTypeDefinitions";
import Footer from "../Components/Footer";
import IOSSpinner from "../Components/IOSLoader";
import { GIFs } from "../assets/GIFs";

function Home({
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  refreshUserData,
  categories,
}) {
  const { pageNumber } = useParams();
  const currentDisplayHeight = window.innerHeight;
  const headerHeight = 65;
  const postPreviewHeight = 170;
  const pageSize = Math.floor(
    (currentDisplayHeight - headerHeight) / postPreviewHeight
  );
  const [fetchingInitialPosts, setFetchingPosts] = useState(true);
  const [curentPage, setCuurentPage] = useState(
    pageNumber ? Number(pageNumber) : 1
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [metaData, setmetaData] = useState<paginatedPostsMetaDataType | null>(
    null
  );

  const fetchPostsHandeled = (page?: number, pageSize?: number) => {
    setFetchingPosts(true);
    fetchPostsPaginated({
      onSuccess: (data) => {
        setPosts(data?.posts);
        setmetaData({
          first: data?.metadata?.first || "",
          prev: data?.metadata?.prev || "",
          next: data?.metadata?.next || "",
          last: data?.metadata?.last || "",
        });
        setFetchingPosts(false);
      },
      onError: (error: errorProps) => {
        const err: errorProps = {
          id: "fetching Paginated Posts Error",
          userFreindlyMessage: "An error occurred while fetching posts.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
        setFetchingPosts(false);
      },
      page,
      pageSize,
    } as fetchPostsPaginatedProps);
  };

  function refreshPostById(id: string) {
    getPostByID(
      id,
      (post) => {
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.id === post.id ? post : p))
        );
      },
      (error) => {
        const err: errorProps = {
          id: "fetching Post Error",
          userFreindlyMessage: "An error occurred while fetching posts.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
      }
    );
    refreshUserData(userData.id);
  }
  useEffect(() => {
    fetchPostsHandeled(curentPage, pageSize);
  }, [curentPage]);

  const isNoPosts = posts.length === 0;
  const randomGIFIndex = useMemo(
    () => Math.floor(Math.random() * Math.min(GIFs.length, 200)),
    []
  );
  const firstPage = Number(metaData?.first?.match(/_page=(\d+)/)?.[1] || 1);
  const prevPage = metaData?.prev?.match(/_page=(\d+)/)?.[1];
  const nextPage = metaData?.next?.match(/_page=(\d+)/)?.[1];
  const lastPage = Number(metaData?.last?.match(/_page=(\d+)/)?.[1] || 1);
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
            fetchPostsHandeled(curentPage, pageSize);
          }}
        />
        <Divider
          sx={{
            borderColor: "white",
          }}
        />
      </Stack>
      <Button
        onClick={() => {
          setFetchingPosts(!fetchingInitialPosts);
        }}
      >
        Toggle loading
      </Button>
      <Stack px={2} maxWidth={"600px"} alignSelf={"center"} width={"100%"}>
        <Fade in={fetchingInitialPosts} timeout={1000}>
          <Stack
            gap={2}
            width={"100%"}
            display={fetchingInitialPosts ? "flex" : "none"}
          >
            {[...Array(pageSize)].map((_, index) => (
              <PostPreviewSkeletonLoader key={index} pageVariant={false} />
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
            {Object.keys(posts).map((key) => (
              <PostPreview
                randomGIFIndex={randomGIFIndex}
                categories={categories}
                pageVariant={false}
                isPostAuthoredByCurrentUser={userData?.posts
                  ?.map(Number)
                  .includes(Number(posts[key].id))}
                isLoggedIn={isLoggedIn}
                fetchPosts={() => {
                  refreshPostById(posts[key].id);
                }}
                title={posts[key].title}
                resource={posts[key].resource}
                description={posts[key].description}
                upvotes={posts[key].upvotes}
                downvotes={posts[key].downvotes}
                reports={posts[key].reports}
                categoryID={posts[key].categoryID}
                commentsCount={posts[key].comments.length}
                key={key}
                id={posts[key].id}
                dateCreated={posts[key].dateCreated}
                upvotedByCurrentUser={userData?.upvotedPosts
                  ?.map(String)
                  .includes(String(posts[key].id))}
                downvotedByCurrentUser={userData?.downVotedPosts
                  ?.map(String)
                  .includes(String(posts[key].id))}
                reportedByCurrentUser={userData?.reportedPosts
                  ?.map(String)
                  .includes(String(posts[key].id))}
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
      <Stack
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={2}
        flexDirection={"row"}
      >
        <Stack flexDirection={"row"}>
          <IconButton
            onClick={() => {
              setCuurentPage(firstPage);
              window.history.pushState(null, "", `/${firstPage}`);
            }}
            disabled={curentPage === firstPage || fetchingInitialPosts}
          >
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setCuurentPage(prevPage ? Number(prevPage) : curentPage);
              window.history.pushState(null, "", `/${prevPage}`);
            }}
            disabled={curentPage === firstPage || fetchingInitialPosts}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        </Stack>
        <Stack flexDirection={"row"}>
          <IconButton
            onClick={() => {
              setCuurentPage(nextPage ? Number(nextPage) : curentPage);
              window.history.pushState(null, "", `/${nextPage}`);
            }}
            disabled={fetchingInitialPosts || curentPage === lastPage}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setCuurentPage(lastPage);
              window.history.pushState(null, "", `/${lastPage}`);
            }}
            disabled={fetchingInitialPosts || curentPage === lastPage}
          >
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
}

export default Home;
